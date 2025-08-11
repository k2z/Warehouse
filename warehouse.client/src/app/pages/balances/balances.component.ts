import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { MultiSelectModule } from 'primeng/multiselect';

@Component({
    selector: 'app-balances',
    templateUrl: './balances.component.html',
    styleUrl: './balances.component.css',
    imports: [
        FormsModule,
        TableModule,
        MultiSelectModule,
    ],
})
export class BalancesComponent {
    console = console;
    public loading: boolean = false;
    public balanceValues: any[] = [
        { resource: 'Rice', measure: 'kg', quantity: 10 },
        { resource: 'Sesame', measure: 'kg', quantity: 10 },
        { resource: 'Hemp', measure: 'kg', quantity: 10 },
        { resource: 'Rice', measure: 'ISO container', quantity: 10 },
        { resource: 'Sesame', measure: 'ISO container', quantity: 10 },
        { resource: 'Hemp', measure: 'ISO container', quantity: 10 },
    ];
    public resourceFilterOptions: any[] = [{ name: 'Rice', value: 'Rice' }, { name: 'Sesame', value: 'Sesame' }, { name: 'Hemp', value: 'Hemp' }];
}
