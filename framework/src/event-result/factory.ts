import { EventsService } from "../services"
import { DialogClientAction, HUDClientAction } from "./actions"
import { FilePickerClientAction } from "./actions/file-picker.client-action"
import { ScanBarcodeClientAction } from "./actions/scan-barcode.client-action"
import { Finish } from "./finish"

export type EventResultType = 'Dialog' | 'GeoLocation' | 'HUD' | 'Modal' | 'Navigation' | 'Barcode' | 'FilePicker' | "UserEvent" | "Finish"

const actions = () => {
    return {
        'Barcode': ScanBarcodeClientAction,
        'Dialog': DialogClientAction,
        'FilePicker': FilePickerClientAction,
        'GeoLocation': Finish,
        'HUD': HUDClientAction,
        'Modal': Finish,
        'Navigation': Finish,
        'UserEvent': Finish,
        'Finish': Finish,
    }
}

export type EventResultCast<Type extends EventResultType> = InstanceType<ReturnType<typeof actions>[Type]>

export class EventResultFactory {

    actions = actions()

    create(eventService: EventsService, data: any, callbackKey: string, actionType: EventResultType): any {
        return new this.actions[actionType](eventService, actionType, data, callbackKey)
    }
}