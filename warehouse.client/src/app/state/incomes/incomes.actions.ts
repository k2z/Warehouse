import { createActionGroup, props } from "@ngrx/store";
import { Income } from "./income";
import { GridPageParams } from "../../utils/utils";


export const IncomesActions = createActionGroup({
  source: 'Incomes',
  events: {
    'Add Income': props<{ item: Income }>(),
    'Update Income': props<{ item: Income }>(),
    'Delete Income': props<{ id: number }>(),
    'Loading Incomes': props<{ gridPageParams?: GridPageParams }>(),
    'Loaded Incomes': props<{ items: ReadonlyArray<Income>, count: number }>(),
    'Unload Incomes': props<{ optional?: string }>(),
    'Loading Income Numbers': props<{ optional?: string }>(),
    'Loaded Income Numbers': props<{ items: Array<string> }>(),
    'Edit Income': props<{ item: Income }>(),
    'Reset Edit Income': props<{ optional?: string }>(),
  },
});
