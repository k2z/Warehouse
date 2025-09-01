import { createFeatureSelector, createSelector } from "@ngrx/store";
import { BalancesState } from "./balances.reducer";

export const selectFeature = createFeatureSelector<BalancesState>('balances');

export const selectBalances = createSelector(
  selectFeature,
  (state: BalancesState) => state.items
);

export const selectBalancesCount = createSelector(
  selectFeature,
  (state: BalancesState) => state.count
);

export const selectBalancesLoading = createSelector(
  selectFeature,
  (state: BalancesState) => state.isLoading
);
