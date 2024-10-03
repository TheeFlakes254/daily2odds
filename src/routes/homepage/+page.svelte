<script>
    import Navbar from "$lib/components/navbar1.svelte";
    import PocketBase from 'pocketbase';
    import Footer from "$lib/components/footer.svelte";
    import { onMount, onDestroy } from 'svelte';

    const pb = new PocketBase('https://odds.pockethost.io');

    let newsItems = [];
    let loadingNews = true;
    let recentWins = [];
    let loadingWins = true;
    let items = [];
    let userTier = 'free';  // Default to free tier
    let itemLimit = 2;      // Default limit for free tier
    let loading = true;
    let userId = '';        // Store logged-in user's ID

    // Fetch user details including their tier
    async function fetchUserDetails() {
        try {
            const user = pb.authStore.model;
            userId = user?.id;
            userTier = user?.tier || 'free';  // Assume there's a 'tier' field in the user model
            
            // Set item limit based on user's tier
            switch (userTier) {
                case 'silver':
                    itemLimit = 4;
                    break;
                case 'gold':
                    itemLimit = Infinity;  // No limit for gold tier
                    break;
                default:
                    itemLimit = 2;  // Free tier gets 2 items
                    break;
            }

        } catch (error) {
            console.error('Error fetching user details:', error);
        }
    }

    async function fetchNews() {
        try {
            const response = await pb.collection('news').getFullList();
            newsItems = response.map(item => ({
                id: item.id,
                news: item.news
            }));
        } catch (error) {
            console.error('Error fetching news:', error);
        } finally {
            loadingNews = false;
        }
    }

    async function fetchRecentWins() {
        try {
            const response = await pb.collection('recentwins').getFullList();
            recentWins = response.map(item => ({
                image: `https://odds.pockethost.io/api/files/recentwins/${item.id}/${item.wins}`
            }));
        } catch (error) {
            console.error('Error fetching recent wins:', error);
        } finally {
            loadingWins = false;
        }
    }

    // Fetch odds items
    async function fetchAllItems() {
        try {
            loading = true;
            
            let allItems = [];
            let page = 1;
            const perPage = 500;
            
            while (true) {
                const response = await pb.collection('Free_Tier').getList(page, perPage, {
                    sort: '-created',
                });
                
                const batchItems = response.items.map(item => ({
                    id: item.id,
                    image: item.image,
                    description: item.description
                }));
                
                allItems = [...allItems, ...batchItems];
                
                if (batchItems.length < perPage) {
                    break;
                }
                page++;
            }

            // Apply the limit based on the user's tier
            if (itemLimit !== Infinity) {
                items = allItems.slice(0, itemLimit);
            } else {
                items = allItems;
            }

        } catch (error) {
            console.error('Error in fetchAllItems:', error);
            items = [];
        } finally {
            loading = false;
        }
    }

    // Subscribe to real-time updates for odds
    function subscribeToOddsUpdates() {
        pb.collection('Free_Tier').subscribe('*', (e) => {
            console.log(e.action, e.record);

            if (e.action === 'create' || e.action === 'update') {
                const existingItemIndex = items.findIndex(item => item.id === e.record.id);
                if (existingItemIndex !== -1) {
                    items[existingItemIndex] = {
                        id: e.record.id,
                        image: e.record.image,
                        description: e.record.description
                    };
                } else {
                    items.unshift({
                        id: e.record.id,
                        image: e.record.image,
                        description: e.record.description
                    });
                }
            } else if (e.action === 'delete') {
                items = items.filter(item => item.id !== e.record.id);
            }
        });
    }

    // Mounting and cleaning up subscriptions
    onMount(async () => {
        await fetchUserDetails();
        await Promise.all([fetchNews(), fetchRecentWins(), fetchAllItems()]);
        subscribeToOddsUpdates();
    });

    // Clean up the subscription when component is destroyed
    onDestroy(() => {
        pb.collection('Free_Tier').unsubscribe('*');
    });
</script>

<Navbar />



<!-- Recent Wins Section -->
<section class="mb-8 flex flex-col items-center ">
    <h2 class="text-2xl font-bold mb-2 text-center">Recent Wins</h2>
    <div class="border-b-4 border-[#064b67] w-20 mb-4"></div>

    <div class="relative overflow-hidden w-full max-w-3xl h-64 flex justify-center items-center">
        {#if loadingWins}
            <p class="text-center text-gray-500">Loading recent wins...</p>
        {:else if recentWins.length === 0}
            <p class="text-center text-gray-500">No recent wins available at the moment.</p>
        {:else}
            <div class="whitespace-nowrap animate-slide">
                {#each recentWins as win}
                    <img src={win.image} alt="Recent Win Image" class="inline-block w-full h-64 object-cover rounded-lg shadow-md mx-2">
                {/each}
            </div>
        {/if}
    </div>
</section>


<!-- Odds Section -->
<section class="my-8 mx-4">
    <h2 class="text-2xl font-bold mb-4 text-center">Odds</h2>
    <p class="text-center mb-4">Your current tier: {userTier} (Odds: {itemLimit === Infinity ? 'Unlimited' : itemLimit} )</p>
    
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        {#if loading}
            <p class="text-center text-gray-500 col-span-2">Loading items...</p>
        {:else if items.length === 0}
            <p class="text-center text-gray-500 col-span-2">No items available at the moment.</p>
        {:else}
            {#each items as item}
                <div class="bg-[#064b67] text-white p-6 rounded-lg shadow-md">
                    {#if item.image} <!-- Check if image exists -->
                        <img src={`https://odds.pockethost.io/api/files/Free_Tier/${item.id}/${item.image}`} alt="Item Image" class="w-full h-64 object-cover rounded-lg mb-4">
                    {:else}
                        <p>No image available.</p> <!-- Handle missing images -->
                    {/if}
                    <p>{item.description}</p>
                </div>
            {/each}
        {/if}
    </div>
</section>

<!-- Upgrade Button -->
<div class="mt-6 text-center">
    <button class="bg-[#064b67] text-white font-bold py-3 px-6 rounded-full hover:bg-yellow-400 transition duration-300 focus:outline-none">
        Upgrade
    </button>
</div>

<!-- News Section -->
<section class="my-8 mx-4">
    <h2 class="text-2xl font-bold mb-4 text-center">Latest News</h2><br>
    
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        {#if loadingNews}
            <p class="text-center text-gray-500">Loading news...</p>
        {:else if newsItems.length === 0}
            <p class="text-center text-gray-500">No news available at the moment.</p>
        {:else}
            {#each newsItems as newsItem}
                <div class="bg-[#064b67] text-white p-6 rounded-lg shadow-md">
                    <p>{newsItem.news}</p>
                </div>
            {/each}
        {/if}
    </div>
</section>

<Footer />

<style>
    @keyframes slide {
        0% {
            transform: translateX(0);
        }
        100% {
            transform: translateX(calc(-100% * 0.5));
        }
    }
    
    .animate-slide {
        display: flex;
        animation: slide 5s linear infinite;
    }
</style>
