let projects = {};
let currentProjectId = null;
let zoomLevel = 1;
let experienceCount = 0;
let educationCount = 0;

function initApp() {
    createProject();
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
            fullName: '',
            email: '',
            phone: '',
            address: '',
            summary: '',
            skills: ''
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
}

function deleteProject(id){
    if (Object.keys(projects).length === 1) {
        alert("You can't delete the last project");
        return;
    }

    delete projects[id];
    renderProjects(); 
}

function saveProject(){}


// Initialize everything
document.addEventListener('DOMContentLoaded', function() {
    initApp();
});