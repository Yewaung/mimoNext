// Task status types matching the specified categories
export type TaskStatus =
  | 'thing_to_do'
  | 'working'
  | 'wait'
  | 'done'
  | 'resources'
  | 'shortcut';

// Main task interface matching the data structure example
export interface Task {
  id: string; // UUID
  title: string;
  description: string;
  status: TaskStatus;
  createdAt: string; // ISO8601
  updatedAt: string; // ISO8601
  priority?: 'low' | 'medium' | 'high';
  tags?: string[];
  dueDate?: string; // ISO8601
  estimatedTime?: number; // in minutes
  actualTime?: number; // in minutes
}

// Task creation payload (without auto-generated fields)
export interface CreateTaskPayload {
  title: string;
  description: string;
  status: TaskStatus;
  priority?: 'low' | 'medium' | 'high';
  tags?: string[];
  dueDate?: string;
  estimatedTime?: number;
}

// Task update payload (partial update)
export interface UpdateTaskPayload extends Partial<CreateTaskPayload> {
  id: string;
}

// Task filter and sort options
export interface TaskFilters {
  status?: TaskStatus[] | undefined;
  priority?: ('low' | 'medium' | 'high')[] | undefined;
  tags?: string[] | undefined;
  dateRange?:
    | {
        start: string;
        end: string;
      }
    | undefined;
  searchQuery?: string | undefined;
}

export interface TaskSortOptions {
  field: keyof Task;
  direction: 'asc' | 'desc';
}

// Storage interface for data persistence
export interface TaskStorage {
  getTasks: () => Promise<Task[]>;
  getTask: (id: string) => Promise<Task | undefined>;
  createTask: (task: CreateTaskPayload) => Promise<Task>;
  updateTask: (task: UpdateTaskPayload) => Promise<Task>;
  deleteTask: (id: string) => Promise<boolean>;
  clearTasks: () => Promise<boolean>;
  exportTasks: () => Promise<string>;
  importTasks: (data: string) => Promise<Task[]>;
}

// Theme and UI types
export interface ThemeColors {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  glass: string;
  glassBorder: string;
  text: string;
}

export interface GlassmorphismStyles {
  backdropFilter: string;
  boxShadow: string;
  border: string;
  background: string;
}

// Component props types
export interface BaseComponentProps {
  className?: string;
  children?: React.ReactNode;
}

// Form types
export interface TaskFormData {
  title: string;
  description: string;
  status: TaskStatus;
  priority?: 'low' | 'medium' | 'high';
  tags: string;
  dueDate?: string;
  estimatedTime?: string;
}

// Internationalization types
export interface Language {
  code: string;
  name: string;
  flag: string;
}

export interface TranslationKeys {
  common: {
    save: string;
    cancel: string;
    delete: string;
    edit: string;
    create: string;
    search: string;
    filter: string;
    sort: string;
    loading: string;
    error: string;
    success: string;
  };
  tasks: {
    title: string;
    description: string;
    status: string;
    priority: string;
    tags: string;
    dueDate: string;
    estimatedTime: string;
    actualTime: string;
    createTask: string;
    editTask: string;
    deleteTask: string;
    noTasks: string;
  };
  status: {
    thing_to_do: string;
    working: string;
    wait: string;
    done: string;
    resources: string;
    shortcut: string;
  };
  priority: {
    low: string;
    medium: string;
    high: string;
  };
}

// Hook return types
export interface UseTasksReturn {
  tasks: Task[];
  loading: boolean;
  error: string | null;
  createTask: (task: CreateTaskPayload) => Promise<Task>;
  updateTask: (task: UpdateTaskPayload) => Promise<Task>;
  deleteTask: (id: string) => Promise<boolean>;
  refetch: () => Promise<void>;
}

export interface UseTaskFiltersReturn {
  filters: TaskFilters;
  filteredTasks: Task[];
  updateFilters: (filters: Partial<TaskFilters>) => void;
  clearFilters: () => void;
}

// Error types
export interface AppError {
  code: string;
  message: string;
  details?: Record<string, any>;
}

// Analytics and performance types
export interface TaskAnalytics {
  totalTasks: number;
  tasksByStatus: Record<TaskStatus, number>;
  completionRate: number;
  averageTimeToComplete: number;
  productivityScore: number;
}

// Export all types for easy importing
export type {
  // Re-export all types for convenience
  TaskStatus as Status,
  Task as TaskType,
  CreateTaskPayload as CreateTask,
  UpdateTaskPayload as UpdateTask,
};
