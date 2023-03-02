import fetch from 'node-fetch';
import { performance } from 'perf_hooks';

export class HttpService {
    
    constructor(private baseURL?: string, private token?: string) {
    }

    async post(url: string, body: any, headers?: any): Promise<any> {
        return await this.call('POST', url, body, headers);
    }

    async get(url: string, headers?: any): Promise<any> {
        return await this.call('GET', url, null, headers);
    }

    private async call(method: string, url: string, body: any, headers: any): Promise<any> {
        const apiURL = new URL(url, this.baseURL).toString();
        
        const requestHeaders = {
            'Content-Type': 'application/json',
            ...this.token ? { Authorization: `Bearer ${this.token}` } : {},
            ...headers,
        }
        
        const t0 = performance.now();
        const response = await fetch(url, {
            method: method,
            body: body ? JSON.stringify(body) : undefined,
            headers: requestHeaders
        });
        const t1 = performance.now();

        if (!response.ok) {
            throw new Error(`HTTP ${method} ${apiURL} failed with status ${response.status} ${response.statusText}, body: ${await response.text()}`);
        }

        console.log(`${method} ${apiURL} took ${(t1 - t0).toFixed(2)} milliseconds.`);
        
        return await response.json();
    }
}