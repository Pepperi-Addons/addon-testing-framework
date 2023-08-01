
import { CPIService } from "./cpi.service";
import { HttpService } from "./http.service";
import jwtDecode from 'jwt-decode';
import { Client } from "@pepperi-addons/debug-server/dist";
import { BaseService } from "./base-service";
import { ServicesContainer } from "./services-container";

interface ParsedPepperiJWT {
    "pepperi.baseurl": string;
}

export class CPISessionService extends BaseService {

    httpService: HttpService;
    papiBaseURL: string;
	client: Client;

	constructor(container: ServicesContainer) {
		super(container);
		this.client = this.container.client;
		this.httpService = new HttpService(undefined, this.client.OAuthAccessToken);
        this.papiBaseURL = jwtDecode<ParsedPepperiJWT>(this.client.OAuthAccessToken)["pepperi.baseurl"];
	}

	public async createSession(): Promise<CPIService> 
	{
        const webAPIBaseURL = await this.getWebAPIBaseURL();
		const url = `${webAPIBaseURL}/CreateSession`;
		const body = { 
            "accessToken": this.client.OAuthAccessToken, 
            "culture": "en-US" 
        };

		let accessToken = undefined;
		let counter = 0;
		const maxNumberOfAttempts = 10;

		// Use maxNumberOfAttempts to stop after too long an attempt to create a session.
		while(!accessToken && counter < maxNumberOfAttempts)
		{
			const res = await this.httpService.post(url, body);
			accessToken = res["AccessToken"];

			// Sleep for 2 secs, to not make too many calls.
			if(!accessToken)
			{
				await new Promise(r => setTimeout(r, 2000));
			}

			counter++;
		}

		if(!accessToken)
		{
			throw new Error(`${maxNumberOfAttempts} tries to create a session failed.`);
		}

		return new CPIService(this.client, webAPIBaseURL, accessToken);
	}

	protected async getWebAPIBaseURL(): Promise<string> {
		const res = await this.httpService.get(this.papiBaseURL + "/webapi/base_url");
        return res["BaseURL"] + "/Service1.svc/v1";
	}
}
