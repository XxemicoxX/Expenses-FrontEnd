import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';
import { ThemeService } from '../../../../core/services/theme.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  private auth = inject(AuthService);
  private router = inject(Router);
  private fb = inject(FormBuilder);
  theme = inject(ThemeService);

  loading = signal(false);
  error = signal('');
  showPassword = signal(false);

  form = this.fb.group({
    email:     ['', [Validators.required, Validators.email]],
    contrasena: ['', Validators.required],
  });

  submit() {
    if (this.form.invalid) { this.error.set('Completa todos los campos'); return; }
    this.loading.set(true);
    this.error.set('');

    const { email, contrasena } = this.form.value;
    this.auth.login(email!, contrasena!).subscribe({
      next: () => { this.loading.set(false); this.router.navigate(['/dashboard']); },
      error: (e: any) => {
        this.loading.set(false);
        this.error.set(e.status === 401 ? 'Email o contraseña incorrectos' : 'Error al conectar con el servidor');
      }
    });
  }
}
