import { EventResult } from "src/event-result";
import { BaseService } from "./base-service";
import { EventsService } from "./events.service";

import { nanoid } from 'nanoid'


export interface SyncResult
{
	success: boolean;
    finish: boolean;
}


export class SyncService  extends BaseService
{
    /**
	 * Emits a request to perform a sync operation.
	 * @param {boolean} allowContinueInBackground - A flag indicating whether the sync operation can continue in the background. Default is false. 
	 * @param {boolean} abortExisting - A flag indicating whether to abort an existing sync operation. Default is false.
	 * @returns {boolean} A flag indicating whether the sync operation was successful.
	 */
	public async sync(allowContinueInBackground: boolean = false, abortExisting: boolean = false): Promise<SyncResult>
	{
		const eventService = this.container.get(EventsService);
        let syncEventResult: EventResult = (await eventService.emitEvent('Sync', {
			allowContinueInBackground: allowContinueInBackground,
			abortExisting: abortExisting,
		}));

		const hudKey = nanoid();

		while(syncEventResult.type !== 'Finish')
		{
			// The event response is a HUD.
			// Keep poling until we get a finish event
			if(syncEventResult.type === 'HUD')
			{
				// sleep for Interval
				const secondInMs = 1000;
				const intervalInMs = syncEventResult.data.Interval ? syncEventResult.data.Interval * secondInMs : 2 * secondInMs;
				await new Promise(resolve => setTimeout(resolve, intervalInMs));

				// poll for the HUD
				syncEventResult = await syncEventResult.setResult({
					Success: true,
					HUDKey: hudKey
				})
			}
		}

		// Parse the result
		const syncResult: SyncResult = syncEventResult.data.SyncResult ? JSON.parse(syncEventResult.data.SyncResult) : {success: false, finish: false};

		return syncResult;
	}
}
