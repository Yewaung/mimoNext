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
        'transition-all duration-200',
        isDragging && 'rotate-2 scale-95 opacity-50',
        !isDragging && 'cursor-grab hover:scale-[1.02] active:cursor-grabbing',
        className
      )}
    >
      <TaskCard
        task={task}
        onEdit={onEdit}
        onDelete={onDelete}
        className={cn(
          'transform transition-all duration-200',
          isDragging && 'drag-preview'
        )}
      />
    </div>
  );
}
