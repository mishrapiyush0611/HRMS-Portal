export interface DashboardSummary {
  today: string;
  total_employees: number;
  total_attendance_records: number;
  total_present: number;
  total_absent: number;
  today_present: number;
  today_absent: number;
  departments: { name: string; count: number }[];
}
