import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { IncomeService } from '../../../core/services/income.service';
import { TypeService } from '../../../core/services/type.service';
import { NotificationService } from '../../../core/services/notification.service';
import { DataTableComponent, TableColumn } from '../../../shared/components/data-table/data-table.component';
import { ModalFormComponent } from '../../../shared/components/modal-form/modal-form.component';
import { Income, Type } from '../../../core/models';

@Component({
  selector: 'app-incomes',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, DataTableComponent, ModalFormComponent],
  templateUrl: './incomes.component.html',
  styleUrls: ['./incomes.component.css']
})
export class IncomesComponent implements OnInit {
  private svc = inject(IncomeService);
  private typeSvc = inject(TypeService);
  private notif = inject(NotificationService);
  private fb = inject(FormBuilder);

  items = signal<Income[]>([]);
  types = signal<Type[]>([]);
  loading = signal(false);
  modalVisible = signal(false);
  isEdit = signal(false);

  columns: TableColumn[] = [
    { key: 'id_income', label: 'ID' },
    { key: 'name', label: 'Nombre' },
    { key: 'amount', label: 'Monto', type: 'currency' },
    { key: 'description', label: 'Descripción' },
    { key: 'source', label: 'Fuente' },
    { key: 'date', label: 'Fecha', type: 'date' },
  ];

  form = this.fb.group({
    id_income: [null as number | null],
    name: ['', Validators.required],
    amount: [null as number | null, [Validators.required, Validators.min(0)]],
    description: ['', Validators.required],
    date: [''],
    hour: [''],
    source: ['', Validators.required],
    id_type: [null as number | null, Validators.required],
    id_user: [1],
  });

  ngOnInit() {
    this.load();
    this.typeSvc.getAll().subscribe({ next: d => this.types.set(d), error: () => {} });
  }

  load() {
    this.loading.set(true);
    this.svc.getAll().subscribe({
      next: d => { this.items.set(d); this.loading.set(false); },
      error: () => { this.loading.set(false); this.notif.show('Error al cargar ingresos', 'error'); }
    });
  }

  openAdd() { this.isEdit.set(false); this.form.reset({ id_user: 1 }); this.modalVisible.set(true); }
  openEdit(row: Income) { this.isEdit.set(true); this.form.patchValue(row); this.modalVisible.set(true); }

  submit() {
    if (this.form.invalid) { this.notif.show('Completa todos los campos requeridos', 'error'); return; }
    const val = this.form.value as any;
    const action = this.isEdit() ? this.svc.update(val) : this.svc.create(val);
    action.subscribe({
      next: () => { this.notif.show(this.isEdit() ? 'Ingreso actualizado' : 'Ingreso creado', 'success'); this.modalVisible.set(false); this.load(); },
      error: () => this.notif.show('Error al guardar', 'error')
    });
  }

  delete(row: Income) {
    this.svc.delete(row.id_income).subscribe({
      next: () => { this.notif.show('Ingreso eliminado', 'success'); this.load(); },
      error: () => this.notif.show('Error al eliminar', 'error')
    });
  }
}
