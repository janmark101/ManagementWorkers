import { Component,Inject, OnInit} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { SiteService } from 'src/app/Services/site.service';
import { faGear } from '@fortawesome/free-solid-svg-icons';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import {
  ConfirmBoxInitializer,
  DialogLayoutDisplay,
  DisappearanceAnimation,
  AppearanceAnimation,
  ConfirmBoxEvokeService,
  
} from '@costlydeveloper/ngx-awesome-popup';
import { EditTaskComponent } from '../edit-task/edit-task.component';
import { take } from 'rxjs';

@Component({
  selector: 'app-day',
  templateUrl: './day.component.html',
  styleUrls: ['./day.component.scss']
})
export class DayComponent implements OnInit {
  editicon=faGear;
  trashicon=faTrash;

  message : string = "";
  currentMonthTasks: any;
  day: any;
  tasks: any;
  taskId:any;
  month : any;
  teamId : any;
  isManager : boolean | any;


  statuses = ['Not started', 'In progress', 'Finished'];
  selectedStatus :String | any;

  constructor(
    private dialogRef: MatDialogRef<DayComponent>,
    private dialog: MatDialog,
    private confirmBoxEvokeService: ConfirmBoxEvokeService,
    @Inject(MAT_DIALOG_DATA) private data: any,private Service : SiteService
  ) {}

  ngOnInit(): void {
    this.currentMonthTasks=this.data.currentMonthTasks;
    this.day=this.data.day;
    this.month = this.data.month;
    this.teamId = this.data.teamID;
    this.isManager = this.data.isManager;

    this.tasks = this.currentMonthTasks.filter((item:any) => {
      const itemDate = new Date(item.date);
        
      return itemDate.getDate() === this.day; 
    });

    this.sortListByName();
    


  }

  sortListByName() {
    this.tasks.sort((a:any, b:any) => {
      const nameA = a.name.toLowerCase();
      const nameB = b.name.toLowerCase();
      if (nameA < nameB) {
        return -1;
      }
      if (nameA > nameB) {
        return 1;
      }
      return 0;
    });
  }
    
    openConfirmBox() {
      const newConfirmBox = new ConfirmBoxInitializer();

      newConfirmBox.setTitle('Confirm delete');
      newConfirmBox.setMessage('');


      newConfirmBox.setConfig({
      layoutType: DialogLayoutDisplay.DANGER, 
      animationIn: AppearanceAnimation.BOUNCE_IN, 
      animationOut: DisappearanceAnimation.FLIP_OUT, 
      });
      newConfirmBox.setButtonLabels('Delete', 'Cancel');

      
      newConfirmBox.openConfirmBox$()
    
    }
      Delete( index:number){
        this.confirmBoxEvokeService.danger('Confirm delete!', 'Are you sure you want to delete it?', 'Confirm', 'Decline')
        .subscribe(resp => {
    
          if(resp.success === true){
              this.Service.deleteTask(index,this.teamId).subscribe((data:any) =>{
                location.reload();
              },(error:any)=>{
                this.message = "Something went wrong!";
              });
          }
        });
      }

  
    onCancel(){
      this.dialogRef.close('confirm');
    }

    EditTaskPopup(taskID:number){
      const dialogRef = this.dialog.open(EditTaskComponent, {
        width: '700px',
        data: {
          taskID: taskID,
          teamID: this.data.teamID,
        }
      });
  
      dialogRef.afterClosed().subscribe((result:any) => {
        if (result === 'confirm') {
          location.reload();
        } else if (result === 'cancel') {

          
        }
      });
    }

    update(e:any,taskId:number){ 
      let status : string = e.target.value;
      let data = {'status' : status};
      this.Service.changeTaskStatus(this.data.teamID,data,taskId).subscribe((data:any) => {
        let task = this.tasks.find((task:any) => task.id === taskId);
        task.status = status;
        
      },(error:any)=>{
        console.error(error);
    
      });
    } 


  
  
}
