import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { SiteService } from 'src/app/Services/site.service';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { TeamComponent } from '../team/team.component';
@Component({
  selector: 'app-task',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.scss']
})
export class TaskComponent implements OnInit{
  @ViewChild(TeamComponent, { static: true }) teamComponent: TeamComponent | undefined;
  message : string = "";
  dropdownList:any = [];
  selectedItems:any = [];
  dropdownSettings:any = {};
  userSelected:any=[];
  constructor(
    private dialogRef: MatDialogRef<TaskComponent>,
    @Inject(MAT_DIALOG_DATA) private data: any,private Service : SiteService,private route:ActivatedRoute
  ) {}


    ngOnInit(): void {
      console.log(this.data);
      this.UsersForTask();
      console.log(this.dropdownList);
      
    }
    onItemSelect(item : any) {
      
      this.userSelected.push(item.item_id);
      console.log(this.userSelected);
    }

    onItemDeSelect(item:any){
      const indexToRemove = this.userSelected.findIndex((id:any) => id === item.item_id);

      if (indexToRemove!==-1){
        this.userSelected.splice(indexToRemove, 1);
      }
      console.log(this.userSelected);
    }

    onSelectAll(items: any) {
      console.log(items);
    }


    onSubmit(form:NgForm){
      
      let data = {
        "name" : form.value.name,
        "description" : form.value.description,
        "date": form.value.date,
        "team_id": this.data.team_id,
        "workers_id": this.userSelected
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

    UsersForTask(){
      this.dropdownList = [
        
      ];
      this.selectedItems = [
        { item_id: 3, item_text: 'Pune' },
        { item_id: 4, item_text: 'Navsari' }
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
}
