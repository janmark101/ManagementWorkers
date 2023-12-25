import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './Site/login/login.component';
import { RegisterComponent } from './Site/register/register.component';
import { HomeComponent } from './Site/home/home.component';
import { authGuard } from './Services/auth.guard';
import { TeamComponent } from './Site/team/team.component';



const routes: Routes = [
  {path: '', component:LoginComponent,pathMatch : 'full'},
  {path: 'register',component:RegisterComponent},
  {path: 'home',component:HomeComponent, canActivate : [authGuard],},
  {path: 'team/:id',component: TeamComponent,canActivate : [authGuard],},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
