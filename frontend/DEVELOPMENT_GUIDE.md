# Development Guide Documentation

This document provides comprehensive information for developers working on the frontend application, including setup instructions, development workflows, coding standards, and best practices.

## 🚀 Getting Started

### Prerequisites

Before starting development, ensure you have the following installed:

- **Node.js**: Version 16 or higher
- **npm**: Version 8 or higher (comes with Node.js)
- **Git**: For version control
- **VS Code**: Recommended IDE with extensions
- **Backend API**: Running on `http://localhost:5000`

### Development Environment Setup

```bash
# 1. Clone the repository
git clone <repository-url>
cd frontend

# 2. Install dependencies
npm install

# 3. Create environment file
cp .env.example .env

# 4. Start development server
npm run dev
```

### Environment Configuration

Create a `.env` file in the frontend directory:

```env
# API Configuration
VITE_API_BASE_URL=http://localhost:5000/api
VITE_API_TIMEOUT=10000

# Feature Flags
VITE_ENABLE_ANALYTICS=true
VITE_ENABLE_PWA=false
VITE_ENABLE_DEBUG=false

# External Services
VITE_CLOUDINARY_CLOUD_NAME=your_cloud_name
VITE_CLOUDINARY_API_KEY=your_api_key

# Development Settings
VITE_DEV_MODE=true
VITE_MOCK_API=false
```

## 🛠️ Development Workflow

### Git Workflow

```bash
# 1. Create feature branch
git checkout -b feature/new-feature

# 2. Make changes and commit
git add .
git commit -m "feat: add new feature"

# 3. Push to remote
git push origin feature/new-feature

# 4. Create pull request
# Use GitHub/GitLab interface to create PR
```

### Commit Message Convention

We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

**Examples:**
```bash
feat(cart): add quantity validation
fix(api): handle network timeout errors
docs(readme): update installation instructions
style(components): format code with prettier
refactor(hooks): optimize useProducts hook
test(utils): add tests for formatPrice function
chore(deps): update dependencies
```

### Branch Naming Convention

- `feature/description`: New features
- `fix/description`: Bug fixes
- `hotfix/description`: Critical fixes
- `refactor/description`: Code refactoring
- `docs/description`: Documentation updates
- `test/description`: Test-related changes

## 📁 Project Structure

### Directory Organization

```
frontend/
├── public/                 # Static assets
│   ├── favicon.ico
│   ├── logo192.png
│   ├── logo512.png
│   ├── manifest.json
│   └── placeholder-*.svg
├── src/
│   ├── components/        # Reusable components
│   │   ├── admin/        # Admin-specific components
│   │   ├── common/       # Shared components
│   │   └── customer/     # Customer-facing components
│   ├── context/          # React Context providers
│   ├── hooks/            # Custom React hooks
│   ├── pages/            # Page components
│   │   ├── admin/        # Admin pages
│   │   └── customer/     # Customer pages
│   ├── routes/           # Route definitions
│   ├── types/            # TypeScript type definitions
│   ├── utils/            # Utility functions
│   ├── data/             # Mock data and constants
│   ├── App.tsx           # Main application component
│   ├── main.tsx          # Application entry point
│   └── index.css         # Global styles
├── docs/                 # Documentation files
├── tests/                # Test files
├── .env.example          # Environment variables template
├── .gitignore           # Git ignore rules
├── package.json         # Dependencies and scripts
├── tailwind.config.js   # Tailwind CSS configuration
├── tsconfig.json        # TypeScript configuration
└── vite.config.ts       # Vite configuration
```

### File Naming Conventions

- **Components**: PascalCase (e.g., `ProductCard.tsx`)
- **Hooks**: camelCase starting with 'use' (e.g., `useProducts.ts`)
- **Utils**: camelCase (e.g., `formatPrice.ts`)
- **Types**: PascalCase (e.g., `Product.ts`)
- **Constants**: UPPER_SNAKE_CASE (e.g., `API_ENDPOINTS.ts`)
- **Pages**: PascalCase (e.g., `Home.tsx`)
- **Styles**: kebab-case (e.g., `product-card.css`)

## 🎯 Coding Standards

### TypeScript Guidelines

#### Type Definitions

```typescript
// Use interfaces for object shapes
interface Product {
  _id: string;
  name: string;
  price: number;
  discountPrice?: number;
  images: string[];
  category: Category;
  specifications: Record<string, string>;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// Use type aliases for unions and primitives
type ProductStatus = 'active' | 'inactive' | 'draft';
type SortOrder = 'asc' | 'desc';

// Use enums for constants
enum OrderStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  SHIPPED = 'shipped',
  DELIVERED = 'delivered',
  CANCELLED = 'cancelled',
}
```

#### Component Props

```typescript
// Define props interface
interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
  onQuickView?: (product: Product) => void;
  variant?: 'default' | 'compact';
  className?: string;
}

// Use React.FC with props
const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onAddToCart,
  onQuickView,
  variant = 'default',
  className = '',
}) => {
  // Component implementation
};
```

#### Event Handlers

```typescript
// Define event handler types
type ButtonClickHandler = (event: React.MouseEvent<HTMLButtonElement>) => void;
type InputChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => void;
type FormSubmitHandler = (event: React.FormEvent<HTMLFormElement>) => void;

// Use in components
const handleClick: ButtonClickHandler = (event) => {
  event.preventDefault();
  // Handle click
};

const handleInputChange: InputChangeHandler = (event) => {
  const value = event.target.value;
  // Handle input change
};
```

### React Best Practices

#### Component Structure

```typescript
// 1. Imports (external libraries first, then internal)
import React, { useState, useEffect, useCallback } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { ShoppingCart, Heart } from 'lucide-react';

import { useCart } from '../context/CartContext';
import { Product } from '../types';
import { formatPrice } from '../utils/helpers';
import { Button } from './common/Button';

// 2. Type definitions
interface ComponentProps {
  // Props definition
}

// 3. Component definition
const Component: React.FC<ComponentProps> = ({ prop1, prop2 }) => {
  // 4. Hooks (state, effects, custom hooks)
  const [state, setState] = useState(initialValue);
  const { data, isLoading } = useQuery(['key'], fetchFunction);
  
  // 5. Event handlers
  const handleClick = useCallback(() => {
    // Handler logic
  }, [dependencies]);
  
  // 6. Effects
  useEffect(() => {
    // Effect logic
  }, [dependencies]);
  
  // 7. Render logic
  if (isLoading) return <Loader />;
  
  return (
    <div>
      {/* JSX content */}
    </div>
  );
};

// 8. Export
export default Component;
```

#### State Management

```typescript
// Use useState for local state
const [count, setCount] = useState(0);

// Use useReducer for complex state
const [state, dispatch] = useReducer(reducer, initialState);

// Use custom hooks for reusable logic
const { products, isLoading, error } = useProducts(filters);

// Use Context for global state
const { addToCart, removeFromCart } = useCart();
```

#### Performance Optimization

```typescript
// Memoize expensive calculations
const expensiveValue = useMemo(() => {
  return heavyCalculation(data);
}, [data]);

// Memoize callbacks
const handleClick = useCallback(() => {
  onClick(id);
}, [id, onClick]);

// Memoize components
const MemoizedComponent = React.memo(Component);

// Use lazy loading for routes
const LazyComponent = React.lazy(() => import('./Component'));
```

### CSS/Styling Guidelines

#### Tailwind CSS Usage

```typescript
// Use utility classes
<div className="flex items-center justify-between p-4 bg-white rounded-lg shadow-sm">

// Use conditional classes
<button className={`px-4 py-2 rounded ${isActive ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}>

// Use clsx or cn for complex conditions
import { cn } from '../utils/helpers';

<button className={cn(
  'px-4 py-2 rounded transition-colors',
  isActive && 'bg-blue-500 text-white',
  !isActive && 'bg-gray-200 text-gray-700',
  disabled && 'opacity-50 cursor-not-allowed'
)}>
```

#### Custom CSS Classes

```css
/* Use component-specific classes */
.product-card {
  @apply group overflow-hidden hover:shadow-lg transition-shadow duration-300;
}

.product-card-image {
  @apply relative aspect-square overflow-hidden;
}

/* Use CSS custom properties for theming */
:root {
  --primary-color: #f97316;
  --secondary-color: #22c55e;
}

.custom-button {
  background-color: var(--primary-color);
  color: white;
}
```

## 🧪 Testing Guidelines

### Testing Strategy

```typescript
// Component Testing
import { render, screen, fireEvent } from '@testing-library/react';
import { ProductCard } from '../ProductCard';

describe('ProductCard', () => {
  const mockProduct = {
    _id: '1',
    name: 'Test Product',
    price: 100,
    images: ['test.jpg'],
    category: { _id: '1', name: 'Test Category' },
  };

  it('renders product information correctly', () => {
    render(<ProductCard product={mockProduct} onAddToCart={jest.fn()} />);
    
    expect(screen.getByText('Test Product')).toBeInTheDocument();
    expect(screen.getByText('$100.00')).toBeInTheDocument();
  });

  it('calls onAddToCart when button is clicked', () => {
    const mockAddToCart = jest.fn();
    render(<ProductCard product={mockProduct} onAddToCart={mockAddToCart} />);
    
    fireEvent.click(screen.getByText('Add to Cart'));
    expect(mockAddToCart).toHaveBeenCalledWith(mockProduct);
  });
});
```

### API Testing

```typescript
// Mock API responses
import { rest } from 'msw';
import { setupServer } from 'msw/node';

const server = setupServer(
  rest.get('/api/products', (req, res, ctx) => {
    return res(
      ctx.json({
        data: mockProducts,
        pagination: { page: 1, totalPages: 1 },
      })
    );
  })
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
```

### E2E Testing

```typescript
// Cypress E2E tests
describe('Product Purchase Flow', () => {
  it('should allow user to add product to cart and checkout', () => {
    cy.visit('/products');
    cy.get('[data-testid="product-card"]').first().click();
    cy.get('[data-testid="add-to-cart"]').click();
    cy.get('[data-testid="cart-count"]').should('contain', '1');
    cy.visit('/cart');
    cy.get('[data-testid="checkout-button"]').click();
    cy.url().should('include', '/checkout');
  });
});
```

## 🔧 Development Tools

### VS Code Extensions

Recommended extensions for development:

```json
{
  "recommendations": [
    "esbenp.prettier-vscode",
    "bradlc.vscode-tailwindcss",
    "ms-vscode.vscode-typescript-next",
    "ms-vscode.vscode-eslint",
    "formulahendry.auto-rename-tag",
    "christian-kohler.path-intellisense",
    "ms-vscode.vscode-json",
    "redhat.vscode-yaml"
  ]
}
```

### VS Code Settings

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "emmet.includeLanguages": {
    "typescript": "html",
    "typescriptreact": "html"
  },
  "tailwindCSS.includeLanguages": {
    "typescript": "html",
    "typescriptreact": "html"
  }
}
```

### Debugging

#### React Developer Tools

```typescript
// Add debugging helpers
const useDebug = (value: any, label?: string) => {
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      console.log(label || 'Debug:', value);
    }
  }, [value, label]);
};

// Usage
const MyComponent = () => {
  const [state, setState] = useState(initialValue);
  useDebug(state, 'Component State');
  
  return <div>Component content</div>;
};
```

#### Error Boundaries

```typescript
class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
    // Log to error reporting service
  }

  render() {
    if (this.state.hasError) {
      return <ErrorFallback error={this.state.error} />;
    }

    return this.props.children;
  }
}
```

## 📦 Build and Deployment

### Build Process

```bash
# Development build
npm run dev

# Production build
npm run build

# Preview production build
npm run preview

# Type checking
npm run type-check

# Linting
npm run lint
npm run lint:fix
```

### Build Optimization

```typescript
// vite.config.ts
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          router: ['react-router-dom'],
          query: ['@tanstack/react-query'],
        },
      },
    },
  },
  server: {
    port: 3000,
    proxy: {
      '/api': 'http://localhost:5000',
    },
  },
});
```

### Environment-Specific Builds

```bash
# Development
npm run build:dev

# Staging
npm run build:staging

# Production
npm run build:prod
```

## 🚀 Performance Guidelines

### Bundle Size Optimization

```typescript
// Lazy load components
const LazyComponent = React.lazy(() => import('./Component'));

// Dynamic imports
const loadComponent = async () => {
  const { Component } = await import('./Component');
  return Component;
};

// Tree shaking
import { specificFunction } from 'large-library';
// Instead of: import * as library from 'large-library';
```

### Image Optimization

```typescript
// Use optimized image component
const OptimizedImage: React.FC<ImageProps> = ({ src, alt, ...props }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div ref={imgRef} {...props}>
      {isInView && (
        <img
          src={src}
          alt={alt}
          onLoad={() => setIsLoaded(true)}
          className={`transition-opacity duration-300 ${
            isLoaded ? 'opacity-100' : 'opacity-0'
          }`}
        />
      )}
    </div>
  );
};
```

### Memory Management

```typescript
// Cleanup effects
useEffect(() => {
  const subscription = subscribe();
  
  return () => {
    subscription.unsubscribe();
  };
}, []);

// Cleanup event listeners
useEffect(() => {
  const handleResize = () => {
    // Handle resize
  };
  
  window.addEventListener('resize', handleResize);
  
  return () => {
    window.removeEventListener('resize', handleResize);
  };
}, []);
```

## 🔍 Code Review Guidelines

### Review Checklist

- [ ] **Functionality**: Does the code work as expected?
- [ ] **Performance**: Are there any performance issues?
- [ ] **Security**: Are there any security vulnerabilities?
- [ ] **Accessibility**: Is the code accessible?
- [ ] **Testing**: Are there adequate tests?
- [ ] **Documentation**: Is the code well-documented?
- [ ] **Standards**: Does the code follow project standards?
- [ ] **Dependencies**: Are dependencies appropriate and up-to-date?

### Review Process

1. **Self Review**: Review your own code before submitting
2. **Peer Review**: Have at least one team member review
3. **Automated Checks**: Ensure all automated checks pass
4. **Testing**: Verify all tests pass
5. **Documentation**: Update documentation if needed

## 🐛 Troubleshooting

### Common Issues

#### Build Errors

```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install

# Check TypeScript errors
npm run type-check

# Check ESLint errors
npm run lint
```

#### Runtime Errors

```typescript
// Add error boundaries
<ErrorBoundary>
  <Component />
</ErrorBoundary>

// Use try-catch for async operations
try {
  const result = await apiCall();
} catch (error) {
  console.error('API call failed:', error);
}
```

#### Performance Issues

```typescript
// Profile components
import { Profiler } from 'react';

const onRenderCallback = (id, phase, actualDuration) => {
  console.log('Render time:', actualDuration);
};

<Profiler id="Component" onRender={onRenderCallback}>
  <Component />
</Profiler>
```

### Debugging Tools

- **React Developer Tools**: Component inspection
- **Redux DevTools**: State management debugging
- **Network Tab**: API request debugging
- **Console**: Error logging and debugging
- **Performance Tab**: Performance profiling

This comprehensive development guide provides all the necessary information for developers to work effectively on the frontend application, from setup to deployment and troubleshooting.
