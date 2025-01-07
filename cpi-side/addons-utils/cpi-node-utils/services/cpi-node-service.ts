import { ADDON_TABLE_NAME, AddonMetaData, CPINodeAddonUUId } from '../consts';
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

    async getTransactionScopeItemsFields(req) {
        const transaction = await pepperi.DataObject.Get(
            "transactions",
            req.params.uuid
        );
        await pepperi.TransactionScope.Get(transaction!)
        if (transaction) {
            const fields = req.query.fields.split(',').map((field: string) => field.trim());
            const ds = await transaction.transactionScope?.getDataSet(fields);
            if (ds) {
                const ds2 = await ds.where((obj) =>
                    obj.UUID !== '00000000-0000-0000-0000-000000000000'
                );
                return ds2.toArray();
            }
        }
    }

    async setTransactionScopeItemsFields(req) {
        const transaction = await pepperi.DataObject.Get(
            "transactions",
            req.body.transactionUUID
        );
        await pepperi.TransactionScope.Get(transaction!)
        if (transaction) {
            const fieldsArr = req.body.field;  // Assuming field is an array of objects like [{ FieldID: 'TSACurrencyAPI', newValue: 10 }, ...]
            const fieldIDs = fieldsArr.map(field => field.FieldID);
            const ds = await transaction.transactionScope?.getDataSet([...fieldIDs, 'UUID']);
            if (ds) {
                for (const field of fieldsArr) {
                    // Update the field's value in all filtered objects
                    for (const obj of ds) {
                        obj[field.FieldID] = field.newValue;  // Set the new value
                    }
                }
                await ds.commit();
                // Commit the changes for the current field
                // After processing all fields, return the updated data
                return ds.toArray();
            }

        }
    }
}