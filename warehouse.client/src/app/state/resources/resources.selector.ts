import { createFeatureSelector, createSelector } from "@ngrx/store";
import { ResourcesState } from "./resources.reducer";

export const selectFeature = createFeatureSelector<ResourcesState>('resources');

export const selectResources = createSelector(
  selectFeature,
  (state: ResourcesState) => state.items
);

export const selectResourcesLoading = createSelector(
  selectFeature,
  (state: ResourcesState) => state.isLoading
);

export const selectResourceToEdit = createSelector(
  selectFeature,
  (state: ResourcesState) => state.editingResource
);
