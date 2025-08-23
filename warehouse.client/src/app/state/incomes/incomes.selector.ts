import { createFeatureSelector, createSelector } from "@ngrx/store";
import { IncomesState } from "./incomes.reducer";


export const selectFeature = createFeatureSelector<IncomesState>('incomes');

export const selectIncomes = createSelector(
  selectFeature,
  (state: IncomesState) => state.items
);

export const selectIncomesCount = createSelector(
  selectFeature,
  (state: IncomesState) => state.count
);

export const selectIncomesLoading = createSelector(
  selectFeature,
  (state: IncomesState) => state.isLoading
);

export const selectIncomeToEdit = createSelector(
  selectFeature,
  (state: IncomesState) => state.editingIncome
);
