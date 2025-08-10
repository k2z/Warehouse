import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ResourcesComponent } from './pages/resources/resources.component';
import { MeasuresComponent } from './pages/measures/measures.component';
import { ClientsComponent } from './pages/clients/clients.component';
import { BalancesComponent } from './pages/balances/balances.component';
import { IncomesComponent } from './pages/incomes/incomes.component';
import { ShipmentsComponent } from './pages/shipments/shipments.component';

@NgModule({ declarations: [
        AppComponent,
        ResourcesComponent,
        MeasuresComponent,
        ClientsComponent,
        BalancesComponent,
        IncomesComponent,
        ShipmentsComponent
    ],
    bootstrap: [AppComponent],
    imports: [
      BrowserModule,
      AppRoutingModule
    ],
    providers: [
      provideHttpClient(withInterceptorsFromDi())
    ],
  })
export class AppModule { }
