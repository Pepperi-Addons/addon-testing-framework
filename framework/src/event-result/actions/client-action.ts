import { CPISideService } from "../../services";
import { EventResult } from "../event-result";
import { EventResultType } from "../factory";

export abstract class ClientAction<TData, TResult> extends EventResult {
    constructor(eventService: CPISideService, type: EventResultType, public data: TData, callbackKey: string) {
        super(eventService, type, data, callbackKey);
    }

    public async setResult(result: TResult): Promise<EventResult> {
        return await super.setResult(result);
    }
}