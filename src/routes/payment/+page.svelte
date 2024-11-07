<script>
  import { onMount } from 'svelte';
  import PocketBase from 'pocketbase';

  let email = '';
  let number = '';
  let proofFile = null; 
  let statusMessage = '';
  let isLoading = false;
  let selectedPackage = '';
  let selectedDuration = '';
  
  const packages = {
    gold: {
      name: 'Gold Package',
      weekly: 500,
      monthly: 1800,
      features: [
        'Premium Access',
        'Priority Support',
        'Advanced Features',
        'Exclusive Content'
      ]
    },
    silver: {
      name: 'Silver Package',
      weekly: 250,
      monthly: 900,
      features: [
        'Basic Access',
        'Standard Support',
        'Core Features',
        'Regular Content'
      ]
    }
  };

  $: currentPrice = selectedPackage && selectedDuration ? 
    packages[selectedPackage][selectedDuration] : null;

  let pb;

  onMount(() => {
    pb = new PocketBase('https://odds.pockethost.io');
  });

  async function handleSubmit(event) {
    event.preventDefault();
    if (!selectedPackage || !selectedDuration) {
      statusMessage = 'Please select both a package and duration';
      return;
    }
    
    statusMessage = '';
    isLoading = true;

    try {
      const formData = new FormData();
      formData.append('email', email);
      formData.append('number', number);
      formData.append('package', selectedPackage);
      formData.append('duration', selectedDuration);
      formData.append('amount', currentPrice.toString());
      if (proofFile) {
        formData.append('proof', proofFile);
      }

      await pb.collection('payment').create(formData);
      statusMessage = 'Payment proof sent successfully!';
      resetForm();
    } catch (error) {
      console.error('Error sending payment proof:', error);
      statusMessage = 'Failed to send payment proof. Please try again.';
    } finally {
      isLoading = false;
    }
  }

  function resetForm() {
    email = '';
    number = '';
    proofFile = null;
    selectedPackage = '';
    selectedDuration = '';
  }

  function handleFileUpload(event) {
    proofFile = event.target.files[0];
  }
</script>

<section class="bg-gray-50 dark:bg-gray-900 min-h-screen py-4 sm:py-8 lg:py-12">
  <div class="w-full max-w-4xl mx-auto px-4">
    <!-- Header -->
    <div class="text-center mb-6 sm:mb-8 lg:mb-12">
      <h1 class="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#064b67] mb-2 sm:mb-4">Choose Your Package</h1>
      <p class="text-sm sm:text-base text-gray-600 dark:text-gray-400 px-2 sm:px-4">Select the perfect plan for your needs</p>
    </div>

    <!-- Package Selection Cards -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8 mb-6 sm:mb-8">
      <!-- Silver Package -->
      <div class="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
        <div class="p-4 sm:p-6">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-xl sm:text-2xl font-bold text-gray-900">Silver Package</h3>
            <div class="bg-gray-100 rounded-full px-3 py-1 text-xs sm:text-sm text-gray-600">Basic</div>
          </div>
          
          <!-- Pricing Options -->
          <div class="space-y-4">
            <div class="grid grid-cols-2 gap-3">
              <label class="block">
                <input type="radio" name="package" value="silver-weekly" 
                  class="hidden peer" 
                  on:change={() => { selectedPackage = 'silver'; selectedDuration = 'weekly'; }}
                />
                <div class="text-center p-3 sm:p-4 border rounded-lg peer-checked:border-[#064b67] peer-checked:bg-blue-50 cursor-pointer h-full">
                  <div class="text-sm sm:text-base font-semibold">Weekly</div>
                  <div class="text-lg sm:text-2xl font-bold text-[#064b67]">KSH 250</div>
                </div>
              </label>
              <label class="block">
                <input type="radio" name="package" value="silver-monthly" 
                  class="hidden peer"
                  on:change={() => { selectedPackage = 'silver'; selectedDuration = 'monthly'; }}
                />
                <div class="text-center p-3 sm:p-4 border rounded-lg peer-checked:border-[#064b67] peer-checked:bg-blue-50 cursor-pointer h-full">
                  <div class="text-sm sm:text-base font-semibold">Monthly</div>
                  <div class="text-lg sm:text-2xl font-bold text-[#064b67]">KSH 900</div>
                  <div class="text-xs sm:text-sm text-green-600">Save KSH 100</div>
                </div>
              </label>
            </div>
            
            <!-- Features -->
            <ul class="space-y-2 sm:space-y-3">
              {#each packages.silver.features as feature}
                <li class="flex items-center text-sm sm:text-base text-gray-600">
                  <svg class="w-4 h-4 mr-2 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  <span>{feature}</span>
                </li>
              {/each}
            </ul>
          </div>
        </div>
      </div>

      <!-- Gold Package -->
      <div class="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 border-2 border-[#064b67]">
        <div class="p-4 sm:p-6">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-xl sm:text-2xl font-bold text-gray-900">Gold Package</h3>
            <div class="bg-yellow-100 rounded-full px-3 py-1 text-xs sm:text-sm text-yellow-800">Premium</div>
          </div>
          
          <!-- Pricing Options -->
          <div class="space-y-4">
            <div class="grid grid-cols-2 gap-3">
              <label class="block">
                <input type="radio" name="package" value="gold-weekly" 
                  class="hidden peer"
                  on:change={() => { selectedPackage = 'gold'; selectedDuration = 'weekly'; }}
                />
                <div class="text-center p-3 sm:p-4 border rounded-lg peer-checked:border-[#064b67] peer-checked:bg-blue-50 cursor-pointer h-full">
                  <div class="text-sm sm:text-base font-semibold">Weekly</div>
                  <div class="text-lg sm:text-2xl font-bold text-[#064b67]">KSH 500</div>
                </div>
              </label>
              <label class="block">
                <input type="radio" name="package" value="gold-monthly" 
                  class="hidden peer"
                  on:change={() => { selectedPackage = 'gold'; selectedDuration = 'monthly'; }}
                />
                <div class="text-center p-3 sm:p-4 border rounded-lg peer-checked:border-[#064b67] peer-checked:bg-blue-50 cursor-pointer h-full">
                  <div class="text-sm sm:text-base font-semibold">Monthly</div>
                  <div class="text-lg sm:text-2xl font-bold text-[#064b67]">KSH 1800</div>
                  <div class="text-xs sm:text-sm text-green-600">Save KSH 200</div>
                </div>
              </label>
            </div>
            
            <!-- Features -->
            <ul class="space-y-2 sm:space-y-3">
              {#each packages.gold.features as feature}
                <li class="flex items-center text-sm sm:text-base text-gray-600">
                  <svg class="w-4 h-4 mr-2 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  <span>{feature}</span>
                </li>
              {/each}
            </ul>
          </div>
        </div>
      </div>
    </div>

    <!-- Mpesa Payment Section -->
    {#if selectedPackage && selectedDuration}
      <div class="bg-white rounded-xl shadow-lg p-4 sm:p-6 mb-6 sm:mb-8">
        <!-- Mpesa Header -->
        <div class="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 mb-6 border-b pb-6">
          <img src="/mpesa.png" alt="Mpesa Logo" class="h-12 sm:h-16 w-auto"/>
          <div>
            <h3 class="text-lg sm:text-xl font-bold text-gray-900">Pay with M-PESA</h3>
            <p class="text-sm sm:text-base text-gray-600">Send KSH {currentPrice} to:</p>
            <p class="text-xl sm:text-2xl font-bold text-[#064b67]">+254 715 978130</p>
          </div>
        </div>
        
        <!-- Payment Details -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <!-- Instructions -->
          <div class="space-y-4">
            <h4 class="font-semibold text-gray-900 text-sm sm:text-base">Payment Steps:</h4>
            <ol class="list-decimal list-inside text-sm sm:text-base text-gray-600 space-y-2">
              <li>Go to M-PESA on your phone</li>
              <li>Select Send Money</li>
              <li>Enter the number: +254 715 978130</li>
              <li>Enter amount: KSH {currentPrice}</li>
              <li>Enter your M-PESA PIN</li>
              <li>Save the confirmation SMS</li>
            </ol>
          </div>
          
          <!-- Form -->
          <form on:submit={handleSubmit} class="space-y-4">
            <div>
              <label for="email" class="block text-sm font-medium text-gray-700 mb-1">Your Email</label>
              <input 
                type="email" 
                id="email" 
                bind:value={email}
                class="w-full rounded-lg border-gray-300 shadow-sm focus:border-[#064b67] focus:ring-[#064b67] text-sm sm:text-base" 
                placeholder="name@example.com" 
                required
              />
            </div>
            
            <div>
              <label for="number" class="block text-sm font-medium text-gray-700 mb-1">Your Phone Number</label>
              <input 
                type="text" 
                id="number" 
                bind:value={number}
                class="w-full rounded-lg border-gray-300 shadow-sm focus:border-[#064b67] focus:ring-[#064b67] text-sm sm:text-base" 
                placeholder="Enter your phone number" 
                required
              />
            </div>
            
            <div>
              <label for="file-upload" class="block text-sm font-medium text-gray-700 mb-1">Upload M-PESA Screenshot</label>
              <input 
                type="file" 
                id="file-upload" 
                accept="image/*" 
                on:change={handleFileUpload}
                class="w-full text-sm sm:text-base text-gray-500
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-full file:border-0
                  file:text-sm file:font-semibold
                  file:bg-[#064b67] file:text-white
                  hover:file:bg-[#053b56]"
                required
              />
            </div>
            
            <button 
              type="submit" 
              class="w-full py-3 px-4 text-sm sm:text-base text-white rounded-lg bg-[#064b67] hover:bg-[#053b56] transition-colors duration-200 flex items-center justify-center gap-2" 
              disabled={isLoading}
            >
              {#if isLoading}
                <div class="loader"></div>
                <span>Processing...</span>
              {:else}
                <span>Complete Payment</span>
              {/if}
            </button>
          </form>
        </div>
      </div>
    {/if}

    <!-- Status Message -->
    {#if statusMessage}
      <div class="text-center p-3 sm:p-4 rounded-lg text-sm sm:text-base {statusMessage.includes('success') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}">
        {statusMessage}
      </div>
    {/if}
  </div>
</section>

<style>
  .loader {
    border: 2px solid #ffffff;
    border-top: 2px solid transparent;
    border-radius: 50%;
    width: 1.25rem;
    height: 1.25rem;
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
</style>