import { ClientAction } from "./client-action";

interface HUDClientActionData {
	HUDKey?: string;
	State: string;
	Message?: string;
	CloseMessage?: string;
	CancelEventKey?: string;
	Interval?: number;
}

interface HUDClientActionResult {
	Success: boolean;
    HUDKey: string;
    ErrorMessage: string;
}

export class HUDClientAction extends ClientAction<HUDClientActionData, HUDClientActionResult> {	
	
}
