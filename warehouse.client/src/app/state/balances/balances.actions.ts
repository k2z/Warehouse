import { createActionGroup, props } from "@ngrx/store";
import { GridPageParams } from "../../utils/utils";
import { Balance } from "./balance";


export const BalancesActions = createActionGroup({
  source: 'Balances',
  events: {
    'Loading Balances': props<{ gridPageParams?: GridPageParams }>(),
    'Loaded Balances': props<{ items: ReadonlyArray<Balance>, count: number }>(),
    'Unload Balances': props<{ optional?: string }>(),
  },
});
