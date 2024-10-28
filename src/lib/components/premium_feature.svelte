<script>
    import { getContext } from 'svelte';
    
    // You can either pass userTier as a prop or get it from context
    export let userTier = 'free';
</script>

<!-- Premium Features Component -->
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