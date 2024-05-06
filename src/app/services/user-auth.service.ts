import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
    providedIn: 'root',
})
export class UserAuthService {
    // Private property to hold the authentication token
    private authToken: string | null = null;

    // Constructor to initialize the service and retrieve the authentication token from local storage
    constructor(private router: Router) {
        this.authToken = localStorage.getItem('authToken');
    }

    // Method to check if the user is logged in based on the presence of an authentication token
    isLoggedIn(): boolean {
        return this.authToken !== null;
    }

    // Method to log out the user
    logout(): void {
        // Remove the authentication token from local storage
        localStorage.removeItem('authToken');
        // Reset the authToken property to null
        this.authToken = null;
        // Navigate the user to the login page
        this.router.navigate(['/login']);
    }

    // Method to handle user signup
    signup(userData: any): void {
        // Store the user data in local storage
        localStorage.setItem('userData', JSON.stringify(userData));
        console.log('User signed up and data stored in local storage:', userData);
    }

    // Method to handle user login
    login(credentials: any): boolean {
        // Retrieve the stored user data from local storage
        const storedUserData = localStorage.getItem('userData');
        // Check if the stored data exists
        if (storedUserData) {
            const userData = JSON.parse(storedUserData);
            // Verify if the provided username and password match the stored data
            if (credentials.username === userData.username && credentials.password === userData.password) {
                // Set the authentication token
                this.authToken = 'some_auth_token';
                // Store the authentication token in local storage
                localStorage.setItem('authToken', this.authToken);
                return true;
            }
        }
        return false; // Return false if login failed
    }

    // Method to retrieve the logged-in user data
    getLoggedInUser(): any {
        // Retrieve the stored user data from local storage
        const userData = localStorage.getItem('userData');
        // Parse and return the user data if it exists
        if (userData) {
            return JSON.parse(userData);
        }
        return null; // Return null if no user data found
    }

    // Method to update the user data
    updateUser(updatedData: any): void {
        // Update the stored user data in local storage
        localStorage.setItem('userData', JSON.stringify(updatedData));
    }
}
