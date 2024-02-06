import { auth } from '$lib/server/lucia';
import { redirect, type Actions, type ServerLoadEvent, fail } from '@sveltejs/kit';

export const load = async (event: ServerLoadEvent) => {
	const session = await event.locals.auth.validate();

	return {
		session
	};
};

export const actions = {
	logout: async ({ locals }) => {
		const session = await locals.auth.validate();

		if (!session) return fail(401);

		await auth.invalidateSession(session.sessionId);
		locals.auth.setSession(null);

		redirect(303, '/login');
	}
} satisfies Actions;
