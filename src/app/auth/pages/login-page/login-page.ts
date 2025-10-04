import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '@src/app/auth/services/auth-service';
import { NotificationService } from '@src/app/shared/services/notification-service';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';

interface LoginForm {
  email: string;
  password: string;
}

@Component({
  selector: 'auth-login-page',
  imports: [
    InputTextModule,
    ButtonModule,
    PasswordModule,
    FloatLabelModule,
    ReactiveFormsModule,
    CardModule,
  ],
  templateUrl: './login-page.html',
})
export class LoginPage {
  private router = inject(Router);
  formBuilder = inject(FormBuilder);

  loginForm = this.formBuilder.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  notification = inject(NotificationService);

  private authService = inject(AuthService);
  isLoading = signal(false);

  async onSubmit(event: Event) {
    event.preventDefault();

    if (!this.loginForm.valid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    const { email, password } = this.loginForm.value as LoginForm;

    this.isLoading.set(true);
    try {
      const { session, error } = await this.authService.signIn(email, password);

      if (error) {
        const msg =
          (error as unknown as { message?: string })?.message ??
          String(error ?? 'No se pudo iniciar sesión.');
        this.notification.error('Error', msg);
        return;
      }

      if (session) {
        this.notification.success('Autenticado', 'Bienvenido!');
        await this.router.navigate(['/admin']);
      } else {
        this.notification.info(
          'Atención',
          'Revisa tu correo para confirmar la cuenta.',
        );
      }
    } catch (e) {
      this.notification.error('Error', 'Error inesperado al iniciar sesión.');
    } finally {
      this.isLoading.set(false);
    }
  }
}
