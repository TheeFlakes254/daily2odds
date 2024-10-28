<script>
    import { goto } from '$app/navigation';

    const goToSignUp = () => {
        goto('/signup');
    };
</script>

<div class="flex flex-col items-center justify-center min-h-screen bg-white p-4 md:p-2 mb-6">
    <!-- Header Section with logo, title, and description -->
    <div class="flex flex-col md:flex-row items-center justify-between w-full max-w-5xl">
        <div class="flex items-center justify-center md:items-left w-full md:w-auto mb-6 md:mb-0">
            <img src="/logo.png" alt="Daily 2 Odds Logo" class="w-3/4 md:w-100 h-auto" />
        </div>
        <div class="mt-6 md:mt-0 text-center md:text-left">
            <h1 class="text-3xl md:text-5xl font-bold">
                STAY AHEAD OF THE GAME WITH <br />
                <span class="text-[#ffd700]">DAILY 2 ODDS</span>
            </h1>
            <p class="text-gray-600 mt-4 md:mt-6 text-lg md:text-xl px-4 md:px-0">
                Offering real-time, unbeatable betting odds to maximize your winnings
            </p>
        </div>
    </div>

    <!-- Call to Action Button -->
    <button
        class="bg-[#064b67] text-white font-bold py-3 md:py-4 px-6 md:px-8 text-base md:text-lg rounded-full hover:bg-[#FFD700] transition duration-300 mt-8 md:mt-0"
        on:click={goToSignUp}
    >
        Get Started
    </button>

    <!-- Logos Section -->
    <div class="relative overflow-hidden w-full max-w-7xl mt-8 md:mt-12">
        <div class="logos-slide-track">
            <!-- First set of images -->
            <div class="slide">
                <img src="/premierlg.png" alt="Premier League" class="w-20 md:w-32 h-auto" />
            </div>
            <div class="slide">
                <img src="/bundesld.png" alt="Bundesliga" class="w-20 md:w-32 h-auto" />
            </div>
            <div class="slide">
                <img src="/laliga.png" alt="La Liga" class="w-20 md:w-32 h-auto" />
            </div>
            <div class="slide">
                <img src="/serie.jpeg" alt="Serie A" class="w-20 md:w-32 h-auto" />
            </div>
            <div class="slide">
                <img src="/lihue1.png" alt="Ligue 1" class="w-20 md:w-32 h-auto" />
            </div>
            
            <!-- Duplicate for seamless loop -->
            <div class="slide">
                <img src="/premierlg.png" alt="Premier League" class="w-20 md:w-32 h-auto" />
            </div>
            <div class="slide">
                <img src="/bundesld.png" alt="Bundesliga" class="w-20 md:w-32 h-auto" />
            </div>
            <div class="slide">
                <img src="/laliga.png" alt="La Liga" class="w-20 md:w-32 h-auto" />
            </div>
            <div class="slide">
                <img src="/serie.jpeg" alt="Serie A" class="w-20 md:w-32 h-auto" />
            </div>
            <div class="slide">
                <img src="/lihue1.png" alt="Ligue 1" class="w-20 md:w-32 h-auto" />
            </div>
        </div>
    </div>
</div>

<style>
    @keyframes slide {
        0% {
            transform: translateX(0);
        }
        100% {
            transform: translateX(-50%);
        }
    }

    .logos-slide-track {
        display: flex;
        gap: 2rem;
        animation: slide 20s linear infinite;
        width: fit-content;
    }

    .logos-slide-track:hover {
        animation-play-state: paused;
    }

    .slide {
        flex-shrink: 0;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    @media (max-width: 768px) {
        .logos-slide-track {
            gap: 1rem;
            animation-duration: 15s;
        }
    }
</style>