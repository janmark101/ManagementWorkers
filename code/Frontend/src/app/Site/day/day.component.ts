import { Component,Inject, OnInit} from '@angular/core';
import { NgForm } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { SiteService } from 'src/app/Services/site.service';

@Component({
  selector: 'app-day',
  templateUrl: './day.component.html',
  styleUrls: ['./day.component.scss']
})
export class DayComponent implements OnInit {
  message : string = "";
  currentMonthTasks: any;
  day: any;
  tasks: any;
  constructor(
    private dialogRef: MatDialogRef<DayComponent>,
    @Inject(MAT_DIALOG_DATA) private data: any,private Service : SiteService
  ) {}
  ngOnInit(): void {
    this.currentMonthTasks=this.data.currentMonthTasks;
    this.day=this.data.day;
    //console.log(this.currentMonthTasks);
    this.tasks = this.currentMonthTasks.filter((item:any) => {
      const itemDate = new Date(item.date);
      const dayOfMonth = itemDate.getDate();
      
      return itemDate.getDate() === this.day; // Dodaj 1, ponieważ getMonth() zwraca wartość od 0 do 11
    });
    console.log(this.tasks)
  }

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

      //reload() po dodoaniu teamu

    }

    onCancel(){
      this.dialogRef.close();
    }
}
