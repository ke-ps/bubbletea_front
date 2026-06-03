import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';

import { BubbleTeaService } from '../../../core/bubble-teas';

import { AuthService } from '../../../core/auth.service';

@Component({
  selector: 'app-home',
  imports: [RouterLink, MatButtonModule],
  templateUrl: './home.html',
  styleUrl: './home.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Home implements OnInit {
  protected readonly bubbleTeaService = inject(BubbleTeaService);

  private readonly router = inject(Router);
  protected readonly authService = inject(AuthService);

  ngOnInit(): void {
    this.bubbleTeaService.getAll().subscribe();
  }

  protected async logout(): Promise<void> {
    await this.authService.logout();
    await this.router.navigateByUrl('/login');
  }
}