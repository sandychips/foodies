# Foodies Frontend - Development Guide для Warp Code

## 🎯 МЕТА
Розробити повнофункціональний React Frontend для платформи Foodies з інтеграцією до Backend API.

## 📋 ТЕХНІЧНІ ВИМОГИ

### Stack:
- **React 18+** з функціональними компонентами
- **TypeScript** для type safety
- **CSS Modules** для стилізації
- **React Router** для маршрутизації
- **Axios** для HTTP запитів
- **React Query** для server state
- **React Context** для глобального стану

### Responsive дизайн:
- **Mobile**: 320px-767px (гумова верстка)
- **Tablet**: 768px-1439px  
- **Desktop**: 1440px+

## 🏗️ СТРУКТУРА ПРОЕКТУ

```
foodies-frontend/
├── public/
│   ├── index.html
│   ├── favicon.ico
│   └── icons/                    # SVG sprite
├── src/
│   ├── components/              
│   │   ├── shared/              # Базові компоненти
│   │   │   ├── Button/
│   │   │   ├── Input/
│   │   │   ├── Modal/
│   │   │   └── Loader/
│   │   ├── layout/              # Layout компоненти
│   │   │   ├── Header/
│   │   │   ├── Footer/
│   │   │   └── SharedLayout/
│   │   ├── auth/                # Автентифікація
│   │   │   ├── SignInModal/
│   │   │   ├── SignUpModal/
│   │   │   └── LogOutModal/
│   │   ├── recipe/              # Рецепти
│   │   │   ├── RecipeCard/
│   │   │   ├── RecipeList/
│   │   │   ├── RecipeForm/
│   │   │   └── RecipeDetails/
│   │   └── user/                # Користувач
│   │       ├── UserProfile/
│   │       ├── UserBar/
│   │       └── AuthBar/
│   ├── pages/                   # Сторінки
│   │   ├── HomePage/
│   │   ├── AddRecipePage/
│   │   ├── UserPage/
│   │   ├── RecipeDetailsPage/
│   │   └── FavoritesPage/
│   ├── hooks/                   # Custom hooks
│   │   ├── useAuth.js
│   │   ├── useApi.js
│   │   └── useLocalStorage.js
│   ├── context/                 # React Context
│   │   ├── AuthContext.js
│   │   └── ThemeContext.js
│   ├── services/                # API сервіси
│   │   ├── api.js
│   │   ├── authService.js
│   │   ├── recipeService.js
│   │   └── userService.js
│   ├── utils/                   # Утиліти
│   │   ├── constants.js
│   │   ├── helpers.js
│   │   └── validation.js
│   ├── styles/                  # Глобальні стилі
│   │   ├── globals.module.css
│   │   ├── variables.module.css
│   │   └── mixins.module.css
│   ├── App.js
│   ├── App.module.css
│   └── index.js
├── package.json
├── .env.example
├── .env.local
├── .gitignore
└── README.md
```

## 🚀 ПОЧАТКОВЕ НАЛАШТУВАННЯ

### 1. Створення React проекту

```bash
npx create-react-app foodies-frontend --template typescript
cd foodies-frontend

# Або з Vite (швидша альтернатива)
npm create vite@latest foodies-frontend -- --template react-ts
cd foodies-frontend
npm install
```

### 2. Встановлення залежностей

```bash
# Core dependencies
npm install axios react-router-dom @tanstack/react-query

# UI та стилі
npm install classnames

# Development dependencies
npm install -D @types/node @types/react @types/react-dom
```

### 3. Налаштування package.json

```json
{
  "name": "foodies-frontend",
  "version": "1.0.0",
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test",
    "eject": "react-scripts eject",
    "type-check": "tsc --noEmit",
    "lint": "eslint src --ext .ts,.tsx",
    "lint:fix": "eslint src --ext .ts,.tsx --fix"
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.8.0",
    "axios": "^1.3.0",
    "@tanstack/react-query": "^4.24.0",
    "classnames": "^2.3.2"
  },
  "devDependencies": {
    "@types/react": "^18.0.0",
    "@types/react-dom": "^18.0.0",
    "typescript": "^4.9.0"
  }
}
```

### 4. Environment Variables

```bash
# .env.example
REACT_APP_API_BASE_URL=http://localhost:5000/api/v1
REACT_APP_API_TIMEOUT=10000
REACT_APP_CLOUDINARY_UPLOAD_PRESET=your-upload-preset
REACT_APP_CLOUDINARY_CLOUD_NAME=your-cloud-name

# .env.local (для локальної розробки)
REACT_APP_API_BASE_URL=http://localhost:5000/api/v1
REACT_APP_API_TIMEOUT=10000
```

## 🔧 БАЗОВІ СЕРВІСИ

### API Service (src/services/api.js)

```typescript
import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL,
  timeout: Number(process.env.REACT_APP_API_TIMEOUT) || 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor для додавання токену
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor для обробки помилок
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('authToken');
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);

export default api;
```

### Auth Context (src/context/AuthContext.js)

```typescript
import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { authService } from '../services/authService';

interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  loading: boolean;
}

const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
  loading: true,
};

const AuthContext = createContext<{
  state: AuthState;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}>({
  state: initialState,
  login: async () => {},
  register: async () => {},
  logout: () => {},
});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Implementation...
};
```

## 🎨 КОМПОНЕНТНА АРХІТЕКТУРА

### Базові компоненти

#### Button Component (src/components/shared/Button/)

```typescript
// Button.tsx
import React from 'react';
import classNames from 'classnames';
import styles from './Button.module.css';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'small' | 'medium' | 'large';
  loading?: boolean;
  icon?: React.ReactNode;
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'medium',
  loading = false,
  icon,
  fullWidth = false,
  className,
  disabled,
  ...props
}) => {
  return (
    <button
      className={classNames(
        styles.button,
        styles[variant],
        styles[size],
        {
          [styles.loading]: loading,
          [styles.fullWidth]: fullWidth,
        },
        className
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading && <span className={styles.spinner} />}
      {icon && <span className={styles.icon}>{icon}</span>}
      {children}
    </button>
  );
};
```

```css
/* Button.module.css */
.button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  border: none;
  border-radius: 8px;
  font-family: inherit;
  font-weight: 500;
  text-decoration: none;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
}

.primary {
  background-color: var(--primary-color);
  color: var(--white);
  
  &:hover:not(:disabled) {
    background-color: var(--primary-dark);
  }
}

.secondary {
  background-color: var(--secondary-color);
  color: var(--white);
  
  &:hover:not(:disabled) {
    background-color: var(--secondary-dark);
  }
}

.small {
  padding: 8px 16px;
  font-size: 14px;
}

.medium {
  padding: 12px 24px;
  font-size: 16px;
}

.large {
  padding: 16px 32px;
  font-size: 18px;
}

.fullWidth {
  width: 100%;
}
```

### Layout Components

#### Header Component (src/components/layout/Header/)

```typescript
// Header.tsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { Logo } from '../Logo/Logo';
import { Navigation } from '../Navigation/Navigation';
import { UserBar } from '../../user/UserBar/UserBar';
import { AuthBar } from '../../user/AuthBar/AuthBar';
import styles from './Header.module.css';

export const Header: React.FC = () => {
  const { state } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <Logo />
        
        {state.isAuthenticated && (
          <Navigation 
            isMobileOpen={isMobileMenuOpen}
            onMobileToggle={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          />
        )}
        
        <div className={styles.authSection}>
          {state.isAuthenticated ? <UserBar /> : <AuthBar />}
        </div>
      </div>
    </header>
  );
};
```

## 📱 RESPONSIVE DESIGN

### CSS Variables (src/styles/variables.module.css)

```css
:root {
  /* Colors */
  --primary-color: #3B82F6;
  --primary-dark: #2563EB;
  --secondary-color: #10B981;
  --secondary-dark: #059669;
  --accent-color: #F59E0B;
  --text-primary: #111827;
  --text-secondary: #6B7280;
  --text-light: #9CA3AF;
  --white: #FFFFFF;
  --gray-100: #F3F4F6;
  --gray-200: #E5E7EB;
  --gray-300: #D1D5DB;
  --error: #EF4444;
  --success: #10B981;
  --warning: #F59E0B;
  
  /* Typography */
  --font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  --font-size-xs: 12px;
  --font-size-sm: 14px;
  --font-size-base: 16px;
  --font-size-lg: 18px;
  --font-size-xl: 20px;
  --font-size-2xl: 24px;
  --font-size-3xl: 32px;
  
  /* Spacing */
  --spacing-xs: 4px;
  --spacing-sm: 8px;
  --spacing-base: 16px;
  --spacing-lg: 24px;
  --spacing-xl: 32px;
  --spacing-2xl: 48px;
  --spacing-3xl: 64px;
  
  /* Breakpoints */
  --mobile-max: 767px;
  --tablet-min: 768px;
  --tablet-max: 1439px;
  --desktop-min: 1440px;
  
  /* Layout */
  --container-max-width: 1200px;
  --header-height: 80px;
  --footer-height: 200px;
  
  /* Border radius */
  --radius-sm: 4px;
  --radius-base: 8px;
  --radius-lg: 12px;
  --radius-xl: 16px;
  --radius-full: 9999px;
  
  /* Shadows */
  --shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
  --shadow-base: 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1);
  --shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
  
  /* Transitions */
  --transition-fast: 0.15s ease;
  --transition-base: 0.2s ease;
  --transition-slow: 0.3s ease;
  
  /* Z-index */
  --z-dropdown: 100;
  --z-modal: 1000;
  --z-tooltip: 2000;
}
```

### Media Queries Mixins (src/styles/mixins.module.css)

```css
/* Mobile First approach */
.mobile-only {
  @media (max-width: 767px) {
    @content;
  }
}

.tablet-up {
  @media (min-width: 768px) {
    @content;
  }
}

.desktop-up {
  @media (min-width: 1440px) {
    @content;
  }
}

.tablet-only {
  @media (min-width: 768px) and (max-width: 1439px) {
    @content;
  }
}

/* Container mixin */
.container {
  width: 100%;
  max-width: var(--container-max-width);
  margin: 0 auto;
  padding: 0 var(--spacing-base);
  
  @media (min-width: 768px) {
    padding: 0 var(--spacing-lg);
  }
}

/* Flex utilities */
.flex-center {
  display: flex;
  align-items: center;
  justify-content: center;
}

.flex-between {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

/* Typography utilities */
.text-truncate {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.text-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
```

## 🔄 STATE MANAGEMENT

### React Query Setup (src/App.js)

```typescript
import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './context/AuthContext';
import { AppRoutes } from './routes/AppRoutes';
import './styles/globals.module.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
```

## 📋 ЗАВДАННЯ ДЛЯ WARP CODE

### ФАЗА 1: Базова структура (День 1-2)

1. **Створити React проект** з TypeScript
2. **Налаштувати базову структуру папок**
3. **Створити базові компоненти:**
   - Button
   - Input
   - Modal
   - Loader
4. **Налаштувати CSS змінні та міксини**
5. **Створити API service з Axios**

### ФАЗА 2: Автентифікація (День 3-4)

1. **AuthContext та useAuth hook**
2. **Модальні вікна автентифікації:**
   - SignInModal
   - SignUpModal  
   - LogOutModal
3. **AuthBar та UserBar компоненти**
4. **Інтеграція з Backend API**

### ФАЗА 3: Layout та навігація (День 5-6)

1. **Header з навігацією**
2. **Footer**
3. **SharedLayout**
4. **Responsive burger menu**
5. **React Router налаштування**

### ФАЗА 4: Сторінки та рецепти (День 7-10)

1. **HomePage з lists рецептів**
2. **RecipeCard компонент**
3. **RecipeDetailsPage**
4. **AddRecipePage з формою**
5. **UserPage профіль**
6. **FavoritesPage**

### ФАЗА 5: Інтерактивність (День 11-12)

1. **Пошук та фільтрація**
2. **Пагінація**
3. **Улюблені рецепти**
4. **Підписки на користувачів**
5. **Upload аватарок та фото**

### ФАЗА 6: Поліровка (День 13-14)

1. **Error boundaries**
2. **Loading states**
3. **Responsive тестування**
4. **Performance оптимізація**
5. **Deploy на Vercel**

## 🚀 КОМАНДИ ДЛЯ РОЗРОБКИ

```bash
# Старт розробки
npm start

# Type checking
npm run type-check

# Linting
npm run lint
npm run lint:fix

# Build для production
npm run build

# Тестування build локально
npx serve -s build
```

## 📚 КОРИСНІ РЕСУРСИ

- [React Query Docs](https://tanstack.com/query/latest)
- [React Router Docs](https://reactrouter.com/en/main)
- [CSS Modules Guide](https://github.com/css-modules/css-modules)
- [TypeScript React Cheatsheet](https://react-typescript-cheatsheet.netlify.app/)
- [Figma Design System](./figma-design-tokens.md)

---

**✅ РЕЗУЛЬТАТ:** Повнофункціональний React Frontend з TypeScript, інтегрований з Backend API, готовий до deployment на Vercel.