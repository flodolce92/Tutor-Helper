<script lang="ts">
	import type { Event } from '../types/event';

	interface Props {
		event: Event;
		onclick?: () => void;
	}

	let { event, onclick } = $props();

	const formatDate = (dateString: string) => {
		const date = new Date(dateString);
		return date.toLocaleDateString('it-IT', {
			weekday: 'long',
			day: '2-digit',
			month: 'short',
			year: 'numeric',
		});
	};

	const formatTime = (dateString: string) => {
		const date = new Date(dateString);
		return date.toLocaleTimeString('it-IT', {
			hour: '2-digit',
			minute: '2-digit',
		});
	};

	const getKindColor = (kind: string) => {
		switch (kind.toLowerCase()) {
			case 'workshop':
				return '#4a9eff';
			case 'conference':
				return '#9b59b6';
			case 'hackathon':
				return '#5cb85c';
			case 'association':
				return '#f39c12';
			case 'exam':
				return '#e74c3c';
			default:
				return '#333333';
		}
	};

	const handleKeydown = (e: KeyboardEvent) => {
		if ((e.key === 'Enter' || e.key === ' ') && onclick) {
			e.preventDefault();
			onclick();
		}
	};

	const spotsLeft = $derived(
		event.max_people ? event.max_people - event.nbr_subscribers : null,
	);
</script>

<style>
	.card {
		display: flex;
		flex-direction: column;
		gap: 12px;
		padding: 20px;
		background-color: #1e1e1e;
		border-radius: 12px;
		border: 2px solid #333333;
		transition: transform 0.2s, box-shadow 0.2s;
		min-height: 200px;
		cursor: default;
	}

	.card.clickable:hover {
		transform: translateY(-4px);
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
		cursor: pointer;
	}

	.card h3 {
		margin: 0;
		color: #ffffff;
		font-size: 18px;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.description {
		margin: 0;
		font-size: 14px;
		color: #cccccc;
		flex: 1;
		overflow: hidden;
		display: -webkit-box;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
		line-height: 1.4;
	}

	.location-row {
		margin: 0;
		font-size: 13px;
		color: #cccccc;
		display: flex;
		align-items: center;
		gap: 4px;
	}

	.date-row {
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: 8px;
	}

	.date-item {
		margin: 0;
		font-size: 11px;
		color: #999999;
		display: flex;
		align-items: center;
		gap: 4px;
	}

	.spots {
		margin: 0;
		font-size: 12px;
		font-weight: 500;
	}

	.spots.available {
		color: #28a745;
	}

	.spots.soldout {
		color: #e74c3c;
	}
</style>

<div
	class="card {onclick ? 'clickable' : ''}"
	role="button"
	tabindex={onclick ? 0 : -1}
	style="border-color: {getKindColor(event.kind)};"
	{onclick}
	onkeydown={handleKeydown}>
	<h3>{event.name}</h3>

	<p class="description">{event.description ?? 'No description'}</p>

	<p class="location-row">
		<span>📍</span>
		<span>{event.location ?? 'TBD'}</span>
	</p>

	<div class="date-row">
		<p class="date-item">
			<span>📅</span>
			<span>{formatDate(event.begin_at)}</span>
		</p>
		<p class="date-item">
			<span>🕐</span>
			<span>{formatTime(event.begin_at)}</span>
		</p>
	</div>

	{#if spotsLeft !== null}
		<p class="spots {spotsLeft > 0 ? 'available' : 'soldout'}">
			{spotsLeft > 0 ? `${spotsLeft} spots left` : 'Sold out'}
		</p>
	{/if}
</div>