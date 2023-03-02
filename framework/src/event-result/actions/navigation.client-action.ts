import { EventResult } from "../event-result";
import { ClientAction } from "./client-action";

interface NavigationClientActionData {
}

interface NavigationClientActionResult {

}

export class NavigationClientAction extends ClientAction<NavigationClientActionData, NavigationClientActionResult> {
	
	public setResult(result: NavigationClientActionResult): Promise<EventResult> {
		throw new Error("Navigation is always the last action.")
	}
}