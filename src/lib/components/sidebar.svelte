<script>
    import { onMount } from 'svelte';
    import PocketBase from 'pocketbase';
    
    const pb = new PocketBase('https://odds.pockethost.io');

    export let isSidebarOpen = false;
    export let toggleSidebar;
    
    // State variables
    let userTier = 'free';
    let itemLimit = 2;
    let userId = '';
    let userEmail = '';
    let activeMenuItem = 'home';
    let notifications = 3;
    
    // Fetch user details
    async function fetchUserDetails() {
        try {
            const user = pb.authStore.model;
            userId = user?.id;
            userEmail = user?.email || 'guest@example.com';
            userTier = user?.tier || 'free';
            itemLimit = userTier === 'silver' ? 4 : userTier === 'gold' ? Infinity : 2;
        } catch (error) {
            console.error('Error fetching user details:', error);
        }
    }

    // Set active menu item
    const setActiveMenuItem = (item) => {
        activeMenuItem = item;
        // Close sidebar on menu item click in mobile view
        if (window.innerWidth < 768) {
            isSidebarOpen = false;
        }
    };

    onMount(async () => {
        await fetchUserDetails();
        
        // Add touch event listeners for mobile swipe
        let touchStartX = 0;
        let touchEndX = 0;
        
        document.addEventListener('touchstart', e => {
            touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });
        
        document.addEventListener('touchend', e => {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
        }, { passive: true });
        
        const handleSwipe = () => {
            const swipeThreshold = 50;
            if (touchEndX - touchStartX > swipeThreshold) {
                // Swipe right
                isSidebarOpen = true;
            } else if (touchStartX - touchEndX > swipeThreshold) {
                // Swipe left
                isSidebarOpen = false;
            }
        };
    });
</script>

<!-- Soccer Ball Toggle Button -->
<button
    class="fixed left-4 top-24 z-[60] md:hidden bg-white rounded-full p-3 shadow-lg cursor-pointer transform hover:scale-110 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#064b67] focus:ring-offset-2"
    class:rotate-ball={isSidebarOpen}
    on:click={toggleSidebar}
    aria-label="Toggle Menu"
>
    <svg 
        class="w-6 h-6 sm:w-8 sm:h-8" 
        viewBox="0 0 24 24" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
    >
        <circle cx="12" cy="12" r="11" fill="#064b67" stroke="white" stroke-width="2"/>
        <path 
            d="M12 3L15.5 7H8.5L12 3Z M3 12L7 8.5V15.5L3 12Z M21 12L17 15.5V8.5L21 12Z M12 21L8.5 17H15.5L12 21Z" 
            fill="white"
        />
        <path 
            d="M12 7L15 12L12 17L9 12L12 7Z" 
            fill="white"
        />
    </svg>
</button>

<!-- Sidebar Overlay -->
<div 
    class="md:hidden fixed inset-0 bg-black/50 z-[55] transition-all duration-300 backdrop-blur-sm
    {isSidebarOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}" 
    on:click={toggleSidebar}
></div>

<!-- Sidebar Content -->
<aside 
    class="fixed md:sticky top-0 left-0 w-[85vw] sm:w-[320px] md:w-[280px] h-screen bg-[#064b67] text-white transform 
    {isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 transition-transform duration-300 ease-out
    z-[58] flex flex-col md:top-6 md:h-[calc(100vh-2rem)] md:rounded-3xl md:mx-4 overflow-hidden shadow-2xl"
>
    <div class="flex flex-col h-full">
        <!-- Sidebar Header -->
        <div class="p-5 sm:p-6 border-b border-blue-600/50">
            <div class="flex items-center justify-between mb-3">
                <h1 class="text-lg font-medium truncate">{userEmail}</h1>
            </div>
            <div class="flex items-center justify-between bg-blue-600/50 rounded-lg p-3">
                <span class="text-sm font-medium">{userTier.toUpperCase()} TIER</span>
                <span class="text-xs bg-blue-500 px-3 py-1.5 rounded-full">
                    {itemLimit === Infinity ? 'Unlimited' : `${itemLimit} Picks/Day`}
                </span>
            </div>
        </div>
        
        <!-- Navigation -->
        <nav class="flex-1 overflow-y-auto py-4 scrollbar-thin scrollbar-thumb-blue-600/50 scrollbar-track-transparent">
            <div class="space-y-1.5 px-4">
                <a 
                    href="/" 
                    class="flex items-center px-4 py-3.5 rounded-lg {activeMenuItem === 'home' ? 'bg-blue-500' : 'hover:bg-blue-600/50'} 
                    transition-all duration-200 active:scale-98 touch-manipulation"
                    on:click={() => setActiveMenuItem('home')}
                >
                    <svg class="w-5 h-5 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                    </svg>
                    <span class="flex-1">Dashboard</span>
                    {#if notifications > 0}
                        <span class="bg-red-500 text-white text-xs px-2.5 py-1 rounded-full ml-2">
                            {notifications}
                        </span>
                    {/if}
                </a>

                <a 
                    href="/hot-picks" 
                    class="flex items-center px-4 py-3.5 rounded-lg {activeMenuItem === 'hot-picks' ? 'bg-blue-500' : 'hover:bg-blue-600/50'} 
                    transition-all duration-200 active:scale-98 touch-manipulation"
                    on:click={() => setActiveMenuItem('hot-picks')}
                >
                    <svg class="w-5 h-5 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                    <span class="flex-1">Hot Picks</span>
                    <span class="bg-yellow-400 text-[#064b67] text-xs px-2.5 py-1 rounded-full font-medium ml-2">
                        New
                    </span>
                </a>

                <a 
                    href="/news" 
                    class="flex items-center px-4 py-3.5 rounded-lg {activeMenuItem === 'live-bets' ? 'bg-blue-500' : 'hover:bg-blue-600/50'} 
                    transition-all duration-200 active:scale-98 touch-manipulation"
                    on:click={() => setActiveMenuItem('live-bets')}
                >
                    <svg class="w-5 h-5 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    <span class="flex-1">Latest News</span>
                </a>

                <a 
                    href="/premium" 
                    class="flex items-center px-4 py-3.5 rounded-lg {activeMenuItem === 'premium' ? 'bg-blue-500' : 'hover:bg-blue-600/50'} 
                    transition-all duration-200 active:scale-98 touch-manipulation"
                    on:click={() => setActiveMenuItem('premium')}
                >
                    <svg class="w-5 h-5 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                    <span class="flex-1">Premium Access</span>
                </a>
            </div>

            <!-- Account Section -->
            <div class="mt-6 pt-4 border-t border-blue-600/50">
                <h4 class="px-7 text-xs font-semibold uppercase text-white/70 mb-3">Account</h4>
                <div class="space-y-1.5 px-4">
                    <a 
                        href="/profile-settings" 
                        class="flex items-center px-4 py-3.5 rounded-lg {activeMenuItem === 'profile' ? 'bg-blue-500' : 'hover:bg-blue-600/50'} 
                        transition-all duration-200 active:scale-98 touch-manipulation"
                        on:click={() => setActiveMenuItem('profile')}
                    >
                        <svg class="w-5 h-5 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        <span class="flex-1">Profile Settings</span>
                    </a>

                    <a 
                        href="/payment" 
                        class="flex items-center px-4 py-3.5 rounded-lg {activeMenuItem === 'payment' ? 'bg-blue-500' : 'hover:bg-blue-600/50'} 
                        transition-all duration-200 active:scale-98 touch-manipulation"
                        on:click={() => setActiveMenuItem('payment')}
                    >
                        <svg class="w-5 h-5 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                        </svg>
                        <span class="flex-1">Payment Methods</span>
                    </a>

                    <a 
                        href="/notifications" 
                        class="flex items-center px-4 py-3.5 rounded-lg {activeMenuItem === 'notifications' ? 'bg-blue-500' : 'hover:bg-blue-600/50'} 
                        transition-all duration-200 active:scale-98 touch-manipulation"
                        on:click={() => setActiveMenuItem('notifications')}
                    >
                        <svg class="w-5 h-5 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                        </svg>
                        <span class="flex-1">Notifications</span>
                    </a>
                </div>
            </div>
        </nav>

        <!-- Premium Banner -->
        {#if userTier !== 'gold'}
            <div class="p-4 sm:p-5 border-t border-blue-600/50">
                <div class="bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-xl p-4 text-[#064b67] shadow-lg">
                    <h3 class="font-bold text-lg mb-2">Upgrade to Premium</h3>
                    <p class="text-sm mb-4">Get unlimited access to all premium features and VIP picks!</p>
                    <a 
                        href="/payment" 
                        class="block w-full bg-[#064b67] text-white text-center py-3 rounded-lg hover:bg-[#053b56] transition-colors font-medium
                        active:transform active:scale-98 touch-manipulation"
                        on:click={() => setActiveMenuItem('upgrade')}
                    >
                        Upgrade Now
                    </a>
                </div>
            </div>
        {/if}

        <!-- Footer -->
         <!-- Footer -->
        <div class="p-4 sm:p-5 border-t border-blue-600/50 mt-auto">
            <button 
                class="w-full px-4 py-3 border-2 border-red-400/50 text-red-400 rounded-lg hover:bg-red-400/10 
                transition-all duration-200 text-sm font-medium active:transform active:scale-98 touch-manipulation
                focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2 focus:ring-offset-[#064b67]"
                on:click={() => {
                    pb.authStore.clear();
                    window.location.href = '/login';
                }}
            >
                Sign Out
            </button>
        </div>
    </div>
</aside>

<style>
    /* Base Styles */
    :global(*) {
        -webkit-tap-highlight-color: transparent;
    }

    /* Rotating soccer ball animation */
    .rotate-ball {
        animation: rotateBall 0.5s cubic-bezier(0.4, 0, 0.2, 1);
    }

    @keyframes rotateBall {
        from {
            transform: rotate(0deg);
        }
        to {
            transform: rotate(360deg);
        }
    }

    /* Custom Scrollbar */
    nav::-webkit-scrollbar {
        width: 4px;
    }

    nav::-webkit-scrollbar-track {
        background: rgba(255, 255, 255, 0.1);
        border-radius: 2px;
    }

    nav::-webkit-scrollbar-thumb {
        background: rgba(255, 255, 255, 0.2);
        border-radius: 2px;
    }

    nav::-webkit-scrollbar-thumb:hover {
        background: rgba(255, 255, 255, 0.3);
    }

    /* Mobile Optimizations */
    @media (max-width: 768px) {
        aside {
            will-change: transform;
            transform: translateX(-100%);
            backface-visibility: hidden;
            perspective: 1000px;
        }

        aside.translate-x-0 {
            transform: translateX(0);
        }

        /* Improve touch target sizes */
        a, button {
            min-height: 44px;
        }
    }

    /* Active menu item indicator */
    .bg-blue-500 {
        position: relative;
    }

    .bg-blue-500::before {
        content: '';
        position: absolute;
        left: -8px;
        top: 50%;
        transform: translateY(-50%);
        width: 4px;
        height: 70%;
        background: white;
        border-radius: 0 2px 2px 0;
    }

    /* Animation for gradient background */
    .bg-gradient-to-r {
        background-size: 200% 200%;
        animation: gradient 3s ease infinite;
    }

    @keyframes gradient {
        0% {
            background-position: 0% 50%;
        }
        50% {
            background-position: 100% 50%;
        }
        100% {
            background-position: 0% 50%;
        }
    }

    /* Touch device optimizations */
    @media (hover: none) {
        .touch-manipulation {
            touch-action: manipulation;
        }
    }

    /* Active state animations */
    .active\:scale-98:active {
        transform: scale(0.98);
    }

    /* Performance optimizations */
    .transform {
        will-change: transform;
    }

    /* Smooth transitions */
    .transition-all {
        transition-property: all;
        transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
    }

    /* Ensure content is visible during transitions */
    .overflow-hidden {
        -webkit-backface-visibility: hidden;
        backface-visibility: hidden;
    }

    /* Safari-specific fixes */
    @supports (-webkit-touch-callout: none) {
        .fixed {
            --safe-area-inset-bottom: env(safe-area-inset-bottom);
            padding-bottom: var(--safe-area-inset-bottom);
        }
    }

    /* Reduce motion if preferred */
    @media (prefers-reduced-motion: reduce) {
        .transition-all,
        .rotate-ball,
        .bg-gradient-to-r {
            transition: none !important;
            animation: none !important;
        }
    }

    /* Enhanced focus states for accessibility */
    a:focus-visible,
    button:focus-visible {
        outline: 2px solid #ffffff;
        outline-offset: -2px;
        border-radius: 8px;
    }

    /* Improved contrast for text */
    .text-white\/70 {
        color: rgba(255, 255, 255, 0.85);
    }

    /* Better touch feedback */
    @media (hover: none) {
        a:active,
        button:active {
            background-color: rgba(59, 130, 246, 0.5);
        }
    }
</style>