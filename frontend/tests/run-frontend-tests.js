#!/usr/bin/env node

/* global process */

import registerModule from 'esbuild-register/dist/node';
import assert from 'node:assert/strict';
import { JSDOM } from 'jsdom';
import { screen, waitFor, cleanup } from '@testing-library/react';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { createRequire } from 'module';

const { register } = registerModule;
register({ extensions: ['.jsx'], jsx: 'automatic' });

const require = createRequire(import.meta.url);
const Module = require('module');
const originalResolveFilename = Module._resolveFilename;
Module._resolveFilename = function patchedResolve(request, parent, ...rest) {
  if (request.includes('/services/api')) {
    return originalResolveFilename.call(this, './tests/stubs/api.js', parent, ...rest);
  }
  if (!request.startsWith('node:') && !request.endsWith('.js')) {
    try {
      return originalResolveFilename.call(this, `${request}.js`, parent, ...rest);
    } catch {
      // fall through to default resolution
    }
  }
  return originalResolveFilename.call(this, request, parent, ...rest);
};

const { default: App } = await import('../src/App.jsx');
const { renderWithProviders } = await import('../src/test-utils.jsx');

const dom = new JSDOM('<!doctype html><html><body></body></html>', {
  url: 'http://localhost/',
});

globalThis.window = dom.window;
globalThis.document = dom.window.document;
globalThis.navigator = dom.window.navigator;

globalThis.localStorage = {
  store: {},
  getItem(key) {
    return this.store[key] ?? null;
  },
  setItem(key, value) {
    this.store[key] = value;
  },
  removeItem(key) {
    delete this.store[key];
  },
  clear() {
    this.store = {};
  },
};

const baseUsersState = {
  user: null,
  token: null,
  followers: { items: [], total: 0, isLoading: false, error: null },
  followees: { items: [], total: 0, isLoading: false, error: null },
  profileUser: null,
  isLoading: false,
  error: null,
  isSignInOpen: false,
};

async function testUnauthRedirect() {
  const { store } = renderWithProviders(
    React.createElement(
      MemoryRouter,
      { initialEntries: ['/recipe/add'] },
      React.createElement(App, null),
    ),
    {
      preloadedState: {
        users: baseUsersState,
      },
    },
  );

  await waitFor(() => {
    assert.equal(store.getState().users.isSignInOpen, true);
  });

  const heading = screen.getByRole('heading', { name: /improve your/i });
  assert.ok(heading, 'Expected hero heading to be visible');
  cleanup();
}

async function testAuthorizedForm() {
  const preloadedState = {
    users: {
      ...baseUsersState,
      user: { id: 'user-1', name: 'Chef Test', email: 'chef@test.dev' },
    },
    categories: {
      items: [
        { id: 'cat-1', name: 'Dessert', description: 'Sweet treats', lowerName: 'dessert' },
      ],
      pagination: null,
      isLoading: false,
      error: null,
    },
    areas: {
      items: [{ id: 'area-1', name: 'Italian' }],
      isLoading: false,
      error: null,
    },
    ingredients: {
      items: [{ id: 'ing-1', name: 'Sugar', image: null }],
      isLoading: false,
      error: null,
    },
    recipes: {
      items: [],
      pagination: { page: 1, pages: 1, limit: 8, total: 0 },
      filters: { categoryId: null, areaId: null, ingredientId: null },
      currentRecipe: null,
      favorites: [],
      ownRecipes: [],
      popularRecipes: [],
      isLoading: false,
      error: null,
    },
    testimonials: {
      items: [],
      isLoading: false,
      error: null,
    },
    userRecipes: {},
  };

  renderWithProviders(
    React.createElement(
      MemoryRouter,
      { initialEntries: ['/recipe/add'] },
      React.createElement(App, null),
    ),
    {
      preloadedState,
    },
  );

  await waitFor(() => {
    const publishButton = screen.getByRole('button', { name: /publish/i });
    assert.ok(publishButton, 'Expected publish button to be rendered');
  });
  cleanup();
}

(async () => {
  await testUnauthRedirect();
  await testAuthorizedForm();
  console.log('Frontend integration tests passed');
})().catch((error) => {
  console.error('Frontend integration tests failed');
  console.error(error);
  process.exitCode = 1;
});
