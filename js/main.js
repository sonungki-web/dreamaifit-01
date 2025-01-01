document.addEventListener('DOMContentLoaded', function() {
    // 카드 클릭 이벤트 처리
    const cards = document.querySelectorAll('.card');
    
    cards.forEach(card => {
        card.addEventListener('click', function(e) {
            if (!e.target.matches('button')) {
                const button = this.querySelector('button');
                button.click();
            }
        });
    });
}); 