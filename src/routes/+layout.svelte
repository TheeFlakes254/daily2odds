<script>
  import { onMount } from 'svelte';
  import { session } from '$lib/stores/session';
  import { goto } from '$app/navigation';

  onMount(() => {
    session.init();
  });

  function handleLogout() {
    session.logout();
    goto('/login');
  }
</script>

<main>
  <slot />
</main>
