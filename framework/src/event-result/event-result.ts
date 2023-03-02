import { EventsService } from "../services/events.service";
import { EventResultCast, EventResultType as EventResultType } from "./factory";

export abstract class EventResult {

	constructor(protected eventsService: EventsService, public type: EventResultType, public data: any, public callbackKey: string) {
	}

   /**
	* A method to set the result for the current event.
	* @param result The result to be set for the current event. It can be an instance of Event or any other object.
	* @returns A Promise that resolves to an instance of EventResult.
	*/
	public async setResult(result: any): Promise<EventResult> {
		return await this.eventsService.emitEvent(this.callbackKey, result);
	}

	cast<type extends EventResultType>() {
		return this as EventResultCast<type>;
	}
}
