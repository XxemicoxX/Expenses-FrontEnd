import { CommonModule } from '@angular/common';
import { Component, computed, ElementRef, forwardRef, signal, ViewChild } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { ClickOutsideDirective } from '../click-outside';

@Component({
  selector: 'app-datepicker',
  standalone: true,
  imports: [CommonModule, ClickOutsideDirective],
  templateUrl: './custom-datepicker.html',
  styleUrls: ['./custom-datepicker.css'],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => CustomDatepickerComponent),
    multi: true
  }]
})
export class CustomDatepickerComponent implements ControlValueAccessor {
  @ViewChild('trigger') triggerRef!: ElementRef;

  calendarTop = signal(0);
  calendarLeft = signal(0);
  calendarWidth = signal(280);

  open = signal(false);
  selected = signal<Date | null>(null);
  viewYear = signal(new Date().getFullYear());
  viewMonth = signal(new Date().getMonth());

  private onChange = (_: any) => { };
  private onTouched = () => { };

  readonly MONTHS = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
  readonly DAYS = ['Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sa', 'Do'];

  displayValue = computed(() => {
    const d = this.selected();
    if (!d) return '';
    return d.toLocaleDateString('es-PE', { day: '2-digit', month: 'long', year: 'numeric' });
  });

  days = computed(() => {
    const year = this.viewYear();
    const month = this.viewMonth();
    const first = new Date(year, month, 1).getDay();
    const total = new Date(year, month + 1, 0).getDate();
    const offset = (first === 0 ? 6 : first - 1);
    const cells: (number | null)[] = Array(offset).fill(null);
    for (let i = 1; i <= total; i++) cells.push(i);
    while (cells.length % 7 !== 0) cells.push(null);
    return cells;
  });

  toggle() {
    if (!this.open()) {
      const rect = this.triggerRef.nativeElement.getBoundingClientRect();
      this.calendarTop.set(rect.top - 10);   // arriba del input
      this.calendarLeft.set(rect.left);
      this.calendarWidth.set(rect.width);
    }
    this.open.update(v => !v);
    this.onTouched();
  }
  close() { this.open.set(false); }

  prevMonth() {
    if (this.viewMonth() === 0) { this.viewMonth.set(11); this.viewYear.update(y => y - 1); }
    else this.viewMonth.update(m => m - 1);
  }
  nextMonth() {
    if (this.viewMonth() === 11) { this.viewMonth.set(0); this.viewYear.update(y => y + 1); }
    else this.viewMonth.update(m => m + 1);
  }

  selectDay(day: number | null) {
    if (!day) return;
    const d = new Date(this.viewYear(), this.viewMonth(), day);
    this.selected.set(d);
    const iso = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    this.onChange(iso);
    this.close();
  }

  isSelected(day: number | null): boolean {
    if (!day || !this.selected()) return false;
    const s = this.selected()!;
    return s.getFullYear() === this.viewYear() && s.getMonth() === this.viewMonth() && s.getDate() === day;
  }

  isToday(day: number | null): boolean {
    if (!day) return false;
    const t = new Date();
    return t.getFullYear() === this.viewYear() && t.getMonth() === this.viewMonth() && t.getDate() === day;
  }

  writeValue(val: string) {
    if (val) {
      const d = new Date(val + 'T00:00:00');
      this.selected.set(d);
      this.viewYear.set(d.getFullYear());
      this.viewMonth.set(d.getMonth());
    } else {
      this.selected.set(null);
    }
  }
  registerOnChange(fn: any) { this.onChange = fn; }
  registerOnTouched(fn: any) { this.onTouched = fn; }
}
