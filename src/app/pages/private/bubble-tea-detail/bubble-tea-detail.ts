import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { BubbleTeaService } from '../../../core/bubble-teas';

@Component({
  selector: 'app-bubble-tea-detail',
  imports: [RouterLink, MatButtonModule, MatIconModule],
  templateUrl: './bubble-tea-detail.html',
  styleUrl: './bubble-tea-detail.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BubbleTeaDetail implements OnInit {
  protected readonly bubbleTeaService = inject(BubbleTeaService);
  protected readonly bubbleTeaDetail = this.bubbleTeaService.bubbleTeaDetail;
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.bubbleTeaService.getById(Number(id)).subscribe({
        error: () => this.router.navigateByUrl('/home'),
      });
    }
  }

  protected edit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      void this.router.navigateByUrl(`/bubble-teas/${id}/edit`);
    }
  }

  protected goBack(): void {
    void this.router.navigateByUrl('/home');
  }
}