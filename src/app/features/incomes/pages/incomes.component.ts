import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { IncomeService } from '../../../core/services/income.service';
import { NotificationService } from '../../../core/services/notification.service';
import { AuthService } from '../../../core/services/auth.service';
import { DataTableComponent, TableColumn } from '../../../shared/components/data-table/data-table.component';
import { ModalFormComponent } from '../../../shared/components/modal-form/modal-form.component';
import { Income } from '../../../core/models';
import { CustomDatepickerComponent } from '../../../shared/components/custom-datepicker/custom-datepicker';

@Component({
  selector: 'app-incomes',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, DataTableComponent, ModalFormComponent, CustomDatepickerComponent],
  templateUrl: './incomes.component.html',
  styleUrls: ['./incomes.component.css']
})
export class IncomesComponent implements OnInit {
  private svc = inject(IncomeService);
  private notif = inject(NotificationService);
  private auth = inject(AuthService);
  private fb = inject(FormBuilder);

  items = signal<Income[]>([]);
  loading = signal(false);
  modalVisible = signal(false);
  isEdit = signal(false);

  columns: TableColumn[] = [
    { key: 'idIncome',    label: 'ID' },
    { key: 'amount',      label: 'Monto', type: 'currency' },
    { key: 'source',      label: 'Fuente' },
    { key: 'description', label: 'Descripción' },
    { key: 'date',        label: 'Fecha', type: 'date' },
  ];

  form = this.fb.group({
    idIncome:    [null as number | null],
    amount:      [null as number | null, [Validators.required, Validators.min(0)]],
    source:      ['', Validators.required],
    date:        [''],
    description: ['', Validators.required],
    idUser:      [null as number | null],
  });

  ngOnInit() { this.load(); }

  load() {
    this.loading.set(true);
    this.svc.getAll().subscribe({
      next: d => { this.items.set(d); this.loading.set(false); },
      error: () => { this.loading.set(false); this.notif.show('Error al cargar ingresos', 'error'); }
    });
  }

  openAdd() {
    this.isEdit.set(false);
    this.form.reset({ idUser: this.auth.getUserId() });
    this.modalVisible.set(true);
  }

  openEdit(row: Income) {
    this.isEdit.set(true);
    this.form.patchValue(row);
    this.modalVisible.set(true);
  }

  submit() {
    if (this.form.invalid) { this.notif.show('Completa todos los campos requeridos', 'error'); return; }
    const val = this.form.value as any;

    if (this.isEdit()) {
      const payload = {
        idIncome:    Number(val.idIncome),
        amount:      Number(val.amount),
        source:      val.source,
        date:        val.date || null,
        description: val.description,
        idUser:      Number(val.idUser)
      };
      this.svc.update(payload as any).subscribe({
        next: () => { this.notif.show('Ingreso actualizado', 'success'); this.modalVisible.set(false); this.load(); },
        error: () => this.notif.show('Error al guardar', 'error')
      });
    } else {
      const payload = {
        amount:      Number(val.amount),
        source:      val.source,
        date:        val.date || null,
        description: val.description,
        idUser:      this.auth.getUserId()
      };
      this.svc.create(payload as any).subscribe({
        next: () => { this.notif.show('Ingreso creado', 'success'); this.modalVisible.set(false); this.load(); },
        error: () => this.notif.show('Error al guardar', 'error')
      });
    }
  }

  delete(row: Income) {
    this.svc.delete(row.idIncome).subscribe({
      next: () => { this.notif.show('Ingreso eliminado', 'success'); this.load(); },
      error: () => this.notif.show('Error al eliminar', 'error')
    });
  }
}
