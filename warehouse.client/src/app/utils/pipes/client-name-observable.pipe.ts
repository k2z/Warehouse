import { Pipe, PipeTransform } from '@angular/core';
import { ClientStatus } from '../../state/clients/client';
import { map, Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { selectClients } from '../../state/clients/clients.selector';

@Pipe({
  name: 'clientNameObservable',
})
export class ClientNameObservablePipe implements PipeTransform {

  constructor(
    private store: Store,
  ) { }

  transform(clientIdValue: number, ...args: unknown[]): Observable<string> {
    return this.store.select(selectClients).pipe(
      map((loadedClients) => {
        return loadedClients.find(c => c.id === clientIdValue)?.name ?? `Клиент ${clientIdValue}`;
      })
    );
  }
}
