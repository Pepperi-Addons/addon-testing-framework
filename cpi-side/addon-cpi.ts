import '@pepperi-addons/cpi-node'
import { SyncOptions, SyncResult } from '@pepperi-addons/cpi-node/build/cpi-side/app/components';
import { Client } from '@pepperi-addons/cpi-node/build/cpi-side/events';

export async function load(configuration: any) {
}

export const router = Router();

router.post('/Sync', async (req, res) => {
    debugger;
    const syncOptions: SyncOptions = {
        abortExisting: req.body.AbortExisting,
        allowContinueInBackground: req.body.AllowContinueInBackground,
    };

    const client = req.context?.client as Client;

    let syncResult: SyncResult;

    if(client)
    {
        syncResult = await client.sync(syncOptions);
    }
    else
    {
        const errorMessage = 'Could not get a Client object from the request. No sync request was made.';
        console.error(errorMessage);
        throw new Error(errorMessage);
    }

    return {
        SyncResult: JSON.stringify(syncResult)
    };
});
