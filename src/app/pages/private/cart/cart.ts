import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CartService } from '../../../core/cart.service';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [RouterLink, MatButtonModule, MatIconModule],
  templateUrl: './cart.html',
  styleUrl: './cart.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Cart {
  protected readonly cartService = inject(CartService);

  increase(teaId: number): void {
    const item = this.cartService.items().find(i => i.tea.id === teaId);
    if (item) {
      this.cartService.updateQuantity(teaId, item.quantity + 1);
    }
  }

  decrease(teaId: number): void {
    const item = this.cartService.items().find(i => i.tea.id === teaId);
    if (item) {
      this.cartService.updateQuantity(teaId, item.quantity - 1);
    }
  }

  remove(teaId: number): void {
    this.cartService.removeItem(teaId);
  }

  clearCart(): void {
    if (confirm('¿Vaciar el carrito?')) {
      this.cartService.clear();
    }
  }
}
