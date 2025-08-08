'use client';

import { useState } from 'react';
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
  closestCenter,
} from '@dnd-kit/core';
import { TaskCard } from '@/components/molecules/TaskCard';
import { TaskColumn } from '@/components/molecules/TaskColumn';
import { cn } from '@/utils/cn';
import type { Task, TaskStatus } from '@/types';

interface TaskBoardProps {
  tasks: Task[];
  onTaskEdit: (task: Task) => void;
  onTaskDelete: (id: string) => void;
  onTaskStatusChange: (taskId: string, newStatus: TaskStatus) => void;
  className?: string;
}

const statusColumns: { status: TaskStatus; title: string; color: string }[] = [
  { status: 'thing_to_do', title: 'To Do', color: 'border-blue-400/30' },
  { status: 'working', title: 'Working', color: 'border-primary/30' },
  { status: 'wait', title: 'Wait', color: 'border-yellow-400/30' },
  { status: 'done', title: 'Done', color: 'border-green-400/30' },
  {
    status: 'resources',
    title: 'Resources',
    color: 'border-purple-400/30',
  },
  { status: 'shortcut', title: 'Shortcut', color: 'border-accent/30' },
];

export function TaskBoard({
  tasks,
  onTaskEdit,
  onTaskDelete,
  onTaskStatusChange,
  className,
}: TaskBoardProps) {
  const [activeTask, setActiveTask] = useState<Task | null>(null);

  // Configure sensors for drag detection
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // Require 8px of movement before starting drag
      },
    })
  );

  // Group tasks by status
  const tasksByStatus = tasks.reduce(
    (acc, task) => {
      if (!acc[task.status]) {
        acc[task.status] = [];
      }
      acc[task.status].push(task);
      return acc;
    },
    {} as Record<TaskStatus, Task[]>
  );

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const task = tasks.find(t => t.id === active.id);
    setActiveTask(task || null);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveTask(null);

    if (!over) return;

    const taskId = active.id as string;
    const newStatus = over.id as TaskStatus;

    // Find the task and check if status actually changed
    const task = tasks.find(t => t.id === taskId);
    if (task && task.status !== newStatus) {
      onTaskStatusChange(taskId, newStatus);
    }
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div
        className={cn(
          'grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6',
          className
        )}
      >
        {statusColumns.map(({ status, title, color }) => (
          <TaskColumn
            key={status}
            status={status}
            title={title}
            color={color}
            tasks={tasksByStatus[status] || []}
            onTaskEdit={onTaskEdit}
            onTaskDelete={onTaskDelete}
          />
        ))}
      </div>

      {/* Drag overlay - shows the dragged item */}
      <DragOverlay>
        {activeTask ? (
          <div className="opacity-90">
            <TaskCard
              task={activeTask}
              onEdit={onTaskEdit}
              onDelete={onTaskDelete}
            />
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
