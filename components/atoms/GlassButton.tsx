'use client';

import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/utils/cn';

interface GlassButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'accent' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  children: ReactNode;
}

const GlassButton = forwardRef<HTMLButtonElement, GlassButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      isLoading = false,
      leftIcon,
      rightIcon,
      className,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const baseStyles = cn(
      // Base styles
      'relative inline-flex items-center justify-center gap-2 font-medium transition-all duration-200',
      'glass glass-hover rounded-button border-glassBorder',
      'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-transparent',
      'disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none',
      'text-shadow active:scale-95 hover:shadow-neon-hover',

      // Size variants
      {
        'px-3 py-1.5 text-sm': size === 'sm',
        'px-4 py-2 text-base': size === 'md',
        'px-6 py-3 text-lg': size === 'lg',
      },

      // Variant styles
      {
        'text-text focus:ring-primary/50 hover:shadow-neon':
          variant === 'primary',
        'text-text focus:ring-secondary/50 hover:shadow-[0_0_30px_rgba(138,43,226,0.5)]':
          variant === 'secondary',
        'text-text focus:ring-accent/50 hover:shadow-[0_0_30px_rgba(255,215,0,0.5)]':
          variant === 'accent',
        'bg-transparent border-transparent hover:bg-glass-light focus:ring-text/20':
          variant === 'ghost',
      },

      className
    );

    return (
      <motion.button
        ref={ref}
        className={baseStyles}
        disabled={disabled || isLoading}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
        {...(props as any)}
      >
        {/* Loading spinner */}
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
          </div>
        )}

        {/* Content wrapper with opacity for loading state */}
        <div
          className={cn('flex items-center gap-2', { 'opacity-0': isLoading })}
        >
          {leftIcon && <span className="flex-shrink-0">{leftIcon}</span>}
          <span>{children}</span>
          {rightIcon && <span className="flex-shrink-0">{rightIcon}</span>}
        </div>
      </motion.button>
    );
  }
);

GlassButton.displayName = 'GlassButton';

export { GlassButton, type GlassButtonProps };
