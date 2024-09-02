import { Router, Request, Response } from 'express';
import { getUser } from '@/common/user';

const router = Router();

router.get('/info', async (req: Request, res: Response) => {
	const { data, error } = await getUser(req, res);

	if (error) {
		return res.status(401).json({ message: error.message });
	}

	if (!data.user) {
		return res.status(401).json({ message: 'User not found' });
	}

	return res.status(200).json({
		data: {
			id: data.user.id,
			email: data.user.email,
			avatar_url: data.user.user_metadata.avatar_url || null,
			name: data.user.user_metadata.name || null,
			full_name: data.user.user_metadata.full_name || null,
			preferred_username: data.user.user_metadata.preferred_username || null,
		},
	});
});

export default router;
