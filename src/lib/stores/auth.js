// src/lib/stores/auth.js
import { writable } from 'svelte/store';
import PocketBase from 'pocketbase';

const pb = new PocketBase('https://odds.pockethost.io');

// Initialize the store with the current auth state
export const isAuthenticated = writable(pb.authStore.isValid);
export const user = writable(pb.authStore.model);

// Update these when logging in/out
export function updateAuth(authStatus, userData = null) {
    isAuthenticated.set(authStatus);
    user.set(userData);
}

// Listen for changes in PocketBase auth state
pb.authStore.onChange((token, model) => {
    updateAuth(!!token, model);
});