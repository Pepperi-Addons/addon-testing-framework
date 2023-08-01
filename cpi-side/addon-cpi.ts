import '@pepperi-addons/cpi-node'
import { UserEventsService } from './user-events.service';

export async function load(configuration: any) {
    const userEventsService = new UserEventsService();
    await userEventsService.subscribeToSyncUserEvent()
}

export const router = Router()
router.get('/test', (req, res) => {
    res.json({
        hello: 'World'
    })
});
