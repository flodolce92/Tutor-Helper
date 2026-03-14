<script lang="ts">
	import type { UserSearch } from '../types/user';
	import Bob from '/bob.webp';

	interface Props {
		user: UserSearch;
		onclick?: () => void;
	}

	let { user, onclick } = $props();
	let isHovered = $state(false);

	const handleKeydown = (e: KeyboardEvent) => {
		if ((e.key === 'Enter' || e.key === ' ') && onclick) {
			e.preventDefault();
			onclick();
		}
	};
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
		alignItems: 'center',
		gap: '12px',
		padding: '20px',
		backgroundColor: '#1e1e1e',
		borderRadius: '12px',
		border: '1px solid #333333',
		cursor: onclick ? 'pointer' : 'default',
		transition: 'transform 0.2s, box-shadow 0.2s',
		transform: isHovered && onclick ? 'translateY(-4px)' : 'translateY(0)',
		boxShadow: isHovered && onclick ? '0 4px 12px rgba(0, 0, 0, 0.3)' : 'none',
	}}>
	<img
		src={user.image?.versions?.medium || Bob}
		alt={user.login}
		style={{
			width: '140px',
			height: '140px',
			borderRadius: '50%',
			objectFit: 'cover',
			border: '4px solid #333333',
		}}
	/>
	<div style={{ textAlign: 'center', width: '100%' }}>
		<h3
			style={{
				margin: '0 0 4px 0',
				color: '#ffffff',
				fontSize: '17px',
			}}>
			{user.usual_full_name}
		</h3>
		<p style={{ margin: '0 0 8px 0', color: '#999', fontSize: '14px' }}>
			{user.login}
		</p>
		<p
			style={{
				margin: '4px 0',
				fontSize: '13px',
				color: '#cccccc',
			}}>
			🎓 {user.pool_month} {user.pool_year}
		</p>
		{#if user.location}
			<p
				style={{
					margin: '4px 0',
					fontSize: '13px',
					color: '#00babc',
				}}>
				📍 {user.location}
			</p>
		{/if}
	</div>
	<div
		style={{
			display: 'flex',
			justifyContent: 'space-between',
			alignItems: 'center',
			width: '100%',
			marginTop: 'auto',
			gap: '8px',
			paddingTop: '8px',
			borderTop: '1px solid #333333',
		}}>
		<p style={{ margin: '0', fontSize: '12px', color: '#cccccc' }}>
			⭐ {user.correction_point}
		</p>
		<p style={{ margin: '0', fontSize: '12px', color: '#cccccc' }}>
			💰 {user.wallet}
		</p>
	</div>
</div>
