import { CanActivate,
  Router,
} from '@angular/router';
import { Injectable } from '@angular/core';


import { AuthService } from './auth.service';

@Injectable({ providedIn: 'root' })
export class  loggedGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): boolean {
    const user = this.authService.getUserFromLocalStorage();
    
    if(user){
      this.router.navigate(['/home'])
      return false
    }
    return true
  }
}