'use client';

import { forwardRef, type InputHTMLAttributes, type ReactNode } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/utils/cn';

interface GlassInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string | undefined;
  hint?: string;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  isLoading?: boolean;
}

const GlassInput = forwardRef<HTMLInputElement, GlassInputProps>(
  (
    {
      label,
      error,
      hint,
      leftIcon,
      rightIcon,
      isLoading = false,
      className,
      disabled,
      ...props
    },
    ref
  ) => {
    const inputStyles = cn(
      // Base styles
      'w-full bg-glass backdrop-blur-glass rounded-default border border-glassBorder',
      'px-4 py-3 text-text placeholder-text-muted',
      'transition-all duration-200 ease-out',
      'focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50',
      'hover:bg-glass-medium hover:border-glassBorder/60',
      'text-shadow',

      // Icon padding adjustments
      {
        'pl-10': leftIcon,
        'pr-10': rightIcon || isLoading,
      },

      // Error state
      {
        'border-red-400 focus:ring-red-400/50 focus:border-red-400':
          error && !disabled,
      },

      // Disabled state
      {
        'opacity-50 cursor-not-allowed bg-glass-dark': disabled,
      },

      className
    );

    return (
      <motion.div
        className="space-y-2"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
      >
        {/* Label */}
        {label && (
          <label className="block text-sm font-medium text-text">{label}</label>
        )}

        {/* Input container */}
        <div className="relative">
          {/* Left icon */}
          {leftIcon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted">
              {leftIcon}
            </div>
          )}

          {/* Input field */}
          <input
            ref={ref}
            className={inputStyles}
            disabled={disabled}
            {...props}
          />

          {/* Right icon or loading spinner */}
          {(rightIcon || isLoading) && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted">
              {isLoading ? (
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
              ) : (
                rightIcon
              )}
            </div>
          )}

          {/* Glass effect overlay */}
          <div className="pointer-events-none absolute inset-0 rounded-default bg-gradient-to-br from-white/10 via-transparent to-transparent opacity-30" />
        </div>

        {/* Error message */}
        {error && (
          <motion.p
            className="text-sm text-red-400"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
          >
            {error}
          </motion.p>
        )}

        {/* Hint message */}
        {hint && !error && <p className="text-sm text-text-muted">{hint}</p>}
      </motion.div>
    );
  }
);

GlassInput.displayName = 'GlassInput';

export { GlassInput, type GlassInputProps };
