import { CPASService, LocalCPASService } from "./cpas.service";
import { EventResultType, EventResultFactory, EventResult } from "../event-result";
import { CPISessionService } from "./cpi-session.service";
import { BaseService } from "./base-service";
import { AddonUUID } from "../../../addon.config.json";
import { Finish } from "../event-result/finish";
import { ClientApiService, IApiCallHandler } from "./client-api.service";
import { IContext } from "@pepperi-addons/cpi-node/build/cpi-side/events";
import { ServicesContainer } from "./services-container";

export interface SyncResult {
	success: boolean;
    finish: boolean;
}

/**
 * A service for interacting with an addons CPI Side
 */
export class CPISideService extends BaseService implements IApiCallHandler{
	
	eventResultFactory: EventResultFactory;
	cpasService?: CPASService;
	cpiSessionService: CPISessionService;
	public pepperi: ClientApiService

	constructor(container: ServicesContainer) {
		super(container);
		this.cpiSessionService = this.container.get(CPISessionService);
		this.eventResultFactory = new EventResultFactory();
		this.pepperi = new ClientApiService(this);
	}

	async initCPASService() {
		if (!this.cpasService) {
			this.cpasService = await this.cpiSessionService.createSession();
		}
	}

	/**
	 * Call an addons internal CPI Side addon api
	 * @param addonUUID the addon UUID
	 * @param url the relative URL
	 * @param body the for POST (optional)
	 * @param actionHandler a function to handle any client actions that return before the Addon API returns it's result
	 * @returns the Addon API result
	 */
	async addonAPI(addonUUID: string, url: string, body: any = {}, method: string, actionHandler?: (action: EventResult) => Promise<Finish>): Promise<any> {
        let eventRes = await this.emitEvent('AddonAPI', {
            AddonUUID: addonUUID,
            RelativeURL: url,
            Method: method,
            Body: body
        });

        if (eventRes.type !== 'Finish') {
			if (actionHandler) {
				eventRes = await actionHandler(eventRes);
			}
			else {
				throw new Error(`AddonAPI event has returned a client action of type ${eventRes.type}, consider implementing an actionHandler`);
			}
        }

        return JSON.parse(eventRes.data.Value);
    }

	/**
	 * Emits an event using the provided event body.
	 * @param eventBody - The event body to be posted.
	 * @returns A new instance of the {@link EventResult} class.
    **/
	public async emitEvent(eventKey: string, eventData: any): Promise<EventResult> {
		// make sure the CPI service is initialized
		await this.initCPASService();
		
		// emit the event
		const eventResponse = await this.cpasService!.emitEvent(eventKey, eventData);

		const data = eventResponse.Data || {};
		const callback = eventResponse.Callback || '';

		// default to 'Finish' if the type is not provided
		const type = eventResponse.Type as EventResultType || 'Finish';

		return this.eventResultFactory.create(this, data, callback, type);
	}

	/**
	 * Emits a request to perform a sync operation.
	 * @param {boolean} allowContinueInBackground - A flag indicating whether the sync operation can continue in the background. Default is false. 
	 * @param {boolean} abortExisting - A flag indicating whether to abort an existing sync operation. Default is false.
	 * @returns {Promise<SyncResult>} A promise that resolves to SyncResult object with the sync result.
	 */
	public async sync(allowContinueInBackground: boolean = false, abortExisting: boolean = false): Promise<SyncResult>
	{
		const syncRequestBody = {
			AllowContinueInBackground: allowContinueInBackground,
			AbortExisting: abortExisting
		};
		
		const addonApiResult = await this.addonAPI(AddonUUID, '/addon-cpi/sync', syncRequestBody, "POST", async (action) => {
			// The event response is a HUD.
			// Keep poling until we get a finish event
			while(action.type !== 'Finish') {	
				if(action.type === 'HUD') {
					// sleep for Interval
					const secondInMs = 1000;
					const intervalInMs = action.data.Interval ? action.data.Interval * secondInMs : 2 * secondInMs;
					await new Promise(resolve => setTimeout(resolve, intervalInMs));

					// poll for the HUD
					action = await action.setResult({
						Success: true,
						HUDKey: new Date().toISOString()
					})
				}
				else {
					throw new Error(`Got unexpected action ${action.type} from sync AddonAPI call`);
				}
			}
			
			return action;
		});

		// Parse the result
		const syncResult: SyncResult = addonApiResult.SyncResult ?? {success: false, finish: false};

		return syncResult;
	}

	public async handleApiCall(addonUUID: string, url: string, method: string, body: any, context: IContext | undefined):Promise<any>
	{
		const apiCallResult = await this.addonAPI(addonUUID, url, body, method);
		return apiCallResult;
	}

   /**
	* Registers for user events.
	* @param userEvents The list of user events to subscribe to.
	* @throws Error if the registration process fails. The error message will contain the error code and error message from the response.
	*/
	public async registerToUserEvents(userEvents: Array<string>) {
	}

	/**
	 *	Cache the service so that the Session won't be initialized on each call.
	 */
	shouldCache(): boolean {
		return true;
	}
}

/**
 * A service for interacting with the Event Mechanism running locally on a developer machine.
 */
export class LocalCPISideService extends CPISideService {
	
	async initCPASService(): Promise<void> {
		this.cpasService = new LocalCPASService(this.container.client);
	}

}