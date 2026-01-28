import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController, AlertController, ModalController } from '@ionic/angular';
import { SiteService } from 'src/app/Services/site.service';
import { EditTaskComponent } from '../edit-task/edit-task.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-day',
  templateUrl: './day.component.html',
  styleUrls: ['./day.component.scss'],
})

export class DayComponent implements OnInit {
  teamID: number | any;
  
  day: number | any;
  month: string = '';
  year: number | any;

  tasks: any[] = [];
  message: string = "";
  statuses = ['Not started', 'In progress', 'Done'];
  isManager: boolean = false;

  monthMap: { [key: string]: number } = {
    'January': 0, 'February': 1, 'March': 2, 'April': 3, 'May': 4, 'June': 5,
    'July': 6, 'August': 7, 'September': 8, 'October': 9, 'November': 10, 'December': 11
  };

  constructor(
    private route: ActivatedRoute,
    private navCtrl: NavController,
    private alertCtrl: AlertController,
    private modalCtrl: ModalController,
    private Service: SiteService,
    private router: Router
  ) { }


  ngOnInit(): void {
    this.teamID = this.route.snapshot.paramMap.get('id');
    this.day = Number(this.route.snapshot.paramMap.get('day'));
    this.month = this.route.snapshot.paramMap.get('month') || '';
    this.year = Number(this.route.snapshot.paramMap.get('year'));

    this.checkUserRole();
    this.loadTasks();
  }

  checkUserRole() {
    this.Service.getUsersForTeam(this.teamID).subscribe((data: any) => {
      this.isManager = data.manager;
    });
  }

  loadTasks() {
    this.Service.getTaskForTeam(this.teamID).subscribe({
      next: (allTasks: any) => {
        const monthIndex = this.monthMap[this.month];
        this.tasks = allTasks.filter((item: any) => {
          const itemDate = new Date(item.date);
          return itemDate.getDate() === this.day &&
            itemDate.getMonth() === monthIndex &&
            itemDate.getFullYear() === this.year;
        });
        this.sortListByName();
      },
      error: (err) => console.error(err)
    });
  }

  sortListByName() {
    this.tasks.sort((a: any, b: any) => {
      const nameA = a.name.toLowerCase();
      const nameB = b.name.toLowerCase();

      if (nameA < nameB) return -1;
      if (nameA > nameB) return 1;

      return 0;
    });
  }

  update(event: any, taskId: number) {
    const status = event.detail.value;
    const data = { 'status': status };

    this.Service.changeTaskStatus(this.teamID, data, taskId).subscribe({
      next: () => {
        // Aktualizacja lokalna
        const task = this.tasks.find((t: any) => t.id === taskId);
        if (task) task.status = status;
      },
      error: () => this.message = "Failed to update status."
    });
  }

  async Delete(taskId: number) {
    const alert = await this.alertCtrl.create({
      header: 'Confirm Delete',
      message: 'Are you sure you want to delete this task?',
      buttons: [
        { text: 'Cancel', role: 'cancel' },
        {
          text: 'Delete',
          role: 'destructive',
          handler: () => {
            this.Service.deleteTask(taskId, this.teamID).subscribe({
              next: () => this.loadTasks(), // Odśwież listę po usunięciu
              error: () => this.message = "Something went wrong!"
            });
          }
        }
      ]
    });
    await alert.present();
  }

  EditTask(taskId: number) {
    this.router.navigate(['/team', this.teamID, 'edit-task', taskId]);
  }
} 