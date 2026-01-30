import { Component } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';
import { Platform } from '@ionic/angular';
import { PushNotifications } from '@capacitor/push-notifications';
import { SiteService } from './Services/site.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'WM';

  isLoginPage: boolean = false;

  constructor(private router: Router, private activatedRoute: ActivatedRoute, private platform: Platform, private site: SiteService) {
    
    this.initializeApp();

    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      var activeRoute = this.activatedRoute.snapshot.firstChild?.routeConfig?.path; 
      if ((activeRoute === '') || (activeRoute === 'login') ) {
        this.isLoginPage = true;
      }
      else {
        this.isLoginPage = false;
      }
    });
    
  }

  // add notifications only for android
  initializeApp() {
    this.platform.ready().then(() => {
      if (this.platform.is('capacitor')) {
        this.registerPush();
      }
    });
  }

  private registerPush() {
    PushNotifications.addListener('registration', (token) => {
      console.log('FCM TOKEN: ', token.value);
      this.site.saveDeviceToken(token.value).subscribe();
    });

    PushNotifications.addListener('registrationError', (error) => {
      console.error('Push registration error: ', error);
    });

    PushNotifications.addListener('pushNotificationReceived', (notification) => {
      console.log('Push received with app in foreground: ', notification);
      // display toast
    });

    PushNotifications.addListener('pushNotificationActionPerformed', (notification) => {
      console.log('Push notoficatoin clicked:', notification);
      // add redirection to chat / notification context
      const data = notification.notification.data;
      
      if (data.type === 'chat_message') {
            this.router.navigate(['/team', data.team_id, 'chat']);
      }

      if (data.type === 'task_assignment') {
        this.router.navigate(['/team', data.team_id]);
      }

      const teamId = notification.notification.data.teamId;
      this.router.navigate(['/team', teamId, 'chat']);
    });

    // premission request
    PushNotifications.requestPermissions().then(result => {
      if (result.receive === 'granted') {
        PushNotifications.register();
      } else {
        console.log('Push permision not granted');
      }
    });
  }
}


