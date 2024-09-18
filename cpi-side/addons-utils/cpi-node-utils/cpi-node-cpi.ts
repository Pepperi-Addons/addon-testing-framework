import { Relation } from '@pepperi-addons/papi-sdk';
import fs from 'fs';
import util from 'util';
import {ADDON_TABLE_NAME, AddonMetaData, CPI_NODE_ADDON_VERSION_CHANGE_TEST_DATA_OBJECT, CPI_NODE_TEST_TABLE, CPI_NODE_VALIDATE_AFTER_SYNC_RELATION_CALL, CPINodeAddonUUId, VALIDATE_AFTER_SYNC_CALL_FIELD_NAME} from './consts';
const readdirAsync = util.promisify(fs.readdir);

export async function load(configuration: any) {
}

export const router = Router();
router.post('/test_upsert_relation', async (req, res) => {
    const relation = await pepperi.addons.data.relations.upsert(req.body);
    res.json({ relation });
});

router.post('/test_after_sync_relation', async (req, res) => {
    res.json({
        ShouldReload: true,
    });
});

router.post('/test_validate_after_sync_relation_call', async (req, res) => {
    await pepperi.addons.data.relations.upsert({
        ...(CPI_NODE_VALIDATE_AFTER_SYNC_RELATION_CALL as Relation),
        VALIDATE_AFTER_SYNC_CALL_FIELD_NAME,
    });
});

router.post('/get_relations', async (req, res) => {
    const relations = await pepperi.addons.data.relations.search(req.body);
    res.json({ relations });
});

router.get('/root_dir', async (req, res) => {
    const rootDir = await pepperi.files.rootDir();
    res.json({ rootDir });
});

router.get('/get_addons', async (req, res) => {
    const allAddons = (
        await pepperi.api.adal.getList({
            addon: CPINodeAddonUUId,
            table: ADDON_TABLE_NAME,
        })
    ).objects as AddonMetaData[];

    res.json({ addons: allAddons });
});

router.get('/read_dir', async (req, res) => {
    try {
        const dirPath: string = req.query.dir_path as string;
        const directories = await readdirAsync(dirPath);
        res.json({ directories });
    } catch (err) {
        console.error('Error reading dir:', err);
    }
});

router.post('/intercept_event', async (req, res) => {
    const eventKey = req.body.eventKey;
    await pepperi.events.intercept(eventKey, {}, async (eventData) => {
        await pepperi.papiClient.addons.data
            .uuid(CPINodeAddonUUId)
            .table(CPI_NODE_TEST_TABLE)
            .upsert(CPI_NODE_ADDON_VERSION_CHANGE_TEST_DATA_OBJECT);
        console.log(`Intercepted event in intercept_event route: ${eventKey}`);
    });
    res.json({});
});

router.get('/cached_addons', async (req, res) => {
    try {
        const cachedAddons = require.cache;
        res.json({ cachedAddonsNames: Object.keys(cachedAddons) });
    } catch (err) {
        console.error('Error reading cache:', err);
    }
});
