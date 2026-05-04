import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { TypeService } from '../../../core/services/type.service';
import { NotificationService } from '../../../core/services/notification.service';
import { DataTableComponent, TableColumn } from '../../../shared/components/data-table/data-table.component';
import { ModalFormComponent } from '../../../shared/components/modal-form/modal-form.component';
import { Type } from '../../../core/models';

@Component({
  selector: 'app-types',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, DataTableComponent, ModalFormComponent],
  templateUrl: './types.component.html',
  styleUrls: ['./types.component.css']
})
export class TypesComponent implements OnInit {
  private svc = inject(TypeService);
  private notif = inject(NotificationService);
  private fb = inject(FormBuilder);

  items = signal<Type[]>([]);
  loading = signal(false);
  modalVisible = signal(false);
  isEdit = signal(false);

  columns: TableColumn[] = [
    { key: 'idType', label: 'ID' },
    { key: 'name', label: 'Nombre' },
    { key: 'description', label: 'Descripción' },
  ];

  form = this.fb.group({
    idType: [null as number | null],
    name: ['', Validators.required],
    description: ['', Validators.required],
  });

  ngOnInit() { this.load(); }

  load() {
    this.loading.set(true);
    this.svc.getAll().subscribe({
      next: d => { this.items.set(d); this.loading.set(false); },
      error: () => { this.loading.set(false); this.notif.show('Error al cargar tipos', 'error'); }
    });
  }

  openAdd() { this.isEdit.set(false); this.form.reset(); this.modalVisible.set(true); }

  openEdit(row: Type) { this.isEdit.set(true); this.form.patchValue(row); this.modalVisible.set(true); }

  submit() {
    if (this.form.invalid) { this.notif.show('Completa todos los campos', 'error'); return; }
    const val = this.form.value as any;

    if (this.isEdit()) {
      const payload = {
        idType: Number(val.idType),
        name: val.name,
        description: val.description
      };
      this.svc.update(payload as any).subscribe({
        next: () => { this.notif.show('Tipo actualizado', 'success'); this.modalVisible.set(false); this.load(); },
        error: () => this.notif.show('Error al guardar', 'error')
      });
    } else {
      const payload = {
        name: val.name,
        description: val.description
      };
      this.svc.create(payload as any).subscribe({
        next: () => { this.notif.show('Tipo creado', 'success'); this.modalVisible.set(false); this.load(); },
        error: () => this.notif.show('Error al guardar', 'error')
      });
    }
  }

  delete(row: Type) {
    this.svc.delete(row.idType).subscribe({
      next: () => { this.notif.show('Tipo eliminado', 'success'); this.load(); },
      error: () => this.notif.show('Error al eliminar', 'error')
    });
  }
}