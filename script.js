let projects = {};
let currentProjectId = null;
let zoomLevel = 1;
let experienceCount = 0;
let educationCount = 0;

function initApp() {
    createProject();
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
        name: 'Untitled Project',
        data: {
            fullName: 'Test User',
            email: 'test@example.com',
            phone: '123-456-7890',
            address: '123 Main St, Anytown, USA',
            summary: 'Test user summary',
            skills: 'Test skills'
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

        const displayName = project.data.fullName || project.name;

        projectItem.innerHTML = `
            <button class="delete-project">×</button>
            <h3>${displayName}</h3>
            <p>Modified: ${project.lastModified.toLocaleDateString()}</p>
        `;

        const deleteBtn = projectItem.querySelector('.delete-project');
        deleteBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            deleteProject(project.id);
        });

        fragment.appendChild(projectItem);
    });

    container.appendChild(fragment);
}

function loadProject(id){
    console.log("Project Loaded")
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
    console.log(resume);
    const fields = [
        'fullName','email', 'phone', 'summary'
    ];
    const newData ={};
    fields.forEach(field => {
        newData[field] = document.getElementById(field).value;
    });

    const hasChanges = JSON.stringify(resume.data) !== JSON.stringify(newData);
    if (!hasChanges) return;

    resume.data = newData;
    resume.lastModified = new Date();

    const newName = newData.fullName ? `$${newData.fullName}` : resume.name;
    if (resume.name !== newName) resume.name = newName;

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