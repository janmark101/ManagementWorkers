import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/Services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {

  user = { 
    token: '', 
    user_id: 0, 
    firstname: '', 
    lastname: '', 
    verified: false 
  };
  
  error = "";

  constructor(private Auth: AuthService, private router: Router) {}

  onSubmit(form: NgForm) {
    if (form.invalid) return;

    const data = {
      "username": form.value.username,
      "password": form.value.password
    };

    this.Auth.login(data).subscribe({
      next: (response: any) => {
        this.user = {
          token: response.token,
          user_id: response.user_id,
          firstname: response.firstname,
          lastname: response.lastname,
          verified: response.verified
        };

        localStorage.setItem('user', JSON.stringify(this.user));
        this.router.navigate(['/home'], { replaceUrl: true });
      },
      error: (err: any) => {
        console.error(err);
        this.error = 'Invalid credentials!';
        form.controls['password'].reset();
      }
    });
  }
}