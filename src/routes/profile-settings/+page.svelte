<script>
    import { onMount } from 'svelte';
    import PocketBase from 'pocketbase';
    import { navigating } from '$app/stores';

    const pb = new PocketBase('https://odds.pockethost.io');
    
    let activeTab = 'profile';
    let loading = false;
    let successMessage = '';
    let errorMessage = '';
    
    // User data
    let userData = {
        email: '',
        name: '',
        phoneNumber: '',
        avatar: null,
        country: '',
        timezone: '',
        language: 'en',
        notifications: {
            email: false,
            push: false,
            sms: false,
            newsletter: false,
            promotions: false
        },
        preferences: {
            darkMode: false,
            autoPlay: true,
            showBalance: true,
            oddsFormat: 'decimal'
        }
    };

    // Activity history
    let activityHistory = [];
    let bettingHistory = [];
    let loginHistory = [];
    let isLoadingHistory = false;
    let currentPage = 1;
    let totalPages = 1;

    // Change password form
    let passwordForm = {
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    };

    // Load user data
    async function loadUserData() {
        try {
            loading = true;
            const user = pb.authStore.model;
            if (user) {
                userData = {
                    ...userData,
                    email: user.email,
                    name: user.name || '',
                    phoneNumber: user.phoneNumber || '',
                    country: user.country || '',
                    timezone: user.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone,
                    language: user.language || 'en',
                    avatar: user.avatar,
                    notifications: {
                        ...userData.notifications,
                        ...user.notifications
                    },
                    preferences: {
                        ...userData.preferences,
                        ...user.preferences
                    }
                };
                await loadActivityHistory();
                await loadBettingHistory();
                await loadLoginHistory();
            }
        } catch (error) {
            console.error('Error loading user data:', error);
            errorMessage = 'Failed to load user data';
        } finally {
            loading = false;
        }
    }

    // Load activity history
    async function loadActivityHistory() {
        try {
            isLoadingHistory = true;
            // Simulate loading activity history
            activityHistory = [
                { 
                    type: 'bet_placed',
                    description: 'Placed bet on Manchester United vs Chelsea',
                    amount: 50,
                    timestamp: new Date(Date.now() - 3600000).toISOString()
                },
                {
                    type: 'bet_won',
                    description: 'Won bet on Lakers vs Warriors',
                    amount: 120,
                    timestamp: new Date(Date.now() - 86400000).toISOString()
                },
                // Add more activity items as needed
            ];
        } catch (error) {
            console.error('Error loading activity history:', error);
        } finally {
            isLoadingHistory = false;
        }
    }

    // Load betting history
    async function loadBettingHistory() {
        try {
            isLoadingHistory = true;
            // Simulate loading betting history
            bettingHistory = [
                {
                    id: 'bet1',
                    event: 'Manchester United vs Chelsea',
                    stake: 50,
                    odds: 1.95,
                    status: 'won',
                    payout: 97.50,
                    date: new Date(Date.now() - 3600000).toISOString()
                },
                // Add more betting history items
            ];
        } catch (error) {
            console.error('Error loading betting history:', error);
        } finally {
            isLoadingHistory = false;
        }
    }

    // Load login history
    async function loadLoginHistory() {
        try {
            isLoadingHistory = true;
            // Simulate loading login history
            loginHistory = [
                {
                    timestamp: new Date(Date.now() - 3600000).toISOString(),
                    device: 'iPhone 12',
                    location: 'London, UK',
                    ip: '192.168.1.1',
                    status: 'success'
                },
                // Add more login history items
            ];
        } catch (error) {
            console.error('Error loading login history:', error);
        } finally {
            isLoadingHistory = false;
        }
    }

    // Save profile changes
    async function handleProfileUpdate() {
        try {
            loading = true;
            errorMessage = '';
            successMessage = '';

            const user = pb.authStore.model;
            await pb.collection('users').update(user.id, {
                name: userData.name,
                phoneNumber: userData.phoneNumber,
                country: userData.country,
                timezone: userData.timezone,
                language: userData.language,
                notifications: userData.notifications,
                preferences: userData.preferences
            });
            
            successMessage = 'Profile updated successfully';
        } catch (error) {
            console.error('Error updating profile:', error);
            errorMessage = error.message || 'Failed to update profile';
        } finally {
            loading = false;
        }
    }

    // Handle password change
    async function handlePasswordChange() {
        try {
            loading = true;
            errorMessage = '';
            successMessage = '';

            if (passwordForm.newPassword !== passwordForm.confirmPassword) {
                throw new Error('New passwords do not match');
            }

            const user = pb.authStore.model;
            // Verify current password
            await pb.collection('users').authWithPassword(user.email, passwordForm.currentPassword);
            
            // Update password
            await pb.collection('users').update(user.id, {
                password: passwordForm.newPassword,
                passwordConfirm: passwordForm.confirmPassword
            });

            successMessage = 'Password updated successfully';
            passwordForm = {
                currentPassword: '',
                newPassword: '',
                confirmPassword: ''
            };
        } catch (error) {
            console.error('Error changing password:', error);
            errorMessage = error.message || 'Failed to change password';
        } finally {
            loading = false;
        }
    }

    // Format date
    function formatDate(dateString) {
        return new Date(dateString).toLocaleString();
    }

    // Format amount
    function formatAmount(amount) {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(amount);
    }

    onMount(loadUserData);
</script>

<div class="container mx-auto px-4 py-8">
    <div class="max-w-6xl mx-auto">
        <!-- Profile Header -->
        <div class="bg-white rounded-2xl shadow-lg p-6 mb-6">
            <div class="flex flex-col md:flex-row items-start md:items-center gap-6">
                <!-- Avatar -->
                <div class="relative">
                    <div class="w-24 h-24 rounded-full bg-gradient-to-r from-blue-400 to-blue-600 flex items-center justify-center text-white text-3xl font-bold">
                        {userData.name ? userData.name[0].toUpperCase() : 'U'}
                    </div>
                    <button class="absolute bottom-0 right-0 bg-white rounded-full p-2 shadow-lg">
                        <svg class="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                    </button>
                </div>

                <!-- User Info -->
                <div class="flex-1">
                    <h1 class="text-2xl font-bold text-gray-900">{userData.name || 'User'}</h1>
                    <p class="text-gray-600">{userData.email}</p>
                    <div class="flex flex-wrap gap-2 mt-2">
                        <span class="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                            Free Tier
                        </span>
                        <span class="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                            Email Verified
                        </span>
                    </div>
                </div>
            </div>
        </div>

        <!-- Navigation Tabs -->
        <div class="bg-white rounded-xl shadow-lg mb-6 p-1">
            <div class="flex flex-wrap gap-2">
                <button
                    class="flex-1 px-4 py-2 rounded-lg text-sm font-medium {activeTab === 'profile' ? 'bg-blue-500 text-white' : 'text-gray-600 hover:bg-gray-100'}"
                    on:click={() => activeTab = 'profile'}
                >
                    Profile
                </button>
                <button
                    class="flex-1 px-4 py-2 rounded-lg text-sm font-medium {activeTab === 'security' ? 'bg-blue-500 text-white' : 'text-gray-600 hover:bg-gray-100'}"
                    on:click={() => activeTab = 'security'}
                >
                    Security
                </button>
                <button
                    class="flex-1 px-4 py-2 rounded-lg text-sm font-medium {activeTab === 'preferences' ? 'bg-blue-500 text-white' : 'text-gray-600 hover:bg-gray-100'}"
                    on:click={() => activeTab = 'preferences'}
                >
                    Preferences
                </button>
                <button
                    class="flex-1 px-4 py-2 rounded-lg text-sm font-medium {activeTab === 'activity' ? 'bg-blue-500 text-white' : 'text-gray-600 hover:bg-gray-100'}"
                    on:click={() => activeTab = 'activity'}
                >
                    Activity
                </button>
            </div>
        </div>

        <!-- Success/Error Messages -->
        {#if errorMessage}
            <div class="mb-6 p-4 bg-red-50 border border-red-200 text-red-600 rounded-lg">
                {errorMessage}
            </div>
        {/if}

        {#if successMessage}
            <div class="mb-6 p-4 bg-green-50 border border-green-200 text-green-600 rounded-lg">
                {successMessage}
            </div>
        {/if}

        <!-- Content Sections -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <!-- Main Content -->
            <div class="md:col-span-2 space-y-6">
                {#if activeTab === 'profile'}
                    <!-- Profile Section -->
                    <div class="bg-white rounded-2xl shadow-lg p-6">
                        <h2 class="text-xl font-bold mb-6">Personal Information</h2>
                        <div class="space-y-4">
                            <div>
                                <label for="name" class="block text-sm font-medium text-gray-700 mb-1">
                                    Full Name
                                </label>
                                <input
                                    type="text"
                                    id="name"
                                    bind:value={userData.name}
                                    class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>

                            <div>
                                <label for="email" class="block text-sm font-medium text-gray-700 mb-1">
                                    Email Address
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    bind:value={userData.email}
                                    disabled
                                    class="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50"
                                />
                            </div>

                            <div>
                                <label for="phone" class="block text-sm font-medium text-gray-700 mb-1">
                                    Phone Number
                                </label>
                                <input
                                    type="tel"
                                    id="phone"
                                    bind:value={userData.phoneNumber}
                                    class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="+1 234 567 8900"
                                />
                            </div>

                            <div>
                                <label for="country" class="block text-sm font-medium text-gray-700 mb-1">
                                    Country
                                </label>
                                <select
                                    id="country"
                                    bind:value={userData.country}
                                    class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                >
                                    <option value="">Select country</option>
                                    <option value="US">United States</option>
                                    <option value="UK">United Kingdom</option>
                                    <option value="CA">Canada</option>
                                    <!-- Add more countries -->
                                </select>
                            </div>

                            <div>
                                <label for="timezone" class="block text-sm font-medium text-gray-700 mb-1">
                                    Timezone
                                </label>
                                <select
                                    id="timezone"
                                    bind:value={userData.timezone}
                                    class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                >
                                    <option value="">Select timezone</option>
                                    <option value="UTC">UTC</option>
                                    <option value="America/New_York">Eastern Time</option>
                                    <option value="America/Chicago">Central Time</option>
                                    <!-- Add more timezones -->
                                </select>
                            </div>

                            <div>
                                <label for="language" class="block text-sm font-medium text-gray-700 mb-1">
                                    Language
                                </label>

                        <select
                                    id="language"
                                    bind:value={userData.language}
                                    class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                >
                                    <option value="en">English</option>
                                    <option value="es">Spanish</option>
                                    <option value="fr">French</option>
                                    <option value="de">German</option>
                                </select>
                            </div>

                            <button
                                on:click={handleProfileUpdate}
                                class="w-full mt-4 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-50"
                                disabled={loading}
                            >
                                {loading ? 'Saving Changes...' : 'Save Changes'}
                            </button>
                        </div>
                    </div>
                {/if}

                {#if activeTab === 'security'}
                    <!-- Security Section -->
                    <div class="bg-white rounded-2xl shadow-lg p-6">
                        <h2 class="text-xl font-bold mb-6">Change Password</h2>
                        <div class="space-y-4">
                            <div>
                                <label for="currentPassword" class="block text-sm font-medium text-gray-700 mb-1">
                                    Current Password
                                </label>
                                <input
                                    type="password"
                                    id="currentPassword"
                                    bind:value={passwordForm.currentPassword}
                                    class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>

                            <div>
                                <label for="newPassword" class="block text-sm font-medium text-gray-700 mb-1">
                                    New Password
                                </label>
                                <input
                                    type="password"
                                    id="newPassword"
                                    bind:value={passwordForm.newPassword}
                                    class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>

                            <div>
                                <label for="confirmPassword" class="block text-sm font-medium text-gray-700 mb-1">
                                    Confirm New Password
                                </label>
                                <input
                                    type="password"
                                    id="confirmPassword"
                                    bind:value={passwordForm.confirmPassword}
                                    class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>

                            <button
                                on:click={handlePasswordChange}
                                class="w-full mt-4 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-50"
                                disabled={loading}
                            >
                                {loading ? 'Updating Password...' : 'Update Password'}
                            </button>
                        </div>

                        <div class="mt-8">
                            <h3 class="text-lg font-semibold mb-4">Recent Login Activity</h3>
                            <div class="space-y-3">
                                {#each loginHistory as login}
                                    <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                        <div>
                                            <p class="text-sm font-medium text-gray-900">{login.device}</p>
                                            <p class="text-xs text-gray-500">{login.location} • {login.ip}</p>
                                        </div>
                                        <div class="text-right">
                                            <p class="text-sm text-gray-900">{formatDate(login.timestamp)}</p>
                                            <span class="text-xs px-2 py-1 rounded-full {login.status === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}">
                                                {login.status}
                                            </span>
                                        </div>
                                    </div>
                                {/each}
                            </div>
                        </div>
                    </div>
                {/if}

                {#if activeTab === 'preferences'}
                    <!-- Preferences Section -->
                    <div class="bg-white rounded-2xl shadow-lg p-6">
                        <h2 class="text-xl font-bold mb-6">App Preferences</h2>
                        
                        <div class="space-y-6">
                            <div>
                                <h3 class="text-lg font-semibold mb-4">Display Settings</h3>
                                <div class="space-y-3">
                                    <label class="flex items-center justify-between">
                                        <span class="text-gray-700">Dark Mode</span>
                                        <div class="relative inline-block w-12 h-6 transition duration-200 ease-in-out">
                                            <input
                                                type="checkbox"
                                                bind:checked={userData.preferences.darkMode}
                                                class="peer sr-only"
                                            />
                                            <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                        </div>
                                    </label>

                                    <label class="flex items-center justify-between">
                                        <span class="text-gray-700">Show Balance</span>
                                        <div class="relative inline-block w-12 h-6 transition duration-200 ease-in-out">
                                            <input
                                                type="checkbox"
                                                bind:checked={userData.preferences.showBalance}
                                                class="peer sr-only"
                                            />
                                            <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                        </div>
                                    </label>
                                </div>
                            </div>

                            <div>
                                <h3 class="text-lg font-semibold mb-4">Notification Settings</h3>
                                <div class="space-y-3">
                                    {#each Object.entries(userData.notifications) as [key, value]}
                                        <label class="flex items-center justify-between">
                                            <span class="text-gray-700">{key.charAt(0).toUpperCase() + key.slice(1)} Notifications</span>
                                            <div class="relative inline-block w-12 h-6 transition duration-200 ease-in-out">
                                                <input
                                                    type="checkbox"
                                                    bind:checked={userData.notifications[key]}
                                                    class="peer sr-only"
                                                />
                                                <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                            </div>
                                        </label>
                                    {/each}
                                </div>
                            </div>

                            <div>
                                <h3 class="text-lg font-semibold mb-4">Betting Preferences</h3>
                                <div class="space-y-4">
                                    <div>
                                        <label for="oddsFormat" class="block text-sm font-medium text-gray-700 mb-1">
                                            Odds Format
                                        </label>
                                        <select
                                            id="oddsFormat"
                                            bind:value={userData.preferences.oddsFormat}
                                            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        >
                                            <option value="decimal">Decimal (1.50)</option>
                                            <option value="fractional">Fractional (1/2)</option>
                                            <option value="american">American (-200)</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            <button
                                on:click={handleProfileUpdate}
                                class="w-full mt-4 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-50"
                                disabled={loading}
                            >
                                {loading ? 'Saving Preferences...' : 'Save Preferences'}
                            </button>
                        </div>
                    </div>
                {/if}

                {#if activeTab === 'activity'}
                    <!-- Activity Section -->
                    <div class="bg-white rounded-2xl shadow-lg p-6">
                        <h2 class="text-xl font-bold mb-6">Activity History</h2>
                        
                        <div class="space-y-6">
                            <div>
                                <h3 class="text-lg font-semibold mb-4">Recent Bets</h3>
                                <div class="space-y-3">
                                    {#each bettingHistory as bet}
                                        <div class="p-4 bg-gray-50 rounded-lg">
                                            <div class="flex justify-between items-start mb-2">
                                                <div>
                                                    <h4 class="font-medium text-gray-900">{bet.event}</h4>
                                                    <p class="text-sm text-gray-500">{formatDate(bet.date)}</p>
                                                </div>
                                                <span class="px-3 py-1 rounded-full text-sm {bet.status === 'won' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}">
                                                    {bet.status.charAt(0).toUpperCase() + bet.status.slice(1)}
                                                </span>
                                            </div>
                                            <div class="flex items-center justify-between text-sm">
                                                <span class="text-gray-600">Stake: {formatAmount(bet.stake)}</span>
                                                <span class="text-gray-600">Odds: {bet.odds}</span>
                                                <span class="font-medium text-gray-900">Payout: {formatAmount(bet.payout)}</span>
                                            </div>
                                        </div>
                                    {/each}
                                </div>
                            </div>

                            <div>
                                <h3 class="text-lg font-semibold mb-4">Account Activity</h3>
                                <div class="space-y-3">
                                    {#each activityHistory as activity}
                                        <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                            <div>
                                                <p class="text-sm font-medium text-gray-900">{activity.description}</p>
                                                <p class="text-xs text-gray-500">{formatDate(activity.timestamp)}</p>
                                            </div>
                                            {#if activity.amount}
                                                <span class="text-sm font-medium {activity.type.includes('won') ? 'text-green-600' : 'text-gray-900'}">
                                                    {formatAmount(activity.amount)}
                                                </span>
                                            {/if}
                                        </div>
                                    {/each}
                                </div>
                            </div>

                            <!-- Pagination -->
                            {#if totalPages > 1}
                                <div class="flex items-center justify-center space-x-2 mt-6">
                                    <button
                                        class="px-3 py-1 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 disabled:opacity-50"
                                        disabled={currentPage === 1}
                                        on:click={() => currentPage--}
                                    >
                                        Previous
                                    </button>
                                    <span class="text-sm text-gray-600">
                                        Page {currentPage} of {totalPages}
                                    </span>
                                    <button
                                        class="px-3 py-1 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 disabled:opacity-50"
                                        disabled={currentPage === totalPages}
                                        on:click={() => currentPage++}
                                    >
                                        Next
                                    </button>
                                </div>
                            {/if}
                        </div>
                    </div>
                {/if}
            </div>

            <!-- Sidebar -->
            <div class="space-y-6">
                <!-- Account Summary -->
                <div class="bg-white rounded-2xl shadow-lg p-6">
                    <h3 class="text-lg font-semibold mb-4">Account Summary</h3>
                    <div class="space-y-3">
                        <div class="flex justify-between items-center">
                            <span class="text-gray-600">Member Since</span>
                            <span class="font-medium">Jan 2024</span>
                        </div>
                        <div class="flex justify-between items-center">
                            <span class="text-gray-600">Total Bets</span>
                            <span class="font-medium">247</span>
                        </div>
                        <div class="flex justify-between items-center">
                            <span class="text-gray-600">Win Rate</span>
                            <span class="font-medium text-green-600">68%</span>
                        </div>
                        <div class="flex justify-between items-center">
                            <span class="text-gray-600">Total Earnings</span>
                            <span class="font-medium text-green-600">{formatAmount(12567.89)}</span>
                        </div>
                    </div>
                </div>

                <!-- Quick Stats -->
                <div class="bg-white rounded-2xl shadow-lg p-6">
                    <h3 class="text-lg font-semibold mb-4">Quick Stats</h3>
                    <div class="grid grid-cols-2 gap-4">
                        <div class="bg-blue-50 rounded-xl p-4">
                            <p class="text-sm text-blue-600 mb-1">Active Bets</p>
                            <p class="text-2xl font-bold text-blue-700">12</p>
                        </div>
                        <div class="bg-green-50 rounded-xl p-4">
                            <p class="text-sm text-green-600 mb-1">Won Today</p>
                            <p class="text-2xl font-bold text-green-700">{formatAmount(156.50)}</p>
                        </div>
                        <div class="bg-purple-50 rounded-xl p-4">
                            <p class="text-sm text-purple-600 mb-1">Streak</p>
                            <p class="text-2xl font-bold text-purple-700">5 days</p>
                        </div>
                        <div class="bg-yellow-50 rounded-xl p-4">
                            <p class="text-sm text-yellow-600 mb-1">Level</p>
                            <p class="text-2xl font-bold text-yellow-700">Pro</p>
                        </div>
                    </div>
                </div>

                
            </div>
        </div>
    </div>
</div>

<style>
    /* Animation for tab transitions */
    .tab-content {
        transition: all 0.3s ease-in-out;
    }

    /* Custom scrollbar for activity logs */
    .activity-log::-webkit-scrollbar {
        width: 4px;
    }

    .activity-log::-webkit-scrollbar-track {
        background: #f1f1f1;
        border-radius: 2px;
    }

    .activity-log::-webkit-scrollbar-thumb {
        background: #888;
        border-radius: 2px;
    }

    .activity-log::-webkit-scrollbar-thumb:hover {
        background: #666;
    }

    /* Mobile optimizations */
    @media (max-width: 768px) {
        .container {
            padding-left: 1rem;
            padding-right: 1rem;
        }
        
        .grid {
            gap: 1rem;
        }
    }
</style>