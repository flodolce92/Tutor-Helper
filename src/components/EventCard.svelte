<script lang="ts">
	import type { Event } from '../types/event';

	interface Props {
		event: Event;
		onclick?: () => void;
	}

	let { event, onclick } = $props();
	let isHovered = $state(false);

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

<div
	role="button"
	tabindex={onclick ? 0 : -1}
	onmouseenter={() => (isHovered = true)}
	onmouseleave={() => (isHovered = false)}
	onclick={onclick}
	onkeydown={handleKeydown}
	style={{
		display: 'flex',
		flexDirection: 'column',
		gap: '12px',
		padding: '20px',
		backgroundColor: '#1e1e1e',
		borderRadius: '12px',
		border: `2px solid ${getKindColor(event.kind)}`,
		cursor: onclick ? 'pointer' : 'default',
		transition: 'transform 0.2s, box-shadow 0.2s',
		minHeight: '200px',
		transform: isHovered && onclick ? 'translateY(-4px)' : 'translateY(0)',
		boxShadow: isHovered && onclick ? '0 4px 12px rgba(0, 0, 0, 0.3)' : 'none',
	}}>
	<h3
		style={{
			margin: '0',
			color: '#ffffff',
			fontSize: '18px',
			overflow: 'hidden',
			textOverflow: 'ellipsis',
			whiteSpace: 'nowrap',
		}}>
		{event.name}
	</h3>

	<p
		style={{
			margin: '0',
			fontSize: '14px',
			color: '#cccccc',
			flex: '1',
			overflow: 'hidden',
			display: '-webkit-box',
			WebkitLineClamp: '2',
			WebkitBoxOrient: 'vertical',
			lineHeight: '1.4',
		}}>
		{event.description ?? 'No description'}
	</p>

	<p
		style={{
			margin: '0',
			fontSize: '13px',
			color: '#cccccc',
			display: 'flex',
			alignItems: 'center',
			gap: '4px',
		}}>
		<span>📍</span>
		<span>{event.location ?? 'TBD'}</span>
	</p>

		<div
			style={{
				display: 'flex',
				justifyContent: 'space-between',
				alignItems: 'center',
				gap: '8px',
			}}>
			<p
				style={{
					margin: '0',
					fontSize: '11px',
					color: '#999999',
					display: 'flex',
					alignItems: 'center',
					gap: '4px',
				}}>
				<span>📅</span>
				<span>{formatDate(event.begin_at)}</span>
			</p>
			<p
				style={{
					margin: '0',
					fontSize: '11px',
					color: '#999999',
					display: 'flex',
					alignItems: 'center',
					gap: '4px',
				}}>
				<span>🕐</span>
				<span>{formatTime(event.begin_at)}</span>
			</p>
		</div>

		{#if spotsLeft !== null}
			<p
				style={{
					margin: '0',
					fontSize: '12px',
					color: spotsLeft > 0 ? '#28a745' : '#e74c3c',
					fontWeight: '500',
				}}>
				{spotsLeft > 0 ? `${spotsLeft} spots left` : 'Sold out'}
			</p>
		{/if}
	</div>
