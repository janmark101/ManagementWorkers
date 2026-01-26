import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/Services/auth.service';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss'],
})
export class ResetPasswordComponent implements OnInit {
  password: string = '';
  uid: string = '';
  token: string = '';

  constructor(
    private route: ActivatedRoute,
    private auth: AuthService,
    private router: Router,
    private toast: ToastController
  ) {}

  ngOnInit() {
    this.uid = this.route.snapshot.paramMap.get('uid') || '';
    this.token = this.route.snapshot.paramMap.get('token') || '';
  }

  submit() {
    const data = {
      uidb64: this.uid,
      token: this.token,
      password: this.password
    };

    console.log('submit password reset')
    this.auth.confirmPasswordReset(data).subscribe({
      next: () => {
        this.showToast('Password changed successfully!', 'success');
        this.router.navigate(['/login']);
      },
      error: (err) => {
        console.error(err);
        this.showToast('Invalid or expired link.', 'danger');
      }
    });
  }

  async showToast(msg: string, color: string) {
    const t = await this.toast.create({ message: msg, duration: 3000, color: color, position: 'bottom' });
    t.present();
  }
}