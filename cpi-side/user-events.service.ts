import { MainFunction } from "@pepperi-addons/cpi-node";
import { SyncOptions } from "@pepperi-addons/cpi-node/build/cpi-side/app/components";
import { Client, IContextWithData } from "@pepperi-addons/cpi-node/build/cpi-side/events";

export class UserEventsService
{
    protected static readonly subscribedUserEvents: string[] = [];
    protected static readonly syncUserEventName = 'Sync';

    public async subscribeToSyncUserEvent()
    {
        if(!UserEventsService.subscribedUserEvents.includes(UserEventsService.syncUserEventName))
        {
            pepperi.events.intercept(UserEventsService.syncUserEventName as any, {}, this.emitSyncClientEvent);
            UserEventsService.subscribedUserEvents.push(UserEventsService.syncUserEventName);
        }
    }

    protected async emitSyncClientEvent(context: IContextWithData)
    {
        console.log(`Intercepted User Event "${UserEventsService.syncUserEventName}".`);

        const { client, clientLoop, timers, clientFactory, ...userEventData } = context;

        const syncOptions: SyncOptions = {
            abortExisting: userEventData.abortExisting,
            allowContinueInBackground: userEventData.allowContinueInBackground,
        }
        const clientAsClient = client as Client;
        const syncRes = await clientAsClient.sync(syncOptions);

        return {
            SyncResult: JSON.stringify(syncRes)
        };
    }
}
