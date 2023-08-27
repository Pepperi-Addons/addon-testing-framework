import { AddonsApiGetParams, AddonsApiPostParams, AddonsDataSearchParams, AddonsDataSearchResult, JourneyTrackerRecord, RunFlowBody, SlugsGetPageResult } from "@pepperi-addons/cpi-node/build/cpi-side/client-api";
import { IContext } from "@pepperi-addons/cpi-node/build/cpi-side/events/context";
import { AddonData, AddonFile, SearchBody } from "@pepperi-addons/papi-sdk";
import { FileFindOptions, FindOptions } from "@pepperi-addons/papi-sdk/dist/endpoint";


export interface IApiCallHandler {
    handleApiCall: (
        addonUUID: string,
        url: string,
        method: string,
        body: any,
        context: IContext | undefined,
    ) => Promise<any>
}

export class ClientApiService
{
    protected readonly mappedAddons = {
        slugs: '4ba5d6f9-6642-4817-af67-c79b68c96977',
        scripts: '9f3b727c-e88c-4311-8ec4-3857bc8621f3',
        pfs: '00000000-0000-0000-0000-0000000f11e5',
        assets: 'ad909780-0c23-401e-8e8e-f514cc4f6aa2',
        adal: '00000000-0000-0000-0000-00000000ada1',
        cpi_data: 'd6b06ad0-a2c1-4f15-bebb-83ecc4dca74b',
        generic_resource: 'df90dba6-e7cc-477b-95cf-2c70114e44e0',
        core: '00000000-0000-0000-0000-00000000c07e',
        journey_tracker: '41011fbf-debf-40d8-8990-767738b8af03',
        flows: 'dc8c5ca7-3fcc-4285-b790-349c7f3908bd',
        configurations: '84c999c3-84b7-454e-9a86-71b7abc96554',
    };

    constructor(protected iApiCallHandler: IApiCallHandler)
    {
        // Dynamically expose keys as public properties
        // This is done just for convenience, so that whoever holds this class
        // and exposes it won't end up having another reference.
        Object.keys(this.clientApi).forEach(key => {
            this[key] = this.clientApi[key];
        });
    }

    protected encodeQueryParams(params: any) {
        const ret: string[] = [];
    
        Object.keys(params).forEach((key) => {
            ret.push(key + '=' + encodeURIComponent(params[key]));
        });
    
        return ret.join('&');
    }

    public clientApi = {
        scripts: {
            key: (key: string) => {
                return {
                    run: async (data: any, context?: IContext) => {
                        return this.clientApi.addons.api.uuid(this.mappedAddons.scripts).post({
                            url: `addon-cpi/${key}/run`,
                            body: {
                                Data: data,
                            },
                            context,
                        });
                    },
                };
            },
        },
        files: {
            assets: {
                get: async (key: string) => {
                    return this.clientApi.addons.api.uuid(this.mappedAddons.pfs).post({
                        url: `addon-cpi/get_file`,
                        body: {
                            AddonUUID: this.mappedAddons.assets, // assets addon uuid
                            SchemaName: 'Assets',
                            FileKey: key,
                        },
                    });
                },
            }
        },
        addons: {
            configurations: {
                get: async (key: string) => {
                    return await this.clientApi.addons.api.uuid(this.mappedAddons.configurations).get({
                        url: `/addon-cpi/configurations?key=${key}`,
                    });
                },
            },
            pfs: {
                uuid: (addonUUID: string) => {
                    return {
                        schema: (schemaName: string) => {
                            return {
                                key: (keyName: string) => {
                                    return {
                                        get: async (): Promise<AddonFile> => {
                                            return await this.clientApi.addons.api.uuid(this.mappedAddons.pfs).get({
                                                url: `/addon-cpi/file?addon_uuid=${addonUUID}&resource_name=${schemaName}&key=${keyName}`,
                                            });
                                        },
                                    };
                                },
                                post: async (body: AddonFile): Promise<AddonFile> => {
                                    return await this.clientApi.addons.api.uuid(this.mappedAddons.pfs).post({
                                        url: `/addon-cpi/files?addon_uuid=${addonUUID}&resource_name=${schemaName}`,
                                        body: body,
                                    });
                                },
                                find: async (params: FileFindOptions | FindOptions): Promise<AddonFile[]> => {
                                    let url = `/addon-cpi/files/find?addon_uuid=${addonUUID}&resource_name=${schemaName}`;
                                    const query = this.encodeQueryParams(params);
                                    url = query ? url + '&' + query : url;
                                    return await this.clientApi.addons.api.uuid(this.mappedAddons.pfs).get({ url: url });
                                },
                            };
                        },
                    };
                },
            },
            api: {
                uuid: (uuid: string) => {
                    return {
                        get: (options: AddonsApiGetParams) => {
                            return this.iApiCallHandler.handleApiCall(uuid, options.url, 'GET', undefined, options.context);
                        },
                        post: (options: AddonsApiPostParams) => {
                            return this.iApiCallHandler.handleApiCall(uuid, options.url, 'POST', options.body, options.context);
                        },
                    };
                },
            },
            data: {
                schemes: {
                    get: async (options: AddonsDataSearchParams) => {
                        return (await this.clientApi.addons.data.uuid(this.mappedAddons.adal).table('schemes').search(options)).Objects;
                    },
                },
                uuid: (uuid: string) => {
                    return {
                        table: (tableName: string) => {
                            return {
                                search: async (options: AddonsDataSearchParams): Promise<AddonsDataSearchResult> => {
                                    return await this.clientApi.addons.api.uuid(this.mappedAddons.cpi_data).post({
                                        url: `addon-cpi/search/${uuid}/${tableName}`,
                                        body: options,
                                    });
                                },
                                upsert: async (object: AddonData) => {
                                    return await this.clientApi.addons.api.uuid(this.mappedAddons.cpi_data).post({
                                        url: `addon-cpi/${uuid}/${tableName}`,
                                        body: object,
                                    });
                                },
                                key: (objectKey: string) => {
                                    return {
                                        get: async () => {
                                            return await this.clientApi.addons.api.uuid(this.mappedAddons.cpi_data).get({
                                                url: `addon-cpi/${uuid}/${tableName}/${objectKey}`,
                                            });
                                        },
                                    };
                                },
                            };
                        },
                    };
                },
            },
            papi: {
                uuid: (uuid: string) => {
                    return {
                        resource: (resourceName: string) => {
                            return {
                                search: async (options: AddonsDataSearchParams): Promise<AddonsDataSearchResult> => {
                                    return await this.clientApi.addons.api.uuid(this.mappedAddons.core).post({
                                        url: `addon-cpi/${resourceName}/search?addon_uuid=${uuid}`,
                                        body: options,
                                    });
                                },
                                upsert: async (object: AddonData) => {
                                    return await this.clientApi.addons.api.uuid(this.mappedAddons.core).post({
                                        url: `addon-cpi/${resourceName}?addon_uuid=${uuid}`,
                                        body: object,
                                    });
                                },
                                key: (objectKey: string) => {
                                    return {
                                        get: async () => {
                                            return await this.clientApi.addons.api.uuid(this.mappedAddons.core).get({
                                                url: `addon-cpi/${resourceName}/key/${objectKey}?addon_uuid=${uuid}`,
                                            });
                                        },
                                    };
                                },
                            };
                        },
                    };
                },
            },
        },
        slugs: {
            getPage: async (slug: string): Promise<SlugsGetPageResult> => {
                return this.clientApi.addons.api.uuid(this.mappedAddons.slugs).post({
                    url: 'addon-cpi/get_page',
                    body: {
                        slug: slug,
                    },
                }) as Promise<SlugsGetPageResult>;
            },
        },
        resources: {
            resource: (resourceName: string) => {
                const baseURL = `addon-cpi/proxy/${resourceName}`;
                return {
                    get: async (options: FindOptions): Promise<AddonData[]> => {
                        const query = this.encodeQueryParams(options);
                        return await this.clientApi.addons.api.uuid(this.mappedAddons.generic_resource).get({
                            url: query ? `${baseURL}?${query}` : baseURL,
                        });
                    },
                    post: async (object: AddonData): Promise<AddonData> => {
                        return await this.clientApi.addons.api.uuid(this.mappedAddons.generic_resource).post({
                            url: baseURL,
                            body: object,
                        });
                    },
                    key: (objectKey: string) => {
                        return {
                            get: async (): Promise<AddonData> => {
                                return await this.clientApi.addons.api.uuid(this.mappedAddons.generic_resource).get({
                                    url: `${baseURL}/key/${objectKey}`,
                                });
                            },
                        };
                    },
                    unique: (fieldID: string) => {
                        return {
                            get: async (fieldValue: string): Promise<AddonData> => {
                                return await this.clientApi.addons.api.uuid(this.mappedAddons.generic_resource).get({
                                    url: `${baseURL}/unique/${fieldID}/${fieldValue}`,
                                });
                            },
                        };
                    },
                    search: async (params: SearchBody): Promise<AddonsDataSearchResult> => {
                        return await this.clientApi.addons.api.uuid(this.mappedAddons.generic_resource).post({
                            url: `${baseURL}/search`,
                            body: params,
                        });
                    },
                };
            },
        },
        journey: {
            log: async (params: JourneyTrackerRecord): Promise<void> => {
                const baseURL = 'addon-cpi/insert_record';
                await this.clientApi.addons.api.uuid(this.mappedAddons.journey_tracker).post({
                    url: baseURL,
                    body: params,
                });
            },
        },    
        flows: {
            run: async (data: RunFlowBody) => {
                return await this.clientApi.addons.api.uuid(this.mappedAddons.flows).post({
                    url: '/flows/run_flow',
                    body: {
                        RunFlow: data.RunFlow,
                        Data: data.Data,
                    },
                    context: data.context,
                });
            },
        },
    };
}
