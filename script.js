
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

async function fillContentSection(arrayName, sectionId, itemType) {
    const items = await getDataArray(arrayName);
    const section = document.getElementById(sectionId);
    if (!section) {
        console.error(`No element with id "${sectionId}" found.`);
        return;
    }
    section.innerHTML = '';
    items.forEach(item => {
        const itemElem = document.createElement('div');
        itemElem.className = itemType;
        let techList = '';
        if (Array.isArray(item.technologies)) {
            techList = `<div class="${itemType}-info">${item.technologies.join(', ')}</div>`;
        }
        itemElem.innerHTML = `
            <div class="${itemType}-title">${item.title}</div>
            <div class="${itemType}-description">${item.description || ''}</div>
            ${techList}
            ${item.link ? `<a class="${itemType}-link" href="${item.link}" target="_blank">View Project</a>` : ''}
        `;
        section.appendChild(itemElem);
    });
}


document.addEventListener('DOMContentLoaded', async () => {
    console.log('Script loaded and DOM is ready.');

    fillContentSection('projects', 'projects-content', 'project');
    
});