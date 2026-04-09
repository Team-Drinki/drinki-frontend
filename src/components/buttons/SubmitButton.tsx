import CustomButton from '../common/CustomButton';
import { useFormContext } from 'react-hook-form';

interface LoginButtonProps {
  children: string;
  disabled?: boolean;
}

export default function SubmitButton({ children, disabled = false }: LoginButtonProps) {
  const { formState } = useFormContext();
  const active = formState.isValid || !formState.errors;
  const isDisabled = disabled || !active;

  return (
    <CustomButton
      className={`text-button ${!isDisabled ? 'bg-white border-2 border-sub-1 text-sub-1 hover:bg-white' : 'bg-grey-200 text-grey-500 hover:bg-grey-200'} disabled:opacity-100`}
      disabled={isDisabled}
    >
      <span>{children}</span>
    </CustomButton>
  );
}
