import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { NavController } from '@ionic/angular';
import { SiteService } from 'src/app/Services/site.service';

@Component({
  selector: 'app-join-team',
  templateUrl: './join-team.component.html',
  styleUrls: ['./join-team.component.scss']
})
export class JoinTeamComponent {

  message: string = "";
  success: boolean = false;

  constructor(
    private router: Router,
    private navCtrl: NavController,
    private service: SiteService
  ) { }

  onSubmit(form: NgForm) {
    if (form.invalid) return;

    this.service.joinTeam(form.value.unique_code).subscribe({
      next: (data: any) => {
        this.message = data.message;
        this.success = true;
      },
      error: (error: any) => {
        console.error(error);
        this.success = false;

        if (error.error && error.error.message) {
          this.message = error.error.message;
        } else {
          this.message = 'Wrong code. Try again!';
        }
      }
    });
  }

  onCancel() {
    this.navCtrl.back();
  }

  onClose() {
    this.router.navigate(['/home']);
  }
}