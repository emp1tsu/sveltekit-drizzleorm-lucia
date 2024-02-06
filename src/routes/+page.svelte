<script lang="ts">
	import { applyAction, enhance } from '$app/forms';
	import { invalidateAll } from '$app/navigation';
	import type { SubmitFunction } from '@sveltejs/kit';

	export let data;

	let value = 'value';
	let isLoadingCreateTodo = false;

	const handleSubmit: SubmitFunction = () => {
		isLoadingCreateTodo = true;

		return async ({ result }) => {
			if (result.type === 'failure') {
				isLoadingCreateTodo = false;
				return;
			}
			isLoadingCreateTodo = false;
			invalidateAll();
			value = '';
			await applyAction(result);
		};
	};
</script>

<h1 class="text-5xl my-4 font-semibold">こんにちは。{data.user.username}さん</h1>
<h2>Welcome to SvelteKit</h2>

<form
	class="bg-base-200 flex justify-center items-center flex-col max-w-sm mx-auto mt-20 py-6 rounded-lg"
	use:enhance={handleSubmit}
	action="?/createTodo"
	method="post"
>
	<div class="form-control w-full max-w-xs">
		<input
			type="text"
			placeholder="create todo"
			class="input input-bordered w-full max-w-xs"
			bind:value
			name="name"
			required
		/>
	</div>

	<button class="btn mt-4 max-w-xs btn-primary" type="submit" disabled={isLoadingCreateTodo}>
		{#if isLoadingCreateTodo}
			<span class="loading loading-spinner loading-sm" />
		{:else}
			追加
		{/if}
	</button>
</form>

<ul>
	{#each data.todos as todo}
		<li>{todo.name}</li>
	{/each}
</ul>
