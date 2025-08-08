'use client';

import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/utils/cn';

interface GlassCardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'elevated' | 'bordered';
  hover?: boolean;
  padding?: 'sm' | 'md' | 'lg' | 'none';
  children: ReactNode;
}

const GlassCard = forwardRef<HTMLDivElement, GlassCardProps>(
  (
    {
      variant = 'default',
      hover = false,
      padding = 'md',
      className,
      children,
      ...props
    },
    ref
  ) => {
    const baseStyles = cn(
      // Base glass styles
      'glass rounded-card border-glassBorder relative overflow-hidden',
      'transition-all duration-200 ease-out',

      // Padding variants
      {
        'p-0': padding === 'none',
        'p-3': padding === 'sm',
        'p-4': padding === 'md',
        'p-6': padding === 'lg',
      },

      // Variant styles
      {
        'shadow-glass': variant === 'default',
        'shadow-glass-hover': variant === 'elevated',
        'border-2 border-glassBorder': variant === 'bordered',
      },

      // Hover effects
      {
        'hover:shadow-glass-hover hover:scale-[1.02] cursor-pointer': hover,
      },

      className
    );

    const cardContent = (
      <div ref={ref} className={baseStyles} {...props}>
        {/* Background overlay for additional depth */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-glass-light to-glass-dark opacity-50" />

        {/* Content wrapper */}
        <div className="relative z-10">{children}</div>

        {/* Subtle border highlight */}
        <div className="pointer-events-none absolute inset-0 rounded-card bg-gradient-to-br from-white/20 via-transparent to-transparent opacity-40" />
      </div>
    );

    if (hover) {
      return (
        <motion.div
          whileHover={{
            scale: 1.02,
            transition: { duration: 0.2 },
          }}
          whileTap={{
            scale: 0.98,
            transition: { duration: 0.1 },
          }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {cardContent}
        </motion.div>
      );
    }

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {cardContent}
      </motion.div>
    );
  }
);

GlassCard.displayName = 'GlassCard';

export { GlassCard, type GlassCardProps };
