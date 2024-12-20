import {ADDON_TABLE_NAME, AddonMetaData, CPINodeAddonUUId,} from '../consts';
import * as fs from "fs";
import path from 'path';
export class CPINodeService {

    async upsertRelation(relation: any) {
        return await pepperi.addons.data.relations.upsert(relation);
    }

    async getRelations(params) {
        return await pepperi.addons.data.relations.search(params);
    }

    async getRootDir() {
        return await pepperi.files.rootDir();
    }

    async getAddons() {
        const allAddons = (
            await pepperi.api.adal.getList({
                addon: CPINodeAddonUUId,
                table: ADDON_TABLE_NAME,
            })
        ).objects as AddonMetaData[];
        return allAddons;
    }

    async readDir(path: string) {
        const directories = await fs.promises.readdir(path);
        return directories;
    }

    getCachedAddons() {
        const cachedAddons = require.cache;
        return Object.keys(cachedAddons);
    }

    getSystemDelimiter() {
        return path.sep;
    }

    setCpiNodeTestMode(body) {
        global['cpiNodeTestMode'] = body['cpiNodeTestMode'];
    }

    async getKmsParameterByObjectKey(uuid: string, key: string) {
        return await pepperi.addons.kms.uuid(uuid).parameters.key(key).get();
    }
}