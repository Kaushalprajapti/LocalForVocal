# Styling Guide Documentation

This document provides comprehensive information about the styling system, design tokens, component styles, and best practices for maintaining consistent and scalable styles across the application.

## 🎨 Design System Overview

### Design Philosophy

The styling system is built on the following principles:
- **Consistency**: Uniform spacing, colors, and typography
- **Scalability**: Easy to maintain and extend
- **Accessibility**: High contrast ratios and readable fonts
- **Performance**: Optimized CSS with minimal bundle size
- **Responsiveness**: Mobile-first approach with fluid layouts

### Technology Stack

- **Tailwind CSS**: Utility-first CSS framework
- **PostCSS**: CSS processing and optimization
- **CSS Custom Properties**: Dynamic theming support
- **Lucide React**: Consistent icon system

## 🎯 Color System

### Primary Color Palette

```css
/* Primary Colors - Orange/Amber for local store feel */
:root {
  --primary-50: #fff7ed;
  --primary-100: #ffedd5;
  --primary-200: #fed7aa;
  --primary-300: #fdba74;
  --primary-400: #fb923c;
  --primary-500: #f97316;
  --primary-600: #ea580c;
  --primary-700: #c2410c;
  --primary-800: #9a3412;
  --primary-900: #7c2d12;
}
```

### Secondary Color Palette

```css
/* Secondary Colors - Forest green for trust and nature */
:root {
  --secondary-50: #f0fdf4;
  --secondary-100: #dcfce7;
  --secondary-200: #bbf7d0;
  --secondary-300: #86efac;
  --secondary-400: #4ade80;
  --secondary-500: #22c55e;
  --secondary-600: #16a34a;
  --secondary-700: #15803d;
  --secondary-800: #166534;
  --secondary-900: #14532d;
}
```

### Neutral Colors

```css
/* Neutral Colors - Grays for text and backgrounds */
:root {
  --neutral-50: #fafafa;
  --neutral-100: #f5f5f5;
  --neutral-200: #e5e5e5;
  --neutral-300: #d4d4d4;
  --neutral-400: #a3a3a3;
  --neutral-500: #737373;
  --neutral-600: #525252;
  --neutral-700: #404040;
  --neutral-800: #262626;
  --neutral-900: #171717;
}
```

### Semantic Colors

```css
/* Semantic Colors - Status and feedback */
:root {
  /* Success */
  --success-50: #f0fdf4;
  --success-500: #22c55e;
  --success-600: #16a34a;
  --success-700: #15803d;
  
  /* Warning */
  --warning-50: #fffbeb;
  --warning-500: #f59e0b;
  --warning-600: #d97706;
  --warning-700: #b45309;
  
  /* Error */
  --error-50: #fef2f2;
  --error-500: #ef4444;
  --error-600: #dc2626;
  --error-700: #b91c1c;
  
  /* Info */
  --info-50: #eff6ff;
  --info-500: #3b82f6;
  --info-600: #2563eb;
  --info-700: #1d4ed8;
}
```

### Accent Colors

```css
/* Accent Colors - Gold for premium elements */
:root {
  --accent-50: #fffbeb;
  --accent-100: #fef3c7;
  --accent-200: #fde68a;
  --accent-300: #fcd34d;
  --accent-400: #fbbf24;
  --accent-500: #f59e0b;
  --accent-600: #d97706;
  --accent-700: #b45309;
  --accent-800: #92400e;
  --accent-900: #78350f;
}
```

## 📏 Spacing System

### Base Spacing Scale

```css
/* Spacing Scale - 4px base unit */
:root {
  --space-0: 0px;
  --space-1: 0.25rem;  /* 4px */
  --space-2: 0.5rem;   /* 8px */
  --space-3: 0.75rem; /* 12px */
  --space-4: 1rem;    /* 16px */
  --space-5: 1.25rem; /* 20px */
  --space-6: 1.5rem;  /* 24px */
  --space-8: 2rem;    /* 32px */
  --space-10: 2.5rem; /* 40px */
  --space-12: 3rem;   /* 48px */
  --space-16: 4rem;   /* 64px */
  --space-20: 5rem;   /* 80px */
  --space-24: 6rem;   /* 96px */
  --space-32: 8rem;   /* 128px */
}
```

### Component Spacing

```css
/* Component-specific spacing */
:root {
  /* Button padding */
  --btn-padding-sm: var(--space-2) var(--space-3);
  --btn-padding-md: var(--space-3) var(--space-4);
  --btn-padding-lg: var(--space-4) var(--space-6);
  
  /* Card padding */
  --card-padding-sm: var(--space-4);
  --card-padding-md: var(--space-6);
  --card-padding-lg: var(--space-8);
  
  /* Form spacing */
  --form-gap: var(--space-4);
  --form-label-margin: var(--space-1);
  --form-input-padding: var(--space-3) var(--space-4);
}
```

## 🔤 Typography System

### Font Families

```css
/* Font Families */
:root {
  --font-sans: 'Inter', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  --font-serif: 'Georgia', 'Times New Roman', serif;
  --font-mono: 'JetBrains Mono', 'Fira Code', 'Monaco', 'Consolas', monospace;
}
```

### Font Sizes

```css
/* Font Size Scale */
:root {
  --text-xs: 0.75rem;    /* 12px */
  --text-sm: 0.875rem;  /* 14px */
  --text-base: 1rem;    /* 16px */
  --text-lg: 1.125rem;  /* 18px */
  --text-xl: 1.25rem;   /* 20px */
  --text-2xl: 1.5rem;   /* 24px */
  --text-3xl: 1.875rem; /* 30px */
  --text-4xl: 2.25rem;  /* 36px */
  --text-5xl: 3rem;     /* 48px */
  --text-6xl: 3.75rem;  /* 60px */
}
```

### Font Weights

```css
/* Font Weights */
:root {
  --font-thin: 100;
  --font-light: 300;
  --font-normal: 400;
  --font-medium: 500;
  --font-semibold: 600;
  --font-bold: 700;
  --font-extrabold: 800;
  --font-black: 900;
}
```

### Line Heights

```css
/* Line Heights */
:root {
  --leading-none: 1;
  --leading-tight: 1.25;
  --leading-snug: 1.375;
  --leading-normal: 1.5;
  --leading-relaxed: 1.625;
  --leading-loose: 2;
}
```

## 🎭 Component Styles

### Button Styles

```css
/* Button Base Styles */
.btn-base {
  @apply inline-flex items-center justify-center font-medium rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2;
}

/* Button Variants */
.btn-primary {
  @apply bg-primary-600 hover:bg-primary-700 text-white focus:ring-primary-500;
}

.btn-secondary {
  @apply bg-secondary-600 hover:bg-secondary-700 text-white focus:ring-secondary-500;
}

.btn-outline {
  @apply border border-secondary-300 bg-white hover:bg-secondary-50 text-secondary-700 focus:ring-primary-500;
}

.btn-ghost {
  @apply bg-transparent hover:bg-secondary-100 text-secondary-700 focus:ring-primary-500;
}

.btn-danger {
  @apply bg-red-600 hover:bg-red-700 text-white focus:ring-red-500;
}

/* Button Sizes */
.btn-sm {
  @apply px-3 py-1.5 text-sm;
}

.btn-md {
  @apply px-4 py-2 text-base;
}

.btn-lg {
  @apply px-6 py-3 text-lg;
}
```

### Card Styles

```css
/* Card Base Styles */
.card-base {
  @apply bg-white rounded-lg shadow-sm border border-secondary-200;
}

/* Card Variants */
.card-elevated {
  @apply shadow-md hover:shadow-lg transition-shadow duration-200;
}

.card-flat {
  @apply shadow-none border-0;
}

.card-interactive {
  @apply hover:shadow-md hover:border-primary-200 transition-all duration-200 cursor-pointer;
}

/* Card Padding */
.card-padding-sm {
  @apply p-4;
}

.card-padding-md {
  @apply p-6;
}

.card-padding-lg {
  @apply p-8;
}
```

### Form Styles

```css
/* Input Base Styles */
.input-base {
  @apply block w-full px-3 py-2 border border-secondary-300 rounded-md shadow-sm placeholder-secondary-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500;
}

/* Input States */
.input-error {
  @apply border-red-300 focus:ring-red-500 focus:border-red-500;
}

.input-success {
  @apply border-green-300 focus:ring-green-500 focus:border-green-500;
}

.input-disabled {
  @apply bg-secondary-50 cursor-not-allowed;
}

/* Label Styles */
.label-base {
  @apply block text-sm font-medium text-secondary-700;
}

.label-required {
  @apply after:content-['*'] after:text-red-500 after:ml-1;
}
```

### Badge Styles

```css
/* Badge Base Styles */
.badge-base {
  @apply inline-flex items-center rounded-full font-medium;
}

/* Badge Variants */
.badge-default {
  @apply bg-secondary-100 text-secondary-800;
}

.badge-success {
  @apply bg-green-100 text-green-800;
}

.badge-warning {
  @apply bg-yellow-100 text-yellow-800;
}

.badge-error {
  @apply bg-red-100 text-red-800;
}

.badge-info {
  @apply bg-blue-100 text-blue-800;
}

/* Badge Sizes */
.badge-sm {
  @apply px-2 py-1 text-xs;
}

.badge-md {
  @apply px-2.5 py-0.5 text-sm;
}

.badge-lg {
  @apply px-3 py-1 text-base;
}
```

## 🎬 Animation System

### Transition Classes

```css
/* Transition Base */
.transition-base {
  @apply transition-all duration-200 ease-in-out;
}

.transition-fast {
  @apply transition-all duration-150 ease-in-out;
}

.transition-slow {
  @apply transition-all duration-300 ease-in-out;
}

/* Specific Transitions */
.transition-colors {
  @apply transition-colors duration-200;
}

.transition-transform {
  @apply transition-transform duration-200;
}

.transition-opacity {
  @apply transition-opacity duration-200;
}
```

### Animation Keyframes

```css
/* Fade Animations */
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes fadeOut {
  from { opacity: 1; }
  to { opacity: 0; }
}

/* Slide Animations */
@keyframes slideInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes slideInDown {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes slideInLeft {
  from {
    opacity: 0;
    transform: translateX(-20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes slideInRight {
  from {
    opacity: 0;
    transform: translateX(20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

/* Scale Animations */
@keyframes scaleIn {
  from {
    opacity: 0;
    transform: scale(0.9);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

@keyframes scaleOut {
  from {
    opacity: 1;
    transform: scale(1);
  }
  to {
    opacity: 0;
    transform: scale(0.9);
  }
}

/* Bounce Animations */
@keyframes bounceSubtle {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-4px);
  }
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

/* Shake Animation */
@keyframes shake {
  0%, 100% {
    transform: translateX(0);
  }
  10%, 30%, 50%, 70%, 90% {
    transform: translateX(-2px);
  }
  20%, 40%, 60%, 80% {
    transform: translateX(2px);
  }
}
```

### Animation Classes

```css
/* Animation Classes */
.animate-fade-in {
  animation: fadeIn 0.5s ease-in-out;
}

.animate-slide-up {
  animation: slideInUp 0.3s ease-out;
}

.animate-slide-down {
  animation: slideInDown 0.3s ease-out;
}

.animate-slide-left {
  animation: slideInLeft 0.3s ease-out;
}

.animate-slide-right {
  animation: slideInRight 0.3s ease-out;
}

.animate-scale-in {
  animation: scaleIn 0.2s ease-out;
}

.animate-bounce-subtle {
  animation: bounceSubtle 0.6s ease-in-out;
}

.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

.animate-shake {
  animation: shake 0.5s ease-in-out;
}
```

## 📱 Responsive Design

### Breakpoint System

```css
/* Breakpoints */
:root {
  --breakpoint-sm: 640px;
  --breakpoint-md: 768px;
  --breakpoint-lg: 1024px;
  --breakpoint-xl: 1280px;
  --breakpoint-2xl: 1536px;
}

/* Media Queries */
@media (min-width: 640px) {
  /* Small devices and up */
}

@media (min-width: 768px) {
  /* Medium devices and up */
}

@media (min-width: 1024px) {
  /* Large devices and up */
}

@media (min-width: 1280px) {
  /* Extra large devices and up */
}

@media (min-width: 1536px) {
  /* 2X large devices and up */
}
```

### Container Classes

```css
/* Container Styles */
.container {
  @apply w-full mx-auto px-4 sm:px-6 lg:px-8;
}

.container-sm {
  @apply max-w-3xl;
}

.container-md {
  @apply max-w-5xl;
}

.container-lg {
  @apply max-w-7xl;
}

.container-xl {
  @apply max-w-screen-xl;
}
```

### Grid System

```css
/* Grid Layouts */
.grid-responsive {
  @apply grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6;
}

.grid-products {
  @apply grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6;
}

.grid-categories {
  @apply grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4;
}

.grid-admin {
  @apply grid grid-cols-1 lg:grid-cols-3 gap-6;
}
```

## 🌙 Theme System

### Light Theme

```css
/* Light Theme Variables */
[data-theme="light"] {
  --bg-primary: #ffffff;
  --bg-secondary: #f8fafc;
  --bg-tertiary: #f1f5f9;
  
  --text-primary: #1e293b;
  --text-secondary: #64748b;
  --text-tertiary: #94a3b8;
  
  --border-primary: #e2e8f0;
  --border-secondary: #cbd5e1;
  
  --shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
  --shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1);
  --shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1);
}
```

### Dark Theme

```css
/* Dark Theme Variables */
[data-theme="dark"] {
  --bg-primary: #0f172a;
  --bg-secondary: #1e293b;
  --bg-tertiary: #334155;
  
  --text-primary: #f8fafc;
  --text-secondary: #cbd5e1;
  --text-tertiary: #94a3b8;
  
  --border-primary: #334155;
  --border-secondary: #475569;
  
  --shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.3);
  --shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.4);
  --shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.4);
}
```

### Theme Toggle Implementation

```typescript
// Theme Context
interface ThemeContextType {
  theme: 'light' | 'dark' | 'auto';
  setTheme: (theme: 'light' | 'dark' | 'auto') => void;
  resolvedTheme: 'light' | 'dark';
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<'light' | 'dark' | 'auto'>('auto');
  const [resolvedTheme, setResolvedTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const updateTheme = () => {
      if (theme === 'auto') {
        setResolvedTheme(mediaQuery.matches ? 'dark' : 'light');
      } else {
        setResolvedTheme(theme);
      }
    };

    updateTheme();
    mediaQuery.addEventListener('change', updateTheme);
    
    return () => mediaQuery.removeEventListener('change', updateTheme);
  }, [theme]);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', resolvedTheme);
  }, [resolvedTheme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, resolvedTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
```

## 🎯 Component-Specific Styles

### Product Card Styles

```css
/* Product Card */
.product-card {
  @apply group overflow-hidden hover:shadow-lg transition-shadow duration-300;
}

.product-card-image {
  @apply relative aspect-square overflow-hidden;
}

.product-card-image img {
  @apply w-full h-full object-cover group-hover:scale-105 transition-transform duration-300;
}

.product-card-overlay {
  @apply absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300;
}

.product-card-actions {
  @apply absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300;
}

.product-card-content {
  @apply p-4 space-y-2;
}

.product-card-title {
  @apply font-medium text-secondary-900 hover:text-primary-600 transition-colors line-clamp-2;
}

.product-card-price {
  @apply text-lg font-semibold text-secondary-900;
}

.product-card-price-original {
  @apply text-sm text-secondary-500 line-through;
}
```

### Navigation Styles

```css
/* Header Navigation */
.header-nav {
  @apply bg-white shadow-sm border-b border-secondary-200;
}

.header-nav-container {
  @apply max-w-7xl mx-auto px-4 sm:px-6 lg:px-8;
}

.header-nav-content {
  @apply flex items-center justify-between h-16;
}

.header-nav-logo {
  @apply text-xl font-bold text-primary-600;
}

.header-nav-menu {
  @apply hidden md:flex items-center space-x-8;
}

.header-nav-link {
  @apply text-secondary-700 hover:text-primary-600 transition-colors font-medium;
}

.header-nav-link-active {
  @apply text-primary-600;
}

.header-nav-mobile {
  @apply md:hidden;
}
```

### Form Styles

```css
/* Form Layout */
.form-container {
  @apply max-w-2xl mx-auto;
}

.form-section {
  @apply space-y-6;
}

.form-group {
  @apply space-y-2;
}

.form-row {
  @apply grid grid-cols-1 sm:grid-cols-2 gap-4;
}

.form-actions {
  @apply flex items-center justify-end space-x-3 pt-6 border-t border-secondary-200;
}

/* Form Validation */
.form-error {
  @apply text-sm text-red-600;
}

.form-success {
  @apply text-sm text-green-600;
}

.form-help {
  @apply text-sm text-secondary-500;
}
```

## 🚀 Performance Optimizations

### CSS Optimization

```css
/* Critical CSS - Above the fold */
.critical-styles {
  /* Only essential styles for initial render */
}

/* Non-critical CSS - Loaded asynchronously */
.non-critical-styles {
  /* Styles for below-the-fold content */
}

/* CSS Purging */
/* Remove unused styles in production build */
```

### Animation Performance

```css
/* GPU-accelerated animations */
.gpu-accelerated {
  transform: translateZ(0);
  will-change: transform;
}

/* Reduced motion support */
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

## 📋 Style Guidelines

### Naming Conventions

```css
/* BEM Methodology */
.block {}
.block__element {}
.block--modifier {}

/* Component-based naming */
.component-name {}
.component-name__element {}
.component-name--variant {}

/* Utility classes */
.u-hidden {}
.u-text-center {}
.u-mb-4 {}
```

### CSS Organization

```css
/* 1. Reset/Normalize */
/* 2. Base styles */
/* 3. Layout styles */
/* 4. Component styles */
/* 5. Utility classes */
/* 6. Media queries */
```

### Best Practices

1. **Use CSS Custom Properties**: For dynamic theming and maintainability
2. **Mobile-First**: Start with mobile styles and enhance for larger screens
3. **Consistent Spacing**: Use the defined spacing scale
4. **Semantic Colors**: Use semantic color names for better maintainability
5. **Performance**: Minimize CSS bundle size and use efficient selectors
6. **Accessibility**: Ensure sufficient color contrast and readable fonts

This comprehensive styling guide provides all the necessary information for maintaining consistent, scalable, and performant styles across the application.
