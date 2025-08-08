'use client';

import { useState, useRef, useEffect } from 'react';
import { Bold, Italic, List, Link, Hash, X } from 'lucide-react';
import { GlassButton } from '@/components/atoms/GlassButton';
import { cn } from '@/utils/cn';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  error?: string;
}

interface Tag {
  id: string;
  text: string;
}

export function RichTextEditor({
  value,
  onChange,
  placeholder = 'Enter task description...',
  className,
  error,
}: RichTextEditorProps) {
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isList, setIsList] = useState(false);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [urlText, setUrlText] = useState('');
  const [urlLink, setUrlLink] = useState('');
  const [tags, setTags] = useState<Tag[]>([]);
  const editorRef = useRef<HTMLDivElement>(null);
  const urlInputRef = useRef<HTMLInputElement>(null);

  // Parse existing content on mount
  useEffect(() => {
    if (value) {
      parseContent(value);
    }
  }, []);

  const parseContent = (content: string) => {
    // Extract tags from content (format: #tag)
    const tagRegex = /#(\w+)/g;
    const foundTags: Tag[] = [];
    let match;
    
    while ((match = tagRegex.exec(content)) !== null) {
      if (match[1]) {
        foundTags.push({
          id: `tag-${Date.now()}-${Math.random()}`,
          text: match[1]
        });
      }
    }
    
    setTags(foundTags);
  };

  const formatText = (command: string, value?: string) => {
    document.execCommand(command, false, value);
    editorRef.current?.focus();
  };

  const handleBold = () => {
    formatText('bold');
    setIsBold(!isBold);
  };

  const handleItalic = () => {
    formatText('italic');
    setIsItalic(!isItalic);
  };

  const handleList = () => {
    formatText('insertUnorderedList');
    setIsList(!isList);
  };

  const handleUrl = () => {
    if (showUrlInput) {
      if (urlText && urlLink) {
        formatText('createLink', urlLink);
        setUrlText('');
        setUrlLink('');
      }
      setShowUrlInput(false);
    } else {
      setShowUrlInput(true);
      setTimeout(() => urlInputRef.current?.focus(), 100);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      const selection = window.getSelection();
      if (selection && selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        const text = range.toString();
        
        // Check if we're creating a tag
        if (text.startsWith('#')) {
          e.preventDefault();
          const tagText = text.substring(1);
          if (tagText.trim()) {
            const newTag: Tag = {
              id: `tag-${Date.now()}-${Math.random()}`,
              text: tagText.trim()
            };
            setTags(prev => [...prev, newTag]);
            
            // Replace the text with the tag
            range.deleteContents();
            const tagSpan = document.createElement('span');
            tagSpan.className = 'inline-flex items-center gap-1 px-2 py-1 mx-1 text-xs font-medium bg-primary/20 text-primary rounded-full';
            tagSpan.innerHTML = `#${tagText.trim()}`;
            range.insertNode(tagSpan);
            
            // Add space after tag
            const space = document.createTextNode(' ');
            range.setStartAfter(tagSpan);
            range.insertNode(space);
            range.collapse(false);
          }
        }
      }
    }
  };

  const removeTag = (tagId: string) => {
    setTags(prev => prev.filter(tag => tag.id !== tagId));
  };

  const handleInput = () => {
    if (editorRef.current) {
      const content = editorRef.current.innerHTML;
      onChange(content);
    }
  };

  return (
    <div className={cn('space-y-2', className)}>
      {/* Toolbar */}
      <div className="flex items-center gap-1 p-2 bg-glass rounded-default border border-glassBorder">
        <GlassButton
          variant="ghost"
          size="sm"
          onClick={handleBold}
          className={cn('p-1', isBold && 'bg-primary/20 text-primary')}
          title="Bold"
        >
          <Bold className="h-4 w-4" />
        </GlassButton>
        
        <GlassButton
          variant="ghost"
          size="sm"
          onClick={handleItalic}
          className={cn('p-1', isItalic && 'bg-primary/20 text-primary')}
          title="Italic"
        >
          <Italic className="h-4 w-4" />
        </GlassButton>
        
        <GlassButton
          variant="ghost"
          size="sm"
          onClick={handleList}
          className={cn('p-1', isList && 'bg-primary/20 text-primary')}
          title="Bullet List"
        >
          <List className="h-4 w-4" />
        </GlassButton>
        
        <GlassButton
          variant="ghost"
          size="sm"
          onClick={handleUrl}
          className={cn('p-1', showUrlInput && 'bg-primary/20 text-primary')}
          title="Insert Link"
        >
          <Link className="h-4 w-4" />
        </GlassButton>
        
        <div className="flex items-center gap-1 ml-2 text-xs text-text-muted">
          <Hash className="h-3 w-3" />
          <span>Press Enter after # to create tags</span>
        </div>
      </div>

      {/* URL Input */}
      {showUrlInput && (
        <div className="flex gap-2 p-2 bg-glass rounded-default border border-glassBorder">
          <input
            ref={urlInputRef}
            type="text"
            placeholder="Link text"
            value={urlText}
            onChange={(e) => setUrlText(e.target.value)}
            className="flex-1 bg-transparent border-none outline-none text-text placeholder-text-muted"
          />
          <input
            type="url"
            placeholder="URL"
            value={urlLink}
            onChange={(e) => setUrlLink(e.target.value)}
            className="flex-1 bg-transparent border-none outline-none text-text placeholder-text-muted"
          />
          <GlassButton
            variant="ghost"
            size="sm"
            onClick={handleUrl}
            className="p-1"
          >
            ✓
          </GlassButton>
        </div>
      )}

      {/* Tags Display */}
      {tags.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {tags.map((tag) => (
            <span
              key={tag.id}
              className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium bg-primary/20 text-primary rounded-full"
            >
              #{tag.text}
                              <button
                  onClick={() => removeTag(tag.id)}
                  className="hover:text-primary/80 transition-colors"
                >
                <X className="h-3 w-3" />
              </button>
            </span>
          ))}
        </div>
      )}

      {/* Editor */}
      <div
        ref={editorRef}
        contentEditable
        onInput={handleInput}
        onKeyDown={handleKeyDown}
        className={cn(
          'min-h-[100px] p-3 bg-glass backdrop-blur-glass rounded-default border border-glassBorder',
          'focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50',
          'text-text placeholder-text-muted',
          'overflow-y-auto',
          error && 'border-red-500'
        )}
        dangerouslySetInnerHTML={{ __html: value }}
        data-placeholder={placeholder}
      />

      {/* Error Message */}
      {error && (
        <p className="text-sm text-red-500">{error}</p>
      )}
    </div>
  );
}
