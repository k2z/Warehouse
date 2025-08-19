import { Component, inject, OnInit } from '@angular/core';
import { Column, ColumnType, FilteringType, GridComponent } from '../../utils/components/grid/grid.component';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Store } from '@ngrx/store';
import { Router } from '@angular/router';
import { map, Observable } from 'rxjs';
import { Client, ClientStatus } from '../../state/clients/client';
import { clientStatusName } from '../../utils/pipes/client-status.pipe';
import { selectClients, selectClientsLoading } from '../../state/clients/clients.selector';
import { fetchActiveClients } from '../../utils/common';
import { TableRowSelectEvent } from 'primeng/table';
import { ClientsActions } from '../../state/clients/clients.actions';

@Component({
  selector: 'app-clients',
  templateUrl: './clients.component.html',
  imports: [
    CommonModule,
    GridComponent,
  ],
})
export class ClientsComponent implements OnInit {
  private http: HttpClient;
  private store: Store;
  private router: Router;
  public items$: Observable<ReadonlyArray<Client>>;
  public isLoading$: Observable<boolean>;

  public readonly columns: Column[] = [
    {
      field: 'name',
      type: ColumnType.TEXT,
      filtering: FilteringType.NONE,
      title: 'Название',
    },
    {
      field: 'address',
      type: ColumnType.TEXT,
      filtering: FilteringType.NONE,
      title: 'Адрес',
    },
    {
      field: 'status',
      type: ColumnType.CLIENTSTATUS,
      filtering: FilteringType.CLIENTSTATUS,
      title: 'Статус',
      selectOptions: [
        { title: clientStatusName(ClientStatus.Active), value: ClientStatus.Active },
        { title: clientStatusName(ClientStatus.Archived), value: ClientStatus.Archived },
      ],
    },
  ];

  constructor() {
    this.http = inject(HttpClient);
    this.store = inject(Store);
    this.router = inject(Router);
    this.items$ = this.store.select(selectClients);
    this.isLoading$ = this.store.select(selectClientsLoading).pipe(map(value => value === null ? true : value));
  }

  ngOnInit(): void {
    fetchActiveClients(this.store, this.http);
  }

  onClickAddNewClient() {
    this.router.navigateByUrl('/clients/edit');
  }

  onClickClient(event: TableRowSelectEvent) {
    const item: Client = event.data;
    this.store.dispatch(ClientsActions.editClient({ item }));
    this.router.navigateByUrl('/clients/edit');
  }
}
