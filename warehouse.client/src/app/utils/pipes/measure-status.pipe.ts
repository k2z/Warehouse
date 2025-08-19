import { Pipe, PipeTransform } from '@angular/core';
import { MeasureStatus } from '../../state/measures/measure';

@Pipe({
  name: 'measureStatus',
})
export class MeasureStatusPipe implements PipeTransform {

  transform(value: MeasureStatus, ...args: unknown[]): string {
    return measureStatusName(value);
  }
}

export function measureStatusName(value: MeasureStatus): string {
  switch (value) {
      case MeasureStatus.Active:
        return 'Активный';
      case MeasureStatus.Archived:
        return 'Архивный';
      case MeasureStatus.Deleted:
        return 'Удалён';
    }
}
