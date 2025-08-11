import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
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
  public loading: boolean = false;
  public columns: Column[] = [
    { title: 'Ресурс', field: 'resource', filtering: FilteringType.MULTISELECT, multiselectOptions: [{ title: 'Rice', value: 'Rice' }, { title: 'Sesame', value: 'Sesame' }, { title: 'Hemp', value: 'Hemp' }] },
    { title: 'Единица измерения', field: 'measure', filtering: FilteringType.NONE },
    { title: 'Количество', field: 'quantity', filtering: FilteringType.NONE },
  ];
  public items: any[] = [
      { resource: 'Rice', measure: 'kg', quantity: 10 },
      { resource: 'Sesame', measure: 'kg', quantity: 10 },
      { resource: 'Hemp', measure: 'kg', quantity: 10 },
      { resource: 'Rice', measure: 'ISO container', quantity: 10 },
      { resource: 'Sesame', measure: 'ISO container', quantity: 10 },
      { resource: 'Hemp', measure: 'ISO container', quantity: 10 },
  ];
}
