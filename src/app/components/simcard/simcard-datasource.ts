import { DataSource } from '@angular/cdk/collections';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, finalize } from 'rxjs/operators';
import { ISimCardDto, ISimCardDtoApi } from '../../models/generatedtypes';
import { SimCardRepository } from '../../services/generated/simcard-repository';

export class SimCardDataSource implements DataSource<ISimCardDto> {
  private simCardsSubject = new BehaviorSubject<ISimCardDto[]>([]);
  private loadingSubject = new BehaviorSubject<boolean>(false);
  private totalCountSubject = new BehaviorSubject<number>(0);

  public loading$ = this.loadingSubject.asObservable();
  public totalCount$ = this.totalCountSubject.asObservable();

  constructor(private simCardRepository: SimCardRepository) {}

  connect(): Observable<ISimCardDto[]> {
    return this.simCardsSubject.asObservable();
  }

  disconnect(): void {
    this.simCardsSubject.complete();
    this.loadingSubject.complete();
    this.totalCountSubject.complete();
  }

  loadSimCards(
    filter: string = '',
    sortActive: string = 'simCardId',
    sortDirection: string = 'asc',
    pageIndex: number = 0,
    pageSize: number = 10
  ): void {
    this.loadingSubject.next(true);

    this.simCardRepository
      .getAllSimCards(filter, sortActive, sortDirection, pageIndex, pageSize)
      .pipe(
        catchError((error) => {
          console.error('Error loading sim cards:', error);
          return of({ simCardDtos: [], totalCount: 0 } as ISimCardDtoApi);
        }),
        finalize(() => this.loadingSubject.next(false))
      )
      .subscribe((result: ISimCardDtoApi) => {
        this.simCardsSubject.next(result.simCardDtos || []);
        this.totalCountSubject.next(result.totalCount || 0);
      });
  }

  getSimCardById(id: number): Observable<ISimCardDto> {
    return this.simCardRepository.getSimCardById(id).pipe(
      catchError((error) => {
        console.error('Error loading sim card by id:', error);
        return of({} as ISimCardDto);
      })
    );
  }

  refresh(): void {
    // Reload with current parameters
    this.loadSimCards();
  }
}