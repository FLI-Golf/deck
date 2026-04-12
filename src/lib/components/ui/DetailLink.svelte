<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	export let label: string = 'View details';

	const dispatch = createEventDispatcher();
</script>

<button class="detail-link" type="button" on:click={() => dispatch('viewAssumptions')}>
	{label}
	<svg width="11" height="11" viewBox="0 0 11 11" fill="none" aria-hidden="true">
		<path d="M2 9L9 2M9 2H4.5M9 2V6.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
	</svg>
</button>

<style>
	.detail-link {
		display: inline-flex;
		align-items: center;
		gap: 0.25rem;
		font-size: 0.75rem;
		font-weight: 500;
		color: #2563eb;
		background: none;
		border: none;
		padding: 0;
		cursor: pointer;
		white-space: nowrap;
		transition: color 0.15s;
	}

	.detail-link:hover {
		color: #1d4ed8;
		text-decoration: underline;
	}
</style>
