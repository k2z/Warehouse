import { Component, inject, OnDestroy, OnInit, signal, Signal, WritableSignal } from '@angular/core';
import { combineLatest, Subject, takeUntil } from "rxjs";
import { Store } from '@ngrx/store';
import { Shipment, ShipmentState } from '../../../state/shipments/shipment';
import { Resource } from '../../../state/resources/resource';
import { Measure } from '../../../state/measures/measure';
import { Client } from '../../../state/clients/client';
import { dateToDateOnly } from '../../../utils/utils';
import { toSignal } from '@angular/core/rxjs-interop';
import { selectResources, selectResourcesLoading } from '../../../state/resources/resources.selector';
import { selectMeasures, selectMeasuresLoading } from '../../../state/measures/measures.selector';
import { selectClients, selectClientsLoading } from '../../../state/clients/clients.selector';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { fetchActiveClients, fetchActiveMeasures, fetchActiveResources } from '../../../utils/common';
import { selectShipmentToEdit } from '../../../state/shipments/shipment.selector';
import { ShipmentsActions } from '../../../state/shipments/shipment.actions';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-shipment-edit',
  templateUrl: './shipment-edit.component.html',
  imports: [
    FormsModule,
  ],
})
export class ShipmentEditComponent implements OnInit, OnDestroy {
  private http: HttpClient;
  private store: Store;
  private router: Router;
  private destroyed: Subject<void> = new Subject<void>();

  isLoading: WritableSignal<boolean> = signal(true);
  isEditingExisting: WritableSignal<boolean> = signal(false);
  availableResources: Signal<ReadonlyArray<Resource> | undefined>;
  availableMeasures: Signal<ReadonlyArray<Measure> | undefined>;
  availableClients: Signal<ReadonlyArray<Client> | undefined>;
  model: Shipment = { id: 0, date: dateToDateOnly(new Date()), items: [], number: '', clientId: 0, client: '', state: ShipmentState.Created, };
  private original?: Shipment;

  constructor() {
    this.http = inject(HttpClient);
    this.store = inject(Store);
    this.router = inject(Router);

    this.availableResources = toSignal(this.store.select(selectResources));
    this.availableMeasures = toSignal(this.store.select(selectMeasures));
    this.availableClients = toSignal(this.store.select(selectClients));
  }

  ngOnInit(): void {
    fetchActiveResources(this.store, this.http);
    fetchActiveMeasures(this.store, this.http);
    fetchActiveClients(this.store, this.http);

    this.store.select(selectShipmentToEdit).pipe(
      takeUntil(this.destroyed.asObservable())
    ).subscribe((value) => {
      if (value) {
        this.original = value;
        Object.keys(value).forEach((fieldName) => {
          (this.model as any)[fieldName] = (value as any)[fieldName];
        });
        this.isEditingExisting.set(true);
      } else {
        this.model = { id: 0, date: dateToDateOnly(new Date()), items: [], number: '', clientId: 0, client: '', state: ShipmentState.Created, };
        this.isEditingExisting.set(false);
      }
    });

    combineLatest(
      [
        this.store.select(selectResourcesLoading),
        this.store.select(selectMeasuresLoading),
        this.store.select(selectClientsLoading),
      ],
      (loadingResources, loadingMeasures, loadingClients) => {
        return (loadingResources ?? true) ||
          (loadingMeasures ?? true) ||
          (loadingClients ?? true);
      }
    ).pipe(
      takeUntil(this.destroyed.asObservable())
    ).subscribe((dropdownDataLoading) => {
      this.isLoading.set(dropdownDataLoading);
    });
  }

  ngOnDestroy(): void {
    this.destroyed.next();
    this.destroyed.complete();
    this.store.dispatch(ShipmentsActions.resetEditShipment({}));
  }

  onAddNewItem(): void {
    this.model.items.push({ id: 0, count: 0, measure: '', resource: '', measureId: 0, resourceId: 0 });
  }

  onSubmit() {
    const url = this.isEditingExisting() ? `api/shipments/update` : `api/shipments/add`;
    this.isLoading.set(true);
    this.http.post<Shipment>(url, this.model).subscribe({
      next: (item) => {
        if (this.isEditingExisting()) {
          this.store.dispatch(ShipmentsActions.updateShipment({ item }));
        } else {
          this.store.dispatch(ShipmentsActions.addShipment({ item }));
        }
        this.router.navigateByUrl('/shipments');
      },
      error: (err) => {
        // TODO: notify error
        console.error(err);
        this.isLoading.set(false);
      },
    });
  }

  onDelete() {
    this.isLoading.set(true);
    this.http.post<void>(`api/shipments/delete`, this.model).subscribe({
      next: () => {
        this.store.dispatch(ShipmentsActions.deleteShipment({ id: this.model.id }));
        this.router.navigateByUrl('/shipments');
      },
      error: (err) => {
        this.isLoading.set(false);
        // TODO: notify error
        console.error(err);
        this.isLoading.set(false);
      },
    });
  }
}
