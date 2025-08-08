# 🌟 LiquidGlass Task Manager

A modern, beautiful task management web application built with Next.js 15 and featuring a stunning glassmorphism design. Manage your tasks across six intuitive categories: Thing to Do, Working, Wait, Done, Resources, and Shortcut.

![LiquidGlass Task Manager](https://via.placeholder.com/800x400/0FF0FC/000000?text=LiquidGlass+Task+Manager)

## ✨ Features

### 🎨 **Glassmorphism Design**
- Stunning glass-like UI with backdrop blur effects
- Custom neon color scheme with primary cyan, secondary purple, and accent gold
- Smooth animations and micro-interactions
- Dark theme optimized for modern devices

### 📋 **Task Management**
- **Six Status Categories**: Thing to Do, Working, Wait, Done, Resources, Shortcut
- **Priority Levels**: Low, Medium, High with visual indicators
- **Tagging System**: Organize tasks with custom tags
- **Due Dates**: Set and track task deadlines with overdue indicators
- **Time Tracking**: Estimate and track actual time spent

### 💾 **Data Persistence**
- **Dual Storage Support**: Automatic fallback from IndexedDB to localStorage
- **Import/Export**: JSON-based backup and restore functionality
- **Offline First**: Works completely offline with browser storage
- **Data Safety**: Comprehensive error handling and data validation

### 🚀 **Performance & Accessibility**
- **Next.js 15**: Latest features including Server Components and React 19 support
- **TypeScript**: Full type safety throughout the application
- **Responsive Design**: Perfect on desktop, tablet, and mobile devices
- **Accessibility**: ARIA support, keyboard navigation, and screen reader friendly
- **PWA Ready**: Optimized for installation as a Progressive Web App

## 🛠️ Tech Stack

- **Framework**: Next.js 15 with App Router
- **Runtime**: React 19 with Concurrent Features
- **Language**: TypeScript with strict configuration
- **Styling**: Tailwind CSS with custom glassmorphism theme
- **Animation**: Framer Motion for smooth transitions
- **Storage**: IndexedDB with localStorage fallback
- **Forms**: React Hook Form with Zod validation
- **Icons**: Lucide React icon library
- **Development**: ESLint, Prettier, and Jest for testing

## 🚀 Quick Start

### Prerequisites
- Node.js 18.17.0 or higher
- npm 9.0.0 or higher

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/liquidglass-task-manager.git
   cd liquidglass-task-manager
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Available Scripts

```bash
# Development
npm run dev          # Start development server with Turbopack
npm run build        # Build for production
npm start           # Start production server

# Code Quality
npm run lint        # Run ESLint
npm run lint:fix    # Fix ESLint issues automatically
npm run type-check  # Run TypeScript compiler

# Testing
npm run test        # Run Jest tests
npm run test:watch  # Run tests in watch mode
```

## 📁 Project Structure

```
liquidglass-task-manager/
├── app/                    # Next.js App Router
│   ├── globals.css        # Global styles and Tailwind imports
│   ├── layout.tsx         # Root layout with fonts and metadata
│   └── page.tsx           # Main task management dashboard
├── components/            # React components (Atomic Design)
│   ├── atoms/            # Basic building blocks
│   │   ├── GlassButton.tsx
│   │   ├── GlassCard.tsx
│   │   ├── GlassInput.tsx
│   │   ├── GlassSelect.tsx
│   │   ├── StatusBadge.tsx
│   │   └── PriorityBadge.tsx
│   └── molecules/        # Composed components
│       ├── TaskCard.tsx
│       └── TaskForm.tsx
├── hooks/                # Custom React hooks
│   ├── useTasks.ts      # Task CRUD operations
│   └── useTaskFilters.ts # Filtering and search logic
├── lib/                  # Utility libraries
│   └── storage.ts       # IndexedDB/localStorage abstraction
├── types/               # TypeScript type definitions
│   └── index.ts        # Shared interfaces and types
├── utils/              # Helper functions
│   └── cn.ts          # Class name merging utility
├── data/              # Static data and initialization
│   └── defaultTasks.ts # Sample tasks for first-time users
└── config/           # Configuration files
```

## 🎨 Design System

### Color Palette
- **Primary**: `#0FF0FC` (Cyan) - Main actions and highlights
- **Secondary**: `#8A2BE2` (Purple) - Secondary actions and accents
- **Accent**: `#FFD700` (Gold) - Important highlights and warnings
- **Background**: `rgba(20, 20, 30, 0.85)` - Dark glass background
- **Glass**: `rgba(255, 255, 255, 0.2)` - Glassmorphism surfaces
- **Text**: `#F0F8FF` - Primary text color

### Typography
- **Primary Font**: Poppins (Google Fonts)
- **Secondary Font**: Inter (Google Fonts)
- **Weights**: 300, 400, 500, 600, 700

### Glassmorphism Effects
- **Backdrop Blur**: 10px blur effect
- **Border**: Semi-transparent white borders
- **Shadow**: Subtle glass shadows with depth
- **Hover Effects**: Enhanced blur and shadow on interaction

## 📋 Task Categories

The application organizes tasks into six intuitive categories:

1. **Thing to Do** 📝 - Tasks that need to be started
2. **Working** ⚡ - Tasks currently in progress
3. **Wait** ⏳ - Tasks waiting for external dependencies
4. **Done** ✅ - Completed tasks
5. **Resources** 📚 - Reference materials and documentation
6. **Shortcut** 🚀 - Quick actions and shortcuts

## 🔧 Configuration

### Tailwind CSS Customization
The glassmorphism theme is fully customizable in `tailwind.config.ts`. You can modify:
- Color schemes and opacity levels
- Blur intensity and glass effects
- Animation timing and easing
- Responsive breakpoints
- Custom utility classes

### Storage Configuration
Storage preferences can be configured in `lib/storage.ts`:
- IndexedDB database name and version
- localStorage key naming
- Fallback behavior and error handling
- Data validation and migration logic

## 🧪 Testing

The project includes comprehensive testing setup:

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm test -- --coverage
```

Test files are located alongside their corresponding components using the `.test.ts` or `.spec.ts` naming convention.

## 🚀 Deployment

### Production Build
```bash
npm run build
npm start
```

### Static Export
```bash
# Add to next.config.mjs
output: 'export'
```

### Environment Variables
Create a `.env.local` file for environment-specific configuration:
```env
NEXT_PUBLIC_APP_NAME=LiquidGlass Task Manager
NEXT_PUBLIC_APP_VERSION=1.0.0
```

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details.

### Development Workflow
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes with proper TypeScript types
4. Add tests for new functionality
5. Run linting and tests (`npm run lint && npm test`)
6. Commit with conventional commit format
7. Push to your fork and submit a pull request

## 📄 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Next.js Team** for the amazing React framework
- **Tailwind CSS** for the utility-first CSS framework
- **Framer Motion** for beautiful animations
- **Lucide** for the gorgeous icon set
- **Vercel** for hosting and deployment platform

---

<div align="center">

**Built with 💎 by LiquidGlass**

[🌟 Star this repo](https://github.com/yourusername/liquidglass-task-manager) · [🐛 Report Bug](https://github.com/yourusername/liquidglass-task-manager/issues) · [✨ Request Feature](https://github.com/yourusername/liquidglass-task-manager/issues)

</div>

