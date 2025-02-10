const express = require('express');
const router = express.Router();
const { GoogleGenerativeAI } = require("@google/generative-ai");

// API 키 확인
if (!process.env.GEMINI_API_KEY) {
    console.error('GEMINI_API_KEY가 설정되지 않았습니다.');
    process.exit(1);
}

// Gemini API 초기화
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

router.post('/', async (req, res) => {
    try {
        const { traits } = req.body;
        
        if (!traits || !Array.isArray(traits) || traits.length === 0) {
            return res.status(400).json({
                success: false,
                error: '올바른 특성 목록을 전달해주세요.'
            });
        }

        // 캐릭터 설명 생성
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });
        const characterPrompt = `다음 성격 특성을 가진 캐릭터를 만들어주세요: ${traits.join(', ')}
        캐릭터의 이름, 나이, 직업, 외모, 취미와 함께 100자 이내로 설명해주세요.`;

        // 학과 추천 생성
        const majorPrompt = `다음 성격 특성을 가진 사람에게 어울리는 대학 학과를 5개 추천하고, 
        각 학과가 이 성격 특성과 어떻게 잘 맞는지 짧게 설명해주세요: ${traits.join(', ')}`;

        // 직업 추천 생성
        const careerPrompt = `다음 성격 특성을 가진 사람에게 어울리는 직업을 5개 추천하고,
        각 직업이 이 성격 특성과 어떻게 잘 맞는지 짧게 설명해주세요: ${traits.join(', ')}`;

        // 병렬로 모든 생성 요청 처리
        const [characterResult, majorResult, careerResult] = await Promise.all([
            model.generateContent(characterPrompt),
            model.generateContent(majorPrompt),
            model.generateContent(careerPrompt)
        ]);

        const description = characterResult.response.text();
        const majorRecommendations = majorResult.response.text();
        const careerRecommendations = careerResult.response.text();

        return res.json({
            success: true,
            description: description,
            majorRecommendations: majorRecommendations,
            careerRecommendations: careerRecommendations,
            imageUrl: "https://via.placeholder.com/300x300?text=Character" // 또는 Stable Diffusion API 사용
        });
    } catch (error) {
        console.error('Server error:', error);
        return res.status(500).json({
            success: false,
            error: '캐릭터 생성 중 오류가 발생했습니다.',
            details: error.message
        });
    }
});

module.exports = router;