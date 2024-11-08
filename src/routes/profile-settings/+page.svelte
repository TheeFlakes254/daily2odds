<script>
  import { onMount, onDestroy } from 'svelte';
  import { fly } from 'svelte/transition';
  import PocketBase from 'pocketbase';

  const pb = new PocketBase('https://odds.pockethost.io');

  let user = null;
  let editing = {
    username: false,
    number: false,
    password: false
  };
  let loading = {
    initial: true,
    username: false,
    number: false,
    password: false
  };
  let messages = [];
  let messageId = 0;

  let formData = {
    username: '',
    email: '',
    number: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  };

  // Tier configurations
  const tierColors = {
    'free': 'bg-gray-100 text-gray-800',
    'basic': 'bg-blue-100 text-blue-800',
    'premium': 'bg-purple-100 text-purple-800',
    'pro': 'bg-green-100 text-green-800'
  };

  const tierLabels = {
    'free': 'Free Plan',
    'basic': 'Basic Plan',
    'premium': 'Premium Plan',
    'pro': 'Pro Plan'
  };

  function getTierColor(tier) {
    return tierColors[tier.toLowerCase()] || 'bg-gray-100 text-gray-800';
  }

  function getTierLabel(tier) {
    return tierLabels[tier.toLowerCase()] || tier;
  }

  function showToast(type, content) {
    const id = messageId++;
    messages = [...messages, { id, type, content }];
    setTimeout(() => {
      messages = messages.filter(m => m.id !== id);
    }, 5000);
  }

  onMount(async () => {
    await fetchUserData();
  });

  async function fetchUserData() {
    try {
      const userId = pb.authStore.model.id;
      const record = await pb.collection('user').getOne(userId);
      user = record;
      formData = {
        username: record.username || '',
        email: record.email || '',
        number: record.number || '',
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      };
    } catch (error) {
      showToast('error', 'Error fetching user data');
    } finally {
      loading.initial = false;
    }
  }

  function getInitials(username) {
    return username
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase();
  }

  async function updateField(field) {
    loading[field] = true;
    try {
      const updateData = {};
      updateData[field] = formData[field];
      
      await pb.collection('user').update(user.id, updateData);
      showToast('success', `${field.charAt(0).toUpperCase() + field.slice(1)} updated successfully`);
      editing[field] = false;
      await fetchUserData();
    } catch (error) {
      showToast('error', error.message);
    } finally {
      loading[field] = false;
    }
  }

  async function updatePassword() {
    loading.password = true;
    try {
      if (formData.newPassword !== formData.confirmPassword) {
        showToast('error', 'Passwords do not match');
        return;
      }

      const updateData = {
        password: formData.newPassword,
        passwordConfirm: formData.confirmPassword,
        oldPassword: formData.currentPassword
      };

      await pb.collection('user').update(user.id, updateData);
      showToast('success', 'Password updated successfully');
      editing.password = false;
      formData.currentPassword = '';
      formData.newPassword = '';
      formData.confirmPassword = '';
    } catch (error) {
      showToast('error', error.message);
    } finally {
      loading.password = false;
    }
  }

  onDestroy(() => {
    messages = [];
  });
</script>

{#if loading.initial}
  <div class="fixed inset-0 bg-white bg-opacity-75 flex items-center justify-center z-50">
    <div class="flex flex-col items-center space-y-4">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      <p class="text-gray-600">Loading profile...</p>
    </div>
  </div>
{:else}
  <div class="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
    <div class="max-w-2xl mx-auto bg-white rounded-lg shadow">
      <!-- Header with Avatar -->
      <div class="p-6 border-b border-gray-200">
        <div class="flex items-center space-x-4">
          <div class="flex-shrink-0">
            {#if user.avatar}
              <img
                src={`https://odds.pockethost.io/api/files/users/${user.id}/${user.avatar}`}
                alt={user.username}
                class="h-12 w-12 rounded-full object-cover border-2 border-gray-200"
              />
            {:else}
              <div class="h-12 w-12 rounded-full bg-blue-500 flex items-center justify-center text-white font-medium">
                {getInitials(user.username)}
              </div>
            {/if}
          </div>
          <div class="flex-1">
            {#if editing.username}
              <div class="flex items-center space-x-2">
                <input
                  type="text"
                  bind:value={formData.username}
                  class="flex-1 px-3 py-1 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
                <button
                  on:click={() => updateField('username')}
                  disabled={loading.username}
                  class="px-3 py-1 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors flex items-center space-x-1"
                >
                  {#if loading.username}
                    <div class="animate-spin rounded-full h-4 w-4 border-2 border-white"></div>
                  {/if}
                  <span>Save</span>
                </button>
                <button
                  on:click={() => {
                    editing.username = false;
                    formData.username = user.username;
                  }}
                  class="px-3 py-1 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors"
                >
                  Cancel
                </button>
              </div>
            {:else}
              <div class="flex items-center space-x-2">
                <h2 class="text-2xl font-bold">{user.username}</h2>
                <button
                  on:click={() => editing.username = true}
                  class="text-blue-500 hover:text-blue-600"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                  </svg>
                </button>
              </div>
            {/if}
          </div>
        </div>
      </div>

      <div class="p-6">
        <div class="space-y-6">
          <!-- Account Info Section -->
          <div class="bg-gray-50 p-4 rounded-lg">
            <h3 class="text-lg font-medium mb-4">Account Information</h3>
            
            <!-- Prominent Tier Display -->
            <div class="mb-6">
              <div class="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4">
                <span class="text-sm font-medium text-gray-500">Current Plan:</span>
                <div class="flex items-center gap-2">
                  <span class={`px-3 py-1 rounded-full text-sm font-medium tier-badge ${getTierColor(user.tier)}`}>
                    {getTierLabel(user.tier)}
                  </span>
                  {#if user.subscriptionExpires}
                    <span class="text-sm text-gray-500">
                      (Expires: {new Date(user.subscriptionExpires).toLocaleDateString()})
                    </span>
                  {/if}
                </div>
              </div>
            </div>

            <div class="grid gap-4">
              <div class="flex items-center space-x-2">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span class="text-sm">Created: {new Date(user.created).toLocaleDateString()}</span>
              </div>
            </div>
          </div>

          <!-- Email Field (Read-only) -->
          <div class="space-y-2">
            <label class="text-sm font-medium text-gray-700">Email</label>
            <div class="flex items-center space-x-2">
              <div class="flex-1 px-3 py-2 bg-gray-50 border border-gray-200 rounded-md text-gray-700">
                {user.email}
                <span class="ml-2 text-xs text-gray-500">(Cannot be changed)</span>
              </div>
            </div>
          </div>

          <!-- Number Field -->
          <div class="space-y-2">
            <label class="text-sm font-medium text-gray-700">Number</label>
            {#if editing.number}
              <div class="flex items-center space-x-2">
                <input
                  type="number"
                  bind:value={formData.number}
                  class="flex-1 px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
                <button
                  on:click={() => updateField('number')}
                  disabled={loading.number}
                  class="px-3 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors flex items-center space-x-1"
                >
                  {#if loading.number}
                    <div class="animate-spin rounded-full h-4 w-4 border-2 border-white"></div>
                  {/if}
                  <span>Save</span>
                </button>
                <button
                  on:click={() => {
                    editing.number = false;
                    formData.number = user.number;
                  }}
                  class="px-3 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors"
                >
                  Cancel
                </button>
              </div>
            {:else}
              <div class="flex items-center justify-between">
                <span>{user.number || 'Not set'}</span>
                <button
                  on:click={() => editing.number = true}
                  class="text-blue-500 hover:text-blue-600"
                >
                  Edit
                </button>
              </div>
            {/if}
          </div>

          <!-- Password Change Section -->
          <div class="space-y-2">
            <div class="flex items-center justify-between">
              <label class="text-sm font-medium text-gray-700">Password</label>
              <button
                on:click={() => editing.password = !editing.password}
                class="text-blue-500 hover:text-blue-600"
              >
                {editing.password ? 'Cancel' : 'Change Password'}
              </button>
            </div>
            
            {#if editing.password}
              <div class="space-y-4 border-t pt-4">
                <div class="space-y-2">
                  <input
                    type="password"
                    bind:value={formData.currentPassword}
                    placeholder="Current Password"
                    class="w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div class="space-y-2">
                  <input
                    type="password"
                    bind:value={formData.newPassword}
                    placeholder="New Password"
                    class="w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div class="space-y-2">
                  <input
                    type="password"
                    bind:value={formData.confirmPassword}
                    placeholder="Confirm New Password"
                    class="w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <button
                  on:click={updatePassword}
                  disabled={loading.password}
                  class="w-full bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 transition-colors flex items-center justify-center space-x-2"
                >
                  {#if loading.password}
                    <div class="animate-spin rounded-full h-4 w-4 border-2 border-white"></div>
                  {/if}
                  <span>Update Password</span>
                </button>
              </div>
            {/if}
          </div>
        </div>
      </div>
    </div>
  </div>
{/if}

<!-- Toast Notifications -->
<div class="fixed bottom-4 right-4 z-50 space-y-2">
  {#each messages as message (message.id)}
    <div
      in:fly={{ y: 50, duration: 300 }}
      out:fly={{ y: 50, duration: 300 }}
    >
      <div class="bg-white rounded-lg shadow-lg overflow-hidden max-w-sm">
        <div class="flex items-center p-4 {message.type === 'error' ? 'bg-red-50' : 'bg-green-50'}">
          {#if message.type === 'error'}
            <svg class="h-6 w-6 text-red-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          {:else}
            <svg class="h-6 w-6 text-green-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          {/if}
          <div class="ml-3">
            <p class={message.type === 'error' ? 'text-red-800' : 'text-green-800'}>
              {message.content}
            </p>
          </div>
          <button
            on:click={() => messages = messages.filter(m => m.id !== message.id)}
            class="ml-auto"
          >
            <svg class="h-5 w-5 text-gray-400 hover:text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  {/each}
</div>

<style>
  input:disabled {
    background-color: #f3f4f6;
    cursor: not-allowed;
  }

  .transition-colors {
    transition: background-color 0.2s ease-in-out;
  }

  /* Add animation for loading spinner */
  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }

  .animate-spin {
    animation: spin 1s linear infinite;
  }

  /* Add transitions for hover states */
  button {
    transition: all 0.2s ease-in-out;
  }

  button:hover {
    transform: translateY(-1px);
  }

  button:active {
    transform: translateY(0);
  }

  /* Add styles for disabled state */
  button:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }

  button:disabled:hover {
    transform: none;
  }

  /* Tier badge styles */
  .tier-badge {
    position: relative;
    overflow: hidden;
  }

  .tier-badge::after {
    content: '';
    position: absolute;
    inset: -2px;
    border-radius: inherit;
    opacity: 0.15;
    background: inherit;
    filter: blur(4px);
  }

  /* Toast animation styles */
  :global(.toast-enter) {
    transform: translateY(100%);
    opacity: 0;
  }

  :global(.toast-enter-active) {
    transform: translateY(0);
    opacity: 1;
    transition: transform 300ms ease-out, opacity 300ms ease-out;
  }

  :global(.toast-exit) {
    transform: translateY(0);
    opacity: 1;
  }

  :global(.toast-exit-active) {
    transform: translateY(100%);
    opacity: 0;
    transition: transform 300ms ease-in, opacity 300ms ease-in;
  }

  /* Responsive adjustments */
  @media (max-width: 640px) {
    .tier-badge {
      font-size: 0.875rem;
    }
  }
</style>