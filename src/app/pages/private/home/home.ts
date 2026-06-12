import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { BubbleTea, BubbleTeaService } from '../../../core/bubble-teas';
import { AuthService } from '../../../core/auth.service';
import { UserService } from '../../../core/user.service';

@Component({
  selector: 'app-home',
  imports: [RouterLink, MatButtonModule, MatIconModule],
  templateUrl: './home.html',
  styleUrl: './home.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Home implements OnInit {
  protected readonly bubbleTeaService = inject(BubbleTeaService);
  protected readonly authService = inject(AuthService);
  protected readonly userService = inject(UserService);

  private readonly router = inject(Router);

  protected readonly deletingIds = signal<Set<number>>(new Set());

  ngOnInit(): void {
    this.bubbleTeaService.getAll().subscribe();
    this.userService.getMe().subscribe();
  }

  protected edit(tea: BubbleTea): void {
    void this.router.navigateByUrl(`/bubble-teas/${tea.id}/edit`);
  }

  protected delete(tea: BubbleTea): void {
    if (this.deletingIds().has(tea.id)) {
      return;
    }

    if (!confirm(`¿Eliminar "${tea.name}"? Podrás recuperarlo desde la papelera.`)) {
      return;
    }

    this.deletingIds.update(ids => {
      const newIds = new Set(ids);
      newIds.add(tea.id);
      return newIds;
    });

    this.bubbleTeaService.softDelete(tea.id).subscribe({
      error: () => {
        this.deletingIds.update(ids => {
          const newIds = new Set(ids);
          newIds.delete(tea.id);
          return newIds;
        });
      },
    });
  }

  protected async logout(): Promise<void> {
    await this.authService.logout();
    await this.router.navigateByUrl('/login');
  }
}