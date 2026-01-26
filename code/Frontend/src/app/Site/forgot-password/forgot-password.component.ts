import { Component } from '@angular/core';
import { AuthService } from 'src/app/Services/auth.service';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss'],
})
export class ForgotPasswordComponent {
  email: string = '';

  constructor(private auth: AuthService, private toast: ToastController) {}

  submit() {
    this.auth.requestPasswordReset(this.email).subscribe({
      next: () => this.showToast('Link sent! Check your email.', 'success'),
      error: () => this.showToast('Link sent! Check your email.', 'success')
    });
  }

  async showToast(msg: string, color: string) {
    const t = await this.toast.create({ message: msg, duration: 3000, color: color, position: 'bottom' });
    t.present();
  }
}