import { Client } from "@pepperi-addons/debug-server/dist";
import { PapiClient } from "@pepperi-addons/papi-sdk";

interface AddonTest {
    Name: string;
}

/**
 * @class AddonTestRunner
 * @description
 * Run an addon test suite.
 */
export class AddonTestRunner {

    papiClient: PapiClient;

    constructor(private client: Client, private addonUUID: string) {
        this.client = client;
        this.addonUUID = addonUUID;
        this.papiClient = new PapiClient({
            baseURL: client.BaseURL,
            token: client.OAuthAccessToken,
            addonUUID: addonUUID,
            addonSecretKey: client.AddonSecretKey,
            actionUUID: client.ActionUUID
        });
    }

    /**
     * @method run
     * Run the addon's tests.
     */
    async run() {
        // get the addon's tests
        const tests = await this.getTests();

        // run the tests
        for (const test of tests) {
            await this.runTest(test);
        }

        // return the results
    }

    async getTests(): Promise<AddonTest[]> {
        const response = await this.papiClient.addons.api.uuid(this.addonUUID).file('tests').func('tests').get();
        return response.Tests;
    }

    async runTest(test: AddonTest) {
        const response = await this.papiClient.addons.api.uuid(this.addonUUID).file('tests').func('run').post({ TestName: test.Name });
    }
}