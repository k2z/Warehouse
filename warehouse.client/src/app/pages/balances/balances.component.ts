import { Component } from '@angular/core';
import { Column, FilteringType, GridComponent } from '../../utils/components/grid/grid.component';

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
    { title: 'Ресурс', field: 'resource', filtering: FilteringType.MULTISELECT, multiselectOptions: [{ title: 'Rice', value: 'Rice' }, { title: 'Sesame', value: 'Sesame' }, { title: 'Hemp', value: 'Hemp' }] },
    { title: 'Единица измерения', field: 'measure', filtering: FilteringType.NONE },
    { title: 'Количество', field: 'quantity', filtering: FilteringType.NONE },
  ]

}
