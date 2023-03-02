import { ClientAction }  from "../index";

export interface FilePickerClientActionData {

}

export interface FilePickerClientActionResult {
	Success: boolean,
	MimeType: string,
	/**
	 * Either data URI or a URL link
	 */
	URI: string
}

export class FilePickerClientAction extends ClientAction<FilePickerClientActionData, FilePickerClientActionResult> {
	
}
