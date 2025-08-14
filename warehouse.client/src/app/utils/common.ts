import { Store } from "@ngrx/store";
import { selectResourcesLoading } from "../state/resources/resources.selector";
import { mergeMap, takeWhile, tap } from "rxjs";
import { ResourcesActions } from "../state/resources/resources.actions";
import { HttpClient } from "@angular/common/http";
import { Resource } from "../state/resources/resource";

export function fetchActiveResources(store: Store, http: HttpClient) {
  store.select(selectResourcesLoading).pipe(
    takeWhile(isLoading => isLoading === null),
      tap((val) => {
        setTimeout(() => { store.dispatch(ResourcesActions.loadingResources({})); });
      }),
      mergeMap((val) => {
        console.log('inside mergeMap, will now return an HTTP get')
        return http.get<Array<Resource>>('api/resources/all');
      }),
    ).subscribe({
      next: (value) => {
        console.log('Pipe Next: loaded an array of items', value);
        store.dispatch(ResourcesActions.loadedResources({ items: value }));
      },
      error: (err) => {
        console.log('Failed resources loading');
        console.error(err);
      },
      complete: () => {
        console.log('Resources loading complete');
      }
    });
}
