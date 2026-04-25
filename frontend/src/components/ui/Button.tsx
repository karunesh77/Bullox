import type { ButtonHTMLAttributes } from 'react';
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
          'bg-blue-600 text-white hover:bg-blue-700 active:scale-95',
        variant === 'outline' &&
          'border border-gray-300 text-gray-700 hover:bg-gray-100 hover:border-gray-400',
        variant === 'ghost' &&
          'text-gray-600 hover:text-gray-900 hover:bg-gray-100',
        className
      )}
      {...props}
    >
      {loading && <Loader2 size={16} className="animate-spin" />}
      {children}
    </button>
  );
}
