import type { Actions } from '@sveltejs/kit';
import { auth } from '$lib/server/lucia';
import { fail, redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { z } from 'zod';
import { superValidate } from 'sveltekit-superforms/server';

export const load = (async ({ locals }) => {
	const session = await locals.auth.validate();

	if (!session) {
		return {};
	}

	redirect(303, '/');
}) satisfies PageServerLoad;

const loginSchema = z.object({
	username: z.string().min(3).max(20),
	password: z.string().min(6).max(100)
});

export const actions = {
	login: async ({ request, locals }) => {
		const form = await superValidate(request, loginSchema);

		if (!form.valid) {
			return fail(400, {
				form
			});
		}
		try {
			const key = await auth.useKey('username', form.data.username, form.data.password);

			const session = await auth.createSession({
				userId: key.userId,
				attributes: {}
			});

			locals.auth.setSession(session);
		} catch (error) {
			console.error(error);
			return fail(400);
		}

		redirect(303, '/');
	}
} satisfies Actions;
