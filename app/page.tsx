'use client';

import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Plus, Search, Filter, Download, Upload } from 'lucide-react';
import { GlassCard } from '@/components/atoms/GlassCard';
import { GlassButton } from '@/components/atoms/GlassButton';
import { GlassInput } from '@/components/atoms/GlassInput';
import { TaskForm } from '@/components/molecules/TaskForm';
import { TaskBoard } from '@/components/organisms/TaskBoard';
import { useTasks } from '@/hooks/useTasks';
import { useTaskFilters } from '@/hooks/useTaskFilters';
import { taskStorage } from '@/lib/storage';
import type { Task, TaskStatus } from '@/types';

export default function HomePage() {
  const {
    tasks,
    loading,
    error,
    createTask,
    updateTask,
    deleteTask,
    exportTasks,
    importTasks,
    updateLocalTask,
  } = useTasks();

  const { filteredTasks, setSearchQuery, clearAllFilters, hasActiveFilters } =
    useTaskFilters(tasks);

  const [showTaskForm, setShowTaskForm] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | undefined>();
  const [dragDropError, setDragDropError] = useState<string | null>(null);

  // Status columns for stats display
  const statusColumns: { status: TaskStatus; title: string }[] = [
    { status: 'thing_to_do', title: 'To Do' },
    { status: 'working', title: 'Working' },
    { status: 'wait', title: 'Wait' },
    { status: 'done', title: 'Done' },
    { status: 'resources', title: 'Resources' },
    { status: 'shortcut', title: 'Shortcut' },
  ];

  // Group tasks by status for stats
  const tasksByStatus = filteredTasks.reduce(
    (acc, task) => {
      if (!acc[task.status]) {
        acc[task.status] = [];
      }
      acc[task.status].push(task);
      return acc;
    },
    {} as Record<TaskStatus, Task[]>
  );

  const handleCreateTask = async (payload: any) => {
    try {
      await createTask(payload);
      setShowTaskForm(false);
    } catch (err) {
      console.error('Failed to create task:', err);
    }
  };

  const handleUpdateTask = async (payload: any) => {
    try {
      if (editingTask) {
        await updateTask({ id: editingTask.id, ...payload });
        setEditingTask(undefined);
        setShowTaskForm(false);
      }
    } catch (err) {
      console.error('Failed to update task:', err);
    }
  };

  const handleDeleteTask = async (id: string) => {
    try {
      await deleteTask(id);
    } catch (err) {
      console.error('Failed to delete task:', err);
    }
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setShowTaskForm(true);
  };

  // Optimistic update for drag and drop - updates UI first, then syncs to storage
  const handleTaskStatusChange = useCallback(
    async (taskId: string, newStatus: TaskStatus) => {
      // Find the current task to get the previous status for potential rollback
      const currentTask = tasks.find(task => task.id === taskId);
      if (!currentTask) {
        console.error('Task not found for status update');
        return;
      }

      const previousStatus = currentTask.status;

      // Step 1: Update UI immediately (optimistic update)
      updateLocalTask(taskId, { status: newStatus });

      // Step 2: Update storage in the background
      try {
        await taskStorage.updateTask({ id: taskId, status: newStatus });
      } catch (err) {
        // Step 3: If storage update fails, revert the UI change
        console.error('Failed to update task status in storage:', err);
        updateLocalTask(taskId, { status: previousStatus });

        // Show error message (you could also use a toast notification)
        setDragDropError('Failed to update task status. Please try again.');

        // Clear error after a few seconds
        setTimeout(() => setDragDropError(null), 3000);
      }
    },
    [tasks, updateLocalTask]
  );

  const handleExportTasks = async () => {
    try {
      const data = await exportTasks();
      const blob = new Blob([data], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `liquidglass-tasks-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Failed to export tasks:', err);
    }
  };

  const handleImportTasks = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const text = await file.text();
      await importTasks(text);
      event.target.value = ''; // Reset file input
    } catch (err) {
      console.error('Failed to import tasks:', err);
    }
  };

  return (
    <div className="min-h-screen-safe space-y-6 p-4">
      {/* Header */}
      <motion.header
        className="space-y-4 text-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="space-y-2">
          <h1 className="text-4xl font-bold text-text text-shadow md:text-6xl">
            <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
              Mimo
            </span>
          </h1>
          <p className="text-lg text-text-muted">
            Lightweight local storage board
          </p>
        </div>
      </motion.header>

      {/* Controls */}
      <motion.div
        className="container-glass space-y-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          {/* Search and filters */}
          <div className="flex w-full max-w-md flex-1 gap-2">
            <GlassInput
              placeholder="Search tasks..."
              leftIcon={<Search className="h-4 w-4" />}
              onChange={e => setSearchQuery(e.target.value)}
              className="flex-1"
            />
            <GlassButton
              variant="ghost"
              size="md"
              onClick={clearAllFilters}
              disabled={!hasActiveFilters}
              title="Clear filters"
            >
              <Filter className="h-4 w-4" />
            </GlassButton>
          </div>

          {/* Action buttons */}
          <div className="flex gap-2">
            <input
              type="file"
              accept=".json"
              onChange={handleImportTasks}
              className="hidden"
              id="import-tasks"
            />
            <GlassButton
              variant="ghost"
              size="md"
              onClick={() => document.getElementById('import-tasks')?.click()}
              title="Import tasks"
            >
              <Upload className="h-4 w-4" />
            </GlassButton>

            <GlassButton
              variant="ghost"
              size="md"
              onClick={handleExportTasks}
              title="Export tasks"
            >
              <Download className="h-4 w-4" />
            </GlassButton>

            <GlassButton
              variant="primary"
              size="md"
              onClick={() => setShowTaskForm(true)}
              leftIcon={<Plus className="h-4 w-4" />}
            >
              New Task
            </GlassButton>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 text-center md:grid-cols-6">
          {statusColumns.map(({ status, title }) => (
            <div key={status} className="space-y-1">
              <div className="text-2xl font-bold text-text">
                {tasksByStatus[status]?.length || 0}
              </div>
              <div className="text-sm text-text-muted">{title}</div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Task Board with Drag & Drop */}
      <TaskBoard
        tasks={filteredTasks}
        onTaskEdit={handleEditTask}
        onTaskDelete={handleDeleteTask}
        onTaskStatusChange={handleTaskStatusChange}
      />

      {/* Loading state */}
      {loading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/50 backdrop-blur-sm">
          <GlassCard className="p-6 text-center">
            <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            <p className="text-text">Loading tasks...</p>
          </GlassCard>
        </div>
      )}

      {/* Error state */}
      {(error || dragDropError) && (
        <motion.div
          className="fixed bottom-4 right-4 z-50"
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <GlassCard className="max-w-md border-red-400/30 bg-red-500/20 p-4">
            <p className="font-medium text-red-400">
              Error: {dragDropError || error}
            </p>
          </GlassCard>
        </motion.div>
      )}

      {/* Task form modal */}
      {showTaskForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/50 p-4 backdrop-blur-sm">
          <TaskForm
            task={editingTask}
            onSubmit={editingTask ? handleUpdateTask : handleCreateTask}
            onCancel={() => {
              setShowTaskForm(false);
              setEditingTask(undefined);
            }}
            isLoading={loading}
            className="w-full max-w-2xl"
          />
        </div>
      )}
    </div>
  );
}
