import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { BubbleTea, BubbleTeaService } from '../../../core/bubble-teas';

@Component({
  selector: 'app-trash',
  imports: [RouterLink, MatButtonModule, MatIconModule],
  templateUrl: './trash.html',
  styleUrl: './trash.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Trash implements OnInit {
  protected readonly bubbleTeaService = inject(BubbleTeaService);

  protected readonly pendingId = signal<number | null>(null);

  ngOnInit(): void {
    this.bubbleTeaService.getTrash().subscribe();
  }

  protected restore(tea: BubbleTea): void {
    this.pendingId.set(tea.id);
    this.bubbleTeaService.restore(tea.id).subscribe({
      complete: () => this.pendingId.set(null),
      error: () => this.pendingId.set(null),
    });
  }

  protected permanentDelete(tea: BubbleTea): void {
    if (!confirm(`¿Eliminar "${tea.name}" definitivamente? Esta acción no se puede deshacer.`)) {
      return;
    }

    this.pendingId.set(tea.id);
    this.bubbleTeaService.permanentDelete(tea.id).subscribe({
      complete: () => this.pendingId.set(null),
      error: () => this.pendingId.set(null),
    });
  }
}
