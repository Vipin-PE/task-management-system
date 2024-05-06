import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserAuthService } from '../../services/user-auth.service';
import { Router } from '@angular/router';

@Component({
    selector: 'app-profile',
    templateUrl: './profile.component.html',
    styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
    user: any;
    editForm!: FormGroup;
    isEditing = false;
    errorMessage: string = '';

    constructor(
        private fb: FormBuilder,
        private userAuthService: UserAuthService,
        private router: Router
    ) {}

    ngOnInit(): void {
        this.user = this.userAuthService.getLoggedInUser();

        this.editForm = this.fb.group({
            email: [this.user.email, [Validators.required, Validators.email]],
            username: [this.user.username, Validators.required],
            currentPassword: ['', Validators.required],
            newPassword: ['', Validators.minLength(6)],
            confirmNewPassword: ['', Validators.minLength(6)]
        });

        this.disableForm();
    }

    enableForm() {
        this.editForm.get('email')?.enable();
        this.editForm.get('username')?.enable();
        this.editForm.get('currentPassword')?.enable();
        this.editForm.get('newPassword')?.enable();
        this.editForm.get('confirmNewPassword')?.enable();
        this.isEditing = true;
        this.errorMessage = ''; 
    }

    disableForm() {
        this.editForm.get('email')?.disable();
        this.editForm.get('username')?.disable();
        this.editForm.get('currentPassword')?.disable();
        this.editForm.get('newPassword')?.disable();
        this.editForm.get('confirmNewPassword')?.disable();
        this.isEditing = false;
        this.errorMessage = ''; 
    }

    onSubmit() {
        if (this.editForm.valid) {
            const { email, username, currentPassword, newPassword, confirmNewPassword } = this.editForm.value;

            if (currentPassword !== this.user.password) {
                this.errorMessage = 'Current password is incorrect';
                return;
            }

            if (newPassword && newPassword !== confirmNewPassword) {
                this.errorMessage = 'New passwords do not match';
                return;
            }

            const updatedData = {
                email: email || this.user.email,
                username: username || this.user.username,
                password: newPassword || this.user.password
            };

            this.userAuthService.updateUser(updatedData);
            console.log('Profile updated successfully');

            if (newPassword) {
                this.userAuthService.logout();
                this.router.navigate(['/login']);
            } else {
                this.disableForm();
                this.errorMessage = '';
            }
        }
    }
}
