import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Task } from '../../models/task';
import { TaskService } from '../../services/task.service';

@Component({
    selector: 'app-edit-task-dialog',
    templateUrl: './edit-task-dialog.component.html',
    styleUrls: ['./edit-task-dialog.component.scss']
})
export class EditTaskDialogComponent {
    editTaskForm: FormGroup;

    constructor(
        private dialogRef: MatDialogRef<EditTaskDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: Task,
        private fb: FormBuilder,
        private taskService: TaskService
    ) {
        this.editTaskForm = this.fb.group({
            title: [data.title, Validators.required],
            dueDate: [data.dueDate, Validators.required],
            priority: [data.priority, Validators.required],
            status: [data.status, Validators.required],
            description: [data.description]
        });
    }

    onSubmit(): void {
        if (this.editTaskForm.valid) {
            const updatedTask: Task = {
                ...this.data,
                ...this.editTaskForm.value
            };
            
            this.taskService.updateTask(updatedTask).subscribe(() => {
                this.dialogRef.close(updatedTask);
            });
        }
    }

    cancel(): void {
        this.dialogRef.close();
    }
}
