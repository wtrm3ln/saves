let categories = [];
let items = [];
let activeFilters = new Set();

async function init() {
    const catRes = await fetch("categories.json");
    categories = await catRes.json();

    const itemsURL = "https://raw.githubusercontent.com/wtrm3ln/saves-data/main/items.json";

    const itemRes = await fetch(`${itemsURL}?t=${Date.now()}`);
    items = await itemRes.json();

    renderFilters();
    renderContent();
}


function renderFilters() {
    const container = document.querySelector(".tags-container");
    container.innerHTML = "";

    categories.forEach(category => {
        const button = document.createElement("div");
        button.classList.add("tag");
        button.dataset.id = category.id;

        button.innerHTML = `
            <img src="${category.icon}" class="tag-icon">
            <span>${category.name}</span>
        `;

        button.addEventListener("click", () => {
            toggleFilter(category.id, button);
        });

        container.appendChild(button);
    });
}

function toggleFilter(id, button) {
    const allButtons = document.querySelectorAll(".tag");

    // If clicking the already active one → reset view
    if (activeFilters.has(id)) {
        activeFilters.clear();
        allButtons.forEach(btn => btn.classList.remove("active"));
    } else {
        activeFilters.clear();
        allButtons.forEach(btn => btn.classList.remove("active"));

        activeFilters.add(id);
        button.classList.add("active");
    }

    renderContent();
}

function renderContent() {
    const container = document.querySelector(".main-content");
    container.innerHTML = "";

    const activeCategoryId = [...activeFilters][0];

    const categoriesToRender = activeCategoryId
        ? categories.filter(c => c.id === activeCategoryId)
        : categories;

    categoriesToRender.forEach(category => {
        const filteredItems = items.filter(item =>
            item.categories.includes(category.id)
        );

        if (filteredItems.length === 0) return;

        const categoryBlock = document.createElement("div");
        categoryBlock.classList.add("category");

        categoryBlock.innerHTML = `
            <div class="category">
                <div class="category-header">
                    <img src="${category.icon}" class="category-icon">
                    <span class="category-title">${category.name}</span>
                </div>
                <p class="category-description">${category.description}</p>
                <div class="items-container"></div>
            </div>
        `;

        const itemsContainer = categoryBlock.querySelector(".items-container");

        filteredItems.forEach(item => {
            const itemEl = document.createElement("div");
            itemEl.classList.add("item");

            const tagsHTML = item.categories.map(catId => {
                const cat = categories.find(c => c.id === catId);
                if (!cat) return "";

                return `
                    <span class="item-tag" data-id="${cat.id}">
                        ${cat.name}
                    </span>
                `;
            }).join("");

            itemEl.innerHTML = `
                <span class="item-title">${item.title}</span>
                <div class="item-details">
                    <a href="${item.url}" target="_blank">${item.url}</a>
                    <div class="item-tags">
                        ${tagsHTML}
                    </div>
                </div>
            `;

            itemsContainer.appendChild(itemEl);
        });

        container.appendChild(categoryBlock);
    });
}


init();