import { createReducer, on } from "@ngrx/store";
import { Resource } from "./resource";
import { ResourcesActions } from "./resources.actions";
import { GridPageParams } from "../../utils/utils";

export type ResourcesState = {
  items: ReadonlyArray<Resource>;
  isLoading: boolean | null;
  gridPageParams?: GridPageParams;
  editingResource?: Resource;
};

export const initialState: ResourcesState = {
  items: [],
  isLoading: null,
  gridPageParams: undefined,
};

export const resourcesReducer = createReducer(
  initialState,
  on(ResourcesActions.addResource, (_state, { item }) => { return { ..._state, items: [ item, ...(_state.items) ] }; }),
  on(ResourcesActions.updateResource, (_state, { item }) => {
    const existingIndex = _state.items.findIndex(entity => entity.id === item.id);
    if (existingIndex > -1) {
      const updatedItems = [ ..._state.items ];
      updatedItems.splice(existingIndex, 1, item);
      return { ..._state, items: updatedItems };
    } else {
      return _state;
    }
  }),
  on(ResourcesActions.deleteResource, (_state, { id }) => {
    const existingIndex = _state.items.findIndex(entity => entity.id === id);
    if (existingIndex > -1) {
      const updatedItems = [ ..._state.items ].splice(existingIndex, 1);
      return { ..._state, items: updatedItems };
    } else {
      return _state;
    }
  }),
  on(ResourcesActions.loadingResources, (_state, { gridPageParams }) => { return { ..._state, gridPageParams: gridPageParams, isLoading: true }; }),
  on(ResourcesActions.loadedResources, (_state, { items }) => { return { ..._state, items, isLoading: false }; }),
  on(ResourcesActions.unloadResources, (_state, action) => initialState),
  on(ResourcesActions.editResource, (_state, { item }) => { return { ..._state, editingResource: item }; }),
  on(ResourcesActions.resetEditResource, (_state, { optional }) => { return { ..._state, editingResource: undefined }; })
);
