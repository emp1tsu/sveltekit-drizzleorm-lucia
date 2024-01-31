import { type ServerLoadEvent } from '@sveltejs/kit';

export const load = async (event: ServerLoadEvent) => {
	const session = await event.locals.auth.validate();

	return {
		session
	};
};
