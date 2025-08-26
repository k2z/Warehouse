import { Store } from "@ngrx/store";
import { selectResourcesLoading } from "../state/resources/resources.selector";
import { mergeMap, takeWhile, tap } from "rxjs";
import { ResourcesActions } from "../state/resources/resources.actions";
import { HttpClient } from "@angular/common/http";
import { Resource } from "../state/resources/resource";
import { MeasuresActions } from "../state/measures/measures.actions";
import { Measure } from "../state/measures/measure";
import { selectClientsLoading } from "../state/clients/clients.selector";
import { ClientsActions } from "../state/clients/clients.actions";
import { Client } from "../state/clients/client";
import { selectMeasuresLoading } from "../state/measures/measures.selector";
import {selectIncomesLoadingNumbers} from "../state/incomes/incomes.selector";
import {IncomesActions} from "../state/incomes/incomes.actions";

export function fetchActiveResources(store: Store, http: HttpClient) {
  store.select(selectResourcesLoading).pipe(
    takeWhile(isLoading => isLoading === null),
      tap((val) => {
        setTimeout(() => { store.dispatch(ResourcesActions.loadingResources({})); });
      }),
      mergeMap((val) => {
        //console.log('inside mergeMap, will now return an HTTP get')
        return http.get<Array<Resource>>('api/resources/all');
      }),
    ).subscribe({
      next: (value) => {
        //console.log('Pipe Next: loaded an array of items', value);
        store.dispatch(ResourcesActions.loadedResources({ items: value }));
      },
      error: (err) => {
        //console.log('Failed resources loading');
        console.error(err);
      },
      complete: () => {
        //console.log('Resources loading complete');
      }
    });
}

export function fetchActiveMeasures(store: Store, http: HttpClient) {
  store.select(selectMeasuresLoading).pipe(
    takeWhile(isLoading => isLoading === null),
      tap((val) => {
        setTimeout(() => { store.dispatch(MeasuresActions.loadingMeasures({})); });
      }),
      mergeMap((val) => {
        //console.log('inside mergeMap, will now return an HTTP get')
        return http.get<Array<Measure>>('api/measures/all');
      }),
    ).subscribe({
      next: (value) => {
        //console.log('Pipe Next: loaded an array of items', value);
        store.dispatch(MeasuresActions.loadedMeasures({ items: value }));
      },
      error: (err) => {
        //console.log('Failed measures loading');
        console.error(err);
      },
      complete: () => {
        //console.log('Measures loading complete');
      }
    });
}

export function fetchActiveClients(store: Store, http: HttpClient) {
  store.select(selectClientsLoading).pipe(
    takeWhile(isLoading => isLoading === null),
      tap((val) => {
        setTimeout(() => { store.dispatch(ClientsActions.loadingClients({})); });
      }),
      mergeMap((val) => {
        //console.log('inside mergeMap, will now return an HTTP get')
        return http.get<Array<Client>>('api/clients/all');
      }),
    ).subscribe({
      next: (value) => {
        //console.log('Pipe Next: loaded an array of items', value);
        store.dispatch(ClientsActions.loadedClients({ items: value }));
      },
      error: (err) => {
        //console.log('Failed measures loading');
        console.error(err);
      },
      complete: () => {
        //console.log('Measures loading complete');
      }
    });
}

export function fetchIncomeNumbers(store: Store, http: HttpClient) {
  store.select(selectIncomesLoadingNumbers).pipe(
    takeWhile(isLoading => isLoading === null),
    tap((val) => {
      setTimeout(() => { store.dispatch(IncomesActions.loadingIncomeNumbers({})); });
    }),
    mergeMap((val) => {
      return http.get<Array<string>>('api/incomes/allnumbers');
    }),
  ).subscribe({
    next: (value) => {
      store.dispatch(IncomesActions.loadedIncomeNumbers({ items: value }));
    },
    error: (err) => {
      console.error(err);
    },
    complete: () => {
      //
    }
  })
}
