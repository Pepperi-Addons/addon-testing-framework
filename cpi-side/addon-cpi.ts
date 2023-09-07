import '@pepperi-addons/cpi-node'
import { SyncOptions, SyncResult } from '@pepperi-addons/cpi-node/build/cpi-side/app/components';
import { Client, IClient } from '@pepperi-addons/cpi-node/build/cpi-side/events';

export async function load(configuration: any) {
}

export const router = Router();

router.post('/sync', async (req, res) => {
    const syncOptions: SyncOptions = {
        abortExisting: req.body.AbortExisting,
        allowContinueInBackground: req.body.AllowContinueInBackground,
        showHUD: req.body.showHUD ?? true
    };

    const client = req.context?.client;
    let syncResult: SyncResult = await sync(client, syncOptions, "sync");

    res.json({
        SyncResult: syncResult
    })
});

router.post('/resync', async (req, res) => {
    const syncOptions: SyncOptions = {
        abortExisting: req.body.AbortExisting,
        allowContinueInBackground: req.body.AllowContinueInBackground,
        showHUD: req.body.showHUD ?? true
    };

    const client = req.context?.client;
    let syncResult: SyncResult = await sync(client, syncOptions, "resync");

    res.json({
        SyncResult: syncResult
    })
});

async function sync(client: IClient | undefined, syncOptions: SyncOptions, syncOperation: "sync" | "resync")
{
    let syncResult: SyncResult;

    if(client)
    {
        console.log(`Sending sync request with options: ${JSON.stringify(syncOptions)}`);
        syncResult = await client[syncOperation](syncOptions);
    }
    else
    {
        const errorMessage = 'Could not get a Client object from the request. No sync request was made.';
        console.error(errorMessage);
        throw new Error(errorMessage);
    }

    return syncResult;
}
