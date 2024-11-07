<!-- src/lib/components/Navbar.svelte -->
<script>
    import PocketBase from 'pocketbase';
    import { goto } from '$app/navigation';
    import { isAuthenticated, updateAuth } from '$lib/stores/auth';
    import { onMount } from 'svelte';
    import { fade, fly } from 'svelte/transition';
    import { page } from '$app/stores';

    const pb = new PocketBase('https://odds.pockethost.io');
    
    let scrollY = 0;
    let prevScrollY = 0;
    let isNavVisible = true;
    let hasScrolled = false;
    let isMobileMenuOpen = false;
    let userProfile = null;

    onMount(async () => {
        if ($isAuthenticated && pb.authStore.model) {
            userProfile = pb.authStore.model;
        }

        const handleScroll = () => {
            scrollY = window.scrollY;
            hasScrolled = true;

            if (scrollY > prevScrollY && scrollY > 80) {
                isNavVisible = false;
            } else {
                isNavVisible = true;
            }

            prevScrollY = scrollY;
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    });

    const handleNavigation = async (route) => {
        isMobileMenuOpen = false;
        try {
            await goto(route);
        } catch (error) {
            console.error('Navigation error:', error);
        }
    };

    const handleLogout = async () => {
        try {
            pb.authStore.clear();
            updateAuth(false, null);
            await goto('/login');
        } catch (error) {
            console.error('Logout error:', error);
        }
    };

    const toggleMobileMenu = () => {
        isMobileMenuOpen = !isMobileMenuOpen;
    };

    $: isActive = (path) => $page.url.pathname === path;
</script>

<nav
    class="fixed w-full z-50 transition-all duration-300 ease-in-out {isNavVisible ? 'top-0' : '-top-full'} 
           {hasScrolled ? 'bg-white/95 backdrop-blur-md shadow-md' : 'bg-white'}"
>
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-16">
            {#if $isAuthenticated}
                <!-- Logged in state -->
                <div class="w-full flex items-center justify-between">
                    <!-- Logo (left-aligned on desktop, centered on mobile) -->
                    <div 
                        class="flex items-center cursor-pointer transform hover:scale-105 transition-transform duration-200 {!$isAuthenticated ? 'md:ml-0' : ''}" 
                        class:mx-auto={$isAuthenticated && window.innerWidth < 768}
                        on:click={() => handleNavigation('/')}
                    >
                        <img src="/logo.png" alt="Logo" class="w-12 h-12 mr-2">
                        <span class="text-blue-600 font-bold text-xl">Daily <span class="text-orange-600 text-4xl align-middle">2</span> Odds</span>
                    </div>

                    <!-- Logout button (only visible on desktop) -->
                    
                </div>
            {:else}
                <!-- Not logged in state -->
                <!-- Logo (left-aligned) -->
                <div
                    class="flex items-center cursor-pointer transform hover:scale-105 transition-transform duration-200"
                    on:click={() => handleNavigation('/')}
                >
                    <img src="/logo.png" alt="Logo" class="w-12 h-12 mr-2">
                    <span class="text-blue-600 font-bold text-xl">Daily <span class="text-orange-600 text-4xl align-middle">2</span> Odds</span>
                </div>

                <!-- Desktop Navigation (centered) -->
                <div class="hidden md:flex items-center justify-center flex-1">
                    <ul class="flex items-center space-x-8">
                        {#each ['about-us', 'contact', 'faq'] as route}
                            <li>
                                <button 
                                    on:click={() => handleNavigation(`/${route}`)}
                                    class="relative group px-3 py-2 text-gray-700 font-medium hover:text-blue-600 transition-colors duration-200"
                                    class:text-blue-600={isActive(`/${route}`)}
                                >
                                    {route.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                                    {#if isActive(`/${route}`)}
                                        <div class="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600" 
                                             transition:fade={{ duration: 200 }}></div>
                                    {:else}
                                        <div class="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 scale-x-0 group-hover:scale-x-100 transition-transform duration-200"></div>
                                    {/if}
                                </button>
                            </li>
                        {/each}
                    </ul>
                </div>

                <!-- Desktop Login Button (right-aligned) -->
                <button
                    class="hidden md:block bg-[#064b67] text-white px-6 py-2 rounded-full font-medium hover:bg-[#053a51] transform hover:scale-105 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#064b67]"
                    on:click={() => handleNavigation('/login')}
                >
                    Login
                </button>

                <!-- Mobile Burger Menu -->
                <button
                    class="md:hidden p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                    on:click={toggleMobileMenu}
                >
                    <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d={isMobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
                    </svg>
                </button>
            {/if}
        </div>
    </div>

    <!-- Mobile Menu Dropdown -->
    {#if !$isAuthenticated && isMobileMenuOpen}
        <div
            class="md:hidden"
            transition:fade={{ duration: 200 }}
        >
            <div class="px-2 pt-2 pb-3 space-y-1">
                {#each ['about-us', 'contact', 'faq'] as route}
                    <button
                        class="block w-full px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                        class:bg-gray-50={isActive(`/${route}`)}
                        on:click={() => handleNavigation(`/${route}`)}
                    >
                        {route.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                    </button>
                {/each}
                <button
                    class="block w-full px-3 py-2 rounded-md text-base font-medium bg-[#064b67] text-white hover:bg-[#053a51]"
                    on:click={() => handleNavigation('/login')}
                >
                    Login
                </button>
            </div>
        </div>
    {/if}
</nav>

<!-- Spacer to prevent content from being hidden under fixed navbar -->
<div class="h-16"></div>

<style>
    :global(html) {
        scroll-behavior: smooth;
    }

    .transition-all {
        transition-property: all;
        transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
        transition-duration: 300ms;
    }

    .backdrop-blur-md {
        backdrop-filter: blur(12px);
        -webkit-backdrop-filter: blur(12px);
    }
</style>