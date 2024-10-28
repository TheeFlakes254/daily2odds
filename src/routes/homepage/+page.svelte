<script>
    import { onMount, onDestroy } from 'svelte';
    import PocketBase from 'pocketbase';

    const pb = new PocketBase('https://odds.pockethost.io');

    // State variables
    let recentWins = [];
    let loadingWins = true;
    let userTier = 'free';
    let itemLimit = 2;
    let userId = '';
    let isSidebarOpen = false;
    let activeMenuItem = 'home';
    let notifications = 3; // Example notification count
    let userMenuOpen = false;

    // Toggle sidebar function
    const toggleSidebar = () => {
        isSidebarOpen = !isSidebarOpen;
    };

    // Toggle user menu
    const toggleUserMenu = () => {
        userMenuOpen = !userMenuOpen;
    };

    // Set active menu item
    const setActiveMenuItem = (item) => {
        activeMenuItem = item;
    };

    // Fetch user details
    async function fetchUserDetails() {
        try {
            const user = pb.authStore.model;
            userId = user?.id;
            userTier = user?.tier || 'free';
            itemLimit = userTier === 'silver' ? 4 : userTier === 'gold' ? Infinity : 2;
        } catch (error) {
            console.error('Error fetching user details:', error);
        }
    }

    // Fetch recent wins
    async function fetchRecentWins() {
        try {
            const response = await pb.collection('recentwins').getFullList();
            recentWins = response.map(item => ({
                id: item.id,
                image: `https://odds.pockethost.io/api/files/recentwins/${item.id}/${item.wins}`,
                date: new Date(item.created).toLocaleDateString(),
                league: item.league || 'Soccer',
                teams: item.teams || 'Match Details',
                odds: item.odds || '1.95',
                profit: item.profit || '95.00'
            }));
        } catch (error) {
            console.error('Error fetching recent wins:', error);
        } finally {
            loadingWins = false;
        }
    }

    // Lifecycle hooks
    onMount(async () => {
        await fetchUserDetails();
        await fetchRecentWins();
    });
</script>


<div class="flex min-h-screen bg-gray-50" class:sidebar-open={isSidebarOpen}>
    <!-- Enhanced Sidebar -->
    <aside class="fixed md:static w-80 h-screen bg-[#064b67] text-white transform {isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 transition-transform duration-200 ease-in-out z-30">
        <div class="flex flex-col h-full">
            <!-- Sidebar Header -->
            <div class="px-6 py-6">
                <div class="flex items-center justify-between mb-6">
                    <img src="/logo.png" alt="Daily 2 Odds Logo" class="h-12" />
                    <button class="md:hidden" on:click={toggleSidebar}>
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
                
                <!-- User Profile Section -->
                <div class="relative">
                    <button 
                        class="flex items-center w-full p-3 rounded-lg hover:bg-blue-600 transition-colors"
                        on:click={toggleUserMenu}
                    >
                        <div class="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center mr-3">
                            <span class="text-lg font-bold">
                                {userTier[0].toUpperCase()}
                            </span>
                        </div>
                        <div class="flex-1 text-left">
                            <p class="font-medium">User Account</p>
                            <p class="text-sm text-white/75">{userTier} Member</p>
                        </div>
                        <svg class="w-5 h-5 transform {userMenuOpen ? 'rotate-180' : ''}" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                        </svg>
                    </button>
                    
                    {#if userMenuOpen}
                        <div class="absolute w-full mt-2 py-2 bg-blue-700 rounded-lg shadow-lg">
                            <a href="/profile" class="block px-4 py-2 hover:bg-blue-600">Profile Settings</a>
                            <a href="/preferences" class="block px-4 py-2 hover:bg-blue-600">Preferences</a>
                            <hr class="my-2 border-blue-600" />
                            <button class="w-full text-left px-4 py-2 text-red-300 hover:bg-blue-600">
                                Sign Out
                            </button>
                        </div>
                    {/if}
                </div>
            </div>

            <!-- Navigation Menu -->
            <nav class="flex-1 px-4 space-y-2 overflow-y-auto">
                <!-- Main Navigation -->
                <div class="space-y-2">
                    <a 
                        href="/" 
                        class="flex items-center px-4 py-3 rounded-lg {activeMenuItem === 'home' ? 'bg-blue-500' : 'hover:bg-blue-600'} transition-colors"
                        on:click={() => setActiveMenuItem('home')}
                    >
                        <svg class="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                        </svg>
                        <span class="flex-1">Home</span>
                        {#if notifications > 0}
                            <span class="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                                {notifications}
                            </span>
                        {/if}
                    </a>

                    <a 
                        href="/hot-picks" 
                        class="flex items-center px-4 py-3 rounded-lg {activeMenuItem === 'hot-picks' ? 'bg-blue-500' : 'hover:bg-blue-600'} transition-colors"
                        on:click={() => setActiveMenuItem('hot-picks')}
                    >
                        <svg class="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                        </svg>
                        <span>Hot Picks</span>
                        <span class="ml-auto text-xs bg-yellow-400 text-[#064b67] px-2 py-1 rounded-full">
                            New
                        </span>
                    </a>

                    <a 
                        href="/live-bets" 
                        class="flex items-center px-4 py-3 rounded-lg {activeMenuItem === 'live-bets' ? 'bg-blue-500' : 'hover:bg-blue-600'} transition-colors"
                        on:click={() => setActiveMenuItem('live-bets')}
                    >
                        <svg class="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                        <span>Live Bets</span>
                    </a>

                    <a 
                        href="/news" 
                        class="flex items-center px-4 py-3 rounded-lg {activeMenuItem === 'news' ? 'bg-blue-500' : 'hover:bg-blue-600'} transition-colors"
                        on:click={() => setActiveMenuItem('news')}
                    >
                        <svg class="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9.5a2.5 2.5 0 00-2.5-2.5H15" />
                        </svg>
                        <span>News</span>
                    </a>

                    <a 
                        href="/statistics" 
                        class="flex items-center px-4 py-3 rounded-lg {activeMenuItem === 'statistics' ? 'bg-blue-500' : 'hover:bg-blue-600'} transition-colors"
                        on:click={() => setActiveMenuItem('statistics')}
                    >
                        <svg class="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                        <span>Statistics</span>
                    </a>

                    <a 
                        href="/my-bets" 
                        class="flex items-center px-4 py-3 rounded-lg {activeMenuItem === 'my-bets' ? 'bg-blue-500' : 'hover:bg-blue-600'} transition-colors"
                        on:click={() => setActiveMenuItem('my-bets')}
                    >
                        <svg class="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                        <span>My Bets</span>
                    </a>
                </div>

                <!-- Membership Info -->
                <div class="mt-6 space-y-4">
                    <div class="bg-blue-600 rounded-lg p-4">
                        <div class="flex items-center justify-between mb-2">
                            <span class="text-sm font-medium">Membership Status</span>
                            <span class="px-2 py-1 bg-blue-700 rounded text-xs">
                                {userTier} Tier
                            </span>
                        </div>
                        <div class="space-y-2">
                            <div class="flex justify-between text-sm">
                                <span>Available Picks</span>
                                <span>{itemLimit === Infinity ? 'Unlimited' : itemLimit}</span>
                            </div>
                            <div class="flex justify-between text-sm">
                                <span>VIP Access</span>
                                <span>{userTier === 'gold' ? '✓' : '✗'}</span>
                            </div>
                            <div class="flex justify-between text-sm">
                                <span>Live Tips</span>
                                <span>{userTier !== 'free' ? '✓' : '✗'}</span>
                            </div>
                        </div>
                    </div>

                    {#if userTier !== 'gold'}
                        <a 
                            href="/payment" 
                            class="block px-4 py-3 bg-gradient-to-r from-yellow-400 to-yellow-500 text-[#064b67] font-bold rounded-lg hover:from-yellow-500 hover:to-yellow-600 transition-colors text-center"
                        >
                            Upgrade Now
                        </a>
                    {/if}
                </div>
            </nav>

            <!-- Footer Links -->
            <div class="px-4 py-4 border-t border-blue-600">
                <div class="flex justify-between text-sm">
                    <a href="/help" class="text-white/75 hover:text-white">Help</a>
                    <a href="/terms" class="text-white/75 hover:text-white">Terms</a>
                    <a href="/privacy" class="text-white/75 hover:text-white">Privacy</a>
                </div>
            </div>
        </div>
    </aside>
    <!-- Main Content -->
    <main class="flex-1 overflow-x-hidden">
        <!-- Mobile Header -->
        <div class="md:hidden bg-[#064b67] text-white p-4 flex items-center justify-between sticky top-0 z-20">
            <button on:click={toggleSidebar} class="mobile-menu-button">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
            </button>
            <img src="/logo.png" alt="Daily 2 Odds Logo" class="h-8" />
            <div class="relative">
                <button class="p-1">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                    </svg>
                    {#if notifications > 0}
                        <span class="absolute top-0 right-0 bg-red-500 text-xs rounded-full w-4 h-4 flex items-center justify-center">
                            {notifications}
                        </span>
                    {/if}
                </button>
            </div>
        </div>

        <!-- Content -->
        <div class="px-4 md:px-8 py-6">
            <!-- Welcome Banner -->
            <section class="mb-12">
                <div class="bg-gradient-to-r from-[#064b67] to-blue-600 rounded-xl text-white p-6 md:p-8">
                    <h1 class="text-2xl md:text-3xl font-bold mb-2">Welcome to Daily 2 Odds</h1>
                    <p class="text-white/90 mb-4">Your trusted source for professional betting predictions</p>
                    <div class="flex flex-wrap gap-4">
                        <a href="/hot-picks" class="inline-flex items-center px-4 py-2 bg-yellow-400 text-[#064b67] font-semibold rounded-lg hover:bg-yellow-300 transition-colors">
                            View Today's Picks
                            <svg class="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                            </svg>
                        </a>
                        {#if userTier === 'free'}
                            <a href="/payment" class="inline-flex items-center px-4 py-2 bg-white text-[#064b67] font-semibold rounded-lg hover:bg-gray-100 transition-colors">
                                Upgrade to Premium
                            </a>
                        {/if}
                    </div>
                </div>
            </section>

            <!-- Recent Wins Cards -->
            <section class="mb-12">
                <div class="flex items-center justify-between mb-6">
                    <h2 class="text-2xl font-bold">Recent Wins</h2>
                    <div class="border-b-4 border-[#064b67] w-20"></div>
                </div>

                <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {#if loadingWins}
                        {#each Array(4) as _}
                            <div class="bg-white rounded-lg shadow-md p-3 animate-pulse">
                                <div class="w-full h-32 bg-gray-200 rounded-md mb-2"></div>
                                <div class="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                                <div class="h-4 bg-gray-200 rounded w-1/2"></div>
                            </div>
                        {/each}
                    {:else if recentWins.length === 0}
                        <div class="col-span-full text-center py-8 bg-white rounded-lg shadow-md">
                            <p class="text-gray-500">No recent wins available</p>
                        </div>
                    {:else}
                        {#each recentWins as win, index}
                            <div class="bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300">
                                <!-- Card Header with League & Date -->
                                <div class="px-3 py-2 border-b flex justify-between items-center">
                                    <span class="text-sm font-medium text-[#064b67]">
                                        {win.league || 'Soccer'}
                                    </span>
                                    <span class="text-xs text-gray-500">{win.date}</span>
                                </div>
                                
                                <!-- Card Image -->
                                <div class="relative aspect-[4/3] overflow-hidden">
                                    <img 
                                        src={win.image} 
                                        alt="Win slip {index + 1}"
                                        class="w-full h-full object-cover"
                                    >
                                    <!-- Success Badge -->
                                    <div class="absolute top-2 right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                                        Won
                                    </div>
                                </div>
                                
                                <!-- Card Content -->
                                <div class="p-3">
                                    <!-- Match Details -->
                                    <p class="text-sm font-medium text-gray-800 mb-1">
                                        {win.teams || 'Match Details'}
                                    </p>
                                    <!-- Prediction Info -->
                                    <div class="flex justify-between items-center text-xs">
                                        <span class="text-gray-600">
                                            Odds: {win.odds || '1.95'}
                                        </span>
                                        <span class="text-green-600 font-medium">
                                            +{win.profit || '95.00'}
                                        </span>
                                    </div>
                                </div>
                                
                                <!-- Card Footer -->
                                <div class="px-3 py-2 bg-gray-50 rounded-b-lg flex justify-between items-center text-xs">
                                    <span class="text-gray-600">
                                        Verified ✓
                                    </span>
                                    <button class="text-[#064b67] hover:text-blue-700 font-medium">
                                        Details →
                                    </button>
                                </div>
                            </div>
                        {/each}
                    {/if}
                </div>
            </section>

            <!-- Premium Features -->
            <section class="mb-12">
                <div class="flex items-center justify-between mb-6">
                    <h2 class="text-2xl font-bold">Premium Features</h2>
                    <div class="border-b-4 border-[#064b67] w-20"></div>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <!-- VIP Picks -->
                    <div class="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all duration-300">
                        <div class="bg-gradient-to-r from-yellow-400 to-yellow-500 p-4 text-[#064b67]">
                            <h3 class="text-xl font-bold">VIP Picks</h3>
                        </div>
                        <div class="p-6">
                            <p class="text-gray-600 mb-4">Get exclusive access to our highest probability predictions with up to 90% success rate.</p>
                            {#if userTier !== 'gold'}
                                <div class="text-center">
                                    <a href="/payment" 
                                       class="inline-block bg-[#064b67] text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-300 text-sm md:text-base font-semibold">
                                        Upgrade to Access
                                    </a>
                                </div>
                            {:else}
                                <div class="text-center text-green-500 font-semibold">
                                    <span>✓ Available</span>
                                </div>
                            {/if}
                        </div>
                    </div>

                    <!-- Expert Analysis -->
                    <div class="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all duration-300">
                        <div class="bg-gradient-to-r from-yellow-400 to-yellow-500 p-4 text-[#064b67]">
                            <h3 class="text-xl font-bold">Expert Analysis</h3>
                        </div>
                        <div class="p-6">
                            <p class="text-gray-600 mb-4">Detailed match analysis and insights from our professional tipsters.</p>
                            {#if userTier === 'free'}
                                <div class="text-center">
                                    <a href="/payment" 
                                       class="inline-block bg-[#064b67] text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-300 text-sm md:text-base font-semibold">
                                        Upgrade to Access
                                    </a>
                                </div>
                            {:else}
                                <div class="text-center text-green-500 font-semibold">
                                    <span>✓ Available</span>
                                </div>
                            {/if}
                        </div>
                    </div>

                    <!-- Live Tips -->
                    <div class="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all duration-300">
                        <div class="bg-gradient-to-r from-yellow-400 to-yellow-500 p-4 text-[#064b67]">
                            <h3 class="text-xl font-bold">Live Tips</h3>
                        </div>
                        <div class="p-6">
                            <p class="text-gray-600 mb-4">Real-time betting tips and in-play predictions for maximum opportunities.</p>
                            {#if userTier !== 'gold'}
                                <div class="text-center">
                                    <a href="/payment" 
                                       class="inline-block bg-[#064b67] text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-300 text-sm md:text-base font-semibold">
                                        Upgrade to Access
                                    </a>
                                </div>
                            {:else}
                                <div class="text-center text-green-500 font-semibold">
                                    <span>✓ Available</span>
                                </div>
                            {/if}
                        </div>
                    </div>
                </div>
            </section>

            <!-- Stats Overview -->
            <section class="mb-12">
                <div class="flex items-center justify-between mb-6">
                    <h2 class="text-2xl font-bold">Statistics Overview</h2>
                    <div class="border-b-4 border-[#064b67] w-20"></div>
                </div>

                <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div class="bg-white rounded-xl shadow-md p-4 md:p-6 text-center hover:shadow-lg transition-all duration-300">
                        <p class="text-gray-500 text-sm md:text-base mb-2">Success Rate</p>
                        <p class="text-2xl md:text-3xl font-bold text-[#064b67]">85%</p>
                    </div>
                    
                    <div class="bg-white rounded-xl shadow-md p-4 md:p-6 text-center hover:shadow-lg transition-all duration-300">
                        <p class="text-gray-500 text-sm md:text-base mb-2">Active Users</p>
                        <p class="text-2xl md:text-3xl font-bold text-[#064b67]">10K+</p>
                    </div>
                    
                    <div class="bg-white rounded-xl shadow-md p-4 md:p-6 text-center hover:shadow-lg transition-all duration-300">
                        <p class="text-gray-500 text-sm md:text-base mb-2">Daily Picks</p>
                        <p class="text-2xl md:text-3xl font-bold text-[#064b67]">50+</p>
                    </div>
                    
                    <div class="bg-white rounded-xl shadow-md p-4 md:p-6 text-center hover:shadow-lg transition-all duration-300">
                        <p class="text-gray-500 text-sm md:text-base mb-2">Win Streak</p>
                        <p class="text-2xl md:text-3xl font-bold text-[#064b67]">15</p>
                    </div>
                </div>
            </section>
        </div>
    </main>
</div>

<style>
    /* Sidebar mobile handling */
    .sidebar-open aside {
        transform: translateX(0);
    }

    @media (max-width: 768px) {
        .sidebar-open .mobile-menu-button {
            position: fixed;
            right: 1rem;
            z-index: 40;
        }
    }

    /* Smooth transitions */
    .transition-transform {
        transition-property: transform;
        transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
        transition-duration: 300ms;
    }

    /* Ensure images maintain aspect ratio */
    img {
        max-width: 100%;
        height: auto;
    }

    /* Additional mobile optimizations */
    @media (max-width: 640px) {
        .text-3xl {
            font-size: 1.75rem;
        }
        
        .p-6 {
            padding: 1rem;
        }
    }

    /* Loading animation */
    .animate-pulse {
        animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
    }
    
    @keyframes pulse {
        0%, 100% {
            opacity: 1;
        }
        50% {
            opacity: .5;
        }
    }



    /* Card hover effects */
    .hover\:shadow-lg {
        transition: box-shadow 0.3s ease;
    }

    .hover\:shadow-lg:hover {
        box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
    }

    /* Gradient backgrounds */
    .bg-gradient-primary {
        background: linear-gradient(135deg, #064b67 0%, #1e88e5 100%);
    }

    /* Custom scrollbar for sidebar */
    nav::-webkit-scrollbar {
        width: 4px;
    }

    nav::-webkit-scrollbar-track {
        background: rgba(255, 255, 255, 0.1);
    }

    nav::-webkit-scrollbar-thumb {
        background: rgba(255, 255, 255, 0.2);
        border-radius: 2px;
    }

    nav::-webkit-scrollbar-thumb:hover {
        background: rgba(255, 255, 255, 0.3);
    }

    /* Mobile sidebar overlay */
    @media (max-width: 768px) {
        .sidebar-open::before {
            content: '';
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.5);
            z-index: 20;
        }
    }

    /* Improved button transitions */
    .btn-transition {
        transition: all 0.2s ease;
    }

    .btn-transition:active {
        transform: scale(0.98);
    }

    /* Card animations */
    @keyframes fadeIn {
        from {
            opacity: 0;
            transform: translateY(10px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }

    .card-animate {
        animation: fadeIn 0.3s ease-out;
    }

    /* Stats counter animation */
    @keyframes countUp {
        from {
            transform: translateY(10px);
            opacity: 0;
        }
        to {
            transform: translateY(0);
            opacity: 1;
        }
    }

    .stat-number {
        animation: countUp 0.5s ease-out;
    }
</style>

<!-- Add these meta tags to your HTML head -->
<svelte:head>
    <title>Daily 2 Odds - Professional Betting Predictions</title>
    <meta name="description" content="Get professional betting predictions and expert analysis for sports betting. Join our community of successful bettors.">
    <meta name="keywords" content="betting predictions, sports betting, odds, betting tips, professional betting">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
</svelte:head>