
async function getDataArray(arrayName) {
    try {
        const response = await fetch('data.json');
        const data = await response.json();
        if (!data[arrayName]) {
            console.error(`No ${arrayName} found in data.json`);
            return [];
        }
        return data[arrayName];
    } catch (error) {
        console.error('Error fetching data.json:', error);
        return [];
    }
}

async function getIcon(iconName) {
    try {
        const response = await fetch('icons.json');
        const icons = await response.json();
        return icons[iconName] || '';
    } catch (error) {
        console.error('Error fetching icons.json:', error);
        return '';
    }
}

async function fillContentSection(arrayName, sectionId, itemType) {
    const items = await getDataArray(arrayName);
    const section = document.getElementById(sectionId);
    if (!section) {
        console.error(`No element with id "${sectionId}" found.`);
        return;
    }
    section.innerHTML = '';
    items.forEach(async item => {
        const itemElem = document.createElement('div');
        itemElem.classList.add('secondary-container', `${itemType}`);
        let techList = '';

        if (Array.isArray(item.technologies)) {
            techList = `<div class="technologies">
                <div class="technology">
                ${item.technologies.join('</div><div class="technology">')}
                </div>
            </div>`;
        }
        itemElem.innerHTML = `
            <h2 class="title">${item.title}</h2>
            <div class="description">${item.description || ''}</div>
            ${item.link ? `<a class="${itemType}-link github-link" href="${item.link}" target="_blank">View</a>` : ''}
            ${techList}
        `;
        section.appendChild(itemElem);
    });
}


document.addEventListener('DOMContentLoaded', async () => {
    console.log('Script loaded and DOM is ready.');

    fillContentSection('projects', 'projects-content', 'project');
    
});