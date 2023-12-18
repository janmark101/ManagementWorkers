import { Component,Inject, OnInit} from '@angular/core';
import { NgForm } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
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
  constructor(
    private dialogRef: MatDialogRef<DayComponent>,
    private confirmBoxEvokeService: ConfirmBoxEvokeService,
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
      // newConfirmBox.openConfirmBox$().subscribe((result: any) => {
      //   if (result.button === 'Delete') {
      //     // Użytkownik kliknął "Delete"
      //     console.log('User clicked Delete');
      //     // Tutaj możesz umieścić kod obsługujący kliknięcie "Delete"
      //   } else if (result.button === 'Cancel') {
      //     // Użytkownik kliknął "Cancel"
      //     console.log('User clicked Cancel');
      //     // Tutaj możesz umieścić kod obsługujący kliknięcie "Cancel"
      //   }
      // });
    }
      Delete(text:string){
        this.confirmBoxEvokeService.danger('Confirm delete!', 'Are you sure you want to delete it?', 'Confirm', 'Decline')
        .subscribe(resp => {
    
          if(resp.success === true){
          switch(text){
            case "expense" : {
              console.log("DZIALA");
              break;
            }
          }
        }
        });
      }

  
    onCancel(){
      this.dialogRef.close();
    }

    deleteTask(){
      console.log('ddas');
    }
}
