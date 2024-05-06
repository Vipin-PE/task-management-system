import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserAuthService } from '../../services/user-auth.service';
import { Router } from '@angular/router';

@Component({
    selector: 'app-signup',
    templateUrl: './signup.component.html',
    styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {
    // Form group for the signup form
    signupForm!: FormGroup;
    // Variable to hold error messages
    errorMessage: string = '';

    constructor(
        private fb: FormBuilder,
        private userAuthService: UserAuthService,
        private router: Router
    ) {}

    // Initialization function
    ngOnInit(): void {
        // Create the signup form with form controls and validators
        this.signupForm = this.fb.group({
            username: ['', Validators.required],
            email: ['', [Validators.required, Validators.email]],
            password: ['', [Validators.required, Validators.minLength(6)]],
            confirmPassword: ['', Validators.required]
        });
    }

    // Function to handle form submission
    onSubmit(): void {
        if (this.signupForm.valid) {
            // Get form values
            const { username, email, password, confirmPassword } = this.signupForm.value;

            // Check if password and confirm password match
            if (password !== confirmPassword) {
                this.errorMessage = 'Passwords do not match';
                return;
            }

            // Create user data object
            const userData = { username, password, email };

            // Call the signup method in the authentication service
            this.userAuthService.signup(userData);
            console.log('User signed up successfully');

            // Navigate to the login page after successful signup
            this.router.navigate(['/login']);
        }
    }
}
