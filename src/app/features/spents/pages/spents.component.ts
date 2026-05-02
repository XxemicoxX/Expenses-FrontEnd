import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { SpentService } from '../../../core/services/spent.service';
import { CategorieService } from '../../../core/services/categorie.service';
import { PaymentService } from '../../../core/services/payment.service';
import { NotificationService } from '../../../core/services/notification.service';
import { DataTableComponent, TableColumn } from '../../../shared/components/data-table/data-table.component';
import { ModalFormComponent } from '../../../shared/components/modal-form/modal-form.component';
import { Spent, Categorie, Payment } from '../../../core/models';

@Component({
  selector: 'app-spents',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, DataTableComponent, ModalFormComponent],
  templateUrl: './spents.component.html',
  styleUrls: ['./spents.component.css']
})
export class SpentsComponent implements OnInit {
  private spentSvc = inject(SpentService);
  private categorieSvc = inject(CategorieService);
  private paymentSvc = inject(PaymentService);
  private notif = inject(NotificationService);
  private fb = inject(FormBuilder);

  spents = signal<Spent[]>([]);
  categories = signal<Categorie[]>([]);
  payments = signal<Payment[]>([]);
  loading = signal(false);
  modalVisible = signal(false);
  isEdit = signal(false);

  columns: TableColumn[] = [
    { key: 'id_spent', label: 'ID' },
    { key: 'name', label: 'Nombre' },
    { key: 'amount', label: 'Monto', type: 'currency' },
    { key: 'description', label: 'Descripción' },
    { key: 'date', label: 'Fecha', type: 'date' },
    { key: 'hour', label: 'Hora' },
    { key: 'id_categorie', label: 'Categoría' },
    { key: 'id_payment_method', label: 'Pago' },
  ];

  form = this.fb.group({
    id_spent: [null as number | null],
    name: ['', Validators.required],
    amount: [null as number | null, [Validators.required, Validators.min(0)]],
    description: ['', Validators.required],
    date: [''],
    hour: [''],
    id_payment_method: [null as number | null, Validators.required],
    id_categorie: [null as number | null, Validators.required],
    id_user: [1],
  });

  ngOnInit() {
    this.load();
    this.categorieSvc.getAll().subscribe({ next: d => this.categories.set(d), error: () => {} });
    this.paymentSvc.getAll().subscribe({ next: d => this.payments.set(d), error: () => {} });
  }

  load() {
    this.loading.set(true);
    this.spentSvc.getAll().subscribe({
      next: d => { this.spents.set(d); this.loading.set(false); },
      error: () => { this.loading.set(false); this.notif.show('Error al cargar gastos', 'error'); }
    });
  }

  openAdd() {
    this.isEdit.set(false);
    this.form.reset({ id_user: 1 });
    this.modalVisible.set(true);
  }

  openEdit(row: Spent) {
    this.isEdit.set(true);
    this.form.patchValue(row);
    this.modalVisible.set(true);
  }

  submit() {
    if (this.form.invalid) { this.notif.show('Completa todos los campos requeridos', 'error'); return; }
    const val = this.form.value as any;
    const action = this.isEdit() ? this.spentSvc.update(val) : this.spentSvc.create(val);
    action.subscribe({
      next: () => {
        this.notif.show(this.isEdit() ? 'Gasto actualizado' : 'Gasto creado', 'success');
        this.modalVisible.set(false);
        this.load();
      },
      error: () => this.notif.show('Error al guardar', 'error')
    });
  }

  delete(row: Spent) {
    this.spentSvc.delete(row.id_spent).subscribe({
      next: () => { this.notif.show('Gasto eliminado', 'success'); this.load(); },
      error: () => this.notif.show('Error al eliminar', 'error')
    });
  }
}
