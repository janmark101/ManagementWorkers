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

  
  constructor(private Auth : AuthService,private router: Router){};

  

  onSubmit(form: NgForm){

    let data = {
      "username" : form.value.username,
      "first_name" : form.value.firstname,
      "last_name" : form.value.lastname,
      "email" : form.value.email,
      "password" : form.value.password,
    }

    
    this.Auth.register(data).subscribe((data:any) =>{
      this.router.navigate(['']);
       //dodac informacje ze zaloogowano pomyslnie i potem redirect 
    },(error:any)=>{
      console.error(error);
      
    });

  }
}
