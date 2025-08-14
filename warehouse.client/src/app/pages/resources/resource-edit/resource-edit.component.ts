import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Component, inject, OnDestroy, OnInit, signal, WritableSignal } from '@angular/core';
import { Store } from '@ngrx/store';
import { ResourcesActions } from '../../../state/resources/resources.actions';
import { Resource, ResourceStatus } from '../../../state/resources/resource';
import { Subject, takeUntil } from 'rxjs';
import { selectResourceToEdit } from '../../../state/resources/resources.selector';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-resource-edit',
  templateUrl: './resource-edit.component.html',
  imports: [
    FormsModule,
  ],
})
export class ResourceEditComponent implements OnInit, OnDestroy {
  private http: HttpClient;
  private store: Store;
  private router: Router;
  ResourceStatus = ResourceStatus;
  private destroyed: Subject<void> = new Subject<void>();

  model: Resource = { id: 0, name: '', status: ResourceStatus.Active, };
  isEditingExisting: WritableSignal<boolean> = signal(false);
  isLoading: WritableSignal<boolean> = signal(false);
  private original?: Resource;

  constructor() {
    this.http = inject(HttpClient);
    this.store = inject(Store);
    this.router = inject(Router);
    // this.items$ = this.store.select(selectResources);
    // this.isLoading$ = this.store.select(selectResourcesLoading).pipe(map(value => value === null ? true : value));
  }

  ngOnInit(): void {
    this.store.select(selectResourceToEdit).pipe(
      takeUntil(this.destroyed.asObservable())
    ).subscribe((value) => {
      if (value) {
        this.original = value;
        Object.keys(value).forEach((fieldName) => {
          (this.model as any)[fieldName] = (value as any)[fieldName];
        });
        this.isEditingExisting.set(true);
      } else {
        this.model = { id: 0, name: '', status: ResourceStatus.Active, };
        this.isEditingExisting.set(false);
      }
    });
  }

  onSubmit() {
    const url = this.isEditingExisting() ? `api/resources/update` : `api/resources/add`;
    this.isLoading.set(true);
    this.http.post<Resource>(url, this.model).subscribe({
      next: (result) => {
        if (this.isEditingExisting()) {
          this.store.dispatch(ResourcesActions.updateResource({ item: result }));
        } else {
          this.store.dispatch(ResourcesActions.addResource({ item: result }));
        }
        this.router.navigateByUrl('/resources');
      },
      error: (err) => {
        // TODO: notify error
        console.error(err);
        this.isLoading.set(false);
      },
    });
  }

  onUpdateStatus(status: ResourceStatus) {
    this.isLoading.set(true);
    Object.keys(this.original!).forEach((fieldName) => {
      (this.model as any)[fieldName] = (this.original as any)[fieldName];
    });
    this.model.status = status;
    this.http.post<Resource>(`api/resources/update`, this.model).subscribe({
      next: (result) => {
        this.store.dispatch(ResourcesActions.updateResource({ item: result }));
        this.router.navigateByUrl('/resources');
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
    this.http.post<void>(`api/resources/delete`, this.model).subscribe({
      next: () => {
        this.store.dispatch(ResourcesActions.deleteResource({ id: this.model.id }));
        this.router.navigateByUrl('/resources');
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
    this.store.dispatch(ResourcesActions.resetEditResource({}));
  }
}
