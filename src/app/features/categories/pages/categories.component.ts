import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { CategorieService } from '../../../core/services/categorie.service';
import { NotificationService } from '../../../core/services/notification.service';
import { DataTableComponent, TableColumn } from '../../../shared/components/data-table/data-table.component';
import { ModalFormComponent } from '../../../shared/components/modal-form/modal-form.component';
import { Categorie } from '../../../core/models';

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, DataTableComponent, ModalFormComponent],
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.css']
})
export class CategoriesComponent implements OnInit {
  private svc = inject(CategorieService);
  private notif = inject(NotificationService);
  private fb = inject(FormBuilder);

  items = signal<Categorie[]>([]);
  loading = signal(false);
  modalVisible = signal(false);
  isEdit = signal(false);

  columns: TableColumn[] = [
    { key: 'idCategorie',  label: 'ID' },
    { key: 'name',         label: 'Nombre' },
    { key: 'description',  label: 'Descripción' },
  ];

  form = this.fb.group({
    idCategorie:  [null as number | null],
    name:         ['', Validators.required],
    description:  ['', Validators.required],
  });

  ngOnInit() { this.load(); }

  load() {
    this.loading.set(true);
    this.svc.getAll().subscribe({
      next: d => { this.items.set(d); this.loading.set(false); },
      error: () => { this.loading.set(false); this.notif.show('Error al cargar categorías', 'error'); }
    });
  }

  openAdd() { this.isEdit.set(false); this.form.reset(); this.modalVisible.set(true); }

  openEdit(row: Categorie) { this.isEdit.set(true); this.form.patchValue(row); this.modalVisible.set(true); }

  submit() {
    if (this.form.invalid) { this.notif.show('Completa todos los campos', 'error'); return; }
    const val = this.form.value as any;
    if (!this.isEdit()) delete val.idCategorie;
    const action = this.isEdit() ? this.svc.update(val) : this.svc.create(val);
    action.subscribe({
      next: () => { this.notif.show(this.isEdit() ? 'Categoría actualizada' : 'Categoría creada', 'success'); this.modalVisible.set(false); this.load(); },
      error: () => this.notif.show('Error al guardar', 'error')
    });
  }

  delete(row: Categorie) {
    this.svc.delete(row.idCategorie).subscribe({
      next: () => { this.notif.show('Categoría eliminada', 'success'); this.load(); },
      error: () => this.notif.show('Error al eliminar', 'error')
    });
  }
}