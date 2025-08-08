'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Edit3, Trash2, Calendar, Clock, Tag } from 'lucide-react';
import { GlassCard } from '@/components/atoms/GlassCard';
import { GlassButton } from '@/components/atoms/GlassButton';
import { StatusBadge } from '@/components/atoms/StatusBadge';
import { PriorityBadge } from '@/components/atoms/PriorityBadge';
import { cn } from '@/utils/cn';
import type { Task } from '@/types';

interface TaskCardProps {
  task: Task;
  onEdit?: (task: Task) => void;
  onDelete?: (id: string) => void;
  className?: string;
}

export function TaskCard({ task, onEdit, onDelete, className }: TaskCardProps) {
  const [showActions, setShowActions] = useState(false);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const formatTime = (minutes?: number) => {
    if (!minutes) return null;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins > 0 ? `${mins}m` : ''}`.trim();
    }
    return `${mins}m`;
  };

  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date();

  return (
    <motion.div
      className={cn('group', className)}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -4 }}
    >
      <GlassCard
        hover
        className={cn(
          'relative transition-all duration-200',
          isOverdue && task.status !== 'done' && 'ring-2 ring-red-400/50'
        )}
        onMouseEnter={() => setShowActions(true)}
        onMouseLeave={() => setShowActions(false)}
      >
        {/* Header */}
        <div className="mb-3 flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <h3 className="line-clamp-2 text-lg font-semibold leading-tight text-text">
              {task.title}
            </h3>
            {task.description && (
              <div 
                className="mt-1 line-clamp-2 text-sm text-text-muted prose prose-sm max-w-none"
                dangerouslySetInnerHTML={{ __html: task.description }}
              />
            )}
          </div>

          {/* Actions menu */}
          <div className="relative">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{
                opacity: showActions ? 1 : 0,
                scale: showActions ? 1 : 0.8,
              }}
              transition={{ duration: 0.2 }}
              className="flex items-center gap-1"
            >
              {onEdit && (
                <GlassButton
                  size="sm"
                  variant="ghost"
                  onClick={() => onEdit(task)}
                  className="p-2"
                  aria-label="Edit task"
                >
                  <Edit3 className="h-4 w-4" />
                </GlassButton>
              )}
              {onDelete && (
                <GlassButton
                  size="sm"
                  variant="ghost"
                  onClick={() => onDelete(task.id)}
                  className="p-2 hover:border-red-400/30 hover:bg-red-500/20"
                  aria-label="Delete task"
                >
                  <Trash2 className="h-4 w-4" />
                </GlassButton>
              )}
            </motion.div>
          </div>
        </div>

        {/* Status and Priority */}
        <div className="mb-3 flex items-center gap-2">
          <StatusBadge status={task.status} size="sm" />
          {task.priority && (
            <PriorityBadge priority={task.priority} size="sm" />
          )}
        </div>

        {/* Tags */}
        {task.tags && task.tags.length > 0 && (
          <div className="mb-3 flex flex-wrap items-center gap-1">
            <Tag className="h-3 w-3 text-text-muted" />
            {task.tags.slice(0, 3).map(tag => (
              <span
                key={tag}
                className="inline-flex items-center rounded-button border border-glassBorder/50 bg-glass-light px-2 py-1 text-xs font-medium text-text-muted"
              >
                {tag}
              </span>
            ))}
            {task.tags.length > 3 && (
              <span className="inline-flex items-center rounded-button border border-glassBorder/50 bg-glass-light px-2 py-1 text-xs font-medium text-text-muted">
                +{task.tags.length - 3}
              </span>
            )}
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-glassBorder/30 pt-3 text-xs text-text-muted">
          <div className="flex items-center gap-3">
            {/* Due date */}
            {task.dueDate && (
              <div
                className={cn(
                  'flex items-center gap-1',
                  isOverdue && task.status !== 'done' && 'text-red-400'
                )}
              >
                <Calendar className="h-3 w-3" />
                <span>{formatDate(task.dueDate)}</span>
              </div>
            )}

            {/* Time estimate */}
            {task.estimatedTime && (
              <div className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                <span>{formatTime(task.estimatedTime)}</span>
              </div>
            )}
          </div>

          {/* Created date */}
          <span className="text-text-disabled">
            {formatDate(task.createdAt)}
          </span>
        </div>

        {/* Overdue indicator */}
        {isOverdue && task.status !== 'done' && (
          <div className="absolute right-2 top-2">
            <div className="h-2 w-2 animate-pulse rounded-full bg-red-400" />
          </div>
        )}
      </GlassCard>
    </motion.div>
  );
}
