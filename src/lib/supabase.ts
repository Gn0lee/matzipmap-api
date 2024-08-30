import { createServerClient, parseCookieHeader, serializeCookieHeader } from '@supabase/ssr';
import { Request, Response } from 'express';

const createClient = ({ req, res }: { res: Response; req: Request }) =>
	createServerClient(process.env.SUPABASE_URL ?? '', process.env.SUPABASE_ANON_KEY ?? '', {
		cookies: {
			getAll() {
				console.log('getAll');
				console.log(req.headers.cookie ?? '');
				return parseCookieHeader(req.headers.cookie ?? '');
			},
			setAll(cookiesToSet) {
				cookiesToSet.forEach(({ name, value, options }) => {
					console.log('cookiesToSet');

					console.log(name, value, options);

					res.appendHeader('Set-Cookie', serializeCookieHeader(name, value, options));
				});
			},
		},
	});

export default createClient;
