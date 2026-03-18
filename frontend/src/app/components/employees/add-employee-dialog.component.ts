import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { EmployeeService } from '../../services/employee.service';

@Component({
  selector: 'app-add-employee-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatProgressSpinnerModule,
  ],
  template: `
    <h2 mat-dialog-title>Add New Employee</h2>
    <mat-dialog-content>
      <form [formGroup]="form" class="form-grid">
        <mat-form-field appearance="outline">
          <mat-label>Employee ID</mat-label>
          <input matInput formControlName="employee_id" placeholder="e.g. EMP001">
          @if (form.get('employee_id')?.hasError('required') && form.get('employee_id')?.touched) {
            <mat-error>Employee ID is required</mat-error>
          }
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Full Name</mat-label>
          <input matInput formControlName="full_name" placeholder="e.g. John Doe">
          @if (form.get('full_name')?.hasError('required') && form.get('full_name')?.touched) {
            <mat-error>Full name is required</mat-error>
          }
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Email Address</mat-label>
          <input matInput formControlName="email" type="email" placeholder="e.g. john&#64;company.com">
          @if (form.get('email')?.hasError('required') && form.get('email')?.touched) {
            <mat-error>Email is required</mat-error>
          }
          @if (form.get('email')?.hasError('email') && form.get('email')?.touched) {
            <mat-error>Enter a valid email</mat-error>
          }
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Department</mat-label>
          <input matInput formControlName="department" placeholder="e.g. Engineering">
          @if (form.get('department')?.hasError('required') && form.get('department')?.touched) {
            <mat-error>Department is required</mat-error>
          }
        </mat-form-field>
      </form>

      @if (serverError) {
        <p class="server-error">{{ serverError }}</p>
      }
    </mat-dialog-content>

    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close [disabled]="saving">Cancel</button>
      <button mat-raised-button color="primary" (click)="save()" [disabled]="form.invalid || saving">
        @if (saving) {
          <mat-spinner diameter="20"></mat-spinner>
        } @else {
          Save
        }
      </button>
    </mat-dialog-actions>
  `,
  styles: [`
    .form-grid {
      display: flex;
      flex-direction: column;
      gap: 4px;
      min-width: 400px;
      padding-top: 8px;
    }
    .server-error {
      color: #d32f2f;
      font-size: 14px;
      margin-top: 8px;
    }
    mat-dialog-actions button mat-spinner {
      display: inline-block;
    }
  `],
})
export class AddEmployeeDialogComponent {
  form: FormGroup;
  saving = false;
  serverError = '';

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<AddEmployeeDialogComponent>,
    private employeeService: EmployeeService
  ) {
    this.form = this.fb.group({
      employee_id: ['', Validators.required],
      full_name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      department: ['', Validators.required],
    });
  }

  save(): void {
    if (this.form.invalid) return;

    this.saving = true;
    this.serverError = '';

    this.employeeService.create(this.form.value).subscribe({
      next: () => this.dialogRef.close(true),
      error: (err) => {
        this.saving = false;
        this.serverError = err.error?.detail || 'Failed to create employee. Please try again.';
      },
    });
  }
}
