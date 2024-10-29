<!-- src/lib/components/Navbar.svelte -->
<script>
    import PocketBase from 'pocketbase';
    import { goto } from '$app/navigation';
    import { isAuthenticated, updateAuth } from '$lib/stores/auth';
    import { onMount } from 'svelte';
    import { fade, slide } from 'svelte/transition';

    const pb = new PocketBase('https://odds.pockethost.io');
    
    let isMenuOpen = false;

    // Toggle mobile menu
    const toggleMenu = () => {
        isMenuOpen = !isMenuOpen;
    };

    // Close menu explicitly
    const closeMenu = () => {
        isMenuOpen = false;
    };

    // Handle navigation with proper route changes
    const handleNavigation = async (route) => {
        closeMenu(); // Close mobile menu before navigation
        try {
            await goto(route);
        } catch (error) {
            console.error('Navigation error:', error);
        }
    };

    // Handle logout
    const handleLogout = async () => {
        try {
            pb.authStore.clear();
            updateAuth(false, null);
            closeMenu();
            await goto('/login');
        } catch (error) {
            console.error('Logout error:', error);
        }
    };

    // Close mobile menu on route change and cleanup
    onMount(() => {
        const handleClickOutside = (event) => {
            const mobileMenu = document.querySelector('.mobile-menu');
            const hamburgerButton = document.querySelector('.hamburger-button');
            
            if (isMenuOpen && mobileMenu && !mobileMenu.contains(event.target) && 
                hamburgerButton && !hamburgerButton.contains(event.target)) {
                closeMenu();
            }
        };

        document.addEventListener('click', handleClickOutside);

        return () => {
            document.removeEventListener('click', handleClickOutside);
            closeMenu();
        };
    });
</script>

<nav class="flex items-center justify-between p-4 bg-white shadow-md relative">
    <!-- Logo Section -->
    <div class="flex items-center cursor-pointer" on:click={() => handleNavigation('/')}>
        <img src="/logo.png" alt="Logo" class="w-12 h-12 mr-2">
        <span class="text-blue-600 font-bold text-xl">Daily <span class="text-orange-600 text-4xl align-middle">2</span> Odds</span>
    </div>

    <!-- Desktop Menu -->
    <ul class="hidden md:flex space-x-6 font-bold mx-auto text-1xl">
        <li>
            <button 
                on:click={() => handleNavigation('/about-us')}
                class="text-gray-700 hover:text-blue-600 hover:underline transition duration-300"
            >
                About us
            </button>
        </li>
        <li>
            <button 
                on:click={() => handleNavigation('/contact')}
                class="text-gray-700 hover:text-blue-600 hover:underline transition duration-300"
            >
                Contact
            </button>
        </li>
        <li>
            <button 
                on:click={() => handleNavigation('/faq')}
                class="text-gray-700 hover:text-blue-600 hover:underline transition duration-300"
            >
                FAQ
            </button>
        </li>
    </ul>

    <!-- Desktop Authentication Buttons -->
    <div class="hidden md:flex items-center space-x-4">
        {#if $isAuthenticated}
            <button
                on:click={handleLogout}
                class="bg-red-600 text-white px-4 py-2 rounded-md font-bold hover:bg-red-700 transition duration-300"
            >
                Logout
            </button>
        {:else}
            <button
                on:click={() => handleNavigation('/login')}
                class="bg-[#064b67] text-white px-4 py-2 rounded-md font-bold hover:bg-blue-700 transition duration-300"
            >
                Login
            </button>
        {/if}
    </div>

    <!-- Hamburger/Close Button for Mobile -->
    <button 
        on:click={toggleMenu}
        class="hamburger-button md:hidden text-gray-500 hover:text-gray-700 focus:outline-none"
        aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
    >
        <svg 
            class="h-6 w-6" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
        >
            {#if isMenuOpen}
                <path 
                    stroke-linecap="round" 
                    stroke-linejoin="round" 
                    stroke-width="2" 
                    d="M6 18L18 6M6 6l12 12"
                />
            {:else}
                <path 
                    stroke-linecap="round" 
                    stroke-linejoin="round" 
                    stroke-width="2" 
                    d="M4 6h16M4 12h16M4 18h16"
                />
            {/if}
        </svg>
    </button>

    <!-- Mobile Menu with Transitions -->
    {#if isMenuOpen}
        <div 
            class="mobile-menu absolute top-full left-0 right-0 bg-white shadow-md md:hidden z-50"
            in:slide={{ duration: 200 }}
            out:slide={{ duration: 200 }}
        >
            <ul class="flex flex-col space-y-4 p-4">
                <li>
                    <button 
                        on:click={() => handleNavigation('/about-us')}
                        class="block w-full text-left text-gray-700 hover:text-blue-600 hover:underline transition duration-300"
                    >
                        About us
                    </button>
                </li>
                <li>
                    <button 
                        on:click={() => handleNavigation('/contact')}
                        class="block w-full text-left text-gray-700 hover:text-blue-600 hover:underline transition duration-300"
                    >
                        Contact
                    </button>
                </li>
                <li>
                    <button 
                        on:click={() => handleNavigation('/faq')}
                        class="block w-full text-left text-gray-700 hover:text-blue-600 hover:underline transition duration-300"
                    >
                        FAQ
                    </button>
                </li>
                {#if $isAuthenticated}
                    <li>
                        <button
                            on:click={handleLogout}
                            class="inline-block w-full bg-red-600 text-white px-4 py-2 rounded-md font-bold hover:bg-red-700 transition duration-300"
                        >
                            Logout
                        </button>
                    </li>
                {:else}
                    <li>
                        <button 
                            on:click={() => handleNavigation('/login')}
                            class="inline-block w-full bg-[#064b67] text-white px-4 py-2 rounded-md font-bold hover:bg-blue-700 transition duration-300"
                        >
                            Login
                        </button>
                    </li>
                {/if}
            </ul>
        </div>
    {/if}
</nav>

<style>
    /* Add smooth transitions */
    .transition {
        transition-property: all;
        transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
        transition-duration: 200ms;
    }

    /* Ensure mobile menu appears above other content */
    .mobile-menu {
        position: absolute;
        z-index: 50;
    }

    /* Make buttons look like links when needed */
    button.text-gray-700 {
        background: none;
        border: none;
        padding: 0;
        font: inherit;
        cursor: pointer;
        outline: inherit;
    }
</style>