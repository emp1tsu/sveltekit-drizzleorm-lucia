<script lang="ts">
	import 'tailwindcss/tailwind.css';
	import Navbar from '../lib/components/Navbar.svelte';

	export let data;
</script>

{#if data.session?.user}
	<Navbar />
{/if}
<main class="px-12">
	<slot />
</main>
