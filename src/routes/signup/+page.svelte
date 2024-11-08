<script>
    import PocketBase from 'pocketbase';
    import { goto } from '$app/navigation';

    const pb = new PocketBase('https://odds.pockethost.io');

    let username = '';
    let email = '';
    let password = '';
    let number = '';
    let errorMessage = '';
    let showSuccessModal = false;
    let isLoading = false;

    const handleSignUp = async () => {
        isLoading = true;
        try {
            // Get current date for subscription start
            const currentDate = new Date();
            
            // Set expiration date to 7 days from now for free tier
            const expirationDate = new Date();
            expirationDate.setDate(currentDate.getDate() + 7);

            const data = {
                username,
                email,
                emailVisibility: true,
                password,
                passwordConfirm: password,
                number: Number(number),
                // Add free tier information
                tier: "free",
                subscriptionStart: currentDate.toISOString(),
                subscriptionExpires: expirationDate.toISOString()
            };

            const record = await pb.collection('user').create(data);
            await pb.collection('user').requestVerification(email);

            username = '';
            email = '';
            password = '';
            number = '';
            errorMessage = '';

            showSuccessModal = true;

            setTimeout(() => {
                goto('/login');
            }, 2000);
        } catch (error) {
            if (error.response && error.response.status === 400) {
                errorMessage = 'Registration failed: Credentials have already been used.';
            } else {
                errorMessage = 'Username/Email has been taken!';
            }
        } finally {
            isLoading = false;
        }
    };

    const closeModal = () => {
        showSuccessModal = false;
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
        position: absolute;
        top: 10px;
        right: 10px;
        display: none;
    }

    .loader.visible {
        display: block;
    }

    @media (max-width: 640px) {
        .signup-container {
            padding: 1rem;
        }
        .signup-form {
            width: 100%;
            max-width: none;
        }
    }
</style>

<div class="flex justify-center items-center min-h-screen bg-white signup-container">
    <div class="bg-[#064b67] p-4 sm:p-8 rounded-lg shadow-md w-full max-w-sm sm:max-w-md md:max-w-lg lg:w-96 relative signup-form">
        <h2 class="text-white text-xl sm:text-2xl font-bold mb-4 sm:mb-6">Sign Up</h2>

        {#if errorMessage}
            <p class="text-red-400 mb-4 text-sm sm:text-base">{errorMessage}</p>
        {/if}

        <div class="mb-4">
            <input
                type="text"
                id="username"
                bind:value={username}
                class="w-full px-3 py-2 bg-transparent border-b-2 text-white focus:outline-none focus:border-b-4 text-sm sm:text-base"
                placeholder="Username"
                required
            />
        </div>

        <div class="mb-4">
            <input
                type="email"
                id="email"
                bind:value={email}
                class="w-full px-3 py-2 bg-transparent border-b-2 text-white focus:outline-none focus:border-b-4 text-sm sm:text-base"
                placeholder="Email"
                required
            />
        </div>

        <div class="mb-4">
            <input
                type="text"
                id="number"
                placeholder="Mobile Number"
                bind:value={number}
                class="w-full px-3 py-2 bg-transparent border-b-2 text-white focus:outline-none focus:border-b-4 text-sm sm:text-base"
                required
            />
        </div>

        <div class="mb-6">
            <input
                type="password"
                id="password"
                bind:value={password}
                class="w-full px-3 py-2 bg-transparent border-b-2 text-white focus:outline-none focus:border-b-4 text-sm sm:text-base"
                placeholder="Password"
                required
            />
        </div>

        <button
            class="mx-auto flex justify-center items-center bg-[#ffd700] text-teal-900 font-bold px-4 py-2 rounded-md hover:bg-yellow-500 focus:outline-none focus:ring-2 focus:ring-yellow-500 w-full text-sm sm:text-base"
            on:click={handleSignUp}
        >
            Sign Up
        </button>

        <p class="text-center text-white mt-4 text-sm sm:text-base">
            <a href="/login" class="hover:underline">Login</a>
        </p>

        <div class={`loader ${isLoading ? 'visible' : ''}`}></div>
    </div>
</div>

{#if showSuccessModal}
    <div class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
        <div class="bg-white p-6 rounded-lg shadow-lg w-80 sm:w-96">
            <h3 class="text-lg font-bold text-center">Registration Successful!</h3>
            <p class="text-center">You have successfully registered with a FREE tier subscription.</p>
            <div class="flex justify-center mt-4">
                <button
                    class="bg-[#064b67] text-white px-4 py-2 rounded-md hover:bg-[#ffd700] text-sm sm:text-base"
                    on:click={closeModal}
                >
                    Close
                </button>
            </div>
        </div>
    </div>
{/if}