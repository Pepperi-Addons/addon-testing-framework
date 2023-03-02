import { ClientAction } from "./client-action";

interface DialogClientActionData {
	Title: string;
	Content: string;
	IsHtml: boolean;
	Actions: {
		Title: string;
		Key?: string;
	}[];
}

interface DialogClientActionResult {
	SelectedAction: string
}

export class DialogClientAction extends ClientAction<DialogClientActionData, DialogClientActionResult> {

	public async selectActionK(k: number)
	{
		const result: DialogClientActionResult = {
			SelectedAction: this.data.Actions[k].Key!
		};

		return await this.setResult(result);
	}
}
