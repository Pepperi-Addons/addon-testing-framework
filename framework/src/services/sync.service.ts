import { EventResult } from "src/event-result";
import { BaseService } from "./base-service";
import { EventsService } from "./events.service";


export interface SyncResult
{
	success: boolean;
    finish: boolean;
}


export class SyncService  extends BaseService
{
    protected readonly AddonUUID = "d541b959-87af-4d18-9215-1b30dbe1bcf4";
	/**
	 * Emits a request to perform a sync operation.
	 * @param {boolean} allowContinueInBackground - A flag indicating whether the sync operation can continue in the background. Default is false. 
	 * @param {boolean} abortExisting - A flag indicating whether to abort an existing sync operation. Default is false.
	 * @returns {Promise<SyncResult>} A promise that resolves to SyncResult object with the sync result.
	 */
	public async sync(allowContinueInBackground: boolean = false, abortExisting: boolean = false): Promise<SyncResult>
	{
		const eventService = this.container.get(EventsService);
		const cpiService = await eventService.cpiSessionService.createSession();

		const syncRequestBody = {
			AllowContinueInBackground: allowContinueInBackground,
			AbortExisting: abortExisting
		};
		
		const addonApiResult = await cpiService.addonAPI(this.AddonUUID, '/Sync', syncRequestBody);

		// Parse the result
		const syncResult: SyncResult = addonApiResult.SyncResult ? JSON.parse(addonApiResult.SyncResult) : {success: false, finish: false};

		return syncResult;
	}
}
