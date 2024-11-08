<script>
    import { onMount } from 'svelte';
    import PocketBase from 'pocketbase';
    import Sidebar from '$lib/components/sidebar.svelte';

    const pb = new PocketBase('https://odds.pockethost.io');

    // State variables
    let currentSlide = 0;
    let loadingWins = true;
    let recentWins = [];
    let userTier = 'free';
    let isSidebarOpen = false;
    let interval;
    
    // Touch handling variables
    let touchStartX = 0;
    let touchEndX = 0;
    let touchStartY = 0;
    let touchMoveX = 0;
    let isDragging = false;
    let sidebarPosition = -100;
    const minSwipeDistance = 50;

    // Handle touch events
    function handleTouchStart(event) {
        touchStartX = event.touches[0].clientX;
        touchStartY = event.touches[0].clientY;
        isDragging = touchStartX < 30 || isSidebarOpen;
    }

    function handleTouchMove(event) {
        if (!isDragging) return;
        
        touchMoveX = event.touches[0].clientX;
        const currentY = event.touches[0].clientY;
        const deltaY = Math.abs(currentY - touchStartY);
        
        if (deltaY > 30) {
            isDragging = false;
            return;
        }
        
        const delta = touchMoveX - touchStartX;
        const maxDrag = window.innerWidth * 0.8;
        
        if (!isSidebarOpen && delta > 0) {
            sidebarPosition = Math.min(0, (-100 + (delta / maxDrag) * 100));
            event.preventDefault();
        } else if (isSidebarOpen && delta < 0) {
            sidebarPosition = Math.max(-100, (delta / maxDrag) * 100);
            event.preventDefault();
        }
    }

    function handleTouchEnd() {
        if (!isDragging) return;
        
        const swipeDistance = touchMoveX - touchStartX;
        
        if (!isSidebarOpen && swipeDistance > minSwipeDistance) {
            toggleSidebar();
        } else if (isSidebarOpen && swipeDistance < -minSwipeDistance) {
            toggleSidebar();
        }
        
        sidebarPosition = isSidebarOpen ? 0 : -100;
        isDragging = false;
        touchStartX = 0;
        touchMoveX = 0;
    }

    // Toggle sidebar
    const toggleSidebar = () => {
        isSidebarOpen = !isSidebarOpen;
        sidebarPosition = isSidebarOpen ? 0 : -100;
    };

    // Slideshow functions
    function startAutoTransition() {
        interval = setInterval(() => {
            currentSlide = (currentSlide + 1) % recentWins.length;
        }, 3000);
    }

    function setSlide(index) {
        currentSlide = index;
        clearInterval(interval);
        startAutoTransition();
    }

    // Fetch user details
    async function fetchUserDetails() {
        try {
            const user = pb.authStore.model;
            userTier = user?.tier || 'free';
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

    onMount(async () => {
        await fetchUserDetails();
        await fetchRecentWins();
        startAutoTransition();
    });
</script>

<div 
    class="flex min-h-screen bg-gray-50" 
    class:sidebar-open={isSidebarOpen}
    class:dragging={isDragging}
    on:touchstart={handleTouchStart}
    on:touchmove={handleTouchMove}
    on:touchend={handleTouchEnd}
>
    <Sidebar {isSidebarOpen} {toggleSidebar} style="transform: translateX({sidebarPosition}%)" />
    
    <main class="flex-1 overflow-x-hidden">
        <!-- Mobile Header -->
        <div class="md:hidden bg-[#064b67] text-white sticky top-0 z-30 shadow-md">
            <!-- Swipe Indicator -->
            <div 
                class="absolute left-0 top-0 h-full w-1 bg-white/10 transition-opacity duration-200"
                class:opacity-0={isSidebarOpen}
            >
                <div 
                    class="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-12 bg-white/30 rounded"
                    style="transform: translateY(-50%) scaleY({isDragging ? 1.5 : 1})"
                ></div>
            </div>
        </div>

        <!-- Content Area -->
        <div class="px-3 md:px-8 py-4 md:py-6 max-w-7xl mx-auto">
            <!-- Welcome Banner -->
            <section class="mb-8 md:mb-12">
                <div class="bg-gradient-to-r from-[#064b67] to-blue-600 rounded-xl text-white p-4 md:p-8">
                    <h1 class="text-xl md:text-3xl font-bold mb-2">Welcome to Daily 2 Odds</h1>
                    <p class="text-white/90 mb-4 text-sm md:text-base">Your trusted source for professional betting predictions</p>
                    <div class="flex flex-col sm:flex-row gap-3">
                        <a href="/hot-picks" class="inline-flex items-center justify-center px-4 py-2.5 bg-yellow-400 text-[#064b67] font-semibold rounded-lg hover:bg-yellow-300 transition-colors text-sm md:text-base">
                            View Today's Picks
                            <svg class="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                            </svg>
                        </a>
                        {#if userTier === 'free'}
                            <a href="/payment" class="inline-flex items-center justify-center px-4 py-2.5 bg-white text-[#064b67] font-semibold rounded-lg hover:bg-gray-100 transition-colors text-sm md:text-base">
                                Upgrade to Premium
                            </a>
                        {/if}
                    </div>
                </div>
            </section>

            <!-- Recent Wins Slideshow -->
            <section class="px-4 py-8 md:py-12">
                <div class="max-w-[1400px] mx-auto">
                    <div class="flex items-center justify-between mb-8">
                        <h2 class="text-2xl md:text-3xl font-bold text-gray-900">Recent Wins</h2>
                        <div class="h-1 w-20 bg-[#064b67]"></div>
                    </div>

                    {#if loadingWins}
                        <div class="bg-white rounded-xl animate-pulse">
                            <div class="h-80 bg-gray-200 rounded-xl border-4 border-[#064b67] shadow-[0_4px_20px_rgba(6,75,103,0.2)]"></div>
                        </div>
                    {:else if recentWins.length === 0}
                        <div class="text-center py-12 bg-gray-50 rounded-xl border-4 border-dashed border-[#064b67] shadow-[0_4px_20px_rgba(6,75,103,0.2)]">
                            <p class="text-gray-500 font-medium">No recent wins available</p>
                        </div>
                    {:else}
                        <div class="relative">
                            <!-- Slideshow Container -->
                            <div class="relative h-[500px] rounded-xl overflow-hidden border-4 border-[#064b67] shadow-[0_4px_20px_rgba(6,75,103,0.2)]">
                                {#each recentWins as win, index}
                                    <div
                                        class="absolute top-0 left-0 w-full h-full transition-opacity duration-500"
                                        style="opacity: {currentSlide === index ? '1' : '0'}; pointer-events: {currentSlide === index ? 'auto' : 'none'}"
                                    >
                                        <img
                                            src={win.image}
                                            alt="Win slip {index + 1}"
                                            class="w-full h-full object-cover"
                                            loading="lazy"
                                        />
                                        <div class="absolute top-4 right-4 bg-green-500 text-white text-sm px-4 py-1 rounded-full font-medium shadow-lg">
                                            Won
                                        </div>
                                    </div>
                                {/each}
                            </div>

                            <!-- Indicator Circles -->
                            <div class="absolute -bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-2">
                                {#each recentWins as _, index}
                                    <button
                                        class="w-3 h-3 rounded-full transition-all duration-300 {currentSlide === index ? 'bg-[#064b67]' : 'bg-gray-300'}"
                                        on:click={() => setSlide(index)}
                                        aria-label="Go to slide {index + 1}"
                                    ></button>
                                {/each}
                            </div>
                        </div>
                    {/if}
                </div>
            </section>

            <!-- Premium Features -->
            <section class="mb-8 md:mb-12">
                <div class="flex items-center justify-between mb-4 md:mb-6">
                    <h2 class="text-xl md:text-2xl font-bold">Premium Features</h2>
                    <div class="border-b-4 border-[#064b67] w-16 md:w-20"></div>
                </div>

                <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                    {#each [
                        {title: 'VIP Picks', description: 'Get exclusive access to our highest probability predictions with up to 90% success rate.', requiresGold: true},
                        {title: 'Expert Analysis', description: 'Detailed match analysis and insights from our professional tipsters.', requiresGold: false},
                        {title: 'Live Tips', description: 'Real-time betting tips and in-play predictions for maximum opportunities.', requiresGold: true}
                    ] as feature}
                        <div class="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all duration-300">
                            <div class="bg-gradient-to-r from-yellow-400 to-yellow-500 p-3 md:p-4 text-[#064b67]">
                                <h3 class="text-lg md:text-xl font-bold">{feature.title}</h3>
                            </div>
                            <div class="p-4 md:p-6">
                                <p class="text-gray-600 mb-4 text-sm md:text-base">{feature.description}</p>
                                {#if (feature.requiresGold && userTier !== 'gold') || (!feature.requiresGold && userTier === 'free')}
                                    <div class="text-center">
                                        <a href="/payment" 
                                           class="inline-block bg-[#064b67] text-white px-6 py-2.5 rounded-lg hover:bg-blue-700 transition-colors duration-300 text-sm md:text-base font-semibold w-full sm:w-auto">
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
                    {/each}
                </div>
            </section>

            <!-- Stats Overview -->
            <section class="mb-8 md:mb-12">
                <div class="flex items-center justify-between mb-4 md:mb-6">
                    <h2 class="text-xl md:text-2xl font-bold">Statistics Overview</h2>
                    <div class="border-b-4 border-[#064b67] w-16 md:w-20"></div>
                </div>

                <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
                    {#each [
                        {label: 'Success Rate', value: '85%'},
                        {label: 'Active Users', value: '10K+'},
                        {label: 'Daily Picks', value: '50+'}
                    ] as stat}
                        <div class="bg-white rounded-xl shadow-md p-4 md:p-6 text-center hover:shadow-lg transition-all duration-300">
                            <p class="text-gray-500 text-sm md:text-base mb-2">{stat.label}</p>
                            <p class="text-2xl md:text-3xl font-bold text-[#064b67] stat-number">{stat.value}</p>
                        </div>
                    {/each}
                </div>
            </section>
        </div>
    </main>
</div>

<style>
    /* Mobile styles continued */
    .mobile-menu-button {
        transition: all 0.3s ease;
    }

    .dragging .mobile-menu-button {
        transform: scale(0.95);
    }

    /* Slideshow specific styles */
    .transition-opacity {
        transition: opacity 500ms ease-in-out;
    }

    /* Indicator circles hover effect */
    button:hover {
        transform: scale(1.2);
    }

    /* Swipe indicator animation */
    @keyframes pulseIndicator {
        0%, 100% { opacity: 0.3; }
        50% { opacity: 0.7; }
    }

    .swipe-indicator {
        animation: pulseIndicator 2s infinite;
    }

    /* Card animations */
    .card-animate {
        animation: fadeIn 0.4s ease-out;
        animation-fill-mode: both;
    }

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

    /* Stats counter animation */
    .stat-number {
        animation: countUp 1s ease-out;
        animation-fill-mode: both;
    }

    @keyframes countUp {
        from {
            opacity: 0;
            transform: translateY(20px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }

    /* Loading animation */
    .animate-pulse {
        animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
    }

    @keyframes pulse {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.5; }
    }

    /* Enhanced hover effects */
    .hover\:shadow-lg {
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }

    .hover\:shadow-lg:hover {
        transform: translateY(-2px);
    }

    /* Safe area insets */
    @supports (padding: max(0px)) {
        .mobile-header {
            padding-top: max(1rem, env(safe-area-inset-top));
            padding-left: max(1rem, env(safe-area-inset-left));
            padding-right: max(1rem, env(safe-area-inset-right));
        }
    }

    /* Touch interaction improvements */
    .dragging {
        touch-action: none;
        user-select: none;
    }

    /* Progressive enhancement */
    @supports (backdrop-filter: blur(2px)) {
        .sidebar-open::before {
            backdrop-filter: blur(2px);
        }
    }

    /* Text overflow prevention */
    .line-clamp-2 {
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
    }
</style>

<svelte:head>
    <title>Daily 2 Odds - Professional Betting Predictions</title>
    <meta name="description" content="Get professional betting predictions and expert analysis for sports betting. Join our community of successful bettors.">
    <meta name="keywords" content="betting predictions, sports betting, odds, betting tips, professional betting">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover">
</svelte:head>