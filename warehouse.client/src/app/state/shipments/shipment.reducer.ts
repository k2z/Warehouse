import { createReducer, on } from "@ngrx/store";
import { GridPageParams } from "../../utils/utils";
import { Shipment } from "./shipment";
import { ShipmentsActions } from "./shipment.actions";


export type ShipmentsState = {
  items: ReadonlyArray<Shipment>;
  count: number;
  isLoading: boolean | null;
  gridPageParams?: GridPageParams;
  editingShipment?: Shipment;
  numbers: ReadonlyArray<string>;
  isLoadingNumbers: boolean | null;
};

export const initialState: ShipmentsState = {
  items: [],
  count: 0,
  isLoading: null,
  gridPageParams: undefined,
  editingShipment: undefined,
  numbers: [],
  isLoadingNumbers: null,
};

export const shipmentsReducer = createReducer(
  initialState,
  on(ShipmentsActions.addShipment, (_state, { item }) => {
    return {
      ..._state,
      items: [ item, ...(_state.items) ],
      count: _state.count + 1,
    }; }),
  on(ShipmentsActions.updateShipment, (_state, { item }) => {
    const existingIndex = _state.items.findIndex(entity => entity.id === item.id);
    if (existingIndex > -1) {
      const updatedItems = [ ..._state.items ];
      updatedItems.splice(existingIndex, 1, item);
      return { ..._state, items: updatedItems };
    } else {
      return _state;
    }
  }),
  on(ShipmentsActions.deleteShipment, (_state, { id }) => {
    const existingIndex = _state.items.findIndex(entity => entity.id === id);
    if (existingIndex > -1) {
      const updatedItems = [ ..._state.items ];
      updatedItems.splice(existingIndex, 1);
      return {
        ..._state,
        items: updatedItems,
        count: _state.count - 1,
      };
    } else {
      return _state;
    }
  }),
  on(ShipmentsActions.loadingShipments, (_state, { gridPageParams }) => { return { ..._state, gridPageParams: gridPageParams, isLoading: true }; }),
  on(ShipmentsActions.loadedShipments, (_state, { items, count }) => { return {
    ..._state,
    items,
    count,
    isLoading: false,
  }; }),
  on(ShipmentsActions.unloadShipments, (_state, action) => { return { ...initialState, editingShipment: _state.editingShipment }; }),
  on(ShipmentsActions.editShipment, (_state, { item }) => { return { ..._state, editingShipment: item }; }),
  on(ShipmentsActions.resetEditShipment, (_state, { optional }) => { return { ..._state, editingShipment: undefined }; }),
  on(ShipmentsActions.loadingShipmentNumbers, (_state, { optional }) => { return { ..._state, isLoadingNumbers: true } }),
  on(ShipmentsActions.loadedShipmentNumbers, (_state, { items }) => {
    return { ..._state, numbers: items, isLoadingNumbers: false };
  })
);
