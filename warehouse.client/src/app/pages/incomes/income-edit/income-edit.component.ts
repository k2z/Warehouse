import { HttpClient } from '@angular/common/http';
import { Component, inject, OnDestroy, OnInit, signal, WritableSignal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { combineLatest, Subject, takeUntil } from 'rxjs';
import { IncomesActions } from '../../../state/incomes/incomes.actions';
import { Income } from '../../../state/incomes/income';
import { fetchActiveClients, fetchActiveMeasures, fetchActiveResources } from '../../../utils/common';
import { selectResourcesLoading } from '../../../state/resources/resources.selector';
import { selectMeasuresLoading } from '../../../state/measures/measures.selector';
import { selectClientsLoading } from '../../../state/clients/clients.selector';
import { selectIncomeToEdit } from '../../../state/incomes/incomes.selector';
import { dateToDateOnly } from '../../../utils/utils';

@Component({
  selector: 'app-income-edit',
  templateUrl: './income-edit.component.html',
  imports: [
    FormsModule,
  ],
})
export class IncomeEditComponent implements OnInit, OnDestroy {
  private http: HttpClient;
  private store: Store;
  private router: Router;

  private destroyed: Subject<void> = new Subject<void>();

  isLoading: WritableSignal<boolean> = signal(true);
  isEditingExisting: WritableSignal<boolean> = signal(false);
  model: Income = { id: 0, date: dateToDateOnly(new Date()), items: [], number: '', };
  private original?: Income;

  constructor() {
    this.http = inject(HttpClient);
    this.store = inject(Store);
    this.router = inject(Router);
  }

  ngOnInit(): void {
    fetchActiveClients(this.store, this.http);
    fetchActiveResources(this.store, this.http);
    fetchActiveMeasures(this.store, this.http);

    this.store.select(selectIncomeToEdit).pipe(
      takeUntil(this.destroyed.asObservable())
    ).subscribe((value) => {
      if (value) {
        this.original = value;
        Object.keys(value).forEach((fieldName) => {
          (this.model as any)[fieldName] = (value as any)[fieldName];
        });
        this.isEditingExisting.set(true);
      } else {
        this.model = { id: 0, date: dateToDateOnly(new Date()), items: [], number: '', };
        this.isEditingExisting.set(false);
      }
    });

    combineLatest(
      [
        this.store.select(selectResourcesLoading),
        this.store.select(selectMeasuresLoading),
        this.store.select(selectClientsLoading),
      ],
      (loadingResources, loadingMeasures, loadingClients) => {
        return (loadingResources ?? true) ||
          (loadingMeasures ?? true) ||
          (loadingClients ?? true);
      }
    ).pipe(
      takeUntil(this.destroyed.asObservable())
    ).subscribe((dropdownDataLoading) => {
      this.isLoading.set(dropdownDataLoading);
    });
  }

  ngOnDestroy(): void {
    this.destroyed.next();
    this.destroyed.complete();
    this.store.dispatch(IncomesActions.resetEditIncome({}));
  }

  onAddNewItem(): void {
    this.model.items.push({ id: 0, count: 0, measure: '', resource: '', measureId: 0, resourceId: 0 });
  }

  onSubmit() {
    const url = this.isEditingExisting() ? `api/incomes/update` : `api/incomes/add`;
    this.isLoading.set(true);
    this.http.post<Income>(url, this.model).subscribe({
      next: (item) => {
        if (this.isEditingExisting()) {
          this.store.dispatch(IncomesActions.updateIncome({ item }));
        } else {
          this.store.dispatch(IncomesActions.addIncome({ item }));
        }
        this.router.navigateByUrl('/incomes');
      },
      error: (err) => {
        // TODO: notify error
        console.error(err);
        this.isLoading.set(false);
      },
    });
  }

  onDelete() {
    this.isLoading.set(true);
    this.http.post<void>(`api/incomes/delete`, this.model).subscribe({
      next: () => {
        this.store.dispatch(IncomesActions.deleteIncome({ id: this.model.id }));
        this.router.navigateByUrl('/incomes');
      },
      error: (err) => {
        this.isLoading.set(false);
        // TODO: notify error
        console.error(err);
        this.isLoading.set(false);
      },
    });
  }
}
