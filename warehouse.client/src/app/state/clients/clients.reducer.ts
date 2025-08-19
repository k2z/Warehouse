import { createReducer, on } from "@ngrx/store";
import { GridPageParams } from "../../utils/utils";
import { Client } from "./client";
import { ClientsActions } from "./clients.actions";

export type ClientsState = {
  items: ReadonlyArray<Client>;
  isLoading: boolean | null;
  gridPageParams?: GridPageParams;
  editingResource?: Client;
};

export const initialState: ClientsState = {
  items: [],
  isLoading: null,
  gridPageParams: undefined,
};

export const clientsReducer = createReducer(
  initialState,
  on(ClientsActions.addClient, (_state, { item }) => { return { ..._state, items: [ item, ...(_state.items) ] }; }),
  on(ClientsActions.updateClient, (_state, { item }) => {
    const existingIndex = _state.items.findIndex(entity => entity.id === item.id);
    if (existingIndex > -1) {
      const updatedItems = [ ..._state.items ];
      updatedItems.splice(existingIndex, 1, item);
      return { ..._state, items: updatedItems };
    } else {
      return _state;
    }
  }),
  on(ClientsActions.deleteClient, (_state, { id }) => {
    const existingIndex = _state.items.findIndex(entity => entity.id === id);
    if (existingIndex > -1) {
      const updatedItems = [ ..._state.items ];
      updatedItems.splice(existingIndex, 1);
      return { ..._state, items: updatedItems };
    } else {
      return _state;
    }
  }),
  on(ClientsActions.loadingClients, (_state, { gridPageParams }) => { return { ..._state, gridPageParams: gridPageParams, isLoading: true }; }),
  on(ClientsActions.loadedClients, (_state, { items }) => { return { ..._state, items, isLoading: false }; }),
  on(ClientsActions.unloadClients, (_state, action) => initialState),
  on(ClientsActions.editClient, (_state, { item }) => { return { ..._state, editingResource: item }; }),
  on(ClientsActions.resetEditClient, (_state, { optional }) => { return { ..._state, editingResource: undefined }; })
);
