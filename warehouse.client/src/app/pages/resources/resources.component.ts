import { Component, inject, OnInit } from '@angular/core';
import { Column, ColumnType, FilteringType, GridComponent } from '../../utils/components/grid/grid.component';
import { Store } from '@ngrx/store';
import { map, mergeMap, Observable, takeWhile, tap } from 'rxjs';
import { Resource, ResourceStatus } from '../../state/resources/resource';
import { selectResources, selectResourcesLoading } from '../../state/resources/resources.selector';
import { HttpClient } from '@angular/common/http';
import { ResourcesActions } from '../../state/resources/resources.actions';
import { CommonModule } from '@angular/common';
import { fetchActiveResources } from '../../utils/common';
import { Router } from '@angular/router';
import { TableRowSelectEvent } from 'primeng/table';
import { resourceStatusName } from '../../utils/pipes/resource-status.pipe';

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
  private router: Router;
  public items$: Observable<ReadonlyArray<Resource>>;
  public isLoading$: Observable<boolean>;

  public readonly columns: Column[] = [
    {
      field: 'name',
      type: ColumnType.TEXT,
      filtering: FilteringType.NONE,
      title: 'Наименование',
    },
    {
      field: 'status',
      type: ColumnType.RESOURCESTATUS,
      filtering: FilteringType.RESOURCESTATUS,
      title: 'Статус',
      selectOptions: [
        { title: resourceStatusName(ResourceStatus.Active), value: ResourceStatus.Active },
        { title: resourceStatusName(ResourceStatus.Archived), value: ResourceStatus.Archived },
      ],
    },
  ];

  constructor() {
    this.http = inject(HttpClient);
    this.store = inject(Store);
    this.router = inject(Router);
    this.items$ = this.store.select(selectResources);
    this.isLoading$ = this.store.select(selectResourcesLoading).pipe(map(value => value === null ? true : value));
  }

  ngOnInit(): void {
    fetchActiveResources(this.store, this.http);
  }

  onClickAddNewResource() {
    this.router.navigateByUrl('/resources/edit');
  }

  onClickResource(event: TableRowSelectEvent) {
    const item: Resource = event.data;
    console.log(item);
    this.store.dispatch(ResourcesActions.editResource({ item }));
    this.router.navigateByUrl('/resources/edit');
  }
}
