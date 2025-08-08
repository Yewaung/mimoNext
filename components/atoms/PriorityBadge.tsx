'use client';

import { motion } from 'framer-motion';
import { ArrowUp, ArrowDown, Minus } from 'lucide-react';
import { cn } from '@/utils/cn';

interface PriorityBadgeProps {
  priority: 'low' | 'medium' | 'high';
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
  className?: string;
}

const priorityConfig: Record<'low' | 'medium' | 'high', {
  label: string;
  color: string;
  bgColor: string;
  borderColor: string;
  icon: typeof ArrowUp;
}> = {
  low: {
    label: 'Low',
    color: 'text-gray-400',
    bgColor: 'bg-gray-500/20',
    borderColor: 'border-gray-400/30',
    icon: ArrowDown,
  },
  medium: {
    label: 'Medium',
    color: 'text-yellow-400',
    bgColor: 'bg-yellow-500/20',
    borderColor: 'border-yellow-400/30',
    icon: Minus,
  },
  high: {
    label: 'High',
    color: 'text-red-400',
    bgColor: 'bg-red-500/20',
    borderColor: 'border-red-400/30',
    icon: ArrowUp,
  },
};

export function PriorityBadge({ 
  priority, 
  size = 'md', 
  showIcon = true,
  className 
}: PriorityBadgeProps) {
  const config = priorityConfig[priority];
  const IconComponent = config.icon;

  const badgeStyles = cn(
    // Base styles
    'inline-flex items-center gap-1.5 rounded-button border backdrop-blur-sm',
    'font-medium transition-all duration-200',
    'text-shadow',
    
    // Size variants
    {
      'px-2 py-1 text-xs': size === 'sm',
      'px-3 py-1.5 text-sm': size === 'md',
      'px-4 py-2 text-base': size === 'lg',
    },
    
    // Priority-specific styles
    config.color,
    config.bgColor,
    config.borderColor,
    
    className
  );

  const iconSize = {
    sm: 'h-3 w-3',
    md: 'h-4 w-4',
    lg: 'h-5 w-5',
  }[size];

  return (
    <motion.span
      className={badgeStyles}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.2 }}
      whileHover={{ scale: 1.05 }}
    >
      {showIcon && (
        <IconComponent className={cn(iconSize, 'flex-shrink-0')} />
      )}
      <span className="truncate">{config.label}</span>
    </motion.span>
  );
}

// Export priority configuration for use in other components
export { priorityConfig };
