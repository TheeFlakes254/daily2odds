<script>
  import "../app.css";  // Import your global styles
  import Navbar from "$lib/components/navbar.svelte";
</script>

<div class="min-h-screen bg-gray-50">
  <Navbar />
  <main class="container mx-auto px-2 py-2">
    <slot />
  </main>
  <footer class="mt-auto py-4 text-center text-gray-600">
    <p>© {new Date().getFullYear()} Daily 2 Odds. All rights reserved.</p>
  </footer>
</div>

<style>
  :global(body) {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }
</style>