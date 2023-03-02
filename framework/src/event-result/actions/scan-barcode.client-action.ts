import { ClientAction, EventResult }  from "../index";

export interface ScanBarcodeClientActionData {

}

export interface ScanBarcodeClientActionResult {

}

export class ScanBarcodeClientAction extends ClientAction<ScanBarcodeClientActionData, ScanBarcodeClientActionResult> {

	async setBarcode(barcode: string, success = true, errorMessage: "" | "UserCanceled" | "AccessDenied" = ""): Promise<EventResult> {
		return await this.setResult({
			Success: success,
			Barcode: barcode,
			ErrorMessage: errorMessage
		});
	}
}