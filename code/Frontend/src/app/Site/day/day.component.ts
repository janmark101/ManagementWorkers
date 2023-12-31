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
    //console.log(this.currentMonthTasks);
    this.tasks = this.currentMonthTasks.filter((item:any) => {
      const itemDate = new Date(item.date);
        
      return itemDate.getDate() === this.day; // Dodaj 1, ponieważ getMonth() zwraca wartość od 0 do 11
    });

  }

    
    openConfirmBox() {
      const newConfirmBox = new ConfirmBoxInitializer();

      newConfirmBox.setTitle('Confirm delete');
      newConfirmBox.setMessage('');

      // Choose layout color type
      newConfirmBox.setConfig({
      layoutType: DialogLayoutDisplay.DANGER, // SUCCESS | INFO | NONE | DANGER | WARNING
      animationIn: AppearanceAnimation.BOUNCE_IN, // BOUNCE_IN | SWING | ZOOM_IN | ZOOM_IN_ROTATE | ELASTIC | JELLO | FADE_IN | SLIDE_IN_UP | SLIDE_IN_DOWN | SLIDE_IN_LEFT | SLIDE_IN_RIGHT | NONE
      animationOut: DisappearanceAnimation.FLIP_OUT, // BOUNCE_OUT | ZOOM_OUT | ZOOM_OUT_WIND | ZOOM_OUT_ROTATE | FLIP_OUT | SLIDE_OUT_UP | SLIDE_OUT_DOWN | SLIDE_OUT_LEFT | SLIDE_OUT_RIGHT | NONE
      });
      newConfirmBox.setButtonLabels('Delete', 'Cancel');
      // Simply open the popup
      
      newConfirmBox.openConfirmBox$()
    
    }
      Delete(text:string, index:number){
        this.confirmBoxEvokeService.danger('Confirm delete!', 'Are you sure you want to delete it?', 'Confirm', 'Decline')
        .subscribe(resp => {
    
          if(resp.success === true){
          switch(text){
            case "expense" : {
              console.log(this.tasks);
              this.Service.deleteTask(index).subscribe((data:any) =>{
                location.reload();
              },(error:any)=>{
                this.message = "Something went wrong!";
              });
              break;
            }
          }
        }
        });
      }

  
    onCancel(){
      this.dialogRef.close();
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
          console.log('Potwierdzono');
        } else if (result === 'cancel') {
          console.log("nie potwierdzono");
          
        }
      });
    }
}
