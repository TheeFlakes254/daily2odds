<script>
    import PocketBase from 'pocketbase';
    import { goto } from '$app/navigation'; // Import the goto function for navigation

    const pb = new PocketBase('https://odds.pockethost.io');

    let username = '';
    let email = '';
    let password = '';
    let number = '';
    let errorMessage = '';
    let showSuccessModal = false; // State for showing the success modal
    let isLoading = false; // State for the loader

    const handleSignUp = async () => {
        isLoading = true; // Show loader
        try {
            const data = {
                username,
                email,
                emailVisibility: true,
                password,
                passwordConfirm: password,
                number: Number(number)
            };

            // Attempt to create the user record
            const record = await pb.collection('user').create(data);

            // Optional: Request email verification
            await pb.collection('user').requestVerification(email);

            // Clear input fields after successful registration
            username = '';
            email = '';
            password = '';
            number = '';
            errorMessage = '';

            // Show success modal
            showSuccessModal = true;

            // Redirect to login page after a short delay
            setTimeout(() => {
                goto('/login');
            }, 2000); // Adjust time as necessary
        } catch (error) {
            if (error.response && error.response.status === 400) {
                // Handle specific error when credentials are already used
                errorMessage = 'Registration failed: Credentials have already been used.';
            } else {
                errorMessage = 'Username/Email has been taken!';
            }
        } finally {
            isLoading = false; // Hide loader after process
        }
    };

    const closeModal = () => {
        showSuccessModal = false; // Close the modal
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
        position: absolute; /* Positioning the loader */
        top: 10px; /* Adjust for desired positioning */
        right: 10px; /* Adjust for desired positioning */
        display: none; /* Hide by default */
    }

    .loader.visible {
        display: block; /* Show loader when active */
    }
</style>

<div class="flex justify-center items-center min-h-screen bg-white">
    <div class="bg-[#064b67] p-8 rounded-lg shadow-md w-96 relative"> <!-- Add relative class -->
        <h2 class="text-white text-2xl font-bold mb-6">Sign Up</h2>

        {#if errorMessage}
            <p class="text-red-400 mb-4">{errorMessage}</p>
        {/if}

        <div class="mb-4">
            <input
                type="text"
                id="username"
                bind:value={username}
                class="w-full px-3 py-2 bg-transparent border-b-2 text-white focus:outline-none focus:border-b-4"
                placeholder="Username"
                required
            />
        </div>

        <div class="mb-4">
            <input
                type="email"
                id="email"
                bind:value={email}
                class="w-full px-3 py-2 bg-transparent border-b-2 text-white focus:outline-none focus:border-b-4"
                placeholder="Email"
                required
            />
        </div>

        <div class="mb-6">
            <input
                type="text"
                id="number"
                placeholder="Mobile Number"
                bind:value={number}
                class="w-full px-3 py-2 bg-transparent border-b-2 text-white focus:outline-none focus:border-b-4"
                required
            />
        </div>

        <div class="mb-6">
            <input
                type="password"
                id="password"
                bind:value={password}
                class="w-full px-3 py-2 bg-transparent border-b-2 text-white focus:outline-none focus:border-b-4"
                placeholder="Password"
                required
            />
        </div>

        <button
            class="mx-auto flex justify-center items-center bg-[#ffd700] text-teal-900 font-bold px-4 py-2 rounded-md hover:bg-yellow-500 focus:outline-none focus:ring-2 focus:ring-yellow-500"
            on:click={handleSignUp}
        >
            Sign Up
        </button>

        <p class="text-center text-white mt-4">
            <a href="/login" class="hover:underline">Login</a>
        </p>

        <div class={`loader ${isLoading ? 'visible' : ''}`}></div> <!-- Loader added -->
    </div>
</div>

{#if showSuccessModal}
    <div class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
        <div class="bg-white p-6 rounded-lg shadow-lg w-80">
            <h3 class="text-lg font-bold text-center">Registration Successful!</h3>
            <p class="text-center">You have successfully registered.</p>
            <div class="flex justify-center mt-4">
                <button
                    class="bg-[#064b67] text-white px-4 py-2 rounded-md hover:bg-[#ffd700]"
                    on:click={closeModal}
                >
                    Close
                </button>
            </div>
        </div>
    </div>
{/if}
