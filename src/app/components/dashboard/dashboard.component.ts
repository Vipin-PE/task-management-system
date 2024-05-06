import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import * as d3 from 'd3';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { TaskService } from '../../services/task.service';
import { Task } from '../../models/task';
import { CreateTaskDialogComponent } from '../create-task-dialog/create-task-dialog.component';
import { TaskDetailsDialogComponent } from '../task-details-dialog/task-details-dialog.component';
import { EditTaskDialogComponent } from '../edit-task-dialog/edit-task-dialog.component';
import { Router } from '@angular/router';

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, AfterViewInit {
    // Columns to display in the task table
    displayedColumns: string[] = ['title', 'dueDate', 'priority', 'status', 'actions'];
    
    // Filter option for tasks
    filterOption: string = 'all';
    
    // Data source for the task table
    tasks: MatTableDataSource<Task> = new MatTableDataSource<Task>([]);
    
    // Reference to the pie chart container element
    @ViewChild('pieChartContainer') pieChartContainer!: ElementRef<SVGElement>;

    constructor(
        private dialog: MatDialog,
        private taskService: TaskService,
        private router: Router
    ) {}

    // Initialization hook
    ngOnInit(): void {
        // Load tasks data
        this.loadTasks();
    }

    // AfterViewInit hook
    ngAfterViewInit(): void {
        // Create pie chart
        this.createPieChart();
    }

    // Load tasks data
    loadTasks(): void {
        this.taskService.getTasks().subscribe((tasks: Task[]) => {
            // Update tasks data source
            this.tasks.data = tasks;
            // Apply filter
            this.applyFilter();
            // Update pie chart
            this.createPieChart();
        });
    }

    // Show task details dialog
    showTaskDetails(task: Task): void {
        this.dialog.open(TaskDetailsDialogComponent, {
            width: '400px',
            data: task
        });
    }

    // Create a new task
    createTask(): void {
        const dialogRef = this.dialog.open(CreateTaskDialogComponent, {
            width: '400px',
            data: {}
        });

        dialogRef.afterClosed().subscribe((createdTask) => {
            if (createdTask) {
                // Add created task to data source and reload tasks
                this.tasks.data.push(createdTask);
                this.loadTasks();
            }
        });
    }

    // Edit an existing task
    editTask(task: Task): void {
        const dialogRef = this.dialog.open(EditTaskDialogComponent, {
            width: '400px',
            data: task
        });

        dialogRef.afterClosed().subscribe((updatedTask) => {
            if (updatedTask) {
                const index = this.tasks.data.findIndex((t) => t.id === task.id);
                if (index >= 0) {
                    // Update task data and reload tasks
                    this.tasks.data[index] = updatedTask;
                    this.loadTasks();
                }
            }
        });
    }

    // Delete a task
    deleteTask(task: Task): void {
        this.taskService.deleteTask(task.id).subscribe(() => {
            // Reload tasks after deletion
            this.loadTasks();
        });
    }

    // Apply filter to tasks
    applyFilter(): void {
        this.tasks.filterPredicate = (data: Task, filter: string): boolean => {
            const currentDate = new Date();
            const dueDate = new Date(data.dueDate);
            
            switch (filter) {
                case 'pending':
                    return data.status === 'Pending';
                case 'completed':
                    return data.status === 'Completed';
                case 'overdue':
                    return dueDate < currentDate && data.status !== 'Completed';
                case 'all':
                    return true;
                default:
                    return true;
            }
        };

        // Update filter
        this.tasks.filter = this.filterOption.toLowerCase();
    }

    // Create pie chart
    createPieChart(): void {
        // Group tasks by priority and count them
        const priorityCount = d3.rollups(
            this.tasks.data,
            (v) => v.length,
            (d) => d.priority
        );

        const width = 400;
        const height = 400;
        const radius = Math.min(width, height) / 2;

        // Select or create the SVG element
        const svgContainer = d3.select(this.pieChartContainer.nativeElement);
        let svg = svgContainer.select<SVGSVGElement>('svg');

        // Create SVG element if it doesn't exist
        if (svg.empty()) {
            svg = svgContainer.append('svg')
                .attr('width', width)
                .attr('height', height);
        }

        // Clear any previous content in the SVG container
        svg.selectAll('*').remove();

        // Create the group element within the SVG for the pie chart
        const pieGroup = svg.append('g')
            .attr('transform', `translate(${width / 2}, ${height / 2})`);

        // Create pie layout
        const pie = d3.pie<any>().value((d) => d[1]);

        // Create arc generator
        const arc = d3.arc<any>()
            .innerRadius(0)
            .outerRadius(radius);

        // Define a color scale using D3's color scheme
        const colorScale = d3.scaleOrdinal<string>()
            .domain(['High', 'Medium', 'Low'])
            .range(['#ff0000', '#ffcc00', '#00cc00']);

        // Bind data and create pie chart paths
        pieGroup.selectAll('path')
            .data(pie(priorityCount))
            .enter()
            .append('path')
            .attr('d', arc)
            .attr('fill', (d) => colorScale(d.data[0]));

        // Add text labels to the pie chart
        pieGroup.selectAll('text')
            .data(pie(priorityCount))
            .enter()
            .append('text')
            .attr('transform', (d) => `translate(${arc.centroid(d)})`)
            .attr('text-anchor', 'middle')
            .attr('alignment-baseline', 'middle')
            .style('font-size', '12px')
            .text((d) => `${d.data[0]}: ${((d.data[1] / this.tasks.data.length) * 100).toFixed(2)}%`);
    }

    // Navigate to the profile page
    navigateToProfile(): void {
        this.router.navigate(['/profile']);
    }

    // Log out of the application
    logout(): void {
        // Add your logout logic here (e.g., clearing authentication data)
        console.log('Logout successful');
        this.router.navigate(['/login']);
    }
}
