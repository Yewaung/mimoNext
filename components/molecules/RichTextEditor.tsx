'use client';

import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Bold, 
  Italic, 
  List, 
  ListOrdered, 
  Link,
  AlignLeft,
  AlignCenter,
  AlignRight
} from 'lucide-react';
import { GlassButton } from '@/components/atoms/GlassButton';
import { cn } from '@/utils/cn';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  label?: string;
  error?: string;
}

interface FormatButton {
  icon: React.ReactNode;
  command: string;
  value?: string;
  title: string;
  isActive?: boolean;
}

export function RichTextEditor({
  value,
  onChange,
  placeholder = 'Type your description here...',
  className,
  label,
  error,
}: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const [isFocused, setIsFocused] = useState(false);
  const [showLinkInput, setShowLinkInput] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');

  const formatButtons: FormatButton[] = [
    {
      icon: <Bold className="h-4 w-4" />,
      command: 'bold',
      title: 'Bold (Ctrl+B)',
    },
    {
      icon: <Italic className="h-4 w-4" />,
      command: 'italic',
      title: 'Italic (Ctrl+I)',
    },
    {
      icon: <List className="h-4 w-4" />,
      command: 'insertUnorderedList',
      title: 'Bullet List',
    },
    {
      icon: <ListOrdered className="h-4 w-4" />,
      command: 'insertOrderedList',
      title: 'Numbered List',
    },
    {
      icon: <AlignLeft className="h-4 w-4" />,
      command: 'justifyLeft',
      title: 'Align Left',
    },
    {
      icon: <AlignCenter className="h-4 w-4" />,
      command: 'justifyCenter',
      title: 'Align Center',
    },
    {
      icon: <AlignRight className="h-4 w-4" />,
      command: 'justifyRight',
      title: 'Align Right',
    },
    {
      icon: <Link className="h-4 w-4" />,
      command: 'createLink',
      title: 'Insert Link',
    },
  ];

  useEffect(() => {
    if (editorRef.current) {
      editorRef.current.innerHTML = value;
    }
  }, [value]);

  const handleFormat = (command: string, value?: string) => {
    if (command === 'createLink') {
      setShowLinkInput(true);
      return;
    }

    document.execCommand(command, false, value);
    updateValue();
  };

  const insertLink = () => {
    if (linkUrl.trim()) {
      document.execCommand('createLink', false, linkUrl);
      updateValue();
    }
    setShowLinkInput(false);
    setLinkUrl('');
  };

  const updateValue = () => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && e.shiftKey) {
      e.preventDefault();
      document.execCommand('insertLineBreak', false);
      updateValue();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const text = e.clipboardData.getData('text/plain');
    document.execCommand('insertText', false, text);
    updateValue();
  };

  const isFormatActive = (command: string): boolean => {
    return document.queryCommandState(command);
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

      {/* Formatting Toolbar */}
      <div className="flex flex-wrap items-center gap-1 p-2 rounded-default border border-glassBorder bg-glass backdrop-blur-glass">
        {formatButtons.map((button, index) => (
          <GlassButton
            key={index}
            variant="ghost"
            size="sm"
            onClick={() => handleFormat(button.command, button.value)}
            title={button.title}
            className={cn(
              'p-1.5 h-8 w-8',
              isFormatActive(button.command) && 'bg-primary/20 text-primary'
            )}
          >
            {button.icon}
          </GlassButton>
        ))}
      </div>

      {/* Link Input Modal */}
      {showLinkInput && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-background/50 backdrop-blur-sm p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="w-full max-w-md space-y-4 rounded-card border border-glassBorder bg-glass backdrop-blur-glass p-4">
            <h3 className="text-lg font-semibold text-text">Insert Link</h3>
            <input
              type="url"
              placeholder="Enter URL..."
              value={linkUrl}
              onChange={(e) => setLinkUrl(e.target.value)}
              className="w-full rounded-default border border-glassBorder bg-glass backdrop-blur-glass px-3 py-2 text-text placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50"
              onKeyDown={(e) => e.key === 'Enter' && insertLink()}
              autoFocus
            />
            <div className="flex gap-2">
              <GlassButton
                variant="primary"
                size="sm"
                onClick={insertLink}
                className="flex-1"
              >
                Insert
              </GlassButton>
              <GlassButton
                variant="ghost"
                size="sm"
                onClick={() => setShowLinkInput(false)}
                className="flex-1"
              >
                Cancel
              </GlassButton>
            </div>
          </div>
        </motion.div>
      )}

      {/* Editor */}
      <div
        ref={editorRef}
        contentEditable
        className={cn(
          'min-h-[120px] w-full rounded-default border border-glassBorder bg-glass backdrop-blur-glass px-4 py-3 text-text placeholder-text-muted resize-vertical',
          'transition-all duration-200 ease-out',
          'focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50',
          'hover:bg-glass-medium hover:border-glassBorder/60',
          'text-shadow',
          isFocused && 'ring-2 ring-primary/50 border-primary/50',
          error && 'border-red-400 focus:ring-red-400/50 focus:border-red-400'
        )}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        onInput={updateValue}
        onKeyDown={handleKeyDown}
        onPaste={handlePaste}
        data-placeholder={placeholder}
        suppressContentEditableWarning
      />

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
      <p className="text-xs text-text-muted">
        Use Shift+Enter for line breaks. Formatting toolbar available above.
      </p>
    </motion.div>
  );
}
