const sectionConfigs = {
    experience: {
        containerId: 'experienceList',
        counter: () => ++experienceCount,
        fields: [
            { name: 'title', label: 'Job Title', placeholder: 'Software Developer', type: 'input' },
            { name: 'company', label: 'Company', placeholder: 'Tech Company Inc.', type: 'input' },
            { name: 'date', label: 'Date Range', placeholder: 'Jan 2020 - Present', type: 'input' },
            { name: 'description', label: 'Description', placeholder: 'Describe your responsibilities...', type: 'textarea' }
        ]
    },
    education: {
        containerId: 'educationList',
        counter: () => ++educationCount,
        fields: [
            { name: 'degree', label: 'Degree', placeholder: 'Bachelor of Science', type: 'input' },
            { name: 'school', label: 'School/University', placeholder: 'University Name', type: 'input' },
            { name: 'date', label: 'Date Range', placeholder: '2016 - 2020', type: 'input' },
            { name: 'info', label: 'Additional Info', placeholder: 'GPA, honors, coursework...', type: 'textarea' }
        ]
    }
};

let projects = {};
let currentProjectId = null;
let zoomLevel = 1;
let experienceCount = 0;
let educationCount = 0;

function initApp() {
    createProject();
    addSection('experience');
    addSection('education');
    updatePreview();
}

// project-panel related

/**
 * Composing list of project HTML.
 * <div class="project-item [active]">
 *      <button class="delete-project">x</button>
 *      <h3>Display Name</h3>
 *      <p>Modified: MM/DD/YYYY </p>
 * </div>
 */
function createProject() {
    const id = 'project_' + Date.now();
    const newProject = {
        id: id,
        name: 'Software Engineer',
        data: {
            fullName: 'Test User',
            email: 'test@example.com',
            phone: '123-456-7890',
            address: '123 Main St, Anytown, USA',
            summary: 'Test user summary',
            skills: 'Test skills',
            education: [],
            experience: [],
        },
        lastModified: new Date()
    };

    projects[id] = newProject;
    currentProjectId = id;
    
    renderProjects();
    loadProject(id);
}

function renderProjects() {
    const container = document.getElementById("projects");
    container.innerHTML = '';
    const fragment = document.createDocumentFragment();

    Object.values(projects).forEach(project => {
        const projectItem = document.createElement('div');
        projectItem.className = `project-item ${project.id === currentProjectId ? 'active' : ''}`;
        projectItem.onclick = () => loadProject(project.id);

        const nameEl = document.createElement('h3');
        nameEl.textContent = project.name || 'Untitled Project';

        if (project.id === currentProjectId) {
            nameEl.contentEditable = "true";
            nameEl.classList.add('editable-project-name');

            nameEl.addEventListener('click', (e) => e.stopPropagation());
            nameEl.addEventListener('input', (e) => {
                project.name = e.target.textContent.trim() || 'Untitled Project';
                project.lastModified = new Date();
                date.textContent = `Modified: ${project.lastModified.toLocaleDateString()}`;
            });
        }

        projectItem.appendChild(nameEl);

        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'delete-project';
        deleteBtn.textContent = '×';
        deleteBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            deleteProject(project.id);
        });
        projectItem.appendChild(deleteBtn);

        const date = document.createElement('p');
        date.textContent = `Modified: ${project.lastModified.toLocaleDateString()}`;
        projectItem.appendChild(date);

        fragment.appendChild(projectItem);
    });

    container.appendChild(fragment);
}

function loadProject(id){
    currentProjectId = id;
    const project = projects[id];

    document.getElementById('experienceList').innerHTML = '';
    document.getElementById('educationList').innerHTML = '';
    experienceCount = 0;
    educationCount = 0;

    document.getElementById('fullName').value = project.data.fullName || '';
    document.getElementById('email').value = project.data.email || '';
    document.getElementById('phone').value = project.data.phone || '';
    document.getElementById('summary').value = project.data.summary || '';
    document.getElementById('skills').value = project.data.skills || '';
    
    addSection('experience', project.data.experience);
    addSection('education', project.data.education);

    updatePreview();
}

function deleteProject(id){
    if (Object.keys(projects).length === 1) {
        alert("You can't delete the last project");
        return;
    }

    delete projects[id];
    renderProjects(); 
}

//Dynamic sections
function addSection(type, data={}) {
    const config = sectionConfigs[type];
    const container = document.getElementById(config.containerId);
    const id = config.counter();

    const fragment = document.createDocumentFragment();
    const sectionDiv = document.createElement('div');
    sectionDiv.className = 'dynamic-section';

    config.fields.forEach(field =>{
        const wrapper = document.createElement('div');
        wrapper.className = 'form-group';
        const label = document.createElement('label');
        label.textContent = field.label;
        wrapper.appendChild(label);

        let inputElement;
        if(field.type === 'textarea'){
            inputElement = document.createElement('textarea');
            inputElement.id = `${type}${field.name.charAt(0).toUpperCase() + field.name.slice(1)}${id}`;
            inputElement.placeholder = field.placeholder;
            inputElement.textContent = data[field.name] || '';
        } else {
            inputElement = document.createElement('input');
            inputElement.type = 'text';
            inputElement.id = `${type}${field.name.charAt(0).toUpperCase() + field.name.slice(1)}${id}`;
            inputElement.placeholder = field.placeholder;
            inputElement.value = data[field.name] || '';
        }

        wrapper.appendChild(inputElement);
        sectionDiv.appendChild(wrapper);
    });

    const removeBtn = document.createElement('button');
    removeBtn.className = 'remove-btn';
    removeBtn.textContent = 'Remove';
    removeBtn.onclick = () => removeSection(sectionDiv);
    sectionDiv.appendChild(removeBtn);

    fragment.appendChild(sectionDiv);
    container.appendChild(fragment);

    addInputListeners(sectionDiv);
}

function addExperience() {
    addSection('experience');
}

function addEducation() {
    addSection('education');
}

function removeSection(sectionElement) {
    sectionElement.remove();
    updatePreview();
}

function getSectionData(type) {
    const config = sectionConfigs[type];
    const sections = [];
    const container = document.getElementById(config.containerId);

    container.querySelectorAll('.dynamic-section').forEach(section => {
        const entry = {};
        config.fields.forEach(field => {
            const input = section.querySelector(`[placeholder="${field.placeholder}"]`);
            entry[field.name] = input?.value || '';
        });
        if (Object.values(entry).some(v => v)) {
            sections.push(entry);
        }
    });

    return sections;
}


// preview related
function updatePreview(){
    if (!currentProjectId) return;
    saveResume();
    const resume = projects[currentProjectId];
    const data = resume.data;

    let resumeHTML = generateResume(data);

    const pagesContainer = document.getElementById('pagesContainer');
    
    const fragment = document.createDocumentFragment();
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = resumeHTML;
    while (tempDiv.firstChild) {
        fragment.appendChild(tempDiv.firstChild);
    }
    pagesContainer.replaceChildren(fragment);

    simulatePagination();
}

function saveResume(){
    if (!currentProjectId) return;

    const resume = projects[currentProjectId];

    const fields = ['fullName','email','phone','address','summary','skills'];
    const newData = {};
    fields.forEach(field => {
        newData[field] = document.getElementById(field)?.value || '';
    });

    newData.experience = getSectionData('experience');
    newData.education = getSectionData('education');

    resume.data = newData;
    resume.lastModified = new Date();

    renderProjects();
}


function generateResume(data){
    return `
        <div class="resume-page">
            <div class="page-number">Page 1</div>
            <div class="resume-header">
                <div class="resume-name">${data.fullName || 'Your Name'}</div>
                <div class="resume-contact">
                    ${data.email || 'email@example.com'} | 
                    ${data.phone || '(555) 123-4567'} | 
                    ${data.address || 'Your Address'}
                </div>
            </div>
            
            ${data.summary ? `
            <div class="resume-section">
                <h3>Professional Summary</h3>
                <p>${data.summary}</p>
            </div>
            ` : ''}
            
            ${data.experience && data.experience.length > 0 ? `
            <div class="resume-section">
                <h3>Experience</h3>
                ${data.experience.map(exp => `
                    <div class="resume-item">
                        <h4>${exp.title}</h4>
                        <div class="company">${exp.company}</div>
                        <div class="date">${exp.date}</div>
                        <p>${exp.description}</p>
                    </div>
                `).join('')}
            </div>
            ` : ''}
            
            ${data.education && data.education.length > 0 ? `
            <div class="resume-section">
                <h3>Education</h3>
                ${data.education.map(edu => `
                    <div class="resume-item">
                        <h4>${edu.degree}</h4>
                        <div class="company">${edu.school}</div>
                        <div class="date">${edu.date}</div>
                        <p>${edu.info}</p>
                    </div>
                `).join('')}
            </div>
            ` : ''}
            
            ${data.skills ? `
            <div class="resume-section">
                <h3>Skills</h3>
                <p>${data.skills}</p>
            </div>
            ` : ''}
        </div>
    `;
}

function simulatePagination(){
    console.log("Simulate Pagination");
    createResumePage(1, 1);
}

function createResumePage(originalPage, pageNumber) {
    console.log("create resume Page");
}

function addInputListeners(container = document) {
    const inputs = container.querySelectorAll('input, textarea');
    inputs.forEach(input => {
        input.addEventListener('input', updatePreview);
    });
}

// Initialize everything
document.addEventListener('DOMContentLoaded', function() {
    addInputListeners();
    initApp();
});