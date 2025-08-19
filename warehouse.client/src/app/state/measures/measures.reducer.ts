import { createReducer, on } from "@ngrx/store";
import { MeasuresActions } from "./measures.actions";
import { GridPageParams } from "../../utils/utils";
import { Measure } from "./measure";

export type MeasuresState = {
  items: ReadonlyArray<Measure>;
  isLoading: boolean | null;
  gridPageParams?: GridPageParams;
  editingResource?: Measure;
};

export const initialState: MeasuresState = {
  items: [],
  isLoading: null,
  gridPageParams: undefined,
};

export const measuresReducer = createReducer(
  initialState,
  on(MeasuresActions.addMeasure, (_state, { item }) => { return { ..._state, items: [ item, ...(_state.items) ] }; }),
  on(MeasuresActions.updateMeasure, (_state, { item }) => {
    const existingIndex = _state.items.findIndex(entity => entity.id === item.id);
    if (existingIndex > -1) {
      const updatedItems = [ ..._state.items ];
      updatedItems.splice(existingIndex, 1, item);
      return { ..._state, items: updatedItems };
    } else {
      return _state;
    }
  }),
  on(MeasuresActions.deleteMeasure, (_state, { id }) => {
    const existingIndex = _state.items.findIndex(entity => entity.id === id);
    if (existingIndex > -1) {
      const updatedItems = [ ..._state.items ];
      updatedItems.splice(existingIndex, 1);
      return { ..._state, items: updatedItems };
    } else {
      return _state;
    }
  }),
  on(MeasuresActions.loadingMeasures, (_state, { gridPageParams }) => { return { ..._state, gridPageParams: gridPageParams, isLoading: true }; }),
  on(MeasuresActions.loadedMeasures, (_state, { items }) => { return { ..._state, items, isLoading: false }; }),
  on(MeasuresActions.unloadMeasures, (_state, action) => initialState),
  on(MeasuresActions.editMeasure, (_state, { item }) => { return { ..._state, editingResource: item }; }),
  on(MeasuresActions.resetEditMeasure, (_state, { optional }) => { return { ..._state, editingResource: undefined }; })
);
