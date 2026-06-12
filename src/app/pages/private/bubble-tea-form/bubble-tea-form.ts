import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

import { BubbleTeaPayload, BubbleTeaService } from '../../../core/bubble-teas';

@Component({
  selector: 'app-bubble-tea-form',
  imports: [
    ReactiveFormsModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatSelectModule,
    MatSlideToggleModule,
  ],
  templateUrl: './bubble-tea-form.html',
  styleUrl: './bubble-tea-form.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BubbleTeaForm implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly bubbleTeaService = inject(BubbleTeaService);

  protected readonly editingId = signal<number | null>(null);
  protected readonly isSaving = signal(false);
  protected readonly errorMessage = signal('');
  protected readonly isEditing = computed(() => this.editingId() !== null);

  protected readonly temperatures = ['Frío', 'Caliente'];

  protected readonly form = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.maxLength(100)]],
    temperature: ['Frío', [Validators.required, Validators.maxLength(50)]],
    price: [0, [Validators.required, Validators.min(0.01)]],
    active: [true],
  });

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (!idParam) {
      return;
    }

    const id = Number(idParam);
    this.editingId.set(id);
    this.bubbleTeaService.getById(id).subscribe({
      next: (tea) =>
        this.form.patchValue({
          name: tea.name,
          temperature: tea.temperature,
          price: tea.price,
          active: tea.active,
        }),
      error: () => this.router.navigateByUrl('/home'),
    });
  }

  protected submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.isSaving.set(true);
    this.errorMessage.set('');

    const payload = this.form.getRawValue() satisfies BubbleTeaPayload;
    const id = this.editingId();

    if (id === null) {
      this.bubbleTeaService.create(payload).subscribe({
        next: () => {
          this.bubbleTeaService.getAll().subscribe();
          void this.router.navigateByUrl('/home');
        },
        error: () => {
          this.errorMessage.set('No se ha podido crear el bubble tea. Inténtalo de nuevo.');
          this.isSaving.set(false);
        },
      });
    } else {
      this.bubbleTeaService.patch(id, payload).subscribe({
        next: () => {
          this.bubbleTeaService.getAll().subscribe();
          void this.router.navigateByUrl('/home');
        },
        error: () => {
          this.errorMessage.set('No se ha podido actualizar el bubble tea. Inténtalo de nuevo.');
          this.isSaving.set(false);
        },
      });
    }
  }

  protected cancel(): void {
    void this.router.navigateByUrl('/home');
  }
}