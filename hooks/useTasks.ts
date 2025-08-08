'use client';

import { useState, useEffect, useCallback } from 'react';
import { taskStorage } from '@/lib/storage';
import { initializeDefaultTasks } from '@/data/defaultTasks';
import type { Task, CreateTaskPayload, UpdateTaskPayload } from '@/types';

interface UseTasksOptions {
  autoRefetch?: boolean;
  initialLoad?: boolean;
}

export function useTasks(options: UseTasksOptions = {}) {
  const { autoRefetch = true, initialLoad = true } = options;
  
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load tasks from storage
  const loadTasks = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Try to initialize default tasks if storage is empty
      await initializeDefaultTasks();
      
      const loadedTasks = await taskStorage.getTasks();
      setTasks(loadedTasks);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load tasks';
      setError(errorMessage);
      console.error('Error loading tasks:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Create a new task
  const createTask = useCallback(async (payload: CreateTaskPayload): Promise<Task> => {
    try {
      setLoading(true);
      setError(null);
      const newTask = await taskStorage.createTask(payload);
      
      if (autoRefetch) {
        setTasks(prevTasks => [newTask, ...prevTasks]);
      }
      
      return newTask;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create task';
      setError(errorMessage);
      console.error('Error creating task:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [autoRefetch]);

  // Update an existing task
  const updateTask = useCallback(async (payload: UpdateTaskPayload): Promise<Task> => {
    try {
      setLoading(true);
      setError(null);
      const updatedTask = await taskStorage.updateTask(payload);
      
      if (autoRefetch) {
        setTasks(prevTasks => 
          prevTasks.map(task => 
            task.id === updatedTask.id ? updatedTask : task
          )
        );
      }
      
      return updatedTask;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update task';
      setError(errorMessage);
      console.error('Error updating task:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [autoRefetch]);

  // Delete a task
  const deleteTask = useCallback(async (id: string): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);
      const success = await taskStorage.deleteTask(id);
      
      if (success && autoRefetch) {
        setTasks(prevTasks => prevTasks.filter(task => task.id !== id));
      }
      
      return success;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete task';
      setError(errorMessage);
      console.error('Error deleting task:', err);
      return false;
    } finally {
      setLoading(false);
    }
  }, [autoRefetch]);

  // Get a specific task
  const getTask = useCallback(async (id: string): Promise<Task | undefined> => {
    try {
      return await taskStorage.getTask(id);
    } catch (err) {
      console.error('Error getting task:', err);
      return undefined;
    }
  }, []);

  // Clear all tasks
  const clearAllTasks = useCallback(async (): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);
      const success = await taskStorage.clearTasks();
      
      if (success && autoRefetch) {
        setTasks([]);
      }
      
      return success;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to clear tasks';
      setError(errorMessage);
      console.error('Error clearing tasks:', err);
      return false;
    } finally {
      setLoading(false);
    }
  }, [autoRefetch]);

  // Export tasks
  const exportTasks = useCallback(async (): Promise<string> => {
    try {
      return await taskStorage.exportTasks();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to export tasks';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  }, []);

  // Import tasks
  const importTasks = useCallback(async (data: string): Promise<Task[]> => {
    try {
      setLoading(true);
      setError(null);
      const importedTasks = await taskStorage.importTasks(data);
      
      if (autoRefetch) {
        setTasks(importedTasks);
      }
      
      return importedTasks;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to import tasks';
      setError(errorMessage);
      console.error('Error importing tasks:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [autoRefetch]);

  // Manual refetch
  const refetch = useCallback(async () => {
    await loadTasks();
  }, [loadTasks]);

  // Update local task state (for optimistic updates)
  const updateLocalTask = useCallback((taskId: string, updates: Partial<Task>) => {
    setTasks(prevTasks => 
      prevTasks.map(task => 
        task.id === taskId 
          ? { ...task, ...updates, updatedAt: new Date().toISOString() }
          : task
      )
    );
  }, []);

  // Load tasks on mount if enabled
  useEffect(() => {
    if (initialLoad) {
      loadTasks();
    }
  }, [initialLoad, loadTasks]);

  // Return hook interface
  return {
    // State
    tasks,
    loading,
    error,
    
    // Actions
    createTask,
    updateTask,
    deleteTask,
    getTask,
    clearAllTasks,
    exportTasks,
    importTasks,
    refetch,
    updateLocalTask,
    
    // Utils
    hasError: !!error,
    isEmpty: tasks.length === 0,
    count: tasks.length,
  };
}
