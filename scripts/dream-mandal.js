document.addEventListener('DOMContentLoaded', function() {
    let currentCell = null;
    const mainGrid = document.querySelector('.main-grid');
    const popup = document.getElementById('inputPopup');
    const popupInput = document.getElementById('popupInput');
    const popupSave = document.getElementById('popupSave');
    const popupCancel = document.getElementById('popupCancel');
    const progressBar = document.querySelector('.progress');
    const progressText = document.querySelector('.progress-text');

    // 그리드 초기화
    initializeGrid();

    // 진행률 업데이트
    function updateProgress() {
        // 전체 셀 개수 구하기 (중앙 셀 제외)
        const totalCells = document.querySelectorAll('.cell').length - 1;
        
        // 내용이 입력된 셀 개수 구하기
        const filledCells = Array.from(document.querySelectorAll('.cell')).filter(cell => {
            if (cell.classList.contains('center-cell')) return false;
            const content = cell.getAttribute('data-content');
            return content && content.trim() !== '';
        }).length;
        
        // 진행률 계산 (소수점 첫째자리까지)
        const progressPercentage = Math.round((filledCells / totalCells) * 1000) / 10;
        
        // 진행바 업데이트
        const progressBar = document.querySelector('.progress');
        const progressText = document.querySelector('.progress-text');
        
        // 진행률에 따른 클래스 추가/제거
        if (progressPercentage === 0) {
            progressText.classList.add('empty');
        } else {
            progressText.classList.remove('empty');
        }
        
        // 진행바 너비와 텍스트 업데이트
        progressBar.style.width = `${progressPercentage}%`;
        progressText.textContent = `${progressPercentage}% 완성`;
    }

    // 그리드 생성
    function initializeGrid() {
        const mainGrid = document.querySelector('.main-grid');
        mainGrid.innerHTML = '';

        for (let i = 0; i < 9; i++) {
            for (let j = 0; j < 9; j++) {
                const cell = document.createElement('div');
                cell.className = 'cell';
                
                // 위치 데이터 추가
                cell.dataset.row = i;
                cell.dataset.col = j;
                
                // 중앙 (5,5)
                if (i === 4 && j === 4) {
                    cell.classList.add('center-cell');
                    cell.style.backgroundColor = 'var(--lime-pastel)';
                }
                
                // 2x2 위치
                if (i === 1 && j === 1) {
                    cell.classList.add('linked-cell');
                    cell.style.backgroundColor = 'var(--orange-pastel)';
                }
                
                // 4x4 위치
                if (i === 3 && j === 3) {
                    cell.classList.add('source-cell');
                    cell.style.backgroundColor = 'var(--orange-pastel)';
                }

                cell.addEventListener('click', () => openPopup(cell));
                mainGrid.appendChild(cell);
            }
        }
    }

    // 팝업 열기
    function openPopup(cell) {
        currentCell = cell;
        popup.style.display = 'flex';
        popupInput.value = cell.getAttribute('data-content') || '';
        updateCharCount();
    }

    // 팝업 닫기
    function closePopup() {
        popup.style.display = 'none';
        currentCell = null;
        popupInput.value = '';
    }

    // 문자 수 업데이트
    function updateCharCount() {
        const count = popupInput.value.length;
        document.getElementById('currentCount').textContent = count;
    }

    // 이벤트 리스너
    popupInput.addEventListener('input', updateCharCount);

    // 팝업 저장 버튼 클릭 시
    function handlePopupSave() {
        if (currentCell) {
            const content = document.getElementById('popupInput').value.trim();
            currentCell.textContent = content;
            currentCell.setAttribute('data-content', content);

            const row = parseInt(currentCell.dataset.row);
            const col = parseInt(currentCell.dataset.col);
            
            if ((row === 3 && col === 3) || (row === 3 && col === 4) || (row === 3 && col === 5)) {  // 4x4, 4x5, 4x6 위치
                let targetRow = 1;  // 모든 경우 2행으로
                let targetCol;
                
                if (col === 3) targetCol = 1;      // 4x4 → 2x2
                else if (col === 4) targetCol = 4;  // 4x5 → 2x5
                else if (col === 5) targetCol = 7;  // 4x6 → 2x8
                
                const linkedCell = document.querySelector(`.cell[data-row="${targetRow}"][data-col="${targetCol}"]`);
                if (linkedCell) {
                    linkedCell.textContent = content;
                    linkedCell.setAttribute('data-content', content);
                }
            } else if (row === 4 && (col === 1 || col === 3)) {  // 5x2 또는 5x4 위치
                const targetCol = col === 1 ? 3 : 1;  // 5x2 → 5x4 또는 5x4 → 5x2
                const linkedCell = document.querySelector(`.cell[data-row="4"][data-col="${targetCol}"]`);
                if (linkedCell) {
                    linkedCell.textContent = content;
                    linkedCell.setAttribute('data-content', content);
                }
            } else if (row === 4 && (col === 5 || col === 7)) {  // 5x6 또는 5x8 위치
                const targetCol = col === 5 ? 7 : 5;  // 5x6 → 5x8 또는 5x8 → 5x6
                const linkedCell = document.querySelector(`.cell[data-row="4"][data-col="${targetCol}"]`);
                if (linkedCell) {
                    linkedCell.textContent = content;
                    linkedCell.setAttribute('data-content', content);
                }
            } else if ((row === 5 && col === 3) || (row === 7 && col === 1)) {  // 6x4 또는 8x2 위치
                const targetRow = row === 5 ? 7 : 5;  // 6x4 → 8x2 또는 8x2 → 6x4
                const targetCol = row === 5 ? 1 : 3;  // 6x4 → 8x2 또는 8x2 → 6x4
                const linkedCell = document.querySelector(`.cell[data-row="${targetRow}"][data-col="${targetCol}"]`);
                if (linkedCell) {
                    linkedCell.textContent = content;
                    linkedCell.setAttribute('data-content', content);
                }
            } else if ((row === 5 && col === 4) || (row === 7 && col === 4)) {  // 6x5 또는 8x5 위치
                const targetRow = row === 5 ? 7 : 5;  // 6x5 → 8x5 또는 8x5 → 6x5
                const linkedCell = document.querySelector(`.cell[data-row="${targetRow}"][data-col="4"]`);
                if (linkedCell) {
                    linkedCell.textContent = content;
                    linkedCell.setAttribute('data-content', content);
                }
            } else if ((row === 5 && col === 5) || (row === 7 && col === 7)) {  // 6x6 또는 8x8 위치
                const targetRow = row === 5 ? 7 : 5;  // 6x6 → 8x8 또는 8x8 → 6x6
                const targetCol = row === 5 ? 7 : 5;  // 6x6 → 8x8 또는 8x8 → 6x6
                const linkedCell = document.querySelector(`.cell[data-row="${targetRow}"][data-col="${targetCol}"]`);
                if (linkedCell) {
                    linkedCell.textContent = content;
                    linkedCell.setAttribute('data-content', content);
                }
            }

            updateProgress();
            closePopup();
        }
    }

    // 팝업 이벤트 리스너
    document.getElementById('popupSave').addEventListener('click', handlePopupSave);
    document.getElementById('popupCancel').addEventListener('click', closePopup);

    

    
    
    document.head.appendChild(style);

    // 초기화 버튼 클릭 시 연동된 셀들도 함께 초기화
    document.getElementById('resetBtn').addEventListener('click', () => {
        if (confirm('정말 모든 내용을 초기화하시겠습니까?')) {
            resetMandal();
        }
    });

    // AI 검색
    document.getElementById('aiSearchBtn').addEventListener('click', () => {
        const input = document.getElementById('aiInput').value;
        if (input.trim()) {
            // AI 검색 로직 구현
            alert('AI 검색 기능은 준비 중입니다.');
        }
    });

    // PDF 저장 버튼
    const pdfButton = document.getElementById('pdfExport');
    if (pdfButton) {
        pdfButton.onclick = generatePDF;
    }
});

// PDF 생성 함수
function generatePDF() {
    const mainGrid = document.querySelector('.main-grid');
    if (!mainGrid) {
        alert('만다라트를 찾을 수 없습니다.');
        return;
    }

    // 원본 스타일 저장
    const originalStyle = mainGrid.style.cssText;
    const cells = mainGrid.querySelectorAll('.cell');
    const originalCellStyles = Array.from(cells).map(cell => cell.style.cssText);

    // PDF 생성을 위한 임시 스타일 적용
    mainGrid.style.cssText = `
        display: grid !important;
        grid-template-columns: repeat(9, 1fr) !important;
        gap: 2px !important;
        width: 190mm !important;
        aspect-ratio: 1 !important;
        background-color: white !important;
        border: 1px solid #ccc !important;
        margin: auto !important;
        padding: 2mm !important;
        box-sizing: border-box !important;
    `;

    // 소주제 셀 위치 배열
    const subThemeCells = [
        [4,4], [4,5], [4,6],
        [5,4], [5,5], [5,6],
        [6,4], [6,5], [6,6]
    ];

    // 각 셀에 임시 스타일 적용
    cells.forEach((cell, index) => {
        const row = Math.floor(index / 9);
        const col = index % 9;
        const isSubTheme = subThemeCells.some(([r, c]) => r === row && c === col);
        const isTargetCell = row === 0 && col === 0;  // 1행 1열 셀
        
        cell.style.cssText = `
            aspect-ratio: 1 !important;
            border: ${isSubTheme ? '2px' : '1px'} solid #999 !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            font-size: 11px !important;
            padding: 2px !important;
            margin: 0 !important;
            box-sizing: border-box !important;
            background-color: ${isTargetCell ? '#FFEB3B' : 'white'} !important;
            word-break: break-all !important;
            text-align: center !important;
            overflow: hidden !important;
            min-width: 0 !important;
            min-height: 0 !important;
            ${isSubTheme ? `
                box-shadow: 2px 2px 4px rgba(0,0,0,0.2) !important;
                transform: translateZ(2px) !important;
                font-weight: bold !important;
                border-radius: 2px !important;
                z-index: 1 !important;
            ` : ''}
        `;
    });

    // PDF 옵션
    const opt = {
        filename: '꿈만다라트.pdf',
        margin: 10,
        image: { type: 'jpeg', quality: 1.0 },
        html2canvas: { 
            scale: 2,
            useCORS: true,
            letterRendering: true,
            scrollX: 0,
            scrollY: 0,
            windowWidth: mainGrid.offsetWidth,
            windowHeight: mainGrid.offsetHeight,
            logging: true
        },
        jsPDF: { 
            unit: 'mm', 
            format: 'a4', 
            orientation: 'portrait',
            compress: true
        }
    };

    // PDF 생성
    html2pdf()
        .from(mainGrid)
        .set(opt)
        .save()
        .then(() => {
            // 원래 스타일로 복원
            mainGrid.style.cssText = originalStyle;
            cells.forEach((cell, index) => {
                cell.style.cssText = originalCellStyles[index];
            });
            alert('PDF 저장이 완료되었습니다.');
        })
        .catch(error => {
            // 오류 시 원래 스타일로 복원
            mainGrid.style.cssText = originalStyle;
            cells.forEach((cell, index) => {
                cell.style.cssText = originalCellStyles[index];
            });
            alert('PDF 생성 중 오류가 발생했습니다.');
            console.error('PDF 생성 오류:', error);
        });
}

// 초기화 함수
function resetMandal() {
    if (confirm('정말 초기화하시겠습니까?')) {
        // 모든 셀의 내용과 data-content 속성 제거 (중앙 셀 제외)
        const cells = document.querySelectorAll('.cell');
        cells.forEach(cell => {
            if (!cell.classList.contains('center-cell')) {
                cell.textContent = '';
                cell.removeAttribute('data-content');
            }
        });
        
        // 진행바 초기화
        const progressBar = document.querySelector('.progress');
        const progressText = document.querySelector('.progress-text');
        
        progressBar.style.width = '0%';
        progressText.textContent = '0% 완성';
        progressText.classList.add('empty');
        
        // 로컬 스토리지 데이터 초기화
        localStorage.removeItem('mandalData');
    }
}

// 페이지 로드 시 진행률 초기화
document.addEventListener('DOMContentLoaded', () => {
    updateProgress();
}); 