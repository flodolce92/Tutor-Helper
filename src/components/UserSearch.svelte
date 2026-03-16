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
	.wrapper {
		max-width: 1200px;
		margin: 0 auto;
		padding: 0 20px;
	}

	.search-form {
		margin-bottom: 30px;
		display: flex;
		flex-wrap: wrap;
		gap: 12px;
		align-items: stretch;
		background-color: #1e1e1e;
		padding: 20px;
		border-radius: 12px;
		border: 1px solid #333333;
	}

	.search-input {
		padding: 14px 18px;
		font-size: 16px;
		flex: 1;
		min-width: 250px;
		border-radius: 8px;
		border: 2px solid #333333;
		background-color: #2a2a2a;
		color: #ffffff;
		outline: none;
		transition: border-color 0.2s;
	}

	.search-input:focus {
		border-color: #00babc;
	}

	.search-btn {
		padding: 14px 32px;
		font-size: 16px;
		font-weight: 600;
		background-color: #00babc;
		color: white;
		border: none;
		border-radius: 8px;
		cursor: pointer;
		transition: all 0.2s;
		white-space: nowrap;
	}

	.search-btn:hover:not(:disabled) {
		background-color: #00d4d6;
		transform: translateY(-2px);
		box-shadow: 0 4px 12px rgba(0, 186, 188, 0.3);
	}

	.search-btn:disabled {
		background-color: #666666;
		cursor: not-allowed;
	}

	.results-count {
		margin-bottom: 15px;
		color: #cccccc;
	}

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

<div class="wrapper">
	<form class="search-form" onsubmit={handleSearch}>
		<input
			class="search-input"
			type="text"
			bind:value={query}
			placeholder="Search by login or name..."
		/>
		<button class="search-btn" type="submit" disabled={loading || !query.trim()}>
			{loading ? '🔍 Searching...' : '🔍 Search'}
		</button>
	</form>

	{#if searched && !loading}
		<p class="results-count">
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