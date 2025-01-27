class IndustryMap {
    constructor() {
        this.activeCategory = null;
        this.activeSubCategory = null;
        this.activeDetailCategory = null;
        this.init();
    }

    init() {
        const container = document.getElementById('industryMap');
        this.renderCategories(container);
    }

    renderCategories(container) {
        Object.keys(industryData).forEach(category => {
            const categoryDiv = this.createCategoryElement(category);
            container.appendChild(categoryDiv);
        });
    }

    createCategoryElement(category) {
        const div = document.createElement('div');
        div.className = 'category-container';

        const button = document.createElement('button');
        button.className = 'category-button';
        button.innerHTML = `${category} <span>${this.activeCategory === category ? '▼' : '▶'}</span>`;
        button.onclick = () => this.handleCategoryClick(category, div);

        div.appendChild(button);
        return div;
    }

    handleCategoryClick(category, categoryDiv) {
        if (this.activeCategory === category) {
            const content = categoryDiv.querySelector('.category-content');
            if (content) content.remove();
            this.activeCategory = null;
        } else {
            this.activeCategory = category;
            this.renderSubCategories(category, categoryDiv);
        }
        this.updateArrows();
    }

    renderSubCategories(category, categoryDiv) {
        const existingContent = categoryDiv.querySelector('.category-content');
        if (existingContent) existingContent.remove();

        const contentDiv = document.createElement('div');
        contentDiv.className = 'category-content';

        Object.keys(industryData[category]).forEach(subCategory => {
            const subCategoryDiv = this.createSubCategoryElement(category, subCategory);
            contentDiv.appendChild(subCategoryDiv);
        });

        categoryDiv.appendChild(contentDiv);
    }

    createSubCategoryElement(category, subCategory) {
        const div = document.createElement('div');
        div.className = 'subcategory-container';

        const button = document.createElement('button');
        button.className = 'subcategory-button';
        button.innerHTML = `${subCategory} <span>${this.activeSubCategory === subCategory ? '▼' : '▶'}</span>`;
        button.onclick = () => this.handleSubCategoryClick(category, subCategory, div);

        div.appendChild(button);
        return div;
    }

    handleSubCategoryClick(category, subCategory, subCategoryDiv) {
        if (this.activeSubCategory === subCategory) {
            const content = subCategoryDiv.querySelector('.subcategory-content');
            if (content) content.remove();
            this.activeSubCategory = null;
        } else {
            this.activeSubCategory = subCategory;
            this.renderDetailCategories(category, subCategory, subCategoryDiv);
        }
        this.updateArrows();
    }

    renderDetailCategories(category, subCategory, subCategoryDiv) {
        const existingContent = subCategoryDiv.querySelector('.subcategory-content');
        if (existingContent) existingContent.remove();

        const contentDiv = document.createElement('div');
        contentDiv.className = 'subcategory-content';

        Object.keys(industryData[category][subCategory]).forEach(detailCategory => {
            const detailCategoryDiv = this.createDetailCategoryElement(category, subCategory, detailCategory);
            contentDiv.appendChild(detailCategoryDiv);
        });

        subCategoryDiv.appendChild(contentDiv);
    }

    createDetailCategoryElement(category, subCategory, detailCategory) {
        const div = document.createElement('div');
        div.className = 'detail-category-container';

        const button = document.createElement('button');
        button.className = 'detail-category-button';
        button.innerHTML = `${detailCategory} <span>${this.activeDetailCategory === detailCategory ? '▼' : '▶'}</span>`;
        button.onclick = () => this.handleDetailCategoryClick(category, subCategory, detailCategory, div);

        div.appendChild(button);
        return div;
    }

    handleDetailCategoryClick(category, subCategory, detailCategory, detailCategoryDiv) {
        if (this.activeDetailCategory === detailCategory) {
            const content = detailCategoryDiv.querySelector('.company-grid');
            if (content) content.remove();
            this.activeDetailCategory = null;
        } else {
            this.activeDetailCategory = detailCategory;
            this.renderCompanies(category, subCategory, detailCategory, detailCategoryDiv);
        }
        this.updateArrows();
    }

    renderCompanies(category, subCategory, detailCategory, detailCategoryDiv) {
        const existingContent = detailCategoryDiv.querySelector('.company-grid');
        if (existingContent) existingContent.remove();

        const gridDiv = document.createElement('div');
        gridDiv.className = 'company-grid';

        const companies = industryData[category][subCategory][detailCategory];
        companies.forEach(company => {
            const button = document.createElement('button');
            button.className = 'company-button';
            button.textContent = company;
            gridDiv.appendChild(button);
        });

        detailCategoryDiv.appendChild(gridDiv);
    }

    updateArrows() {
        document.querySelectorAll('.category-button').forEach(button => {
            const category = button.textContent.split(' ')[0];
            button.querySelector('span').textContent = this.activeCategory === category ? '▼' : '▶';
        });

        document.querySelectorAll('.subcategory-button').forEach(button => {
            const subCategory = button.textContent.split(' ')[0];
            button.querySelector('span').textContent = this.activeSubCategory === subCategory ? '▼' : '▶';
        });

        document.querySelectorAll('.detail-category-button').forEach(button => {
            const detailCategory = button.textContent.split(' ')[0];
            button.querySelector('span').textContent = this.activeDetailCategory === detailCategory ? '▼' : '▶';
        });
    }
}

// Initialize the industry map when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new IndustryMap();
});
