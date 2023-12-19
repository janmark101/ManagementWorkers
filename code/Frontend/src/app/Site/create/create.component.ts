import { Component,Inject } from '@angular/core';
import { SiteService } from 'src/app/Services/site.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss']
})
export class CreateComponent {

  
  message : string = "";


  constructor(
    private dialogRef: MatDialogRef<CreateComponent>,
    @Inject(MAT_DIALOG_DATA) private data: any,private Service : SiteService
  ) {}

    onSubmit(form:NgForm){
      let data = {
        "name" : form.value.name,
        "description" : form.value.description,
      }
      
      console.log(data);
      this.Service.createTeam(data).subscribe((data:any) =>{
        console.log(data);
        this.message = `Team created successfully! Unique code : ${data.unique_code}`;

      },(error:any)=>{
        console.error(error);
        this.message = "Something went wrong!";
      });

    }

    onCancel(){
      this.dialogRef.close();
    }

}
