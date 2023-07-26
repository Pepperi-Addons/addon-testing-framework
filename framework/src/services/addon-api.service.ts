import { BaseService } from "./base-service";
import { HttpService } from "./http.service";
import { ServicesContainer } from "./services-container";
import path from 'path';

/**
 * @class AddonAPIService
 * @description
 * A service for sending requests to the addon api.
 * @usage
 * ```typescript
 * const apiService = container.get(AddonAPIService);
 * api.service.addonUUID = '12345678-1234-1234-1234-123456789012';
 * const response = await apiService.get('/api/foo');
 * expect(response).toEqual({ foo: 'bar' });
 * ```
 */
export class AddonAPIService extends BaseService {

    protected httpService: HttpService;

    constructor(container: ServicesContainer) {
        super(container);
        this.httpService = new HttpService(this.container.client.BaseURL, this.container.client.OAuthAccessToken);
    }

    /**
     * The UUID of the addon to send the request to.
     */
    addonUUID: string = '';

    /**
     * Send a GET request to the addon api.
     * @param relativeURL the relative url to send the request to eg. '/api/foo'
     * @param queryParams query parameters to add to the url eg. { foo: 'bar' } will add '?foo=bar' to the url
     * @param headers headers to add to the request eg. { 'Content-Type': 'application/json' }
     * @returns the API response
     */
    get(relativeURL: string, queryParams?: { [key: string]: string | number | boolean }, headers?: { [key: string]: string } ) {
        return this.httpService.get(this.buildURL(relativeURL) + this.buildQueryString(queryParams || {}), headers);
    }

    /**
     * Send a POST request to the addon api.
     * @param relativeURL the relative url to send the request to eg. '/api/foo'
     * @param body the body of the request
     * @param queryParams the query parameters to add to the url eg. { foo: 'bar' } will add '?foo=bar' to the url
     * @param headers headers to add to the request eg. { 'Content-Type': 'application/json' }
     * @returns the API response
     */
    post(relativeURL: string, body: any, queryParams?: { [key: string]: string | number | boolean }, headers?: { [key: string]: string } ) {
        return this.httpService.post(this.buildURL(relativeURL) + this.buildQueryString(queryParams || {}), body, headers);
    }

    /**
     * Build the full url to send the request to.
     * @param relativeURL the URL relative to the addon api eg. '/api/foo'
     * @returns the full url to send the request to eg. 'addons/api/12345678-1234-1234-1234-123456789012/api/foo'
     */
    protected buildURL(relativeURL: string) {
        return path.posix.join('addons/api', this.addonUUID, relativeURL);
    }

    /**
     * Build a query string from the provided parameters.
     * @param params the query parameters eg. { foo: 'bar', baz: 'qux' }
     * @returns the query string eg. '?foo=bar&baz=qux'
     */
    buildQueryString(params: { [key: string]: string | number | boolean }) {
        const queryString = Object.keys(params).map(key => `${key}=${encodeURIComponent(params[key])}`).join('&');
        return queryString ? `?${queryString}` : '';
    }
}

/**
 * A service for interacting with the Addon API running locally on a developer machine.
 */
export class LocalAddonAPIService extends AddonAPIService {

    constructor(container: ServicesContainer) {
        super(container);
     
        const baseURL = process.env.LOCAL_ADDON_API_BASE_URL || 'http://localhost:4500';
        this.httpService = new HttpService(baseURL, this.container.client.OAuthAccessToken);
    }

    get(relativeURL: string, queryParams?: { [key: string]: string | number | boolean; } | undefined, headers?: { [key: string]: string; } | undefined): Promise<any> {
        return super.get(relativeURL, queryParams, {
            'Content-Type': 'application/json',
            ...headers,
        });
    }

    post(relativeURL: string, body: any, queryParams?: { [key: string]: string | number | boolean; } | undefined, headers?: { [key: string]: string; } | undefined): Promise<any> {
        return super.post(relativeURL, body, queryParams, {
            'Content-Type': 'application/json',
            ...headers,
        });
    }

    protected buildURL(relativeURL: string) {
        return relativeURL;
    }

}
