import { SelectInput } from "@intelli-meeting/shared-ui";

export const getSpeakerColumns = (
  options: { value: string; label: string }[],
  getSelectInputValue: (id: string) => string | undefined,
  onChange: (employeeId: string, speakerProfileId: string) => void,
) => [
  {
    key: "speaker",
    label: "Speaker",
  },
  {
    key: "employee",
    label: "Employee",
    render: (row: any) => (
      <SelectInput
        value={getSelectInputValue(row.id)}
        onChange={(e) => onChange(e.target.value, row.id)}
        options={options}
      />
    ),
  },
  {
    key: "transcript",
    label: "Transcript",
  },
];
