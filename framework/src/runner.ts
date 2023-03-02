import { Client } from "@pepperi-addons/debug-server/dist";
import { CPISessionService } from "./services/cpi-session.service";
import { EventsService } from "./services";
import { BaseTest } from "./tests";

export class TestRunner {

    eventService: EventsService;
    cpiSessionService: CPISessionService;

    constructor(client: Client, private test: BaseTest) {
        this.cpiSessionService = new CPISessionService(client);
        this.eventService = new EventsService(client, this.cpiSessionService);
    }

    async run() {
        // setup
        this.init();
        
        // run the test
        const res = await this.test.run();
        
        // TODO - add teardown
        
        // return the result
        return res;
    }

    init() {
        // set the services
        this.test.eventService = this.eventService;
        
        // init the test
        this.test.init();
    }
}