'use client';

import { ExternalLink, Github, Twitter, Mail } from 'lucide-react';
import { cn } from '@/utils/cn';

interface FooterProps {
  className?: string;
}

const toolCategories = [
  {
    title: 'Text Modification/Formatting',
    tools: [
      'Case Converter',
      'Text Generator',
      'Bold Text Generator',
      'Italic Text Converter',
      'Strikethrough Generator',
      'Underline Text Generator',
      'Small Text Generator',
      'Wide Text Generator',
      'Mirror Text Generator',
      'Reverse Text Generator',
      'Upside Down Text Generator',
      'Bubble Text Generator',
      'Zalgo Glitch Text Generator',
    ]
  },
  {
    title: 'Code & Data Translation',
    tools: [
      'Base64 Encoder/Decoder',
      'Binary Code Translator',
      'JSON Formatter',
      'HTML Formatter',
      'CSS Formatter',
      'JavaScript Formatter',
      'TypeScript Formatter',
      'Markdown Formatter',
      'XML Formatter',
      'YAML Formatter',
      'URL Encode/Decode',
      'Morse Code Translator',
      'Caesar Cipher Tool',
    ]
  },
  {
    title: 'Image Tools',
    tools: [
      'Image to Text Converter',
      'ASCII Art Generator',
      'JPG to PNG Converter',
      'PNG to JPG Converter',
      'WebP Converter',
      'SVG to PNG Converter',
      'Image Compression',
      'Image Resizer',
      'Color Picker',
      'QR Code Generator',
    ]
  },
  {
    title: 'Random Generators',
    tools: [
      'Random Number Generator',
      'Random Password Generator',
      'UUID Generator',
      'Random Date Generator',
      'Random Choice Generator',
      'Random Letter Generator',
      'Random IP Generator',
      'Random Color Generator',
      'Random Name Generator',
      'Random Quote Generator',
    ]
  },
  {
    title: 'Misc. Tools',
    tools: [
      'Online Notepad',
      'Word Counter',
      'Character Counter',
      'Text Replacement Tool',
      'Duplicate Remover',
      'Sort Words Alphabetically',
      'Word Cloud Generator',
      'NATO Phonetic Alphabet',
      'Roman Numeral Converter',
      'Repeat Text Generator',
    ]
  }
];

const resources = [
  { name: 'About', href: '/about' },
  { name: 'Chrome Extension', href: '/extension' },
  { name: 'Mobile App', href: '/mobile' },
  { name: 'API Documentation', href: '/api' },
  { name: 'Contact', href: '/contact' },
  { name: 'Suggest a Tool', href: '/suggest' },
];

const languages = [
  'English',
  'Deutsch',
  'Español',
  'Français',
  'Italiano',
  'Português',
  'Polski',
  'Türkçe',
  '中文',
  '日本語',
];

export function Footer({ className }: FooterProps) {
  return (
    <footer className={cn('mt-16 border-t border-glassBorder/30', className)}>
      {/* Main Footer Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 xl:grid-cols-3">
          {/* Tool Categories */}
          {toolCategories.map((category, index) => (
            <div key={index} className="space-y-4">
              <h3 className="text-lg font-semibold text-text">
                {category.title}
              </h3>
              <ul className="space-y-2">
                {category.tools.slice(0, 8).map((tool, toolIndex) => (
                  <li key={toolIndex}>
                    <a
                      href={`/tools/${tool.toLowerCase().replace(/\s+/g, '-')}`}
                      className="text-sm text-text-muted hover:text-primary transition-colors duration-200"
                    >
                      {tool}
                    </a>
                  </li>
                ))}
                {category.tools.length > 8 && (
                  <li>
                    <a
                      href={`/category/${category.title.toLowerCase().replace(/\s+/g, '-')}`}
                                             className="text-sm text-primary hover:text-primary/80 transition-colors duration-200"
                    >
                      View all {category.tools.length} tools →
                    </a>
                  </li>
                )}
              </ul>
            </div>
          ))}
        </div>

        {/* Resources and Languages */}
        <div className="mt-12 grid grid-cols-1 gap-8 border-t border-glassBorder/30 pt-8 md:grid-cols-2">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-text">Resources</h3>
            <div className="grid grid-cols-2 gap-2">
              {resources.map((resource, index) => (
                <a
                  key={index}
                  href={resource.href}
                  className="text-sm text-text-muted hover:text-primary transition-colors duration-200"
                >
                  {resource.name}
                </a>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-text">Languages</h3>
            <div className="grid grid-cols-2 gap-2">
              {languages.map((language, index) => (
                <a
                  key={index}
                  href={`/lang/${language.toLowerCase()}`}
                  className="text-sm text-text-muted hover:text-primary transition-colors duration-200"
                >
                  {language}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-12 border-t border-glassBorder/30 pt-8">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            {/* Copyright and Info */}
            <div className="text-center md:text-left">
              <p className="text-sm text-text-muted">
                Copyright ©2006-2025 Mimo Task Manager | Last Updated (Jan 2025)
              </p>
              <p className="text-xs text-text-muted mt-1">
                Built with Next.js 15 and React 18 | Privacy Policy | Terms of Service
              </p>
            </div>

            {/* Social Links */}
            <div className="flex items-center gap-4">
              <a
                href="https://github.com/Yewaung/mimoNext"
                target="_blank"
                rel="noopener noreferrer"
                className="text-text-muted hover:text-primary transition-colors duration-200"
                title="GitHub"
              >
                <Github className="h-5 w-5" />
              </a>
              <a
                href="https://twitter.com/mimo"
                target="_blank"
                rel="noopener noreferrer"
                className="text-text-muted hover:text-primary transition-colors duration-200"
                title="Twitter"
              >
                <Twitter className="h-5 w-5" />
              </a>
              <a
                href="mailto:contact@mimo.com"
                className="text-text-muted hover:text-primary transition-colors duration-200"
                title="Contact"
              >
                <Mail className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Tools Bar */}
      <div className="border-t border-glassBorder/30 bg-glass/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-wrap items-center justify-center gap-4 text-sm">
            <span className="text-text-muted">Quick Tools:</span>
            {[
              'Case Converter',
              'Text Generator',
              'JSON Formatter',
              'Base64 Encoder',
              'Password Generator',
              'QR Code Generator'
            ].map((tool, index) => (
              <a
                key={index}
                href={`/tools/${tool.toLowerCase().replace(/\s+/g, '-')}`}
                className="text-text-muted hover:text-primary transition-colors duration-200 flex items-center gap-1"
              >
                {tool}
                <ExternalLink className="h-3 w-3" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
