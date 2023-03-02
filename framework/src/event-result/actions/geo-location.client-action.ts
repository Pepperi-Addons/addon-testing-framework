import { ClientAction } from "./client-action";

const accountDataArr: {
	City: string;
	Country: string;
	Street: string;
	Latitude?: number;
	Longitude?: number;
  }[] = [
	{
		City: "Radeberg",
		Country: "Germany",
		Street: "Pulsnitzer Str. 33",
		Latitude: 51.12013,
		Longitude: 13.92224,
	},
	{
		City: "Havelberg",
		Country: "Germany",
		Street: "Pritzwalker Str.70",
		Latitude: 52.83634,
		Longitude: 12.0816,
	},
	{
		City: "Wedemark",
		Country: "Germany",
		Street: "Langer Acker 1",
		Latitude: 52.51669,
		Longitude: 9.73096,
	},
	{
		City: "Rostock",
		Country: "Germany",
		Street: "Seidenstraße 5",
		Latitude: 54.0902,
		Longitude: 12.14491,
	}
];

interface GeoLocationClientActionData {
	Accuracy: string;
    MaxWaitTime: number;
}

interface GeoLocationClientActionResult {
	Success: boolean;
    Longitude: number;
    Latitude: number;
    Accuracy: number;
    ErrorMessage?: string;
}

export class GeoLocationClientAction extends ClientAction<GeoLocationClientActionData, GeoLocationClientActionResult> {

	/**
    This method sets a random location in response to a geo location request.
    @return {@link Promise} of {@link EventResult} containing the random location information
    */
	async setRandomLocation() {
		const randIndex = Math.floor(Math.random() * 3) + 1;
		const randAccuracy = Math.floor(Math.random() * 100) + 1;

		return await this.setResult({
			Success: true,
			Longitude: accountDataArr[randIndex].Longitude!,
			Latitude: accountDataArr[randIndex].Latitude!,
			Accuracy: randAccuracy,
		});
	}
}
