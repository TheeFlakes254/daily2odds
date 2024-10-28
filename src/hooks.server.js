// src/hooks.server.js
import { redirect } from '@sveltejs/kit';
import PocketBase from 'pocketbase';

const pb = new PocketBase('https://odds.pockethost.io');

/** @type {import('@sveltejs/kit').Handle} */
export async function handle({ event, resolve }) {
    // Get the auth cookie
    const authCookie = event.cookies.get('pb_auth');

    // List of public routes that don't require authentication
    const publicRoutes = ['/login', '/signup', '/', '/about-us', '/contact', '/faq'];
    
    // Check if the current path is a protected route
    const isProtectedRoute = !publicRoutes.includes(event.url.pathname);

    // If it's a protected route and user is not authenticated
    if (isProtectedRoute && !authCookie) {
        throw redirect(303, '/login');
    }

    const response = await resolve(event);
    return response;
}