import { createFeatureSelector, createSelector } from "@ngrx/store";
import { Resource } from "./resource";
import { ApplicationState } from "../app.state";
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
