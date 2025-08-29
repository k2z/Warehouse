import { CommonModule } from '@angular/common';
import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { Column, ColumnType, FilteringType, GridComponent } from '../../utils/components/grid/grid.component';
import { HttpClient } from '@angular/common/http';
import { Store } from '@ngrx/store';
import { Router } from '@angular/router';
import { combineLatest, map, Observable, Subject, takeUntil } from 'rxjs';
import { Shipment } from '../../state/shipments/shipment';
import { selectShipments, selectShipmentsCount, selectShipmentsLoading, selectShipmentsLoadingNumbers, selectShipmentsNumbers } from '../../state/shipments/shipment.selector';
import { selectResources, selectResourcesLoading } from '../../state/resources/resources.selector';
import { selectMeasures, selectMeasuresLoading } from '../../state/measures/measures.selector';
import { selectClients, selectClientsLoading } from '../../state/clients/clients.selector';
import { TableLazyLoadEvent, TableRowSelectEvent } from 'primeng/table';
import { gridFilterToBeFilter, Page } from '../../utils/utils';
import { ShipmentsActions } from '../../state/shipments/shipment.actions';
import { fetchActiveClients, fetchActiveMeasures, fetchActiveResources, fetchIncomeNumbers } from '../../utils/common';

export type ShipmentDisplayItem = Shipment & {
  includingResources: Array<string>,
  includingMeasures: Array<string>,
}

@Component({
  selector: 'app-shipments',
  templateUrl: './shipments.component.html',
  imports: [
    CommonModule,
    GridComponent,
  ],
})
export class ShipmentsComponent implements OnInit, OnDestroy {
  private http: HttpClient;
  private store: Store;
  private router: Router;
  private destroyed$: Subject<void> = new Subject<void>();
  public items$: Observable<ReadonlyArray<ShipmentDisplayItem>>;
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
      field: 'client',
      type: ColumnType.TEXT,
      filtering: FilteringType.MULTISELECT,
      selectOptions: [],
      title: 'Клиент',
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
    this.items$ = this.store.select(selectShipments).pipe(
      map((items) => items.map((i) => {
        return {
          ...i,
          includingResources: i.items.map(ii => ii.resource),
          includingMeasures: i.items.map(ii => ii.measure),
        };
      }))
    );
    this.itemsCount$ = this.store.select(selectShipmentsCount);
    this.isLoading$ = combineLatest(
      [
        this.store.select(selectShipmentsLoading),
        this.store.select(selectResourcesLoading),
        this.store.select(selectMeasuresLoading),
        this.store.select(selectClientsLoading),
        this.store.select(selectShipmentsLoadingNumbers),
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
    const urlParams: string[] = [];
    urlParams.push(`skip=${gridLoadEvent.first ?? 0}`);
    urlParams.push(`take=${gridLoadEvent.rows ?? 10}`);
    if (gridLoadEvent.filters) {
      const filterData = gridFilterToBeFilter(gridLoadEvent.filters);
      for (let filterDataItem of filterData) {
        urlParams.push(`filter=${
          encodeURI(JSON.stringify(filterDataItem))
        }`);
      }
    }
    this.http.get<Page<Shipment>>(`api/shipments/all?${urlParams.join('&')}`)
      .subscribe(page => {
        this.store.dispatch(ShipmentsActions.loadedShipments(page));
      });
  };

  ngOnInit(): void {
    this.store.select(selectShipmentsNumbers).pipe(
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
    this.store.select(selectClients).pipe(
      takeUntil(this.destroyed$.asObservable())
    ).subscribe((items) => {
      const colSetting = this.columns.find(c => c.field === 'client');
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
    this.store.dispatch(ShipmentsActions.unloadShipments({}));
  }

  onClickAddNewShipment() {
    this.router.navigateByUrl('/shipments/edit');
  }

  onClickShipment(event: TableRowSelectEvent) {
    const item: Shipment = event.data;
    this.store.dispatch(ShipmentsActions.editShipment({ item }));
    this.router.navigateByUrl('/shipments/edit');
  }
}
