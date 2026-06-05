import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { BubbleTea, BubbleTeaService } from '../../../core/bubble-teas';
import { CartService } from '../../../core/cart.service';

@Component({
  selector: 'app-bubble-tea-detail',
  standalone: true,
  imports: [MatButtonModule, MatIconModule, CommonModule],
  templateUrl: './bubble-tea-detail.html',
  styleUrl: './bubble-tea-detail.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BubbleTeaDetail implements OnInit {
  private readonly bubbleTeaService = inject(BubbleTeaService);
  private readonly cartService = inject(CartService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  readonly bubbleTeaDetail = this.bubbleTeaService.bubbleTeaDetail;
  readonly addedToCart = signal(false);

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.bubbleTeaService.getById(Number(id)).subscribe({
        error: () => this.router.navigateByUrl('/home'),
      });
    }
  }

  addToCart(tea: BubbleTea): void {
    this.cartService.addItem(tea);
    this.addedToCart.set(true);
    setTimeout(() => this.addedToCart.set(false), 2000);
  }

  goBack(): void {
    this.router.navigateByUrl('/home');
  }
}
