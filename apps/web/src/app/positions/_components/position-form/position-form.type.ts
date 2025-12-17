export interface PositionFormValues {
  title: string;
}

export interface PositionFormProps {
  defaultValue: PositionFormValues;
  isLoading?: boolean;
  isEdit: boolean;
  onSubmit: (values: PositionFormValues) => void;
}
