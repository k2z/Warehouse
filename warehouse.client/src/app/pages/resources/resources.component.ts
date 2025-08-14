import { Component, inject, OnInit } from '@angular/core';
import { Column, FilteringType, GridComponent } from '../../utils/components/grid/grid.component';
import { Store } from '@ngrx/store';
import { map, mergeMap, Observable, takeWhile, tap } from 'rxjs';
import { Resource } from '../../state/resources/resource';
import { selectResources, selectResourcesLoading } from '../../state/resources/resources.selector';
import { HttpClient } from '@angular/common/http';
import { ResourcesActions } from '../../state/resources/resources.actions';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-resources',
  templateUrl: './resources.component.html',
  styleUrl: './resources.component.css',
  imports: [
    CommonModule,
    GridComponent,
  ],
})
export class ResourcesComponent implements OnInit {
  private http: HttpClient;
  private store: Store;
  public items$: Observable<ReadonlyArray<Resource>>;
  public isLoading$: Observable<boolean>;

  public readonly columns: Column[] = [
    {
      field: 'name',
      filtering: FilteringType.NONE,
      title: 'Наименование',
    },
  ];

  constructor() {
    this.http = inject(HttpClient);
    this.store = inject(Store);
    this.items$ = this.store.select(selectResources);
    this.isLoading$ = this.store.select(selectResourcesLoading).pipe(map(value => value === null ? true : value));
  }

  // takeWhile
  ngOnInit(): void {
    this.store.select(selectResourcesLoading).pipe(
      takeWhile(isLoading => isLoading === null),
      mergeMap((val) => {
        console.log('inside mergeMap, will now return an HTTP get')
        return this.http.get<Array<Resource>>('api/resources');
      }),
    ).subscribe({
      next: (value) => {
        console.log('Pipe Next: loaded an array of items', value);
        this.store.dispatch(ResourcesActions.loadedResources({ items: value }));
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
}
