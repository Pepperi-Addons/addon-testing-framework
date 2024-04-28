import '@pepperi-addons/cpi-node'
import { SchedulerService } from './scheduler-service';
export async function load(configuration: any) {
    // add intercepors here
}

export const router = Router();
router.post('/manipulate_user_db_creation_date', async (req, res, next) => {
    try {
        debugger
        const schedulerService = new SchedulerService()
        await schedulerService.manipulateUserDb(req.body)

        res.json({
            Success: true
        })
    } catch (error: any) {
        console.error(`Error manipulating user db access and modification timestamps: ${error.message}`);
        next(error)
    }
})