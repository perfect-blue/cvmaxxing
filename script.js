let projects = {};
let currentProjectId = null;

/**
Composing list of project HTML. The final HTML will be like:
*    <div class="project-item [active]">
*        <button class="delete-project">×</button>
*        <h3>Display Name</h3>
*        <p>Modified: MM/DD/YYYY</p>
*    </div>
*/
function renderProjects() {
    const fragment = document.createDocumentFragment();

    Object.values(cvs).forEach(cv => {
        const cvItem = document.createElement('div');
        cvItem.className = `project-item ${cv.id === currentCvId ? 'active' : ''}`;
        cvItem.onclick = () => loadCV(cv.id);
        
        // <button class="delete-project" onclick="deleteCV('cv-id'); event.stopPropagation();">×</button>
        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'delete-project';
        deleteBtn.textContent = '×';
        deleteBtn.onclick = (event) => {
            deleteCV(cv.id);
            event.stopPropagation();
        };
        
        // <h3>Display Name</h3>
        const h3 = document.createElement('h3');
        h3.textContent = cv.data.fullName || cv.name;
    
        // <p>Modified: 2023-12-12</p>
        const p = document.createElement('p');
        p.textContent = `Modified: ${cv.lastModified.toLocaleDateString()}`;
    
        cvItem.appendChild(deleteBtn);
        cvItem.appendChild(h3);
        cvItem.appendChild(p);
    
        fragment.appendChild(cvItem);
    });
    
    cvList.appendChild(fragment);
}

function loadResume(id) {
    currentProjectId = id;
    const project = projects[id];

    const fields = {
        fullName: document.getElementById('fullName'),
        email: document.getElementById('email'),
        phone: document.getElementById('phone'),
        address: document.getElementById('address'),
        summary: document.getElementById('summary'),
        skills: document.getElementById('skills')
    };
    
    fields.fullName.value = project.data.fullName || '';
    fields.email.value = project.data.email || '';
    fields.phone.value = project.data.phone || '';
    fields.address.value = project.data.address || '';
    fields.summary.value = project.data.summary || '';
    fields.skills.value = project.data.skills || '';

}

function createProject() {
    const project = {
        id: uuidv4(),
        name: "Untitled Resume",
        data: {
            fullName: "",
            email: "",
            phone: "",
            summary: "",
            experience: [],
            education: [],
            skills: [],
            tools: []
        },
        lastModified: new Date(),
    }

    projects[project.id] = project;
    currentProjectId = project.id;
    
    renderProjects();
}

function initApp() {
    createProject();
    addExperience();
    addEducation();
    updatePreview();
}


/*
 **************************************
 ***      HELPER METHOD      **********
 **************************************
*/

function addExperience(data = {}) {
    const container = document.getElementById('experienceList');
    const id = ++experienceCount;

    const fragment = document.createDocumentFragment();
    const expDiv = document.createElement('div');
    expDiv.className = 'dynamic-section';

    const fields = [
        {
            label: 'Job Title',
            type: 'input',
            inputType: 'text',
            idSuffix: 'Title',
            value: data.title || '',
            placeholder: 'Software Developer'
        },
        {
            label: 'Company',
            type: 'input',
            inputType: 'text',
            idSuffix: 'Company',
            value: data.company || '',
            placeholder: 'Tech Company Inc.'
        },
        {
            label: 'Date Range',
            type: 'input',
            inputType: 'text',
            idSuffix: 'Date',
            value: data.date || '',
            placeholder: 'Jan 2020 - Present'
        },
        {
            label: 'Description',
            type: 'textarea',
            idSuffix: 'Desc',
            value: data.description || '',
            placeholder: 'Describe your responsibilities and achievements...'
        }
    ];

    for (const field of fields) {
        const group = document.createElement('div');
        group.className = 'form-group';

        const label = document.createElement('label');
        label.textContent = field.label;

        let input;
        if (field.type === 'textarea') {
            input = document.createElement('textarea');
            input.textContent = field.value;
        } else {
            input = document.createElement('input');
            input.type = field.inputType;
            input.value = field.value;
        }

        input.id = `exp${field.idSuffix}${id}`;
        input.placeholder = field.placeholder;

        group.appendChild(label);
        group.appendChild(input);
        expDiv.appendChild(group);
    }

    const removeBtn = document.createElement('button');
    removeBtn.className = 'remove-btn';
    removeBtn.textContent = 'Remove';
    removeBtn.onclick = () => removeExperience(removeBtn, id);
    expDiv.appendChild(removeBtn);

    fragment.appendChild(expDiv);
    container.appendChild(fragment);

    addInputListeners(expDiv);
}

function addEducation(data = {}) {
    const container = document.getElementById('educationList');
    const id = ++educationCount;

    const fragment = document.createDocumentFragment();

    const fields = [
        { label: 'Degree', type: 'input', id: `eduDegree${id}`, value: data.degree || '', placeholder: 'Bachelor of Science' },
        { label: 'School/University', type: 'input', id: `eduSchool${id}`, value: data.school || '', placeholder: 'University Name' },
        { label: 'Date Range', type: 'input', id: `eduDate${id}`, value: data.date || '', placeholder: '2016 - 2020' },
        { label: 'Additional Info', type: 'textarea', id: `eduInfo${id}`, value: data.info || '', placeholder: 'GPA, honors, relevant coursework...' },
    ];

    const eduDiv = document.createElement('div');
    eduDiv.className = 'dynamic-section';

    for (const field of fields) {
        const formGroup = document.createElement('div');
        formGroup.className = 'form-group';

        const label = document.createElement('label');
        label.textContent = field.label;
        formGroup.appendChild(label);

        let input;
        if (field.type === 'input') {
            input = document.createElement('input');
            input.type = 'text';
        } else {
            input = document.createElement('textarea');
        }

        input.id = field.id;
        input.value = field.value;
        input.placeholder = field.placeholder;
        formGroup.appendChild(input);

        eduDiv.appendChild(formGroup);
    }

    const removeBtn = document.createElement('button');
    removeBtn.className = 'remove-btn';
    removeBtn.textContent = 'Remove';
    removeBtn.onclick = () => removeEducation(removeBtn, id);

    eduDiv.appendChild(removeBtn);
    fragment.appendChild(eduDiv);
    container.appendChild(fragment);

    addInputListeners(eduDiv);
}

function addInputListeners(container = document) {
    const inputs = container.querySelectorAll('input, textarea');
    inputs.forEach(input => {
        input.addEventListener('input', updatePreview);
    });
}