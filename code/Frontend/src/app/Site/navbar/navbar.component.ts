import { Component, OnInit } from '@angular/core';
import {  Router } from '@angular/router';
import { delay } from 'rxjs';
import { AuthService } from 'src/app/Services/auth.service';


@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

  constructor(private Auth:AuthService,private router : Router){}

  user :any;


  ngOnInit(): void {
    this.user=this.Auth.getUserFromLocalStorage();

  }

  Logout(){

    

    this.Auth.logout().subscribe((data:any) =>{
      console.log(data);
      localStorage.removeItem('user');
      delay(1500);
      this.router.navigate(['']).then(() => {
          location.reload();
      });
      
    },(error:any)=>{
      console.error(error);
      
    })
  }

  

}
