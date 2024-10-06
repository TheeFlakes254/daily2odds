<!-- src/routes/+page.svelte -->
<script>
  import { onMount } from 'svelte';
  import { fade } from 'svelte/transition';

  let visible = false;
  let typedText = "";
  const fullText = "Cabin In The Woods But In A Good Way!";
  let charIndex = 0;

  function typeText() {
    if (charIndex < fullText.length) {
      typedText += fullText[charIndex];
      charIndex++;
      setTimeout(typeText, 50); // Adjust the speed of typing here
    }
  }

  onMount(() => {
    visible = true;
    setTimeout(typeText, 500); // Start typing after a short delay
  });
</script>

<svelte:head>
  <title>Camply - Cabin In The Woods But In A Good Way!</title>
</svelte:head>

<main class="min-h-screen bg-gray-100">
  <nav class="container mx-auto px-4 py-6 flex justify-between items-center">
    <div class="flex items-center">
      <img src="/camply-logo.svg" alt="Camply logo" class="h-8 w-8 mr-2">
      <span class="text-2xl font-bold text-blue-600">Camply.</span>
    </div>
    <div class="flex space-x-6">
      <a href="/" class="text-gray-700 hover:text-blue-600">Home</a>
      <a href="/about" class="text-gray-700 hover:text-blue-600">About</a>
      <a href="/pricing" class="text-gray-700 hover:text-blue-600">Pricing</a>
      <a href="/contact" class="text-gray-700 hover:text-blue-600">Contact</a>
      <a href="/blog" class="text-gray-700 hover:text-blue-600">Blog</a>
    </div>
    <div class="flex space-x-4">
      <button class="px-4 py-2 text-gray-700 hover:text-blue-600">Login</button>
      <button class="px-4 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700">Register</button>
    </div>
  </nav>

  <section class="container mx-auto px-4 py-16 flex flex-col md:flex-row items-center">
    <div class="md:w-1/2 mb-8 md:mb-0">
      {#if visible}
        <h1 class="text-5xl font-bold leading-tight mb-6 h-32">
          {typedText}<span class="animate-blink">|</span>
        </h1>
        <p in:fade="{{ duration: 1000, delay: 300 }}" class="text-xl text-gray-600 mb-8">
          Now you can enjoy camping anywhere and anytime and of course it's safe with us.
        </p>
        <button in:fade="{{ duration: 1000, delay: 600 }}" class="px-8 py-4 bg-blue-600 text-white rounded-full text-lg hover:bg-blue-700 transition-colors">
          Get Started
        </button>
      {/if}
    </div>
    <div class="md:w-1/2 relative">
      {#if visible}
        <img 
          in:fade="{{ duration: 1000, delay: 900 }}"
          src="/phone-mockup.png" 
          alt="Camply app mockup" 
          class="w-full max-w-md mx-auto"
        >
        <svg class="absolute top-0 right-0 -z-10 text-blue-200" width="404" height="384" fill="none" viewBox="0 0 404 384">
          <defs>
            <pattern id="de316486-4a29-4312-bdfc-fbce2132a2c1" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
              <rect x="0" y="0" width="4" height="4" class="text-blue-200" fill="currentColor" />
            </pattern>
          </defs>
          <rect width="404" height="384" fill="url(#de316486-4a29-4312-bdfc-fbce2132a2c1)" />
        </svg>
        <div class="absolute -bottom-16 -left-16 w-80 h-80 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div class="absolute -bottom-8 left-40 w-80 h-80 bg-yellow-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
      {/if}
    </div>
  </section>
</main>

<style lang="postcss">
  @tailwind base;
  @tailwind components;
  @tailwind utilities;

  @layer utilities {
    .animation-delay-2000 {
      animation-delay: 2s;
    }
    .animate-blob {
      animation: blob 7s infinite;
    }
    .animate-blink {
      animation: blink 0.7s infinite;
    }
  }

  @keyframes blob {
    0% {
      transform: translate(0px, 0px) scale(1);
    }
    33% {
      transform: translate(30px, -50px) scale(1.1);
    }
    66% {
      transform: translate(-20px, 20px) scale(0.9);
    }
    100% {
      transform: translate(0px, 0px) scale(1);
    }
  }

  @keyframes blink {
    0%, 100% { opacity: 1; }
    50% { opacity: 0; }
  }
</style>