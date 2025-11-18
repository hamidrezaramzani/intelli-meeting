export const SPEAKERS_COLUMNS = [
  {
    key: "speaker",
    label: "Speaker",
  },
  {
    key: "employee",
    label: "Employee",
    render: (row: any) => (row.employee ? row.employee.fullName : "-"),
  },
  {
    key: "text",
    label: "Transcript",
    render: (row: any) => row.text ?? "-",
  },
];
