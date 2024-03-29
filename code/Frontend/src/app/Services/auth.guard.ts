import { CanActivate,
  Router,
} from '@angular/router';
import { Injectable } from '@angular/core';


import { AuthService } from './auth.service';

@Injectable({ providedIn: 'root' })
export class  authGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): boolean {
    const user = this.authService.getUserFromLocalStorage();
    if (user) {
      if(user.verified === true){
        return true
      }

      this.router.navigate(['/accverify']);
      return false
    }

    this.router.navigate(['']); 
    return false;
  }
}
