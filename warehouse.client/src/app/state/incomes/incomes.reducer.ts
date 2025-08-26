import { createReducer, on } from "@ngrx/store";
import { GridPageParams } from "../../utils/utils";
import { Income } from "./income";
import { IncomesActions } from "./incomes.actions";


export type IncomesState = {
  items: ReadonlyArray<Income>;
  count: number;
  isLoading: boolean | null;
  gridPageParams?: GridPageParams;
  editingIncome?: Income;
  numbers: ReadonlyArray<string>;
  isLoadingNumbers: boolean | null;
};

export const initialState: IncomesState = {
  items: [],
  count: 0,
  isLoading: null,
  gridPageParams: undefined,
  editingIncome: undefined,
  numbers: [],
  isLoadingNumbers: null,
};

export const incomesReducer = createReducer(
  initialState,
  on(IncomesActions.addIncome, (_state, { item }) => {
    return {
      ..._state,
      items: [ item, ...(_state.items) ],
      count: _state.count + 1,
    }; }),
  on(IncomesActions.updateIncome, (_state, { item }) => {
    const existingIndex = _state.items.findIndex(entity => entity.id === item.id);
    if (existingIndex > -1) {
      const updatedItems = [ ..._state.items ];
      updatedItems.splice(existingIndex, 1, item);
      return { ..._state, items: updatedItems };
    } else {
      return _state;
    }
  }),
  on(IncomesActions.deleteIncome, (_state, { id }) => {
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
  on(IncomesActions.loadingIncomes, (_state, { gridPageParams }) => { return { ..._state, gridPageParams: gridPageParams, isLoading: true }; }),
  on(IncomesActions.loadedIncomes, (_state, { items, count }) => { return {
    ..._state,
    items,
    count,
    isLoading: false,
  }; }),
  on(IncomesActions.unloadIncomes, (_state, action) => { return { ...initialState, editingIncome: _state.editingIncome }; }),
  on(IncomesActions.editIncome, (_state, { item }) => { return { ..._state, editingIncome: item }; }),
  on(IncomesActions.resetEditIncome, (_state, { optional }) => { return { ..._state, editingIncome: undefined }; }),
  on(IncomesActions.loadingIncomeNumbers, (_state, { optional }) => { return { ..._state, isLoadingNumbers: true } }),
  on(IncomesActions.loadedIncomeNumbers, (_state, { items }) => {
    return { ..._state, numbers: items, isLoadingNumbers: false };
  })
);
