import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { EmployeeService } from '../../services/employee.service';
import { Employee } from '../../models/employee.model';
import { AddEmployeeDialogComponent } from './add-employee-dialog.component';
import { ConfirmDialogComponent } from './confirm-dialog.component';

@Component({
  selector: 'app-employees',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatCardModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    MatDialogModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
  ],
  templateUrl: './employees.component.html',
  styleUrl: './employees.component.scss',
})
export class EmployeesComponent implements OnInit {
  employees: Employee[] = [];
  displayedColumns = ['employee_id', 'full_name', 'email', 'department', 'created_at', 'actions'];
  loading = true;
  error = '';

  constructor(
    private employeeService: EmployeeService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadEmployees();
  }

  loadEmployees(): void {
    this.loading = true;
    this.error = '';
    this.employeeService.getAll().subscribe({
      next: (res) => {
        this.employees = res.employees;
        this.loading = false;
      },
      error: () => {
        this.error = 'Failed to load employees. Please try again.';
        this.loading = false;
      },
    });
  }

  openAddDialog(): void {
    const dialogRef = this.dialog.open(AddEmployeeDialogComponent, {
      width: '500px',
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.loadEmployees();
        this.snackBar.open('Employee added successfully', 'Close', { duration: 3000 });
      }
    });
  }

  deleteEmployee(emp: Employee): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: { name: emp.full_name, id: emp.employee_id },
    });

    dialogRef.afterClosed().subscribe((confirmed) => {
      if (confirmed) {
        this.employeeService.delete(emp.employee_id).subscribe({
          next: () => {
            this.loadEmployees();
            this.snackBar.open('Employee deleted successfully', 'Close', { duration: 3000 });
          },
          error: () => {
            this.snackBar.open('Failed to delete employee', 'Close', { duration: 3000 });
          },
        });
      }
    });
  }
}
