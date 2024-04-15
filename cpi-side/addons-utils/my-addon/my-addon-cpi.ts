import '@pepperi-addons/cpi-node'
import { MyAddonService } from './services/my-addon-service';
export async function load(configuration: any) {
    // add intercepors here
}

export const router = Router();
router.get('/example', async (req, res) => {
    
    const myService = new MyAddonService();

    res.json({
        message: myService.getExample()
    })
});