export interface AttendanceRecord {
  employee_id: string;
  date: string;
  status: 'Present' | 'Absent';
  marked_at: string;
}

export interface AttendanceCreate {
  employee_id: string;
  date: string;
  status: 'Present' | 'Absent';
}

export interface AttendanceListResponse {
  records: AttendanceRecord[];
  total: number;
}

export interface AttendanceSummary {
  employee_id: string;
  full_name: string;
  total_present: number;
  total_absent: number;
  total_days: number;
}
