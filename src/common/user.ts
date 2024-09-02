import createClient from '@/lib/supabase';
import { Request, Response } from 'express';

export async function getUser(req: Request, res: Response) {
	const supabase = createClient({ req, res });

	const { data, error } = await supabase.auth.getUser();
	return { data, error };
}
