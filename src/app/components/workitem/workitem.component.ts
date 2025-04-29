import { Component, OnInit, ViewChild, AfterViewInit, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { RouterModule } from '@angular/router';
import { WorkitemDataSource } from './workitem-datasource';
import { ResourceCoordinateRepository } from '../../services/resource-coordinate-end-point.service';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'app-workitem',
  templateUrl: './workitem.component.html',
  styleUrls: ['./workitem.component.css'],
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [
    CommonModule,
    RouterModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule
  ]
})

export class WorkItemComponent implements AfterViewInit, OnInit {
    @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
    @ViewChild(MatSort, { static: false }) sort: MatSort;

  dataSource: WorkitemDataSource;
  /** Columns displayed in the table. Columns IDs can be added, removed, or reordered. */
  displayedColumns = ['created', 'title', 'description'];
  numberOfItems = 10;
  initialPageSize = 5;

  constructor(private resourceCoordinateRepository: ResourceCoordinateRepository) {
  }

  ngOnInit() {
    this.resourceCoordinateRepository.getWorkItemUnassignedCount()
      .subscribe(noItems => this.numberOfItems = noItems);

    this.dataSource = new WorkitemDataSource(this.resourceCoordinateRepository);
    this.dataSource.loadWorkItems("","asc",0,this.initialPageSize);
  }

  ngAfterViewInit(): void {
    this.paginator.page
      .pipe(
        tap(() => this.loadWorkItemsPage())
      )
      .subscribe();
  }

  loadWorkItemsPage() {
    this.dataSource.loadWorkItems(
      '',
      'asc',
      this.paginator.pageIndex,
      this.paginator.pageSize);
  }

}
