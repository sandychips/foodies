# Foodies API Integration Guide

## 🔗 BASE URLs

- **Local Development:** `http://localhost:5000/api/v1`
- **Production:** `https://your-app.onrender.com/api/v1`
- **Swagger Docs:** `/api/docs`

## 🔐 Authentication

### JWT Token
Всі приватні endpoints потребують Bearer token в header:
```
Authorization: Bearer <jwt_token>
```

Token отримується після успішного login/register та зберігається в localStorage.

## 📚 API Endpoints

### 🔑 Authentication (`/auth`)

#### POST /auth/register
```typescript
// Request
interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

// Response
interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    user: {
      id: string;
      name: string;
      email: string;
      avatar?: string;
      createdAt: string;
    };
    token: string;
  };
}
```

#### POST /auth/login
```typescript
// Request
interface LoginRequest {
  email: string;
  password: string;
}

// Response: Same as RegisterResponse
```

#### POST /auth/logout (Private)
```typescript
// Response
interface LogoutResponse {
  success: boolean;
  message: string;
}
```

#### GET /auth/me (Private)
```typescript
// Response
interface CurrentUserResponse {
  success: boolean;
  data: {
    user: {
      id: string;
      name: string;
      email: string;
      avatar?: string;
      createdAt: string;
      stats: {
        recipesCount: number;
        favoritesCount: number;
        followersCount: number;
        followingCount: number;
      };
    };
  };
}
```

### 👥 Users (`/users`)

#### GET /users/current (Private)
```typescript
// Response: Same as /auth/me
```

#### GET /users/:id (Private)
```typescript
// Response
interface UserDetailsResponse {
  success: boolean;
  data: {
    user: {
      id: string;
      name: string;
      email: string;
      avatar?: string;
      stats: {
        recipesCount: number;
        followersCount: number;
      };
      isFollowing?: boolean; // if requested by different user
    };
  };
}
```

#### PATCH /users/avatar (Private)
```typescript
// Request (FormData)
const formData = new FormData();
formData.append('avatar', file);

// Response
interface UpdateAvatarResponse {
  success: boolean;
  message: string;
  data: {
    user: {
      id: string;
      avatar: string;
    };
  };
}
```

#### GET /users/followers (Private)
```typescript
// Response
interface FollowersResponse {
  success: boolean;
  data: {
    followers: Array<{
      id: string;
      name: string;
      avatar?: string;
    }>;
    total: number;
  };
}
```

#### GET /users/following (Private)
```typescript
// Response: Same structure as FollowersResponse
```

#### POST /users/:id/follow (Private)
```typescript
// Response
interface FollowResponse {
  success: boolean;
  message: string;
}
```

#### DELETE /users/:id/unfollow (Private)
```typescript
// Response: Same as FollowResponse
```

### 🍳 Recipes (`/recipes`)

#### GET /recipes (Public)
```typescript
// Query Parameters
interface RecipeQuery {
  page?: number;        // default: 1
  limit?: number;       // default: 12, max: 100
  categoryId?: string;  // UUID
  areaId?: string;      // UUID
  ingredientId?: string; // UUID
  search?: string;      // search in title/description
}

// Response
interface RecipesResponse {
  success: boolean;
  data: {
    recipes: Array<{
      id: string;
      title: string;
      description: string;
      thumb?: string;
      time: number;
      category: {
        id: string;
        name: string;
      };
      area: {
        id: string;
        name: string;
      };
      owner: {
        id: string;
        name: string;
        avatar?: string;
      };
      createdAt: string;
    }>;
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  };
}
```

#### POST /recipes (Private)
```typescript
// Request
interface CreateRecipeRequest {
  title: string;
  instructions: string;
  description: string;
  thumb?: string;
  time: number; // in minutes
  categoryId: string;
  areaId: string;
  ingredients: Array<{
    ingredientId: string;
    measure: string;
  }>;
}

// Response
interface RecipeResponse {
  success: boolean;
  message: string;
  data: {
    recipe: {
      id: string;
      title: string;
      instructions: string;
      description: string;
      thumb?: string;
      time: number;
      category: { id: string; name: string; };
      area: { id: string; name: string; };
      owner: { id: string; name: string; avatar?: string; };
      ingredients: Array<{
        id: string;
        name: string;
        measure: string;
      }>;
      createdAt: string;
    };
  };
}
```

#### GET /recipes/:id (Public)
```typescript
// Response: Same structure as POST /recipes response
```

#### DELETE /recipes/:id (Private)
```typescript
// Response
interface DeleteRecipeResponse {
  success: boolean;
  message: string;
}
```

#### GET /recipes/popular (Public)
```typescript
// Query: ?limit=10 (default)
// Response: Same structure as GET /recipes but sorted by popularity
```

#### GET /recipes/own (Private)
```typescript
// Query: Same as GET /recipes
// Response: Same structure as GET /recipes
```

#### POST /recipes/:id/favorite (Private)
```typescript
// Response
interface FavoriteResponse {
  success: boolean;
  message: string;
}
```

#### DELETE /recipes/:id/favorite (Private)
```typescript
// Response: Same as FavoriteResponse
```

#### GET /recipes/favorites (Private)
```typescript
// Query: Same as GET /recipes
// Response: Same structure as GET /recipes
```

### 📂 Categories (`/categories`)

#### GET /categories (Public)
```typescript
// Response
interface CategoriesResponse {
  success: boolean;
  data: {
    categories: Array<{
      id: string;
      name: string;
    }>;
  };
}
```

### 🌍 Areas (`/areas`)

#### GET /areas (Public)
```typescript
// Response: Same structure as CategoriesResponse
```

### 🥕 Ingredients (`/ingredients`)

#### GET /ingredients (Public)
```typescript
// Response
interface IngredientsResponse {
  success: boolean;
  data: {
    ingredients: Array<{
      id: string;
      name: string;
      image?: string;
    }>;
  };
}
```

### 💬 Testimonials (`/testimonials`)

#### GET /testimonials (Public)
```typescript
// Response
interface TestimonialsResponse {
  success: boolean;
  data: {
    testimonials: Array<{
      id: string;
      testimonial: string;
      owner: {
        id: string;
        name: string;
        avatar?: string;
      };
      createdAt: string;
    }>;
  };
}
```

## 🔧 Frontend Service Examples

### authService.js
```typescript
import api from './api';

export const authService = {
  register: async (data: RegisterRequest): Promise<AuthResponse> => {
    const response = await api.post('/auth/register', data);
    return response.data;
  },

  login: async (data: LoginRequest): Promise<AuthResponse> => {
    const response = await api.post('/auth/login', data);
    return response.data;
  },

  logout: async (): Promise<LogoutResponse> => {
    const response = await api.post('/auth/logout');
    return response.data;
  },

  getCurrentUser: async (): Promise<CurrentUserResponse> => {
    const response = await api.get('/auth/me');
    return response.data;
  },
};
```

### recipeService.js
```typescript
import api from './api';

export const recipeService = {
  getRecipes: async (params: RecipeQuery): Promise<RecipesResponse> => {
    const response = await api.get('/recipes', { params });
    return response.data;
  },

  getRecipeById: async (id: string): Promise<RecipeResponse> => {
    const response = await api.get(`/recipes/${id}`);
    return response.data;
  },

  createRecipe: async (data: CreateRecipeRequest): Promise<RecipeResponse> => {
    const response = await api.post('/recipes', data);
    return response.data;
  },

  deleteRecipe: async (id: string): Promise<DeleteRecipeResponse> => {
    const response = await api.delete(`/recipes/${id}`);
    return response.data;
  },

  addToFavorites: async (id: string): Promise<FavoriteResponse> => {
    const response = await api.post(`/recipes/${id}/favorite`);
    return response.data;
  },

  removeFromFavorites: async (id: string): Promise<FavoriteResponse> => {
    const response = await api.delete(`/recipes/${id}/favorite`);
    return response.data;
  },

  getFavorites: async (params: RecipeQuery): Promise<RecipesResponse> => {
    const response = await api.get('/recipes/favorites', { params });
    return response.data;
  },

  getPopular: async (limit = 10): Promise<RecipesResponse> => {
    const response = await api.get('/recipes/popular', { 
      params: { limit } 
    });
    return response.data;
  },
};
```

## 🎣 React Query Hooks

### useRecipes.js
```typescript
import { useQuery } from '@tanstack/react-query';
import { recipeService } from '../services/recipeService';

export const useRecipes = (params: RecipeQuery) => {
  return useQuery({
    queryKey: ['recipes', params],
    queryFn: () => recipeService.getRecipes(params),
    keepPreviousData: true,
  });
};

export const useRecipe = (id: string) => {
  return useQuery({
    queryKey: ['recipe', id],
    queryFn: () => recipeService.getRecipeById(id),
    enabled: !!id,
  });
};

export const usePopularRecipes = (limit = 10) => {
  return useQuery({
    queryKey: ['recipes', 'popular', limit],
    queryFn: () => recipeService.getPopular(limit),
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};
```

### useAuth.js
```typescript
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { authService } from '../services/authService';

export const useAuth = () => {
  const queryClient = useQueryClient();

  const loginMutation = useMutation({
    mutationFn: authService.login,
    onSuccess: (data) => {
      localStorage.setItem('authToken', data.data.token);
      queryClient.setQueryData(['currentUser'], data.data.user);
    },
  });

  const registerMutation = useMutation({
    mutationFn: authService.register,
    onSuccess: (data) => {
      localStorage.setItem('authToken', data.data.token);
      queryClient.setQueryData(['currentUser'], data.data.user);
    },
  });

  const logoutMutation = useMutation({
    mutationFn: authService.logout,
    onSuccess: () => {
      localStorage.removeItem('authToken');
      queryClient.clear();
    },
  });

  const currentUser = useQuery({
    queryKey: ['currentUser'],
    queryFn: authService.getCurrentUser,
    enabled: !!localStorage.getItem('authToken'),
  });

  return {
    login: loginMutation,
    register: registerMutation,
    logout: logoutMutation,
    currentUser,
    isAuthenticated: !!currentUser.data && !currentUser.isError,
  };
};
```

## ⚠️ Error Handling

### Error Response Structure
```typescript
interface ErrorResponse {
  success: false;
  message: string;
  errors?: Array<{
    field: string;
    message: string;
  }>;
}
```

### Common Error Codes
- **400** - Validation Error / Bad Request
- **401** - Unauthorized (invalid/expired token)
- **403** - Forbidden (insufficient permissions)  
- **404** - Not Found
- **409** - Conflict (duplicate email, etc.)
- **429** - Too Many Requests (rate limited)
- **500** - Internal Server Error

### Error Handling in Components
```typescript
const RecipeList = () => {
  const { data, error, isLoading } = useRecipes({ page: 1 });

  if (isLoading) return <Loader />;
  
  if (error) {
    return (
      <ErrorMessage>
        {error.response?.data?.message || 'Failed to load recipes'}
      </ErrorMessage>
    );
  }

  return (
    <div>
      {data?.data.recipes.map(recipe => (
        <RecipeCard key={recipe.id} recipe={recipe} />
      ))}
    </div>
  );
};
```

## 🔄 Loading States

### Global Loading States
```typescript
// In components
const { data, isLoading, isFetching, isError } = useQuery(...);

// isLoading - initial loading (no cached data)
// isFetching - any fetching state (including background refetch)
// isError - error state
```

### Mutation Loading States
```typescript
const mutation = useMutation({
  mutationFn: recipeService.createRecipe,
});

// mutation.isPending - mutation in progress
// mutation.isError - mutation failed
// mutation.isSuccess - mutation successful
```

## 🎯 Best Practices

1. **Token Management:**
   - Store JWT in localStorage
   - Auto-redirect on 401 errors
   - Clear token on logout

2. **Query Key Strategy:**
   - Use arrays: `['recipes', params]`
   - Include all parameters that affect the query
   - Use consistent naming

3. **Error Boundaries:**
   - Wrap main components in ErrorBoundary
   - Show fallback UI for unexpected errors

4. **Loading UX:**
   - Show skeleton loaders for content
   - Use optimistic updates where possible
   - Disable buttons during mutations

5. **Performance:**
   - Use `keepPreviousData` for pagination
   - Set appropriate `staleTime` for cached data
   - Implement infinite queries for large lists

---

**🔗 Swagger Documentation:** Доступна за адресою `/api/docs` для інтерактивного тестування всіх endpoints.