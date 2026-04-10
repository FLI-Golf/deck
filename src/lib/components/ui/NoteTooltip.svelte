<script lang="ts">
	import { onDestroy } from 'svelte';

	export let note: string;
	export let label: string = '';

	let visible = false;
	let btnEl: HTMLButtonElement;

	// Portal tooltip element mounted directly on body
	let portalEl: HTMLDivElement | null = null;

	const TIP_W = 280;
	const MARGIN = 12;
	const GAP = 6;

	function show() {
		if (!btnEl) return;

		const rect = btnEl.getBoundingClientRect();
		const vw = window.innerWidth;

		// Anchor left edge to the right of the icon, clamped to viewport
		let left = rect.right + GAP;
		if (left + TIP_W > vw - MARGIN) {
			left = Math.max(MARGIN, vw - TIP_W - MARGIN);
		}

		const top = rect.bottom + GAP + window.scrollY;

		if (!portalEl) {
			portalEl = document.createElement('div');
			portalEl.setAttribute('role', 'tooltip');
			portalEl.className = 'note-tooltip-portal';
			document.body.appendChild(portalEl);
		}

		portalEl.textContent = note;
		portalEl.style.cssText = `
			position: absolute;
			top: ${top}px;
			left: ${left}px;
			width: ${TIP_W}px;
			background: #1f2937;
			color: #f9fafb;
			font-size: 0.78rem;
			line-height: 1.5;
			padding: 0.6rem 0.75rem;
			border-radius: 8px;
			box-shadow: 0 4px 16px rgba(0,0,0,0.18);
			z-index: 9999;
			pointer-events: none;
			white-space: normal;
			text-align: left;
			font-family: inherit;
		`;

		visible = true;
	}

	function hide() {
		visible = false;
		if (portalEl) {
			portalEl.remove();
			portalEl = null;
		}
	}

	function onKeydown(e: KeyboardEvent) {
		if (e.key === 'Escape') hide();
	}

	onDestroy(() => {
		if (portalEl) { portalEl.remove(); portalEl = null; }
	});
</script>

<svelte:window on:keydown={onKeydown} />

<span class="note-wrap">
	<button
		bind:this={btnEl}
		class="info-btn"
		aria-label="Note{label ? ` for ${label}` : ''}"
		aria-expanded={visible}
		on:mouseenter={show}
		on:mouseleave={hide}
		on:focus={show}
		on:blur={hide}
		type="button"
	>
		<svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
			<circle cx="7" cy="7" r="6.5" stroke="currentColor"/>
			<text x="7" y="11" text-anchor="middle" font-size="9" font-weight="700" fill="currentColor">i</text>
		</svg>
	</button>
</span>

<style>
	.note-wrap {
		display: inline-flex;
		align-items: center;
		vertical-align: middle;
		margin-left: 0.3rem;
	}

	.info-btn {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		width: 16px;
		height: 16px;
		padding: 0;
		background: none;
		border: none;
		cursor: pointer;
		color: #9ca3af;
		border-radius: 50%;
		transition: color 0.15s;
		flex-shrink: 0;
	}

	.info-btn:hover,
	.info-btn:focus {
		color: #2563eb;
		outline: none;
	}
</style>
