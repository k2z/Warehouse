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
import { selectResourcesLoading } from '../../state/resources/resources.selector';
import { selectMeasuresLoading } from '../../state/measures/measures.selector';
import { selectClientsLoading } from '../../state/clients/clients.selector';
import { TableLazyLoadEvent, TableRowSelectEvent } from 'primeng/table';
import { Page } from '../../utils/utils';
import { IncomesActions } from '../../state/incomes/incomes.actions';

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
  public items$: Observable<ReadonlyArray<Income>>;
  public itemsCount$: Observable<number>;
  public isLoading$: Observable<boolean>;

  public readonly columns: Column[] = [
    {
      field: 'number',
      type: ColumnType.TEXT,
      filtering: FilteringType.MULTISELECT,
      selectOptions: [], // TODO fulfill
      title: 'Номер',
    },
    /*
      TODO: columns for Resources and Measurements
    */
  ];

  constructor() {
    this.http = inject(HttpClient);
    this.store = inject(Store);
    this.router = inject(Router);
    this.items$ = this.store.select(selectIncomes);
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
      const numbersColSetting = this.columns.find(c => c.field === 'number');
      if (numbersColSetting) {
        numbersColSetting.selectOptions = items.map((item) => { return { title: item, value: item }; });
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
