<script>
    // Define the available packages and subscription periods
    let packages = [
        { name: 'Gold', priceWeekly: 700, priceMonthly: 2100 },
        { name: 'Silver', priceWeekly: 500, priceMonthly: 1500 }
    ];
    
    let subscriptionPeriods = ['Weekly', 'Monthly'];

    // Reactive variables to hold the user's selections
    let selectedPackage = null;
    let selectedPeriod = null;
    
    // Reactive variable for total price
    let totalPrice = 0;

    // Function to calculate the total price based on selections
    function calculateTotalPrice() {
        if (selectedPackage && selectedPeriod) {
            if (selectedPeriod === 'Weekly') {
                totalPrice = selectedPackage.priceWeekly;
            } else if (selectedPeriod === 'Monthly') {
                totalPrice = selectedPackage.priceMonthly;
            }
        } else {
            totalPrice = 0; // No selection made
        }
    }

    // Function to handle payment submission
    function handlePayment() {
        const email = document.getElementById("email").value;
        const screenshot = document.getElementById("screenshot").files[0];
        
        if (selectedPackage && selectedPeriod && email && screenshot) {
            alert(`You selected the ${selectedPackage.name} package, ${selectedPeriod} subscription. Total price is Ksh ${totalPrice}. Please follow the steps to complete payment.`);
            // Here you can add logic to handle the payment confirmation screenshot
        } else {
            alert('Please complete all selections and upload the payment confirmation screenshot.');
        }
    }
</script>

<!-- Payment Page UI -->
<section class="my-8 mx-4">
    <h2 class="text-2xl font-bold mb-4 text-center">Choose Your Package</h2>

    <!-- Package Selection -->
    <div class="mb-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
        {#each packages as pkg}
            <div class={`p-4 border rounded-lg shadow-lg transition-transform duration-300 transform hover:scale-105 cursor-pointer ${selectedPackage === pkg ? 'border-[#064b67] bg-[#f0f4f7]' : 'border-gray-300'}`}
                 on:click={() => { selectedPackage = pkg; calculateTotalPrice(); }}>
                <h3 class="text-lg font-bold text-center">{pkg.name} Package</h3>
                <p class="text-sm text-gray-600 text-center">Weekly: Ksh {pkg.priceWeekly}</p>
                <p class="text-sm text-gray-600 text-center">Monthly: Ksh {pkg.priceMonthly}</p>
            </div>
        {/each}
    </div>

    <!-- Subscription Period Selection -->
    <div class="mb-4">
        <label class="block text-lg font-semibold mb-2">Select Subscription Period:</label>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
            {#each subscriptionPeriods as period}
                <div class={`p-4 border rounded-lg shadow-lg transition-transform duration-300 transform hover:scale-105 cursor-pointer ${selectedPeriod === period ? 'border-[#064b67] bg-[#f0f4f7]' : 'border-gray-300'}`}
                     on:click={() => { selectedPeriod = period; calculateTotalPrice(); }}>
                    <p class="text-lg text-center">{period} Subscription</p>
                </div>
            {/each}
        </div>
    </div>

    <!-- Payment Method (M-Pesa) -->
    <div class="mb-4">
        <label class="block text-lg font-semibold mb-2">Payment Method: M-Pesa</label>
        <p class="text-md">Please follow these steps to make your payment:</p>
        <ol class="list-decimal list-inside mb-4">
            <li>Go to M-Pesa</li>
            <li>Select Lipa na M-Pesa</li>
            <li>Select Pochi la biashara</li>
            <li>Enter Phone number: <strong>0715978130</strong></li>
        </ol>
    </div>

    <!-- Email Entry -->
    <div class="mb-4">
        <label for="email" class="block text-lg font-semibold mb-2">Enter Your Email:</label>
        <input id="email" type="email" class="border rounded-lg p-2 w-full" required />
    </div>

    <!-- Screenshot Upload -->
    <div class="mb-4">
        <label for="screenshot" class="block text-lg font-semibold mb-2">Upload Payment Confirmation Screenshot:</label>
        <input id="screenshot" type="file" class="border rounded-lg p-2 w-full" accept="image/*" required />
    </div>

    <!-- Total Price Display -->
    <div class="mb-4">
        <h3 class="text-xl font-semibold text-center">Total Price: Ksh {totalPrice}</h3>
    </div>

    <!-- Submit Button -->
    <div class="text-center">
        <button class="bg-[#064b67] text-white font-bold py-3 px-6 rounded-lg hover:bg-[#093445] transition duration-300"
                on:click={handlePayment}>
            Proceed to Pay
        </button>
    </div>
</section>

<style>
    /* Custom styles for the cards */
    .card {
        box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
        transition: transform 0.2s;
    }

    .card:hover {
        transform: translateY(-5px);
        box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
    }
</style>
