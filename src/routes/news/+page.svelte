<script>
    import { onMount } from 'svelte';
    import PocketBase from 'pocketbase';
    import Footer from "$lib/components/footer.svelte";

    const pb = new PocketBase('https://odds.pockethost.io');

    // State variables
    let newsItems = [];
    let loading = true;
    let currentPage = 1;
    let itemsPerPage = 10;
    let totalPages = 0;
    let searchQuery = '';
    let filteredNews = [];

    // Fetch news items with pagination
    async function fetchNews(page = 1) {
        try {
            loading = true;
            const response = await pb.collection('news').getList(page, itemsPerPage, {
                sort: '-created',
                filter: searchQuery ? `news~"${searchQuery}"` : ''
            });
            
            newsItems = response.items.map(item => ({
                id: item.id,
                news: item.news,
                created: new Date(item.created).toLocaleDateString(),
                category: item.category || 'General'
            }));
            
            totalPages = Math.ceil(response.totalItems / itemsPerPage);
            filteredNews = newsItems;
        } catch (error) {
            console.error('Error fetching news:', error);
            newsItems = [];
            filteredNews = [];
        } finally {
            loading = false;
        }
    }

    // Search functionality
    function handleSearch() {
        currentPage = 1;
        fetchNews(currentPage);
    }

    // Pagination controls
    function nextPage() {
        if (currentPage < totalPages) {
            currentPage++;
            fetchNews(currentPage);
        }
    }

    function prevPage() {
        if (currentPage > 1) {
            currentPage--;
            fetchNews(currentPage);
        }
    }

    // Subscribe to real-time updates
    function subscribeToNewsUpdates() {
        pb.collection('news').subscribe('*', (e) => {
            if (e.action === 'create') {
                fetchNews(currentPage);
            } else if (e.action === 'update' || e.action === 'delete') {
                fetchNews(currentPage);
            }
        });
    }

    onMount(() => {
        fetchNews();
        subscribeToNewsUpdates();
    });
</script>

<div class="min-h-screen bg-gray-50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <!-- Header -->
        <div class="mb-8">
            <h1 class="text-3xl font-bold text-[#064b67]">Latest News</h1>
            <p class="mt-2 text-gray-600">Stay updated with the latest sports betting news and insights</p>
        </div>

        <!-- Search Bar -->
        <div class="mb-6">
            <div class="max-w-xl">
                <div class="relative">
                    <input
                        type="text"
                        bind:value={searchQuery}
                        placeholder="Search news..."
                        class="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#064b67] focus:border-transparent"
                        on:keyup={(e) => e.key === 'Enter' && handleSearch()}
                    />
                    <button
                        class="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-[#064b67]"
                        on:click={handleSearch}
                    >
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </button>
                </div>
            </div>
        </div>

        <!-- News Grid -->
        <div class="space-y-6">
            {#if loading}
                <div class="flex justify-center py-12">
                    <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-[#064b67]"></div>
                </div>
            {:else if filteredNews.length === 0}
                <div class="text-center py-12 bg-white rounded-lg shadow">
                    <p class="text-gray-500">No news articles found</p>
                </div>
            {:else}
                {#each filteredNews as item}
                    <div class="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow p-6">
                        <div class="flex justify-between items-start">
                            <div class="flex-1">
                                <div class="flex items-center space-x-2 mb-2">
                                    <span class="px-2 py-1 bg-[#064b67] text-white text-sm rounded">
                                        {item.category}
                                    </span>
                                    <span class="text-sm text-gray-500">{item.created}</span>
                                </div>
                                <p class="text-gray-800">{item.news}</p>
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
    <Footer />
</div>

<style>
    /* Add any additional custom styles here */
    input:focus {
        outline: none;
    }
</style>