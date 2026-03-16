<script lang="ts">
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';
	import { authStore } from '../stores/auth';
	import Bob from '$lib/assets/bob.webp';

	let loginButtonHovered = $state(false);
	let logoutButtonHovered = $state(false);

	let user = $derived($authStore.user);
	let loading = $derived(browser ? $authStore.loading : true);
	let isAuthenticated = $derived($authStore.isAuthenticated);

	onMount(() => {
		authStore.initAuth();
	});
</script>

<style>
	.container {
		padding: 20px;
		max-width: 1400px;
		margin: 0 auto;
	}

	.center {
		text-align: center;
		margin-top: 100px;
		padding: 20px;
	}

	.title {
		font-size: 48px;
		margin-bottom: 20px;
		color: #ffffff;
		font-weight: 700;
	}

	.subtitle {
		font-size: 20px;
		color: #cccccc;
		margin-bottom: 40px;
	}

	.btn-login {
		padding: 16px 40px;
		font-size: 18px;
		font-weight: 600;
		background-color: #00babc;
		color: white;
		border: none;
		border-radius: 12px;
		cursor: pointer;
		transition: all 0.2s;
		box-shadow: 0 4px 12px rgba(0, 186, 188, 0.3);
	}

	.btn-login:hover {
		background-color: #00d4d6;
		transform: translateY(-2px);
		box-shadow: 0 6px 16px rgba(0, 186, 188, 0.4);
	}

	.logout-row {
		margin-bottom: 30px;
		display: flex;
		justify-content: flex-end;
	}

	.btn-logout {
		padding: 10px 20px;
		background-color: #dc3545;
		color: white;
		border: none;
		border-radius: 8px;
		cursor: pointer;
		font-weight: 500;
		transition: all 0.2s;
	}

	.btn-logout:hover {
		background-color: #c82333;
		transform: translateY(-2px);
	}

	.home-layout {
		display: flex;
		gap: 30px;
		align-items: stretch;
	}

	@media (max-width: 968px) {
		.home-layout {
			flex-direction: column;
		}
	}

	.welcome-card {
		flex: 1;
		display: flex;
		flex-direction: column;
		justify-content: center;
		padding: 40px;
		background-color: #1e1e1e;
		border-radius: 16px;
		border: 1px solid #333333;
	}

	.welcome-title {
		font-size: 42px;
		margin: 0 0 20px 0;
		color: #ffffff;
		font-weight: 700;
	}

	.welcome-title span {
		color: #00babc;
	}

	.welcome-text {
		font-size: 18px;
		color: #cccccc;
		line-height: 1.6;
		margin: 0;
	}

	.user-card {
		flex: 0 0 380px;
		display: flex;
		flex-direction: column;
		align-items: center;
		padding: 30px;
		background-color: #1e1e1e;
		border-radius: 16px;
		border: 1px solid #333333;
		gap: 20px;
	}

	.avatar {
		width: 150px;
		height: 150px;
		border-radius: 50%;
		object-fit: cover;
		border: 4px solid #00babc;
		box-shadow: 0 4px 12px rgba(0, 186, 188, 0.3);
	}

	.user-info {
		text-align: center;
		width: 100%;
	}

	.user-name {
		margin: 0 0 8px 0;
		color: #ffffff;
		font-size: 24px;
	}

	.user-login {
		margin: 0 0 20px 0;
		color: #999;
		font-size: 16px;
	}

	.info-list {
		display: flex;
		flex-direction: column;
		gap: 12px;
		text-align: left;
	}

	.info-row {
		padding: 12px;
		background-color: #2a2a2a;
		border-radius: 8px;
	}

	.info-row-highlight {
		padding: 12px;
		background-color: rgba(0, 186, 188, 0.1);
		border-radius: 8px;
		border: 1px solid rgba(0, 186, 188, 0.3);
	}

	.info-label {
		margin: 0 0 4px 0;
		font-size: 12px;
		color: #999;
	}

	.info-label-highlight {
		margin: 0 0 4px 0;
		font-size: 12px;
		color: #00babc;
	}

	.info-value {
		margin: 0;
		font-size: 16px;
		color: #ffffff;
		font-weight: 500;
	}

	.info-value-highlight {
		margin: 0;
		font-size: 16px;
		color: #00babc;
		font-weight: 500;
	}
</style>

{#if loading}
	<div class="center">
		<h2 style="color: #ffffff;">Loading...</h2>
	</div>

{:else if !isAuthenticated}
	<div class="center">
		<h1 class="title">🎓 Tutor Helper</h1>
		<p class="subtitle">Your companion for helping students at 42</p>
		<button class="btn-login" onclick={authStore.login}>
			🚀 Login with 42
		</button>
	</div>

{:else}
	<div class="container">
		<div class="logout-row">
			<button class="btn-logout" onclick={authStore.logout}>
				🚪 Logout
			</button>
		</div>

		<div class="home-layout">
			<!-- Welcome Section -->
			<div class="welcome-card">
				<h1 class="welcome-title">
					Welcome back,<br />
					<span>{user?.usual_first_name || user?.first_name || user?.login || ''}</span>! 👋
				</h1>
				<p class="welcome-text">
					Ready to parrot some students today?
					<img src="/parrot.gif" alt="Parrot" style="width: 120px; vertical-align: middle;" />
				</p>
			</div>

			<!-- User Card -->
			<div class="user-card">
				{#if user?.image?.versions?.medium}
					<img
						src={user.image.versions.medium || Bob}
						alt={user?.login || 'User'}
						class="avatar"
					/>
				{/if}

				<div class="user-info">
					<h2 class="user-name">{user?.usual_full_name || ''}</h2>
					<p class="user-login">{user?.login || ''}</p>

					<div class="info-list">
						<div class="info-row">
							<p class="info-label">Pool</p>
							<p class="info-value">🏊 {user?.pool_month || ''} {user?.pool_year || ''}</p>
						</div>

						<div class="info-row">
							<p class="info-label">Correction Points</p>
							<p class="info-value">⭐ {user?.correction_point ?? 0}</p>
						</div>

						{#if user?.location}
							<div class="info-row-highlight">
								<p class="info-label-highlight">Current Location</p>
								<p class="info-value-highlight">📍 {user.location}</p>
							</div>
						{/if}
					</div>
				</div>
			</div>
		</div>
	</div>
{/if}