import { createFeatureSelector, createSelector } from "@ngrx/store";
import { ClientsState } from "./clients.reducer";

export const selectFeature = createFeatureSelector<ClientsState>('clients');

export const selectClients = createSelector(
  selectFeature,
  (state: ClientsState) => state.items
);

export const selectClientsLoading = createSelector(
  selectFeature,
  (state: ClientsState) => state.isLoading
);

export const selectClientToEdit = createSelector(
  selectFeature,
  (state: ClientsState) => state.editingResource
);
