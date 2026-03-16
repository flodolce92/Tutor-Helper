<script lang="ts">
	import type { UserSearch } from '../types/user';
	import Bob from '$lib/assets/bob.webp';

	interface Props {
		user: UserSearch;
		onclick?: () => void;
	}

	let { user, onclick } = $props();

	const handleKeydown = (e: KeyboardEvent) => {
		if ((e.key === 'Enter' || e.key === ' ') && onclick) {
			e.preventDefault();
			onclick();
		}
	};
</script>

<style>
	.card {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 12px;
		padding: 20px;
		background-color: #1e1e1e;
		border-radius: 12px;
		border: 1px solid #333333;
		transition: transform 0.2s, box-shadow 0.2s;
		cursor: default;
	}

	.card.clickable {
		cursor: pointer;
	}

	.card.clickable:hover {
		transform: translateY(-4px);
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
	}

	.avatar {
		width: 140px;
		height: 140px;
		border-radius: 50%;
		object-fit: cover;
		border: 4px solid #333333;
	}

	.info {
		text-align: center;
		width: 100%;
	}

	.info h3 {
		margin: 0 0 4px 0;
		color: #ffffff;
		font-size: 17px;
	}

	.login {
		margin: 0 0 8px 0;
		color: #999;
		font-size: 14px;
	}

	.pool {
		margin: 4px 0;
		font-size: 13px;
		color: #cccccc;
	}

	.location {
		margin: 4px 0;
		font-size: 13px;
		color: #00babc;
	}

	.footer {
		display: flex;
		justify-content: space-between;
		align-items: center;
		width: 100%;
		margin-top: auto;
		gap: 8px;
		padding-top: 8px;
		border-top: 1px solid #333333;
	}

	.footer p {
		margin: 0;
		font-size: 12px;
		color: #cccccc;
	}
</style>

<div
	class="card {onclick ? 'clickable' : ''}"
	role="button"
	tabindex={onclick ? 0 : -1}
	{onclick}
	onkeydown={handleKeydown}>
	<img
		class="avatar"
		src={user.image?.versions?.medium || Bob}
		alt={user.login}
	/>
	<div class="info">
		<h3>{user.usual_full_name}</h3>
		<p class="login">{user.login}</p>
		<p class="pool">🎓 {user.pool_month} {user.pool_year}</p>
		{#if user.location}
			<p class="location">📍 {user.location}</p>
		{/if}
	</div>
	<div class="footer">
		<p>⭐ {user.correction_point}</p>
		<p>💰 {user.wallet}</p>
	</div>
</div>