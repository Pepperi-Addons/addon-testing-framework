import { eachLimit as AsyncEachLimit } from 'async';
import { AddonDataScheme, PapiClient } from '@pepperi-addons/papi-sdk';
import { AdalTableResource } from './adal-table.resource';
import { BaseService } from '../base-service';
import { ServicesContainer } from '../services-container';
import { AddonTestsService } from '../tests.service';
import { IManageableResource } from './i-manageable.resource';

/**
 * Takes care of creating and cleaning up resources.
 */
export class ResourceManagerService extends BaseService {
    private activeResources: IManageableResource[];
    protected papiClient: PapiClient;

    private readonly _shouldCache = true;

    constructor(container: ServicesContainer) {
        super(container);
        this.papiClient = new PapiClient({
            baseURL: container.client.BaseURL,
            token: container.client.OAuthAccessToken,
            addonUUID: container.client.AddonUUID,
            addonSecretKey: container.client.AddonSecretKey,
            actionUUID: container.client.ActionUUID
        });
        this.activeResources = [];
    }

    async createAdalTable(schema: AddonDataScheme, removeCallback?: () => Promise<void>): Promise<AdalTableResource> {
        const tableService: AdalTableResource = new AdalTableResource(this.container.client, schema, removeCallback);

        try {
            await tableService.upsert();
            this.activeResources.push(tableService);
        } catch (error) {
            console.error(`ResourceManagerService: failed creating table '${schema.Name}', error: ${(error as Error).message}`);
            throw error;
        }

        return tableService;
    }

    public override async teardown(): Promise<void> {
        await super.teardown();
        await this.cleanup();
    }

    async cleanup(): Promise<void> {
        const PARALLEL_AMOUNT = 5;
        const leftoverResources: IManageableResource[] = [];

        await AsyncEachLimit(this.activeResources, PARALLEL_AMOUNT, async (resourceToRemove: IManageableResource) => {
            try {
                await resourceToRemove.removeResource();
            } catch (error) {
                console.warn(`ResourceManagerService: failed removing table '${resourceToRemove.name}', error: ${(error as Error).message}`);
                leftoverResources.push(resourceToRemove);
            }
        });

        // If there are any resources we failed removing, keep them for the next teardown.
        this.activeResources = leftoverResources;
    }

    /**
     * Service needs to be cached so that it will be able to clean up resources.
     */
    public override shouldCache(): boolean {
        return this._shouldCache;
    }
}
