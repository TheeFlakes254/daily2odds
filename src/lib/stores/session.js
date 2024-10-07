// File: src/lib/stores/session.js
import { writable } from 'svelte/store';
import { browser } from '$app/environment';

const createSession = () => {
  const defaultValue = { isAuthenticated: false, user: null };
  
  // Initialize the store with the default value
  const { subscribe, set, update } = writable(defaultValue);

  return {
    subscribe,
    set: (value) => {
      if (browser) {
        localStorage.setItem('session', JSON.stringify(value));
      }
      set(value);
    },
    update,
    logout: () => {
      if (browser) {
        localStorage.removeItem('session');
        localStorage.removeItem('authToken');
      }
      set(defaultValue);
    },
    init: () => {
      if (browser) {
        const storedSession = localStorage.getItem('session');
        if (storedSession) {
          set(JSON.parse(storedSession));
        }
      }
    }
  };
};

export const session = createSession();