import { ButtonHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'outline' | 'ghost';
  loading?: boolean;
}

export default function Button({
  variant = 'primary',
  loading,
  children,
  className,
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      disabled={disabled || loading}
      className={cn(
        'flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-all duration-200',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        variant === 'primary' &&
          'bg-green-500 text-gray-950 hover:bg-green-400 active:scale-95',
        variant === 'outline' &&
          'border border-gray-600 text-gray-300 hover:bg-gray-800 hover:border-gray-500',
        variant === 'ghost' &&
          'text-gray-400 hover:text-white hover:bg-gray-800',
        className
      )}
      {...props}
    >
      {loading && <Loader2 size={16} className="animate-spin" />}
      {children}
    </button>
  );
}
