<!-- 
  BettingPicks.svelte
  A component that displays betting predictions with tiered access control.
  Features:
  - User tier-based content access (Free/Silver/Gold)
  - Real-time updates
  - Category filtering
  - Pagination
  - Responsive grid layout
-->

<script>
    import { onMount, onDestroy } from 'svelte';
    import PocketBase from 'pocketbase';
    
    // ---------------
    // Configuration
    // ---------------
    const pb = new PocketBase('https://odds.pockethost.io');

    // ---------------
    // State Management
    // ---------------
    let items = [];                    // All fetched items
    let loading = true;                // Loading state indicator
    let userTier = 'free';            // User's subscription tier
    let itemLimit = 2;                 // Number of items user can view
    let currentPage = 1;               // Current page number
    let itemsPerPage = 9;             // Items to show per page
    let totalPages = 0;               // Total number of pages
    let filterCategory = 'all';        // Current category filter
    let displayedItems = [];           // Items filtered by user tier

    // ---------------
    // User Management
    // ---------------
    async function fetchUserDetails() {
        try {
            const user = pb.authStore.model;
            userTier = user?.tier || 'free';
            
            // Set viewing limits based on subscription tier
            switch(userTier) {
                case 'gold':
                    itemLimit = Infinity;  // Unlimited access
                    break;
                case 'silver':
                    itemLimit = 4;         // Premium access
                    break;
                default:
                    itemLimit = 2;         // Basic access
            }
        } catch (error) {
            console.error('Error fetching user details:', error);
            // Fallback to free tier on error
            userTier = 'free';
            itemLimit = 2;
        }
    }

    // ---------------
    // Data Fetching
    // ---------------
    async function fetchItems(page = 1) {
        try {
            loading = true;
            // Apply category filter if not showing all
            const filter = filterCategory !== 'all' ? `category = "${filterCategory}"` : '';
            
            // Fetch items with pagination and filtering
            const response = await pb.collection('Free_Tier').getList(page, itemsPerPage, {
                sort: '-created',
                filter: filter
            });
            
            // Transform and normalize item data
            items = response.items.map(item => ({
                id: item.id,
                image: item.image,
                description: item.description,
                category: item.category || 'General',
                odds: item.odds || '1.75',
                successRate: item.successRate || '85%',
                time: item.time || 'Today',
                status: item.status || 'Active'
            }));

            // Apply tier-based content restrictions
            displayedItems = items.slice(0, itemLimit);
            totalPages = Math.ceil(response.totalItems / itemsPerPage);
        } catch (error) {
            console.error('Error in fetchItems:', error);
            items = [];
            displayedItems = [];
        } finally {
            loading = false;
        }
    }

    // ---------------
    // Real-time Updates
    // ---------------
    function subscribeToOddsUpdates() {
        // Subscribe to all changes in the Free_Tier collection
        pb.collection('Free_Tier').subscribe('*', (e) => {
            if (e.action === 'create' || e.action === 'update' || e.action === 'delete') {
                fetchItems(currentPage);
            }
        });
    }

    // ---------------
    // Pagination Controls
    // ---------------
    function nextPage() {
        if (currentPage < totalPages) {
            currentPage++;
            fetchItems(currentPage);
        }
    }

    function prevPage() {
        if (currentPage > 1) {
            currentPage--;
            fetchItems(currentPage);
        }
    }

    // ---------------
    // Filtering
    // ---------------
    function handleCategoryChange(category) {
        filterCategory = category;
        currentPage = 1;
        fetchItems(1);
    }

    // ---------------
    // Lifecycle Hooks
    // ---------------
    onMount(async () => {
        await fetchUserDetails();
        await fetchItems();
        subscribeToOddsUpdates();
    });

    onDestroy(() => {
        // Cleanup subscription on component destroy
        pb.collection('Free_Tier').unsubscribe('*');
    });
</script>

<!-- Main Container -->
<div class="min-h-screen bg-gray-50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <!-- Header Section -->
        <div class="mb-8">
            <h1 class="text-3xl font-bold text-[#064b67]">Today's Hot Picks</h1>
            <p class="mt-2 text-gray-600">Discover our carefully selected betting predictions for today</p>
            <p class="mt-2 text-sm text-gray-500">Current Plan: {userTier.charAt(0).toUpperCase() + userTier.slice(1)} Tier</p>
        </div>

        <!-- Category Filter Section -->
        <div class="mb-6">
            <div class="flex flex-wrap gap-2">
                <button
                    class="px-4 py-2 rounded-lg {filterCategory === 'all' ? 'bg-[#064b67] text-white' : 'bg-white text-gray-600'} hover:bg-[#064b67] hover:text-white transition-colors"
                    on:click={() => handleCategoryChange('all')}
                >
                    All Picks
                </button>
                <button
                    class="px-4 py-2 rounded-lg {filterCategory === 'football' ? 'bg-[#064b67] text-white' : 'bg-white text-gray-600'} hover:bg-[#064b67] hover:text-white transition-colors"
                    on:click={() => handleCategoryChange('football')}
                >
                    Football
                </button>
                <button
                    class="px-4 py-2 rounded-lg {filterCategory === 'basketball' ? 'bg-[#064b67] text-white' : 'bg-white text-gray-600'} hover:bg-[#064b67] hover:text-white transition-colors"
                    on:click={() => handleCategoryChange('basketball')}
                >
                    Basketball
                </button>
            </div>
        </div>

        <!-- Content Grid Section -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {#if loading}
                <!-- Loading State -->
                <div class="col-span-full flex justify-center py-12">
                    <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-[#064b67]"></div>
                </div>
            {:else if displayedItems.length === 0}
                <!-- Empty State -->
                <div class="col-span-full text-center py-12 bg-[#064b67] rounded-lg shadow">
                    <p class="text-white">No picks available for this category</p>
                </div>
            {:else}
                <!-- Items Grid -->
                {#each items as item, index}
                    <div class="bg-[#064b67] rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all duration-300">
                        <!-- Image Section with Premium Content Overlay -->
                        <div class="relative">
                            {#if item.image}
                                <div class="relative {index >= itemLimit ? 'blur-sm' : ''}">
                                    <img 
                                        src={`https://odds.pockethost.io/api/files/Free_Tier/${item.id}/${item.image}`} 
                                        alt="Match prediction" 
                                        class="w-full h-48 object-cover"
                                    >
                                </div>
                                <!-- Premium Content Upgrade CTA -->
                                {#if index >= itemLimit}
                                    <div class="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40">
                                        <a 
                                            href="/payment" 
                                            class="px-6 py-3 bg-[#064b67] text-white rounded-lg font-semibold 
                                                   transform hover:scale-105 transition-transform duration-200 
                                                   shadow-lg hover:shadow-xl border-2 border-white"
                                        >
                                            Upgrade to Premium
                                        </a>
                                    </div>
                                {/if}
                            {/if}
                        </div>

                        <!-- Content Section -->
                        <div class="p-6">
                            <div class="flex justify-between items-center mb-3">
                                <span class="px-3 py-1 bg-white text-[#064b67] text-sm rounded-full">
                                    {item.category}
                                </span>
                                <span class="text-sm text-gray-200">{item.time}</span>
                            </div>
                            <p class="text-white mb-4">
                                {index >= itemLimit ? '🔒 Premium Content - Upgrade to view this prediction' : item.description}
                            </p>
                            <!-- Footer Section -->
                            <div class="mt-4 pt-4 border-t border-gray-100/20 flex justify-between items-center">
                                {#if index >= itemLimit}
                                    <div class="w-full flex justify-center">
                                        <a href="/payment" 
                                           class="text-sm text-blue-300 hover:text-blue-200 flex items-center">
                                            <span class="mr-2">🔓</span>
                                            Unlock Premium Content
                                        </a>
                                    </div>
                                {:else}
                                    <div class="flex items-center space-x-4">
                                        <span class="text-white">Odds: {item.odds}</span>
                                        <span class="text-white">Success Rate: {item.successRate}</span>
                                    </div>
                                {/if}
                            </div>
                        </div>
                    </div>
                {/each}
            {/if}
        </div>

        <!-- Pagination Section -->
        {#if totalPages > 1}
            <div class="flex justify-center space-x-4 mt-8">
                <button
                    class="px-4 py-2 rounded-lg bg-[#064b67] text-white disabled:opacity-50 disabled:cursor-not-allowed"
                    on:click={prevPage}
                    disabled={currentPage === 1}
                >
                    Previous
                </button>
                <span class="px-4 py-2">
                    Page {currentPage} of {totalPages}
                </span>
                <button
                    class="px-4 py-2 rounded-lg bg-[#064b67] text-white disabled:opacity-50 disabled:cursor-not-allowed"
                    on:click={nextPage}
                    disabled={currentPage === totalPages}
                >
                    Next
                </button>
            </div>
        {/if}
    </div>
</div>

<style>
    /* Animation and Transition Styles */
    .transition-all {
        transition-property: all;
        transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
        transition-duration: 300ms;
    }

    .blur-sm {
        filter: blur(4px);
        transition: filter 0.3s ease-in-out;
    }
</style>