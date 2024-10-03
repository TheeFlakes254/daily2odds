import { session } from '$lib/stores/session';

// The load function runs before the page is rendered
export async function load({ url }) {
    let isLoggedIn = false;
    
    session.subscribe((s) => {
        isLoggedIn = s.isLoggedIn;
    });

    if (!isLoggedIn) {
        // Redirect to the login page if the user is not logged in
        return {
            status: 302,
            redirect: '/login'
        };
    }

    return {}; // Allow access if logged in
}
