import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { BubbleTeaService } from '../../../core/bubble-teas';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-bubble-tea-detail',
  standalone: true,
  imports: [MatButtonModule, CommonModule],
  templateUrl: './bubble-tea-detail.html',
  styleUrl: './bubble-tea-detail.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BubbleTeaDetail implements OnInit {
  private readonly bubbleTeaService = inject(BubbleTeaService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  readonly bubbleTeaDetail = this.bubbleTeaService.bubbleTeaDetail;

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.bubbleTeaService.getById(Number(id)).subscribe({
        error: () => this.router.navigateByUrl('/home'),
      });
    }
  }

  goBack(): void {
    this.router.navigateByUrl('/home');
  }
}
