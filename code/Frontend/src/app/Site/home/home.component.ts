import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { delay, take } from 'rxjs';
import { faPeopleGroup, faSquarePlus } from '@fortawesome/free-solid-svg-icons';
import { SiteService } from 'src/app/Services/site.service';
import { AuthService } from 'src/app/Services/auth.service';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  plus = faPeopleGroup;
  join = faSquarePlus;
  userTeams: any = [];
  user: any;

  constructor(
    private Site: SiteService,
    private Auth: AuthService,
    private router: Router,
    private modalCtrl: ModalController
  ) { };

  ngOnInit(): void {
    this.user = this.Auth.getUserFromLocalStorage();
    this.loadTeams();
  }

  ionViewWillEnter() {
    this.loadTeams();
  }

  loadTeams() {
    this.Site.getUserTeams().pipe(take(1)).subscribe({
      next: (data: any) => {
        this.userTeams = data;
      },
      error: (error: any) => {
        console.error('Error fetching teams', error);
      }
    });
  }

  checkRole(index: number) {
    if (!this.userTeams || !this.userTeams[index]) return "";
    if (this.userTeams[index].manager == this.user.user_id) {
      return "Manager";
    }

    return "Worker";
  }

  Logout() {
    this.Auth.logout().subscribe({
      next: () => {
        this.performLocalLogout();
      },
      error: (error: any) => {
        console.error('Logout API error:', error);
        this.performLocalLogout();
      }
    });
  }

  private performLocalLogout() {
    localStorage.removeItem('user');
    this.router.navigate(['/login'], { replaceUrl: true });
  }

  CreateTeam() {
    this.router.navigate(['/create-team']);
  }

  JoinTeam() {
    this.router.navigate(['/join-team']);
  }

}