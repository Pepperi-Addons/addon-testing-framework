import { PapiClient } from "@pepperi-addons/papi-sdk";
import { BaseService } from "./base-service";

/**
 * @class TestsService
 * @description
 * A service for functionality provided by the framework.
 */
export class AddonTestsService extends BaseService {

    /**
     * @returns The UUID of the testing framework addon.
     */
    addonUUID(): string {
        return this.container.client.AddonUUID;
    }


    /**
     * @returns A PapiClient instance for the testing framework addon.
     * The papi client is initialized with the testing addon's UUID secret key in the headers.
     */
    addonPapiClient() {
        return new PapiClient({
            baseURL: this.container.client.BaseURL,
            token: this.container.client.OAuthAccessToken,
            addonUUID: this.container.client.AddonUUID,
            addonSecretKey: this.container.client.AddonSecretKey,
            actionUUID: this.container.client.ActionUUID,
        });
    }

    /**
     * @returns A @PapiClient instance for general testing. Does not include a secret key in the headers.
     */
    generalPapiClient() {
        return new PapiClient({
            baseURL: this.container.client.BaseURL,
            token: this.container.client.OAuthAccessToken,
            actionUUID: this.container.client.ActionUUID,
        });
    }

}