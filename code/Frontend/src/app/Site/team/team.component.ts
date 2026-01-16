import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { take } from 'rxjs';
import { SiteService } from 'src/app/Services/site.service';
import { faBookmark } from '@fortawesome/free-solid-svg-icons';
import { 
  ModalController, 
  ActionSheetController, 
  AlertController,
  ToastController,
} from '@ionic/angular';

@Component({
  selector: 'app-team',
  templateUrl: './team.component.html',
  styleUrls: ['./team.component.scss'],
})
export class TeamComponent implements OnInit {
  now = new Date();
  tasks = faBookmark;

  teamName: String = '';
  isManager: boolean = false;

  TeamTasks: any = [];
  TeamUsers: any = [];
  currentMonthTasks: any = [];
  Tasks: any = [];
  teamId: number | any;
  
  dateInformation: any = {
    'currentMonthDays': [],
    'currentMonth': '', 
    'currentYear': 0, 
    'currentDay': 0
  };

  month: any;
  year: any;
  currentMonthNumber: any;
  monthValuesArray: any;

  list30 = Array.from({length: 30}, (_, i) => i + 1);
  list31 = Array.from({length: 31}, (_, i) => i + 1);
  list28 = Array.from({length: 28}, (_, i) => i + 1);

  monthDaysMap: Map<number, number[]> = new Map([
    [0, this.list31], [1, this.list28], [2, this.list31], [3, this.list30],
    [4, this.list31], [5, this.list30], [6, this.list31], [7, this.list31],
    [8, this.list30], [9, this.list31], [10, this.list30], [11, this.list31],
  ]);

  monthDaysMap2: Map<number, string> = new Map([
    [0, 'January'], [1, 'February'], [2, 'March'], [3, 'April'],
    [4, 'May'], [5, 'June'], [6, 'July'], [7, 'August'],
    [8, 'September'], [9, 'October'], [10, 'November'], [11, 'December'],
  ]);

  TaskCounterMap: Map<number, number> = new Map();

  constructor(
    private Site: SiteService,
    private route: ActivatedRoute,
    private router: Router,
    private modalCtrl: ModalController,
    private actionSheetCtrl: ActionSheetController,
    private alertCtrl: AlertController,
    private toastCtrl: ToastController
  ) { }

  ngOnInit(): void {
    this.teamId = this.route.snapshot.params['id'];
    this.month = this.now.getMonth();
    this.year = this.now.getFullYear();

    this.resetMap();

    this.Site.getTeamName(this.teamId).pipe(take(1)).subscribe((data: any) => {
      this.teamName = data.name;
    });

    this.Site.getUsersForTeam(this.teamId).pipe(take(1)).subscribe((data: any) => {
      this.isManager = data.manager;
      this.TeamUsers = data.data;
    });

    this.updateDateInfo();

    this.Site.getTaskForTeam(this.teamId).pipe(take(1)).subscribe((data: any) => {
      this.TeamTasks = data;
      this.Tasks = data;
      this.TaskCounter();
    });
  }

  updateDateInfo() {
    this.dateInformation.currentMonthDays = this.monthDaysMap.get(this.month);
    this.dateInformation.currentYear = this.year;
    this.dateInformation.currentMonth = this.monthDaysMap2.get(this.month);

    if(this.month === this.now.getMonth() && this.year === this.now.getFullYear()){
      this.dateInformation.currentDay = this.now.getDate();
    } else {
      this.dateInformation.currentDay = 0;
    }

    this.monthValuesArray = Array.from(this.monthDaysMap2.values());
    this.currentMonthNumber = this.monthValuesArray.indexOf(this.dateInformation.currentMonth) + 1;
  }

  nextMonth() {
    if (this.month == 11) {
      this.month = 0;
      this.year += 1;
    } else {
      this.month = this.month + 1;
    }
    this.handleMonthChange();
  }

  prevMonth() {
    if (this.month == 0) {
      this.month = 11;
      this.year -= 1;
    } else {
      this.month = this.month - 1;
    }
    this.handleMonthChange();
  }

  handleMonthChange() {
    this.updateDateInfo();
    this.resetMap();
    this.TaskCounter();
  }

  TaskCounter() {
    this.currentMonthTasks = this.TeamTasks.filter((item: any) => {
      const itemDate = new Date(item.date);
      const dayOfMonth = itemDate.getDate();

      if ((itemDate.getMonth() + 1 === this.currentMonthNumber) && (itemDate.getFullYear() == this.dateInformation.currentYear)) {
        const currentCount = this.TaskCounterMap.get(dayOfMonth) || 0;
        this.TaskCounterMap.set(dayOfMonth, currentCount + 1);
      }
      return itemDate.getMonth() + 1 === this.currentMonthNumber;
    });
  }

  getTaskColor(count: any): string {
    if (count === 1) return 'rgb(31, 89, 47)';
    if (count === 2) return 'rgb(145, 86, 38)';
    return 'rgb(117, 33, 32)';
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
    this.TaskCounterMap = new Map();
    for(let i=1; i<=31; i++) {
      this.TaskCounterMap.set(i, 0);
    }
  }

  DisplayDay(day: number) {
  this.router.navigate([
    '/team', 
    this.teamId, 
    'day', 
    day, 
    this.dateInformation.currentMonth,
    this.dateInformation.currentYear
  ]);
}

  AddTaskPopup() {
    console.log("add task view")
    this.router.navigate(['/team', this.teamId, 'add-task']);
  }

  async presentActionSheet() {
    const buttons = [];

    if (this.isManager) {
      buttons.push({
        text: 'Settings',
        icon: 'settings',
        handler: () => {
          this.router.navigate(['/team', this.teamId, 'options']);
        }
      });
    } else {
      buttons.push({
        text: 'Leave Team',
        icon: 'log-out',
        role: 'destructive',
        handler: () => {
          this.leaveTeamConfirm();
        }
      });
    }

    buttons.push({
      text: 'Cancel',
      icon: 'close',
      role: 'cancel'
    });

    const actionSheet = await this.actionSheetCtrl.create({
      header: 'Team Options',
      buttons: buttons
    });
    await actionSheet.present();
  }

  async leaveTeamConfirm() {
    const alert = await this.alertCtrl.create({
      header: 'Confirm Leave',
      message: 'Are you sure you want to leave this team?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        },
        {
          text: 'Leave',
          role: 'destructive',
          handler: () => {
            this.Site.leaveTeam(this.teamId).subscribe(() => {
               this.router.navigate(['/home']);
            });
          }
        }
      ]
    });
    await alert.present();
  }

  async showLegend() {
    const alert = await this.alertCtrl.create({
      header: 'Task Legend',
      message: 'Green: 1 task<br>Orange: 2 tasks<br>Red: 3+ tasks',
      buttons: ['OK']
    });
    await alert.present();
  }
}