import { Client } from "@pepperi-addons/debug-server/dist";
import { BaseTest } from "./tests";
import { ServicesContainer } from "./services/services-container";

export class TestRunner {

    servicesContainer: ServicesContainer;

    constructor(private client: Client) {
        this.servicesContainer = new ServicesContainer(client);
    }

    async run(test: BaseTest) {
        // setup
        this.init(test);
        
        // run the test
        const res = await test.run();
        
        // teardown
        await this.servicesContainer.teardown();
        
        // return the result
        return res;
    }

    init(test: BaseTest) {
        // initialize the services container on the test
        test.init(this.servicesContainer);
    }
}