import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { PaymentService } from '../../../core/services/payment.service';
import { TypeService } from '../../../core/services/type.service';
import { NotificationService } from '../../../core/services/notification.service';
import { DataTableComponent, TableColumn } from '../../../shared/components/data-table/data-table.component';
import { ModalFormComponent } from '../../../shared/components/modal-form/modal-form.component';
import { Payment, Type } from '../../../core/models';

@Component({
  selector: 'app-payments',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, DataTableComponent, ModalFormComponent],
  templateUrl: './payments.component.html',
  styleUrls: ['./payments.component.css']
})
export class PaymentsComponent implements OnInit {
  private svc = inject(PaymentService);
  private typeSvc = inject(TypeService);
  private notif = inject(NotificationService);
  private fb = inject(FormBuilder);

  items = signal<Payment[]>([]);
  types = signal<Type[]>([]);
  loading = signal(false);
  modalVisible = signal(false);
  isEdit = signal(false);

  columns: TableColumn[] = [
    { key: 'idPayment', label: 'ID' },
    { key: 'name', label: 'Nombre' },
    { key: 'tipoNombre', label: 'Tipo' },
  ];

  form = this.fb.group({
    id: [null as number | null],
    name: ['', Validators.required],
    idType: [null as number | null, Validators.required],
  });

  ngOnInit() {
    this.typeSvc.getAll().subscribe({
      next: d => {
        this.types.set(d);
        this.load(); // carga pagos DESPUÉS de tener los tipos
      },
      error: () => this.load()
    });
  }

  load() {
    this.loading.set(true);
    this.svc.getAll().subscribe({
      next: d => {
        const mapped = d.map(p => ({
          ...p,
          tipoNombre: this.types().find(t => t.idType === p.idType)?.name ?? '—'
        }));
        this.items.set(mapped as any);
        this.loading.set(false);
      },
      error: () => { this.loading.set(false); this.notif.show('Error al cargar métodos de pago', 'error'); }
    });
  }

  openAdd() { this.isEdit.set(false); this.form.reset(); this.modalVisible.set(true); }

  openEdit(row: Payment) { this.isEdit.set(true); this.form.patchValue(row); this.modalVisible.set(true); }

  submit() {
    if (this.form.invalid) { this.notif.show('Completa todos los campos', 'error'); return; }
    const val = this.form.value as any;
    if (!this.isEdit()) delete val.id;
    const action = this.isEdit() ? this.svc.update(val) : this.svc.create(val);
    action.subscribe({
      next: () => { this.notif.show('Método guardado', 'success'); this.modalVisible.set(false); this.load(); },
      error: () => this.notif.show('Error al guardar', 'error')
    });
  }

  delete(row: Payment) {
    this.svc.delete(row.idPayment).subscribe({
      next: () => { this.notif.show('Método eliminado', 'success'); this.load(); },
      error: () => this.notif.show('Error al eliminar', 'error')
    });
  }
  getTypeName(idType: number): string {
    const type = this.types().find(t => t.idType === idType);
    return type ? type.name : '—';
  }
}