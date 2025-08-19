import { Component, inject, OnInit } from '@angular/core';
import { Column, ColumnType, FilteringType, GridComponent } from '../../utils/components/grid/grid.component';
import { Store } from '@ngrx/store';
import { map, mergeMap, Observable, takeWhile, tap } from 'rxjs';
import { selectMeasures, selectMeasuresLoading } from '../../state/measures/measures.selector';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { fetchActiveMeasures, fetchActiveResources } from '../../utils/common';
import { Router } from '@angular/router';
import { TableRowSelectEvent } from 'primeng/table';
import { Measure, MeasureStatus } from '../../state/measures/measure';
import { MeasuresActions } from '../../state/measures/measures.actions';
import { measureStatusName } from '../../utils/pipes/measure-status.pipe';

@Component({
  selector: 'app-measures',
  templateUrl: './measures.component.html',
  imports: [
    CommonModule,
    GridComponent,
  ],
})
export class MeasuresComponent implements OnInit {
  private http: HttpClient;
  private store: Store;
  private router: Router;
  public items$: Observable<ReadonlyArray<Measure>>;
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
      type: ColumnType.MEASURESTATUS,
      filtering: FilteringType.MEASURESTATUS,
      title: 'Статус',
      selectOptions: [
        { title: measureStatusName(MeasureStatus.Active), value: MeasureStatus.Active },
        { title: measureStatusName(MeasureStatus.Archived), value: MeasureStatus.Archived },
      ],
    },
  ];

  constructor() {
    this.http = inject(HttpClient);
    this.store = inject(Store);
    this.router = inject(Router);
    this.items$ = this.store.select(selectMeasures);
    this.isLoading$ = this.store.select(selectMeasuresLoading).pipe(map(value => value === null ? true : value));
  }

  ngOnInit(): void {
    fetchActiveMeasures(this.store, this.http);
  }

  onClickAddNewResource() {
    this.router.navigateByUrl('/measures/edit');
  }

  onClickResource(event: TableRowSelectEvent) {
    const item: Measure = event.data;
    this.store.dispatch(MeasuresActions.editMeasure({ item }));
    this.router.navigateByUrl('/measures/edit');
  }
}
