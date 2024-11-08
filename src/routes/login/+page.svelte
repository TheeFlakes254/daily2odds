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

<div class="flex justify-center items-center min-h-screen bg-white px-4 md:px-0">
    <div class="bg-[#064b67] p-4 sm:p-6 md:p-8 rounded-lg shadow-md w-full max-w-[90%] sm:max-w-md md:max-w-lg lg:w-96 relative">
        <h2 class="text-white text-lg sm:text-xl md:text-2xl font-bold mb-4 sm:mb-6">Welcome Back</h2>

        {#if errorMessage}
            <p class="text-red-400 mb-4 text-xs sm:text-sm md:text-base">{errorMessage}</p>
        {/if}

        {#if successMessage}
            <p class="text-green-400 mb-4 text-xs sm:text-sm md:text-base text-center">{successMessage}</p>
        {/if}

        <form on:submit|preventDefault={handleLogin} class="w-full">
            <div class="mb-4">
                <input
                    type="email"
                    bind:value={email}
                    class="w-full px-3 py-2 bg-transparent border-b-2 text-white focus:outline-none focus:border-b-4 text-xs sm:text-sm md:text-base"
                    placeholder="Email"
                    required
                />
            </div>

            <div class="mb-6">
                <input
                    type="password"
                    bind:value={password}
                    class="w-full px-3 py-2 bg-transparent border-b-2 text-white focus:outline-none focus:border-b-4 text-xs sm:text-sm md:text-base"
                    placeholder="Password"
                    required
                />
            </div>

            <button
                type="submit"
                class="mx-auto flex justify-center items-center bg-[#ffd700] text-teal-900 font-bold px-4 py-2 rounded-md hover:bg-yellow-500 focus:outline-none focus:ring-2 focus:ring-yellow-500 w-full text-xs sm:text-sm md:text-base h-10 sm:h-11 md:h-12"
                disabled={isLoading}
            >
                {isLoading ? 'Logging in...' : 'Login'}
            </button>
        </form>

        <p class="text-center text-white mt-4 text-xs sm:text-sm md:text-base">
            Don't have an account? 
            <a href="/signup" class="text-yellow-400 hover:underline ml-1">Sign Up</a>
        </p>

        <div class={`loader ${isLoading ? 'visible' : ''}`}></div>
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
        position: absolute;
        top: 10px;
        right: 10px;
        display: none;
    }

    @media (min-width: 640px) {
        .loader {
            border-width: 4px;
            width: 30px;
            height: 30px;
        }
    }

    .loader.visible {
        display: block;
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

    @media (max-width: 640px) {
        input {
            font-size: 16px !important; /* Prevents zoom on mobile devices */
        }
    }
</style>