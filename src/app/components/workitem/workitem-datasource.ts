import { CollectionViewer, DataSource } from '@angular/cdk/collections';
import { Observable } from 'rxjs';
import { BehaviorSubject } from 'rxjs';
import { catchError, finalize } from 'rxjs/operators';
import { of } from 'rxjs';

import { ResourceCoordinateRepository } from '../../services/resource-coordinate-end-point.service';
import { WorkItemDto } from 'src/app/models/generatedtypes';


export class WorkitemDataSource implements DataSource<WorkItemDto> {

  private workItemDtoSubject = new BehaviorSubject<WorkItemDto[]>([]);
  private loadingSubject = new BehaviorSubject<boolean>(false);

  loading$ = this.loadingSubject.asObservable();

  constructor(private resourceCoordinateRepository: ResourceCoordinateRepository) { }

  connect(collectionViewer: CollectionViewer): Observable<WorkItemDto[]> {
    return this.workItemDtoSubject.asObservable();
  }

  disconnect(collectionViewer: CollectionViewer): void {
    this.workItemDtoSubject.complete();
    this.loadingSubject.complete();
  }

  loadWorkItems (filter = '',sortDirection = 'asc', pageIndex = 0, pageSize = 3) {

    this.loadingSubject.next(true);

    this.resourceCoordinateRepository.getWorkItemsEndpoint(filter, sortDirection, pageIndex, pageSize).pipe(
        catchError(() => of([])),
        finalize(() => this.loadingSubject.next(false))
      )
      .subscribe(lessons => this.workItemDtoSubject.next(lessons));
  }
}


// https://blog.angular-university.io/angular-material-data-table/
