<script lang="ts">
	import { onMount } from 'svelte';
	import { apiService } from '../../services/api.service';
	import type { LocationUser, UserSearch } from '../../types/user';
	import OnlineUserCard from '../../components/UserCard.svelte';
	import UserModal from '../../components/UserModal.svelte';
	import John from '$lib/assets/john.gif';

	let locations = $state<LocationUser[]>([]);
	let loading = $state(true);
	let selectedUser = $state<UserSearch | null>(null);

	onMount(async () => {
		try {
			const locs = await apiService.getLocations();
			locs.sort((a, b) => a.host.localeCompare(b.host, undefined, { numeric: true }));
			locations = locs;
		} catch (error) {
			console.error('Failed to fetch locations:', error);
			alert('Failed to load online students.');
		} finally {
			loading = false;
		}
	});
</script>

<style>
	.online-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
		gap: 20px;
	}

	@media (max-width: 768px) {
		.online-grid {
			grid-template-columns: repeat(auto-fill, minmax(175px, 1fr));
		}
	}
</style>

{#if loading}
	<div style="text-align: center; margin-top: 100px;">
		<h2 style="color: #ffffff;">Loading...</h2>
	</div>

{:else if locations.length === 0}
	<div style="display: flex; justify-content: center; align-items: center; min-height: 70vh;">
		<img src={John} alt="No students online" />
	</div>

{:else}
	<div style="padding: 20px; max-width: 1200px; margin: 0 auto;">
		<p style="margin-bottom: 15px; color: #cccccc;">
			Found {locations.length} student{locations.length !== 1 ? 's' : ''} online
		</p>

		<div class="online-grid">
			{#each locations as loc (loc.id)}
				<OnlineUserCard
					location={loc}
					onclick={() => (selectedUser = loc.user as UserSearch)}
				/>
			{/each}
		</div>

		<UserModal user={selectedUser} onClose={() => (selectedUser = null)} />
	</div>
{/if}