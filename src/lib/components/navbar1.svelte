<script>
    import PocketBase from 'pocketbase';
    import { onMount } from 'svelte';
    import { session } from '$lib/stores/session';

    const pb = new PocketBase('https://odds.pockethost.io');

    let showProfileMenu = false;
    let showNotificationsMenu = false;
    let username = '';
    let notifications = []; // Array to hold notification messages

    const toggleProfileMenu = () => {
        showProfileMenu = !showProfileMenu; // Toggle the profile menu visibility
    };

    const closeProfileMenu = () => {
        showProfileMenu = false; // Close the profile menu
    };

    const toggleNotificationsMenu = () => {
        showNotificationsMenu = !showNotificationsMenu; // Toggle the notifications menu visibility
    };

    const closeNotificationsMenu = () => {
        showNotificationsMenu = false; // Close the notifications menu
    };

    const fetchUser = async () => {
        try {
            const record = await pb.collection('user').getOne('RECORD_ID'); // Replace 'RECORD_ID' with the actual ID
            username = record.username; // Assuming the username field is named 'username'
        } catch (error) {
            console.error("Error fetching user:", error);
        }
    };

    const fetchNotifications = async () => {
        try {
            const records = await pb.collection('notifications').getFullList(); // Fetch all notifications
            notifications = records.map(record => record.message); // Assuming the message field is named 'message'
        } catch (error) {
            console.error("Error fetching notifications:", error);
        }
    };

    const logout = () => {
        // Clear the session store
        session.set({ isLoggedIn: false, user: null });

        // Clear local storage
        localStorage.removeItem('user');

        // Redirect to the login page
        window.location.href = '/login';
    };


    // Fetch user data on component mount
    onMount(() => {
        fetchUser();
        fetchNotifications(); // Fetch notifications on component mount
    });
</script>

<nav class="flex items-center justify-between p-4 bg-white shadow-md">
    <div class="flex items-center">
        <img src="/logo.png" alt="Logo" class="w-12 h-12 mr-2">
        <span class="text-blue-600 font-bold text-xl">Daily <span class="text-orange-600 text-4xl align-middle">2</span> Odds</span>
    </div>

    <div class="relative flex items-center">
        <button on:click={toggleNotificationsMenu} class="flex items-center focus:outline-none mr-4">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6 text-gray-600">
                <path stroke-linecap="round" stroke-linejoin="round" d="M15 17h5l-1.405-1.405A2.121 2.121 0 0118 15V9a6 6 0 10-12 0v6a2.121 2.121 0 01-.595 1.595L3 17h5m10 0a2 2 0 11-4 0m4 0H7" />
            </svg>
        </button>

        <button on:click={toggleProfileMenu} class="flex items-center focus:outline-none">
            <div class="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-white font-bold">
                {username.charAt(0)} <!-- Display the first letter of the username as the avatar -->
            </div>
        </button>

{#if showNotificationsMenu}
    <div class="absolute right-0 mt-20 w-64 bg-white rounded-lg shadow-lg z-10"> <!-- Increased mt value -->
        <button on:click={closeNotificationsMenu} class="absolute top-2 right-2 bg-[#ffd700] rounded-full w-8 h-8 flex items-center justify-center shadow">
            &times; <!-- Close button (X) -->
        </button>
        <div class="p-4">
            <h3 class="font-bold text-lg mb-2 flex items-center justify-between">
                <span>Notifications</span> <!-- Notification count -->
            </h3>
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
            <div class="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10">
                <div class="py-2 px-4 text-gray-700 font-bold">{username}</div>
                <div class="border-t border-gray-200">
                    <a href="/contact" class="block px-4 py-2 text-gray-700 hover:bg-gray-100">Contact Us</a>
                    <a href="/settings" class="block px-4 py-2 text-gray-700 hover:bg-gray-100">Settings</a>
                    <button on:click={logout} class="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100">Logout</button>
                </div>
            </div>
        {/if}
    </div>
</nav>

<style>
    /* Optional: add some styling to your user profile card */
    .user-profile-card {
        /* You can style it here */
    }
</style>
