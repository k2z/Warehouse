import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';

interface WeatherForecast {
  date: string;
  temperatureC: number;
  temperatureF: number;
  summary: string;
}

type NavigationItem = {
  title: string;
  path: string | null;
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
    ],
})
export class AppComponent implements OnInit {
  public forecasts: WeatherForecast[] = [];

  public navItems: Array<NavigationSection> = [
    {
      title: 'Склад',
      items: [
        { title: 'Баланс', path: 'balances' },
        { title: 'Поступления', path: 'incomes' },
        { title: 'Отгрузки', path: 'shipments' },
      ],
    },
    {
      title: 'Справочники',
      items: [
        { title: 'Клиенты', path: 'clients' },
        { title: 'Единицы измерения', path: 'measures' },
        { title: 'Ресурсы', path: 'resources' },
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
