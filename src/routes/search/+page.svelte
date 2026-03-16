<script lang="ts">
	import UserSearch from '../../components/UserSearch.svelte';
</script>

<style>
	.page {
		padding: 20px;
		max-width: 1200px;
		margin: 0 auto;
	}

	.header {
		margin-bottom: 30px;
		text-align: center;
	}

	.header h1 {
		margin: 0 0 10px 0;
		color: #ffffff;
		font-size: 32px;
		font-weight: 700;
		letter-spacing: -0.5px;
	}

	.header h1 span {
		color: #00babc;
	}

	.header p {
		margin: 0;
		color: #999999;
		font-size: 16px;
	}

	.divider {
		width: 48px;
		height: 3px;
		background-color: #00babc;
		border-radius: 2px;
		margin: 14px auto 0;
	}
</style>

<div class="page">
	<div class="header">
		<h1><span>🔍</span> Search Students</h1>
		<p>Find and explore student profiles</p>
		<div class="divider"></div>
	</div>

	<UserSearch />
</div>