<script>
    import { onMount } from 'svelte';
    import Footer from '$lib/components/footer.svelte';
    import Navbar1 from '$lib/components/navbar1.svelte';

    let roadmap = [];

    // Simulate fetching roadmap tips from a database or API
    const fetchRoadmap = async () => {
        roadmap = [
            {
                step: 1,
                title: 'Maximizing Your Odds',
                description: 'Research and analyze stats, patterns, and performance. The more you know, the better you can predict outcomes.',
                icon: 'M12 4.75a2.25 2.25 0 1 0 0 4.5 2.25 2.25 0 0 0 0-4.5zm0 3.75a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm0 6a2.25 2.25 0 1 0 0 4.5 2.25 2.25 0 0 0 0-4.5zm0 3.75a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3z', // Example SVG path data
            },
            {
                step: 2,
                title: 'Betting with Small Stakes',
                description: 'Start small and grow gradually. This helps minimize losses while building confidence and understanding.',
                icon: 'M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm0 18a8 8 0 1 1 0-16 8 8 0 0 1 0 16z',
            },
            {
                step: 3,
                title: 'Managing Your Bankroll',
                description: 'Set a budget and stick to it. Proper money management is key to long-term success and avoiding unnecessary losses.',
                icon: 'M8 6h8v2H8V6zm0 4h8v2H8v-2zm0 4h8v2H8v-2z',
            },
            {
                step: 4,
                title: 'Avoiding Emotional Betting',
                description: 'Stay logical, not emotional. Bet with a clear head and avoid letting excitement or disappointment influence decisions.',
                icon: 'M12 3a9 9 0 1 1-9 9 9 9 0 0 1 9-9zm0 16a7 7 0 1 0-7-7 7 7 0 0 0 7 7z',
            },
            {
                step: 5,
                title: 'Understanding Market Movements',
                description: 'Keep an eye on odds changes and market dynamics. Understanding these shifts can give you an edge in betting decisions.',
                icon: 'M3 12h18M3 6h18M3 18h18',
            }
        ];
    };

    onMount(() => {
        fetchRoadmap();
    });
</script>
<Navbar1/>
<main class="container mx-auto p-6 bg-white">
    <h1 class="text-4xl font-bold text-center text-[#064b67] mb-8">Your Betting Success Roadmap</h1>

    <div class="relative">
        <!-- Roadmap Line -->
        <div class="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-white rounded-lg"></div>

        <!-- Roadmap Items -->
        {#each roadmap as step (step.step)}
            <div class="relative flex flex-col items-center mb-10">
                <!-- Circle for Step Number -->
                <div class="z-10 flex items-center justify-center w-12 h-12 bg-[#064b67] text-white font-bold rounded-full shadow-lg">
                    {step.step}
                </div>

                <!-- Connecting Line between Steps -->
                <div class="absolute left-1/2 transform -translate-x-1/2 bg-[#d6e9e9] w-1 h-full z-0"></div>

                <!-- Step Content -->
                <div class="bg-white w-full sm:w-2/3 lg:w-1/3 p-4 rounded-lg shadow-lg mt-6 relative z-10 transition-transform transform hover:-translate-y-2 hover:shadow-xl flex items-center space-x-4">
                    <svg class="w-12 h-12 text-[#064b67]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" d={step.icon} />
                    </svg>
                    <div>
                        <h2 class="text-xl font-semibold text-[#064b67] mb-1">{step.title}</h2>
                        <p class="text-gray-700">{step.description}</p>
                    </div>
                </div>
            </div>
        {/each}
    </div>
</main>

<Footer/>

<style>
    main {
        max-width: 1200px;
        background-color: white; /* Set the main background to white */
        padding: 2rem;
        box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
    }

    h1 {
        text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.1);
    }

    .bg-white {
        background: linear-gradient(145deg, #ffffff, #f1f1f1);
        box-shadow: 5px 5px 15px rgba(0, 0, 0, 0.1), -5px -5px 15px rgba(255, 255, 255, 0.9);
    }

    .rounded-lg {
        border-radius: 15px;
    }

    .shadow-lg {
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
    }
</style>
