import { Component, OnInit } from '@angular/core';
import {  Router } from '@angular/router';
import { delay } from 'rxjs';
import { AuthService } from 'src/app/Services/auth.service';
import { CreateComponent } from '../create/create.component';
import { MatDialog } from '@angular/material/dialog';
import { JoinTeamComponent } from '../join-team/join-team.component';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

  constructor(private Auth:AuthService,private router : Router,private dialog: MatDialog){}

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

  CreateTeam(){
    const dialogRef = this.dialog.open(CreateComponent, {
      width: '700px',
      
    });

    dialogRef.afterClosed().subscribe((result:any) => {
      if (result === 'confirm') {
              //reload() po dodoaniu teamu
        console.log('Potwierdzono');
      } else if (result === 'cancel') {
        console.log("nie potwierdzono");
        
      }
    });

          //reload() po dodaniu teamu
  }

  JoinTeam(){
    const dialogRef = this.dialog.open(JoinTeamComponent, {
      width: '700px',
      
    });

    dialogRef.afterClosed().subscribe((result:any) => {
      if (result === 'confirm') {
        console.log('Potwierdzono');
      } else if (result === 'cancel') {
        console.log("nie potwierdzono");
        
      }
    });
  }

}
