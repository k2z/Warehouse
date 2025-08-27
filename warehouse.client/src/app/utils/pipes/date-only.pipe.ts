import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'dateOnly',
})
export class DateOnlyPipe implements PipeTransform {

  transform(value: string, ...args: unknown[]): string {
    return dateonlyToFormatted(value);
  }
}

export function dateonlyToFormatted(value: string): string {
  const yearSubstr = value.substring(0, 4);
  const monthSubstr = value.substring(5, 7);
  const daySubstr = value.substring(8, 10);
  return `${daySubstr}.${monthSubstr}.${yearSubstr}`;
}
