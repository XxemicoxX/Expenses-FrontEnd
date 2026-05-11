import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { SpentService } from '../../../core/services/spent.service';
import { PaymentService } from '../../../core/services/payment.service';
import { NotificationService } from '../../../core/services/notification.service';
import { AuthService } from '../../../core/services/auth.service';
import { DataTableComponent, TableColumn } from '../../../shared/components/data-table/data-table.component';
import { ModalFormComponent } from '../../../shared/components/modal-form/modal-form.component';
import { Spent, Categorie, Payment } from '../../../core/models';
import { forkJoin } from 'rxjs';
import { CustomDatepickerComponent } from '../../../shared/components/custom-datepicker/custom-datepicker';
import { CategorieService } from '../../../core/services/categorie.service';

@Component({
  selector: 'app-spents',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, DataTableComponent, ModalFormComponent, CustomDatepickerComponent],
  templateUrl: './spents.component.html',
  styleUrls: ['./spents.component.css']
})
export class SpentsComponent implements OnInit {
  private spentSvc = inject(SpentService);
  private categorieSvc = inject(CategorieService);
  private paymentSvc = inject(PaymentService);
  private notif = inject(NotificationService);
  private auth = inject(AuthService);
  private fb = inject(FormBuilder);

  spents = signal<any[]>([]);
  categories = signal<Categorie[]>([]);
  payments = signal<Payment[]>([]);
  loading = signal(false);
  modalVisible = signal(false);
  isEdit = signal(false);

  columns: TableColumn[] = [
    { key: 'idSpent', label: 'ID' },
    { key: 'name', label: 'Nombre' },
    { key: 'amount', label: 'Monto', type: 'currency' },
    { key: 'description', label: 'Descripción' },
    { key: 'date', label: 'Fecha', type: 'date' },
    { key: 'hour', label: 'Hora' },
    { key: 'categorieName', label: 'Categoría' },
    { key: 'paymentName', label: 'Pago' },
  ];

  form = this.fb.group({
    idSpent: [null as number | null],
    name: ['', Validators.required],
    amount: [null as number | null, [Validators.required, Validators.min(0)]],
    description: ['', Validators.required],
    date: [''],
    hour: [''],
    idPayment: [null as number | null, Validators.required],
    idCategorie: [null as number | null, Validators.required],
    idUser: [null as number | null],
  });

  ngOnInit() {
    this.loading.set(true);
    forkJoin({
      categories: this.categorieSvc.getAll(),
      payments: this.paymentSvc.getAll(),
    }).subscribe({
      next: ({ categories, payments }) => {
        this.categories.set(categories ?? []);
        this.payments.set(payments ?? []);
        this.load(); // ahora sí tiene los datos para cruzar
      },
      error: () => this.loading.set(false)
    });
  }

  load() {
    this.loading.set(true);
    this.spentSvc.getAll().subscribe({
      next: d => {
        const mapped = (d ?? []).map(s => ({
          ...s,
          paymentName: this.payments().find(p => p.idPayment === s.idPayment)?.name ?? s.idPayment,
          categorieName: this.categories().find(c => c.idCategorie === s.idCategorie)?.name ?? s.idCategorie,
        }));
        this.spents.set(mapped);
        this.loading.set(false);
      },
      error: () => { this.loading.set(false); this.notif.show('Error al cargar gastos', 'error'); }
    });
  }

  openAdd() {
    this.isEdit.set(false);
    this.form.reset({ idUser: this.auth.getUserId() });
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

    console.log('idUser:', this.auth.getUserId());  // ← agrega esto
    console.log('form value:', val);

    if (this.isEdit()) {
      const payload = {
        idSpent: Number(val.idSpent),
        name: val.name,
        amount: Number(val.amount),
        description: val.description,
        date: val.date || null,
        hour: val.hour || null,
        idPayment: Number(val.idPayment),
        idCategorie: Number(val.idCategorie),
        idUser: Number(val.idUser)
      };
      console.log('payload enviado:', payload);
      this.spentSvc.update(payload as any).subscribe({
        next: () => { this.notif.show('Gasto actualizado', 'success'); this.modalVisible.set(false); this.load(); },
        error: () => this.notif.show('Error al guardar', 'error')
      });
    } else {
      const payload = {
        name: val.name,
        amount: Number(val.amount),
        description: val.description,
        date: val.date || null,
        hour: val.hour || null,
        idPayment: Number(val.idPayment),
        idCategorie: Number(val.idCategorie),
        idUser: this.auth.getUserId()
      };
      this.spentSvc.create(payload as any).subscribe({
        next: () => { this.notif.show('Gasto creado', 'success'); this.modalVisible.set(false); this.load(); },
        error: () => this.notif.show('Error al guardar', 'error')
      });
    }
  }

  delete(row: Spent) {
    this.spentSvc.delete(row.idSpent).subscribe({
      next: () => { this.notif.show('Gasto eliminado', 'success'); this.load(); },
      error: () => this.notif.show('Error al eliminar', 'error')
    });
  }
}
