import { createFeatureSelector, createSelector } from "@ngrx/store";
import { ShipmentsState } from "./shipment.reducer";


export const selectFeature = createFeatureSelector<ShipmentsState>('shipments');

export const selectShipments = createSelector(
  selectFeature,
  (state: ShipmentsState) => state.items
);

export const selectShipmentsLoadingNumbers = createSelector(
  selectFeature,
  (state: ShipmentsState) => state.isLoadingNumbers
);

export const selectShipmentsNumbers = createSelector(
  selectFeature,
  (state: ShipmentsState) => state.numbers
);

export const selectShipmentsCount = createSelector(
  selectFeature,
  (state: ShipmentsState) => state.count
);

export const selectShipmentsLoading = createSelector(
  selectFeature,
  (state: ShipmentsState) => state.isLoading
);

export const selectShipmentToEdit = createSelector(
  selectFeature,
  (state: ShipmentsState) => state.editingShipment
);
