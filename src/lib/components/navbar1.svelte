<script>
    import { onMount } from 'svelte';
    import PocketBase from 'pocketbase';

    const pb = new PocketBase('https://odds.pockethost.io');
    
    // Initialize state variables
    let showProfileMenu = false;
    let showNotificationsMenu = false;
    let username = '';
    let notifications = [];

    // Menu toggle functions
    const toggleProfileMenu = () => {
        showProfileMenu = !showProfileMenu;
        if (showNotificationsMenu) showNotificationsMenu = false;
    };

    const toggleNotificationsMenu = () => {
        showNotificationsMenu = !showNotificationsMenu;
        if (showProfileMenu) showProfileMenu = false;
    };

    const closeNotificationsMenu = () => {
        showNotificationsMenu = false;
    };

    const closeProfileMenu = () => {
        showProfileMenu = false;
    };

    // Fetch user data
    const fetchUser = async () => {
        try {
            const userData = localStorage.getItem('user');
            if (userData) {
                const user = JSON.parse(userData);
                username = user.username;
            }
        } catch (error) {
            console.error("Error fetching user:", error);
        }
    };

    // Fetch notifications
    const fetchNotifications = async () => {
        try {
            const records = await pb.collection('notifications').getFullList({
                sort: '-created'
            });
            notifications = records.map(record => record.message);
        } catch (error) {
            console.error("Error fetching notifications:", error);
            notifications = [];
        }
    };

    // Simple logout function
    const logout = () => {
        pb.authStore.clear();
        localStorage.removeItem('user');
        window.location.href = '/login';
    };

    // Click outside handler
    const handleClickOutside = (event) => {
        if (showProfileMenu && !event.target.closest('.profile-menu')) {
            closeProfileMenu();
        }
        if (showNotificationsMenu && !event.target.closest('.notifications-menu')) {
            closeNotificationsMenu();
        }
    };

    onMount(() => {
        fetchUser();
        fetchNotifications();
        document.addEventListener('click', handleClickOutside);
        
        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    });
</script>

<nav class="flex items-center justify-between p-4 bg-white shadow-md">
    <div class="flex items-center">
        <a href="/homepage"> 
            <img src="/images/logo.png" alt="Logo" class="w-12 h-12 mr-2" on:error={(e) => e.target.src = '/images/fallback-logo.png'}>
            <span class="text-blue-600 font-bold text-xl">Daily <span class="text-orange-600 text-4xl align-middle">2</span> Odds</span>
        </a>
    </div>

    <div class="text-center">
        <a href="/tricks" class="text-gray-700 hover:text-[#064b67] font-semibold text-lg">Tips & Tricks</a>
    </div>

    <div class="relative flex items-center">
        <button 
            on:click|stopPropagation={toggleNotificationsMenu} 
            class="flex items-center focus:outline-none mr-4">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6 text-gray-600">
                <path stroke-linecap="round" stroke-linejoin="round" d="M15 17h5l-1.405-1.405A2.121 2.121 0 0118 15V9a6 6 0 10-12 0v6a2.121 2.121 0 01-.595 1.595L3 17h5m10 0a2 2 0 11-4 0m4 0H7" />
            </svg>
        </button>

        <button 
            on:click|stopPropagation={toggleProfileMenu} 
            class="flex items-center focus:outline-none">
            <div class="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-white font-bold">
                {#if username}
                    {username[0].toUpperCase()}
                {:else}
                    U
                {/if}
            </div>
        </button>

        {#if showNotificationsMenu}
            <div class="notifications-menu absolute right-0 mt-20 w-64 bg-white rounded-lg shadow-lg z-10">
                <button 
                    on:click={closeNotificationsMenu} 
                    class="absolute top-2 right-2 bg-[#ffd700] rounded-full w-8 h-8 flex items-center justify-center shadow">
                    ×
                </button>
                <div class="p-4">
                    <h3 class="font-bold text-lg mb-2">Notifications</h3>
                    <div class="flex flex-col space-y-2">
                        {#if notifications.length > 0}
                            {#each notifications as message}
                                <div class="bg-[#064b67] text-white p-3 rounded-md shadow">
                                    {message}
                                </div>
                            {/each}
                        {:else}
                            <div class="px-4 py-2 text-gray-700">No notifications</div>
                        {/if}
                    </div>
                </div>
            </div>
        {/if}

        {#if showProfileMenu}
            <div class="profile-menu absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10">
                <div class="py-2 px-4 text-gray-700 font-bold">{username || 'User'}</div>
                <div class="border-t border-gray-200">
                    <a href="/contact" class="block px-4 py-2 text-gray-700 hover:bg-gray-100">Contact Us</a>
                    <a href="/settings" class="block px-4 py-2 text-gray-700 hover:bg-gray-100">Settings</a>
                    <button 
                        on:click={logout} 
                        class="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100">
                        Logout
                    </button>
                </div>
            </div>
        {/if}
    </div>
</nav>