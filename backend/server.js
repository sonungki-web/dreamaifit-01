const express = require('express');
const cors = require('cors');
const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 9090;

// CORS 설정을 더 구체적으로
app.use(cors({
    origin: ['http://127.0.0.1:5500', 'http://localhost:5500'], // Live Server 포트
    credentials: true,
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// OPTIONS 요청 처리
app.options('*', cors());

// JSON 파싱 용량 증가
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// 에러 핸들링 미들웨어
app.use((err, req, res, next) => {
    console.error('Server Error:', err);
    res.status(500).json({
        success: false,
        error: '서버 오류가 발생했습니다.',
        details: err.message
    });
});

// 상태 확인용 엔드포인트
app.get('/health', (req, res) => {
    res.json({ status: 'ok' });
});

// 기본 라우트 추가
app.get('/', (req, res) => {
    res.json({ message: 'Server is running' });
});

// 캐릭터 라우터
const characterRouter = require('./routes/character');
app.use('/api/character', characterRouter);

// 서버 시작
app.listen(PORT, '0.0.0.0', () => {
    console.log(`서버가 포트 ${PORT}에서 실행 중입니다.`);
    console.log(`http://localhost:${PORT} 에서 접속 가능합니다.`);
});