<script>
    import { session } from '$lib/stores/session';

    // Clear session and localStorage, then redirect to login
    session.set({ isLoggedIn: false, user: null });
    localStorage.removeItem('user');

    // Redirect to login
    window.location.href = '/login';
</script>

<p>Logging out...</p>
