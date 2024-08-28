import express from 'express';
import dotenv from 'dotenv';
import placeRouter from 'src/routes/place';
import oauthRouter from 'src/routes/oauth';
import cors from 'cors';
import cookieParser from 'cookie-parser';

dotenv.config();

const app = express();
const port = process.env.PORT || 8080;

// JSON 파싱 미들웨어
app.use(express.json());

app.use(cookieParser());

app.use(cors({
	origin: ['https://matzipmap.kro.kr', 'http://localhost:5173'],
	credentials: true,
}));

// 라우터 설정
app.use('/place-info', placeRouter);

app.use('/oauth', oauthRouter)

// 서버 시작
app.listen(port, () => {
	console.log(`Server is running on port ${port}`);
});
