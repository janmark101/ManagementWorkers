import { Component, Inject, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { take } from 'rxjs';
import { SiteService } from 'src/app/Services/site.service';

@Component({
  selector: 'app-edit-task',
  templateUrl: './edit-task.component.html',
  styleUrls: ['./edit-task.component.scss']
})
export class EditTaskComponent implements OnInit{

  dropdownList:any = [];
  selectedItems:any = [];
  dropdownSettings:any = {};
  userSelected:any=[];
  TeamUsers:any=[];
  message : string = "";
  success : boolean = false;
  isManager : boolean = false;
  task : any;
  constructor(
    private dialogRef: MatDialogRef<EditTaskComponent>,
    private route:ActivatedRoute,
    @Inject(MAT_DIALOG_DATA) private data: any,private Site : SiteService
  ) {}
  
  ngOnInit(): void {
    this.Site.getUsersForTeam(this.data.teamID).pipe(take(1)).subscribe((data:any) =>{
      this.isManager = true;
      this.TeamUsers = data;
      
      
      //console.log(data)
    },(error:any) =>{
      this.isManager = false;
    });


    this.Site.getTask(this.data.taskID).pipe(take(1)).subscribe((data:any) =>{
      this.task = data;
      this.UsersForTask();
      
      
      console.log(data.workers_id);
    },(error:any) =>{
      
    });
    
  }

  OnSubmit(form:NgForm){
    let data = {
      "name" : form.value.name,
      "description" : form.value.description,
      "date": form.value.date,
      "team_id": this.data.team_id,
      "workers_id": this.userSelected,
      "task_id": this.data.taskID
    }
    
    
  }

  onItemSelect(item : any) {
      
    this.userSelected.push(item.item_id);
    console.log(this.userSelected, "ONSELECT")
    console.log(this.selectedItems);
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

  UsersForTask(){
    this.dropdownList = [
      
    ];
    
    this.userSelected = [
     
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

    for (const user of this.TeamUsers) {
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
