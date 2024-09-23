import { Relation } from '@pepperi-addons/papi-sdk';
import {CPI_NODE_VALIDATE_AFTER_SYNC_RELATION_CALL, VALIDATE_AFTER_SYNC_CALL_FIELD_NAME} from './consts';
import { CPINodeService } from './services/cpi-node-service';

export async function load(configuration: any) {
}

export const router = Router();
router.post('/test_upsert_relation', async (req, res) => {
    const cpiNodeService = new CPINodeService();
    const relation = await cpiNodeService.upsertRelation(req.body);
    res.json({ relation });
});

router.post('/test_after_sync_relation', async (req, res) => {
    res.json({
        ShouldReload: true,
    });
});

router.post('/test_validate_after_sync_relation_call', async (req, res) => {
    const cpiNodeService = new CPINodeService();
    const relation = await cpiNodeService.upsertRelation({
        ...(CPI_NODE_VALIDATE_AFTER_SYNC_RELATION_CALL as Relation),
        VALIDATE_AFTER_SYNC_CALL_FIELD_NAME
    });
    res.json({ relation });
});

router.post('/get_relations', async (req, res) => {
    const cpiNodeService = new CPINodeService();
    const relations = await cpiNodeService.getRelations(req.body);
    res.json({ relations });
});

router.get('/root_dir', async (req, res) => {
    const cpiNodeService = new CPINodeService();
    const rootDir = await cpiNodeService.getRootDir();
    res.json({ rootDir });
});

router.get('/get_addons', async (req, res) => {
    const cpiNodeService = new CPINodeService();
    const allAddons = await cpiNodeService.getAddons();
    res.json({ addons: allAddons });
});

router.get('/read_dir', async (req, res) => {
    const cpinodeService = new CPINodeService();
    const directories = await cpinodeService.readDir(req.query.dir_path as string);
    res.json({ directories });
});

router.get('/cached_addons', async (req, res) => {
    const cpinodeService = new CPINodeService();
    const cachedAddons = cpinodeService.getCachedAddons();
    res.json({ cachedAddonsNames: cachedAddons });
});

router.get('/system_delimiter', async (req, res) => {
    const cpinodeService = new CPINodeService();
    const delimiter = cpinodeService.getSystemDelimiter();
    res.json({ delimiter: delimiter });
});
