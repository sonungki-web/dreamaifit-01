const traits = [
    ["추진력 있는", "주도적인", "도전적인", "결단력 있는", "통솔력 있는", "카리스마 있는"],
    ["평화로운", "여유로운", "안정적인", "주변에 공평한", "안내심 강한", "감동을 조정하는"],
    ["규칙 잘 지키는", "모범적인", "정확한", "책임감 있는", "의무를 다하는", "기본에 충실한"],
    ["정이 많은", "관계 지향적인", "청찬을 잘하는", "배려심 있는", "도움을 잘 주는", "친절한"],
    ["성공을 중시하는", "목표 지향적", "기회를 놓치지 않는", "효율적인", "설득력 있는", "경쟁을 즐기는"],
    ["특별함을 가진", "창조적인", "자유로운", "자연스러운", "개성 있는", "감성적인"],
    ["통찰력 있는", "분석적인", "집중력 있는", "수집, 정리 잘하는", "독립적인", "꾸준히 관찰하는"],
    ["신중한", "안전을 중시하는", "거듭 확인하는", "절제, 조절하는", "성실한", "신뢰받는"],
    ["재미있는", "활발한", "호기심 강한", "창의적인", "유쾌한", "다재다능한"]
];

const animals = [
    "호랑이", "코끼리", "소", "강아지", "독수리", 
    "공작새", "부엉이", "사슴", "원숭이"
];

let selectedButtons = new Set();
let rowCounts = Array(9).fill(0);

// 테이블 생성
function createTable() {
    const tbody = document.getElementById('traitTableBody');
    traits.forEach((row, rowIndex) => {
        const tr = document.createElement('tr');
        
        // 번호 셀
        const numberCell = document.createElement('td');
        numberCell.className = 'row-number';
        numberCell.textContent = `${rowIndex + 1}번`;
        tr.appendChild(numberCell);
        
        // 특성 버튼들
        row.forEach((trait, colIndex) => {
            const td = document.createElement('td');
            td.className = 'trait-cell';
            
            const button = document.createElement('button');
            button.className = 'trait-button';
            button.textContent = trait;
            button.setAttribute('data-row', rowIndex + 1);
            button.onclick = () => handleClick(rowIndex, colIndex);
            
            td.appendChild(button);
            tr.appendChild(td);
        });
        
        tbody.appendChild(tr);
    });
}

// 버튼 클릭 처리
function handleClick(rowIndex, colIndex) {
    const buttonId = `${rowIndex}-${colIndex}`;
    const button = document.querySelector(`#traitTableBody tr:nth-child(${rowIndex + 1}) td:nth-child(${colIndex + 2}) button`);
    
    if (selectedButtons.has(buttonId)) {
        selectedButtons.delete(buttonId);
        rowCounts[rowIndex]--;
        button.classList.remove('selected');
    } else {
        selectedButtons.add(buttonId);
        rowCounts[rowIndex]++;
        button.classList.add('selected');
    }
    
    // 결과가 보이는 상태라면 업데이트
    const resultSection = document.getElementById('resultSection');
    if (resultSection.style.display === 'block') {
        updateResults();
    }
}

// 결과 업데이트
function updateResults() {
    const resultBars = document.getElementById('resultBars');
    resultBars.innerHTML = '';
    
    rowCounts.forEach((count, index) => {
        const container = document.createElement('div');
        container.className = 'result-bar-container';
        
        const label = document.createElement('span');
        label.className = 'result-bar-label';
        label.textContent = `${animals[index]}형:`;
        
        const barOuter = document.createElement('div');
        barOuter.className = 'result-bar-outer';
        
        const barInner = document.createElement('div');
        barInner.className = 'result-bar-inner';
        barInner.style.width = '0';  // 초기 너비를 0으로 설정
        
        const countText = document.createElement('span');
        countText.className = 'result-bar-count';
        countText.textContent = `${count}개`;
        
        barOuter.appendChild(barInner);
        container.appendChild(label);
        container.appendChild(barOuter);
        container.appendChild(countText);
        resultBars.appendChild(container);
        
        // 애니메이션 효과를 위해 setTimeout 사용
        setTimeout(() => {
            barInner.style.width = `${(count / 6) * 100}%`;
        }, 50);
    });
    
    updateFinalResult();
}

// 최종 결과 업데이트
function updateFinalResult() {
    const maxCount = Math.max(...rowCounts);
    if (maxCount === 0) return;
    
    const dominantTypes = rowCounts
        .map((count, index) => count === maxCount ? animals[index] : null)
        .filter(animal => animal !== null)
        .join(' 또는 ');
    
    document.getElementById('finalResult').textContent = 
        `당신의 주요 성향은 ${dominantTypes}형입니다.`;
}

// 결과 보기 버튼 이벤트 리스너
document.addEventListener('DOMContentLoaded', function() {
    createTable();  // 기존 테이블 생성
    
    const showResultButton = document.getElementById('showResultButton');
    const resultSection = document.getElementById('resultSection');
    
    showResultButton.addEventListener('click', function() {
        const totalSelected = rowCounts.reduce((sum, count) => sum + count, 0);
        
        if (totalSelected === 0) {
            alert('하나 이상의 특성을 선택해주세요.');
            return;
        }
        
        // 결과 섹션 표시
        resultSection.style.display = 'block';
        
        // 애니메이션을 위한 지연
        setTimeout(() => {
            resultSection.classList.add('visible');
        }, 50);
        
        updateResults();
        
        // 부드러운 스크롤
        resultSection.scrollIntoView({ 
            behavior: 'smooth',
            block: 'start'
        });
    });
});

// 버튼 클릭 효과 추가
function addClickEffect(button) {
    button.addEventListener('click', function(e) {
        const rect = button.getBoundingClientRect();
        const ripple = document.createElement('div');
        ripple.className = 'ripple';
        ripple.style.left = `${e.clientX - rect.left}px`;
        ripple.style.top = `${e.clientY - rect.top}px`;
        button.appendChild(ripple);
        
        setTimeout(() => {
            ripple.remove();
        }, 600);
    });
} 