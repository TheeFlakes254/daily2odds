// src/lib/utils/subscription.js
import PocketBase from 'pocketbase';

const pb = new PocketBase('https://odds.pockethost.io');

export async function subscribeUser(userId, tier, duration) {
    // Subscription logic...
}

export async function checkSubscription(userId) {
    // Check subscription logic...
}

export async function getTierContent(userId) {
    // Get tier content logic...
}
