import { createFeatureSelector, createSelector } from "@ngrx/store";
import { MeasuresState } from "./measures.reducer";

export const selectFeature = createFeatureSelector<MeasuresState>('measures');

export const selectMeasures = createSelector(
  selectFeature,
  (state: MeasuresState) => state.items
);

export const selectMeasuresLoading = createSelector(
  selectFeature,
  (state: MeasuresState) => state.isLoading
);

export const selectMeasureToEdit = createSelector(
  selectFeature,
  (state: MeasuresState) => state.editingResource
);
