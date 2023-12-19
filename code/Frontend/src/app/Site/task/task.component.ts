import { Component, Inject, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { SiteService } from 'src/app/Services/site.service';

@Component({
  selector: 'app-task',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.scss']
})
export class TaskComponent implements OnInit{

  message : string = "";

  constructor(
    private dialogRef: MatDialogRef<TaskComponent>,
    @Inject(MAT_DIALOG_DATA) private data: any,private Service : SiteService,private route:ActivatedRoute
  ) {}


    ngOnInit(): void {
      console.log(this.data);
    }


    onSubmit(form:NgForm){
      let data = {
        "name" : form.value.name,
        "description" : form.value.description,
        "date": form.value.date,
        "team_id": this.data.team_id
      }
      
      console.log(data);
      this.Service.addTaskForTeam(this.data.team_id,data).subscribe((data:any) =>{
        console.log(data);
        this.message = `Task created`;

      },(error:any)=>{
        console.error(error);
        this.message = "Something went wrong!";
      });

      //reload() po dodoaniu teamu

    }

    onCancel(){
      this.dialogRef.close();
    }
}
