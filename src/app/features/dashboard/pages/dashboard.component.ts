import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SpentService } from '../../../core/services/spent.service';
import { IncomeService } from '../../../core/services/income.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  private spentSvc = inject(SpentService);
  private incomeSvc = inject(IncomeService);

  totalSpents = signal(0);
  totalIncomes = signal(0);
  spentCount = signal(0);
  incomeCount = signal(0);

  recentSpents = signal<any[]>([]);
  today = new Date();

  cards = [
    { label: 'Total Gastos', key: 'spents', color: 'red', icon: '▼' },
    { label: 'Total Ingresos', key: 'incomes', color: 'green', icon: '▲' },
    { label: 'Balance', key: 'balance', color: 'blue', icon: '≈' },
  ];

  ngOnInit() {
    this.spentSvc.getAll().subscribe({
      next: data => {
        this.spentCount.set(data.length);
        this.totalSpents.set(data.reduce((a, b) => a + b.amount, 0));
        this.recentSpents.set(data.slice(-5).reverse());
      },
      error: () => {}
    });

    this.incomeSvc.getAll().subscribe({
      next: data => {
        this.incomeCount.set(data.length);
        this.totalIncomes.set(data.reduce((a, b) => a + b.amount, 0));
      },
      error: () => {}
    });
  }

  get balance(): number {
    return this.totalIncomes() - this.totalSpents();
  }
}
