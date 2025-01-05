const traits = [
    ["추진력 있는", "주도적인", "도전적인", "결단력 있는", "통솔력 있는", "카리스마 있는"],
    ["평화로운", "여유로운", "안정적인", "주변에 공평한", "인내심 강한", "감정을 조절하는"],
    ["규칙 잘 지키는", "모범적인", "정확한", "책임감 있는", "의무를 다하는", "기본에 충실한"],
    ["정이 많은", "관계 지향적인", "청찬을 잘하는", "배려심 있는", "도움을 잘 주는", "친절한"],
    ["성공을 중시하는", "목표 지향적", "기회를 놓치지 않는", "효율적인", "설득력 있는", "경쟁을 즐기는"],
    ["특별함을 가진", "창조적인", "자유로운", "자연스러운", "개성 있는", "감성적인"],
    ["통찰력 있는", "분석적인", "집중력 있는", "수집, 정리 잘하는", "독립적인", "꾸준히 관찰하는"],
    ["신중한", "안전을 중시하는", "거듭 확인하는", "절제, 조절하는", "성실한", "신뢰받는"],
    ["재미있는", "활발한", "호기심 강한", "창의적인", "유쾌한", "다재다능한"]
];

const animals = [
    "tiger", "elephant", "cow", "dog", "eagle", 
    "peacock", "owl", "deer", "monkey"
];

const animalNamesKo = [
    "호랑이", "코끼리", "소", "강아지", "독수리", 
    "공작새", "부엉이", "사슴", "원숭이"
];

let selectedButtons = new Set();
let rowCounts = Array(9).fill(0);

function createTable() {
    const tbody = document.getElementById('traitTableBody');
    traits.forEach((row, rowIndex) => {
        const tr = document.createElement('tr');
        
        const numberCell = document.createElement('td');
        numberCell.className = 'row-number';
        numberCell.textContent = `${rowIndex + 1}번`;
        tr.appendChild(numberCell);
        
        row.forEach((trait, colIndex) => {
            const td = document.createElement('td');
            td.className = 'trait-cell';
            
            const button = document.createElement('button');
            button.className = 'trait-button';
            button.setAttribute('data-row', rowIndex + 1);
            button.textContent = trait;
            button.onclick = () => handleClick(rowIndex, colIndex);
            
            td.appendChild(button);
            tr.appendChild(td);
        });
        
        tbody.appendChild(tr);
    });
}

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
}

function createButtons() {
    const existingContainer = document.querySelector('.button-container');
    if (existingContainer) {
        existingContainer.remove();
    }
    
    const buttonContainer = document.createElement('div');
    buttonContainer.className = 'button-container';
    
    const clearButton = document.createElement('button');
    clearButton.className = 'clear-button';
    clearButton.textContent = 'CLEAR';
    clearButton.onclick = clearSelection;
    
    const resultButton = document.createElement('button');
    resultButton.className = 'result-button';
    resultButton.id = 'showResultButton';
    resultButton.textContent = '결과 보기';
    
    buttonContainer.appendChild(clearButton);
    buttonContainer.appendChild(resultButton);
    
    const table = document.querySelector('.trait-table');
    table.after(buttonContainer);
    
    resultButton.addEventListener('click', function() {
        const totalSelected = rowCounts.reduce((sum, count) => sum + count, 0);
        
        if (totalSelected === 0) {
            alert('하나 이상의 특성을 선택해주세요.');
            return;
        }
        
        const resultSection = document.getElementById('resultSection');
        resultSection.style.display = 'block';
        updateResults();
        
        resultSection.scrollIntoView({ block: 'nearest' });
    });
}

function clearSelection() {
    window.location.reload();
}

document.addEventListener('DOMContentLoaded', function() {
    createTable();
    createButtons();
});

function updateResults() {
    const resultBars = document.getElementById('resultBars');
    resultBars.innerHTML = '';
    
    rowCounts.forEach((count, index) => {
        const container = document.createElement('div');
        container.className = 'result-bar-container';
        
        const label = document.createElement('span');
        label.className = 'result-bar-label';
        label.textContent = `${animalNamesKo[index]}형:`;
        
        const barOuter = document.createElement('div');
        barOuter.className = 'result-bar-outer';
        
        const barInner = document.createElement('div');
        barInner.className = 'result-bar-inner';
        barInner.style.width = `${(count / 6) * 100}%`;
        
        const countText = document.createElement('span');
        countText.className = 'result-bar-count';
        countText.textContent = `${count}개`;
        
        barOuter.appendChild(barInner);
        container.appendChild(label);
        container.appendChild(barOuter);
        container.appendChild(countText);
        resultBars.appendChild(container);
    });
    
    const resultSection = document.getElementById('resultSection');
    
    const existingImageSection = document.querySelector('.result-image-section');
    if (existingImageSection) {
        existingImageSection.remove();
    }
    
    const maxCount = Math.max(...rowCounts);
    if (maxCount === 0) return;
    
    const dominantIndex = rowCounts.findIndex(count => count === maxCount);
    
    const imageSection = document.createElement('div');
    imageSection.className = 'result-image-section';
    
    const imageTitle = document.createElement('div');
    imageTitle.className = 'result-image-title';
    imageTitle.textContent = `당신은 ${animalNamesKo[dominantIndex]}형입니다`;
    
    const imageContainer = document.createElement('div');
    imageContainer.className = 'result-image-container';
    
    const image = document.createElement('img');
    image.className = 'result-image';
    image.src = `/assets/images/animals/${animals[dominantIndex]}.png`;
    image.alt = animalNamesKo[dominantIndex];
    
    image.onerror = function() {
        console.log('이미지 로드 실패:', this.src);
        this.src = '/assets/images/animals/default.png';
        imageContainer.innerHTML = `
            <div style="padding: 2rem; text-align: center; color: #666;">
                <p>${animalNamesKo[dominantIndex]}의 이미지를 준비중입니다.</p>
            </div>
        `;
    };
    
    imageContainer.appendChild(image);
    imageSection.appendChild(imageTitle);
    imageSection.appendChild(imageContainer);
    resultSection.appendChild(imageSection);
    
    updateFinalResult();
}

function updateFinalResult() {
    const dominantTypes = rowCounts
        .map((count, index) => count === maxCount ? animalNamesKo[index] : null)
        .filter(animal => animal !== null)
        .join(' 또는 ');
    
    document.getElementById('finalResult').textContent = 
        `당신의 주요 성향은 ${dominantTypes}형입니다.`;
} 