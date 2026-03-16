<script lang="ts">
	import { onMount } from 'svelte';
	import { apiService } from '../../services/api.service';
	import type { UserSearch } from '../../types/user';
	import UserCard from '../../components/UserCard.svelte';
	import UserModal from '../../components/UserModal.svelte';

	const months = [
		'january', 'february', 'march', 'april', 'may', 'june',
		'july', 'august', 'september', 'october', 'november', 'december',
	];

	const getCookie = (name: string): string => {
		const value = `; ${document.cookie}`;
		const parts = value.split(`; ${name}=`);
		if (parts.length === 2) return parts.pop()?.split(';').shift() || '';
		return '';
	};

	const setCookie = (name: string, value: string, days: number = 365) => {
		const expires = new Date();
		expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
		document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/`;
	};

	let month = $state('');
	let year = $state('');
	let results = $state<UserSearch[]>([]);
	let loading = $state(false);
	let searched = $state(false);
	let selectedUser = $state<UserSearch | null>(null);
	let liveFilter = $state('');

	const filteredResults = $derived(
		results.filter((user) => {
			if (!liveFilter) return true;
			const searchTerm = liveFilter.toLowerCase();
			return (
				user.login.toLowerCase().includes(searchTerm) ||
				user.first_name.toLowerCase().includes(searchTerm) ||
				user.last_name.toLowerCase().includes(searchTerm) ||
				user.usual_full_name.toLowerCase().includes(searchTerm)
			);
		})
	);

	onMount(() => {
		const savedMonth = getCookie('filterMonth');
		const savedYear = getCookie('filterYear');
		if (savedMonth) month = savedMonth;
		if (savedYear) year = savedYear;
	});

	async function handleFilter(e: Event) {
		e.preventDefault();
		if (!month || !year) return;

		setCookie('filterMonth', month);
		setCookie('filterYear', year);

		loading = true;
		searched = true;
		liveFilter = '';
		try {
			results = await apiService.getAllUsersByPool(month, year);
		} catch (error) {
			console.error('Filter failed:', error);
			alert('Filter failed. Please try again.');
		} finally {
			loading = false;
		}
	}

	function handleReset() {
		searched = false;
		results = [];
		liveFilter = '';
	}
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

	.toolbar {
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

	.field {
		padding: 14px 18px;
		font-size: 16px;
		border-radius: 8px;
		border: 2px solid #333333;
		background-color: #2a2a2a;
		color: #ffffff;
		outline: none;
		transition: border-color 0.2s;
	}

	.field:focus {
		border-color: #00babc;
	}

	select.field {
		min-width: 180px;
		cursor: pointer;
	}

	input.field {
		width: 120px;
		min-width: 70px;
	}

	input.field-flex {
		flex: 1;
		min-width: 200px;
	}

	.btn {
		padding: 14px 32px;
		font-size: 16px;
		font-weight: 600;
		color: white;
		border: none;
		border-radius: 8px;
		cursor: pointer;
		transition: all 0.2s;
		white-space: nowrap;
	}

	.btn-primary {
		background-color: #00babc;
	}

	.btn-primary:hover:not(:disabled) {
		background-color: #00d4d6;
		transform: translateY(-2px);
		box-shadow: 0 4px 12px rgba(0, 186, 188, 0.3);
	}

	.btn-primary:disabled {
		background-color: #666666;
		cursor: not-allowed;
	}

	.btn-secondary {
		padding: 14px 24px;
		background-color: #444444;
	}

	.btn-secondary:hover {
		background-color: #555555;
		transform: translateY(-2px);
	}
</style>

<div style="padding: 20px; max-width: 1200px; margin: 0 auto;">

	{#if !searched || results.length === 0}
		<form class="toolbar" onsubmit={handleFilter}>
			<select class="field" bind:value={month}>
				<option value="">📅 Select Month</option>
				{#each months as m (m)}
					<option value={m}>{m.charAt(0).toUpperCase() + m.slice(1)}</option>
				{/each}
			</select>

			<input
				class="field"
				type="text"
				bind:value={year}
				placeholder="📆 Year"
			/>

			<button
				class="btn btn-primary"
				type="submit"
				disabled={loading || !month || !year}
			>
				{loading ? '🔍 Filtering...' : '🔍 Filter'}
			</button>
		</form>
	{:else}
		<div class="toolbar" style="align-items: center;">
			<input
				class="field field-flex"
				type="text"
				bind:value={liveFilter}
				placeholder="🔍 Quick filter"
			/>
			<button class="btn btn-secondary" onclick={handleReset}>
				🔄 New Search
			</button>
		</div>
	{/if}

	{#if searched && !loading}
		<p style="margin-bottom: 15px; color: #cccccc;">
			Found {filteredResults.length} student{filteredResults.length !== 1 ? 's' : ''}
			{liveFilter ? `(filtered from ${results.length} total)` : ''}
		</p>
	{/if}

	<div class="user-grid">
		{#each filteredResults as user (user.id)}
			<UserCard {user} onclick={() => (selectedUser = user)} />
		{/each}
	</div>

	<UserModal user={selectedUser} onClose={() => (selectedUser = null)} />
</div>