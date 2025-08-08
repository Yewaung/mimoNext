'use client';

import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { TaskCard } from '@/components/molecules/TaskCard';
import { cn } from '@/utils/cn';
import type { Task } from '@/types';

interface DraggableTaskCardProps {
  task: Task;
  onEdit?: (task: Task) => void;
  onDelete?: (id: string) => void;
  className?: string;
}

export function DraggableTaskCard({
  task,
  onEdit,
  onDelete,
  className,
}: DraggableTaskCardProps) {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id: task.id,
    });

  const style = {
    transform: CSS.Translate.toString(transform),
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className={cn(
        isDragging && 'opacity-50',
        !isDragging && 'cursor-grab active:cursor-grabbing',
        className
      )}
    >
      <TaskCard
        task={task}
        onEdit={onEdit}
        onDelete={onDelete}
        className={isDragging ? 'ring-2 ring-primary/50' : ''}
      />
    </div>
  );
}
