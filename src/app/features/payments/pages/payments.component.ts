import { Component, OnInit, signal, inject, Type } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { PaymentService } from '../../../core/services/payment.service';
import { NotificationService } from '../../../core/services/notification.service';
import { DataTableComponent, TableColumn } from '../../../shared/components/data-table/data-table.component';
import { ModalFormComponent } from '../../../shared/components/modal-form/modal-form.component';
import { IncomeType, Payment } from '../../../core/models';
import { TypeService } from '../../../core/services/type.service';

@Component({
  selector: 'app-payments',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, DataTableComponent, ModalFormComponent],
  templateUrl: './payments.component.html',
  styleUrls: ['./payments.component.css']
})
export class PaymentsComponent implements OnInit {
  private svc = inject(PaymentService);
  private typeSvc = inject(TypeService);        // ← agregar
  private notif = inject(NotificationService);
  private fb = inject(FormBuilder);

  items = signal<Payment[]>([]);
  types = signal<IncomeType[]>([]);                  // ← agregar
  loading = signal(false);
  modalVisible = signal(false);
  isEdit = signal(false);

  columns: TableColumn[] = [
    { key: 'idPayment', label: 'ID' },
    { key: 'name', label: 'Nombre' },
    { key: 'typeName', label: 'Tipo' },
  ];

  form = this.fb.group({
    idPayment: [null as number | null],
    name: ['', Validators.required],
    idType: [null as number | null, Validators.required],  // ← era 'type'
  });

  ngOnInit() {
    this.typeSvc.getAll().subscribe({
      next: d => { this.types.set(d ?? []); this.load(); },
      error: () => { }
    });
  }

  load() {
    this.loading.set(true);
    this.svc.getAll().subscribe({
      next: d => {
        const mapped = (d ?? []).map(p => ({
          ...p,
          typeName: this.types().find(t => t.idType === p.idType)?.name ?? p.idType,
        }));
        this.items.set(mapped);
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
    const payload = {
      id: val.idPayment,
      name: val.name,
      idType: Number(val.idType),
    };
    const action = this.isEdit()
      ? this.svc.update(payload as any)
      : this.svc.create(payload as any);
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
}
