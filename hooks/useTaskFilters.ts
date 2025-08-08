'use client';

import { useState, useMemo, useCallback } from 'react';
import type { Task, TaskStatus, TaskFilters, TaskSortOptions } from '@/types';

interface UseTaskFiltersReturn {
  // Filter state
  filters: TaskFilters;
  sortOptions: TaskSortOptions;
  
  // Filtered and sorted results
  filteredTasks: Task[];
  
  // Filter actions
  setStatusFilter: (statuses: TaskStatus[]) => void;
  setPriorityFilter: (priorities: ('low' | 'medium' | 'high')[]) => void;
  setTagFilter: (tags: string[]) => void;
  setDateRangeFilter: (start: string, end: string) => void;
  setSearchQuery: (query: string) => void;
  
  // Sort actions
  setSortField: (field: keyof Task) => void;
  setSortDirection: (direction: 'asc' | 'desc') => void;
  toggleSortDirection: () => void;
  
  // Utility actions
  clearAllFilters: () => void;
  clearFilter: (filterType: keyof TaskFilters) => void;
  
  // Helper properties
  hasActiveFilters: boolean;
  resultCount: number;
  availableTags: string[];
}

export function useTaskFilters(tasks: Task[]): UseTaskFiltersReturn {
  const [filters, setFilters] = useState<TaskFilters>({
    status: undefined,
    priority: undefined,
    tags: undefined,
    dateRange: undefined,
    searchQuery: undefined,
  });

  const [sortOptions, setSortOptions] = useState<TaskSortOptions>({
    field: 'updatedAt',
    direction: 'desc',
  });

  // Filter functions
  const setStatusFilter = useCallback((statuses: TaskStatus[]) => {
    setFilters(prev => ({
      ...prev,
      status: statuses.length > 0 ? statuses : undefined,
    }));
  }, []);

  const setPriorityFilter = useCallback((priorities: ('low' | 'medium' | 'high')[]) => {
    setFilters(prev => ({
      ...prev,
      priority: priorities.length > 0 ? priorities : undefined,
    }));
  }, []);

  const setTagFilter = useCallback((tags: string[]) => {
    setFilters(prev => ({
      ...prev,
      tags: tags.length > 0 ? tags : undefined,
    }));
  }, []);

  const setDateRangeFilter = useCallback((start: string, end: string) => {
    setFilters(prev => ({
      ...prev,
      dateRange: { start, end },
    }));
  }, []);

  const setSearchQuery = useCallback((query: string) => {
    setFilters(prev => ({
      ...prev,
      searchQuery: query.trim() || undefined,
    }));
  }, []);

  // Sort functions
  const setSortField = useCallback((field: keyof Task) => {
    setSortOptions(prev => ({ ...prev, field }));
  }, []);

  const setSortDirection = useCallback((direction: 'asc' | 'desc') => {
    setSortOptions(prev => ({ ...prev, direction }));
  }, []);

  const toggleSortDirection = useCallback(() => {
    setSortOptions(prev => ({
      ...prev,
      direction: prev.direction === 'asc' ? 'desc' : 'asc',
    }));
  }, []);

  // Clear functions
  const clearAllFilters = useCallback(() => {
    setFilters({
      status: undefined,
      priority: undefined,
      tags: undefined,
      dateRange: undefined,
      searchQuery: undefined,
    });
  }, []);

  const clearFilter = useCallback((filterType: keyof TaskFilters) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: undefined,
    }));
  }, []);

  // Compute available tags from all tasks
  const availableTags = useMemo(() => {
    const tagSet = new Set<string>();
    tasks.forEach(task => {
      task.tags?.forEach(tag => tagSet.add(tag));
    });
    return Array.from(tagSet).sort();
  }, [tasks]);

  // Apply filters and sorting
  const filteredTasks = useMemo(() => {
    let result = [...tasks];

    // Apply status filter
    if (filters.status && filters.status.length > 0) {
      result = result.filter(task => filters.status!.includes(task.status));
    }

    // Apply priority filter
    if (filters.priority && filters.priority.length > 0) {
      result = result.filter(task => 
        task.priority && filters.priority!.includes(task.priority)
      );
    }

    // Apply tags filter
    if (filters.tags && filters.tags.length > 0) {
      result = result.filter(task => 
        task.tags && task.tags.some(tag => filters.tags!.includes(tag))
      );
    }

    // Apply date range filter
    if (filters.dateRange) {
      const { start, end } = filters.dateRange;
      result = result.filter(task => {
        const taskDate = new Date(task.createdAt);
        const startDate = new Date(start);
        const endDate = new Date(end);
        return taskDate >= startDate && taskDate <= endDate;
      });
    }

    // Apply search query filter
    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      result = result.filter(task =>
        task.title.toLowerCase().includes(query) ||
        task.description.toLowerCase().includes(query) ||
        (task.tags && task.tags.some(tag => tag.toLowerCase().includes(query)))
      );
    }

    // Apply sorting
    result.sort((a, b) => {
      const { field, direction } = sortOptions;
      let aValue: any = a[field];
      let bValue: any = b[field];

      // Handle undefined values
      if (aValue === undefined && bValue === undefined) return 0;
      if (aValue === undefined) return direction === 'asc' ? 1 : -1;
      if (bValue === undefined) return direction === 'asc' ? -1 : 1;

      // Handle different data types
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }

      if (typeof aValue === 'boolean' && typeof bValue === 'boolean') {
        aValue = aValue ? 1 : 0;
        bValue = bValue ? 1 : 0;
      }

      // Compare values
      let comparison = 0;
      if (aValue < bValue) comparison = -1;
      if (aValue > bValue) comparison = 1;

      return direction === 'asc' ? comparison : -comparison;
    });

    return result;
  }, [tasks, filters, sortOptions]);

  // Check if any filters are active
  const hasActiveFilters = useMemo(() => {
    return !!(
      filters.status ||
      filters.priority ||
      filters.tags ||
      filters.dateRange ||
      filters.searchQuery
    );
  }, [filters]);

  return {
    // State
    filters,
    sortOptions,
    filteredTasks,
    
    // Filter actions
    setStatusFilter,
    setPriorityFilter,
    setTagFilter,
    setDateRangeFilter,
    setSearchQuery,
    
    // Sort actions
    setSortField,
    setSortDirection,
    toggleSortDirection,
    
    // Utility actions
    clearAllFilters,
    clearFilter,
    
    // Helper properties
    hasActiveFilters,
    resultCount: filteredTasks.length,
    availableTags,
  };
}

