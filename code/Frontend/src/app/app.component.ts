import { Component } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'WM';

  isLoginPage: boolean = false;

  constructor(private router: Router, private activatedRoute: ActivatedRoute) {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      if ((this.activatedRoute.snapshot.firstChild?.routeConfig?.path === '') || (this.activatedRoute.snapshot.firstChild?.routeConfig?.path === 'register')){
        this.isLoginPage = true;
      }
      else{
        this.isLoginPage = false;
      }
    });
  }
}
