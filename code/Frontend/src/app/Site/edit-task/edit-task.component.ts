import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { switchMap, take } from 'rxjs';
import { SiteService } from 'src/app/Services/site.service';

@Component({
  selector: 'app-edit-task',
  templateUrl: './edit-task.component.html',
  styleUrls: ['./edit-task.component.scss']
})
export class EditTaskComponent implements OnInit{

  dropdownList:any = [];
  dropdownSettings:any = {};
  selectedItems:any=[];

  userSelected:any=[];

  TeamUsers:any=[];
  message : string = "";
  success : boolean = false;

  task : any;

  constructor(
    private Service : SiteService,
    private dialogRef: MatDialogRef<EditTaskComponent>,
    private route:ActivatedRoute,
    private cdRef: ChangeDetectorRef,
    @Inject(MAT_DIALOG_DATA) private data: any,private Site : SiteService
  ) {}

  ngOnInit(): void {
    this.Site.getUsersForTeam(this.data.teamID).pipe(
      take(1),
      switchMap((teamUsers: any) => {
        this.TeamUsers = teamUsers.data;

        
        return this.Site.getTask(this.data.taskID, this.data.teamID).pipe(take(1));
      })
    ).subscribe(
      (taskData: any) => {
        this.task = taskData;       
        this.UsersForTask();

      },
      (error: any) => {
        console.error(error);
      }
    );
    
  }



  OnSubmit(form:NgForm){
    let data = {
      "name" : form.value.name,
      "description" : form.value.description,
      "date": form.value.date,
      "workers_id": this.userSelected,
    }
    
    this.Service.editTask(this.task.id,this.data.teamID,data).subscribe((data:any) =>{
      this.message = data.message;
      
    },(error:any)=>{
      this.message = "Something went wrong!";
    });

    
  }

  onItemSelect(item : any) {   
      this.userSelected.push(item.item_id)

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

    for (const user of this.TeamUsers) {
      this.dropdownList.push({
        item_id: user.id,
        item_text: `${user.first_name} ${user.last_name}`
      });
    }
    this.selectedItems = [
       
    ];

    this.userSelected=this.task.workers_id;

    for ( const user of this.dropdownList){
        if(this.task.workers_id.includes(user.item_id)){
          this.selectedItems.push(user)
        }
    }


    this.dropdownSettings = {
      singleSelection: false,
      idField: 'item_id',
      textField: 'item_text',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 3,
      allowSearchFilter: true
    };

  }

  onCancel(){
    this.dialogRef.close();
  }

  onClose(){
    this.dialogRef.close('confirm');
  }
}
