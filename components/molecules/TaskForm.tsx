'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { Save, X, Calendar, Clock, Tag } from 'lucide-react';
import { GlassCard } from '@/components/atoms/GlassCard';
import { GlassInput } from '@/components/atoms/GlassInput';
import { GlassSelect } from '@/components/atoms/GlassSelect';
import { GlassButton } from '@/components/atoms/GlassButton';
import { cn } from '@/utils/cn';
import type { Task, TaskStatus, CreateTaskPayload } from '@/types';

// Form validation schema
const taskSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title is too long'),
  description: z.string().max(1000, 'Description is too long').optional(),
  status: z.enum([
    'thing_to_do',
    'working',
    'wait',
    'done',
    'resources',
    'shortcut',
  ]),
  priority: z.enum(['low', 'medium', 'high']).optional(),
  tags: z.string().optional(),
  dueDate: z.string().optional(),
  estimatedTime: z.string().optional(),
});

type TaskFormData = z.infer<typeof taskSchema>;

interface TaskFormProps {
  task?: Task | undefined;
  onSubmit: (data: CreateTaskPayload) => void;
  onCancel: () => void;
  isLoading?: boolean;
  className?: string;
}

const statusOptions = [
  { value: 'thing_to_do', label: 'Thing to Do' },
  { value: 'working', label: 'Working' },
  { value: 'wait', label: 'Wait' },
  { value: 'done', label: 'Done' },
  { value: 'resources', label: 'Resources' },
  { value: 'shortcut', label: 'Shortcut' },
];

const priorityOptions = [
  { value: 'low', label: 'Low Priority' },
  { value: 'medium', label: 'Medium Priority' },
  { value: 'high', label: 'High Priority' },
];

export function TaskForm({
  task,
  onSubmit,
  onCancel,
  isLoading = false,
  className,
}: TaskFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<TaskFormData>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      title: task?.title || '',
      description: task?.description || '',
      status: task?.status || 'thing_to_do',
      priority: task?.priority || undefined,
      tags: task?.tags?.join(', ') || '',
      dueDate: task?.dueDate
        ? new Date(task.dueDate).toISOString().split('T')[0]
        : '',
      estimatedTime: task?.estimatedTime?.toString() || '',
    },
    mode: 'onChange',
  });

  const handleFormSubmit = (data: TaskFormData) => {
    const payload: CreateTaskPayload = {
      title: data.title,
      description: data.description || '',
      status: data.status as TaskStatus,
      ...(data.priority && {
        priority: data.priority as 'low' | 'medium' | 'high',
      }),
      ...(data.tags && {
        tags: data.tags
          .split(',')
          .map(tag => tag.trim())
          .filter(Boolean),
      }),
      ...(data.dueDate && { dueDate: data.dueDate }),
      ...(data.estimatedTime && {
        estimatedTime: parseInt(data.estimatedTime, 10),
      }),
    };

    onSubmit(payload);
  };

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.2 }}
    >
      <GlassCard className="mx-auto w-full max-w-2xl">
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-text">
              {task ? 'Edit Task' : 'Create New Task'}
            </h2>
            <GlassButton
              type="button"
              variant="ghost"
              size="sm"
              onClick={onCancel}
              className="p-2"
              aria-label="Close form"
            >
              <X className="h-4 w-4" />
            </GlassButton>
          </div>

          {/* Form fields */}
          <div className="grid gap-4">
            {/* Title */}
            <GlassInput
              label="Title"
              placeholder="Enter task title..."
              error={errors.title?.message}
              {...register('title')}
            />

            {/* Description */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-text">
                Description
              </label>
              <textarea
                placeholder="Enter task description..."
                rows={3}
                className={cn(
                  'w-full rounded-default border border-glassBorder bg-glass backdrop-blur-glass',
                  'resize-vertical px-4 py-3 text-text placeholder-text-muted',
                  'transition-all duration-200 ease-out',
                  'focus:ring-primary/50 focus:border-primary/50 focus:outline-none focus:ring-2',
                  'hover:border-glassBorder/60 hover:bg-glass-medium',
                  'text-shadow',
                  errors.description &&
                    'border-red-400 focus:border-red-400 focus:ring-red-400/50'
                )}
                {...register('description')}
              />
              {errors.description && (
                <p className="text-sm text-red-400">
                  {errors.description.message}
                </p>
              )}
            </div>

            {/* Status and Priority Row */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <GlassSelect
                label="Status"
                options={statusOptions}
                placeholder="Select status"
                error={errors.status?.message}
                {...register('status')}
              />

              <GlassSelect
                label="Priority"
                options={priorityOptions}
                placeholder="Select priority (optional)"
                error={errors.priority?.message}
                {...register('priority')}
              />
            </div>

            {/* Tags */}
            <GlassInput
              label="Tags"
              placeholder="tag1, tag2, tag3..."
              hint="Separate tags with commas"
              leftIcon={<Tag className="h-4 w-4" />}
              error={errors.tags?.message}
              {...register('tags')}
            />

            {/* Due Date and Estimated Time Row */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <GlassInput
                type="date"
                label="Due Date"
                leftIcon={<Calendar className="h-4 w-4" />}
                error={errors.dueDate?.message}
                {...register('dueDate')}
              />

              <GlassInput
                type="number"
                label="Estimated Time (minutes)"
                placeholder="60"
                min="1"
                leftIcon={<Clock className="h-4 w-4" />}
                error={errors.estimatedTime?.message}
                {...register('estimatedTime')}
              />
            </div>
          </div>

          {/* Form actions */}
          <div className="flex items-center justify-end gap-3 border-t border-glassBorder/30 pt-4">
            <GlassButton
              type="button"
              variant="ghost"
              onClick={onCancel}
              disabled={isLoading}
            >
              Cancel
            </GlassButton>
            <GlassButton
              type="submit"
              variant="primary"
              isLoading={isLoading}
              disabled={!isValid || isLoading}
              leftIcon={<Save className="h-4 w-4" />}
            >
              {task ? 'Update Task' : 'Create Task'}
            </GlassButton>
          </div>
        </form>
      </GlassCard>
    </motion.div>
  );
}
