<!-- SupportChat.svelte -->
<script>
  let isOpen = false;
  let message = '';
  let messages = [
    { id: 1, text: "Hello! How can we help you today?", isSupport: true }
  ];

  function handleSendMessage() {
    if (message.trim()) {
      messages = [...messages, { id: messages.length + 1, text: message, isSupport: false }];
      message = '';
      
      // Simulate support response after 1 second
      setTimeout(() => {
        messages = [...messages, {
          id: messages.length + 1,
          text: "Thanks for reaching out! Our support team will get back to you soon.",
          isSupport: true
        }];
      }, 1000);
    }
  }

  function handleKeyPress(event) {
    if (event.key === 'Enter') {
      handleSendMessage();
    }
  }
</script>

<div class="fixed bottom-6 right-6 z-50">
  <button
    on:click={() => isOpen = !isOpen}
    class="rounded-full w-14 h-14 shadow-lg bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center focus:outline-none"
  >
    {#if isOpen}
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M18 6L6 18"></path>
        <path d="M6 6l12 12"></path>
      </svg>
    {:else}
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
      </svg>
    {/if}
  </button>

  {#if isOpen}
    <div class="absolute bottom-16 right-0 w-80 bg-white rounded-lg shadow-xl border border-gray-200">
      <div class="bg-blue-600 text-white p-4 rounded-t-lg">
        <h3 class="text-lg font-semibold">Support Chat</h3>
      </div>
      <div>
        <div class="h-80 overflow-y-auto p-4 space-y-4">
          {#each messages as msg (msg.id)}
            <div class="flex {msg.isSupport ? 'justify-start' : 'justify-end'}">
              <div class="max-w-[80%] rounded-lg p-3 {
                msg.isSupport
                  ? 'bg-gray-100'
                  : 'bg-blue-600 text-white'
              }">
                {msg.text}
              </div>
            </div>
          {/each}
        </div>
        <div class="p-4 border-t border-gray-200">
          <div class="flex gap-2">
            <input
              type="text"
              bind:value={message}
              on:keypress={handleKeyPress}
              placeholder="Type your message..."
              class="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <button
              on:click={handleSendMessage}
              class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center justify-center focus:outline-none"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M22 2L11 13"></path>
                <path d="M22 2L15 22L11 13L2 9L22 2z"></path>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  {/if}
</div>