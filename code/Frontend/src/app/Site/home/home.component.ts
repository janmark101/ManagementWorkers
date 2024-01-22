import { Component, OnInit } from '@angular/core';
import { SiteService } from 'src/app/Services/site.service';
import { delay, take } from 'rxjs';
import { AuthService } from 'src/app/Services/auth.service';
import { Router } from '@angular/router';
import { faPeopleGroup,faSquarePlus } from '@fortawesome/free-solid-svg-icons';
import { MatDialog } from '@angular/material/dialog';
import { CreateComponent } from '../create/create.component';
import { JoinTeamComponent } from '../join-team/join-team.component';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit{

  constructor(private Site: SiteService,private Auth:AuthService,private router: Router,private dialog: MatDialog){};

  plus = faPeopleGroup;
  join = faSquarePlus

  userTeams : any = [];
  user:any;


  ngOnInit(): void {

    this.user = this.Auth.getUserFromLocalStorage();

    this.Site.getUserTeams().pipe(take(1)).subscribe((data:any) =>{
      this.userTeams = data;
      
    },(error:any) =>{
      
    })
  }


  checkRole(id:number){       
    if(this.userTeams[id].manager == this.user.user_id)
    {
      return "Manager";
    }
    return "Worker";
  }
  

  Logout(){
    this.Auth.logout().subscribe((data:any) =>{
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
        location.reload();
      } else if (result === 'cancel') {
        
      }
    });

      
  }

  JoinTeam(){
    const dialogRef = this.dialog.open(JoinTeamComponent, {
      width: '700px',
      
    });

    dialogRef.afterClosed().subscribe((result:any) => {
      if (result === 'confirm') {
        location.reload();
      } else if (result === 'cancel') {
        
      }
    });
  }



}
