import { v4 as uuidv4 } from 'uuid';
import type { Task } from '@/types';

// Sample tasks to populate the app with initial data
export const defaultTasks: Task[] = [
  {
    id: uuidv4(),
    title: 'Setup development environment',
    description: 'Configure IDE, install dependencies, and set up version control for the new project.',
    status: 'done',
    priority: 'high',
    tags: ['development', 'setup', 'productivity'],
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days ago
    updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days ago
    estimatedTime: 120,
    actualTime: 90,
  },
  {
    id: uuidv4(),
    title: 'Design task management interface',
    description: 'Create wireframes and mockups for the glassmorphism-styled task manager interface.',
    status: 'working',
    priority: 'high',
    tags: ['design', 'ui', 'glassmorphism'],
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
    updatedAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(), // 1 hour ago
    dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days from now
    estimatedTime: 240,
  },
  {
    id: uuidv4(),
    title: 'Implement drag and drop functionality',
    description: 'Add drag and drop support for moving tasks between different status columns.',
    status: 'thing_to_do',
    priority: 'medium',
    tags: ['feature', 'interaction', 'ux'],
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
    updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
    dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days from now
    estimatedTime: 180,
  },
  {
    id: uuidv4(),
    title: 'Add dark mode toggle',
    description: 'Implement system preference detection and manual dark/light mode switching.',
    status: 'thing_to_do',
    priority: 'low',
    tags: ['feature', 'accessibility', 'ui'],
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
    estimatedTime: 60,
  },
  {
    id: uuidv4(),
    title: 'Review code with team',
    description: 'Schedule and conduct code review session for the new task management features.',
    status: 'wait',
    priority: 'medium',
    tags: ['review', 'collaboration', 'quality'],
    createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(), // 6 hours ago
    updatedAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(), // 6 hours ago
    dueDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day from now
    estimatedTime: 90,
  },
  {
    id: uuidv4(),
    title: 'TaskManager API Documentation',
    description: 'Comprehensive API documentation for the task management endpoints with examples.',
    status: 'resources',
    priority: 'low',
    tags: ['documentation', 'api', 'reference'],
    createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(), // 4 days ago
    updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
    estimatedTime: 120,
  },
  {
    id: uuidv4(),
    title: 'Quick task creation shortcut',
    description: 'Implement Ctrl+N keyboard shortcut for quick task creation modal.',
    status: 'shortcut',
    priority: 'medium',
    tags: ['shortcut', 'productivity', 'ux'],
    createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(), // 5 hours ago
    updatedAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(), // 5 hours ago
    estimatedTime: 30,
  },
  {
    id: uuidv4(),
    title: 'Optimize performance for large task lists',
    description: 'Implement virtualization and lazy loading for handling 1000+ tasks efficiently.',
    status: 'thing_to_do',
    priority: 'high',
    tags: ['performance', 'optimization', 'scalability'],
    createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(), // 1 hour ago
    updatedAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(), // 1 hour ago
    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 1 week from now
    estimatedTime: 300,
  },
  {
    id: uuidv4(),
    title: 'Add keyboard shortcuts guide',
    description: 'Create an accessible help modal showing all available keyboard shortcuts.',
    status: 'shortcut',
    priority: 'low',
    tags: ['accessibility', 'help', 'shortcuts'],
    createdAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(), // 30 minutes ago
    updatedAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(), // 30 minutes ago
    estimatedTime: 45,
  },
  {
    id: uuidv4(),
    title: 'Deploy to production',
    description: 'Configure CI/CD pipeline and deploy the application to production environment.',
    status: 'wait',
    priority: 'high',
    tags: ['deployment', 'devops', 'production'],
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
    updatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
    dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days from now
    estimatedTime: 150,
  },
];

// Function to populate storage with default tasks if empty
export async function initializeDefaultTasks(): Promise<boolean> {
  try {
    if (typeof window === 'undefined') return false;
    
    // Check if we already have tasks in storage
    const existingData = localStorage.getItem('liquidglass_tasks');
    if (existingData && JSON.parse(existingData).length > 0) {
      return false; // Already have data, don't initialize
    }
    
    // Store default tasks
    localStorage.setItem('liquidglass_tasks', JSON.stringify(defaultTasks));
    return true;
  } catch (error) {
    console.warn('Failed to initialize default tasks:', error);
    return false;
  }
}

