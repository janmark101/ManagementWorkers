import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './Site/login/login.component';
import { RegisterComponent } from './Site/register/register.component';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AuthService } from './Services/auth.service';
import { HomeComponent } from './Site/home/home.component';
import { SiteService } from './Services/site.service';
import { TeamComponent } from './Site/team/team.component';
import { NavbarComponent } from './Site/navbar/navbar.component';
import { CreateComponent } from './Site/create/create.component';
import { MatDialogModule} from '@angular/material/dialog';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { JoinTeamComponent } from './Site/join-team/join-team.component';
import { DayComponent } from './Site/day/day.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatNativeDateModule} from '@angular/material/core';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { MatTooltipModule } from '@angular/material/tooltip';

import {
  ConfirmBoxConfigModule,
  DialogConfigModule,
  NgxAwesomePopupModule,
  ToastNotificationConfigModule,
} from '@costlydeveloper/ngx-awesome-popup';
import { TaskComponent } from './Site/task/task.component';
import { UniqueCodeComponent } from './Site/unique-code/unique-code.component';
import { EditTaskComponent } from './Site/edit-task/edit-task.component';
import { VerifyAccountComponent } from './Site/verify-account/verify-account.component';
import { TeamOptionssComponent } from './Site/team-optionss/team-optionss.component';
import { ChatComponent } from './Site/chat/chat.component';
import { AddingLinkComponent } from './Site/adding-link/adding-link.component';
import { JoinTeamLinkComponent } from './Site/join-team-link/join-team-link.component';
import { DatePipe } from '@angular/common';



@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    HomeComponent,
    TeamComponent,
    NavbarComponent,
    CreateComponent,
    JoinTeamComponent,
    DayComponent,
    TaskComponent,
    UniqueCodeComponent,
    EditTaskComponent,
    VerifyAccountComponent,
    TeamOptionssComponent,
    ChatComponent,
    AddingLinkComponent,
    JoinTeamLinkComponent,
  ],
  imports: [
    MatTooltipModule,
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    MatDialogModule,
    BrowserAnimationsModule,
    FontAwesomeModule,
    NgxAwesomePopupModule.forRoot({
      colorList: {
        success: '#3caea3', // optional
        info: '#2f8ee5', // optional
        warning: '#ffc107', // optional
        danger: '#e46464', // optional
        customOne: '#3ebb1a', // optional
        customTwo: '#bd47fa', // optional (up to custom five)
      },
    }),
    ConfirmBoxConfigModule.forRoot(),
    NgMultiSelectDropDownModule.forRoot(),
    DialogConfigModule.forRoot(), // optional
    ToastNotificationConfigModule.forRoot(),
    MatFormFieldModule,
    MatInputModule, 
    MatDatepickerModule, 
    MatNativeDateModule, // optional
  ],
  providers: [AuthService,SiteService,DatePipe],
  bootstrap: [AppComponent]
})
export class AppModule { }
