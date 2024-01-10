import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { SiteService } from 'src/app/Services/site.service';


@Component({
  selector: 'app-task',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.scss']
})
export class TaskComponent implements OnInit{

  message : string = "";
  dropdownList:any = [];
  selectedItems:any = [];
  dropdownSettings:any = {};
  userSelected:any=[];
  success : boolean = false;

  constructor(
    private dialogRef: MatDialogRef<TaskComponent>,
    @Inject(MAT_DIALOG_DATA) private data: any,private Service : SiteService
  ) {}


    ngOnInit(): void {
      this.UsersForTask();

    }
    onItemSelect(item : any) {
      
      this.userSelected.push(item.item_id);
    }

    onItemDeSelect(item:any){
      const indexToRemove = this.userSelected.findIndex((id:any) => id === item.item_id);

      if (indexToRemove!==-1){
        this.userSelected.splice(indexToRemove, 1);
      }
    }

    onSelectAll(items: any) {

      for(let item of items){
        this.userSelected.push(item.item_id);
      }
      
    }

    onItemDeSelectAll(item:any){
      this.userSelected = [];
      
    }

    

    onSubmit(form:NgForm){
      
      let data = {
        "name" : form.value.name,
        "description" : form.value.description,
        "date": form.value.date,
        "workers_id": this.userSelected
      }
      
      this.Service.addTaskForTeam(this.data.team_id,data).subscribe((data:any) =>{
        this.success = true;
        this.message = `Task created`;
      },(error:any)=>{
        this.success = false;
        this.message = "Something went wrong!";
      });

      


    }

    UsersForTask(){
      this.dropdownList = [
        
      ];
      this.selectedItems = [

      ];
      this.dropdownSettings = {
        singleSelection: false,
        idField: 'item_id',
        textField: 'item_text',
        selectAllText: 'Select All',
        unSelectAllText: 'UnSelect All',
        itemsShowLimit: 3,
        allowSearchFilter: true
      };

      for (const user of this.data.userList) {
        this.dropdownList.push({
          item_id: user.id,
          item_text: `${user.first_name} ${user.last_name}`
        });
      }
    }
    
    onCancel(){
      this.dialogRef.close();
    }

    onClose(){
      this.dialogRef.close('confirm');
    }
}
