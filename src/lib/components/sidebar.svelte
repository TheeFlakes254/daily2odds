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
    let userMenuOpen = false;
    
    // Touch handling variables
    let touchStartX = 0;
    let touchEndX = 0;
    let minSwipeDistance = 50;

    // Handle touch start
    function handleTouchStart(event) {
        touchStartX = event.touches[0].clientX;
    }

    // Handle touch move
    function handleTouchMove(event) {
        touchEndX = event.touches[0].clientX;
    }

    // Handle touch end
    function handleTouchEnd() {
        const swipeDistance = touchEndX - touchStartX;
        
        if (swipeDistance > minSwipeDistance && !isSidebarOpen) {
            toggleSidebar();
        }
        else if (swipeDistance < -minSwipeDistance && isSidebarOpen) {
            toggleSidebar();
        }

        touchStartX = 0;
        touchEndX = 0;
    }

    // Close sidebar function
    const closeSidebar = () => {
        if (isSidebarOpen) {
            toggleSidebar();
        }
    };

    // Toggle user menu
    const toggleUserMenu = () => {
        userMenuOpen = !userMenuOpen;
    };

    // Set active menu item
    const setActiveMenuItem = (item) => {
        activeMenuItem = item;
        // Close sidebar on menu item click in mobile view
        if (window.innerWidth < 768) {
            closeSidebar();
        }
    };

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

    onMount(async () => {
        await fetchUserDetails();
    });
</script>

<div 
    class="md:hidden fixed inset-0 bg-black/50 z-20 transition-opacity duration-200 {isSidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}" 
    on:click={closeSidebar}
    on:touchstart={handleTouchStart}
    on:touchmove={handleTouchMove}
    on:touchend={handleTouchEnd}
></div>

<!-- Hamburger Menu Button for Mobile -->
<button 
    class="md:hidden fixed top-4 left-4 z-50 p-2 bg-[#064b67] text-white rounded-lg shadow-lg {isSidebarOpen ? 'hidden' : ''}"
    on:click={toggleSidebar}
>
    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
    </svg>
</button>

<aside 
    class="fixed md:sticky top-4 left-4 w-[280px] h-[calc(100vh-2rem)] bg-[#064b67] text-white transform {isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 transition-transform duration-200 ease-in-out z-30 flex flex-col rounded-3xl overflow-hidden shadow-xl md:mx-4"
    on:touchstart={handleTouchStart}
    on:touchmove={handleTouchMove}
    on:touchend={handleTouchEnd}
>
    <div class="flex flex-col h-full overflow-hidden">
        <!-- Sidebar Header with User Profile -->
        <div class="p-4 border-b border-blue-600/50">
            <div class="flex items-center justify-between mb-2">
                <h1 class="text-lg font-medium truncate">{userEmail}</h1>
                <button 
                    class="md:hidden p-2 hover:bg-blue-600/50 rounded-lg transition-colors" 
                    on:click={closeSidebar}
                    aria-label="Close sidebar"
                >
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>
            <div class="flex items-center justify-between bg-blue-600/50 rounded-lg p-2 mt-2">
                <span class="text-sm font-medium">{userTier.toUpperCase()} TIER</span>
                <span class="text-xs bg-blue-500 px-2 py-1 rounded-full">
                    {itemLimit === Infinity ? 'Unlimited' : `${itemLimit} Picks/Day`}
                </span>
            </div>
        </div>
        
        <!-- Navigation Menu -->
        <nav class="flex-1 overflow-y-auto py-4">
            <!-- Primary Navigation -->
            <div class="space-y-1 px-3">
                <a 
                    href="/" 
                    class="flex items-center px-4 py-3 rounded-lg {activeMenuItem === 'home' ? 'bg-blue-500' : 'hover:bg-blue-600/50'} transition-colors"
                    on:click={() => setActiveMenuItem('home')}
                >
                    <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                    </svg>
                    <span class="flex-1">Dashboard</span>
                    {#if notifications > 0}
                        <span class="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                            {notifications}
                        </span>
                    {/if}
                </a>

                <a 
                    href="/hot-picks" 
                    class="flex items-center px-4 py-3 rounded-lg {activeMenuItem === 'hot-picks' ? 'bg-blue-500' : 'hover:bg-blue-600/50'} transition-colors"
                    on:click={() => setActiveMenuItem('hot-picks')}
                >
                    <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                    <span class="flex-1">Hot Picks</span>
                    <span class="bg-yellow-400 text-[#064b67] text-xs px-2 py-1 rounded-full font-medium">
                        New
                    </span>
                </a>

                <a 
                    href="/live-bets" 
                    class="flex items-center px-4 py-3 rounded-lg {activeMenuItem === 'live-bets' ? 'bg-blue-500' : 'hover:bg-blue-600/50'} transition-colors"
                    on:click={() => setActiveMenuItem('live-bets')}
                >
                    <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    <span>Live Bets</span>
                </a>

                <a 
                    href="/premium" 
                    class="flex items-center px-4 py-3 rounded-lg {activeMenuItem === 'premium' ? 'bg-blue-500' : 'hover:bg-blue-600/50'} transition-colors"
                    on:click={() => setActiveMenuItem('premium')}
                >
                    <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                    <span>Premium Access</span>
                </a>
            </div>

            <!-- Account Management -->
            <div class="mt-4 pt-4 border-t border-blue-600/50">
                <h4 class="px-7 text-xs font-semibold uppercase text-white/70 mb-2">Account</h4>
                <div class="space-y-1 px-3">
                    <a 
                        href="/profile-settings" 
                        class="flex items-center px-4 py-3 rounded-lg {activeMenuItem === 'profile' ? 'bg-blue-500' : 'hover:bg-blue-600/50'} transition-colors"
                        on:click={() => setActiveMenuItem('profile')}
                    >
                        <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        <span>Profile Settings</span>
                    </a>

                    <a 
                        href="/payment" 
                        class="flex items-center px-4 py-3 rounded-lg {activeMenuItem === 'payment' ? 'bg-blue-500' : 'hover:bg-blue-600/50'} transition-colors"
                        on:click={() => setActiveMenuItem('payment')}
                    >
                        <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                        </svg>
                        <span>Payment Methods</span>
                    </a>

                    <a 
                        href="/notifications" 
                        class="flex items-center px-4 py-3 rounded-lg {activeMenuItem === 'notifications' ? 'bg-blue-500' : 'hover:bg-blue-600/50'} transition-colors"
                        on:click={() => setActiveMenuItem('notifications')}
                    >
                        <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                        </svg>
                        <span>Notifications</span>
                    </a>
                </div>
            </div>
        </nav>

        <!-- Premium Upgrade Banner -->
        {#if userTier !== 'gold'}
            <div class="p-4 border-t border-blue-600/50">
                <div class="bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-xl p-4 text-[#064b67]">
                    <h3 class="font-bold mb-1">Upgrade to Premium</h3>
                    <p class="text-sm mb-3">Get unlimited access to all premium features and VIP picks!</p>
                    <a 
                        href="/upgrade" 
                        class="block w-full bg-[#064b67] text-white text-center py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                        on:click={() => setActiveMenuItem('upgrade')}
                    >
                        Upgrade Now
                    </a>
                </div>
            </div>
        {/if}

        <!-- Footer -->
        <div class="p-4 border-t border-blue-600/50 mt-auto">
            <button 
                class="w-full px-4 py-2 border border-red-400/50 text-red-400 rounded-lg hover:bg-red-400/10 transition-colors text-sm font-medium"
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
    /* Scrollbar styling */
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

    /* Mobile optimizations */
    @media (max-width: 768px) {
        aside {
            top: 0;
            left: 0;
            border-radius: 0;
            height: 100vh;
            margin: 0;
            width: 85%;
            max-width: 280px;
        }
        
        /* Ensure smooth transition for sidebar */
        aside.translate-x-0,
        aside.-translate-x-full {
            transition: transform 0.2s ease-in-out;
        }
    }

    /* Hover animations */
    a, button {
        transition: all 0.2s ease;
    }

    a:active, button:active {
        transform: scale(0.98);
    }

    /* Close button hover effect */
    button.hover\:bg-blue-600\/50:hover {
        background-color: rgba(37, 99, 235, 0.5);
    }

    /* Gradient animations */
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

    /* Active menu item highlight */
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

    /* Ensure overlay click works properly */
    .pointer-events-none {
        pointer-events: none;
    }

    /* Improved touch handling for mobile */
    @media (hover: none) {
        a:hover, button:hover {
            transform: none;
        }
    }
</style>