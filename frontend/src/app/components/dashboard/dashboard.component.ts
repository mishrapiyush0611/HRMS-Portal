import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableModule } from '@angular/material/table';
import { DashboardService } from '../../services/dashboard.service';
import { DashboardSummary } from '../../models/dashboard.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule, MatProgressSpinnerModule, MatTableModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent implements OnInit {
  summary: DashboardSummary | null = null;
  loading = true;
  error = '';
  todayFormatted = '';

  constructor(private dashboardService: DashboardService) {}

  ngOnInit(): void {
    this.loadSummary();
  }

  loadSummary(): void {
    this.loading = true;
    this.error = '';
    this.dashboardService.getSummary().subscribe({
      next: (data) => {
        this.summary = data;
        const d = new Date(data.today + 'T00:00:00');
        this.todayFormatted = d.toLocaleDateString('en-US', {
          weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
        });
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load dashboard data. Please try again.';
        this.loading = false;
      },
    });
  }
}
