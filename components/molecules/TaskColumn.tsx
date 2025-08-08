'use client';

import { useDroppable } from '@dnd-kit/core';
import { motion } from 'framer-motion';
import { GlassCard } from '@/components/atoms/GlassCard';
import { DraggableTaskCard } from '@/components/molecules/DraggableTaskCard';
import { cn } from '@/utils/cn';
import type { Task, TaskStatus } from '@/types';

interface TaskColumnProps {
  status: TaskStatus;
  title: string;
  color: string;
  tasks: Task[];
  onTaskEdit: (task: Task) => void;
  onTaskDelete: (id: string) => void;
  animationDelay?: number;
}

export function TaskColumn({
  status,
  title,
  color,
  tasks,
  onTaskEdit,
  onTaskDelete,
  animationDelay = 0,
}: TaskColumnProps) {
  const { isOver, setNodeRef } = useDroppable({
    id: status,
  });

  return (
    <motion.div
      className="space-y-4"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, delay: animationDelay }}
    >
      {/* Column header */}
      <GlassCard className={cn('text-center', color)}>
        <h2 className="text-lg font-semibold text-text">{title}</h2>
        <div className="mt-1 text-sm text-text-muted">
          {tasks.length} task{tasks.length !== 1 ? 's' : ''}
        </div>
      </GlassCard>

      {/* Drop zone */}
      <div
        ref={setNodeRef}
        className={cn(
          'min-h-[200px] space-y-3 rounded-card border-2 border-dashed p-2 transition-all duration-200',
          isOver ? 'drop-zone-active' : 'drop-zone-idle'
        )}
      >
        {/* Tasks */}
        {tasks.length > 0 ? (
          tasks.map(task => (
            <DraggableTaskCard
              key={task.id}
              task={task}
              onEdit={onTaskEdit}
              onDelete={onTaskDelete}
            />
          ))
        ) : (
          <div className="py-8 text-center text-text-muted">
            <div className="mb-2 text-4xl opacity-50">📋</div>
            <p>No {title.toLowerCase()} tasks</p>
            {isOver && (
              <motion.p
                className="text-primary mt-2 text-sm"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                Drop task here
              </motion.p>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
}
