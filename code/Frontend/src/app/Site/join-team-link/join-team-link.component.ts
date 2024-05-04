import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SiteService } from 'src/app/Services/site.service';

@Component({
  selector: 'app-join-team-link',
  templateUrl: './join-team-link.component.html',
  styleUrls: ['./join-team-link.component.scss']
})
export class JoinTeamLinkComponent {
  message : String = ''

  constructor(private route:ActivatedRoute,
    private router: Router,private Service : SiteService){}

  ngOnInit(){
    const code =  this.route.snapshot.params['code'];
    if (code){
      this.Service.joinTeam(code).subscribe((data:any) =>{
        this.router.navigate(['/home']);
       
      },(error:any)=>{
        console.error(error);
        
        if (error.error.message){
          this.message = error.error.message;
        }
        else{
          this.message = 'Wrong code. Try again!'
        }
      });
    }
  }
}
