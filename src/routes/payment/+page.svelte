<script>
  import { onMount } from 'svelte';
  import PocketBase from 'pocketbase';
  import Footer from '$lib/components/footer.svelte';
  import Navbar1 from '$lib/components/navbar1.svelte';
	import Navbar from '$lib/components/navbar.svelte';

  let email = '';
  let number = '';
  let proofFile = null; 
  let statusMessage = '';
  let isLoading = false;

  let pb;

  onMount(() => {
    pb = new PocketBase('https://odds.pockethost.io');
  });

  async function handleSubmit(event) {
    event.preventDefault();
    statusMessage = '';
    isLoading = true;

    try {
      const formData = new FormData();
      formData.append('email', email);
      formData.append('number', number);
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
  }

  function handleFileUpload(event) {
    proofFile = event.target.files[0];
  }
</script>
<Navbar1/>
<section class="bg-white dark:bg-gray-900">
  <div class="py-8 lg:py-16 px-4 mx-auto max-w-screen-md">
    <h2 class="mb-4 text-4xl tracking-tight font-extrabold text-center text-[#064b67] dark:text-white">Payment Form</h2>
    <p class="mb-8 lg:mb-16 font-light text-center text-gray-500 dark:text-gray-400 sm:text-xl">
      Got a technical issue? Want to send feedback about a beta feature? Need details about our Business plan? Let us know.
    </p>
    <form on:submit={handleSubmit} class="space-y-8">
      <div>
        <label for="email" class="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">Your email</label>
        <input 
          type="email" 
          id="email" 
          bind:value={email}
          class="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500 dark:shadow-sm-light" 
          placeholder="name@example.com" 
          required
        />
      </div>
      <div>
        <label for="number" class="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">Mobile No.</label>
        <input 
          type="text" 
          id="number" 
          bind:value={number}
          class="block p-3 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 shadow-sm focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" 
          placeholder="Your mobile number" 
          required
        />
      </div>
      <div class="sm:col-span-2">
        <label for="file-upload" class="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-400">Upload Proof of Payment</label>
        <p class="mb-2 text-sm text-gray-500 dark:text-gray-400">Please upload an image or screenshot of your payment as proof.</p>
        <input 
          type="file" 
          id="file-upload" 
          accept="image/*" 
          on:change={handleFileUpload}
          class="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 shadow-sm focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
          required
        />
      </div>
      <button type="submit" class="py-3 px-5 text-sm font-medium text-center text-white rounded-lg bg-[#064b67] sm:w-fit hover:bg-[#053b56] focus:ring-4 focus:outline-none focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800" disabled={isLoading}>
        {#if isLoading}
          <div class="loader"></div>
        {:else}
          Submit
        {/if}
      </button>
    </form>
    {#if statusMessage}
      <div class="mt-4 text-center text-sm">{statusMessage}</div>
    {/if}
  </div>
</section>
<Footer/>

<style>
  .loader {
    border: 3px solid #f3f3f3;
    border-top: 3px solid #3498db;
    border-radius: 50%;
    width: 20px;
    height: 20px;
    animation: spin 1s linear infinite;
    display: inline-block;
    margin-right: 10px;
  }

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
</style>
