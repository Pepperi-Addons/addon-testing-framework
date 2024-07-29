import { AddonDataScheme } from "@pepperi-addons/papi-sdk";
import { BaseService } from "../../base-service";

export class SchemesGenerator extends BaseService {

    /**
     * @param name must be unique.
     */
    public buildSchema(
        name: string,
        fields: AddonDataScheme['Fields'] = {},
        type: AddonDataScheme['Type'] = 'data',
        synced = true,
        genericResource = false,
    ): AddonDataScheme {
        return {
            Name: name,
            Type: type,
            SyncData: {
                Sync: synced,
            },
            Fields: fields,
            GenericResource: genericResource,
        };
    }
}
