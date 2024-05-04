import { Component,Inject, OnInit } from '@angular/core';
import { SiteService } from 'src/app/Services/site.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-join-team',
  templateUrl: './join-team.component.html',
  styleUrls: ['./join-team.component.scss']
})

export class JoinTeamComponent  {
  message : string = "";
  success : boolean = false;

  constructor(
    private dialogRef: MatDialogRef<JoinTeamComponent>,
    @Inject(MAT_DIALOG_DATA) private data:any, private Service : SiteService,
    
  ) {}

  

    onSubmit(form:NgForm){   
      this.Service.joinTeam(form.value.unique_code).subscribe((data:any) =>{
        this.message = data.message;
        this.success = true;
      },(error:any)=>{
        console.error(error);
        this.success = false;
        if (error.error.message){
          this.message = error.error.message;
        }
        else{
          this.message = 'Wrong code. Try again!'
        }
      });

    }

    onCancel(){
      this.dialogRef.close();
    }

    onClose(){
      this.dialogRef.close('confirm');
    }
}
