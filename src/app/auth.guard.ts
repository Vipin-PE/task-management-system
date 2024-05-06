import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { UserAuthService } from './services/user-auth.service';

@Injectable({
    providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  
    constructor(private authService: UserAuthService, private router: Router) {}

    canActivate(): boolean {
        if (this.authService.isLoggedIn()) {
            return true;
        } else {
            this.router.navigate(['/login']);
            return false;
        }
    }
}
