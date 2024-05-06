import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserAuthService } from '../../services/user-auth.service';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
    loginForm!: FormGroup; // The form group for login inputs
    errorMessage: string = ''; // Error message to display for invalid login

    // Dependency injection of FormBuilder, UserAuthService, and Router services
    constructor(private fb: FormBuilder, private userAuthService: UserAuthService, private router: Router) {}

    /**
     * Initializes the login form with form controls for username and password.
     */
    ngOnInit() {
        // Create a form group with form controls for username and password, both required
        this.loginForm = this.fb.group({
            username: ['', Validators.required],
            password: ['', Validators.required]
        });
    }

    /**
     * Submits the login form and attempts to authenticate the user.
     * If successful, navigates to the dashboard.
     * Otherwise, displays an error message.
     */
    onSubmit() {
        // Check if the form is valid before attempting to log in
        if (this.loginForm.valid) {
            const { username, password } = this.loginForm.value;

            // Attempt to log in the user using the provided username and password
            const loginSuccess = this.userAuthService.login({ username, password });

            // If login is successful, navigate to the dashboard
            if (loginSuccess) {
                console.log('Login successful');
                this.router.navigate(['/dashboard']);
            } else {
                // If login fails, display an error message
                console.error('Login failed');
                this.errorMessage = 'Invalid username or password';
            }
        }
    }
}
