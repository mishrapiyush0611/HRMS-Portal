import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatChipsModule } from '@angular/material/chips';
import { MatExpansionModule } from '@angular/material/expansion';
import { EmployeeService } from '../../services/employee.service';
import { AttendanceService } from '../../services/attendance.service';
import { Employee } from '../../models/employee.model';
import { AttendanceRecord, AttendanceSummary } from '../../models/attendance.model';

@Component({
  selector: 'app-attendance',
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
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
    MatChipsModule,
    MatExpansionModule,
  ],
  templateUrl: './attendance.component.html',
  styleUrl: './attendance.component.scss',
})
export class AttendanceComponent implements OnInit {
  employees: Employee[] = [];
  markForm: FormGroup;
  saving = false;
  serverError = '';

  selectedEmployeeId = '';
  attendanceRecords: AttendanceRecord[] = [];
  summary: AttendanceSummary | null = null;
  loadingRecords = false;
  loadingEmployees = true;
  displayedColumns = ['date', 'status', 'marked_at'];

  fromDate = '';
  toDate = '';

  constructor(
    private fb: FormBuilder,
    private employeeService: EmployeeService,
    private attendanceService: AttendanceService,
    private snackBar: MatSnackBar
  ) {
    this.markForm = this.fb.group({
      employee_id: ['', Validators.required],
      date: [new Date(), Validators.required],
      status: ['Present', Validators.required],
    });
  }

  ngOnInit(): void {
    this.loadEmployees();
  }

  loadEmployees(): void {
    this.loadingEmployees = true;
    this.employeeService.getAll().subscribe({
      next: (res) => {
        this.employees = res.employees;
        this.loadingEmployees = false;
      },
      error: () => {
        this.loadingEmployees = false;
      },
    });
  }

  markAttendance(): void {
    if (this.markForm.invalid) return;

    this.saving = true;
    this.serverError = '';

    const val = this.markForm.value;
    const dateObj: Date = val.date;
    const dateStr = `${dateObj.getFullYear()}-${String(dateObj.getMonth() + 1).padStart(2, '0')}-${String(dateObj.getDate()).padStart(2, '0')}`;

    this.attendanceService
      .markAttendance({
        employee_id: val.employee_id,
        date: dateStr,
        status: val.status,
      })
      .subscribe({
        next: () => {
          this.saving = false;
          this.snackBar.open('Attendance marked successfully', 'Close', { duration: 3000 });
          if (this.selectedEmployeeId === val.employee_id) {
            this.loadAttendance();
          }
        },
        error: (err) => {
          this.saving = false;
          this.serverError = err.error?.detail || 'Failed to mark attendance.';
        },
      });
  }

  onEmployeeSelect(employeeId: string): void {
    this.selectedEmployeeId = employeeId;
    this.loadAttendance();
  }

  loadAttendance(): void {
    if (!this.selectedEmployeeId) return;

    this.loadingRecords = true;
    this.attendanceService
      .getByEmployee(this.selectedEmployeeId, this.fromDate || undefined, this.toDate || undefined)
      .subscribe({
        next: (res) => {
          this.attendanceRecords = res.records;
          this.loadingRecords = false;
        },
        error: () => {
          this.loadingRecords = false;
        },
      });

    this.attendanceService.getSummary(this.selectedEmployeeId).subscribe({
      next: (data) => (this.summary = data),
      error: () => (this.summary = null),
    });
  }

  applyFilter(): void {
    this.loadAttendance();
  }

  clearFilter(): void {
    this.fromDate = '';
    this.toDate = '';
    this.loadAttendance();
  }
}
