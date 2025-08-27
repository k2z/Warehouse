import { CommonModule } from '@angular/common';
import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { Column, ColumnType, FilteringType, GridComponent } from '../../utils/components/grid/grid.component';
import { combineLatest, map, Observable, Subject, takeUntil } from 'rxjs';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { HttpClient } from '@angular/common/http';
import { Income } from '../../state/incomes/income';
import {
  selectIncomes,
  selectIncomesCount,
  selectIncomesLoading,
  selectIncomesLoadingNumbers, selectIncomesNumbers
} from '../../state/incomes/incomes.selector';
import {fetchActiveClients, fetchActiveMeasures, fetchActiveResources, fetchIncomeNumbers} from '../../utils/common';
import { selectResources, selectResourcesLoading } from '../../state/resources/resources.selector';
import { selectMeasures, selectMeasuresLoading } from '../../state/measures/measures.selector';
import { selectClientsLoading } from '../../state/clients/clients.selector';
import { TableLazyLoadEvent, TableRowSelectEvent } from 'primeng/table';
import { Page } from '../../utils/utils';
import { IncomesActions } from '../../state/incomes/incomes.actions';

export type IncomeDisplayItem = Income & {
  includingResources: Array<string>,
  includingMeasures: Array<string>,
}

@Component({
  selector: 'app-incomes',
  templateUrl: './incomes.component.html',
  imports: [
    CommonModule,
    GridComponent,
  ],
})
export class IncomesComponent implements OnInit, OnDestroy {
  private http: HttpClient;
  private store: Store;
  private router: Router;
  private destroyed$: Subject<void> = new Subject<void>();
  public items$: Observable<ReadonlyArray<IncomeDisplayItem>>;
  public itemsCount$: Observable<number>;
  public isLoading$: Observable<boolean>;

  public readonly columns: Column[] = [
    {
      field: 'date',
      type: ColumnType.DATEONLY,
      filtering: FilteringType.DATERANGE,
      title: 'Дата',
    },
    {
      field: 'number',
      type: ColumnType.TEXT,
      filtering: FilteringType.MULTISELECT,
      selectOptions: [],
      title: 'Номер',
    },
    {
      field: 'includingResources',
      type: ColumnType.RESOURCES,
      title: 'Ресурсы',
      filtering: FilteringType.MULTISELECT,
      selectOptions: [],
    },
    {
      field: 'includingMeasures',
      type: ColumnType.MEASURES,
      title: 'Единицы измерения',
      filtering: FilteringType.MULTISELECT,
      selectOptions: [],
    },
  ];

  constructor() {
    this.http = inject(HttpClient);
    this.store = inject(Store);
    this.router = inject(Router);
    this.items$ = this.store.select(selectIncomes).pipe(
      map((items) => items.map((i) => {
        return {
          ...i,
          includingResources: i.items.map(ii => ii.resource),
          includingMeasures: i.items.map(ii => ii.measure),
        };
      }))
    );
    this.itemsCount$ = this.store.select(selectIncomesCount);
    this.isLoading$ = combineLatest(
      [
        this.store.select(selectIncomesLoading),
        this.store.select(selectResourcesLoading),
        this.store.select(selectMeasuresLoading),
        this.store.select(selectClientsLoading),
        this.store.select(selectIncomesLoadingNumbers),
      ],
      (loadingIncomes, loadingResources, loadingMeasures, loadingClients, loadingIncomesNumbers) => {
        return (loadingIncomes ?? true) ||
          (loadingIncomesNumbers ?? true) ||
          (loadingResources ?? true) ||
          (loadingMeasures ?? true) ||
          (loadingClients ?? true);
      }
    );
  }

  lazyLoad: (e: TableLazyLoadEvent) => void = (gridLoadEvent) => {
    const filterParamStr = encodeURI(JSON.stringify(gridLoadEvent.filters));
    console.log(filterParamStr);
    this.http.get<Page<Income>>(`api/incomes/all?skip=${
        gridLoadEvent.first ?? 0
      }&take=${
        (gridLoadEvent.rows ?? 10)
      }&filter=${filterParamStr}`)
      .subscribe(page => {
        this.store.dispatch(IncomesActions.loadedIncomes(page));
      });
  };

  ngOnInit(): void {
    this.store.select(selectIncomesNumbers).pipe(
      takeUntil(this.destroyed$.asObservable())
    ).subscribe((items) => {
      const colSetting = this.columns.find(c => c.field === 'number');
      if (colSetting) {
        colSetting.selectOptions = items.map((item) => { return { title: item, value: item }; });
      }
    });
    this.store.select(selectResources).pipe(
      takeUntil(this.destroyed$.asObservable())
    ).subscribe((items) => {
      const colSetting = this.columns.find(c => c.field === 'includingResources');
      if (colSetting) {
        colSetting.selectOptions = items.map((item) => { return { title: item.name, value: item.id }; });
      }
    });
    this.store.select(selectMeasures).pipe(
      takeUntil(this.destroyed$.asObservable())
    ).subscribe((items) => {
      const colSetting = this.columns.find(c => c.field === 'includingMeasures');
      if (colSetting) {
        colSetting.selectOptions = items.map((item) => { return { title: item.name, value: item.id }; });
      }
    });
    fetchActiveClients(this.store, this.http);
    fetchActiveResources(this.store, this.http);
    fetchActiveMeasures(this.store, this.http);
    fetchIncomeNumbers(this.store, this.http);
  }

  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
    this.store.dispatch(IncomesActions.unloadIncomes({}));
  }

  onClickAddNewIncome() {
    this.router.navigateByUrl('/incomes/edit');
  }

  onClickIncome(event: TableRowSelectEvent) {
    const item: Income = event.data;
    this.store.dispatch(IncomesActions.editIncome({ item }));
    this.router.navigateByUrl('/incomes/edit');
  }
}
