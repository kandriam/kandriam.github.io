// Load content when DOM is fully loaded
document.addEventListener('DOMContentLoaded', async () => {
    console.log('Script loaded and DOM is ready.');

    loadContactSection('contact');
    loadProgrammingLanguagesSection('programming-languages', 'pl-content');
    loadFrameworksSection('frameworks', 'fw-content');
    loadToolsSection('tools', 'tools-content');
    
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
            // console.log(`Setting icon for: ${iconName}`);
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
    // console.log(`Fetching icon for: ${iconName}`);
    try {
        const response = await fetch('icons/icon-links.json');
        const icons = await response.json();
        if (icons[iconName]) {
            return icons[iconName];
        }
            const iconSet = icons['svg-icons'] || {};
            if (iconSet[iconName]) {
                return iconSet[iconName];
            }
            if (iconSet[iconName.toLowerCase()]) {
                return iconSet[iconName.toLowerCase()];
            }
            return '';
    } catch (error) {
        console.error('Error fetching icons/icon-links.json:', error);
        return '';
    }
}

async function loadContactSection(arrayName) {
    const contacts = await getDataArray(arrayName);
    const section = document.getElementById('contact-content');
    if (!section) {
        console.error(`No element with id "contact-content" found.`);
        return;
    }
    section.innerHTML = '';
    contacts.forEach(async contact => {
        if (!(contact.type.toLowerCase() === 'phone')) {
            const itemElem = document.createElement('div');
            itemElem.classList.add('contact-item');
            const icon = await getIcon(contact.type.toLowerCase());
            itemElem.innerHTML = `
            <div class="contact" target="_blank">
                <img class="contact-icon ${contact.type.toLowerCase()}-icon" src="${icon}" alt="${contact.type} icon"/>
                <a class="contact-link" href="${contact.link}">${contact.text}</a>
            </div>
            `;
            section.appendChild(itemElem);
        }
    });
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
        itemElem.classList.add('secondary-container', 'project');
        if (Array.isArray(project.technologies)) {
            for (const [index, tech] of project.technologies.entries()) {
                icon = await getIcon(tech.toLowerCase());
                project.technologies[index] = `
                    <div class="technology prog-lang">
                        <img class="pl-icon ${tech.toLowerCase()}-icon" src=${icon} alt="${tech} icon"/>
                        <h3 class="tech-name">${tech}</h3>
                    </div>`;
            }
        }

        let photosContainer = null;
        let photosSection = null;
        let currentPhotoIndex = 0;
        let photoElems = [];
        if (Array.isArray(project.photos)) {
            photosContainer = document.createElement('div');
            photosContainer.classList.add('photos-container');
            for (const [i, photo] of project.photos.entries()) {
                const imgElem = document.createElement('img');
                imgElem.classList.add('project-photo');
                imgElem.src = photo;
                imgElem.alt = `${project.title} photo`;
                if (i !== 0) {
                    imgElem.classList.add('hidden');
                }
                photosContainer.appendChild(imgElem);
                photoElems.push(imgElem);
            }

            photosSection = document.createElement('div');
            photosSection.classList.add('photos-section');
            if (project.photos.length > 1) {
                const navContainer = document.createElement('div');
                navContainer.classList.add('photo-nav-container');

                const prevButton = document.createElement('button');
                prevButton.classList.add('photo-nav', 'prev-button');
                prevButton.textContent = 'Previous';

                const nextButton = document.createElement('button');
                nextButton.classList.add('photo-nav', 'next-button');
                nextButton.textContent = 'Next';

                navContainer.appendChild(prevButton);
                navContainer.appendChild(nextButton);
                photosSection.appendChild(navContainer);

                prevButton.addEventListener('click', () => {
                    photoElems[currentPhotoIndex].classList.add('hidden');
                    currentPhotoIndex = (currentPhotoIndex - 1 + photoElems.length) % photoElems.length;
                    photoElems[currentPhotoIndex].classList.remove('hidden');
                });
                nextButton.addEventListener('click', () => {
                    photoElems[currentPhotoIndex].classList.add('hidden');
                    currentPhotoIndex = (currentPhotoIndex + 1) % photoElems.length;
                    photoElems[currentPhotoIndex].classList.remove('hidden');
                });
            }
            photosSection.appendChild(photosContainer);
        }

        // Build project content
        const projectContent = document.createElement('div');
        projectContent.style.display = 'grid';
        projectContent.style.gridTemplateColumns = '1fr 1fr';
        projectContent.style.gap = '10px';

        const leftCol = document.createElement('div');
        leftCol.style.display = 'flex';
        leftCol.style.flexDirection = 'column';
        leftCol.innerHTML = `
            <div class="project-header">
                <h2 class="title">${project.title}</h2>
                <h3 class="role">${project.role || ''}</h3>
            </div>
            <div class="description">
                <p>${project.description || ''}</p>
            </div>
            <div class="technologies">
                ${project.technologies ? project.technologies.join('') : ''}
            </div>
            <div class="project-link-container">
                ${project.link ? `<a class="project-link github-link" href="${project.link}" target="_blank"><h2>View on GitHub</h2></a>` : ''}
            </div>
        `;

        const rightCol = document.createElement('div');
        rightCol.style.display = 'flex';
        rightCol.style.flexDirection = 'column';
        if (photosSection) rightCol.appendChild(photosSection);
        // if (project.link) {
        //     const linkElem = document.createElement('a');
        //     linkElem.classList.add('project-link', 'github-link');
        //     linkElem.href = project.link;
        //     linkElem.target = '_blank';
        //     linkElem.innerHTML = '<h2>View on GitHub</h2>';
        //     rightCol.appendChild(linkElem);
        // }

        projectContent.appendChild(leftCol);
        projectContent.appendChild(rightCol);
        itemElem.appendChild(projectContent);
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
            <h3 class="title">${language}</h3>
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
            <h3 class="title">${framework}</h3>
        `;
        section.appendChild(itemElem);
    });
}

async function loadToolsSection(arrayName, sectionId) {
    const tools = await getDataArray(arrayName);
    const section = document.getElementById(sectionId);
    if (!section) {
        console.error(`No element with id "${sectionId}" found.`);
        return;
    }
    section.innerHTML = '';
    tools.forEach(async tool => {
        const itemElem = document.createElement('div');
        itemElem.classList.add(`tool`, `technology`);
        icon = await getIcon(tool.toLowerCase().replace(' ', '-'));
        itemElem.innerHTML = `
            <img class="tool-icon ${tool.toLowerCase()}-icon" src="${icon}" alt="${tool} icon"/>
            <h3 class="title">${tool}</h3>
        `;
        section.appendChild(itemElem);
    }
    );
}

async function loadTechnologies(techArray, containerId) {
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
            <h3 class="title">${tech}</h3>
        `;
        container.appendChild(itemElem);
    });
}