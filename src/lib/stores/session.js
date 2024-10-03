import { writable } from 'svelte/store';

export const session = writable({
    isLoggedIn: false,
    user: null
});
