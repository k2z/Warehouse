import { createActionGroup, props } from "@ngrx/store";
import { GridPageParams } from "../../utils/utils";
import { Shipment } from "./shipment";


export const ShipmentsActions = createActionGroup({
  source: 'Shipments',
  events: {
    'Add Shipment': props<{ item: Shipment }>(),
    'Update Shipment': props<{ item: Shipment }>(),
    'Delete Shipment': props<{ id: number }>(),
    'Loading Shipments': props<{ gridPageParams?: GridPageParams }>(),
    'Loaded Shipments': props<{ items: ReadonlyArray<Shipment>, count: number }>(),
    'Unload Shipments': props<{ optional?: string }>(),
    'Loading Shipment Numbers': props<{ optional?: string }>(),
    'Loaded Shipment Numbers': props<{ items: Array<string> }>(),
    'Edit Shipment': props<{ item: Shipment }>(),
    'Reset Edit Shipment': props<{ optional?: string }>(),
  },
});
