import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TableLazyLoadEvent, TableModule, TableRowSelectEvent } from 'primeng/table';
import { MultiSelectModule } from 'primeng/multiselect';
import { ButtonModule } from 'primeng/button';

export enum FilteringType {
  NONE,
  MULTISELECT,
  DATERANGE,
}

export type FilterMultiselectOption = {
  title: string;
  value: string;
}

export type Column = {
  title: string;
  field: string;
  filtering: FilteringType;
  multiselectOptions?: Array<FilterMultiselectOption>;
};

@Component({
  selector: 'app-grid',
  templateUrl: './grid.component.html',
  styleUrl: './grid.component.css',
  imports: [
    FormsModule,
    TableModule,
    ButtonModule,
    MultiSelectModule,
  ],
})
export class GridComponent {
  FilteringType = FilteringType;
  @Input() loading: boolean | null = false;
  @Input() columns: Column[] = [];
  @Input() items: ReadonlyArray<any> | null = [];

  @Input() total: number = 6;

  @Input() lazyLoad?: (event: TableLazyLoadEvent) => void;

  selected: any | null | undefined;
  @Input() rowClick: (event: TableRowSelectEvent) => void = (event: TableRowSelectEvent) => {
    console.log(event);
  }

  @Input() isActionsDisplayed: boolean = true;
  @Input() addActionTitle: string = 'Добавить';
  @Output() onAddClick = new EventEmitter<void>();
}
