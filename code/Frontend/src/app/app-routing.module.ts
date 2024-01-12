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



const routes: Routes = [
  {path: '', component:LoginComponent,pathMatch : 'full',canActivate: [loggedGuard],},
  {path: 'register',component:RegisterComponent, canActivate: [loggedGuard,]},
  {path: 'home',component:HomeComponent, canActivate : [authGuard],},
  {path: 'accverify', component:VerifyAccountComponent,canActivate: [verifyGuard], },
  {path: 'team/:id',component: TeamComponent,canActivate : [authGuard],},
  {path: 'team/:id/options',component: TeamOptionssComponent,canActivate : [authGuard],},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
