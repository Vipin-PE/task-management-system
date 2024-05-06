import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UserAuthService } from './services/user-auth.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent {
    constructor(private authService: UserAuthService, private router: Router) {}

    // Method to check if the user is logged in
    isLoggedIn(): boolean {
        return this.authService.isLoggedIn();
    }

    // Method to handle user logout
    logout(): void {
        try {
            // Perform logout using the authentication service
            this.authService.logout();
            // Navigate to the login page after successful logout
            this.router.navigate(['/login']);
        } catch (error) {
            // Log any errors that occur during logout
            console.error('Error during logout:', error);
        }
    }
}
