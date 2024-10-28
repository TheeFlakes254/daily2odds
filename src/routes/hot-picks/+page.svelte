<script>
    import { onMount, onDestroy } from 'svelte';
    import PocketBase from 'pocketbase';
    import Footer from "$lib/components/footer.svelte";

    const pb = new PocketBase('https://odds.pockethost.io');

    // State variables
    let items = [];
    let loading = true;
    let userTier = 'free';
    let itemLimit = 2;
    let currentPage = 1;
    let itemsPerPage = 9;
    let totalPages = 0;
    let filterCategory = 'all';

    // Fetch user details
    async function fetchUserDetails() {
        try {
            const user = pb.authStore.model;
            userTier = user?.tier || 'free';
            itemLimit = userTier === 'silver' ? 4 : userTier === 'gold' ? Infinity : 2;
        } catch (error) {
            console.error('Error fetching user details:', error);
        }
    }

    // Fetch betting items with pagination
    async function fetchItems(page = 1) {
        try {
            loading = true;
            const filter = filterCategory !== 'all' ? `category = "${filterCategory}"` : '';
            
            const response = await pb.collection('Free_Tier').getList(page, itemsPerPage, {
                sort: '-created',
                filter: filter
            });
            
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
            
            totalPages = Math.ceil(response.totalItems / itemsPerPage);
        } catch (error) {
            console.error('Error in fetchItems:', error);
            items = [];
        } finally {
            loading = false;
        }
    }

    // Subscribe to real-time updates
    function subscribeToOddsUpdates() {
        pb.collection('Free_Tier').subscribe('*', (e) => {
            if (e.action === 'create' || e.action === 'update' || e.action === 'delete') {
                fetchItems(currentPage);
            }
        });
    }

    // Pagination controls
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

    // Category filter
    function handleCategoryChange(category) {
        filterCategory = category;
        currentPage = 1;
        fetchItems(1);
    }

    onMount(async () => {
        await fetchUserDetails();
        await fetchItems();
        subscribeToOddsUpdates();
    });

    onDestroy(() => {
        pb.collection('Free_Tier').unsubscribe('*');
    });
</script>

<div class="min-h-screen bg-gray-50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <!-- Header -->
        <div class="mb-8">
            <h1 class="text-3xl font-bold text-[#064b67]">Today's Hot Picks</h1>
            <p class="mt-2 text-gray-600">Discover our carefully selected betting predictions for today</p>
        </div>

        <!-- Category Filter -->
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
                <!-- Add more categories as needed -->
            </div>
        </div>

        <!-- Picks Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {#if loading}
                <div class="col-span-full flex justify-center py-12">
                    <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-[#064b67]"></div>
                </div>
            {:else if items.length === 0}
                <div class="col-span-full text-center py-12 bg-white rounded-lg shadow">
                    <p class="text-gray-500">No picks available for this category</p>
                </div>
            {:else}
                {#each items as item}
                    <div class="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all duration-300">
                        {#if item.image}
                            <img src={`https://odds.pockethost.io/api/files/Free_Tier/${item.id}/${item.image}`} 
                                 alt="Match prediction" 
                                 class="w-full h-48 object-cover">
                        {/if}
                        <div class="p-6">
                            <div class="flex justify-between items-center mb-3">
                                <span class="px-3 py-1 bg-[#064b67] text-white text-sm rounded-full">
                                    {item.category}
                                </span>
                                <span class="text-sm text-gray-500">{item.time}</span>
                            </div>
                            <p class="text-gray-800 mb-4">{item.description}</p>
                            <div class="flex items-center justify-between text-sm">
                                <span class="text-gray-500">Odds: {item.odds}</span>
                                <span class="text-green-500">Success Rate: {item.successRate}</span>
                            </div>
                            <div class="mt-4 pt-4 border-t border-gray-100 flex justify-between items-center">
                                <span class={`text-sm ${item.status === 'Active' ? 'text-green-500' : 'text-red-500'}`}>
                                    Status: {item.status}
                                </span>
                                {#if userTier === 'free' && items.indexOf(item) >= 2}
                                    <a href="/payment" class="text-sm text-blue-600 hover:text-blue-800">
                                        Upgrade to View
                                    </a>
                                {/if}
                            </div>
                        </div>
                    </div>
                {/each}
            {/if}
        </div>

        <!-- Pagination -->
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
    /* Add any additional custom styles here */
    .transition-all {
        transition-property: all;
        transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
        transition-duration: 300ms;
    }
</style>