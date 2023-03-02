import { EventResult }  from "./index";

export class Finish extends EventResult {
	public async setResult(resultToSet: any): Promise<EventResult> {
		throw new Error('Cannot set an event result on a "Finish" event.');
	}
}
