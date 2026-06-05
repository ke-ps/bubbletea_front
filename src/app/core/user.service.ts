import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { Observable, tap } from 'rxjs';

export type User = {
  id: string;
  name: string;
  surname: string;
  email: string;
  birth_date: string;
  active: boolean;
  notifications: boolean;
};

export type UserCreate = {
  name: string;
  surname: string;
  birth_date: string;
  notifications: boolean;
};

export type UserUpdate = Partial<UserCreate>;

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = '/api/users';

  readonly currentProfile = signal<User | null>(null);

  createProfile(payload: UserCreate): Observable<User> {
    return this.http.post<User>(`${this.apiUrl}/`, payload).pipe(
      tap(user => this.currentProfile.set(user)),
    );
  }

  getMe(): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/me`).pipe(
      tap(user => this.currentProfile.set(user)),
    );
  }

  updateMe(payload: UserUpdate): Observable<User> {
    return this.http.patch<User>(`${this.apiUrl}/me`, payload).pipe(
      tap(user => this.currentProfile.set(user)),
    );
  }
}
