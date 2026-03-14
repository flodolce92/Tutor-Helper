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
			// Filter for cursus_id 9 (as per old EventsPage)
			events = allEvents.filter((e) => e.cursus_ids.includes(9));
		} catch (err) {
			console.error('Failed to load events:', err);
			error = 'Failed to load events';
		} finally {
			loading = false;
		}
	}

	onMount(loadEvents);
</script>

<div style={{ marginTop: '30px' }}>
	<h1 style={{ margin: '0 0 15px 0', color: '#ffffff', fontSize: '28px', fontWeight: '700' }}>
		🎉 Events
	</h1>
	<p style={{ margin: '0 0 30px 0', color: '#cccccc', fontSize: '16px' }}>
		Join events and workshops
	</p>

	{#if loading}
		<div
			style={{
				display: 'flex',
				justifyContent: 'center',
				alignItems: 'center',
				minHeight: '300px',
				color: '#cccccc',
			}}>
			<p style={{ fontSize: '18px' }}>⏳ Loading events...</p>
		</div>
	{:else if error}
		<div
			style={{
				padding: '20px',
				backgroundColor: '#e74c3c',
				color: 'white',
				borderRadius: '8px',
				marginBottom: '20px',
			}}>
			<p style={{ margin: '0' }}>❌ {error}</p>
		</div>
	{:else if events.length === 0}
		<div
			style={{
				padding: '40px 20px',
				backgroundColor: '#1e1e1e',
				borderRadius: '8px',
				border: '1px solid #333333',
				textAlign: 'center',
				color: '#cccccc',
			}}>
			<p style={{ fontSize: '18px', margin: '0' }}>No events found</p>
		</div>
	{:else}
		<div
			style={{
				display: 'grid',
				gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
				gap: '20px',
			}}>
			{#each events as event (event.id)}
				<EventCard event={event} />
			{/each}
		</div>
	{/if}
</div>
