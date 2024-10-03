<script>
    import { goto } from '$app/navigation'; // Use this if you're using SvelteKit; change accordingly if using a different router.

    let faqs = [
        {
            question: "1. What is Daily Odds?",
            answer: "Daily Odds is an online platform that provides daily betting odds, allowing users to stay updated with the latest odds on various sporting events.",
            isOpen: false
        },
        {
            question: "2. How do I sign up?",
            answer: "You can sign up by clicking the 'Sign Up' button on the homepage. Fill in the required details, and once you submit the form, you'll be ready to start using Daily Odds.",
            isOpen: false
        },
        {
            question: "3. What are the different tiers and what do they offer?",
            answer: `We offer three membership tiers:`,
            list: [
                { tier: "Free", description: "Access to 2 betting odds items." },
                { tier: "Silver", description: "Access to 4 betting odds items." },
                { tier: "Gold", description: "Unlimited access to all available betting odds and exclusive features." }
            ],
            note: "To upgrade, click the 'Upgrade' button in your account section.",
            isOpen: false
        },
        {
            question: "4. How often are the odds updated?",
            answer: "Odds are updated daily to ensure you're getting the latest information on sporting events.",
            isOpen: false
        },
    ];

    function toggleFAQ(index) {
        faqs[index].isOpen = !faqs[index].isOpen;
    }

    function navigateToContact() {
        goto('/contact'); // Update this path based on your routing setup
    }
</script>

<section class="faq-section my-8 mx-4">
    <h2 class="text-3xl mt-8 font-bold mb-6 text-center">Frequently Asked Questions</h2>
    <div class="space-y-6">
        {#each faqs as faq, index}
            <div class="bg-white p-6 rounded-lg shadow-xl transition-transform transform hover:scale-105">
                <div class="flex justify-between items-center">
                    <h3 class="text-lg font-semibold">{faq.question}</h3>
                    <button 
                        class="bg-[#064b67] text-white rounded-full p-2 hover:bg-yellow-400 transition duration-300"
                        on:click={() => toggleFAQ(index)}>
                        {faq.isOpen ? '−' : '+'}
                    </button>
                </div>
                {#if faq.isOpen}
                    <p class="text-gray-700 mt-2">{faq.answer}</p>
                    {#if faq.list}
                        <ul class="list-disc ml-4 mt-2">
                            {#each faq.list as item}
                                <li><strong>{item.tier}</strong>: {item.description}</li>
                            {/each}
                        </ul>
                        <p class="text-gray-700 mt-2">{faq.note}</p>
                    {/if}
                {/if}
            </div>
        {/each}
    </div>
</section>

<style>
    .faq-section {
        max-width: 800px;
        margin: 0 auto;
    }
    .faq-section button {
        transition: transform 0.2s;
    }
</style>
