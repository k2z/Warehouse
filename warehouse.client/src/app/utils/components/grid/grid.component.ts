import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TableLazyLoadEvent, TableModule, TableRowSelectEvent } from 'primeng/table';
import { MultiSelectModule } from 'primeng/multiselect';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { SelectModule } from 'primeng/select';
import { ResourceStatus } from '../../../state/resources/resource';
import { ResourceStatusPipe } from '../../pipes/resource-status.pipe';
import { MeasureStatusPipe } from '../../pipes/measure-status.pipe';
import { ClientStatusPipe } from '../../pipes/client-status.pipe';
import { DateOnlyPipe } from '../../pipes/date-only.pipe';

export enum ColumnType {
  TEXT,
  RESOURCESTATUS,
  MEASURESTATUS,
  CLIENTSTATUS,
  DATEONLY,
  RESOURCES,
  MEASURES,
}

export enum FilteringType {
  NONE,
  RESOURCESTATUS,
  MEASURESTATUS,
  CLIENTSTATUS,
  MULTISELECT,
  DATERANGE,
}

export type FilterSelectOption = {
  title: string;
  value: string | number;
}

export type Column = {
  title: string;
  field: string;
  type: ColumnType;
  filtering: FilteringType;
  selectOptions?: Array<FilterSelectOption>;
};

@Component({
  selector: 'app-grid',
  templateUrl: './grid.component.html',
  styleUrl: './grid.component.css',
  imports: [
    FormsModule,
    TableModule,
    ButtonModule,
    TagModule,
    MultiSelectModule,
    SelectModule,
    ResourceStatusPipe,
    MeasureStatusPipe,
    ClientStatusPipe,
    DateOnlyPipe,
  ],
})
export class GridComponent {
  ColumnType = ColumnType;
  FilteringType = FilteringType;
  statusToPrimengSeverity = statusToPrimengSeverity;
  @Input() loading: boolean | null = false;
  @Input() columns: Column[] = [];
  @Input() items: ReadonlyArray<any> | null = [];

  @Input() total: number = 0;

  @Input() lazyLoad?: (event: TableLazyLoadEvent) => void;

  selected: any | null | undefined;
  rowClick: (event: TableRowSelectEvent) => void = (event: TableRowSelectEvent) => {
    this.onRowClick.emit(event);
  }
  @Output() onRowClick = new EventEmitter<TableRowSelectEvent>();

  @Input() isActionsDisplayed: boolean = true;
  @Input() addActionTitle: string = 'Добавить';
  @Output() onAddClick = new EventEmitter<void>();
}

enum PrimeNgSeverities {
  gray = 'Primary',
  lightgray = 'secondary',
  green = 'success',
  blue = 'info',
  yellow = 'warn',
  red = 'danger',
  black = 'contrast',
}

export function statusToPrimengSeverity(status: string | number): string {
  switch (status) {
    case ResourceStatus.Active:
      return PrimeNgSeverities.green;
    case ResourceStatus.Archived:
      return PrimeNgSeverities.yellow;
    case ResourceStatus.Deleted:
      return PrimeNgSeverities.black;
    default:
      return PrimeNgSeverities.gray;
  }
}
