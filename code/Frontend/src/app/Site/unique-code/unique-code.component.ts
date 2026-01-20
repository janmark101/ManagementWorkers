import { Component, Input, OnInit } from '@angular/core';
import { ModalController, ToastController } from '@ionic/angular';
import { take } from 'rxjs';
import { SiteService } from 'src/app/Services/site.service';
import { Clipboard } from '@capacitor/clipboard';

@Component({
  selector: 'app-unique-code',
  templateUrl: './unique-code.component.html',
  styleUrls: ['./unique-code.component.scss']
})
export class UniqueCodeComponent implements OnInit {

  // W Ionic Modals dane odbieramy przez @Input, nie przez Inject
  @Input() code: string = '';
  @Input() teamId: number | any;

  constructor(
    private modalCtrl: ModalController,
    private Service: SiteService,
    private toastCtrl: ToastController
  ) {}

  ngOnInit(): void {
    
  }

  regenerate() {
    this.Service.RegenerateUniqueCode(this.teamId).pipe(take(1)).subscribe({
      next: (data: any) => {
        this.code = data.code;
        this.showToast('Code regenerated successfully');
      },
      error: (error: any) => {
        console.error(error);
        this.showToast('Failed to regenerate code');
      }
    });
  }

  async copyToClipboard() {
    await Clipboard.write({
      string: this.code
    });
    this.showToast('Copied to clipboard!');
  }

  async showToast(msg: string) {
    const toast = await this.toastCtrl.create({
      message: msg,
      duration: 2000,
      position: 'bottom'
    });
    toast.present();
  }

  onCancel() {
    this.modalCtrl.dismiss();
  }
}