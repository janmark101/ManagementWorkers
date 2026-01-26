import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastController, LoadingController } from '@ionic/angular';
import { AuthService } from 'src/app/Services/auth.service';

@Component({
  selector: 'app-verify-account',
  templateUrl: './verify-account.component.html',
  styleUrls: ['./verify-account.component.scss']
})
export class VerifyAccountComponent implements OnInit {

  activationCode: string[] = ['', '', '', '', '', ''];
  message = '';

  constructor(
    private Auth: AuthService, 
    private router: Router,
    private toastCtrl: ToastController,
    private loadingCtrl: LoadingController
  ) {}

  ngOnInit(): void {}

  handleInput(event: KeyboardEvent, index: number): void {
    const input = event.target as HTMLInputElement;
    const value = input.value;

    if (event.key === 'Backspace') {
      if (index > 0 && !value) {
        const prevInput = document.getElementById(`otp-${index - 1}`) as HTMLInputElement;
        prevInput?.focus();
      }
      return;
    }

    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`) as HTMLInputElement;
      nextInput?.focus();
    }
  }

  isCodeComplete(): boolean {
    return this.activationCode.every(char => char && char.trim() !== '');
  }

  async activate() {
    const codeString = this.activationCode.join('');
    const data = { 'verify_code': codeString };

    const loading = await this.loadingCtrl.create({
      message: 'Verifying...',
      spinner: 'crescent'
    });
    await loading.present();

    this.Auth.verifyAccount(data).subscribe({
      next: async (response: any) => {
        await loading.dismiss();
        const user = this.Auth.getUserFromLocalStorage();
        if (user) {
          user.verified = true;
          localStorage.setItem('user', JSON.stringify(user));
        }

        this.showToast('Account verified successfully!', 'success');
        this.router.navigate(['/home'], { replaceUrl: true });
      },
      error: async (error: any) => {
        await loading.dismiss();
        console.error(error);
        this.message = error.error?.error || 'Invalid verification code';
        this.showToast(this.message, 'danger');
      }
    });
  }

  async showToast(msg: string, color: string) {
    const toast = await this.toastCtrl.create({
      message: msg,
      duration: 3000,
      color: color,
      position: 'bottom'
    });
    toast.present();
  }
}