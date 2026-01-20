import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { take } from 'rxjs';
import { SiteService } from 'src/app/Services/site.service';
import { AlertController, ModalController, ToastController } from '@ionic/angular';
import { faQrcode, faTrashCan, faUserXmark, faPaperclip, faFilePdf } from '@fortawesome/free-solid-svg-icons';
import { UniqueCodeComponent } from '../unique-code/unique-code.component';
import { AddingLinkComponent } from '../adding-link/adding-link.component';

@Component({
  selector: 'app-team-optionss',
  templateUrl: './team-optionss.component.html',
  styleUrls: ['./team-optionss.component.scss']
})
export class TeamOptionssComponent implements OnInit {

  generateRaport = faFilePdf;
  deleteUser = faUserXmark;
  codeIcon = faQrcode;
  deleteIcon = faTrashCan;
  linkIcon = faPaperclip;

  teamId: number | any;
  isManager: boolean = false;
  TeamUsers: any = [];
  TeamTasks: any = [];
  teamName: string = '';

  constructor(
    private route: ActivatedRoute,
    private Site: SiteService,
    private router: Router,
    private alertCtrl: AlertController,
    private modalCtrl: ModalController,
    private toastCtrl: ToastController,
  ) {}

  ngOnInit(): void {
    this.teamId = this.route.snapshot.params['id'];
    this.loadTeamData();
  }

  loadTeamData() {
    this.Site.getUsersForTeam(this.teamId).pipe(take(1)).subscribe({
      next: (data: any) => {
        this.isManager = data.manager;
        this.TeamUsers = data.data;
      },
      error: (err) => console.error(err)
    });

    this.Site.getTeamName(this.teamId).pipe(take(1)).subscribe({
      next: (data: any) => this.teamName = data.name,
      error: (err) => console.error(err)
    });

    this.Site.getTaskForTeam(this.teamId).pipe(take(1)).subscribe({
      next: (data: any) => this.TeamTasks = data,
      error: (err) => console.error(err)
    });
  }

  async deleteTeam() {
    const alert = await this.alertCtrl.create({
      header: 'Delete Team',
      message: 'Are you sure you want to delete this team? This action cannot be undone.',
      buttons: [
        { text: 'Cancel', role: 'cancel' },
        {
          text: 'Delete',
          role: 'destructive',
          handler: () => {
            this.Site.deleteTeam(this.teamId).pipe(take(1)).subscribe({
              next: () => {
                this.router.navigate(['/home']);
                this.showToast('Team deleted successfully');
              },
              error: () => this.showToast('Failed to delete team')
            });
          }
        }
      ]
    });
    await alert.present();
  }

  async removeUser(userId: number) {
    const alert = await this.alertCtrl.create({
      header: 'Remove User',
      message: 'Are you sure you want to remove this user from the team?',
      buttons: [
        { text: 'Cancel', role: 'cancel' },
        {
          text: 'Remove',
          role: 'destructive',
          handler: () => {
            this.Site.removeUserFromTeam(this.teamId, userId).pipe(take(1)).subscribe({
              next: () => {
                this.TeamUsers = this.TeamUsers.filter((u: any) => u.id !== userId);
                this.showToast('User removed');
              },
              error: (err) => {
                console.error(err);
                this.showToast('Failed to remove user');
              }
            });
          }
        }
      ]
    });
    await alert.present();
  }

  async showUniqueCode() {
    this.Site.UniqueCode(this.teamId).pipe(take(1)).subscribe(async (data: any) => {
      const codeToCopy = data.code;
      const modal = await this.modalCtrl.create({
        component: UniqueCodeComponent,
        componentProps: {
          code: codeToCopy,
          teamId: this.teamId
        },
      });
      await modal.present();
    });
  }

  async showAddingLink() {
    const modal = await this.modalCtrl.create({
      component: AddingLinkComponent,
      componentProps: {
        teamId: this.teamId
      }
    });
    await modal.present();
  }

  generatePdf() {
    this.Site.generatePdf(this.teamName, this.TeamUsers, this.TeamTasks);
    this.showToast('PDF Report generated');
  }

  async showToast(msg: string) {
    const toast = await this.toastCtrl.create({
      message: msg,
      duration: 2000,
      position: 'bottom',
      color: 'dark'
    });
    toast.present();
  }
}