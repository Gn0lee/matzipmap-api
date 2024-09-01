import { Router, Request, Response } from 'express';
import createClient from '@/lib/supabase';

const router = Router();

router.get('/kakao/callback', async (req: Request, res: Response) => {
	const supabase = createClient({ req, res });

	const { code } = req.query;

	if (typeof code !== 'string') {
		return res.status(400).json({ message: 'Invalid code' });
	}

	const { error } = await supabase.auth.exchangeCodeForSession(code);

	if (error) {
		return res.status(500).json({ message: error.message });
	}

	return res.status(200).json({ message: 'success' });
});

router.get('/logout', async (req: Request, res: Response) => {
	const supabase = createClient({ req, res });

	const { error } = await supabase.auth.signOut();

	if (error) {
		return res.status(500).json({ message: error.message });
	}

	return res.status(200).json({ message: 'success' });
});

export default router;
