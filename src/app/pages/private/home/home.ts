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
  protected readonly deletingId = signal<number | null>(null);

  ngOnInit(): void {
    this.bubbleTeaService.getAll().subscribe();
    this.userService.getMe().subscribe();
  }

  protected softDelete(tea: BubbleTea): void {
    if (!confirm(`¿Mover "${tea.name}" a la papelera?`)) {
      return;
    }

    this.deletingId.set(tea.id);
    this.bubbleTeaService.softDelete(tea.id).subscribe({
      complete: () => this.deletingId.set(null),
      error: () => this.deletingId.set(null),
    });
  }

  protected async logout(): Promise<void> {
    await this.authService.logout();
    await this.router.navigateByUrl('/login');
  }
}
