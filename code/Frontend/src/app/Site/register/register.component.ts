import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/Services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {

  error = "";

  constructor(private Auth: AuthService, private router: Router) { }

  onSubmit(form: NgForm) {
    if (form.invalid) {
      this.error = "Please fill all fields!";
      return;
    }

    let data = {
      "username": form.value.username,
      "first_name": form.value.firstname,
      "last_name": form.value.lastname,
      "email": form.value.email,
      "password": form.value.password,
    };

    this.Auth.register(data).subscribe({
      next: (res: any) => {
        this.error = 'Registered succesfully!';
        form.reset();

        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 1500);
      },
      error: (error: any) => {
        console.error(error);

        if (error.error && error.error.error) {
          const errObj = error.error.error;

          if (errObj.email) {
            this.error = Array.isArray(errObj.email) ? errObj.email[0] : errObj.email;
          } else if (errObj.username) {
            this.error = Array.isArray(errObj.username) ? errObj.username[0] : errObj.username;
          } else if (errObj.password) {
            this.error = Array.isArray(errObj.password) ? errObj.password[0] : errObj.password;
          } else {
            this.error = "Registration failed.";
          }
        } else {
          this.error = "Something went wrong.";
        }
      }
    });
  }
}