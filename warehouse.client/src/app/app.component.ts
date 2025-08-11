import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';

interface WeatherForecast {
  date: string;
  temperatureC: number;
  temperatureF: number;
  summary: string;
}

type NavigationItem = {
  title: string;
  path: string | null;
  iconClass?: string;
}

type NavigationSection = {
  title: string;
  items: Array<NavigationItem>;
}

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrl: './app.component.css',
    imports: [
      RouterLink,
      RouterOutlet,
    ],
})
export class AppComponent implements OnInit {
  public forecasts: WeatherForecast[] = [];

  public navItems: Array<NavigationSection> = [
    {
      title: 'Склад',
      items: [
        { title: 'Баланс', path: 'balances', iconClass: 'bi bi-boxes' },
        { title: 'Поступления', path: 'incomes', iconClass: 'bi bi-box-arrow-in-down' },
        { title: 'Отгрузки', path: 'shipments', iconClass: 'bi bi-box-arrow-up' },
      ],
    },
    {
      title: 'Справочники',
      items: [
        { title: 'Клиенты', path: 'clients', iconClass: 'bi bi-file-earmark-person' },
        { title: 'Единицы измерения', path: 'measures', iconClass: 'bi bi-beaker' },
        { title: 'Ресурсы', path: 'resources', iconClass: 'bi bi-collection' },
      ],
    },
  ];

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.getForecasts();
  }

  getForecasts() {
    this.http.get<WeatherForecast[]>('/weatherforecast').subscribe(
      (result) => {
        this.forecasts = result;
      },
      (error) => {
        console.error(error);
      }
    );
  }

  title = 'warehouse.client';
}
