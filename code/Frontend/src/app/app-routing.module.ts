import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './Site/login/login.component';
import { RegisterComponent } from './Site/register/register.component';
import { HomeComponent } from './Site/home/home.component';
import { authGuard } from './Services/auth.guard';
import { TeamComponent } from './Site/team/team.component';
import { VerifyAccountComponent } from './Site/verify-account/verify-account.component';
import { verifyGuard } from './Services/verify.guard';
import { loggedGuard } from './Services/logged.guard';
import { TeamOptionssComponent } from './Site/team-optionss/team-optionss.component';
import { ChatComponent } from './Site/chat/chat.component';
import { JoinTeamLinkComponent } from './Site/join-team-link/join-team-link.component';
import { TaskComponent } from './Site/task/task.component';
import { DayComponent } from './Site/day/day.component';
import { CreateComponent } from './Site/create/create.component';
import { JoinTeamComponent } from './Site/join-team/join-team.component';
import { ForgotPasswordComponent } from './Site/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './Site/reset-password/reset-password.component';


const routes: Routes = [
  {path: '', component:LoginComponent, pathMatch : 'full', canActivate: [loggedGuard],},
  {path: 'login', component:LoginComponent, pathMatch : 'full', canActivate: [loggedGuard],},
  {path: 'register',component:RegisterComponent, canActivate: [loggedGuard,]},
  {path: 'home',component:HomeComponent, canActivate : [authGuard],},
  { path: 'create-team', component: CreateComponent },
  {path: 'accverify', component:VerifyAccountComponent,canActivate: [verifyGuard], },
  {path: 'team/:id',component: TeamComponent,canActivate : [authGuard],},
  {path: 'team/:id/options',component: TeamOptionssComponent, canActivate: [authGuard],},
  {path: 'team/:id/chat', component: ChatComponent, canActivate : [authGuard],},
  {path: 'join/:code',component:JoinTeamLinkComponent, canActivate : [authGuard],},
  { path: 'join-team', component: JoinTeamComponent },
  { path: 'team/:id/add-task', component: TaskComponent },
  { path: 'team/:id/edit-task/:taskId', component: TaskComponent },
  { path: 'team/:id/day/:day/:month/:year', component: DayComponent },
  { path: 'team/:id/chat', component: ChatComponent },
  { path: 'forgot-password', component: ForgotPasswordComponent},
  { path: 'reset-password/:uid/:token', component: ResetPasswordComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
