export interface EmployeeFormValues {
  fullName: string;
  position: string;
}

export interface EmployeeFormProps {
  onSubmit: (values: EmployeeFormValues) => void;
  isLoading?: boolean;
  isEdit: boolean;
  defaultValue: EmployeeFormValues;
}
