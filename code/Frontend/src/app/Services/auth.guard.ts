import { CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router,
  UrlTree
} from '@angular/router';
import { Injectable } from '@angular/core';


import { AuthService } from './auth.service';

@Injectable({ providedIn: 'root' })
export class  authGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): boolean {
    const user = this.authService.getUserFromLocalStorage();

    if (!user) {
      // Użytkownik nie jest zdefiniowany w local storage, zablokuj dostęp
      this.router.navigate(['']); // Przekieruj na stronę logowania (możesz dostosować ścieżkę)
      return false;
    }

    // Użytkownik jest zdefiniowany w local storage, umożliw dostęp
    return true;
  }
}
