'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Save, FileText, Trash2, Expand, Minimize } from 'lucide-react';
import { GlassCard } from '@/components/atoms/GlassCard';
import { GlassButton } from '@/components/atoms/GlassButton';
import { RichTextEditor } from '@/components/molecules/RichTextEditor';
import { cn } from '@/utils/cn';

interface FooterProps {
  className?: string;
}

interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export function Footer({ className }: FooterProps) {
  const [notes, setNotes] = useState<Note[]>([]);
  const [currentNote, setCurrentNote] = useState<Note | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [showNewNote, setShowNewNote] = useState(false);

  const createNewNote = () => {
    const newNote: Note = {
      id: Date.now().toString(),
      title: 'Untitled Note',
      content: '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setCurrentNote(newNote);
    setNotes(prev => [newNote, ...prev]);
    setShowNewNote(true);
    setIsExpanded(true);
  };

  const saveNote = () => {
    if (currentNote) {
      const updatedNote = {
        ...currentNote,
        updatedAt: new Date().toISOString(),
      };
      setNotes(prev => 
        prev.map(note => 
          note.id === currentNote.id ? updatedNote : note
        )
      );
      setCurrentNote(updatedNote);
    }
  };

  const deleteNote = (noteId: string) => {
    setNotes(prev => prev.filter(note => note.id !== noteId));
    if (currentNote?.id === noteId) {
      setCurrentNote(null);
      setShowNewNote(false);
    }
  };

  const selectNote = (note: Note) => {
    setCurrentNote(note);
    setShowNewNote(true);
    setIsExpanded(true);
  };

  const updateNoteContent = (content: string) => {
    if (currentNote) {
      setCurrentNote({
        ...currentNote,
        content,
        updatedAt: new Date().toISOString(),
      });
    }
  };

  const updateNoteTitle = (title: string) => {
    if (currentNote) {
      setCurrentNote({
        ...currentNote,
        title,
        updatedAt: new Date().toISOString(),
      });
    }
  };

  return (
    <motion.footer
      className={cn('fixed bottom-0 left-0 right-0 z-40', className)}
      initial={{ y: '100%' }}
      animate={{ y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Footer Toggle */}
      <div className="flex justify-center mb-2">
        <GlassButton
          variant="ghost"
          size="sm"
          onClick={() => setIsExpanded(!isExpanded)}
          className="rounded-full px-3 py-1"
        >
          {isExpanded ? (
            <Minimize className="h-4 w-4" />
          ) : (
            <Expand className="h-4 w-4" />
          )}
          <span className="ml-2 text-sm">
            {isExpanded ? 'Minimize' : 'Notes'}
          </span>
        </GlassButton>
      </div>

      {/* Expanded Footer */}
      {isExpanded && (
        <motion.div
          className="bg-glass backdrop-blur-glass border-t border-glassBorder"
          initial={{ height: 0 }}
          animate={{ height: 'auto' }}
          exit={{ height: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="max-w-7xl mx-auto p-4">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
              {/* Notes List */}
              <div className="lg:col-span-1">
                <GlassCard className="p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-text">Notes</h3>
                    <GlassButton
                      variant="primary"
                      size="sm"
                      onClick={createNewNote}
                      className="text-xs"
                    >
                      <FileText className="h-3 w-3 mr-1" />
                      New
                    </GlassButton>
                  </div>

                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    {notes.length === 0 ? (
                      <p className="text-sm text-text-muted text-center py-4">
                        No notes yet. Create your first note!
                      </p>
                    ) : (
                      notes.map(note => (
                        <motion.div
                          key={note.id}
                          className={cn(
                            'p-3 rounded-default border cursor-pointer transition-all duration-200',
                            'hover:bg-glass-medium hover:border-glassBorder/60',
                            currentNote?.id === note.id
                              ? 'border-primary/50 bg-primary/10'
                              : 'border-glassBorder/30 bg-glass-light'
                          )}
                          onClick={() => selectNote(note)}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1 min-w-0">
                              <h4 className="font-medium text-text text-sm truncate">
                                {note.title}
                              </h4>
                              <p className="text-xs text-text-muted mt-1 line-clamp-2">
                                {note.content.replace(/<[^>]*>/g, '') || 'No content'}
                              </p>
                              <p className="text-xs text-text-disabled mt-1">
                                {new Date(note.updatedAt).toLocaleDateString()}
                              </p>
                            </div>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                deleteNote(note.id);
                              }}
                              className="ml-2 p-1 rounded-full hover:bg-red-500/20 hover:text-red-400 transition-colors"
                            >
                              <Trash2 className="h-3 w-3" />
                            </button>
                          </div>
                        </motion.div>
                      ))
                    )}
                  </div>
                </GlassCard>
              </div>

              {/* Note Editor */}
              {showNewNote && currentNote && (
                <div className="lg:col-span-3">
                  <GlassCard className="p-4">
                    <div className="flex items-center justify-between mb-4">
                      <input
                        type="text"
                        value={currentNote.title}
                        onChange={(e) => updateNoteTitle(e.target.value)}
                        className="text-xl font-semibold text-text bg-transparent border-none outline-none focus:ring-2 focus:ring-primary/50 rounded px-2 py-1"
                        placeholder="Note title..."
                      />
                      <GlassButton
                        variant="primary"
                        size="sm"
                        onClick={saveNote}
                        className="text-xs"
                      >
                        <Save className="h-3 w-3 mr-1" />
                        Save
                      </GlassButton>
                    </div>

                    <RichTextEditor
                      value={currentNote.content}
                      onChange={updateNoteContent}
                      placeholder="Start writing your note..."
                      className="min-h-[200px]"
                    />
                  </GlassCard>
                </div>
              )}

              {/* Empty State */}
              {!showNewNote && (
                <div className="lg:col-span-3">
                  <GlassCard className="p-8 text-center">
                    <FileText className="h-12 w-12 text-text-muted mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-text mb-2">
                      No Note Selected
                    </h3>
                    <p className="text-text-muted mb-4">
                      Select a note from the list or create a new one to start writing.
                    </p>
                    <GlassButton
                      variant="primary"
                      onClick={createNewNote}
                    >
                      <FileText className="h-4 w-4 mr-2" />
                      Create New Note
                    </GlassButton>
                  </GlassCard>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </motion.footer>
  );
}
