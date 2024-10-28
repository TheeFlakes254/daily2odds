<script>
    import SidebarHeader from '$lib/components/SidebarHeader.svelte';
    // ... other imports

    let userTier = 'free';
    let isSidebarOpen = false;
    let userMenuOpen = false;

    const toggleSidebar = () => {
        isSidebarOpen = !isSidebarOpen;
    };
</script>

<aside class="fixed md:static w-80 h-screen bg-[#064b67] text-white transform {isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 transition-transform duration-200 ease-in-out z-30">
    <div class="flex flex-col h-full">
        <SidebarHeader 
            {userTier}
            {toggleSidebar}
            {isSidebarOpen}
            bind:userMenuOpen
        />
        <!-- Rest of your sidebar content -->
    </div>
</aside>