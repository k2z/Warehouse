import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Component, inject, OnDestroy, OnInit, signal, WritableSignal } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subject, takeUntil } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { Measure, MeasureStatus } from '../../../state/measures/measure';
import { MeasuresActions } from '../../../state/measures/measures.actions';
import { selectMeasureToEdit } from '../../../state/measures/measures.selector';

@Component({
  selector: 'app-measure-edit',
  templateUrl: './measure-edit.component.html',
  imports: [
    FormsModule,
  ],
})
export class MeasureEditComponent implements OnInit, OnDestroy {
  private http: HttpClient;
  private store: Store;
  private router: Router;
  MeasureStatus = MeasureStatus;
  private destroyed: Subject<void> = new Subject<void>();

  model: Measure = { id: 0, name: '', status: MeasureStatus.Active, };
  isEditingExisting: WritableSignal<boolean> = signal(false);
  isLoading: WritableSignal<boolean> = signal(false);
  private original?: Measure;

  constructor() {
    this.http = inject(HttpClient);
    this.store = inject(Store);
    this.router = inject(Router);
    // this.items$ = this.store.select(selectResources);
    // this.isLoading$ = this.store.select(selectResourcesLoading).pipe(map(value => value === null ? true : value));
  }

  ngOnInit(): void {
    this.store.select(selectMeasureToEdit).pipe(
      takeUntil(this.destroyed.asObservable())
    ).subscribe((value) => {
      if (value) {
        this.original = value;
        Object.keys(value).forEach((fieldName) => {
          (this.model as any)[fieldName] = (value as any)[fieldName];
        });
        this.isEditingExisting.set(true);
      } else {
        this.model = { id: 0, name: '', status: MeasureStatus.Active, };
        this.isEditingExisting.set(false);
      }
    });
  }

  onSubmit() {
    const url = this.isEditingExisting() ? `api/measures/update` : `api/measures/add`;
    this.isLoading.set(true);
    this.http.post<Measure>(url, this.model).subscribe({
      next: (result) => {
        if (this.isEditingExisting()) {
          this.store.dispatch(MeasuresActions.updateMeasure({ item: result }));
        } else {
          this.store.dispatch(MeasuresActions.addMeasure({ item: result }));
        }
        this.router.navigateByUrl('/measures');
      },
      error: (err) => {
        // TODO: notify error
        console.error(err);
        this.isLoading.set(false);
      },
    });
  }

  onUpdateStatus(status: MeasureStatus) {
    this.isLoading.set(true);
    Object.keys(this.original!).forEach((fieldName) => {
      (this.model as any)[fieldName] = (this.original as any)[fieldName];
    });
    this.model.status = status;
    this.http.post<Measure>(`api/measures/update`, this.model).subscribe({
      next: (result) => {
        this.store.dispatch(MeasuresActions.updateMeasure({ item: result }));
        this.router.navigateByUrl('/measures');
      },
      error: (err) => {
        this.isLoading.set(false);
        // TODO: notify error
        console.error(err);
        this.isLoading.set(false);
      },
    });
  }

  onDelete() {
    this.isLoading.set(true);
    this.http.post<void>(`api/measures/delete`, this.model).subscribe({
      next: () => {
        this.store.dispatch(MeasuresActions.deleteMeasure({ id: this.model.id }));
        this.router.navigateByUrl('/measures');
      },
      error: (err) => {
        this.isLoading.set(false);
        // TODO: notify error
        console.error(err);
        this.isLoading.set(false);
      },
    });
  }

  ngOnDestroy(): void {
    this.destroyed.next();
    this.store.dispatch(MeasuresActions.resetEditMeasure({}));
  }
}
