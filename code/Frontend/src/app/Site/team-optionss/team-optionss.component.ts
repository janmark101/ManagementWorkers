import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { take } from 'rxjs';
import { SiteService } from 'src/app/Services/site.service';
import {
  ConfirmBoxEvokeService,
  
} from '@costlydeveloper/ngx-awesome-popup';


@Component({
  selector: 'app-team-optionss',
  templateUrl: './team-optionss.component.html',
  styleUrls: ['./team-optionss.component.scss']
})
export class TeamOptionssComponent implements OnInit{

  teamId : number | any;

  constructor(private route:ActivatedRoute,private Site:SiteService,private router: Router,private confirmBoxEvokeService: ConfirmBoxEvokeService){}

  ngOnInit(): void {
    this.teamId = this.route.snapshot.params['id'];
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
    this.Site.removeUserFromTeam(this.teamId,userId).pipe(take(1)).subscribe((data:any) =>{
      console.log(data);
      
    },(error:any) =>{
      console.error(error);
      
    });
  }

}
