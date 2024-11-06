<!-- src/lib/components/Sidebar.svelte -->
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
    let isDragging = false;
    let startX = 0;
    let currentX = 0;
    let sidebarWidth = 280;
    
    // Touch handling variables
    let touchStartX = 0;
    let touchEndX = 0;
    let minSwipeDistance = 50;

    // Handle drag start
    function handleDragStart(event) {
        isDragging = true;
        startX = event.type === 'touchstart' ? event.touches[0].clientX : event.clientX;
        currentX = startX;
        document.body.style.userSelect = 'none';
    }

    // Handle drag movement
    function handleDrag(event) {
        if (!isDragging) return;
        
        const clientX = event.type === 'touchmove' ? event.touches[0].clientX : event.clientX;
        const deltaX = clientX - startX;
        
        // If sidebar is closed, only allow opening from right to left
        if (!isSidebarOpen && deltaX < 0) {
            currentX = clientX;
            if (Math.abs(deltaX) > minSwipeDistance) {
                toggleSidebar();
                isDragging = false;
            }
        }
        // If sidebar is open, only allow closing from left to right
        else if (isSidebarOpen && deltaX > 0) {
            currentX = clientX;
            if (deltaX > minSwipeDistance) {
                toggleSidebar();
                isDragging = false;
            }
        }
    }

    // Handle drag end
    function handleDragEnd() {
        isDragging = false;
        document.body.style.userSelect = '';
    }

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
            closeSidebar();
        }
    };

    onMount(async () => {
        await fetchUserDetails();
        
        document.addEventListener('mousemove', handleDrag);
        document.addEventListener('mouseup', handleDragEnd);
        document.addEventListener('touchmove', handleDrag, { passive: true });
        document.addEventListener('touchend', handleDragEnd);

        return () => {
            document.removeEventListener('mousemove', handleDrag);
            document.removeEventListener('mouseup', handleDragEnd);
            document.removeEventListener('touchmove', handleDrag);
            document.removeEventListener('touchend', handleDragEnd);
        };
    });
</script>

<!-- Drag Handle -->
<div
    class="md:hidden fixed top-1/2 right-0 transform -translate-y-1/2 z-50 {isSidebarOpen ? 'translate-x-[280px]' : ''} transition-transform duration-300"
    on:mousedown={handleDragStart}
    on:touchstart={handleDragStart}
>
    <div class="bg-[#064b67] text-white p-2 rounded-l-lg shadow-lg cursor-grab active:cursor-grabbing">
        <svg 
            class="w-6 h-12 transform {isSidebarOpen ? 'rotate-180' : ''} transition-transform duration-300" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
        >
            <path 
                stroke-linecap="round" 
                stroke-linejoin="round" 
                stroke-width="2" 
                d="M9 5l7 7-7 7"
            />
        </svg>
    </div>
</div>

<!-- Sidebar Overlay -->
<div 
    class="md:hidden fixed inset-0 bg-black/50 z-20 transition-opacity duration-200 {isSidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}" 
    on:click={toggleSidebar}
></div>

<!-- Sidebar Content -->
<aside 
    class="fixed md:sticky top-0 left-0 w-[280px] h-screen bg-[#064b67] text-white transform {isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 transition-transform duration-300 ease-in-out z-30 flex flex-col overflow-hidden md:top-4 md:left-4 md:h-[calc(100vh-2rem)] md:rounded-3xl md:mx-4"
>
    <div class="flex flex-col h-full overflow-hidden">
        <!-- Sidebar Header -->
        <div class="p-4 border-b border-blue-600/50">
            <div class="flex items-center justify-between mb-2">
                <h1 class="text-lg font-medium truncate">{userEmail}</h1>
            </div>
            <div class="flex items-center justify-between bg-blue-600/50 rounded-lg p-2 mt-2">
                <span class="text-sm font-medium">{userTier.toUpperCase()} TIER</span>
                <span class="text-xs bg-blue-500 px-2 py-1 rounded-full">
                    {itemLimit === Infinity ? 'Unlimited' : `${itemLimit} Picks/Day`}
                </span>
            </div>
        </div>
        
        <!-- Navigation -->
        <nav class="flex-1 overflow-y-auto py-4">
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

            <!-- Account Section -->
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

        <!-- Premium Banner -->
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

    /* Handle styling */
    .cursor-grab {
        cursor: grab;
    }

    .cursor-grabbing {
        cursor: grabbing;
    }

    /* Improve touch handling */
    @media (hover: none) {
        .cursor-grab {
            cursor: default;
        }
    }

    /* Prevent text selection during drag */
    .user-select-none {
        user-select: none;
    }

    /* Smooth transitions */
    .transition-transform {
        transition-property: transform;
        transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
        transition-duration: 300ms;
    }

    /* Mobile optimizations */
    @media (max-width: 768px) {
        aside {
            width: 280px;
            top: 0;
            left: 0;
            border-radius: 0;
            height: 100vh;
            margin: 0;
        }
        
        /* Ensure smooth transition for sidebar */
        aside.translate-x-0,
        aside.-translate-x-full {
            transition: transform 0.2s ease-in-out;
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

    /* Hover animations */
    @media (hover: hover) {
        a:hover, button:hover {
            transform: translateX(4px);
        }
    }

    /* Touch device optimizations */
    @media (hover: none) {
        a:active, button:active {
            transform: scale(0.98);
        }
    }

    /* Performance optimizations */
    .transform {
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        will-change: transform;
    }

    /* Ensure overlay click works properly */
    .pointer-events-none {
        pointer-events: none;
    }

    /* Improve tap targets on mobile */
    @media (max-width: 768px) {
        a, button {
            min-height: 44px;
        }
    }

    /* Ensure content is visible during transitions */
    .overflow-hidden {
        -webkit-backface-visibility: hidden;
        backface-visibility: hidden;
    }
</style>