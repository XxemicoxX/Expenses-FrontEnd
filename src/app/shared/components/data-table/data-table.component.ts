import { Component, Input, Output, EventEmitter, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

export interface TableColumn {
  key: string;
  label: string;
  type?: 'text' | 'currency' | 'date' | 'badge';
}

@Component({
  selector: 'app-data-table',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './data-table.component.html',
  styleUrls: ['./data-table.component.css']
})
export class DataTableComponent {
  @Input() columns: TableColumn[] = [];

  private _data: any[] = [];
  @Input() set data(value: any[]) {
    this._data = value ?? [];
  }
  get data(): any[] {
    return this._data;
  }

  @Input() title = 'Registros';
  @Input() loading = false;
  @Output() editItem = new EventEmitter<any>();
  @Output() deleteItem = new EventEmitter<any>();
  @Output() addItem = new EventEmitter<void>();

  searchQuery = signal('');

  get filtered(): any[] {
    const items = this.data ?? []; // ← guard aquí
    const q = this.searchQuery().toLowerCase();
    if (!q) return items;
    return items.filter(row =>
      Object.values(row).some(v => String(v).toLowerCase().includes(q))
    );
  }

  formatCell(value: any, type: string = 'text'): string {
    if (value === null || value === undefined) return '—';
    if (type === 'currency') return `S/ ${Number(value).toFixed(2)}`;
    if (type === 'date') return new Date(value).toLocaleDateString('es-PE');
    return String(value);
  }

  pendingDelete = signal<any>(null);
  
  confirmDelete(row: any, event: MouseEvent) {
    event.stopPropagation();
    this.pendingDelete.set(row);
  }

  cancelDelete() {
    this.pendingDelete.set(null);
  }

  executeDelete() {
    this.deleteItem.emit(this.pendingDelete());
    this.pendingDelete.set(null);
  }
}
