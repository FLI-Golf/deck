<script lang="ts">
	import { onMount } from 'svelte';
	import { loadAllSheets } from '$lib/services/sheets.js';
	import PnlSection from '$lib/components/sections/PnlSection.svelte';
	import RevenueSection from '$lib/components/sections/RevenueSection.svelte';
	import ExpensesSection from '$lib/components/sections/ExpensesSection.svelte';
	import type { AllSheets } from '$lib/services/sheets.js';

	let sheets: AllSheets | null = null;
	let error = '';
	let loading = true;
	let activeSection: 'pnl' | 'revenue' | 'expenses' = 'pnl';

	onMount(async () => {
		try {
			sheets = await loadAllSheets();
		} catch (err) {
			error = err instanceof Error ? err.message : 'Failed to load data';
		} finally {
			loading = false;
		}
	});

	const NAV = [
		{ id: 'pnl',      label: 'P&L' },
		{ id: 'revenue',  label: 'Revenue' },
		{ id: 'expenses', label: 'Expenses' },
	] as const;
</script>

<svelte:head>
	<title>FLI Golf — Financial Projections</title>
</svelte:head>

<div class="app">
	<header>
		<div class="header-inner">
			<div>
				<h1>FLI Golf</h1>
				<p class="subtitle">Financial projections</p>
			</div>
			{#if sheets}
				<nav class="top-nav">
					{#each NAV as item}
						<button
							class="nav-btn"
							class:active={activeSection === item.id}
							on:click={() => (activeSection = item.id)}
						>
							{item.label}
						</button>
					{/each}
				</nav>
			{/if}
		</div>
	</header>

	<main>
		{#if loading}
			<div class="state-message">Loading data…</div>
		{:else if error}
			<div class="error-banner"><strong>Error:</strong> {error}</div>
		{:else if sheets}
			{#if activeSection === 'pnl'}
				<PnlSection sheet={sheets.pnl} notes={sheets.notes} />
			{:else if activeSection === 'revenue'}
				<RevenueSection sheet={sheets.revenue} notes={sheets.notes} />
			{:else if activeSection === 'expenses'}
				<ExpensesSection sheet={sheets.expenses} notes={sheets.notes} />
			{/if}
		{/if}
	</main>
</div>

<style>
	:global(*, *::before, *::after) { box-sizing: border-box; }
	:global(body) {
		margin: 0;
		font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
		background: #f9fafb;
		color: #111827;
	}

	.app { min-height: 100vh; display: flex; flex-direction: column; }

	header {
		background: #fff;
		border-bottom: 1px solid #e5e7eb;
		position: sticky;
		top: 0;
		z-index: 10;
	}

	.header-inner {
		max-width: 1060px;
		margin: 0 auto;
		padding: 1rem 1.5rem;
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 2rem;
	}

	h1 { font-size: 1.25rem; font-weight: 700; margin: 0; }
	.subtitle { font-size: 0.8rem; color: #6b7280; margin: 0; }

	.top-nav { display: flex; gap: 0.25rem; }

	.nav-btn {
		padding: 0.5rem 1.25rem;
		font-size: 0.9rem;
		font-weight: 500;
		color: #6b7280;
		background: none;
		border: 1px solid transparent;
		border-radius: 6px;
		cursor: pointer;
		transition: all 0.15s;
	}
	.nav-btn:hover { color: #111827; background: #f3f4f6; }
	.nav-btn.active { color: #2563eb; background: #eff6ff; border-color: #bfdbfe; }

	main {
		max-width: 1060px;
		margin: 0 auto;
		padding: 2rem 1.5rem 4rem;
		width: 100%;
	}

	.state-message { padding: 4rem; text-align: center; color: #9ca3af; font-size: 0.95rem; }

	.error-banner {
		background: #fef2f2;
		border: 1px solid #fecaca;
		color: #991b1b;
		border-radius: 8px;
		padding: 0.75rem 1rem;
		font-size: 0.9rem;
	}
</style>
