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

    // src/routes/login.js (or another login page script)

async function login(email, password) {
  const userCredential = await firebase.auth().signInWithEmailAndPassword(email, password);
  const user = userCredential.user;
  const token = await user.getIdToken();

  session.set({
    user: user.email,  // Store user's email or other data
    token: token  // Store the token if needed
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
</style>

<div class="flex justify-center items-center min-h-screen bg-white">
    <div class="bg-[#064b67] p-8 rounded-lg shadow-md w-96 relative">
        <h2 class="text-white text-2xl font-bold mb-6">Login</h2>

        {#if isLoading}
            <div class="absolute top-4 right-4">
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
                class="w-full px-3 py-2 bg-transparent border-b-2 text-white focus:outline-none focus:border-b-4"
                placeholder="Email"
                required
            />
        </div>

        <div class="mb-6">
            <input
                type="password"
                bind:value={password}
                class="w-full px-3 py-2 bg-transparent border-b-2 text-white focus:outline-none focus:border-b-4"
                placeholder="Password"
                required
            />
        </div>

        <button
            class="mx-auto flex justify-center items-center bg-[#ffd700] text-teal-900 font-bold px-4 py-2 rounded-md hover:bg-yellow-500 focus:outline-none focus:ring-2 focus:ring-yellow-500"
            on:click={handleLogin}
            disabled={isLoading}
        >
            Login
        </button>

        <p class="text-center text-white mt-4">
            Don't have an account? <a href="/signup" class="hover:underline">Sign Up</a>
        </p>
    </div>
</div>