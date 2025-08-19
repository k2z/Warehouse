import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Component, inject, OnDestroy, OnInit, signal, WritableSignal } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subject, takeUntil } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { Client, ClientStatus } from '../../../state/clients/client';
import { selectClientToEdit } from '../../../state/clients/clients.selector';
import { ClientsActions } from '../../../state/clients/clients.actions';

@Component({
  selector: 'app-client-edit',
  templateUrl: './client-edit.component.html',
  imports: [
    FormsModule,
  ],
})
export class ClientEditComponent implements OnInit, OnDestroy {
  private http: HttpClient;
  private store: Store;
  private router: Router;
  ClientStatus = ClientStatus;
  private destroyed: Subject<void> = new Subject<void>();

  model: Client = { id: 0, name: '', address: '', status: ClientStatus.Active, };
  isEditingExisting: WritableSignal<boolean> = signal(false);
  isLoading: WritableSignal<boolean> = signal(false);
  private original?: Client;

  constructor() {
    this.http = inject(HttpClient);
    this.store = inject(Store);
    this.router = inject(Router);
    // this.items$ = this.store.select(selectResources);
    // this.isLoading$ = this.store.select(selectResourcesLoading).pipe(map(value => value === null ? true : value));
  }

  ngOnInit(): void {
    this.store.select(selectClientToEdit).pipe(
      takeUntil(this.destroyed.asObservable())
    ).subscribe((value) => {
      if (value) {
        this.original = value;
        Object.keys(value).forEach((fieldName) => {
          (this.model as any)[fieldName] = (value as any)[fieldName];
        });
        this.isEditingExisting.set(true);
      } else {
        this.model = { id: 0, name: '', address: '', status: ClientStatus.Active, };
        this.isEditingExisting.set(false);
      }
    });
  }

  onSubmit() {
    const url = this.isEditingExisting() ? `api/clients/update` : `api/clients/add`;
    this.isLoading.set(true);
    this.http.post<Client>(url, this.model).subscribe({
      next: (result) => {
        if (this.isEditingExisting()) {
          this.store.dispatch(ClientsActions.updateClient({ item: result }));
        } else {
          this.store.dispatch(ClientsActions.addClient({ item: result }));
        }
        this.router.navigateByUrl('/clients');
      },
      error: (err) => {
        // TODO: notify error
        console.error(err);
        this.isLoading.set(false);
      },
    });
  }

  onUpdateStatus(status: ClientStatus) {
    this.isLoading.set(true);
    Object.keys(this.original!).forEach((fieldName) => {
      (this.model as any)[fieldName] = (this.original as any)[fieldName];
    });
    this.model.status = status;
    this.http.post<Client>(`api/clients/update`, this.model).subscribe({
      next: (result) => {
        this.store.dispatch(ClientsActions.updateClient({ item: result }));
        this.router.navigateByUrl('/clients');
      },
      error: (err) => {
        this.isLoading.set(false);
        // TODO: notify error
        console.error(err);
        this.isLoading.set(false);
      },
    });
  }

  onDelete() {
    this.isLoading.set(true);
    this.http.post<void>(`api/clients/delete`, this.model).subscribe({
      next: () => {
        this.store.dispatch(ClientsActions.deleteClient({ id: this.model.id }));
        this.router.navigateByUrl('/clients');
      },
      error: (err) => {
        this.isLoading.set(false);
        // TODO: notify error
        console.error(err);
        this.isLoading.set(false);
      },
    });
  }

  ngOnDestroy(): void {
    this.destroyed.next();
    this.store.dispatch(ClientsActions.resetEditClient({}));
  }
}
