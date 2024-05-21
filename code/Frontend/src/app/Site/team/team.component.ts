import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { take } from 'rxjs';
import { SiteService } from 'src/app/Services/site.service';
import { MatDialog } from '@angular/material/dialog';
import { DayComponent } from '../day/day.component';
import { TaskComponent } from '../task/task.component';
import { faGears, faSquarePlus, faCircleInfo, faAngleLeft, faAngleRight, faBookmark, faComments } from '@fortawesome/free-solid-svg-icons';
import {
  ConfirmBoxInitializer,
  DialogLayoutDisplay,
  DisappearanceAnimation,
  AppearanceAnimation,
  ConfirmBoxEvokeService,
} from '@costlydeveloper/ngx-awesome-popup';
import { ChatComponent } from '../chat/chat.component';

@Component({
  selector: 'app-team',
  templateUrl: './team.component.html',
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['./team.component.scss']
})
export class TeamComponent implements OnInit {
  now = new Date();
  dateInformation: any = {'currentMonthDays': 0, 'currentMonth': '', 'currentYear': 0, 'currentDay': 0};

  backIcon = faAngleLeft;
  nextIcon = faAngleRight;
  chatIcon = faComments;

  teamName: String = '';
  info = faCircleInfo;
  tasks = faBookmark;
  plus = faSquarePlus;
  gearIcon = faGears;

  TeamTasks: any = [];
  TeamUsers: any = [];
  currentMonthTasks: any = [];
  isManager: boolean = false;
  Tasks: any = [];
  teamId: number | any;
  monthValuesArray: any;
  currentMonthNumber: any;

  month: any;
  year: any;

  constructor(private Site: SiteService, private route: ActivatedRoute,
              private dialog: MatDialog,
              private router: Router,
              private confirmBoxEvokeService: ConfirmBoxEvokeService) { }

  ngOnInit(): void {
    this.teamId = this.route.snapshot.params['id'];

    this.month = this.now.getMonth();
    this.year = this.now.getFullYear();

    this.Site.getTeamName(this.teamId).pipe(take(1)).subscribe((data: any) => {
      this.teamName = data.name;
    }, (error: any) => {
      console.error(error);
    });

    this.Site.getUsersForTeam(this.teamId).pipe(take(1)).subscribe((data: any) => {
      this.isManager = data.manager;
      this.TeamUsers = data.data;
    }, (error: any) => {
      console.log(error);
    });

    this.dateInformation.currentMonthDays = this.monthDaysMap.get(this.month);
    this.dateInformation.currentYear = this.year;
    this.dateInformation.currentMonth = this.monthDaysMap2.get(this.month);
    this.dateInformation.currentDay = this.now.getDate();
    this.monthValuesArray = Array.from(this.monthDaysMap2.values());

    this.currentMonthNumber = this.monthValuesArray.indexOf(this.dateInformation.currentMonth) + 1;

    this.Site.getTaskForTeam(this.teamId).pipe(take(1)).subscribe((data: any) => {
      this.TeamTasks = data;
      this.Tasks = data;
      this.TaskCounter();
    }, (error: any) => {
    });
  }

  list30 = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25,
    26, 27, 28, 29, 30];
  list31 = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25,
    26, 27, 28, 29, 30, 31];
  list28 = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25,
    26, 27, 28];

  monthDaysMap: Map<number, number[]> = new Map([
    [0, this.list31],
    [1, this.list28],
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
    [0, 'January'],
    [1, 'February'],
    [2, 'March'],
    [3, 'April'],
    [4, 'May'],
    [5, 'June'],
    [6, 'July'],
    [7, 'August'],
    [8, 'September'],
    [9, 'October'],
    [10, 'November'],
    [11, 'December'],
  ]);

  TaskCounterMap: Map<number, number> = new Map([
    [1, 0],
    [2, 0],
    [3, 0],
    [4, 0],
    [5, 0],
    [6, 0],
    [7, 0],
    [8, 0],
    [9, 0],
    [10, 0],
    [11, 0],
    [12, 0],
    [13, 0],
    [14, 0],
    [15, 0],
    [16, 0],
    [17, 0],
    [18, 0],
    [19, 0],
    [20, 0],
    [21, 0],
    [22, 0],
    [23, 0],
    [24, 0],
    [25, 0],
    [26, 0],
    [27, 0],
    [28, 0],
    [29, 0],
    [30, 0],
    [31, 0],
  ]);

  TaskCounter() {
    this.currentMonthTasks = this.TeamTasks.filter((item: any) => {
      const itemDate = new Date(item.date);
      const dayOfMonth = itemDate.getDate();

      if ((itemDate.getMonth() + 1 === this.currentMonthNumber) && (itemDate.getFullYear() == this.dateInformation.currentYear)) {
        this.TaskCounterMap.set(dayOfMonth, this.TaskCounterMap.get(dayOfMonth)! + 1);
      }
      return itemDate.getMonth() + 1 === this.currentMonthNumber;
    });
  }

  DisplayDay(day: number) {
    const dialogRef = this.dialog.open(DayComponent, {
      width: '1200px',
      data: {
        currentMonthTasks: this.currentMonthTasks,
        day: day,
        month: this.dateInformation.currentMonth,
        teamID: this.teamId,
        isManager: this.isManager,
      }
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result === 'confirm') {

      } else if (result === 'cancel') {

      }
    });
  }

  OpenChat() {
    const dialogRef = this.dialog.open(ChatComponent, {
      width: '23%',
      height: '600px',
      data: {
        team_id: this.teamId,
        userList: this.TeamUsers
      },
      position: {
        bottom: '7%',
        right: '200px'
      }
    });

  }

  AddTaskPopup() {
    const dialogRef = this.dialog.open(TaskComponent, {
      width: '1000px',
      height: '1000px',
      data: {
        team_id: this.teamId,
        userList: this.TeamUsers
      }
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result === 'confirm') {
        location.reload();
      } else if (result === 'cancel') {

      }
    });
  }

  checkSelectedUser(index: number) {
    this.TeamUsers.forEach((user: any, i: number) => {
      if (i !== index) {
        user.isChecked = false;
      }
    });
    const selectedUser = this.TeamUsers.find((user: any) => user.isChecked);
    this.resetMap();
    if (selectedUser) {
      this.TeamTasks = this.Tasks.filter((task: any) => task.workers_id.includes(selectedUser.id));
    } else {
      this.TeamTasks = this.Tasks;
    }
    this.TaskCounter();
  }

  resetMap() {
    this.TaskCounterMap = new Map([
      [1, 0],
      [2, 0],
      [3, 0],
      [4, 0],
      [5, 0],
      [6, 0],
      [7, 0],
      [8, 0],
      [9, 0],
      [10, 0],
      [11, 0],
      [12, 0],
      [13, 0],
      [14, 0],
      [15, 0],
      [16, 0],
      [17, 0],
      [18, 0],
      [19, 0],
      [20, 0],
      [21, 0],
      [22, 0],
      [23, 0],
      [24, 0],
      [25, 0],
      [26, 0],
      [27, 0],
      [28, 0],
      [29, 0],
      [30, 0],
      [31, 0],
    ]);
  }

  openConfirmBox() {
    const newConfirmBox = new ConfirmBoxInitializer();

    newConfirmBox.setTitle('Confirm leave team');
    newConfirmBox.setMessage('');

    newConfirmBox.setConfig({
      layoutType: DialogLayoutDisplay.DANGER,
      animationIn: AppearanceAnimation.BOUNCE_IN,
      animationOut: DisappearanceAnimation.FLIP_OUT,
    });
    newConfirmBox.setButtonLabels('Leave', 'Cancel');

    newConfirmBox.openConfirmBox$();
  }

  leaveTeam() {
    this.confirmBoxEvokeService.danger('Confirm delete!', 'Are you sure you want to leave team?', 'Confirm', 'Decline')
      .subscribe(resp => {
        if (resp.success === true) {
          this.Site.leaveTeam(this.teamId).subscribe((data: any) => {
            this.router.navigate(['/home']);
          }, (error: any) => {
            console.error(error);
          });
        }
      });
  }

  nextMonth() {
    if (this.month == 11) {
      this.month = 0;
      this.year += 1;
    } else {
      this.month = this.month + 1;
    }

    this.dateInformation.currentMonthDays = this.monthDaysMap.get(this.month);
    this.dateInformation.currentMonth = this.monthDaysMap2.get(this.month);
    this.dateInformation.currentYear = this.year;
    this.currentMonthNumber = this.monthValuesArray.indexOf(this.dateInformation.currentMonth) + 1;

    if (this.month == this.now.getMonth()) {
      this.dateInformation.currentDay = this.now.getDate();
    } else {
      this.dateInformation.currentDay = null;
    }

    this.resetMap();
    this.TaskCounter();
  }

  prevMonth() {
    if (this.month == 0) {
      this.month = 11;
      this.year -= 1;
    } else {
      this.month = this.month - 1;
    }

    this.dateInformation.currentMonthDays = this.monthDaysMap.get(this.month);
    this.dateInformation.currentMonth = this.monthDaysMap2.get(this.month);
    this.dateInformation.currentYear = this.year;
    this.currentMonthNumber = this.monthValuesArray.indexOf(this.dateInformation.currentMonth) + 1;

    if (this.month == this.now.getMonth()) {
      this.dateInformation.currentDay = this.now.getDate();
    } else {
      this.dateInformation.currentDay = null;
    }

    this.resetMap();
    this.TaskCounter();
  }
}
