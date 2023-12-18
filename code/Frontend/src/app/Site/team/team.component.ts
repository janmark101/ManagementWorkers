import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Route } from '@angular/router';
import { take } from 'rxjs';
import { AuthService } from 'src/app/Services/auth.service';
import { SiteService } from 'src/app/Services/site.service';
import { MatDialog } from '@angular/material/dialog';
import { DayComponent } from '../day/day.component';

@Component({
  selector: 'app-team',
  templateUrl: './team.component.html',
  styleUrls: ['./team.component.scss']
})
export class TeamComponent implements OnInit{
  now = new Date();
  currentMonthDays : any;
  currentMonth : any;
  currentYear : any;
  currentDay : any;
  constructor(private Site:SiteService,private route:ActivatedRoute,private dialog: MatDialog){};
  TeamTasks : any = [];
  currentMonthTasks: any=[];
  ngOnInit(): void {
    
    this.Site.getTaskForTeam(this.route.snapshot.params['id']).pipe(take(1)).subscribe((data:any) =>{
      this.TeamTasks = data;
      this.TaskCounter();
      console.log(this.currentMonthTasks);
      console.log(this.TaskCounterMap);
      
    },(error:any) =>{
      console.error(error);
      
    })
    this.currentMonthDays=this.monthDaysMap.get(this.now.getMonth()); 
    this.currentYear=this.now.getFullYear();
    this.currentMonth=this.monthDaysMap2.get(this.now.getMonth());
    this.currentDay=this.now.getDate();
    console.log(this.currentDay); 
  }
  list30 = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,
  26,27,28,29,30];
  list31 = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,
  26,27,28,29,30,31];
  list28 = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,
  26,27,28];
  
  monthDaysMap: Map<number, number[]> = new Map([
    [0, this.list31],
    [1, this.list28], // Assuming a non-leap year for simplicity
    [2, this.list31],
    [3, this.list30],
    [4, this.list31],
    [5, this.list30],
    [6, this.list31],
    [7, this.list31],
    [8, this.list30],
    [9, this.list31],
    [10, this.list30],
    [11, this.list31],
  ]);
  monthDaysMap2: Map<number, string> = new Map([
    [0, "January"],
    [1, "February"], // Assuming a non-leap year for simplicity
    [2, "March"],
    [3, "April"],
    [4, "May"],
    [5, "June"],
    [6, "July"],
    [7, "August"],
    [8, "September"],
    [9, "October"],
    [10, "November"],
    [11, "December"],
  ]);
  
  TaskCounterMap: Map<number, number> = new Map([
    [1, 0], // Assuming a non-leap year for simplicity
    [2, 0],
    [3, 0],
    [4, 0],
    [5, 0],
    [6, 0], // Changed from "July"
    [7, 0], // Changed from "August"
    [8, 0], // Changed from "September"
    [9, 0], // Changed from "October"
    [10, 0], // Changed from "November"
    [11, 0], // Changed from "December"
    [12, 0], // Changed from "January"
    [13, 0], // Changed from "February"
    [14, 0], // Changed from "March"
    [15, 0], // Changed from "April"
    [16, 0], // Changed from "May"
    [17, 0], // Changed from "June"
    [18, 0], // Changed from "July"
    [19, 0], // Changed from "August"
    [20, 0], // Changed from "September"
    [21, 0], // Changed from "October"
    [22, 0], // Changed from "November"
    [23, 0], // Changed from "December"
    [24, 0], // Changed from "January"
    [25, 0], // Changed from "February"
    [26, 0], // Changed from "March"
    [27, 0], // Changed from "April"
    [28, 0], // Changed from "May"
    [29, 0], // Changed from "June"
    [30, 0], // Changed from "July"
    [31, 0], // Changed from "August"
  ]);
  
  TaskCounter() {
    this.currentMonthTasks = this.TeamTasks.filter((item:any) => {
      const itemDate = new Date(item.date);
      const dayOfMonth = itemDate.getDate();
      if (itemDate.getMonth() + 1 === 12){
        this.TaskCounterMap.set(dayOfMonth, this.TaskCounterMap.get(dayOfMonth)! + 1);
      }
      return itemDate.getMonth() + 1 === 12; // Dodaj 1, ponieważ getMonth() zwraca wartość od 0 do 11
    });
  }

  DisplayDay(day:number){
    const dialogRef = this.dialog.open(DayComponent, {
      width: '700px',
      data: {currentMonthTasks: this.currentMonthTasks,
      day: day}
    });

    dialogRef.afterClosed().subscribe((result:any) => {
      if (result === 'confirm') {
              //reload() po dodoaniu teamu
        console.log('Potwierdzono');
      } else if (result === 'cancel') {
        console.log("nie potwierdzono");
        
      }
    });
  }


}
