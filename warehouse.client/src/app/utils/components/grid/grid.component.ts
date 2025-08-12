import { Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TableLazyLoadEvent, TableModule } from 'primeng/table';
import { MultiSelectModule } from 'primeng/multiselect';

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
    MultiSelectModule,
  ],
})
export class GridComponent {
  FilteringType = FilteringType;
  @Input() loading: boolean = false;
  @Input() columns: Column[] = [];
  @Input() items: any[] = [];

  @Input() total: number = 6;

  @Input() lazyLoad?: (event: TableLazyLoadEvent) => void = (event: TableLazyLoadEvent) => {
    console.log(event);

  }
}
