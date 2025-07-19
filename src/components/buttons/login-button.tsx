import { ReactNode } from 'react';
import CustomButton from '../common/custom-button';

interface LoginButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  icon: ReactNode;
}

export default function LoginButton({ children, className, icon, ...props }: LoginButtonProps) {
  return (
    <CustomButton
      className={`relative flex justify-center items-center w-80 h-10 rounded-lg font-semibold ${className}`}
      {...props}
    >
      <span className="absolute left-2">{icon}</span>
      <span>{children}</span>
    </CustomButton>
  );
}
