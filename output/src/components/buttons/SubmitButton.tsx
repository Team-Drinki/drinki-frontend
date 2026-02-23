import CustomButton from '../common/CustomButton';
import { useFormContext } from 'react-hook-form';

interface LoginButtonProps {
  children: string;
}

export default function SubmitButton({ children }: LoginButtonProps) {
  const { formState } = useFormContext();
  const active = formState.isValid || !formState.errors;

  return (
    <CustomButton
      className={`text-button ${active ? 'bg-white border-2 border-sub-1 text-sub-1 hover:bg-white' : 'bg-grey-200 text-grey-500 hover:bg-grey-200'} disabled:opacity-100`}
      disabled={!active}
    >
      <span>{children}</span>
    </CustomButton>
  );
}
