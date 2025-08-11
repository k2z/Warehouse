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
    path: 'shipments',
    component: ShipmentsComponent,
  },
  {
    path: 'resources',
    component: ResourcesComponent,
  },
  {
    path: 'measures',
    component: MeasuresComponent,
  },
  {
    path: 'clients',
    component: ClientsComponent,
  },
  {
    path: '**',
    redirectTo: 'resources',
  },
];

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(withInterceptorsFromDi()),
    provideRouter(routes),
    provideAnimationsAsync(),
    providePrimeNG({
      theme: {
        preset: Aura
      }
    })
  ],
};
