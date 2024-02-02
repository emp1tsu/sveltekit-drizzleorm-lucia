<script lang="ts">
	import { applyAction, enhance } from '$app/forms';
	import type { SubmitFunction } from '@sveltejs/kit';

	let isLoadingSignIn = false;

	const handleSubmit: SubmitFunction = () => {
		isLoadingSignIn = true;

		return async ({ result }) => {
			console.log(result);
			if (result.type === 'failure') {
				isLoadingSignIn = false;
				return;
			}
			await applyAction(result);
		};
	};
</script>

<form
	class="bg-base-200 flex justify-center items-center flex-col max-w-sm mx-auto mt-20 py-6 rounded-lg"
	use:enhance={handleSubmit}
	action="?/register"
	method="post"
>
	<div class="form-control w-full max-w-xs">
		<!-- svelte-ignore a11y-label-has-associated-control -->
		<label class="label">
			<span class="label-text">Username</span>
		</label>
		<input
			type="text"
			autocomplete="off"
			placeholder="Username"
			class="input input-bordered w-full max-w-xs"
			name="username"
			required
		/>
	</div>

	<div class="form-control w-full max-w-xs">
		<!-- svelte-ignore a11y-label-has-associated-control -->
		<label class="label">
			<span class="label-text">Password</span>
		</label>
		<input
			type="text"
			autocomplete="off"
			placeholder="Password"
			class="input input-bordered w-full max-w-xs"
			name="password"
			required
		/>
	</div>

	<button class="btn mt-4 max-w-xs btn-primary" type="submit" disabled={isLoadingSignIn}>
		{#if isLoadingSignIn}
			<span class="loading loading-spinner loading-sm" />
		{:else}
			新規登録
		{/if}
	</button>
</form>
