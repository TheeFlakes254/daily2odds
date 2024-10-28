// src/routes/+layout.server.js
import { redirect } from '@sveltejs/kit';
import PocketBase from 'pocketbase';

const pb = new PocketBase('https://odds.pockethost.io');

/** @type {import('./$types').LayoutServerLoad} */
export function load({ cookies, url }) {
    const authCookie = cookies.get('pb_auth');
    
    // If user is authenticated and tries to access login/signup pages
    if (authCookie && (url.pathname === '/login' || url.pathname === '/signup')) {
        throw redirect(303, '/homepage');
    }

    return {
        authenticated: !!authCookie
    };
}