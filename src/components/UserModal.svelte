<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import type { UserSearch } from '../types/user';
	import Bob from '$lib/assets/bob.webp';

	interface Props {
		user: UserSearch | null;
		onClose: () => void;
	}

	let { user, onClose } = $props();

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
	.backdrop {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background-color: rgba(0, 0, 0, 0.85);
		display: flex;
		align-items: center;
		justify-content: center;
		z-index: 1000;
		padding: 20px;
		backdrop-filter: blur(4px);
	}

	.modal {
		background-color: #1e1e1e;
		padding: 30px;
		border-radius: 16px;
		border: 2px solid #333333;
		max-width: 550px;
		width: 100%;
		max-height: 85vh;
		overflow-y: auto;
		color: #ffffff;
		position: relative;
		box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
	}

	.close-btn {
		position: absolute;
		top: 20px;
		right: 20px;
		background: #dc3545;
		border: none;
		color: #ffffff;
		width: 36px;
		height: 36px;
		border-radius: 50%;
		padding: 0;
		font-size: 24px;
		cursor: pointer;
		display: flex;
		align-items: center;
		justify-content: center;
		transition: all 0.2s;
	}

	.close-btn:hover {
		background: #c82333;
		transform: scale(1.1);
	}

	.avatar-section {
		display: flex;
		flex-direction: column;
		align-items: center;
		margin-bottom: 15px;
	}

	.avatar {
		width: 300px;
		height: 300px;
		border-radius: 50%;
		object-fit: cover;
		border: 4px solid #00babc;
		margin-bottom: 15px;
		box-shadow: 0 4px 12px rgba(0, 186, 188, 0.3);
	}

	.modal h2 {
		margin: 0 0 6px 0;
		color: #ffffff;
		font-size: 26px;
		font-weight: 700;
		text-align: center;
	}

	.modal > div > p {
		margin: 0;
		color: #999;
		font-size: 16px;
		text-align: center;
	}

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

	.info-cell {
		padding: 14px;
		background-color: #2a2a2a;
		border-radius: 10px;
		display: flex;
		flex-direction: column;
		gap: 8px;
	}

	.info-cell.row {
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
		grid-column: span 2;
	}

	.info-cell.span-2 {
		grid-column: span 2;
	}

	.info-label {
		color: #999;
		font-size: 12px;
	}

	.info-label-md {
		color: #999;
		font-size: 14px;
	}

	.info-value {
		font-size: 13px;
		font-weight: 500;
		color: #ffffff;
	}

	.info-value-teal {
		color: #00babc;
		font-size: 14px;
		font-weight: 600;
	}

	.info-value-yellow {
		color: #ffc107;
		font-size: 14px;
		font-weight: 600;
	}

	.info-value-green {
		color: #28a745;
		font-size: 14px;
		font-weight: 600;
	}

	.info-value-teal-md {
		color: #00babc;
		font-size: 14px;
		font-weight: 500;
	}
</style>

{#if user}
	<div
		class="backdrop"
		onmousedown={handleBackdropClick}
		onkeydown={handleBackdropKeydown}
		role="presentation">
		<div class="modal" role="dialog" aria-modal="true">
			<button class="close-btn" onclick={onClose}>×</button>

			<div class="avatar-section">
				<img
					class="avatar"
					src={user.image?.versions?.large || Bob}
					alt={user.login}
				/>
				<h2>{user.usual_full_name}</h2>
				<p>{user.login}</p>
			</div>

			<div class="user-modal-grid">
				<div class="info-cell row">
					<span class="info-label-md">📧 Email</span>
					<span class="info-value">{user.email ?? 'N/A'}</span>
				</div>

				<div class="info-cell">
					<span class="info-label">🏊 Pool</span>
					<span class="info-value-teal">{user.pool_month} {user.pool_year}</span>
				</div>

				<div class="info-cell">
					<span class="info-label">⭐ Points</span>
					<span class="info-value-yellow">{user.correction_point}</span>
				</div>

				<div class="info-cell">
					<span class="info-label">💰 Wallet</span>
					<span class="info-value-green">{user.wallet}</span>
				</div>

				{#if user.location}
					<div class="info-cell span-2">
						<span class="info-label">📍 Location</span>
						<span class="info-value-teal-md">{user.location}</span>
					</div>
				{/if}
			</div>
		</div>
	</div>
{/if}