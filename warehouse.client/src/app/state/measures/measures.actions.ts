import { Measure } from "./measure";
import { createActionGroup, props } from "@ngrx/store";
import { GridPageParams } from "../../utils/utils";

export const MeasuresActions = createActionGroup({
  source: 'Measures',
  events: {
    'Add Measure': props<{ item: Measure }>(),
    'Update Measure': props<{ item: Measure }>(),
    'Delete Measure': props<{ id: number }>(),
    'Loading Measures': props<{ gridPageParams?: GridPageParams }>(),
    'Loaded Measures': props<{ items: ReadonlyArray<Measure> }>(),
    'Unload Measures': props<{ optional?: string }>(),
    'Edit Measure': props<{ item: Measure }>(),
    'Reset Edit Measure': props<{ optional?: string }>(),
  },
});
