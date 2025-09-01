import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { Column, ColumnType, FilteringType, GridComponent } from '../../utils/components/grid/grid.component';
import { CommonModule } from '@angular/common';
import { Balance } from '../../state/balances/balance';
import { HttpClient } from '@angular/common/http';
import { Store } from '@ngrx/store';
import { map, Observable, Subject } from 'rxjs';
import { selectBalances, selectBalancesCount, selectBalancesLoading } from '../../state/balances/balances.selector';
import { BalancesActions } from '../../state/balances/balances.actions';

@Component({
  selector: 'app-balances',
  templateUrl: './balances.component.html',
  imports: [
    CommonModule,
    GridComponent,
  ],
})
export class BalancesComponent implements OnInit, OnDestroy {
  private http: HttpClient;
  private store: Store;
  private destroyed$: Subject<void> = new Subject<void>();
  public items$: Observable<ReadonlyArray<Balance>>;
  public itemsCount$: Observable<number>;
  public isLoading$: Observable<boolean>;

  columns: Column[] = [
    {
      title: 'Ресурс',
      field: 'resource',
      type: ColumnType.TEXT,
      filtering: FilteringType.NONE,
      selectOptions: []
    },
    {
      title: 'Единица измерения',
      field: 'measure',
      type: ColumnType.TEXT,
      filtering: FilteringType.NONE,
      selectOptions: []
    },
    {
      title: 'Количество',
      field: 'count',
      type: ColumnType.TEXT,
      filtering: FilteringType.NONE
    },
  ];

  constructor() {
    this.http = inject(HttpClient);
    this.store = inject(Store);
    this.items$ = this.store.select(selectBalances);
    this.itemsCount$ = this.store.select(selectBalancesCount);
    this.isLoading$ = this.isLoading$ = this.store.select(selectBalancesLoading).pipe(map(value => value === null ? true : value));
  }

  ngOnInit(): void {
    this.http.get<Array<Balance>>('api/balances/all').subscribe({
      next: (value) => {
        //console.log('Pipe Next: loaded an array of items', value);
        this.store.dispatch(BalancesActions.loadedBalances({ items: value, count: value.length }));
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

  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }
}
