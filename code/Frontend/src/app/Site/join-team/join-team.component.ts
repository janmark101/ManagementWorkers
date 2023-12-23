import { Component,Inject } from '@angular/core';
import { SiteService } from 'src/app/Services/site.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-join-team',
  templateUrl: './join-team.component.html',
  styleUrls: ['./join-team.component.scss']
})

export class JoinTeamComponent {
  message : string = "";
  success : boolean = false;

  constructor(
    private dialogRef: MatDialogRef<JoinTeamComponent>,
    @Inject(MAT_DIALOG_DATA) private Service : SiteService
  ) {}

    onSubmit(form:NgForm){
      let data = {
        "unique_code" : form.value.unique_code,
      }
      

      this.Service.joinTeam(data).subscribe((data:any) =>{
        console.log(data);
        this.message = data.message;
        this.success = true;
      },(error:any)=>{
        this.success = false;
        this.message = "Something went wrong!";
      });

      //reload() po dodoaniu teamu

    }

    onCancel(){
      this.dialogRef.close();
    }

    onClose(){
      this.dialogRef.close('confirm');
    }
}
