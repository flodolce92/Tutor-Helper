<script lang="ts">
	import { onMount } from 'svelte';
	import { apiService } from '../../services/api.service';
	import type { UserSearch } from '../../types/user';
	import UserCard from '../../components/UserCard.svelte';
	import UserModal from '../../components/UserModal.svelte';

	let users = $state<UserSearch[]>([]);
	let loading = $state(true);
	let error = $state('');
	let selectedUser = $state<UserSearch | null>(null);
	let filterText = $state('');
	let filteredUsers = $derived(
		users.filter(
			(u) =>
				u.login.toLowerCase().includes(filterText.toLowerCase()) ||
				u.usual_full_name.toLowerCase().includes(filterText.toLowerCase()),
		),
	);

	async function loadOnlineUsers() {
		try {
			loading = true;
			error = '';
			const response = await apiService.getOnlineUsers();
			users = response;
		} catch (err) {
			console.error('Failed to load online users:', err);
			error = 'Failed to load online users';
		} finally {
			loading = false;
		}
	}

	onMount(loadOnlineUsers);
</script>

<div style={{ marginTop: '30px' }}>
	<h1 style={{ margin: '0 0 15px 0', color: '#ffffff', fontSize: '28px', fontWeight: '700' }}>
		🟢 Online Students
	</h1>
	<p style={{ margin: '0 0 30px 0', color: '#cccccc', fontSize: '16px' }}>
		{users.length} student{users.length !== 1 ? 's' : ''} currently online
	</p>

	{#if loading}
		<div
			style={{
				display: 'flex',
				justifyContent: 'center',
				alignItems: 'center',
				minHeight: '300px',
				color: '#cccccc',
			}}>
			<p style={{ fontSize: '18px' }}>⏳ Loading online users...</p>
		</div>
	{:else if error}
		<div
			style={{
				padding: '20px',
				backgroundColor: '#e74c3c',
				color: 'white',
				borderRadius: '8px',
				marginBottom: '20px',
			}}>
			<p style={{ margin: '0' }}>❌ {error}</p>
		</div>
	{:else if users.length === 0}
		<div
			style={{
				padding: '40px 20px',
				backgroundColor: '#1e1e1e',
				borderRadius: '8px',
				border: '1px solid #333333',
				textAlign: 'center',
				color: '#cccccc',
			}}>
			<p style={{ fontSize: '18px', margin: '0' }}>No students currently online</p>
		</div>
	{:else}
		<div
			style={{
				marginBottom: '20px',
				display: 'flex',
				gap: '12px',
			}}>
			<input
				type="text"
				value={filterText}
				onchange={(e) => (filterText = e.target.value)}
				placeholder="Filter by name or login..."
				style={{
					padding: '12px 16px',
					fontSize: '14px',
					flex: '1',
					minWidth: '200px',
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
		</div>

		{#if filteredUsers.length === 0}
			<p
				style={{
					color: '#cccccc',
					textAlign: 'center',
					padding: '20px',
				}}>
				No students match your filter
			</p>
		{:else}
			<div
				style={{
					display: 'grid',
					gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
					gap: '20px',
				}}>
				{#each filteredUsers as user (user.id)}
					<UserCard user={user} onclick={() => (selectedUser = user)} />
				{/each}
			</div>
		{/if}
	{/if}

	<UserModal user={selectedUser} onClose={() => (selectedUser = null)} />
</div>
