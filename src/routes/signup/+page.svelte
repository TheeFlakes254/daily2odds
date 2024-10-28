<!-- src/routes/signup/+page.svelte -->
<script>
    import PocketBase from 'pocketbase';
    import { goto } from '$app/navigation';
    import { onMount } from 'svelte';
    import { isAuthenticated, updateAuth } from '$lib/stores/auth';

    const pb = new PocketBase('https://odds.pockethost.io');

    let username = '';
    let email = '';
    let password = '';
    let confirmPassword = '';
    let number = '';
    let errorMessage = '';
    let showSuccessModal = false;
    let isLoading = false;

    onMount(() => {
        // Check if user is already logged in
        if (pb.authStore.isValid) {
            goto('/homepage');
        }
    });

    const validateForm = () => {
        if (!username || !email || !password || !confirmPassword || !number) {
            errorMessage = 'Please fill in all fields';
            return false;
        }

        if (password !== confirmPassword) {
            errorMessage = 'Passwords do not match';
            return false;
        }

        if (password.length < 8) {
            errorMessage = 'Password must be at least 8 characters long';
            return false;
        }

        if (isNaN(number) || number.length < 10) {
            errorMessage = 'Please enter a valid phone number';
            return false;
        }

        return true;
    };

    const handleSignUp = async () => {
        if (!validateForm()) return;

        isLoading = true;
        errorMessage = '';

        try {
            const data = {
                username,
                email,
                emailVisibility: true,
                password,
                passwordConfirm: password,
                number: Number(number)
            };

            // Use 'user' instead of 'users' for collection name
            const record = await pb.collection('user').create(data);
            
            // Auto login after successful signup
            const authData = await pb.collection('user').authWithPassword(email, password);
            
            if (authData) {
                updateAuth(true, authData.record);
                showSuccessModal = true;
                
                // Clear form
                username = '';
                email = '';
                password = '';
                confirmPassword = '';
                number = '';

                // Redirect after a short delay
                setTimeout(() => {
                    goto('/homepage');
                }, 2000);
            }
        } catch (error) {
            console.error('Signup error:', error);
            if (error.response?.data?.email?.code === 'validation_invalid_email') {
                errorMessage = 'Please enter a valid email address';
            } else if (error.response?.status === 400) {
                errorMessage = 'Username or email has already been taken';
            } else {
                errorMessage = 'An error occurred during registration. Please try again.';
            }
        } finally {
            isLoading = false;
        }
    };

    const closeModal = () => {
        showSuccessModal = false;
    };
</script>



<div class="page-container bg-white">
    <div class="signup-form bg-[#064b67] p-6 rounded-lg shadow-lg relative">
        <h2 class="text-white text-2xl font-bold mb-6 text-center">Create Account</h2>

        {#if isLoading}
            <div class="absolute top-4 right-4">
                <div class="loader"></div>
            </div>
        {/if}

        {#if errorMessage}
            <div class="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4 rounded">
                <p>{errorMessage}</p>
            </div>
        {/if}

        <form on:submit|preventDefault={handleSignUp} class="space-y-6">
            <div class="space-y-1">
                <input
                    type="text"
                    bind:value={username}
                    class="w-full px-4 py-2 bg-transparent border-b-2 border-gray-300 text-white placeholder-gray-300 focus:outline-none focus:border-yellow-500 transition-all"
                    placeholder="Username"
                    required
                />
            </div>

            <div class="space-y-1">
                <input
                    type="email"
                    bind:value={email}
                    class="w-full px-4 py-2 bg-transparent border-b-2 border-gray-300 text-white placeholder-gray-300 focus:outline-none focus:border-yellow-500 transition-all"
                    placeholder="Email"
                    required
                />
            </div>

            <div class="space-y-1">
                <input
                    type="password"
                    bind:value={password}
                    class="w-full px-4 py-2 bg-transparent border-b-2 border-gray-300 text-white placeholder-gray-300 focus:outline-none focus:border-yellow-500 transition-all"
                    placeholder="Password"
                    required
                />
            </div>

            <div class="space-y-1">
                <input
                    type="password"
                    bind:value={confirmPassword}
                    class="w-full px-4 py-2 bg-transparent border-b-2 border-gray-300 text-white placeholder-gray-300 focus:outline-none focus:border-yellow-500 transition-all"
                    placeholder="Confirm Password"
                    required
                />
            </div>

            <div class="space-y-1">
                <input
                    type="tel"
                    bind:value={number}
                    class="w-full px-4 py-2 bg-transparent border-b-2 border-gray-300 text-white placeholder-gray-300 focus:outline-none focus:border-yellow-500 transition-all"
                    placeholder="Phone Number"
                    required
                />
            </div>

            <button
                type="submit"
                class="w-full bg-[#ffd700] text-teal-900 font-bold px-6 py-3 rounded-md hover:bg-yellow-500 focus:outline-none focus:ring-2 focus:ring-yellow-500 transition-colors disabled:opacity-50"
                disabled={isLoading}
            >
                {isLoading ? 'Creating Account...' : 'Sign Up'}
            </button>
        </form>

        <p class="text-center text-white mt-6">
            Already have an account? 
            <a href="/login" class="text-yellow-400 hover:underline ml-1">
                Login
            </a>
        </p>
    </div>
</div>

{#if showSuccessModal}
    <div class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
        <div class="bg-white p-6 rounded-lg shadow-lg max-w-sm mx-4">
            <h3 class="text-lg font-bold text-center mb-2">Registration Successful!</h3>
            <p class="text-center text-gray-600">Your account has been created successfully.</p>
            <div class="mt-4 flex justify-center">
                <button
                    class="bg-[#064b67] text-white px-6 py-2 rounded-md hover:bg-[#053a51] transition-colors"
                    on:click={closeModal}
                >
                    Close
                </button>
            </div>
        </div>
    </div>
{/if}

<style>
    @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }

    .loader {
        border: 4px solid #f3f3f3;
        border-top: 4px solid #ffd700;
        border-radius: 50%;
        width: 30px;
        height: 30px;
        animation: spin 1s linear infinite;
    }

    :global(body), :global(html) {
        height: 100%;
        margin: 0;
        padding: 0;
    }

    .page-container {
        min-height: 100vh;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 1rem;
        box-sizing: border-box;
    }

    .signup-form {
        width: 100%;
        max-width: 24rem;
    }

    @media (max-width: 640px) {
        .signup-form {
            padding: 1.5rem;
        }
    }
</style>