import { Router, Request, Response } from 'express';
import createClient from '@/lib/supabase';
import { getUser } from '@/common/user';

const router = Router();

router.post('/', async (req: Request, res: Response) => {
	const supabase = createClient({ req, res });

	const {
		data: { user },
		error: userError,
	} = await getUser(req, res);

	if (userError) {
		return res.status(401).json({ message: userError.message });
	}

	if (!user) {
		return res.status(401).json({ message: 'User not found' });
	}

	const { name, description } = req.body;

	// 사용자의 그룹 가입 제한 확인
	const { data: limitData, error: limitError } = await supabase
		.from('user-membership-limits')
		.select('max_groups')
		.eq('user_id', user.id)
		.single();

	if (limitError) {
		return res.status(500).json({ error: 'Failed to check user limit' });
	}

	// 현재 사용자가 가입한 그룹 수 확인
	const { count, error: countError } = await supabase
		.from('user-group-memberships')
		.select('*', { count: 'exact' })
		.eq('user_id', user.id);

	if (countError) {
		return res.status(500).json({ error: 'Failed to count user groups' });
	}

	if (count && limitData && count >= (limitData?.max_groups ?? 0)) {
		return res.status(400).json({ error: 'User has reached the maximum number of groups' });
	}

	// 그룹 생성
	const { data, error } = await supabase.from('groups').insert({ name, description }).returns<{ id: string }>();

	if (error || !data) {
		return res.status(500).json({ error: 'Failed to create group' });
	}

	// 생성한 그룹에 사용자 추가
	const { error: memberError } = await supabase
		.from('user-group-memberships')
		.insert({ group_id: data.id, user_id: user.id, role: 'OWNER' });

	if (memberError) {
		return res.status(500).json({ error: 'Failed to add user to group' });
	}

	return res.status(200).json({ data });
});

router.get('/list', async (req: Request, res: Response) => {
	const supabase = createClient({ req, res });

	const {
		data: { user },
		error: userError,
	} = await getUser(req, res);

	if (userError) {
		return res.status(401).json({ message: userError.message });
	}

	if (!user) {
		return res.status(401).json({ message: 'User not found' });
	}

	const { data: memberships, error } = await supabase
		.from('user-group-memberships')
		.select(
			`
        group_id,
        groups:group_id (
          id,
          name,
          description
        )
      `,
		)
		.eq('user_id', user.id);

	if (error) {
		return res.status(401).json({ message: 'Fail Fetch Groups' });
	}

	// 결과 포맷팅
	const formattedGroups = memberships?.map(item => item.groups) || [];

	return res.status(200).json({
		message: 'success',
		data: formattedGroups,
	});
});

export default router;
