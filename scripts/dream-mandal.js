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
        const cells = document.querySelectorAll('.cell');
        const filledCells = Array.from(cells).filter(cell => cell.textContent.trim() !== '').length;
        const totalCells = cells.length;
        const progress = Math.round((filledCells / totalCells) * 100);
        
        if (progressBar && progressText) {
            progressBar.style.width = `${progress}%`;
            progressText.textContent = `${progress}% 완성`;
        }
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

            // 4x4 셀에서 입력했을 경우 2x2 셀에도 내용 복사
            if (currentCell.classList.contains('source-cell')) {
                const linkedCell = document.querySelector('.linked-cell');
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
        const isTargetCell = row === 0 && col === 0;  // 1행 1열 셀 (0,0)
        
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
    const cells = document.querySelectorAll('.cell');
    cells.forEach(cell => {
        cell.textContent = '';
        cell.removeAttribute('data-content');
    });
    
    // 진행률 초기화
    updateProgress();
    alert('초기화가 완료되었습니다.');
} 