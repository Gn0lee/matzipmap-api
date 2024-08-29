import { Router, Request, Response } from 'express';
import puppeteer from 'puppeteer';
import * as cheerio from 'cheerio';
import { SupabaseClient } from '@supabase/supabase-js';
import locateChrome from 'locate-chrome';

import createClient from '@/lib/supabase';

const router = Router();

interface PlaceInfo {
	main_photo_url: string;
	score: number;
	score_count: number;
	id: number;
}

const isCacheDataValid = (updatedAt: string): boolean => {
	const updatedDate = new Date(updatedAt);
	const currentTime = new Date();
	const timeDifference = currentTime.getTime() - updatedDate.getTime();
	const oneDayInMilliseconds = 24 * 60 * 60 * 1000;
	return timeDifference < oneDayInMilliseconds;
};

const extractFnameOrReturnOriginal = (url: string): string => {
	try {
		if (!/^https?:\/\//i.test(url)) {
			url = 'https:' + url;
		}
		const urlObj = new URL(url);
		const fname = urlObj.searchParams.get('fname');
		return fname ? decodeURIComponent(fname) : url;
	} catch (error) {
		console.error('Invalid URL:', error);
		return url;
	}
};

const getCachedPlaceInfo = async (supabase: SupabaseClient, id: string): Promise<PlaceInfo | null> => {
	const { data, error } = await supabase
		.from('place-info')
		.select('id, created_at, updated_at, main_photo_url, score, score_count')
		.eq('id', id);

	if (error) {
		console.error('Error fetching cached data:', error);
		return null;
	}

	if (data[0] && isCacheDataValid(data[0].updated_at)) {
		return {
			main_photo_url: data[0].main_photo_url,
			score: data[0].score,
			score_count: data[0].score_count,
			id: Number(data[0].id),
		};
	}

	return null;
};

const crawlPlaceInfo = async (id: string): Promise<PlaceInfo> => {
	const executablePath: string = (await new Promise(resolve => locateChrome((arg: any) => resolve(arg)))) || '';

	const browser = await puppeteer.launch({
		executablePath,
		args: ['--no-sandbox', '--disable-setuid-sandbox'],
	});

	try {
		const page = await browser.newPage();

		const kakaoMapUrl = `https://place.map.kakao.com/m/${id}`;

		await page.goto(kakaoMapUrl);

		await page.waitForSelector('span[data-score]', { timeout: 60000 });
		await page.waitForSelector('span[data-comntcnt]', { timeout: 60000 });

		const content = await page.content();
		const $ = cheerio.load(content);

		const basicInfoTopImageTag = $('a[data-viewid="basicInfoTopImage"]');
		const style = basicInfoTopImageTag.attr('style');
		const mainPhotoKakaoCdnUrl = style?.match(/url\(["']?([^"']+)["']?\)/)?.[1];
		const mainPhotoUrl = mainPhotoKakaoCdnUrl ? extractFnameOrReturnOriginal(mainPhotoKakaoCdnUrl) : '';

		const score = Number($('span[data-score]').text());
		const scoreCount = Number($('span[data-comntcnt]').text());

		return { main_photo_url: mainPhotoUrl, score, score_count: scoreCount, id: Number(id) };
	} finally {
		await browser.close();
	}
};

const updateCachedPlaceInfo = async (supabase: SupabaseClient, placeInfo: PlaceInfo): Promise<void> => {
	const { error } = await supabase.from('place-info').upsert({
		id: placeInfo.id,
		main_photo_url: placeInfo.main_photo_url,
		score: placeInfo.score,
		score_count: placeInfo.score_count,
		updated_at: new Date(),
	});

	if (error) {
		console.error('Error updating cached data:', error);
	}
};

router.get('/:id', async (req: Request, res: Response) => {
	const { id } = req.params;

	try {
		const supabase = createClient({ req, res });

		let placeInfo = await getCachedPlaceInfo(supabase, id);

		if (!placeInfo) {
			placeInfo = await crawlPlaceInfo(id);
			await updateCachedPlaceInfo(supabase, placeInfo);
		}

		res.status(200).json({ data: placeInfo });
	} catch (error) {
		console.error(error);
		res.status(200).json({ data: { main_photo_url: '', score: 0, score_count: 0, id: Number(id) } });
	}
});

export default router;
