import { Pipe, PipeTransform } from '@angular/core';
import { ResourceStatus } from '../../state/resources/resource';

@Pipe({
  name: 'resourceStatus',
})
export class ResourceStatusPipe implements PipeTransform {

  transform(value: ResourceStatus, ...args: unknown[]): string {
    return resourceStatusName(value);
  }
}

export function resourceStatusName(value: ResourceStatus): string {
  switch (value) {
      case ResourceStatus.Active:
        return 'Активный';
      case ResourceStatus.Archived:
        return 'Архивный';
      case ResourceStatus.Deleted:
        return 'Удалён';
    }
}
