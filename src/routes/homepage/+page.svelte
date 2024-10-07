<script>
    import Navbar from "$lib/components/navbar1.svelte";
    import Footer from "$lib/components/footer.svelte";
    import { onMount, onDestroy } from 'svelte';
    import PocketBase from 'https://unpkg.com/pocketbase@0.20.1/dist/pocketbase.es.mjs';

    const pb = new PocketBase('https://odds.pockethost.io');

    let newsItems = [];
    let loadingNews = true;
    let recentWins = [];
    let loadingWins = true;
    let items = [];
    let userTier = 'free';
    let itemLimit = 2;
    let loading = true;
    let userId = '';
    let currentIndex = 0;

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

    async function fetchAllItems() {
        try {
            loading = true;
            
            const response = await pb.collection('Free_Tier').getList(1, itemLimit === Infinity ? 500 : itemLimit, {
                sort: '-created',
            });
            
            items = response.items.map(item => ({
                id: item.id,
                image: item.image,
                description: item.description
            }));

        } catch (error) {
            console.error('Error in fetchAllItems:', error);
            items = [];
        } finally {
            loading = false;
        }
    }

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
                } else if (items.length < itemLimit) {
                    items = [{
                        id: e.record.id,
                        image: e.record.image,
                        description: e.record.description
                    }, ...items];
                }
                items = items; // Trigger reactivity
            } else if (e.action === 'delete') {
                items = items.filter(item => item.id !== e.record.id);
            }
        });
    }

    onMount(async () => {
        await fetchUserDetails();
        await Promise.all([fetchNews(), fetchRecentWins(), fetchAllItems()]);
        subscribeToOddsUpdates();
    });

    onDestroy(() => {
        pb.collection('Free_Tier').unsubscribe('*');
    });

    const prevSlide = () => {
        currentIndex = (currentIndex > 0) ? currentIndex - 1 : recentWins.length - 1;
    };

    const nextSlide = () => {
        currentIndex = (currentIndex < recentWins.length - 1) ? currentIndex + 1 : 0;
    };
</script>

<Navbar />

<section class="mb-8 flex flex-col items-center mt-4">
    <h2 class="text-2xl font-bold mb-2 text-center">Recent Wins</h2>
    <div class="border-b-4 border-[#064b67] w-20 mb-4"></div>

    <div class="relative overflow-hidden w-full max-w-3xl h-64">
        {#if loadingWins}
            <p class="text-center text-gray-500">Loading recent wins...</p>
        {:else if recentWins.length === 0}
            <p class="text-center text-gray-500">No recent wins available at the moment.</p>
        {:else}
            <div class="flex transition-transform duration-500" style="transform: translateX(-{currentIndex * 100}%);">
                {#each recentWins as win, index}
                    <div class="w-full flex-shrink-0">
                        <img src={win.image} alt="Recent win {index + 1}" class="w-full h-64 object-cover rounded-lg shadow-md">
                    </div>
                {/each}
            </div>
        {/if}

        {#if recentWins.length > 1}
            <button on:click={prevSlide} class="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white rounded-full shadow-lg p-2" aria-label="Previous slide">
                &lt;
            </button>
            <button on:click={nextSlide} class="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white rounded-full shadow-lg p-2" aria-label="Next slide">
                &gt;
            </button>
        {/if}
    </div>
</section>

<section class="my-8 mx-4">
    <h2 class="text-2xl font-bold mb-4 text-center">Odds</h2>
    <p class="text-center mb-4">Your current tier: {userTier} (Odds: {itemLimit === Infinity ? 'Unlimited' : itemLimit})</p>
    
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        {#if loading}
            <p class="text-center text-gray-500 col-span-2">Loading items...</p>
        {:else if items.length === 0}
            <p class="text-center text-gray-500 col-span-2">No items available at the moment.</p>
        {:else}
            {#each items as item}
                <div class="bg-[#064b67] text-white p-6 rounded-lg shadow-md">
                    {#if item.image}
                        <img src={`https://odds.pockethost.io/api/files/Free_Tier/${item.id}/${item.image}`} alt="Odds item" class="w-full h-64 object-cover rounded-lg mb-4">
                    {:else}
                        <p>No image available.</p>
                    {/if}
                    <p>{item.description}</p>
                </div>
            {/each}
        {/if}
    </div>
</section>

<div class="mt-6 text-center">
    <a href="/payment">
        <button class="bg-[#064b67] text-white font-bold py-3 px-6 rounded-full hover:bg-yellow-400 transition duration-300 focus:outline-none">
            Upgrade
        </button>
    </a>
</div>

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