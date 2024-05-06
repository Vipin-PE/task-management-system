import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TaskService } from '../../services/task.service';

@Component({
    selector: 'app-create-task-dialog',
    templateUrl: './create-task-dialog.component.html',
    styleUrls: ['./create-task-dialog.component.scss']
})
export class CreateTaskDialogComponent {
    // Form for creating a new task
    createTaskForm: FormGroup;

    // Dropdown options for priority and status
    priorities = ['High', 'Medium', 'Low'];
    statuses = ['Pending', 'Completed'];

    // Constructor initializes form group and injects dependencies
    constructor(
        public dialogRef: MatDialogRef<CreateTaskDialogComponent>,
        private fb: FormBuilder,
        private taskService: TaskService
    ) {
        // Initialize the form group with form controls and validation
        this.createTaskForm = this.fb.group({
            title: ['', Validators.required],
            description: ['', Validators.required],
            priority: ['', Validators.required],
            dueDate: ['', Validators.required],
            status: ['', Validators.required]
        });
    }

    // Method called when the form is submitted
    onSubmit(): void {
        // Check if the form is valid before proceeding
        if (this.createTaskForm.valid) {
            // Get the form data
            const taskData = this.createTaskForm.value;
            // Call the task service to create the task
            this.taskService.createTask(taskData).subscribe(
                (createdTask) => {
                    console.log('Task created:', createdTask);
                    // Close the dialog and pass the created task data back
                    this.dialogRef.close(createdTask);
                },
                (error) => {
                    console.error('Error creating task:', error);
                }
            );
        }
    }

    // Method called when the user cancels the form
    onCancel(): void {
        // Close the dialog without passing any data back
        this.dialogRef.close();
    }
}
