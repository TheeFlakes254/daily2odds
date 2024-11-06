<!-- src/lib/components/Navbar.svelte -->
<script>
    import PocketBase from 'pocketbase';
    import { goto } from '$app/navigation';
    import { isAuthenticated, updateAuth } from '$lib/stores/auth';
    import { onMount, beforeUpdate } from 'svelte';
    import { fade, fly } from 'svelte/transition';
    import { page } from '$app/stores';

    const pb = new PocketBase('https://odds.pockethost.io');
    
    let scrollY = 0;
    let prevScrollY = 0;
    let isNavVisible = true;
    let hasScrolled = false;
    let activeDropdown = false;
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
        activeDropdown = false;
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

    const toggleDropdown = () => {
        activeDropdown = !activeDropdown;
    };

    const handleClickOutside = (event) => {
        const dropdown = document.querySelector('.user-dropdown');
        const userButton = document.querySelector('.user-button');
        
        if (activeDropdown && dropdown && !dropdown.contains(event.target) && 
            userButton && !userButton.contains(event.target)) {
            activeDropdown = false;
        }
    };

    $: isActive = (path) => $page.url.pathname === path;
</script>

<svelte:window on:click={handleClickOutside} />

<nav
    class="fixed w-full z-50 transition-all duration-300 ease-in-out {isNavVisible ? 'top-0' : '-top-full'} 
           {hasScrolled ? 'bg-white/95 backdrop-blur-md shadow-md' : 'bg-white'}"
>
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-16">
            {#if $isAuthenticated}
                <!-- Logged in state -->
                <div class="w-full flex items-center justify-between">
                    <!-- Desktop Logo -->
                    <div 
                        class="hidden md:flex items-center cursor-pointer transform hover:scale-105 transition-transform duration-200" 
                        on:click={() => handleNavigation('/')}
                    >
                        <img src="/logo.png" alt="Logo" class="w-12 h-12 mr-2">
                        <span class="text-blue-600 font-bold text-xl">Daily <span class="text-orange-600 text-4xl align-middle">2</span> Odds</span>
                    </div>

                    <!-- Mobile Centered Logo -->
                    <div class="md:hidden w-full absolute left-0 flex justify-center">
                        <div 
                            class="flex items-center cursor-pointer transform hover:scale-105 transition-transform duration-200" 
                            on:click={() => handleNavigation('/')}
                        >
                            <img src="/logo.png" alt="Logo" class="w-12 h-12 mr-2">
                            <span class="text-blue-600 font-bold text-xl">Daily <span class="text-orange-600 text-4xl align-middle">2</span> Odds</span>
                        </div>
                    </div>

                    <!-- Right Side Controls -->
                    <div class="flex items-center space-x-4 z-10">
                        <!-- User Profile Dropdown -->
                        <div class="relative">
                            <button
                                class="user-button flex items-center space-x-2 p-2 rounded-full hover:bg-gray-100 transition-colors duration-200"
                                on:click={toggleDropdown}
                            >
                                <!-- User Icon SVG -->
                                <svg class="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                            </button>

                            {#if activeDropdown}
                                <div
                                    class="user-dropdown absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 ring-1 ring-black ring-opacity-5"
                                    transition:fade={{ duration: 200 }}
                                >
                                    <div class="px-4 py-2 text-sm text-gray-700 border-b">
                                        {#if userProfile?.email}
                                            <p class="font-medium">{userProfile.email}</p>
                                        {/if}
                                    </div>
                                    <button
                                        class="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                                        on:click={handleLogout}
                                    >
                                        <!-- Logout Icon SVG -->
                                        <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                        </svg>
                                        Logout
                                    </button>
                                </div>
                            {/if}
                        </div>
                    </div>
                </div>
            {:else}
                <!-- Not logged in state -->
                <div
                    class="flex items-center cursor-pointer transform hover:scale-105 transition-transform duration-200"
                    on:click={() => handleNavigation('/')}
                >
                    <img src="/logo.png" alt="Logo" class="w-12 h-12 mr-2">
                    <span class="text-blue-600 font-bold text-xl">Daily <span class="text-orange-600 text-4xl align-middle">2</span> Odds</span>
                </div>

                <!-- Desktop Menu -->
                <ul class="hidden md:flex items-center space-x-8">
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
                    
                    <li>
                        <button
                            on:click={() => handleNavigation('/login')}
                            class="bg-[#064b67] text-white px-6 py-2 rounded-full font-medium hover:bg-[#053a51] transform hover:scale-105 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#064b67]"
                            in:fly={{ y: -20, duration: 300 }}
                        >
                            Login
                        </button>
                    </li>
                </ul>

                <!-- Mobile Login Button -->
                <button 
                    on:click={() => handleNavigation('/login')}
                    class="md:hidden bg-[#064b67] text-white px-6 py-2 rounded-full font-medium hover:bg-[#053a51] transform hover:scale-105 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#064b67]"
                >
                    Login
                </button>
            {/if}
        </div>
    </div>
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