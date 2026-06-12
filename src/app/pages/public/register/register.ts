import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { firstValueFrom } from 'rxjs';
import { passwordsMatchValidator } from '../../../shared/utils';
import { AuthService, getAuthErrorMessage } from '../../../core/auth.service';
import { UserService } from '../../../core/user.service';


@Component({
  selector: 'app-register',
  imports: [
    ReactiveFormsModule,
    RouterLink,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    MatCheckboxModule,
  ],
  templateUrl: './register.html',
  styleUrl: './register.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Register {
  private readonly authService = inject(AuthService);
  private readonly userService = inject(UserService);
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);

  protected readonly errorMessage = signal('');
  protected readonly isLoading = signal(false);

  protected readonly form = this.fb.nonNullable.group(
    {
      email: ['', [Validators.required, Validators.email]],
      name: ['', [Validators.required]],
      surname: ['', [Validators.required]],
      birth_date: ['', [Validators.required]],
      notifications: [false],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]],
    },
    { validators: passwordsMatchValidator() },
  );

  protected async submit(): Promise<void> {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.errorMessage.set('');
    this.isLoading.set(true);

    try {
      const { email, password, name, surname, birth_date, notifications } = this.form.getRawValue();
      
      console.log('1. Registrando en Firebase...');
      await this.authService.register(email, password, name);
      console.log('2. Firebase OK');
      
      // Esperar a que el token esté listo
      await new Promise(resolve => setTimeout(resolve, 500));
      console.log('3. Token debería estar listo');
      
      console.log('4. Creando perfil en MySQL...');
      await firstValueFrom(this.userService.createProfile({ name, surname, birth_date, notifications }));
      console.log('5. Perfil creado OK');
      
      await this.router.navigateByUrl('/home');
    } catch (error) {
      console.error('Error en registro:', error);
      this.errorMessage.set(getAuthErrorMessage(error));
    } finally {
      this.isLoading.set(false);
    }
  }
}
