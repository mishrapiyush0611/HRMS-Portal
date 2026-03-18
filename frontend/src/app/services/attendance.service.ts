import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  AttendanceCreate,
  AttendanceListResponse,
  AttendanceRecord,
  AttendanceSummary,
} from '../models/attendance.model';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AttendanceService {
  private readonly url = `${environment.apiUrl}/attendance`;

  constructor(private http: HttpClient) {}

  markAttendance(record: AttendanceCreate): Observable<AttendanceRecord> {
    return this.http.post<AttendanceRecord>(this.url, record);
  }

  getByEmployee(
    employeeId: string,
    fromDate?: string,
    toDate?: string
  ): Observable<AttendanceListResponse> {
    let params = new HttpParams();
    if (fromDate) params = params.set('from_date', fromDate);
    if (toDate) params = params.set('to_date', toDate);
    return this.http.get<AttendanceListResponse>(`${this.url}/${employeeId}`, { params });
  }

  getSummary(employeeId: string): Observable<AttendanceSummary> {
    return this.http.get<AttendanceSummary>(`${this.url}/summary/${employeeId}`);
  }
}
