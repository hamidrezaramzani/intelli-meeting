interface DashboardTopEmployee {
  fullName: string;
  role: string;
  totalMinutesAttended: number;
}

export interface DashboardTopEmpoyeesProps {
  employees: DashboardTopEmployee[];
}
