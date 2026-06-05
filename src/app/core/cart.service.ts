import { Injectable, signal, computed } from '@angular/core';
import { BubbleTea } from './bubble-teas';

export type CartItem = {
  tea: BubbleTea;
  quantity: number;
};

@Injectable({ providedIn: 'root' })
export class CartService {
  readonly items = signal<CartItem[]>([]);

  readonly totalItems = computed(() =>
    this.items().reduce((sum, item) => sum + item.quantity, 0)
  );

  readonly totalPrice = computed(() =>
    this.items().reduce((sum, item) => sum + item.tea.price * item.quantity, 0)
  );

  addItem(tea: BubbleTea): void {
    const current = this.items();
    const existing = current.find(item => item.tea.id === tea.id);
    if (existing) {
      this.items.set(
        current.map(item =>
          item.tea.id === tea.id ? { ...item, quantity: item.quantity + 1 } : item
        )
      );
    } else {
      this.items.set([...current, { tea, quantity: 1 }]);
    }
  }

  removeItem(teaId: number): void {
    this.items.set(this.items().filter(item => item.tea.id !== teaId));
  }

  updateQuantity(teaId: number, quantity: number): void {
    if (quantity <= 0) {
      this.removeItem(teaId);
      return;
    }
    this.items.set(
      this.items().map(item =>
        item.tea.id === teaId ? { ...item, quantity } : item
      )
    );
  }

  clear(): void {
    this.items.set([]);
  }
}
