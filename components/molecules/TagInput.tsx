'use client';

import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Tag } from 'lucide-react';
import { GlassButton } from '@/components/atoms/GlassButton';
import { cn } from '@/utils/cn';

interface TagInputProps {
  value: string[];
  onChange: (tags: string[]) => void;
  placeholder?: string;
  className?: string;
  label?: string;
  error?: string;
  maxTags?: number;
}

export function TagInput({
  value = [],
  onChange,
  placeholder = 'Type and press Enter to add tags...',
  className,
  label,
  error,
  maxTags = 10,
}: TagInputProps) {
  const [inputValue, setInputValue] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const addTag = (tag: string) => {
    const trimmedTag = tag.trim();
    if (
      trimmedTag &&
      !value.includes(trimmedTag) &&
      value.length < maxTags
    ) {
      onChange([...value, trimmedTag]);
      setInputValue('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    onChange(value.filter(tag => tag !== tagToRemove));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTag(inputValue);
    } else if (e.key === 'Backspace' && !inputValue && value.length > 0) {
      e.preventDefault();
      const lastTag = value[value.length - 1];
      if (lastTag) {
        removeTag(lastTag);
      }
    } else if (e.key === ',') {
      e.preventDefault();
      addTag(inputValue);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleBlur = () => {
    setIsFocused(false);
    if (inputValue.trim()) {
      addTag(inputValue);
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedText = e.clipboardData.getData('text');
    const tags = pastedText
      .split(/[,\n]/)
      .map(tag => tag.trim())
      .filter(tag => tag && !value.includes(tag));
    
    const newTags = [...value, ...tags].slice(0, maxTags);
    onChange(newTags);
  };

  return (
    <motion.div
      className={cn('space-y-2', className)}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
    >
      {/* Label */}
      {label && (
        <label className="block text-sm font-medium text-text">{label}</label>
      )}

      {/* Tag Input Container */}
      <div
        className={cn(
          'min-h-[44px] w-full rounded-default border border-glassBorder bg-glass backdrop-blur-glass px-3 py-2',
          'transition-all duration-200 ease-out',
          'focus-within:ring-2 focus-within:ring-primary/50 focus-within:border-primary/50',
          'hover:bg-glass-medium hover:border-glassBorder/60',
          isFocused && 'ring-2 ring-primary/50 border-primary/50',
          error && 'border-red-400 focus-within:ring-red-400/50 focus-within:border-red-400'
        )}
        onClick={() => inputRef.current?.focus()}
      >
        <div className="flex flex-wrap items-center gap-2">
          {/* Existing Tags */}
          <AnimatePresence>
            {value.map((tag) => (
              <motion.div
                key={tag}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.2 }}
                className="inline-flex items-center gap-1 rounded-button border border-glassBorder/50 bg-glass-light px-2 py-1 text-xs font-medium text-text"
              >
                <Tag className="h-3 w-3 text-text-muted" />
                <span>{tag}</span>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeTag(tag);
                  }}
                  className="ml-1 rounded-full p-0.5 hover:bg-glass-medium transition-colors"
                >
                  <X className="h-3 w-3 text-text-muted hover:text-text" />
                </button>
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Input Field */}
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            onFocus={() => setIsFocused(true)}
            onBlur={handleBlur}
            onPaste={handlePaste}
            placeholder={value.length >= maxTags ? 'Max tags reached' : placeholder}
            disabled={value.length >= maxTags}
            className={cn(
              'flex-1 min-w-[120px] bg-transparent text-text placeholder-text-muted',
              'outline-none border-none',
              'disabled:opacity-50 disabled:cursor-not-allowed'
            )}
          />
        </div>
      </div>

      {/* Error message */}
      {error && (
        <motion.p
          className="text-sm text-red-400"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {error}
        </motion.p>
      )}

      {/* Help text */}
      <div className="flex items-center justify-between text-xs text-text-muted">
        <span>
          Press Enter to add tag • Press Backspace to remove last tag • Use comma to separate multiple tags
        </span>
        <span>
          {value.length}/{maxTags}
        </span>
      </div>

      {/* Clear all button */}
      {value.length > 0 && (
        <GlassButton
          variant="ghost"
          size="sm"
          onClick={() => onChange([])}
          className="text-xs"
        >
          Clear all tags
        </GlassButton>
      )}
    </motion.div>
  );
}
