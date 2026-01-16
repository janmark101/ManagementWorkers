import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NavController, ToastController } from '@ionic/angular';
import { SiteService } from 'src/app/Services/site.service';

@Component({
  selector: 'app-task',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.scss']
})
export class TaskComponent implements OnInit {

  mode: 'create' | 'edit' = 'create';
  taskId: number | null = null;
  team_id: number | any;

  taskData = {
    name: '',
    description: '',
    date: '',
    workers_id: [] as number[]
  };

  userList: any[] = [];

  constructor(
    private route: ActivatedRoute,
    private navCtrl: NavController,
    private toastCtrl: ToastController,
    private Service: SiteService
  ) { }

  ngOnInit(): void {
    this.team_id = this.route.snapshot.paramMap.get('id');

    const paramTaskId = this.route.snapshot.paramMap.get('taskId');
    console.log(paramTaskId);
    if (paramTaskId) {
      this.mode = 'edit';
      this.taskId = Number(paramTaskId);
      this.loadTaskDetails(this.taskId);
    }

    this.loadUsers();
  }

  loadUsers() {
    this.Service.getUsersForTeam(this.team_id).subscribe({
      next: (data: any) => this.userList = data.data || data || [],
      error: (err) => console.error(err)
    });
  }

  loadTaskDetails(id: number) {
    this.Service.getTaskForTeam(this.team_id).subscribe((tasks: any) => {
      const foundTask = tasks.find((t: any) => t.id === id);
      console.log("Task found");
      if (foundTask) {
        // Przypisujemy dane do obiektu, który jest podpięty pod formularz
        this.taskData = {
          name: foundTask.name,
          description: foundTask.description,
          date: foundTask.date,
          workers_id: foundTask.workers_id || []
        };
      }
    });
  }

  onSubmit(form: NgForm) {
    if (form.invalid) return;

    const requestData = {
      "name": form.value.name,
      "description": form.value.description,
      "date": form.value.date,
      "workers_id": form.value.workers_id || []
    };

    if (this.mode === 'create') {
      this.Service.addTaskForTeam(this.team_id, requestData).subscribe({
        next: () => this.handleSuccess('Task created successfully!'),
        error: (err) => this.handleError(err)
      });
    } else {
      this.Service.editTask(this.taskId!, this.team_id, requestData).subscribe({
        next: () => this.handleSuccess('Task updated successfully!'),
        error: (err) => this.handleError(err)
      });
    }
  }

  async handleSuccess(msg: string) {
    await this.showToast(msg, 'success');
    this.navCtrl.back();
  }

  async handleError(err: any) {
    console.error(err);
    await this.showToast('Something went wrong!', 'danger');
  }

  onCancel() {
    this.navCtrl.back();
  }

  async showToast(msg: string, color: string) {
    const toast = await this.toastCtrl.create({
      message: msg, duration: 2000, color: color, position: 'bottom'
    });
    toast.present();
  }
}