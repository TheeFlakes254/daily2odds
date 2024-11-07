<script>
    import { onMount } from 'svelte';
    import PocketBase from 'pocketbase';
    import { fade, slide } from 'svelte/transition';
    import { quintOut } from 'svelte/easing';

    const pb = new PocketBase('https://odds.pockethost.io');

    let notifications = [];
    let selectedNotification = null;
    let loading = true;
    let error = null;
    let unreadCount = 0;
    let searchQuery = '';
    let filteredNotifications = [];
    let activeFilter = 'all';

    async function fetchNotifications() {
        try {
            loading = true;
            error = null;

            const records = await pb.collection('notifications').getFullList({
                sort: '-created',
            });

            notifications = records.map(item => ({
                id: item.id,
                message: item.message || 'No message content',
                heading: item.heading || 'Notification',
                created: formatDate(new Date(item.created)),
                status: item.status || 'unread',
                type: item.type || 'info',
                original_date: item.created
            }));

            updateFilteredNotifications();
            updateUnreadCount();

        } catch (err) {
            console.error('Error fetching notifications:', err);
            error = 'Failed to load notifications';
        } finally {
            loading = false;
        }
    }

    function updateUnreadCount() {
        unreadCount = notifications.filter(n => n.status === 'unread').length;
    }

    function updateFilteredNotifications() {
        if (activeFilter === 'all') {
            filteredNotifications = [...notifications];
        } else {
            filteredNotifications = notifications.filter(n => n.status === activeFilter);
        }

        if (searchQuery) {
            filteredNotifications = filteredNotifications.filter(notification =>
                notification.heading.toLowerCase().includes(searchQuery.toLowerCase()) ||
                notification.message.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        filteredNotifications.sort((a, b) => {
            if (a.status === 'unread' && b.status === 'read') return -1;
            if (a.status === 'read' && b.status === 'unread') return 1;
            return new Date(b.original_date) - new Date(a.original_date);
        });
    }

    function formatDate(date) {
        const now = new Date();
        const diff = now - date;
        const minutes = Math.floor(diff / 60000);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);

        if (minutes < 60) return minutes <= 1 ? 'Just now' : `${minutes}m ago`;
        if (hours < 24) return `${hours}h ago`;
        if (days < 7) return `${days}d ago`;
        return date.toLocaleDateString('en-US', { 
            month: 'short', 
            day: 'numeric'
        });
    }

    async function markAsRead(notification) {
        try {
            if (notification.status === 'unread') {
                // Update in PocketBase
                await pb.collection('notifications').update(notification.id, {
                    status: 'read'
                });

                // Immediately update the notification in both arrays
                notifications = notifications.map(n => 
                    n.id === notification.id 
                        ? { ...n, status: 'read' } 
                        : n
                );

                // Update filtered notifications and unread count
                updateFilteredNotifications();
                updateUnreadCount();

                // If this notification is selected, update the modal as well
                if (selectedNotification && selectedNotification.id === notification.id) {
                    selectedNotification = { ...selectedNotification, status: 'read' };
                }
            }
        } catch (err) {
            console.error('Error marking notification as read:', err);
        }
    }

    function handleSearch(event) {
        searchQuery = event.target.value;
        updateFilteredNotifications();
    }

    async function handleNotificationClick(notification) {
        // First update the UI immediately
        const updatedNotification = { ...notification };
        if (notification.status === 'unread') {
            updatedNotification.status = 'read';
            
            // Update the notifications array immediately
            notifications = notifications.map(n => 
                n.id === notification.id 
                    ? updatedNotification 
                    : n
            );
            
            // Update filtered notifications and counts
            updateFilteredNotifications();
            updateUnreadCount();
        }
        
        // Show the modal with updated status
        selectedNotification = updatedNotification;
        
        // Then perform the backend update
        await markAsRead(notification);
    }

    function filterNotifications(filter) {
        activeFilter = filter;
        updateFilteredNotifications();
    }

    onMount(() => {
        fetchNotifications();
        
        const unsubscribe = pb.collection('notifications').subscribe('*', (e) => {
            if (e.action === 'create' || e.action === 'update' || e.action === 'delete') {
                fetchNotifications();
            }
        });

        return () => {
            unsubscribe();
        };
    });
</script>

<div class="min-h-screen bg-gray-50 p-4 lg:p-8">
    <div class="max-w-5xl mx-auto">
        <!-- Header Section -->
        <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
            <div class="flex items-center gap-6">
                <h1 class="text-3xl font-bold text-gray-900">Notifications</h1>
                <div class="relative">
                    <svg class="w-7 h-7 text-gray-700 transition-transform hover:scale-110 cursor-pointer" 
                         viewBox="0 0 24 24" 
                         fill="none" 
                         stroke="currentColor">
                        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 0 1-3.46 0" 
                              stroke-linecap="round" 
                              stroke-linejoin="round" 
                              stroke-width="2"/>
                    </svg>
                    {#if unreadCount > 0}
                        <span class="absolute -top-2 -right-2 h-5 w-5 bg-red-500 rounded-full text-white text-xs flex items-center justify-center animate-pulse">
                            {unreadCount}
                        </span>
                    {/if}
                </div>
            </div>

            <div class="w-full md:w-auto flex flex-col md:flex-row gap-4">
                <!-- Search Bar -->
                <div class="relative flex-grow md:max-w-xs">
                    <input
                        type="text"
                        placeholder="Search notifications..."
                        class="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-center"
                        value={searchQuery}
                        on:input={handleSearch}
                    />
                    <svg class="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" 
                         fill="none" 
                         viewBox="0 0 24 24" 
                         stroke="currentColor">
                        <path stroke-linecap="round" 
                              stroke-linejoin="round" 
                              stroke-width="2" 
                              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                    </svg>
                </div>

                <!-- Filter Buttons -->
                <div class="flex gap-2">
                    {#each ['all', 'unread', 'read'] as filter}
                        <button
                            class="px-4 py-2 rounded-lg text-sm font-medium transition-colors
                                   {activeFilter === filter ? 
                                     'bg-blue-500 text-white' : 
                                     'bg-white text-gray-600 hover:bg-gray-100'}"
                            on:click={() => filterNotifications(filter)}
                        >
                            {filter.charAt(0).toUpperCase() + filter.slice(1)}
                        </button>
                    {/each}
                </div>
            </div>
        </div>

        <!-- Loading State -->
        {#if loading}
            <div class="flex justify-center py-12">
                <div class="animate-spin rounded-full h-8 w-8 border-2 border-blue-500 border-t-transparent"></div>
            </div>
        {/if}

        <!-- Notifications List -->
        {#if !loading && filteredNotifications.length > 0}
            <div class="space-y-4">
                {#each filteredNotifications as notification (notification.id)}
                    <div
                        transition:slide={{duration: 200}}
                        class="rounded-lg shadow-sm hover:shadow-md transition-all cursor-pointer
                               {notification.status === 'unread' ? 
                                 'bg-blue-50 hover:bg-blue-100' : 
                                 'bg-white hover:bg-gray-50'}"
                        on:click={() => handleNotificationClick(notification)}
                    >
                        <div class="p-4 md:p-6">
                            <div class="flex items-start justify-between gap-4">
                                <div class="flex-1">
                                    <div class="flex items-center gap-2 mb-1">
                                        {#if notification.status === 'unread'}
                                            <div class="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                                        {/if}
                                        <h3 class="font-semibold text-gray-900">
                                            {notification.heading}
                                        </h3>
                                    </div>
                                    <p class="text-gray-600 line-clamp-2 mb-3">
                                        {notification.message}
                                    </p>
                                    <div class="flex items-center text-sm text-gray-500">
                                        <span class="inline-flex items-center gap-1">
                                            <span>{notification.created}</span>
                                            <span class="mx-2">•</span>
                                            <span class="capitalize">{notification.type}</span>
                                        </span>
                                        <span class="mx-2">•</span>
                                        <span class="capitalize text-xs px-2 py-1 rounded-full transition-colors duration-200
                                                   {notification.status === 'unread' ? 
                                                     'bg-blue-100 text-blue-700' : 
                                                     'bg-gray-100 text-gray-600'}">
                                            {notification.status}
                                        </span>
                                    </div>
                                </div>
                                <div class="text-gray-400 hover:text-gray-600">
                                    <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                                    </svg>
                                </div>
                            </div>
                        </div>
                    </div>
                {/each}
            </div>
        {:else if !loading}
            <div class="text-center py-12 bg-white rounded-lg shadow-sm">
                <svg class="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" 
                          d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"/>
                </svg>
                <p class="text-gray-500 text-lg">No notifications found</p>
            </div>
        {/if}

        <!-- Notification Detail Modal -->
        {#if selectedNotification}
            <div
                transition:fade={{duration: 150}}
                class="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
                on:click={() => selectedNotification = null}
            >
                <div
                    class="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto m-4"
                    on:click|stopPropagation
                >
                    <div class="p-6 border-b border-gray-100">
                        <div class="flex justify-between items-start">
                            <div class="flex items-center gap-3">
                                <h2 class="text-xl font-semibold text-gray-900">
                                    {selectedNotification.heading}
                                </h2>
                                <span class="capitalize text-xs px-2 py-1 rounded-full
                                           {selectedNotification.status === 'unread' ? 
                                             'bg-blue-100 text-blue-700' : 
                                             'bg-gray-100 text-gray-600'}">
                                    {selectedNotification.status}
                                </span>
                            </div>
                            <button
                                class="text-gray-400 hover:text-gray-600"
                                on:click={() => selectedNotification = null}
                            >
                                <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                                </svg>
                            </button>
                        </div>
                    </div>
                    <div class="p-6">
                        <div class="prose max-w-none">
                            <p class="text-gray-600 whitespace-pre-line">
                                {selectedNotification.message}
                            </p>
                        </div>
                        <div class="mt-6 pt-6 border-t border-gray-100">
                            <div class="flex items-center justify-between text-sm text-gray-500">
                                <span>{selectedNotification.created}</span>
                                <span class="capitalize">{selectedNotification.type}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        {/if}
    </div>
</div>

<style>
    .line-clamp-2 {
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
    }

    :global(.prose) {
        max-width: none;
    }

    input::placeholder {
        text-align: center;
    }

    ::-webkit-scrollbar {
        width: 8px;
    }

    ::-webkit-scrollbar-track {
        background: transparent;
    }

    ::-webkit-scrollbar-thumb {
        background: #cbd5e1;
        border-radius: 4px;
    }

    ::-webkit-scrollbar-thumb:hover {
        background: #94a3b8;
    }
</style>