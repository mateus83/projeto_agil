let currentUser = null;

async function checkAuth() {
    const response = await fetch('/api/auth/check');
    if (response.ok) {
        currentUser = await response.json();
        updateUIForUser();
    } else {
        window.location.href = 'login.html';
    }
}

function updateUIForUser() {
    document.getElementById('userProfileLink').textContent = `${currentUser.nome} (${currentUser.cargo})`;
    if (currentUser.nivel_acesso === 'admin') {
        document.getElementById('reportsLink').style.display = 'block';
    } else {
        document.getElementById('reportsLink').style.display = 'none';
    }
}

document.getElementById('logoutLink').addEventListener('click', async function(e) {
    e.preventDefault();
    await fetch('/api/auth/logout', { method: 'POST' });
    window.location.href = 'login.html';
});

document.querySelectorAll('.sidebar .nav-link').forEach(link => {
    link.addEventListener('click', function(e) {
        e.preventDefault();
        const page = this.id.replace('Link', '');
        loadPage(page);
    });
});

async function loadPage(page) {
    const contentDiv = document.getElementById('content');
    contentDiv.innerHTML = `<h2>${page.charAt(0).toUpperCase() + page.slice(1)}</h2>`;
    
    switch(page) {
        case 'dashboard':
            await loadDashboardContent();
            break;
        case 'projects':
            await loadProjectsContent();
            break;
        case 'tasks':
            await loadTasksContent();
            break;
        case 'team':
            await load
let currentUser = null;

async function checkAuth() {
    const response = await fetch('/api/auth/check');
    if (response.ok) {
        currentUser = await response.json();
        updateUIForUser();
    } else {
        window.location.href = 'login.html';
    }
}

function updateUIForUser() {
    document.getElementById('userProfileLink').textContent = `${currentUser.nome} (${currentUser.cargo})`;
    if (currentUser.nivel_acesso === 'admin') {
        document.getElementById('reportsLink').style.display = 'block';
    } else {
        document.getElementById('reportsLink').style.display = 'none';
    }
}

document.getElementById('logoutLink').addEventListener('click', async function(e) {
    e.preventDefault();
    await fetch('/api/auth/logout', { method: 'POST' });
    window.location.href = 'login.html';
});

document.querySelectorAll('.sidebar .nav-link').forEach(link => {
    link.addEventListener('click', function(e) {
        e.preventDefault();
        const page = this.id.replace('Link', '');
        loadPage(page);
    });
});

async function loadPage(page) {
    const contentDiv = document.getElementById('content');
    contentDiv.innerHTML = `<h2>${page.charAt(0).toUpperCase() + page.slice(1)}</h2>`;
    
    switch(page) {
        case 'dashboard':
            await loadDashboardContent();
            break;
        case 'projects':
            await loadProjectsContent();
            break;
        case 'tasks':
            await loadTasksContent();
            break;
        case 'team':
            await load