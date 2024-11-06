<!-- src/routes/login/+page.svelte -->
<script>
    import PocketBase from 'pocketbase';
    import { goto } from '$app/navigation';
    import { onMount } from 'svelte';
    import { isAuthenticated, updateAuth } from '$lib/stores/auth';

    const pb = new PocketBase('https://odds.pockethost.io');

    let email = '';
    let password = '';
    let errorMessage = '';
    let successMessage = '';
    let isLoading = false;

    onMount(() => {
        if (pb.authStore.isValid) {
            goto('/homepage');
        }
    });

    const validateForm = () => {
        if (!email || !password) {
            errorMessage = 'Please fill in all fields';
            return false;
        }
        return true;
    };

    const handleLogin = async () => {
        if (!validateForm()) return;

        isLoading = true;
        errorMessage = '';
        successMessage = '';

        try {
            const authData = await pb.collection('user').authWithPassword(
                email,
                password
            );
            
            if (authData) {
                updateAuth(true, authData.record);
                successMessage = 'Login successful! Redirecting...';
                
                email = '';
                password = '';

                setTimeout(() => {
                    goto('/homepage');
                }, 2000);
            }
        } catch (error) {
            console.error('Login error:', error);
            errorMessage = 'Invalid email or password. Please try again.';
        } finally {
            isLoading = false;
        }
    };
</script>

<div class="min-h-screen w-full bg-white flex items-center justify-center px-4 py-8 sm:px-6 lg:px-8">
    <div class="w-full max-w-sm sm:max-w-md">
        <div class="bg-[#064b67] rounded-lg shadow-xl p-6 sm:p-8 relative">
            <h2 class="text-white text-xl sm:text-2xl font-bold mb-6 text-center">Welcome Back</h2>

            {#if isLoading}
                <div class="absolute top-4 right-4">
                    <div class="loader"></div>
                </div>
            {/if}

            <form on:submit|preventDefault={handleLogin} class="space-y-6">
                <div class="space-y-2">
                    <input
                        type="email"
                        bind:value={email}
                        class="w-full px-4 py-2 bg-transparent border-b-2 border-gray-300 text-white placeholder-gray-300 focus:outline-none focus:border-yellow-500 transition-all text-base sm:text-lg"
                        placeholder="Email"
                        required
                    />
                </div>

                <div class="space-y-2">
                    <input
                        type="password"
                        bind:value={password}
                        class="w-full px-4 py-2 bg-transparent border-b-2 border-gray-300 text-white placeholder-gray-300 focus:outline-none focus:border-yellow-500 transition-all text-base sm:text-lg"
                        placeholder="Password"
                        required
                    />
                </div>

                <button
                    type="submit"
                    class="w-full bg-[#ffd700] text-teal-900 font-bold px-6 py-3 rounded-md hover:bg-yellow-500 focus:outline-none focus:ring-2 focus:ring-yellow-500 transition-colors disabled:opacity-50 text-base sm:text-lg"
                    disabled={isLoading}
                >
                    {isLoading ? 'Logging in...' : 'Login'}
                </button>

                {#if errorMessage}
                    <div class="text-red-400 text-sm sm:text-base text-center mt-2">
                        {errorMessage}
                    </div>
                {/if}

                {#if successMessage}
                    <div class="text-green-400 text-sm sm:text-base text-center mt-2">
                        {successMessage}
                    </div>
                {/if}
            </form>

            <p class="text-center text-white mt-6 text-sm sm:text-base">
                Don't have an account? 
                <a href="/signup" class="text-yellow-400 hover:underline ml-1">
                    Sign Up
                </a>
            </p>
        </div>
    </div>
</div>

<style>
    @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }

    .loader {
        border: 3px solid #f3f3f3;
        border-top: 3px solid #ffd700;
        border-radius: 50%;
        width: 24px;
        height: 24px;
        animation: spin 1s linear infinite;
    }

    @media (min-width: 640px) {
        .loader {
            border-width: 4px;
            width: 30px;
            height: 30px;
        }
    }

    :global(body), :global(html) {
        height: 100%;
        margin: 0;
        padding: 0;
    }

    input::placeholder {
        opacity: 0.7;
    }

    input:-webkit-autofill,
    input:-webkit-autofill:hover,
    input:-webkit-autofill:focus {
        -webkit-text-fill-color: white;
        -webkit-box-shadow: 0 0 0px 1000px #064b67 inset;
        transition: background-color 5000s ease-in-out 0s;
    }
</style>