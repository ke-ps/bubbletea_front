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

@Injectable({
  providedIn: 'root',
})
export class BubbleTeaService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = '/api/bubbleteas';

  readonly bubbleTeas = signal<BubbleTea[]>([]);
  readonly bubbleTeaDetail = signal<BubbleTea | null>(null);

  getAll(): Observable<BubbleTea[]> {
    return this.http.get<BubbleTea[]>(`${this.apiUrl}/`).pipe(
      tap(data => this.bubbleTeas.set(data))
    );
  }

  getById(id: number): Observable<BubbleTea> {
    return this.http.get<BubbleTea>(`${this.apiUrl}/${id}`).pipe(
      tap(data => this.bubbleTeaDetail.set(data))
    );
  }

  create(bubbleTea: Omit<BubbleTea, 'id'>): Observable<BubbleTea> {
    return this.http.post<BubbleTea>(`${this.apiUrl}/`, bubbleTea);
  }

  update(id: number, bubbleTea: Omit<BubbleTea, 'id'>): Observable<BubbleTea> {
    return this.http.put<BubbleTea>(`${this.apiUrl}/${id}`, bubbleTea);
  }

  patch(id: number, bubbleTea: Partial<Omit<BubbleTea, 'id'>>): Observable<BubbleTea> {
    return this.http.patch<BubbleTea>(`${this.apiUrl}/${id}`, bubbleTea);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}