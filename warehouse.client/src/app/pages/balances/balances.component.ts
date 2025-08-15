import { Component } from '@angular/core';
import { Column, ColumnType, FilteringType, GridComponent } from '../../utils/components/grid/grid.component';

@Component({
  selector: 'app-balances',
  templateUrl: './balances.component.html',
  styleUrl: './balances.component.css',
  imports: [
    GridComponent,
  ],
})
export class BalancesComponent {
  items: any[] = [
    { resource: 'Rice', measure: 'kg', quantity: 10 },
    { resource: 'Sesame', measure: 'kg', quantity: 10 },
    { resource: 'Hemp', measure: 'kg', quantity: 10 },
    { resource: 'Rice', measure: 'ISO container', quantity: 10 },
    { resource: 'Sesame', measure: 'ISO container', quantity: 10 },
    { resource: 'Hemp', measure: 'ISO container', quantity: 10 },
  ];
  columns: Column[] = [
    { title: 'Ресурс', field: 'resource', type: ColumnType.TEXT, filtering: FilteringType.MULTISELECT, selectOptions: [{ title: 'Rice', value: 'Rice' }, { title: 'Sesame', value: 'Sesame' }, { title: 'Hemp', value: 'Hemp' }] },
    { title: 'Единица измерения', field: 'measure', type: ColumnType.TEXT, filtering: FilteringType.NONE },
    { title: 'Количество', field: 'quantity', type: ColumnType.TEXT, filtering: FilteringType.NONE },
  ]

}
