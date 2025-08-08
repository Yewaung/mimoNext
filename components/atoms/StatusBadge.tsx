'use client';

import { motion } from 'framer-motion';
import { 
  Circle, 
  Play, 
  Clock, 
  CheckCircle2, 
  BookOpen, 
  Zap 
} from 'lucide-react';
import { cn } from '@/utils/cn';
import type { TaskStatus } from '@/types';

interface StatusBadgeProps {
  status: TaskStatus;
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
  className?: string;
}

const statusConfig: Record<TaskStatus, {
  label: string;
  color: string;
  bgColor: string;
  borderColor: string;
  icon: typeof Circle;
}> = {
  thing_to_do: {
    label: 'To Do',
    color: 'text-blue-400',
    bgColor: 'bg-blue-500/20',
    borderColor: 'border-blue-400/30',
    icon: Circle,
  },
  working: {
    label: 'Working',
    color: 'text-primary',
    bgColor: 'bg-primary/20',
    borderColor: 'border-primary/30',
    icon: Play,
  },
  wait: {
    label: 'Waiting',
    color: 'text-yellow-400',
    bgColor: 'bg-yellow-500/20',
    borderColor: 'border-yellow-400/30',
    icon: Clock,
  },
  done: {
    label: 'Done',
    color: 'text-green-400',
    bgColor: 'bg-green-500/20',
    borderColor: 'border-green-400/30',
    icon: CheckCircle2,
  },
  resources: {
    label: 'Resources',
    color: 'text-purple-400',
    bgColor: 'bg-purple-500/20',
    borderColor: 'border-purple-400/30',
    icon: BookOpen,
  },
  shortcut: {
    label: 'Shortcut',
    color: 'text-accent',
    bgColor: 'bg-accent/20',
    borderColor: 'border-accent/30',
    icon: Zap,
  },
};

export function StatusBadge({ 
  status, 
  size = 'md', 
  showIcon = true,
  className 
}: StatusBadgeProps) {
  const config = statusConfig[status];
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
    
    // Status-specific styles
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

// Export status configuration for use in other components
export { statusConfig };

