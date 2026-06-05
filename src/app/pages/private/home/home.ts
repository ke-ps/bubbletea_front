import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { BubbleTeaService } from '../../../core/bubble-teas';
import { AuthService } from '../../../core/auth.service';
import { UserService } from '../../../core/user.service';
import { CartService } from '../../../core/cart.service';

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
  protected readonly cartService = inject(CartService);

  private readonly router = inject(Router);

  ngOnInit(): void {
    this.bubbleTeaService.getAll().subscribe();
    this.userService.getMe().subscribe();
  }

  protected async logout(): Promise<void> {
    await this.authService.logout();
    await this.router.navigateByUrl('/login');
  }
}
