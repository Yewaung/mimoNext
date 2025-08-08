'use client';

import { forwardRef, type SelectHTMLAttributes, type ReactNode } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/utils/cn';

interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

interface GlassSelectProps
  extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'children'> {
  label?: string;
  error?: string | undefined;
  hint?: string;
  leftIcon?: ReactNode;
  options: SelectOption[];
  placeholder?: string;
}

const GlassSelect = forwardRef<HTMLSelectElement, GlassSelectProps>(
  (
    {
      label,
      error,
      hint,
      leftIcon,
      options,
      placeholder = 'Select an option',
      className,
      disabled,
      ...props
    },
    ref
  ) => {
    const selectStyles = cn(
      // Base styles
      'w-full bg-glass backdrop-blur-glass rounded-default border border-glassBorder',
      'px-4 py-3 text-text',
      'transition-all duration-200 ease-out appearance-none',
      'focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50',
      'hover:bg-glass-medium hover:border-glassBorder/60',
      'text-shadow cursor-pointer',

      // Icon padding adjustment
      {
        'pl-10': leftIcon,
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

        {/* Select container */}
        <div className="relative">
          {/* Left icon */}
          {leftIcon && (
            <div className="absolute left-3 top-1/2 z-10 -translate-y-1/2 text-text-muted">
              {leftIcon}
            </div>
          )}

          {/* Select field */}
          <select
            ref={ref}
            className={selectStyles}
            disabled={disabled}
            {...props}
          >
            {/* Placeholder option */}
            {placeholder && (
              <option value="" disabled className="text-text-muted">
                {placeholder}
              </option>
            )}

            {/* Options */}
            {options.map(option => (
              <option
                key={option.value}
                value={option.value}
                disabled={option.disabled}
                className={cn('bg-background text-text', {
                  'text-text-muted': option.disabled,
                })}
              >
                {option.label}
              </option>
            ))}
          </select>

          {/* Dropdown arrow */}
          <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-text-muted">
            <ChevronDown className="h-4 w-4" />
          </div>

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

GlassSelect.displayName = 'GlassSelect';

export { GlassSelect, type GlassSelectProps, type SelectOption };
