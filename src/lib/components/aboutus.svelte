<script>
  // Add any Svelte logic here if needed
</script>

<section class="bg-white text-gray-800">
  <!-- Hero Section -->
  <div class="bg-[#064b67] text-white py-8 md:py-16">
    <div class="container mx-auto px-4 md:px-12 flex flex-col md:flex-row items-center">
      <!-- Text Content -->
      <div class="w-full md:w-1/2 text-center md:text-left">
        <h1 class="text-3xl md:text-4xl font-bold mb-4">About Us</h1>
        <p class="text-base md:text-lg mb-6 md:mb-8">
          Welcome to <strong>Daily 2 Odds</strong>, your ultimate destination for expert betting advice and unbeatable odds. 
          We pride ourselves on providing the most accurate predictions, drawing from a team of seasoned analysts with a deep 
          understanding of various sports like football.
        </p>
        <p class="text-base md:text-lg mb-6 md:mb-8">
          At Daily 2 Odds, we believe in responsible gambling, so we offer tools and tips to ensure you enjoy betting without losing sight of your limits. 
          With our real-time updates, you can access the latest odds and tips at your convenience, empowering you to make informed decisions in a fast-paced market.
        </p>
        <p class="text-base md:text-lg mb-6 md:mb-8">
          Join the thousands of users who trust Daily 2 Odds to give them the edge they need. Bet smart, bet safe, and maximize your winning potential with us.
        </p>
      </div>
      
      <!-- Image -->
      <div class="w-full md:w-1/2 mt-8 md:mt-0 px-4 md:px-0">
        <img 
          src="/logo.png" 
          alt="About Us" 
          class="mx-auto w-full max-w-md md:max-w-lg h-auto rounded-lg shadow-lg" 
        />
      </div>
    </div>
  </div>

  <!-- Mission Section -->
  <div class="container mx-auto px-4 md:px-12 py-8 md:py-12">
    <h2 class="text-2xl md:text-3xl font-bold text-center mb-4 md:mb-6">Our Mission</h2>
    <p class="text-base md:text-lg text-center max-w-3xl mx-auto mb-8 md:mb-12 px-4">
      Our mission is to offer the most accurate and reliable betting odds to help bettors increase their chances of winning.
      We strive to empower our users by providing real-time insights and expert recommendations to make informed betting decisions.
    </p>
  </div>

  <!-- Call to Action Section -->
  <div class="py-10 md:py-16 bg-[#064b67] text-white">
    <div class="container mx-auto px-4 md:px-12 text-center">
      <h2 class="text-2xl md:text-3xl font-bold mb-4 md:mb-6">Join Us Today!</h2>
      <p class="text-base md:text-lg mb-6 md:mb-8 px-4">
        Ready to get unbeatable odds and expert betting tips? Sign up now and take your betting to the next level!
      </p>
      <a 
        href="/signup" 
        class="inline-block bg-[#FFD700] text-[#064b67] font-bold py-3 px-6 rounded-full hover:bg-white transition duration-300 text-sm md:text-base"
      >
        Get Started
      </a>
    </div>
  </div>
</section>

<style>
  @media (max-width: 768px) {
    img {
      max-width: 90%;
      margin: 0 auto;
    }
  }
</style>