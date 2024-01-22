import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { take } from 'rxjs';
import { SiteService } from 'src/app/Services/site.service';
import {
  ConfirmBoxEvokeService,
  
} from '@costlydeveloper/ngx-awesome-popup';
import { UniqueCodeComponent } from '../unique-code/unique-code.component';
import { MatDialog } from '@angular/material/dialog';
import { faBarcode } from '@fortawesome/free-solid-svg-icons';
import { faQrcode } from '@fortawesome/free-solid-svg-icons';
import { faTrashCan } from '@fortawesome/free-solid-svg-icons';
import { faAngleLeft } from '@fortawesome/free-solid-svg-icons';
import { faUserXmark } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-team-optionss',
  templateUrl: './team-optionss.component.html',
  styleUrls: ['./team-optionss.component.scss']
})
export class TeamOptionssComponent implements OnInit{

  //codeIcon = faBarcode 
  deleteUser = faUserXmark
  codeIcon = faQrcode
  backIcon = faAngleLeft
  deleteIcon = faTrashCan
  teamId : number | any;
  isManager : boolean = false;
  TeamUsers : any = [];

  teamName : String = ''

  constructor(private route:ActivatedRoute,private Site:SiteService,private router: Router,private confirmBoxEvokeService: ConfirmBoxEvokeService,private dialog: MatDialog){}

  ngOnInit(): void {
    this.teamId = this.route.snapshot.params['id'];
    
    this.Site.getUsersForTeam(this.teamId).pipe(take(1)).subscribe((data:any) =>{
      this.isManager = data.manager;
      this.TeamUsers = data.data;
    },(error:any) =>{
      console.log(error);
    });

    this.Site.getTeamName(this.teamId).pipe(take(1)).subscribe((data:any)=>{
      this.teamName = data.name
    },(error:any)=>{
      console.error(error);
      
    })
  }


  deleteTeam(){
    this.confirmBoxEvokeService.danger('Confirm delete!', 'Are you sure you want to delete it?', 'Confirm', 'Decline')
    .subscribe(resp => {
  
      if(resp.success === true){
          this.Site.deleteTeam(this.teamId).pipe(take(1)).subscribe((data:any) =>{
            this.router.navigate(['/home'])
          },(error:any) =>{
            
          });
    }
    });
  }

  removeUser(userId:number){
    this.confirmBoxEvokeService.danger('Confirm delete!', 'Are you sure you want to delete this user?', 'Confirm', 'Decline')
    .subscribe(resp => {
  
      if(resp.success === true){
      
        this.Site.removeUserFromTeam(this.teamId,userId).pipe(take(1)).subscribe((data:any) =>{
          location.reload();
          
        },(error:any) =>{
          console.error(error);
          
        });
    }
    });
    
  }

  showUniqueCode(){
    this.Site.UniqueCode(this.teamId).pipe(take(1)).subscribe((data:any) =>{
      const dialogRef = this.dialog.open(UniqueCodeComponent, {
        width: '400px',
        data:{
          code:data.code,
        teamId:this.teamId}
      });
    },(error:any) =>{
      console.log(error);
      
    });
  }

}
