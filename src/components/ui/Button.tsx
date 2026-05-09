import { ButtonHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';


interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'system';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', isLoading, disabled, children, ...props }, ref) => {
    const variants = {
      primary: 'border border-white bg-transparent text-white hover:bg-white hover:text-black tracking-[0.2em] font-black uppercase transition-all duration-300 system-text-glow shadow-[inset_0_0_10px_rgba(56,189,248,0.2)] hover:shadow-none',
      secondary: 'bg-panel text-white hover:bg-panel/80 border border-white/10',
      outline: 'border-2 border-white text-white hover:bg-white hover:text-black transition-all duration-300 font-bold uppercase tracking-widest system-text-glow',
      ghost: 'hover:bg-white/10 text-white',
      danger: 'bg-red-600 text-white hover:bg-red-700',
      system: 'border border-primary bg-primary/5 text-primary hover:bg-primary/20 font-bold uppercase tracking-[0.2em] system-text-glow-strong transition-all duration-500',
    };

    const sizes = {
      sm: 'px-4 py-2 text-xs',
      md: 'px-8 py-3 text-sm',
      lg: 'px-12 py-4 text-lg font-black uppercase tracking-[0.3em]',
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(
          'inline-flex items-center cursor-pointer justify-center transition-all duration-300 active:scale-95 disabled:opacity-50 disabled:pointer-events-none relative overflow-hidden group',
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      >
        <span className="relative z-10 flex items-center gap-2">
          {isLoading ? (
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-current/20 border-t-current" />
          ) : null}
          {children}
        </span>

        {/* Interaction Glow Layer */}
        <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/5 transition-colors duration-300 pointer-events-none" />
      </button>
    );
  }
);


Button.displayName = 'Button';

export { Button };
