<script lang="ts">
	import favicon from '$lib/assets/favicon.svg';
	import { page } from '$app/stores';
	import '../App.css';
	import '../index.css';

	let { children } = $props();
	const path = $derived($page.url.pathname);
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<title>42 Tutor Helper</title>
	<meta name="description" content="Find and connect with 42 students" />
</svelte:head>

<div style={{ minHeight: '100vh', backgroundColor: '#000000' }}>
	<nav style={{
		display: 'flex',
		gap: '0',
		backgroundColor: '#1e1e1e',
		borderBottom: '1px solid #333333',
		padding: '0',
		position: 'sticky',
		top: '0',
		zIndex: '100',
	}}>
		<a
			href="/"
			class="nav-link"
			style={{
				flex: '1',
				padding: '16px 20px',
				textDecoration: 'none',
				color: '#ffffff',
				textAlign: 'center',
				borderBottom: path === '/' ? '3px solid #00babc' : 'none',
				transition: 'all 0.2s',
				fontSize: '14px',
			}}>
			🏠<span class="nav-text"> Home</span>
		</a>
		<a
			href="/search"
			class="nav-link"
			style={{
				flex: '1',
				padding: '16px 20px',
				textDecoration: 'none',
				color: '#ffffff',
				textAlign: 'center',
				borderBottom: path === '/search' ? '3px solid #00babc' : 'none',
				transition: 'all 0.2s',
				fontSize: '14px',
			}}>
			🔍<span class="nav-text"> Search</span>
		</a>
		<a
			href="/filter"
			class="nav-link"
			style={{
				flex: '1',
				padding: '16px 20px',
				textDecoration: 'none',
				color: '#ffffff',
				textAlign: 'center',
				borderBottom: path === '/filter' ? '3px solid #00babc' : 'none',
				transition: 'all 0.2s',
				fontSize: '14px',
			}}>
			📋<span class="nav-text"> Filter</span>
		</a>
		<a
			href="/online"
			class="nav-link"
			style={{
				flex: '1',
				padding: '16px 20px',
				textDecoration: 'none',
				color: '#ffffff',
				textAlign: 'center',
				borderBottom: path === '/online' ? '3px solid #00babc' : 'none',
				transition: 'all 0.2s',
				fontSize: '14px',
			}}>
			👥<span class="nav-text"> Online</span>
		</a>
		<a
			href="/events"
			class="nav-link"
			style={{
				flex: '1',
				padding: '16px 20px',
				textDecoration: 'none',
				color: '#ffffff',
				textAlign: 'center',
				borderBottom: path === '/events' ? '3px solid #00babc' : 'none',
				transition: 'all 0.2s',
				fontSize: '14px',
			}}>
			📅<span class="nav-text"> Events</span>
		</a>
	</nav>
	<main style={{ padding: '20px' }}>
		{@render children()}
	</main>
</div>
