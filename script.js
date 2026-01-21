// Load content when DOM is fully loaded
document.addEventListener('DOMContentLoaded', async () => {
    console.log('Script loaded and DOM is ready.');

    loadProgrammingLanguagesSection('programming-languages', 'pl-content');
    loadFrameworksSection('frameworks', 'fw-content');
    
    loadProjectSection('projects', 'projects-content');
    loadIcons();
    
});

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

async function loadIcons() {
    try {
        const response = await fetch('icons/icon-links.json');
        const icons = await response.json();
        const iconSet = icons['svg-icons'] || {};
        for (const iconName in iconSet) {
            console.log(`Setting icon for: ${iconName}`);
            const elements = document.getElementsByClassName(`${iconName}-icon`);
            for (const elem of elements) {
                elem.src = iconSet[iconName];
            }
        }
        // Additionally, set src for all .pl-icon elements based on their class
        const plIcons = document.getElementsByClassName('pl-icon');
        for (const elem of plIcons) {
            for (const cls of elem.classList) {
                if (cls.endsWith('-icon') && cls !== 'pl-icon') {
                    const lang = cls.replace('-icon', '');
                    if (iconSet[lang]) {
                        elem.src = iconSet[lang];
                    } else {
                        elem.src = '';
                    }
                }
            }
        }
    } catch (error) {
        console.error('Error loading icons:', error);
    }
}

async function getIcon(iconName) {
    console.log(`Fetching icon for: ${iconName}`);
    try {
        const response = await fetch('icons/icon-links.json');
        const icons = await response.json();
        // Adjust for nested structure under "social-platforms"
        if (icons[iconName]) {
            return icons[iconName];
        }
            const iconSet = icons['svg-icons'] || {};
            if (iconSet[iconName]) {
                return iconSet[iconName];
            }
            // Try lowercased version for flexibility
            if (iconSet[iconName.toLowerCase()]) {
                return iconSet[iconName.toLowerCase()];
            }
            return '';
    } catch (error) {
        console.error('Error fetching icons/icon-links.json:', error);
        return '';
    }
}

async function loadProjectSection(arrayName, sectionId,) {
    const projects = await getDataArray(arrayName);
    const section = document.getElementById(sectionId);
    if (!section) {
        console.error(`No element with id "${sectionId}" found.`);
        return;
    }
    section.innerHTML = '';
    projects.forEach(async project => {
        const itemElem = document.createElement('div');
        itemElem.classList.add('secondary-container', `project`);
        if (Array.isArray(project.technologies)) {
            for (const [index, tech] of project.technologies.entries()) {
                icon = await getIcon(tech.toLowerCase());
                project.technologies[index] = `<div class="technology prog-lang">
                                                    <img class="pl-icon ${tech.toLowerCase()}-icon" src=${icon} alt="${tech} icon"/>
                                                    <h2 class="tech-name">${tech}</h2>
                                                </div>`;
            }
        }

        itemElem.innerHTML = `
            <h2 class="title">${project.title}</h2>
            <div class="description">${project.description || ''}</div>
            ${project.link ? `<a class="project-link github-link" href="${project.link}" target="_blank"><h2>View</h2></a>` : ''}
            <div class="technologies">
            ${project.technologies ? project.technologies.join('') : ''}
            </div>
        `;
        section.appendChild(itemElem);
    });
}

async function loadProgrammingLanguagesSection(arrayName, sectionId) {
    const languages = await getDataArray(arrayName);
    const section = document.getElementById(sectionId);
    if (!section) {
        console.error(`No element with id "${sectionId}" found.`);
        return;
    }
    section.innerHTML = '';
    languages.forEach(async language => {
        const itemElem = document.createElement('div');
        itemElem.classList.add(`prog-lang`, `technology`);
        icon = await getIcon(language.toLowerCase());
        itemElem.innerHTML = `
            <img class="pl-icon ${language.toLowerCase()}-icon" src="${icon}" alt="${language} icon"/>
            <h2 class="title">${language}</h2>
        `;
        section.appendChild(itemElem);
    });
}

async function loadFrameworksSection(arrayName, sectionId) {
    const frameworks = await getDataArray(arrayName);
    const section = document.getElementById(sectionId);
    if (!section) {
        console.error(`No element with id "${sectionId}" found.`);
        return;
    }
    section.innerHTML = '';
    frameworks.forEach(async framework => {
        const itemElem = document.createElement('div');
        itemElem.classList.add(`framework`, `technology`);
        icon = await getIcon(framework.toLowerCase());
        itemElem.innerHTML = `
            <img class="fw-icon ${framework.toLowerCase()}-icon" src="${icon}" alt="${framework} icon"/>
            <h2 class="title">${framework}</h2>
        `;
        section.appendChild(itemElem);
    });
}

async function loadTechnologies (techArray, containerId) {
    const container = document.getElementById(containerId);
    if (!container) {
        console.error(`No element with id "${containerId}" found.`);
        return;
    }
    container.innerHTML = '';
    techArray.forEach(async tech => {
        const itemElem = document.createElement('div');
        itemElem.classList.add('technology');
        itemElem.innerHTML = `
            <img class="tech-icon ${tech.toLowerCase()}-icon" src="" alt="${tech} icon"/>
            <h2 class="title">${tech}</h2>
        `;
        container.appendChild(itemElem);
    });
}