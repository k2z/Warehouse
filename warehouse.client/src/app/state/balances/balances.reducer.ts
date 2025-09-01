import { createReducer, on } from "@ngrx/store";
import { GridPageParams } from "../../utils/utils";
import { Balance } from "./balance";
import { BalancesActions } from "./balances.actions";

export type BalancesState = {
  items: ReadonlyArray<Balance>;
  count: number;
  isLoading: boolean | null;
  gridPageParams?: GridPageParams;
};

export const initialState: BalancesState = {
  items: [],
  count: 0,
  isLoading: null,
  gridPageParams: undefined,
};

export const balancesReducer = createReducer(
  initialState,
  on(BalancesActions.loadingBalances, (_state, { gridPageParams }) => { return { ..._state, gridPageParams: gridPageParams, isLoading: true }; }),
  on(BalancesActions.loadedBalances, (_state, { items, count }) => { return {
    ..._state,
    items,
    count,
    isLoading: false,
  }; }),
  on(BalancesActions.unloadBalances, (_state, action) => { return { ...initialState }; }),
);
