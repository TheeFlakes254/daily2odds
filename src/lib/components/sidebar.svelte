<script>
    import { onMount } from 'svelte';
    import PocketBase from 'pocketbase';
    
    const pb = new PocketBase('https://odds.pockethost.io');

    export let isSidebarOpen = false;
    export let toggleSidebar;
    
    let userTier = 'free';
    let itemLimit = 2;
    let userId = '';
    let userEmail = '';
    let activeMenuItem = 'home';
    let notifications = 3;
    
    async function fetchUserDetails() {
        try {
            const user = pb.authStore.model;
            if (user) {
                userId = user.id;
                userEmail = user.email;
                userTier = user.tier || 'free';
                updateItemLimit(userTier);
            }
        } catch (error) {
            console.error('Error fetching user details:', error);
        }
    }

    function updateItemLimit(tier) {
        itemLimit = tier === 'silver' ? 4 : tier === 'gold' ? Infinity : 2;
    }

    $: {
        if (pb.authStore.isValid) {
            fetchUserDetails();
        }
    }

    async function handleUpgrade() {
        try {
            const nextTier = userTier === 'free' ? 'silver' : 'gold';
            await pb.collection('users').update(userId, {
                tier: nextTier
            });
            await fetchUserDetails();
        } catch (error) {
            console.error('Error upgrading tier:', error);
        }
    }

    const setActiveMenuItem = (item) => {
        activeMenuItem = item;
        if (window.innerWidth < 768) {
            isSidebarOpen = false;
        }
    };

    onMount(async () => {
        await fetchUserDetails();
        
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
                isSidebarOpen = true;
            } else if (touchStartX - touchEndX > swipeThreshold) {
                isSidebarOpen = false;
            }
        };

        // Subscribe to real-time updates
        pb.collection('users').subscribe(userId, function(e) {
            if (e.record.tier !== userTier) {
                fetchUserDetails();
            }
        });

        return () => {
            pb.collection('users').unsubscribe(userId);
        };
    });
</script>

<!-- Soccer Ball Toggle -->
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
        <path d="M12 3L15.5 7H8.5L12 3Z M3 12L7 8.5V15.5L3 12Z M21 12L17 15.5V8.5L21 12Z M12 21L8.5 17H15.5L12 21Z" fill="white"/>
        <path d="M12 7L15 12L12 17L9 12L12 7Z" fill="white"/>
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
    class="fixed md:sticky top-0 left-0 w-[85vw] sm:w-[320px] md:w-[280px] h-screen bg-gradient-to-b from-[#064b67] to-[#043a52] text-white transform 
    {isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 transition-transform duration-300 ease-out
    z-[58] flex flex-col md:top-6 md:h-[calc(100vh-2rem)] md:rounded-3xl md:mx-4 overflow-hidden shadow-2xl"
>
    <!-- User Profile Section -->
    <div class="p-6 bg-[#075575]/50 border-b border-blue-600/30">
        <div class="flex items-center space-x-3 mb-4">
            <div class="w-12 h-12 rounded-full bg-blue-500/30 flex items-center justify-center">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
            </div>
            <div>
                <h2 class="font-medium text-lg leading-tight">{userEmail}</h2>
                <div class="flex items-center mt-1">
                    <span class="text-xs font-medium bg-blue-500/30 px-2 py-1 rounded-full">
                        {userTier.toUpperCase()} TIER
                    </span>
                    <span class="text-xs text-blue-200/70 ml-2">
                        {itemLimit === Infinity ? 'Unlimited' : `${itemLimit} Games/Day`}
                    </span>
                </div>
            </div>
        </div>
    </div>

    <!-- Navigation Menu -->
    <nav class="flex-1 overflow-y-auto py-4 scrollbar-thin">
        <!-- Main Navigation -->
        <div class="px-4 mb-6">
            <h3 class="px-4 text-xs font-semibold uppercase text-blue-200/70 mb-2">Main Menu</h3>
            <div class="space-y-1">
                <a 
                    href="/" 
                    class="flex items-center px-4 py-3 rounded-xl transition-all duration-200 
                    {activeMenuItem === 'home' ? 'bg-white/10 shadow-lg' : 'hover:bg-white/5'}"
                    on:click={() => setActiveMenuItem('home')}
                >
                    <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                    </svg>
                    <span class="flex-1">Dashboard</span>
                    {#if notifications > 0}
                        <span class="bg-red-500/90 text-white text-xs px-2 py-0.5 rounded-full ml-2">
                            {notifications}
                        </span>
                    {/if}
                </a>

                <a 
                    href="/hot-picks" 
                    class="flex items-center px-4 py-3 rounded-xl transition-all duration-200 
                    {activeMenuItem === 'hot-picks' ? 'bg-white/10 shadow-lg' : 'hover:bg-white/5'}"
                    on:click={() => setActiveMenuItem('hot-picks')}
                >
                    <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                    <span class="flex-1">Hot Picks</span>
                    <span class="bg-yellow-400/90 text-[#064b67] text-xs px-2 py-0.5 rounded-full font-medium">
                        New
                    </span>
                </a>

                <a 
                    href="/news" 
                    class="flex items-center px-4 py-3 rounded-xl transition-all duration-200 
                    {activeMenuItem === 'live-bets' ? 'bg-white/10 shadow-lg' : 'hover:bg-white/5'}"
                    on:click={() => setActiveMenuItem('live-bets')}
                >
                    <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    <span class="flex-1">Latest News</span>
                </a>
            </div>
        </div>

        <!-- Account Section -->
        <div class="px-4">
            <h3 class="px-4 text-xs font-semibold uppercase text-blue-200/70 mb-2">Account</h3>
            <div class="space-y-1">
                <a 
                    href="/profile-settings" 
                    class="flex items-center px-4 py-3 rounded-xl transition-all duration-200 
                    {activeMenuItem === 'profile' ? 'bg-white/10 shadow-lg' : 'hover:bg-white/5'}"
                    on:click={() => setActiveMenuItem('profile')}
                >
                    <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <span class="flex-1">Profile Settings</span>
                </a>

                <a 
                    href="/notifications" 
                    class="flex items-center px-4 py-3 rounded-xl transition-all duration-200 
                    {activeMenuItem === 'notifications' ? 'bg-white/10 shadow-lg' : 'hover:bg-white/5'}"
                    on:click={() => setActiveMenuItem('notifications')}
                >
                    <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                    </svg>
                    <span class="flex-1">Notifications</span>
                </a>
            </div>
        </div>
    </nav>

    <!-- Dynamic Upgrade Banner -->
    {#if userTier !== 'gold'}
        <div class="p-4">
            <div class="bg-gradient-to-r from-yellow-400/90 to-yellow-500/90 rounded-xl p-5 text-[#064b67]">
                <div class="flex items-start mb-3">
                    <svg class="w-8 h-8 mr-3 text-[#064b67]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div>
                        <h3 class="font-bold text-lg">
                            {userTier === 'free' ? 'Unlock Premium Access' : 'Upgrade to Gold'}
                        </h3>
                        <p class="text-sm opacity-90">
                            {userTier === 'free' ? 'Get premium features & predictions!' : 'Unlimited access & VIP predictions!'}
                        </p>
                    </div>
                </div>
                <button 
                    class="block w-full bg-[#064b67] text-white text-center py-3 rounded-lg hover:bg-[#053b56] transition-colors font-medium
                    active:transform active:scale-98 touch-manipulation"
                    on:click={handleUpgrade}
                >
                    {userTier === 'free' ? 'Unlock Premium Access' : 'Unlock Gold Access'}
                </button>
            </div>
        </div>
        {/if}

    <!-- Sign Out Button -->
    <div class="p-4 mt-auto border-t border-blue-600/30">
        <button 
            class="w-full px-4 py-3 bg-red-500/10 text-red-400 border border-red-400/30 rounded-xl hover:bg-red-500/20 
            transition-all duration-200 text-sm font-medium active:transform active:scale-98 touch-manipulation
            focus:outline-none focus:ring-2 focus:ring-red-400/50 focus:ring-offset-2 focus:ring-offset-[#064b67]"
            on:click={() => {
                pb.authStore.clear();
                window.location.href = '/login';
            }}
        >
            Sign Out
        </button>
    </div>
</aside>

<style>
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

    /* Enhanced Scrollbar */
    nav::-webkit-scrollbar {
        width: 5px;
    }

    nav::-webkit-scrollbar-track {
        background: rgba(255, 255, 255, 0.05);
        border-radius: 3px;
    }

    nav::-webkit-scrollbar-thumb {
        background: rgba(255, 255, 255, 0.15);
        border-radius: 3px;
    }

    nav::-webkit-scrollbar-thumb:hover {
        background: rgba(255, 255, 255, 0.25);
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

        a, button {
            min-height: 44px;
        }
    }

    /* Enhanced active menu item indicator */
    .bg-white\/10 {
        position: relative;
        backdrop-filter: blur(8px);
    }

    .bg-white\/10::before {
        content: '';
        position: absolute;
        left: 0;
        top: 50%;
        transform: translateY(-50%);
        width: 3px;
        height: 60%;
        background: linear-gradient(to bottom, #fff, rgba(255, 255, 255, 0.5));
        border-radius: 0 2px 2px 0;
    }

    /* Animated gradient background */
    .bg-gradient-to-r {
        background-size: 200% 200%;
        animation: gradientShift 6s ease infinite;
    }

    @keyframes gradientShift {
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

    /* Touch optimizations */
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

    /* Content visibility during transitions */
    .overflow-hidden {
        -webkit-backface-visibility: hidden;
        backface-visibility: hidden;
    }

    /* Safari fixes */
    @supports (-webkit-touch-callout: none) {
        .fixed {
            --safe-area-inset-bottom: env(safe-area-inset-bottom);
            padding-bottom: var(--safe-area-inset-bottom);
        }
    }

    /* Reduced motion preferences */
    @media (prefers-reduced-motion: reduce) {
        .transition-all,
        .rotate-ball,
        .bg-gradient-to-r {
            transition: none !important;
            animation: none !important;
        }
    }

    /* Enhanced focus states */
    a:focus-visible,
    button:focus-visible {
        outline: 2px solid rgba(255, 255, 255, 0.5);
        outline-offset: -2px;
        border-radius: 12px;
    }

    /* Menu item hover effects */
    a:not(.bg-white\/10):hover {
        background: rgba(255, 255, 255, 0.05);
        transform: translateX(4px);
    }

    /* Enhanced text contrast */
    .text-blue-200\/70 {
        color: rgba(191, 219, 254, 0.85);
    }

    /* Smooth shadow transitions */
    .shadow-lg {
        transition: box-shadow 0.2s ease;
    }

    /* Card hover effects */
    .bg-gradient-to-r:hover {
        transform: translateY(-2px);
        box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
    }

    /* Navigation item transitions */
    nav a {
        transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
    }

    /* Better touch feedback */
    @media (hover: none) {
        a:active,
        button:active {
            background-color: rgba(255, 255, 255, 0.1);
        }
    }

    /* Glass morphism effects */
    .bg-white\/10 {
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        backdrop-filter: blur(12px);
        -webkit-backdrop-filter: blur(12px);
    }
</style>