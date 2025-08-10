import { provideRouter, Routes } from "@angular/router";
import { ApplicationConfig } from "@angular/core";
import { ResourcesComponent } from "./pages/resources/resources.component";
import { MeasuresComponent } from "./pages/measures/measures.component";
import { ClientsComponent } from "./pages/clients/clients.component";
import { provideHttpClient, withInterceptorsFromDi } from "@angular/common/http";

const routes: Routes = [
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
  ],
};
