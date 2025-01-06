document.addEventListener('DOMContentLoaded', function() {
    // 꿈만다라트 버튼 클릭 이벤트 추가
    const dreamMandalButton = document.querySelector('.card-button');
    if (dreamMandalButton) {
        dreamMandalButton.addEventListener('click', function() {
            window.location.href = 'dream-mandal.html';
        });
    }
}); 