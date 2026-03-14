<script lang="ts">
	import { apiService } from '../services/api.service';
	import type { UserSearch as UserSearchType } from '../types/user';
	import UserCard from './UserCard.svelte';
	import UserModal from './UserModal.svelte';

	let query = $state('');
	let results = $state<UserSearchType[]>([]);
	let loading = $state(false);
	let searched = $state(false);
	let selectedUser = $state<UserSearchType | null>(null);

	const handleSearch = async (e: Event) => {
		e.preventDefault();
		if (!query.trim()) return;

		loading = true;
		searched = true;
		results = [];
		try {
			const users = await apiService.searchUsers(
				query,
				1,
				20,
				(partialUsers) => {
					results = partialUsers;
				},
			);
			results = users;
		} catch (error) {
			console.error('Search failed:', error);
			alert('Search failed. Please try again.');
		} finally {
			loading = false;
		}
	};
</script>

<style>
	.user-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
		gap: 20px;
	}
	@media (max-width: 768px) {
		.user-grid {
			grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
		}
	}
</style>

<div style={{ marginTop: '30px' }}>
	<form
		onsubmit={handleSearch}
		style={{
			marginBottom: '30px',
			display: 'flex',
			flexWrap: 'wrap',
			gap: '12px',
			alignItems: 'stretch',
			backgroundColor: '#1e1e1e',
			padding: '20px',
			borderRadius: '12px',
			border: '1px solid #333333',
		}}>
		<input
			type="text"
			value={query}
			onchange={(e) => (query = e.target.value)}
			placeholder="Search by login or name..."
			style={{
				padding: '14px 18px',
				fontSize: '16px',
				flex: '1',
				minWidth: '250px',
				borderRadius: '8px',
				border: '2px solid #333333',
				backgroundColor: '#2a2a2a',
				color: '#ffffff',
				outline: 'none',
				transition: 'border-color 0.2s',
			}}
			onfocus={(e) => ((e.target as HTMLInputElement).style.borderColor = '#00babc')}
			onblur={(e) => ((e.target as HTMLInputElement).style.borderColor = '#333333')}
		/>
		<button
			type="submit"
			disabled={loading || !query.trim()}
			style={{
				padding: '14px 32px',
				fontSize: '16px',
				fontWeight: '600',
				backgroundColor: loading || !query.trim() ? '#666666' : '#00babc',
				color: 'white',
				border: 'none',
				borderRadius: '8px',
				cursor: loading || !query.trim() ? 'not-allowed' : 'pointer',
				transition: 'all 0.2s',
				whiteSpace: 'nowrap',
			}}>
			{loading ? '🔍 Searching...' : '🔍 Search'}
		</button>
	</form>

	{#if searched && !loading}
		<p style={{ marginBottom: '15px', color: '#cccccc' }}>
			Found {results.length} student{results.length !== 1 ? 's' : ''}
		</p>
	{/if}

	<div class="user-grid">
		{#each results as user (user.id)}
			<UserCard user={user} onclick={() => (selectedUser = user)} />
		{/each}
	</div>
	<UserModal user={selectedUser} onClose={() => (selectedUser = null)} />
</div>
