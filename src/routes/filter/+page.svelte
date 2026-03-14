<script lang="ts">
	import { onMount } from 'svelte';
	import { apiService } from '../../services/api.service';
	import type { UserSearch, Campus } from '../../types/user';
	import UserCard from '../../components/UserCard.svelte';
	import UserModal from '../../components/UserModal.svelte';

	let campuses = $state<Campus[]>([]);
	let selectedCampus = $state<Campus | null>(null);
	let users = $state<UserSearch[]>([]);
	let loading = $state(true);
	let error = $state('');
	let selectedUser = $state<UserSearch | null>(null);
	let campusLoading = $state(false);

	async function loadCampuses() {
		try {
			loading = true;
			error = '';
			const response = await apiService.getCampuses();
			campuses = response;
			if (campuses.length > 0) {
				selectedCampus = campuses[0];
				await loadUsersByCampus(campuses[0].id);
			}
		} catch (err) {
			console.error('Failed to load campuses:', err);
			error = 'Failed to load campuses';
		} finally {
			loading = false;
		}
	}

	async function loadUsersByCampus(campusId: number) {
		try {
			campusLoading = true;
			error = '';
			users = await apiService.getUsersByCampus(campusId);
		} catch (err) {
			console.error('Failed to load users:', err);
			error = 'Failed to load users';
		} finally {
			campusLoading = false;
		}
	}

	const handleCampusChange = async (campus: Campus) => {
		selectedCampus = campus;
		await loadUsersByCampus(campus.id);
	};

	onMount(loadCampuses);
</script>

<div style={{ marginTop: '30px' }}>
	<h1 style={{ margin: '0 0 15px 0', color: '#ffffff', fontSize: '28px', fontWeight: '700' }}>
		🏢 Filter by Campus
	</h1>
	<p style={{ margin: '0 0 30px 0', color: '#cccccc', fontSize: '16px' }}>
		Explore students from different campuses
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
			<p style={{ fontSize: '18px' }}>⏳ Loading campuses...</p>
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
	{:else}
		<div
			style={{
				display: 'grid',
				gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
				gap: '10px',
				marginBottom: '30px',
			}}>
			{#each campuses as campus (campus.id)}
				<button
					onclick={() => handleCampusChange(campus)}
					style={{
						padding: '14px 16px',
						fontSize: '14px',
						fontWeight: '600',
						backgroundColor: selectedCampus?.id === campus.id ? '#00babc' : '#333333',
						color: selectedCampus?.id === campus.id ? '#000000' : '#ffffff',
						border: '2px solid #00babc',
						borderRadius: '8px',
						cursor: 'pointer',
						transition: 'all 0.2s',
						textAlign: 'center',
						whiteSpace: 'nowrap',
						overflow: 'hidden',
						textOverflow: 'ellipsis',
					}}
					onmouseenter={(e) => {
						if (selectedCampus?.id !== campus.id) {
							(e.target as HTMLButtonElement).style.backgroundColor = '#00babc20';
						}
					}}
					onmouseleave={(e) => {
						if (selectedCampus?.id !== campus.id) {
							(e.target as HTMLButtonElement).style.backgroundColor = '#333333';
						}
					}}>
					{campus.name}
				</button>
			{/each}
		</div>

		{#if campusLoading}
			<div
				style={{
					display: 'flex',
					justifyContent: 'center',
					alignItems: 'center',
					minHeight: '300px',
					color: '#cccccc',
				}}>
				<p style={{ fontSize: '18px' }}>⏳ Loading students...</p>
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
				<p style={{ fontSize: '18px', margin: '0' }}>No students found for this campus</p>
			</div>
		{:else}
			<p style={{ margin: '0 0 20px 0', color: '#cccccc', fontSize: '16px' }}>
				Found {users.length} student{users.length !== 1 ? 's' : ''} in {selectedCampus?.name}
			</p>
			<div
				style={{
					display: 'grid',
					gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
					gap: '20px',
				}}>
				{#each users as user (user.id)}
					<UserCard user={user} onclick={() => (selectedUser = user)} />
				{/each}
			</div>
		{/if}
	{/if}

	<UserModal user={selectedUser} onClose={() => (selectedUser = null)} />
</div>
