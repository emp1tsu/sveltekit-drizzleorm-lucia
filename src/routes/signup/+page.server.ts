import { redirect, type Actions, fail } from '@sveltejs/kit';
import { auth } from '$lib/server/lucia';
import type { PageServerLoad } from './$types';
import { z } from 'zod';
import { superValidate } from 'sveltekit-superforms/server';

const signupSchema = z.object({
	username: z.string().min(3).max(20),
	password: z.string().min(6).max(100)
});

export const load = (async ({ locals }) => {
	const session = await locals.auth.validate();

	if (!session) return {};

	redirect(303, '/');
}) satisfies PageServerLoad;

export const actions = {
	register: async ({ request }) => {
		const form = await superValidate(request, signupSchema);

		if (!form.valid)
			return fail(400, {
				form
			});

		try {
			const user = await auth.createUser({
				key: {
					providerId: 'username',
					providerUserId: form.data.username,
					password: form.data.password
				},
				attributes: {
					username: form.data.username
				}
			});
			console.log('user created', { user });
		} catch (error) {
			console.error(error);
			return fail(400);
		}
		redirect(303, '/login');
	}
} satisfies Actions;
