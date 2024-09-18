import {AddonUUID} from '../../../addon.config.json'
import { AddonData } from '@pepperi-addons/papi-sdk';

export const CPINodeAddonUUId = 'bb6ee826-1c6b-4a11-9758-40a46acb69c5'
export const ADDON_TABLE_NAME = 'addons';
export const CPI_NODE_TEST_TABLE = 'cpi_node_test_table';
export const CPI_NODE_ADDON_VERSION_CHANGE_TEST_DATA_OBJECT = {
    Key: 'cpi_node_addon_version_change_test_data_object',
    Reloaded: true,
};
export const CPI_NODE_VALIDATE_AFTER_SYNC_RELATION_CALL = {
    Type: 'CPIAddonAPI',
    AddonRelativeURL: '/tests-cpi-side/test_validate_after_sync_relation_call',
    AddonUUID: AddonUUID,
    RelationName: 'AfterSync',
    Name: 'test_validate_after_sync_relation_call',
    Description: '',
};
export const VALIDATE_AFTER_SYNC_CALL_FIELD_NAME = 'ValidateAfterSyncCall';
export interface AddonMetaData extends AddonData {
    Key: string; // addonUUID
    Version: string;
    CPISideFiles: string[];
    Relations: any;
    AssetsBaseUrl: string;
    Hidden: boolean;
}