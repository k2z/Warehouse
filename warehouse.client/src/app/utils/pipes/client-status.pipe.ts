import { Pipe, PipeTransform } from '@angular/core';
import { ClientStatus } from '../../state/clients/client';

@Pipe({
  name: 'clientStatus',
})
export class ClientStatusPipe implements PipeTransform {

  transform(value: ClientStatus, ...args: unknown[]): string {
    return clientStatusName(value);
  }
}

export function clientStatusName(value: ClientStatus): string {
  switch (value) {
      case ClientStatus.Active:
        return 'Активный';
      case ClientStatus.Archived:
        return 'Архивный';
      case ClientStatus.Deleted:
        return 'Удалён';
    }
}
