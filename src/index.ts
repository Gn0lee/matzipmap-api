import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';

import placeRouter from '@/routes/place';
import oauthRouter from '@/routes/oauth';
import userRouter from '@/routes/user';
import groupRouter from '@/routes/group';

dotenv.config();

const app = express();
const port = process.env.PORT || 8080;

// JSON 파싱 미들웨어
app.use(express.json());

app.use(cookieParser());

app.use(
	cors({
		origin: ['https://matzipmap.kro.kr', 'http://localhost:5173'],
		credentials: true,
	}),
);

// 라우터 설정
app.use('/place-info', placeRouter);

app.use('/oauth', oauthRouter);

app.use('/user', userRouter);

app.use('/group', groupRouter);

// 서버 시작
app.listen(port, () => {
	console.log(`Server is running on port ${port}`);
});
