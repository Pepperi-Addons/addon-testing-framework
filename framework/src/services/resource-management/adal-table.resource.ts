import { AddonDataScheme, PapiClient, AddonData, DIMXObject } from '@pepperi-addons/papi-sdk';
import { IManageableResource } from './i-manageable.resource';
import { Client } from '@pepperi-addons/debug-server/dist';

export class AdalTableResource extends IManageableResource {

    private papiClient: PapiClient;

    constructor(
        private client: Client,
        private _schema: AddonDataScheme,
        removeCallback?: () => Promise<void>) {
        super(removeCallback);
        this.papiClient = new PapiClient({
            baseURL: client.BaseURL,
            token: client.OAuthAccessToken,
            addonUUID: client.AddonUUID,
            addonSecretKey: client.AddonSecretKey,
            actionUUID: client.ActionUUID
        });
    }

    public get schema(): AddonDataScheme {
        return this._schema;
    }

    public get name(): string {
        return this._schema.Name;
    }

    public async upsert(): Promise<AddonDataScheme> {
        try {
            const returnedSchema = await this.papiClient.addons.data.schemes.post(this.schema);
            this._schema = returnedSchema;
            console.log(`ADALTableService: upserted schema '${this.name}'`);
            return returnedSchema;
        } catch (error) {
            console.error(`ADALTableService: failed upserting schema '${this.name}':  ${(error as Error).message}`);
            throw error;
        }
    }

    public async remove(): Promise<void> {
        try {
            await this.papiClient.post(`/addons/data/schemes/${this.name}/purge`);
            console.log(`ADALTableService: removed schema '${this.name}'`);
        } catch (error) {
            console.error(`ADALTableService: failed removing schema '${this.name}':  ${(error as Error).message}`);
            throw error;
        }
    }

    public async upsertRecord(record: AddonData): Promise<AddonData> {
        try {
            const result = await this.papiClient.addons.data.uuid(this.client.AddonUUID).table(this.name).upsert(record);
            console.log(`ADALTableService: upserted a record to table '${this.name}'`);
            return result;
        } catch (error) {
            console.error(`ADALTableService: failed upserting records of table '${this.name}':  ${(error as Error).message}`);
            throw error;
        }
    }

    public async upsertBatch(records: AddonData[]): Promise<DIMXObject[]> {
        if (records.length === 0) {
            return [];
        }

        try {
            const result = await this.papiClient.post(`/addons/data/batch/${this.client.AddonUUID}/${this.name}`, {
                Objects: records,
            });
            console.log(`ADALTableService: batch upserted ${records.length} records to table '${this.name}'`);
            return result;
        } catch (error) {
            console.error(`ADALTableService: failed batch upserting records of table '${this.name}':  ${(error as Error).message}`);
            throw error;
        }
    }

    public async removeRecord(key: string): Promise<void> {
        await this.papiClient.addons.data.uuid(this.client.AddonUUID).table(this.name).key(key).hardDelete(true);
    }
}
