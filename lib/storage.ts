import { openDB, type DBSchema, type IDBPDatabase } from 'idb';
import { v4 as uuidv4 } from 'uuid';
import type {
  Task,
  CreateTaskPayload,
  UpdateTaskPayload,
  TaskStorage,
} from '@/types';

// IndexedDB Schema
interface TaskDB extends DBSchema {
  tasks: {
    key: string;
    value: Task;
    indexes: {
      'by-status': string;
      'by-created': string;
      'by-updated': string;
    };
  };
}

// Database constants
const DB_NAME = 'LiquidGlassTaskManager';
const DB_VERSION = 1;
const STORAGE_KEY = 'liquidglass_tasks';

// Initialize IndexedDB
let dbPromise: Promise<IDBPDatabase<TaskDB>> | null = null;

const initDB = (): Promise<IDBPDatabase<TaskDB>> => {
  if (!dbPromise) {
    dbPromise = openDB<TaskDB>(DB_NAME, DB_VERSION, {
      upgrade(db) {
        // Create tasks store
        const taskStore = db.createObjectStore('tasks', {
          keyPath: 'id',
        });

        // Create indexes for efficient querying
        taskStore.createIndex('by-status', 'status');
        taskStore.createIndex('by-created', 'createdAt');
        taskStore.createIndex('by-updated', 'updatedAt');
      },
    });
  }
  return dbPromise;
};

// LocalStorage fallback functions
class LocalStorageTaskManager implements TaskStorage {
  private getStoredTasks(): Task[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.warn('Failed to parse tasks from localStorage:', error);
      return [];
    }
  }

  private setStoredTasks(tasks: Task[]): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    } catch (error) {
      console.error('Failed to save tasks to localStorage:', error);
      throw new Error('Storage quota exceeded or localStorage unavailable');
    }
  }

  async getTasks(): Promise<Task[]> {
    return this.getStoredTasks();
  }

  async getTask(id: string): Promise<Task | undefined> {
    const tasks = this.getStoredTasks();
    return tasks.find(task => task.id === id);
  }

  async createTask(payload: CreateTaskPayload): Promise<Task> {
    const now = new Date().toISOString();
    const newTask: Task = {
      id: uuidv4(),
      ...payload,
      createdAt: now,
      updatedAt: now,
    };

    const tasks = this.getStoredTasks();
    tasks.push(newTask);
    this.setStoredTasks(tasks);

    return newTask;
  }

  async updateTask(payload: UpdateTaskPayload): Promise<Task> {
    const tasks = this.getStoredTasks();
    const index = tasks.findIndex(task => task.id === payload.id);

    if (index === -1) {
      throw new Error(`Task with id ${payload.id} not found`);
    }

    const existingTask = tasks[index]!; // We know it exists because index !== -1
    const updatedTask: Task = {
      id: existingTask.id,
      title: payload.title ?? existingTask.title,
      description: payload.description ?? existingTask.description,
      status: payload.status ?? existingTask.status,
      createdAt: existingTask.createdAt,
      updatedAt: new Date().toISOString(),
      ...(payload.priority !== undefined
        ? { priority: payload.priority }
        : existingTask.priority !== undefined
          ? { priority: existingTask.priority }
          : {}),
      ...(payload.tags !== undefined
        ? { tags: payload.tags }
        : existingTask.tags !== undefined
          ? { tags: existingTask.tags }
          : {}),
      ...(payload.dueDate !== undefined
        ? { dueDate: payload.dueDate }
        : existingTask.dueDate !== undefined
          ? { dueDate: existingTask.dueDate }
          : {}),
      ...(payload.estimatedTime !== undefined
        ? { estimatedTime: payload.estimatedTime }
        : existingTask.estimatedTime !== undefined
          ? { estimatedTime: existingTask.estimatedTime }
          : {}),
      ...(existingTask.actualTime !== undefined
        ? { actualTime: existingTask.actualTime }
        : {}),
    };

    tasks[index] = updatedTask;
    this.setStoredTasks(tasks);

    return updatedTask;
  }

  async deleteTask(id: string): Promise<boolean> {
    const tasks = this.getStoredTasks();
    const filteredTasks = tasks.filter(task => task.id !== id);

    if (filteredTasks.length === tasks.length) {
      return false; // Task not found
    }

    this.setStoredTasks(filteredTasks);
    return true;
  }

  async clearTasks(): Promise<boolean> {
    try {
      localStorage.removeItem(STORAGE_KEY);
      return true;
    } catch (error) {
      console.error('Failed to clear tasks:', error);
      return false;
    }
  }

  async exportTasks(): Promise<string> {
    const tasks = this.getStoredTasks();
    return JSON.stringify(
      {
        version: '1.0',
        exportDate: new Date().toISOString(),
        tasks,
      },
      null,
      2
    );
  }

  async importTasks(data: string): Promise<Task[]> {
    try {
      const parsed = JSON.parse(data);
      if (!parsed.tasks || !Array.isArray(parsed.tasks)) {
        throw new Error('Invalid export format');
      }

      // Validate task structure
      const validTasks = parsed.tasks.filter(
        (task: any) =>
          task.id &&
          task.title &&
          task.status &&
          task.createdAt &&
          task.updatedAt
      );

      this.setStoredTasks(validTasks);
      return validTasks;
    } catch (error) {
      console.error('Failed to import tasks:', error);
      throw new Error('Invalid import data format');
    }
  }
}

// IndexedDB implementation
class IndexedDBTaskManager implements TaskStorage {
  async getTasks(): Promise<Task[]> {
    try {
      const db = await initDB();
      return await db.getAll('tasks');
    } catch (error) {
      console.error('IndexedDB getTasks failed:', error);
      return [];
    }
  }

  async getTask(id: string): Promise<Task | undefined> {
    try {
      const db = await initDB();
      return await db.get('tasks', id);
    } catch (error) {
      console.error('IndexedDB getTask failed:', error);
      return undefined;
    }
  }

  async createTask(payload: CreateTaskPayload): Promise<Task> {
    const now = new Date().toISOString();
    const newTask: Task = {
      id: uuidv4(),
      ...payload,
      createdAt: now,
      updatedAt: now,
    };

    try {
      const db = await initDB();
      await db.add('tasks', newTask);
      return newTask;
    } catch (error) {
      console.error('IndexedDB createTask failed:', error);
      throw new Error('Failed to create task');
    }
  }

  async updateTask(payload: UpdateTaskPayload): Promise<Task> {
    try {
      const db = await initDB();
      const existingTask = await db.get('tasks', payload.id);

      if (!existingTask) {
        throw new Error(`Task with id ${payload.id} not found`);
      }

      const updatedTask: Task = {
        id: existingTask.id,
        title: payload.title ?? existingTask.title,
        description: payload.description ?? existingTask.description,
        status: payload.status ?? existingTask.status,
        createdAt: existingTask.createdAt,
        updatedAt: new Date().toISOString(),
        ...(payload.priority !== undefined
          ? { priority: payload.priority }
          : existingTask.priority !== undefined
            ? { priority: existingTask.priority }
            : {}),
        ...(payload.tags !== undefined
          ? { tags: payload.tags }
          : existingTask.tags !== undefined
            ? { tags: existingTask.tags }
            : {}),
        ...(payload.dueDate !== undefined
          ? { dueDate: payload.dueDate }
          : existingTask.dueDate !== undefined
            ? { dueDate: existingTask.dueDate }
            : {}),
        ...(payload.estimatedTime !== undefined
          ? { estimatedTime: payload.estimatedTime }
          : existingTask.estimatedTime !== undefined
            ? { estimatedTime: existingTask.estimatedTime }
            : {}),
        ...(existingTask.actualTime !== undefined
          ? { actualTime: existingTask.actualTime }
          : {}),
      };

      await db.put('tasks', updatedTask);
      return updatedTask;
    } catch (error) {
      console.error('IndexedDB updateTask failed:', error);
      throw error;
    }
  }

  async deleteTask(id: string): Promise<boolean> {
    try {
      const db = await initDB();
      await db.delete('tasks', id);
      return true;
    } catch (error) {
      console.error('IndexedDB deleteTask failed:', error);
      return false;
    }
  }

  async clearTasks(): Promise<boolean> {
    try {
      const db = await initDB();
      await db.clear('tasks');
      return true;
    } catch (error) {
      console.error('IndexedDB clearTasks failed:', error);
      return false;
    }
  }

  async exportTasks(): Promise<string> {
    const tasks = await this.getTasks();
    return JSON.stringify(
      {
        version: '1.0',
        exportDate: new Date().toISOString(),
        tasks,
      },
      null,
      2
    );
  }

  async importTasks(data: string): Promise<Task[]> {
    try {
      const parsed = JSON.parse(data);
      if (!parsed.tasks || !Array.isArray(parsed.tasks)) {
        throw new Error('Invalid export format');
      }

      const db = await initDB();
      const tx = db.transaction('tasks', 'readwrite');

      // Clear existing tasks
      await tx.store.clear();

      // Add imported tasks
      for (const task of parsed.tasks) {
        if (
          task.id &&
          task.title &&
          task.status &&
          task.createdAt &&
          task.updatedAt
        ) {
          await tx.store.add(task);
        }
      }

      await tx.done;
      return parsed.tasks;
    } catch (error) {
      console.error('IndexedDB importTasks failed:', error);
      throw new Error('Failed to import tasks');
    }
  }
}

// Storage detection and fallback logic
const isIndexedDBSupported = (): boolean => {
  try {
    return typeof window !== 'undefined' && 'indexedDB' in window;
  } catch {
    return false;
  }
};

const isLocalStorageSupported = (): boolean => {
  try {
    if (typeof window === 'undefined') return false;
    const test = '__storage_test__';
    localStorage.setItem(test, test);
    localStorage.removeItem(test);
    return true;
  } catch {
    return false;
  }
};

// Main storage instance with automatic fallback
export const createTaskStorage = (): TaskStorage => {
  if (isIndexedDBSupported()) {
    console.log('Using IndexedDB for task storage');
    return new IndexedDBTaskManager();
  } else if (isLocalStorageSupported()) {
    console.log('Falling back to localStorage for task storage');
    return new LocalStorageTaskManager();
  } else {
    console.warn('No storage available, using memory-only storage');
    // Return a memory-only implementation as last resort
    const memoryTasks: Task[] = [];
    return {
      async getTasks() {
        return [...memoryTasks];
      },
      async getTask(id: string) {
        return memoryTasks.find(t => t.id === id);
      },
      async createTask(payload: CreateTaskPayload) {
        const task: Task = {
          id: uuidv4(),
          ...payload,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        memoryTasks.push(task);
        return task;
      },
      async updateTask(payload: UpdateTaskPayload) {
        const index = memoryTasks.findIndex(t => t.id === payload.id);
        if (index === -1) throw new Error('Task not found');
        const existingTask = memoryTasks[index]!; // We know it exists because index !== -1
        const updated: Task = {
          id: existingTask.id,
          title: payload.title ?? existingTask.title,
          description: payload.description ?? existingTask.description,
          status: payload.status ?? existingTask.status,
          createdAt: existingTask.createdAt,
          updatedAt: new Date().toISOString(),
          ...(payload.priority !== undefined
            ? { priority: payload.priority }
            : existingTask.priority !== undefined
              ? { priority: existingTask.priority }
              : {}),
          ...(payload.tags !== undefined
            ? { tags: payload.tags }
            : existingTask.tags !== undefined
              ? { tags: existingTask.tags }
              : {}),
          ...(payload.dueDate !== undefined
            ? { dueDate: payload.dueDate }
            : existingTask.dueDate !== undefined
              ? { dueDate: existingTask.dueDate }
              : {}),
          ...(payload.estimatedTime !== undefined
            ? { estimatedTime: payload.estimatedTime }
            : existingTask.estimatedTime !== undefined
              ? { estimatedTime: existingTask.estimatedTime }
              : {}),
          ...(existingTask.actualTime !== undefined
            ? { actualTime: existingTask.actualTime }
            : {}),
        };
        memoryTasks[index] = updated;
        return updated;
      },
      async deleteTask(id: string) {
        const index = memoryTasks.findIndex(t => t.id === id);
        if (index === -1) return false;
        memoryTasks.splice(index, 1);
        return true;
      },
      async clearTasks() {
        memoryTasks.length = 0;
        return true;
      },
      async exportTasks() {
        return JSON.stringify({ tasks: memoryTasks });
      },
      async importTasks(data: string) {
        const parsed = JSON.parse(data);
        memoryTasks.splice(0, memoryTasks.length, ...(parsed.tasks || []));
        return memoryTasks;
      },
    };
  }
};

// Default storage instance
export const taskStorage = createTaskStorage();
