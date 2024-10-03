<script>
    import { session } from '$lib/stores/session';
    import '../app.css';
    
    // Check if running in the browser
    if (typeof window !== 'undefined') {
        $: if (localStorage.getItem('user')) {
            const userData = JSON.parse(localStorage.getItem('user'));
            session.set({
                isLoggedIn: true,
                user: userData
            });
        }
    }
</script>

<slot />
