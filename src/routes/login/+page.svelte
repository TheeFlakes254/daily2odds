<script>
    import PocketBase from 'pocketbase';
    import { goto } from '$app/navigation';
    import { session } from '$lib/stores/session';

    const pb = new PocketBase('https://odds.pockethost.io');

    let email = '';
    let password = '';
    let errorMessage = '';
    let successMessage = '';
    let isLoading = false;

    async function login(email, password) {
        const userCredential = await firebase.auth().signInWithEmailAndPassword(email, password);
        const user = userCredential.user;
        const token = await user.getIdToken();

        session.set({
            user: user.email,
            token: token
        });
    }

    const handleLogin = async () => {
        isLoading = true;
        errorMessage = '';
        successMessage = '';

        try {
            await pb.collection('user').authWithPassword(email, password);
            successMessage = 'Login successful!';
            goto('/homepage');
        } catch (error) {
            errorMessage = 'Wrong Credentials, Try again';
        } finally {
            isLoading = false;
        }
    };
</script>

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

    @media (max-width: 640px) {
        .login-container {
            padding: 1rem;
        }
        .login-form {
            width: 100%;
            max-width: none;
        }
    }
</style>

<div class="flex justify-center items-center min-h-screen bg-white login-container">
    <div class="bg-[#064b67] p-4 sm:p-8 rounded-lg shadow-md w-full max-w-sm sm:max-w-md md:max-w-lg lg:w-96 relative login-form">
        <h2 class="text-white text-xl sm:text-2xl font-bold mb-4 sm:mb-6">Login</h2>

        {#if isLoading}
            <div class="absolute top-2 right-2 sm:top-4 sm:right-4">
                <div class="loader"></div>
            </div>
        {/if}

        {#if successMessage}
            <p class="text-green-400 mb-4">{successMessage}</p>
        {/if}

        {#if errorMessage}
            <p class="text-red-400 mb-4">{errorMessage}</p>
        {/if}

        <div class="mb-4">
            <input
                type="email"
                bind:value={email}
                class="w-full px-3 py-2 bg-transparent border-b-2 text-white focus:outline-none focus:border-b-4 text-sm sm:text-base"
                placeholder="Email"
                required
            />
        </div>

        <div class="mb-6">
            <input
                type="password"
                bind:value={password}
                class="w-full px-3 py-2 bg-transparent border-b-2 text-white focus:outline-none focus:border-b-4 text-sm sm:text-base"
                placeholder="Password"
                required
            />
        </div>

        <button
            class="mx-auto flex justify-center items-center bg-[#ffd700] text-teal-900 font-bold px-4 py-2 rounded-md hover:bg-yellow-500 focus:outline-none focus:ring-2 focus:ring-yellow-500 w-full text-sm sm:text-base"
            on:click={handleLogin}
            disabled={isLoading}
        >
            Login
        </button>

        <p class="text-center text-white mt-4 text-sm sm:text-base">
            Don't have an account? <a href="/signup" class="hover:underline">Sign Up</a>
        </p>
    </div>
</div>