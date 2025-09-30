# Foodies Design Reference for React Development

This directory contains the complete HTML/CSS/JS implementation of the Foodies website, which serves as a pixel-perfect reference for building the React frontend.

## 📁 Directory Structure

```
design/
├── index.html              # Complete HTML structure reference
├── css/
│   ├── variables.css        # Design tokens (colors, spacing, typography)
│   ├── base.css            # Global styles and resets
│   ├── components.css       # Individual component styles
│   ├── layout.css          # Page layout and sections
│   └── responsive.css       # Media queries and breakpoints
├── js/
│   └── main.js             # Interactive functionality reference
├── assets/
│   ├── images/             # Hero images and decorations from Figma
│   └── icons/              # Icon assets
├── README.md               # Full project documentation
└── REACT_REFERENCE.md      # This file
```

## 🎨 Design Tokens for React

### Colors (from `css/variables.css`)
```css
/* Primary Brand Colors */
--color-primary: #FF6B35;
--color-primary-dark: #E55A2E;
--color-primary-light: #FF8A65;

/* Gradients */
--gradient-primary: linear-gradient(135deg, #FF6B35 0%, #E55A2E 100%);
--gradient-hero: linear-gradient(135deg, #FF6B35 0%, #FF8A65 50%, #E55A2E 100%);

/* Category Colors */
--color-category-beef: #FFE4E1;
--color-category-breakfast: #FFF8DC;
--color-category-desserts: #F0E6FF;
/* ... see variables.css for complete list */
```

### Typography Scale
```css
/* Font Sizes - Desktop/Tablet */
--font-size-h1: 3.5rem;      /* 56px - Hero title */
--font-size-h2: 2.5rem;      /* 40px - Section titles */
--font-size-h3: 2rem;        /* 32px */
--font-size-h4: 1.5rem;      /* 24px */
--font-size-body-large: 1.125rem; /* 18px - Main text */
--font-size-body: 1rem;      /* 16px - Regular text */
--font-size-body-small: 0.875rem; /* 14px - Small text */

/* Font Weights */
--font-weight-light: 300;
--font-weight-regular: 400;
--font-weight-medium: 500;
--font-weight-semibold: 600;
--font-weight-bold: 700;
--font-weight-extrabold: 800;
```

### Spacing System (8px base)
```css
--space-1: 0.25rem;    /* 4px */
--space-2: 0.5rem;     /* 8px */
--space-3: 0.75rem;    /* 12px */
--space-4: 1rem;       /* 16px */
--space-6: 1.5rem;     /* 24px */
--space-8: 2rem;       /* 32px */
--space-12: 3rem;      /* 48px */
--space-16: 4rem;      /* 64px */
--space-20: 5rem;      /* 80px */
--space-32: 8rem;      /* 128px */
```

## 🧩 React Component Mapping

### 1. Header Component
**Reference**: Lines 24-74 in `index.html`
**Styles**: `.header` in `css/layout.css`

**Props needed**:
```typescript
interface HeaderProps {
  isAuthenticated?: boolean;
  user?: { name: string; email: string };
  onSignIn?: () => void;
  onSignUp?: () => void;
  onLogout?: () => void;
}
```

**Key Features**:
- Fixed positioning with backdrop blur
- Responsive navigation menu
- Authentication state management
- User profile dropdown

### 2. Hero Section Component
**Reference**: Lines 80-105 in `index.html`
**Styles**: `.hero` in `css/layout.css`

**Props needed**:
```typescript
interface HeroProps {
  title: string;
  description: string;
  ctaText?: string;
  onCtaClick?: () => void;
}
```

**Key Features**:
- Gradient background
- Responsive images with decorative elements
- Floating animations
- Call-to-action button

### 3. Categories Grid Component
**Reference**: Lines 108-280 in `index.html`
**Styles**: `.categories` in `css/layout.css` and `css/components.css`

**Props needed**:
```typescript
interface Category {
  id: string;
  name: string;
  color: string;
  height?: 'small' | 'medium' | 'large';
}

interface CategoriesProps {
  categories: Category[];
  onCategoryClick?: (categoryId: string) => void;
}
```

**Key Features**:
- Masonry-style responsive grid
- 11 different food categories with unique colors
- Hover animations and transitions
- Variable card heights

### 4. Testimonials Component
**Reference**: Lines 283-313 in `index.html`
**Styles**: `.testimonials` in `css/components.css`

**Props needed**:
```typescript
interface Testimonial {
  id: string;
  text: string;
  author: string;
}

interface TestimonialsProps {
  testimonials: Testimonial[];
  autoRotate?: boolean;
  interval?: number;
}
```

**Key Features**:
- Carousel with dot navigation
- Auto-rotation functionality
- Decorative quote icon
- Responsive text sizing

### 5. Modal Components
**Reference**: Lines 352-437 in `index.html`
**Styles**: `.modal` in `css/components.css`

**SignIn/SignUp Modal Props**:
```typescript
interface AuthModalProps {
  isOpen: boolean;
  type: 'signin' | 'signup';
  onClose: () => void;
  onSubmit: (data: AuthFormData) => void;
  onSwitchMode: () => void;
  loading?: boolean;
  error?: string;
}
```

**Key Features**:
- Form validation with real-time feedback
- Password visibility toggle
- Focus trapping and keyboard navigation
- Backdrop blur and animations

## 📱 Responsive Breakpoints

```css
/* Mobile First Approach */
--breakpoint-sm: 640px;   /* Small tablets */
--breakpoint-md: 768px;   /* Tablets */
--breakpoint-lg: 1024px;  /* Small desktop */
--breakpoint-xl: 1280px;  /* Large desktop */
--breakpoint-2xl: 1536px; /* Ultra-wide */
```

### Mobile Adjustments
- Hero: Single column layout with centered content
- Categories: Single column grid on mobile, 2 cols on small tablet
- Header: Hide navigation menu, show hamburger (not implemented in reference)
- Typography: Smaller font sizes (see mobile variables)

## ⚡ Interactive Features Reference

### Form Validation (`js/main.js` lines 190-296)
- Real-time validation on blur and input events
- Email format validation
- Password strength requirements (min 6 characters)
- Error display with accessibility support

### Modal Management (`js/main.js` lines 122-188)
- Focus trapping within modals
- Escape key to close
- Backdrop click to close
- Form reset on close

### Testimonial Carousel (`js/main.js` lines 335-372)
- Auto-rotation every 5 seconds
- Manual navigation with dots
- Smooth transitions between testimonials

## 🎯 Accessibility Features to Implement

1. **Skip Links**: Skip to main content
2. **ARIA Labels**: Proper labeling for screen readers
3. **Keyboard Navigation**: Full keyboard support
4. **Focus Management**: Visible focus indicators
5. **Semantic HTML**: Proper heading hierarchy
6. **Color Contrast**: WCAG AA compliant colors
7. **Reduced Motion**: Respect user preferences

## 🛠️ React Implementation Tips

### 1. State Management
```typescript
// Global app state
interface AppState {
  user: User | null;
  isAuthenticated: boolean;
  activeModal: 'signin' | 'signup' | null;
  currentTestimonial: number;
}
```

### 2. Custom Hooks Suggestions
```typescript
// useModal hook for modal management
const useModal = (initialState = false) => { /* ... */ }

// useForm hook for form validation
const useForm = (validationSchema) => { /* ... */ }

// useTestimonialCarousel for carousel logic
const useTestimonialCarousel = (testimonials, autoRotate = true) => { /* ... */ }
```

### 3. Styling Approach
- **Styled Components**: Use design tokens from variables.css
- **CSS Modules**: Import component-specific styles
- **Tailwind CSS**: Create custom config with design tokens
- **Emotion/Styled-system**: Theme-based styling

### 4. Animation Libraries
- **Framer Motion**: For scroll animations and transitions
- **React Spring**: For smooth animations
- **React Transition Group**: For modal and component transitions

## 📋 Development Checklist

- [ ] Set up React project with TypeScript
- [ ] Configure design tokens (colors, typography, spacing)
- [ ] Implement responsive grid system
- [ ] Build Header component with authentication
- [ ] Create Hero section with background images
- [ ] Develop Categories grid with masonry layout
- [ ] Build Testimonials carousel
- [ ] Implement Modal components with forms
- [ ] Add form validation and error handling
- [ ] Implement responsive design
- [ ] Add animations and transitions
- [ ] Test accessibility features
- [ ] Cross-browser testing

## 🔗 Asset Paths

All images are in `design/assets/images/`:
- `hero-main-image.png` - Main hero image (705x660)
- `hero-secondary-image.png` - Secondary hero image (296x277)
- `decoration-1.svg` to `decoration-4.svg` - Floating decorations

## 📖 Additional Resources

1. **HTML Structure**: `index.html` - Complete semantic markup
2. **Styling Reference**: All CSS files for exact styling
3. **JavaScript Logic**: `main.js` - Complete interactive functionality
4. **Design Documentation**: `README.md` - Full feature documentation

---

This reference implementation provides everything needed to build a pixel-perfect React version of the Foodies website. Use the HTML structure as a component guide, CSS for styling reference, and JavaScript for interaction patterns.