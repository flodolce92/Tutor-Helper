<script lang="ts">
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';
	import { authStore } from '../stores/auth';
	import Bob from '/bob.webp';

	let loginButtonHovered = $state(false);
	let logoutButtonHovered = $state(false);

	let user = $derived($authStore.user);
	let loading = $derived(browser ? $authStore.loading : true);
	let isAuthenticated = $derived($authStore.isAuthenticated);

	onMount(() => {
		authStore.initAuth();
	});
</script>

<div style={{ padding: '20px', maxWidth: '1400px', margin: '0 auto' }}>
	{#if loading}
		<div style={{ textAlign: 'center', marginTop: '100px' }}>
			<h2 style={{ color: '#ffffff' }}>Loading...</h2>
		</div>
	{:else if !isAuthenticated}
		<div
			style={{
				textAlign: 'center',
				marginTop: '100px',
				padding: '20px',
			}}>
			<h1
				style={{
					fontSize: '48px',
					marginBottom: '20px',
					color: '#ffffff',
					fontWeight: '700',
				}}>
				🎓 Tutor Helper
			</h1>
			<p
				style={{
					fontSize: '20px',
					color: '#cccccc',
					marginBottom: '40px',
				}}>
				Your companion for helping students at 42
			</p>
			<button
				onclick={authStore.login}
				onmouseenter={() => (loginButtonHovered = true)}
				onmouseleave={() => (loginButtonHovered = false)}
				style={{
					padding: '16px 40px',
					fontSize: '18px',
					fontWeight: '600',
					backgroundColor: loginButtonHovered ? '#00d4d6' : '#00babc',
					color: 'white',
					border: 'none',
					borderRadius: '12px',
					cursor: 'pointer',
					transition: 'all 0.2s',
					transform: loginButtonHovered ? 'translateY(-2px)' : 'translateY(0)',
					boxShadow: loginButtonHovered
						? '0 6px 16px rgba(0, 186, 188, 0.4)'
						: '0 4px 12px rgba(0, 186, 188, 0.3)',
				}}>
				🚀 Login with 42
			</button>
		</div>
	{:else}
		<div
			style={{
				marginBottom: '30px',
				display: 'flex',
				justifyContent: 'flex-end',
			}}>
			<button
				onclick={authStore.logout}
				onmouseenter={() => (logoutButtonHovered = true)}
				onmouseleave={() => (logoutButtonHovered = false)}
				style={{
					padding: '10px 20px',
					backgroundColor: logoutButtonHovered ? '#c82333' : '#dc3545',
					color: 'white',
					border: 'none',
					borderRadius: '8px',
					cursor: 'pointer',
					fontWeight: '500',
					transition: 'all 0.2s',
					transform: logoutButtonHovered ? 'translateY(-2px)' : 'translateY(0)',
				}}>
				🚪 Logout
			</button>
		</div>

		<div
			class="home-layout"
			style={{
				display: 'flex',
				gap: '30px',
				alignItems: 'stretch',
			}}>
			<!-- Welcome Section -->
			<div
				style={{
					flex: '1',
					display: 'flex',
					flexDirection: 'column',
					justifyContent: 'center',
					padding: '40px',
					backgroundColor: '#1e1e1e',
					borderRadius: '16px',
					border: '1px solid #333333',
				}}>
				<h1
					style={{
						fontSize: '42px',
						margin: '0 0 20px 0',
						color: '#ffffff',
						fontWeight: '700',
					}}>
					Welcome back,
					<br />
					<span style={{ color: '#00babc' }}>
						{user?.usual_first_name || user?.first_name || user?.login || ''}
					</span>
					! 👋
				</h1>
				<p
					style={{
						fontSize: '18px',
						color: '#cccccc',
						lineHeight: '1.6',
						margin: '0',
					}}>
					Ready to parrot some students today?
					<img
						src="/parrot.gif"
						alt="Parrot"
						style={{ width: '120px', verticalAlign: 'middle' }}
					/>
				</p>
			</div>

			<!-- User Card -->
			<div
				style={{
					flex: '0 0 380px',
					display: 'flex',
					flexDirection: 'column',
					alignItems: 'center',
					padding: '30px',
					backgroundColor: '#1e1e1e',
					borderRadius: '16px',
					border: '1px solid #333333',
					gap: '20px',
				}}>
				{#if user?.image?.versions?.medium}
					<img
						src={user?.image?.versions?.medium || Bob}
						alt={user?.login || 'User'}
						style={{
							width: '150px',
							height: '150px',
							borderRadius: '50%',
							objectFit: 'cover',
							border: '4px solid #00babc',
							boxShadow: '0 4px 12px rgba(0, 186, 188, 0.3)',
						}}
					/>
				{/if}
				<div style={{ textAlign: 'center', width: '100%' }}>
					<h2
						style={{
							margin: '0 0 8px 0',
							color: '#ffffff',
							fontSize: '24px',
						}}>
						{user?.usual_full_name || ''}
					</h2>
					<p style={{ margin: '0 0 20px 0', color: '#999', fontSize: '16px' }}>
						{user?.login || ''}
					</p>

					<div
						style={{
							display: 'flex',
							flexDirection: 'column',
							gap: '12px',
							textAlign: 'left',
						}}>
						<div
							style={{
								padding: '12px',
								backgroundColor: '#2a2a2a',
								borderRadius: '8px',
							}}>
							<p
								style={{
									margin: '0 0 4px 0',
									fontSize: '12px',
									color: '#999',
								}}>
								Pool
							</p>
							<p
								style={{
									margin: '0',
									fontSize: '16px',
									color: '#ffffff',
									fontWeight: '500',
								}}>
								🏊 {user?.pool_month || ''} {user?.pool_year || ''}
							</p>
						</div>

						<div
							style={{
								padding: '12px',
								backgroundColor: '#2a2a2a',
								borderRadius: '8px',
							}}>
							<p
								style={{
									margin: '0 0 4px 0',
									fontSize: '12px',
									color: '#999',
								}}>
								Correction Points
							</p>
							<p
								style={{
									margin: '0',
									fontSize: '16px',
									color: '#ffffff',
									fontWeight: '500',
								}}>
								⭐ {user?.correction_point || 0}
							</p>
						</div>

						{#if user?.location}
							<div
								style={{
									padding: '12px',
									backgroundColor: 'rgba(0, 186, 188, 0.1)',
									borderRadius: '8px',
									border: '1px solid rgba(0, 186, 188, 0.3)',
								}}>
								<p
									style={{
										margin: '0 0 4px 0',
										fontSize: '12px',
										color: '#00babc',
									}}>
									Current Location
								</p>
								<p
									style={{
										margin: '0',
										fontSize: '16px',
										color: '#00babc',
										fontWeight: '500',
									}}>
									📍 {user?.location || 'N/A'}
								</p>
							</div>
						{/if}
					</div>
				</div>
			</div>
		</div>
	{/if}
</div>

<style>
	@media (max-width: 968px) {
		:global(.home-layout) {
			flex-direction: column !important;
		}
	}
</style>
