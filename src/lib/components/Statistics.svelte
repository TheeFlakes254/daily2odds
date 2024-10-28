<script>
    // You can make these props if you want to pass data from the parent
    export let stats = {
        successRate: '85%',
        activeUsers: '10K+',
        dailyPicks: '50+',
        winStreak: '15'
    };
</script>

<section class="mb-12">
    <div class="flex items-center justify-between mb-6">
        <h2 class="text-2xl font-bold">Statistics Overview</h2>
        <div class="border-b-4 border-[#064b67] w-20"></div>
    </div>

    <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
        <!-- Success Rate -->
        <div class="bg-white rounded-xl shadow-md p-4 md:p-6 text-center hover:shadow-lg transition-all duration-300">
            <div class="relative">
                <svg class="w-8 h-8 mx-auto mb-2 text-[#064b67]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p class="text-gray-500 text-sm md:text-base mb-2">Success Rate</p>
                <p class="text-2xl md:text-3xl font-bold text-[#064b67] stat-number">
                    {stats.successRate}
                </p>
            </div>
        </div>
        
        <!-- Active Users -->
        <div class="bg-white rounded-xl shadow-md p-4 md:p-6 text-center hover:shadow-lg transition-all duration-300">
            <div class="relative">
                <svg class="w-8 h-8 mx-auto mb-2 text-[#064b67]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
                <p class="text-gray-500 text-sm md:text-base mb-2">Active Users</p>
                <p class="text-2xl md:text-3xl font-bold text-[#064b67] stat-number">
                    {stats.activeUsers}
                </p>
            </div>
        </div>
        
        <!-- Daily Picks -->
        <div class="bg-white rounded-xl shadow-md p-4 md:p-6 text-center hover:shadow-lg transition-all duration-300">
            <div class="relative">
                <svg class="w-8 h-8 mx-auto mb-2 text-[#064b67]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                <p class="text-gray-500 text-sm md:text-base mb-2">Daily Picks</p>
                <p class="text-2xl md:text-3xl font-bold text-[#064b67] stat-number">
                    {stats.dailyPicks}
                </p>
            </div>
        </div>
        
        <!-- Win Streak -->
        <div class="bg-white rounded-xl shadow-md p-4 md:p-6 text-center hover:shadow-lg transition-all duration-300">
            <div class="relative">
                <svg class="w-8 h-8 mx-auto mb-2 text-[#064b67]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
                <p class="text-gray-500 text-sm md:text-base mb-2">Win Streak</p>
                <p class="text-2xl md:text-3xl font-bold text-[#064b67] stat-number">
                    {stats.winStreak}
                </p>
            </div>
        </div>
    </div>
</section>

<style>
    .stat-number {
        animation: countUp 0.5s ease-out;
    }

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

    /* Hover effects */
    .hover\:shadow-lg {
        transition: all 0.3s ease;
    }

    .hover\:shadow-lg:hover {
        transform: translateY(-2px);
    }
</style>