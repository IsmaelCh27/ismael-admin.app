import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { NotificationService } from '@src/app/shared/services/notification-service';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';

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
  formBuilder = inject(FormBuilder);

  loginForm = this.formBuilder.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  notification = inject(NotificationService);

  onSubmit() {
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;
      if (email === 'isma@email.com' && password === '123456') {
        this.notification.success('Autenticado', 'Bien venido!');
      } else {
        this.notification.error(
          'Error',
          'Correo electrónico o contraseña no válidos.',
        );
      }
    } else {
    }
  }
}
