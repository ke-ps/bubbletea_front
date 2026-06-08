import { Injectable, signal } from '@angular/core';
import { FirebaseError, initializeApp } from 'firebase/app';
import {
  browserLocalPersistence,
  createUserWithEmailAndPassword,
  getAuth,
  onAuthStateChanged,
  setPersistence,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  User,
} from 'firebase/auth';
import { firstValueFrom, Observable } from 'rxjs';

import { firebaseConfig } from '../../environments/firebase.config';

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  readonly currentUser = signal<User | null>(auth.currentUser);

  constructor() {
    void setPersistence(auth, browserLocalPersistence);

    onAuthStateChanged(auth, (user) => {
      this.currentUser.set(user);
    });
  }

  login(email: string, password: string): Promise<void> {
    return signInWithEmailAndPassword(auth, email, password).then(() => undefined);
  }

 async register(email: string, password: string, name: string): Promise<string> {
  const credential = await createUserWithEmailAndPassword(auth, email, password);
  await updateProfile(credential.user, { displayName: name });
  const token = await credential.user.getIdToken();
  this.currentUser.set(credential.user);
  return token;
}

  logout(): Promise<void> {
    return signOut(auth);
  }

  async getIdToken(): Promise<string | null> {
    const user = auth.currentUser ?? (await firstValueFrom(this.userOnce()));
    return user?.getIdToken() ?? null;
  }

  userOnce(): Observable<User | null> {
    return new Observable<User | null>((subscriber) => {
      const unsubscribe = onAuthStateChanged(auth, (user) => {
        subscriber.next(user);
        subscriber.complete();
      });

      return unsubscribe;
    });
  }
}

export function getAuthErrorMessage(error: unknown): string {
  if (!(error instanceof FirebaseError)) {
    return 'Ha ocurrido un error inesperado.';
  }

  const messages: Record<string, string> = {
    'auth/email-already-in-use': 'Este email ya tiene una cuenta creada.',
    'auth/invalid-email': 'El email no tiene un formato válido.',
    'auth/weak-password': 'La contraseña debe tener al menos 6 caracteres.',
    'auth/user-not-found': 'No existe ninguna cuenta con este email.',
    'auth/wrong-password': 'La contraseña no es correcta.',
    'auth/invalid-credential': 'Email o contraseña incorrectos.',
    'auth/operation-not-allowed':
      'Firebase no tiene activado el registro con email y contraseña.',
    'auth/configuration-not-found':
      'Firebase Authentication no está configurado en este proyecto.',
    'auth/network-request-failed':
      'No se ha podido conectar con Firebase. Revisa tu conexión.',
  };

  return messages[error.code] ?? `Firebase ha devuelto este error: ${error.code}`;
}
