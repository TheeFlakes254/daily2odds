<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <script src="https://cdnjs.cloudflare.com/ajax/libs/tailwindcss/2.2.19/tailwind.min.js"></script>
</head>
<body>
    <nav class="flex items-center justify-between p-4 bg-white shadow-md relative">
        <!-- Logo Section -->
        <div class="flex items-center">
            <img src="/logo.png" alt="Logo" class="w-12 h-12 mr-2">
            <span class="text-blue-600 font-bold text-xl">Daily <span class="text-orange-600 text-4xl align-middle">2</span> Odds</span>
        </div>

        <!-- Desktop Menu -->
        <ul class="hidden md:flex space-x-6 font-bold mx-auto text-1xl">
            <li><a href="/about-us" class="text-gray-700 hover:text-blue-600 hover:underline transition duration-300">About us</a></li>
            <li><a href="/contact.svelte" class="text-gray-700 hover:text-blue-600 hover:underline transition duration-300">Contact</a></li>
            <li><a href="/faq" class="text-gray-700 hover:text-blue-600 hover:underline transition duration-300">FAQ</a></li>
        </ul>

        <!-- Desktop Login Button -->
        <a href="/login" class="hidden md:block bg-[#064b67] text-white px-4 py-2 rounded-md font-bold hover:bg-blue-700 transition duration-300">Login</a>

        <!-- Mobile Hamburger Button -->
        <button id="mobile-menu-button" class="md:hidden text-gray-500 hover:text-gray-700 focus:outline-none">
            <svg id="hamburger" class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path class="origin-center transition-transform" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>
            </svg>
            <svg id="close" class="h-6 w-6 hidden" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path class="origin-center transition-transform" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
        </button>

        <!-- Mobile Menu -->
        <div id="mobile-menu" class="hidden md:hidden absolute top-full left-0 right-0 bg-white shadow-md">
            <ul class="flex flex-col space-y-4 p-4">
                <li><a href="/about-us" class="block text-gray-700 hover:text-blue-600 hover:underline transition duration-300">About us</a></li>
                <li><a href="/contact.svelte" class="block text-gray-700 hover:text-blue-600 hover:underline transition duration-300">Contact</a></li>
                <li><a href="/faq" class="block text-gray-700 hover:text-blue-600 hover:underline transition duration-300">FAQ</a></li>
                <li><a href="/login" class="inline-block bg-[#064b67] text-white px-4 py-2 rounded-md font-bold hover:bg-blue-700 transition duration-300">Login</a></li>
            </ul>
        </div>
    </nav>

    <script>
        const mobileMenuButton = document.getElementById('mobile-menu-button');
        const mobileMenu = document.getElementById('mobile-menu');
        const hamburger = document.getElementById('hamburger');
        const close = document.getElementById('close');

        mobileMenuButton.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
            hamburger.classList.toggle('hidden');
            close.classList.toggle('hidden');
        });
    </script>
</body>
</html>