<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import type { UserSearch } from '../types/user';
	import Bob from '/bob.webp';

	interface Props {
		user: UserSearch | null;
		onClose: () => void;
	}

	let { user, onClose } = $props();
	let closeButtonHovered = $state(false);

	onMount(() => {
		if (!user) return;

		window.history.pushState({ modal: true }, '');
		const handlePopState = () => {
			onClose();
		};
		window.addEventListener('popstate', handlePopState);

		return () => {
			window.removeEventListener('popstate', handlePopState);
		};
	});

	const handleBackdropClick = (e: MouseEvent) => {
		if (e.target === e.currentTarget) {
			onClose();
		}
	};

	const handleBackdropKeydown = (e: KeyboardEvent) => {
		if (e.key === 'Escape') {
			onClose();
		}
	};
</script>

<style>
	.user-modal-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
		gap: 12px;
	}
	@media (max-width: 768px) {
		.user-modal-grid {
			grid-template-columns: repeat(auto-fill, minmax(145px, 1fr));
		}
	}
</style>

{#if user}
	<div
		onmousedown={handleBackdropClick}
		onkeydown={handleBackdropKeydown}
		role="presentation"
		style={{
			position: 'fixed',
			top: 0,
			left: 0,
			right: 0,
			bottom: 0,
			backgroundColor: 'rgba(0, 0, 0, 0.85)',
			display: 'flex',
			alignItems: 'center',
			justifyContent: 'center',
			zIndex: '1000',
			padding: '20px',
			backdropFilter: 'blur(4px)',
		}}>
		<div
			style={{
				backgroundColor: '#1e1e1e',
				padding: '30px',
				borderRadius: '16px',
				border: '2px solid #333333',
				maxWidth: '550px',
				width: '100%',
				maxHeight: '85vh',
				overflowY: 'auto',
				color: '#ffffff',
				position: 'relative',
				boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5)',
			}}
			role="dialog"
			aria-modal="true">
			<button
				onclick={onClose}
				onmouseenter={() => (closeButtonHovered = true)}
				onmouseleave={() => (closeButtonHovered = false)}
				style={{
					position: 'absolute',
					top: '20px',
					right: '20px',
					background: closeButtonHovered ? '#c82333' : '#dc3545',
					border: 'none',
					color: '#ffffff',
					width: '36px',
					height: '36px',
					borderRadius: '50%',
					padding: '0',
					fontSize: '24px',
					cursor: 'pointer',
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center',
					transition: 'all 0.2s',
				}}>
				×
			</button>

			<div
				style={{
					display: 'flex',
					flexDirection: 'column',
					alignItems: 'center',
					marginBottom: '15px',
				}}>
				<img
					src={user.image?.versions?.large || Bob}
					alt={user.login}
					style={{
						width: '300px',
						height: '300px',
						borderRadius: '50%',
						objectFit: 'cover',
						border: '4px solid #00babc',
						marginBottom: '15px',
						boxShadow: '0 4px 12px rgba(0, 186, 188, 0.3)',
					}}
				/>
				<h2
					style={{
						margin: '0 0 6px 0',
						color: '#ffffff',
						fontSize: '26px',
						fontWeight: '700',
						textAlign: 'center',
					}}>
					{user.usual_full_name}
				</h2>
				<p
					style={{
						margin: '0',
						color: '#999',
						fontSize: '16px',
						textAlign: 'center',
					}}>
					{user.login}
				</p>
			</div>

			<div class="user-modal-grid">
				<div
					style={{
						padding: '14px',
						backgroundColor: '#2a2a2a',
						borderRadius: '10px',
						display: 'flex',
						justifyContent: 'space-between',
						alignItems: 'center',
						gridColumn: 'span 2',
					}}>
					<span style={{ color: '#999', fontSize: '14px' }}>📧 Email</span>
					<span style={{ color: '#ffffff', fontSize: '13px', fontWeight: '500' }}>
						{user.email ?? 'N/A'}
					</span>
				</div>

				<div
					style={{
						padding: '14px',
						backgroundColor: '#2a2a2a',
						borderRadius: '10px',
						display: 'flex',
						flexDirection: 'column',
						gap: '8px',
					}}>
					<span style={{ color: '#999', fontSize: '12px' }}>🏊 Pool</span>
					<span style={{ color: '#00babc', fontSize: '14px', fontWeight: '600' }}>
						{user.pool_month} {user.pool_year}
					</span>
				</div>

				<div
					style={{
						padding: '14px',
						backgroundColor: '#2a2a2a',
						borderRadius: '10px',
						display: 'flex',
						flexDirection: 'column',
						gap: '8px',
					}}>
					<span style={{ color: '#999', fontSize: '12px' }}>⭐ Points</span>
					<span style={{ color: '#ffc107', fontSize: '14px', fontWeight: '600' }}>
						{user.correction_point}
					</span>
				</div>

				<div
					style={{
						padding: '14px',
						backgroundColor: '#2a2a2a',
						borderRadius: '10px',
						display: 'flex',
						flexDirection: 'column',
						gap: '8px',
					}}>
					<span style={{ color: '#999', fontSize: '12px' }}>💰 Wallet</span>
					<span style={{ color: '#28a745', fontSize: '14px', fontWeight: '600' }}>
						{user.wallet}
					</span>
				</div>

				{#if user.location}
					<div
						style={{
							padding: '14px',
							backgroundColor: '#2a2a2a',
							borderRadius: '10px',
							display: 'flex',
							flexDirection: 'column',
							gap: '8px',
							gridColumn: 'span 2',
						}}>
						<span style={{ color: '#999', fontSize: '12px' }}>📍 Location</span>
						<span style={{ color: '#00babc', fontSize: '14px', fontWeight: '500' }}>
							{user.location}
						</span>
					</div>
				{/if}
			</div>
		</div>
	</div>
{/if}
