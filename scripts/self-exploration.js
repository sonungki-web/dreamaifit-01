function startJourney() {
    // 현재 페이지 URL에서 기본 경로 가져오기
    const basePath = window.location.pathname.substring(0, window.location.pathname.lastIndexOf('/') + 1);
    // 동물 에니어그램 페이지로 이동
    window.location.href = basePath + 'animal-test.html';
} 