import { Component } from '@angular/core';
import { GridComponent } from '../../utils/components/grid/grid.component';

@Component({
    selector: 'app-balances',
    templateUrl: './balances.component.html',
    styleUrl: './balances.component.css',
    imports: [
        GridComponent,
    ],
})
export class BalancesComponent {
}
