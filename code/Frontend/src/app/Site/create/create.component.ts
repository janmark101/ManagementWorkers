import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { NavController } from '@ionic/angular';
import { SiteService } from 'src/app/Services/site.service';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss'],
})
export class CreateComponent {

  message: string = "";
  success: boolean = false;

  constructor(
    private router: Router,
    private navCtrl: NavController,
    private service: SiteService
  ) {}

  onSubmit(form: NgForm) {
    if (form.invalid) return;

    const requestData = {
      "name": form.value.name,
      "description": form.value.description,
    };

    this.service.createTeam(requestData).subscribe({
      next: (response: any) => {
        this.message = `Team created! Code: ${response.unique_code}`;
        this.success = true;
      },
      error: (error: any) => {
        console.error(error);
        this.message = "Something went wrong! Try again.";
        this.success = false;
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