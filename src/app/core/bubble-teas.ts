import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { Observable, tap } from 'rxjs';

export type BubbleTea = {
  id: number;
  name: string;
  temperature: string;
  price: number;
  active: boolean;
};

export type BubbleTeaPayload = Omit<BubbleTea, 'id'>;

@Injectable({
  providedIn: 'root',
})
export class BubbleTeaService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = '/api/bubbleteas';

  readonly bubbleTeas = signal<BubbleTea[]>([]);
  readonly trashedBubbleTeas = signal<BubbleTea[]>([]);
  readonly bubbleTeaDetail = signal<BubbleTea | null>(null);

  getAll(): Observable<BubbleTea[]> {
    return this.http
      .get<BubbleTea[]>(`${this.apiUrl}/`)
      .pipe(tap((data) => this.bubbleTeas.set(data)));
  }

  getTrash(): Observable<BubbleTea[]> {
    return this.http
      .get<BubbleTea[]>(`${this.apiUrl}/trash`)
      .pipe(tap((data) => this.trashedBubbleTeas.set(data)));
  }

  getById(id: number): Observable<BubbleTea> {
    return this.http
      .get<BubbleTea>(`${this.apiUrl}/${id}`)
      .pipe(tap((data) => this.bubbleTeaDetail.set(data)));
  }

  create(bubbleTea: BubbleTeaPayload): Observable<BubbleTea> {
    return this.http.post<BubbleTea>(`${this.apiUrl}/`, bubbleTea);
  }

  update(id: number, bubbleTea: BubbleTeaPayload): Observable<BubbleTea> {
    return this.http.put<BubbleTea>(`${this.apiUrl}/${id}`, bubbleTea);
  }

  patch(id: number, bubbleTea: Partial<BubbleTeaPayload>): Observable<BubbleTea> {
    return this.http.patch<BubbleTea>(`${this.apiUrl}/${id}`, bubbleTea);
  }

  /** Soft delete: moves the bubble tea to the trash (active = false). */
  softDelete(id: number): Observable<void> {
    return this.http
      .delete<void>(`${this.apiUrl}/${id}`)
      .pipe(tap(() => this.bubbleTeas.update((teas) => teas.filter((tea) => tea.id !== id))));
  }

  restore(id: number): Observable<BubbleTea> {
    return this.http
      .post<BubbleTea>(`${this.apiUrl}/${id}/restore`, {})
      .pipe(
        tap(() => this.trashedBubbleTeas.update((teas) => teas.filter((tea) => tea.id !== id))),
      );
  }

  /** Permanent delete: removes the bubble tea from the database for good. */
  permanentDelete(id: number): Observable<void> {
    return this.http
      .delete<void>(`${this.apiUrl}/${id}/permanent`)
      .pipe(
        tap(() => this.trashedBubbleTeas.update((teas) => teas.filter((tea) => tea.id !== id))),
      );
  }
}
