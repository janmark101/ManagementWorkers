import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/Services/auth.service';


interface User {
  token : string;
  user_id : number;
  firstname: string;
  lastname : string;
  verified : boolean;
}

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {

  constructor(private Auth : AuthService,private router: Router){};

  user : User = { token: '', user_id: 0 ,firstname: '',lastname:'',verified:false};
  error = "";


  onSubmit(form: NgForm){

    let data = {
      "username" : form.value.username,
      "password" : form.value.password
    };

    
    this.Auth.login(data).subscribe((data:any) => {
      this.user.token = data.token;
      this.user.user_id = data.user_id;
      this.user.firstname = data.firstname;
      this.user.lastname = data.lastname;
      this.user.verified = data.verified
            
      localStorage.setItem('user',JSON.stringify(this.user));
      
      this.router.navigate(['/home']);
      
    },(error:any) =>{
      console.error(error);
      this.error = 'Invalid credentials!';
      form.reset();
    });

  }
}
