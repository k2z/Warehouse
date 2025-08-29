import { createFeatureSelector, createSelector } from "@ngrx/store";
import { ShipmentsState } from "./shipment.reducer";


export const selectFeature = createFeatureSelector<ShipmentsState>('shipments');

export const selectIncomes = createSelector(
  selectFeature,
  (state: ShipmentsState) => state.items
);

export const selectIncomesLoadingNumbers = createSelector(
  selectFeature,
  (state: ShipmentsState) => state.isLoadingNumbers
);

export const selectIncomesNumbers = createSelector(
  selectFeature,
  (state: ShipmentsState) => state.numbers
);

export const selectIncomesCount = createSelector(
  selectFeature,
  (state: ShipmentsState) => state.count
);

export const selectIncomesLoading = createSelector(
  selectFeature,
  (state: ShipmentsState) => state.isLoading
);

export const selectIncomeToEdit = createSelector(
  selectFeature,
  (state: ShipmentsState) => state.editingIncome
);
