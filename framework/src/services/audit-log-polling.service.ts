import { AddonAPIAsyncResult, AuditLog, PapiClient } from '@pepperi-addons/papi-sdk';
import { performance } from 'perf_hooks';
import { BaseService } from './base-service';
import { ServicesContainer } from './services-container';

export class AuditLogPollingService extends BaseService {
    private aborted = false;
    private timeoutTimer: ReturnType<typeof setTimeout> | undefined = undefined;
    private papiClient: PapiClient;

    constructor(container: ServicesContainer) {
        super(container);
        this.papiClient = new PapiClient({
            baseURL: container.client.BaseURL,
            token: container.client.OAuthAccessToken,
            addonUUID: container.client.AddonUUID,
            addonSecretKey: container.client.AddonSecretKey,
            actionUUID: container.client.ActionUUID
        });
    }

    private setTimeout(timeout: number): void {
        this.clearTimeout();
        this.timeoutTimer = setTimeout(() => {
            this.abort();
        }, timeout);
    }

    private clearTimeout(): void {
        if (this.timeoutTimer !== undefined) {
            clearTimeout(this.timeoutTimer);
        }
    }

    public abort(): void {
        this.aborted = true;
    }

    private abortIfNeeded(): void {
        if (this.aborted === true) {
            throw new Error('AuditLogPollingService: polling was timed out');
        }
    }

    /**
     * Poll an async call response.
     * @param addonApiAsyncResult The async call to poll from.
     * @param sleepDuration How many ms to wait between status checks.
     * @returns the audit log response.
     */
    public async poll(addonApiAsyncResult: AddonAPIAsyncResult, timeout = 60000, sleepDuration = 10000): Promise<AuditLog> {
        let auditRes: AuditLog;

        console.log(
            `AuditLogPollingService: polling action '${addonApiAsyncResult.ExecutionUUID}' every ${
                sleepDuration / 1000
            }s for ${timeout / 1000}s`,
        );
        this.setTimeout(timeout);

        try {
            const actionStartTime = performance.now();
            auditRes = await this.pollAuditLog(addonApiAsyncResult.URI as string, sleepDuration);
            const actionEndTime = performance.now();
            const millisecondsTook = actionEndTime - actionStartTime;
            console.log(`IntervalRunnerService: Polling took ${(millisecondsTook / 1000).toFixed(2)}s.`);
        } finally {
            this.clearTimeout();
        }

        return auditRes;
    }

    private async pollAuditLog(URI: string, sleepDuration: number): Promise<AuditLog> {
        let statusID: number | undefined;
        let statusName: string | undefined;
        let auditRes: AuditLog;

        do {
            this.abortIfNeeded();
            auditRes = await this.papiClient.get(URI);
            statusID = auditRes?.Status?.ID;
            statusName = auditRes?.Status?.Name;

            const statusMsg = `AuditLogPollingService: status: ${statusID} | ${statusName}`;
            console.log(statusMsg);

            switch (statusID) {
                case 0: // Failed.
                    const errorMessage = auditRes.AuditInfo?.ErrorMessage || 'No error message provided';
                    console.log(`AuditLogPollingService: Execution failed, error: ${errorMessage}`);
                    throw new Error(`${errorMessage} | (Status: ${statusName}, ID: ${statusID})`);
                case 1: // Success.
                    console.log('AuditLogPollingService: Execution success');
                    return auditRes;
                case 2: // In progress.
                case 4: // In retry.
                case 5: // Starting.
                    // Wait before the next polling attempt.
                    await new Promise((resolve) => setTimeout(resolve, sleepDuration));
                    break;
                default:
                    throw new Error(`AuditLogPollingService: Unknown status, ID: ${statusID}`);
            }
        } while (true);
    }
}
