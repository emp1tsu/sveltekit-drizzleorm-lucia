import { fail, redirect } from '@sveltejs/kit';
import { auth } from '$lib/server/lucia';
import type { Actions, ServerLoadEvent } from '@sveltejs/kit';
import { z } from 'zod';
import { superValidate } from 'sveltekit-superforms/server';
import { db } from '$lib/db';
import { todo } from '$lib/db/schema';
import { eq } from 'drizzle-orm';

export const load = async ({ locals }: ServerLoadEvent) => {
	const session = await locals.auth.validate();
	if (!session) redirect(303, '/login');

	const todos = await db
		.select({ name: todo.name })
		.from(todo)
		.where(eq(todo.userId, session.user.userId))
		.orderBy(todo.createdAt, 'desc');

	return { todos, user: session.user };
};

const todoSchema = z.object({
	name: z.string().min(1).max(255)
});

export const actions = {
	createTodo: async ({ request, locals }) => {
		const form = await superValidate(request, todoSchema);

		if (!form.valid) {
			return fail(400, {
				form
			});
		}
		try {
			const session = await locals.auth.validate();
			if (!session) redirect(303, '/login');

			await db
				.insert(todo)
				.values({ id: crypto.randomUUID(), userId: session.user.userId, name: form.data.name });
		} catch (error) {
			console.error(error);
			return fail(400);
		}
	},
	logout: async ({ locals }) => {
		const session = await locals.auth.validate();

		if (!session) return fail(401);

		await auth.invalidateSession(session.sessionId);
		locals.auth.setSession(null);

		redirect(303, '/login');
	}
} satisfies Actions;
