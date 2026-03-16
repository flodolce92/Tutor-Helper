<script lang="ts">
	import { onMount } from 'svelte';
	import { apiService } from '../../services/api.service';
	import type { Event } from '../../types/event';
	import EventCard from '../../components/EventCard.svelte';

	let events = $state<Event[]>([]);
	let loading = $state(true);
	let error = $state('');

	async function loadEvents() {
		try {
			loading = true;
			error = '';
			const allEvents = await apiService.getEvents();
			events = allEvents.filter((e) => e.cursus_ids.includes(9));
		} catch (err) {
			console.error('Failed to fetch events:', err);
			error = 'Failed to load events';
		} finally {
			loading = false;
		}
	}

	onMount(loadEvents);
</script>

<style>
	.events-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
		gap: 20px;
	}

	@media (max-width: 768px) {
		.events-grid {
			grid-template-columns: repeat(auto-fill, minmax(175px, 1fr));
		}
	}
</style>

{#if loading}
	<div style="text-align: center; margin-top: 100px;">
		<h2 style="color: #ffffff;">Loading...</h2>
	</div>

{:else if error}
	<div style="padding: 20px; background-color: #e74c3c; color: white; border-radius: 8px; margin-bottom: 20px;">
		<p style="margin: 0;">❌ {error}</p>
	</div>

{:else}
	<div style="padding: 20px; max-width: 1200px; margin: 0 auto;">
		<p style="margin-bottom: 15px; color: #cccccc;">
			{#if events.length > 0}
				Trovati {events.length} event{events.length !== 1 ? 'i' : 'o'}
			{:else}
				Nessun evento trovato
			{/if}
		</p>

		<div class="events-grid">
			{#each events as event (event.id)}
				<EventCard {event} />
			{/each}
		</div>
	</div>
{/if}