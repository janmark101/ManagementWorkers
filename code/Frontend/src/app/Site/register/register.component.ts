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
  error = "";
  

  onSubmit(form: NgForm){
    if (!(form.value.firstname && form.value.lastname && form.value.email && form.value.username && form.value.password)){
      this.error = "Dont leave empty fields!";
      
    }
    else{
      if (form.value.username.length <5 ){
        this.error = "Username must have at least 6 chars!";
      }
      else if (form.value.password.length <5){
        this.error = "Password must have at least 6 chars!";
      }
      else {
        let data = {
          "username" : form.value.username,
          "first_name" : form.value.firstname,
          "last_name" : form.value.lastname,
          "email" : form.value.email,
          "password" : form.value.password,
        }
    
        
        this.Auth.register(data).subscribe((data:any) =>{
          this.error = 'Registered succesfully!';
          form.reset();
        },(error:any)=>{
          if(error.error){
            if(error.error.email){
              this.error = error.error.email;
            }
            else if (error.error.username){
              this.error = error.error.username;
            }
          }
          
        });
      }
    }

  }
}
