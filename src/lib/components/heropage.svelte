<script>
    import { goto } from '$app/navigation';

    const goToSignUp = () => {
        goto('/signup'); // Replace '/signup' with your sign-up page route
    };
</script>

<!-- Main Container -->
<div class="flex flex-col items-center justify-center min-h-screen bg-white p-2 mb-6">

  <!-- Header Section with logo, title, and description -->
  <div class="flex flex-col md:flex-row items-center justify-between w-full max-w-5xl">
    <div class="flex items-left">
      <img src="/logo.png" alt="Daily 2 Odds Logo" class="w-100 h-auto" />
    </div>
    <div class="mt-6 md:mt-0 md:text-leftt">
      <h1 class="text-5xl font-bold">
        STAY AHEAD OF THE GAME WITH <br />
        <span class="text-[#ffd700]">DAILY 2 ODDS</span>
      </h1>
      <p class="text-gray-600 mt-6 text-xl">
        Offering real-time, unbeatable betting odds to maximize your winnings
      </p>
    </div>
  </div>

  <!-- Call to Action Button -->
<button
    class="bg-[#064b67] text-white font-bold py-4 px-8 text-lg rounded-full hover:bg-[#FFD700] transition duration-300"
    on:click={goToSignUp}
>
    Get Started
</button>


  <!-- Logos Section -->
  <div class="relative overflow-hidden w-full max-w-7xl mt-12">
  <div class="flex items-center animate-marquee space-x-8">
    <img src="/premierlg.png" alt="Premier League" class="w-32 h-auto" />
    <img src="/bundesld.png" alt="Bundesliga" class="w-32 h-auto" />
    <img src="/laliga.png" alt="La Liga" class="w-32 h-auto" />
    <img src="/serie.jpeg" alt="Serie A" class="w-32 h-auto" />
    <img src="/lihue1.png" alt="Ligue 1" class="w-32 h-auto" />
    <!-- Duplicate the images to create a smooth loop -->
    <img src="/premierlg.png" alt="Premier League" class="w-32 h-auto" />
    <img src="/bundesld.png" alt="Bundesliga" class="w-32 h-auto" />
    <img src="/laliga.png" alt="La Liga" class="w-32 h-auto" />
    <img src="/serie.jpeg" alt="Serie A" class="w-32 h-auto" />
    <img src="/lihue1.png" alt="Ligue 1" class="w-32 h-auto" />

     <img src="/premierlg.png" alt="Premier League" class="w-32 h-auto" />
    <img src="/bundesld.png" alt="Bundesliga" class="w-32 h-auto" />
    <img src="/laliga.png" alt="La Liga" class="w-32 h-auto" />
    <img src="/serie.jpeg" alt="Serie A" class="w-32 h-auto" />
    <img src="/lihue1.png" alt="Ligue 1" class="w-32 h-auto" />
  </div>
</div>

</div>

<style>
  /* Custom Marquee Animation */
  @keyframes marquee {
    0% {
      transform: translateX(100%);
    }
    100% {
      transform: translateX(-100%);
    }
  }

  .animate-marquee {
    animation: marquee 30s linear infinite;
  }

  
</style>
