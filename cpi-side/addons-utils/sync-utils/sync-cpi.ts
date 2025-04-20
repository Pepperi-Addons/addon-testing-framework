import '@pepperi-addons/cpi-node'
const SyncAddonUUID = '5122dc6d-745b-4f46-bb8e-bd25225d350a';

export async function load(configuration: any) {
    pepperi.events.intercept('SyncTerminated',{}, async (context, next, main) => {
        const { JobInfoResponse } = context;
        const clientInfo = JobInfoResponse.ClientInfo
        const addonSyncConfig = JSON.parse(clientInfo.AddonSyncConfig)
        await pepperi.addons.kms.uuid(SyncAddonUUID).parameters.key('SyncClientStartTime').upsert({Value: {ClientStartTime: addonSyncConfig.ClientSyncStartDateTime}});
    })
}

export const router = Router();
router.get('/get_client_start_time', async (req, res, next) => {
    const val = await pepperi.addons.kms.uuid(SyncAddonUUID).parameters.key('SyncClientStartTime').get();
    return val.Value;
});