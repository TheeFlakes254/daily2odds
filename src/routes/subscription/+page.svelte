<script>
    import { subscribeUser } from '$lib/utils/subscription.js';

    let tier = '';
    let duration = '';

    async function handleSubscription() {
        const userId = 'user_id'; // Replace with actual user ID
        await subscribeUser(userId, tier, duration);
        alert('Subscription successful!');
    }
</script>

<form on:submit|preventDefault={handleSubscription}>
    <label>
        Select Tier:
        <select bind:value={tier}>
            <option value="silver">Silver</option>
            <option value="gold">Gold</option>
        </select>
    </label>
    <label>
        Duration:
        <select bind:value={duration}>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
        </select>
    </label>
    <button type="submit">Subscribe</button>
</form>
