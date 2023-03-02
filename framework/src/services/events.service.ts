import { Client } from "@pepperi-addons/debug-server/dist";
import { CPIService } from "./cpi.service";
import { EventResultType, EventResultFactory, EventResult } from "../event-result";
import { CPISessionService } from "./cpi-session.service";

export class EventsService {
	eventResultFactory: EventResultFactory;
	cpiService?: CPIService;

	constructor(protected client: Client, private cpiSessionService: CPISessionService) {
		this.eventResultFactory = new EventResultFactory();
	}

	async initCPIService() {
		if (!this.cpiService) {
			this.cpiService = await this.cpiSessionService.createSession();
		}
	}

	/**
	 * Emits an event using the provided event body.
	 * @param eventBody - The event body to be posted.
	 * @returns A new instance of the {@link EventResult} class.
    **/
	public async emitEvent(eventKey: string, eventData: any): Promise<EventResult> {
		// make sure the CPI service is initialized
		await this.initCPIService();
		
		// emit the event
		const eventResponse = await this.cpiService!.emitEvent(eventKey, eventData);

		const data = eventResponse.Data || {};
		const callback = eventResponse.Callback || '';

		// default to 'Finish' if the type is not provided
		const type = eventResponse.Type as EventResultType || 'Finish';

		return this.eventResultFactory.create(this, data, callback, type);
	}

   /**
	* Registers for user events.
	* @param userEvents The list of user events to subscribe to.
	* @throws Error if the registration process fails. The error message will contain the error code and error message from the response.
	*/
	public async registerToUserEvents(userEvents: Array<string>) {
	}
}
