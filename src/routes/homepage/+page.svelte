<script>
    import Navbar from "$lib/components/navbar1.svelte";
    import PocketBase from 'pocketbase';
    import Footer from "$lib/components/footer.svelte";
    import { onMount } from 'svelte';

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
            switch(userTier) {
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

    async function fetchAllItems() {
        try {
            loading = true;
            
            if (!pb || typeof pb.collection !== 'function') {
                throw new Error('PocketBase client is not properly initialized');
            }

            // Initialize an empty array to store all items
            let allItems = [];
            let page = 1;
            const perPage = 500; // Fetch 500 items per request for efficiency
            
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
                
                console.log(`Fetched page ${page}, got ${batchItems.length} items`);
                
                // If we got fewer items than requested, we've reached the end
                if (batchItems.length < perPage) {
                    break;
                }
                
                page++;
            }

            console.log('Total items fetched:', allItems.length);

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

    onMount(async () => {
        await fetchUserDetails(); // Fetch user tier first
        await Promise.all([fetchNews(), fetchRecentWins(), fetchAllItems()]);
    });
</script>


<Navbar />

<!-- Recent Wins Section (Image Carousel) -->
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

<!-- Services Section with Redesigned Cards -->
<section class="mb-8">
    <h2 class="text-2xl font-bold mb-4 text-center ">What We Offer</h2>
    <div class="flex justify-center space-x-4 mt-4 mx-5">
        <!-- Card for Free Tier -->
        <div class="bg-white p-6 rounded-lg shadow-lg transition-transform duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl">
            <div class="flex items-center mb-4">
                <div class="bg-[#064b67] text-white rounded-full p-3 mr-3">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4" />
                    </svg>
                </div>
                <h3 class="text-lg font-semibold">Free Tier</h3>
            </div>
            <p class="text-gray-700">Access free odds and basic features for a seamless experience.</p>
            <p class="mt-2 font-bold text-gray-800">Subscription: Free</p>
        </div>
        
        <!-- Card for Silver Tier -->
        <div class="bg-white p-6 rounded-lg shadow-lg transition-transform duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl">
            <div class="flex items-center mb-4">
                <div class="bg-[#064b67] text-white rounded-full p-3 mr-3">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M3 12h18M3 6h18M3 18h18" />
                    </svg>
                </div>
                <h3 class="text-lg font-semibold">Silver Tier</h3>
            </div>
            <p class="text-gray-700">Enjoy special features like enhanced odds and priority support for an optimal experience.</p>
            <p class="mt-2 font-bold text-gray-800">Subscription: Ksh 500 ($3.57) Weekly | Ksh 1500 ($10.71) Monthly</p>
        </div>

        <!-- Card for Gold Tier -->
        <div class="bg-white p-6 rounded-lg shadow-lg transition-transform duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl">
            <div class="flex items-center mb-4">
                <div class="bg-[#064b67] text-white rounded-full p-3 mr-3">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4m0 4h.01M21 12c0 4.75-3.58 8.68-8 8.93M3 12c0-4.75 3.58-8.68 8-8.93" />
                    </svg>
                </div>
                <h3 class="text-lg font-semibold">Gold Tier</h3>
            </div>
            <p class="text-gray-700">Unlock exclusive features like personalized betting options and dedicated account management.</p>
            <p class="mt-2 font-bold text-gray-800">Subscription: Ksh 700 ($5.00) Weekly | Ksh 2100 ($15.00) Monthly</p>
        </div>
    </div>
</section>

<!-- Odds section -->
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

<!-- News Section (Card-style display) -->
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

    .carousel-wrapper {
        max-width: 80%;
        margin: 0 auto;
    }
</style>