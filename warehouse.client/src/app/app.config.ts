import { provideRouter, Routes } from "@angular/router";
import { ApplicationConfig } from "@angular/core";
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { ResourcesComponent } from "./pages/resources/resources.component";
import { MeasuresComponent } from "./pages/measures/measures.component";
import { ClientsComponent } from "./pages/clients/clients.component";
import { provideHttpClient, withInterceptorsFromDi } from "@angular/common/http";
import { providePrimeNG } from 'primeng/config';
import Aura from '@primeuix/themes/aura';
import { BalancesComponent } from "./pages/balances/balances.component";
import { IncomesComponent } from "./pages/incomes/incomes.component";
import { ShipmentsComponent } from "./pages/shipments/shipments.component";
import { provideStore } from "@ngrx/store";
import { resourcesReducer } from "./state/resources/resources.reducer";
import { ResourceEditComponent } from "./pages/resources/resource-edit/resource-edit.component";
import { MeasureEditComponent } from "./pages/measures/measure-edit/measure-edit.component";
import { measuresReducer } from "./state/measures/measures.reducer";
import { clientsReducer } from "./state/clients/clients.reducer";
import { ClientEditComponent } from "./pages/clients/client-edit/client-edit.component";
import { incomesReducer } from "./state/incomes/incomes.reducer";
import { IncomeEditComponent } from "./pages/incomes/income-edit/income-edit.component";
import { shipmentsReducer } from "./state/shipments/shipment.reducer";
import { ShipmentEditComponent } from "./pages/shipments/shipment-edit/shipment-edit.component";

const routes: Routes = [
  {
    path: 'balances',
    component: BalancesComponent,
  },
  {
    path: 'incomes',
    component: IncomesComponent,
  },
  {
    path: 'incomes/edit',
    component: IncomeEditComponent,
  },
  {
    path: 'shipments',
    component: ShipmentsComponent,
  },
  {
    path: 'shipments/edit',
    component: ShipmentEditComponent,
  },
  {
    path: 'resources',
    component: ResourcesComponent,
  },
  {
    path: 'resources/edit',
    component: ResourceEditComponent,
  },
  {
    path: 'measures',
    component: MeasuresComponent,
  },
  {
    path: 'measures/edit',
    component: MeasureEditComponent,
  },
  {
    path: 'clients',
    component: ClientsComponent,
  },
  {
    path: 'clients/edit',
    component: ClientEditComponent,
  },
  {
    path: '**',
    redirectTo: 'balances',
  },
];

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(withInterceptorsFromDi()),
    provideRouter(routes),
    provideStore({
      resources: resourcesReducer,
      measures: measuresReducer,
      clients: clientsReducer,
      incomes: incomesReducer,
      shipments: shipmentsReducer,
      /* TODO */
    }),
    provideAnimationsAsync(),
    providePrimeNG({
      theme: {
        preset: Aura
      }
    })
  ],
};
