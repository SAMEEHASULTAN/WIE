console.log("✅ business-fix.js loaded");

document.querySelectorAll('.sidebar-nav a').forEach(link => {
    link.addEventListener('click', e => {
        e.preventDefault();
        if(link.id === 'logout-btn') { localStorage.clear(); window.location.href='index.html'; }
        else window.location.href = link.getAttribute('href');
    });
});

document.getElementById('menu-toggle')?.addEventListener('click', () => document.getElementById('sidebar').classList.toggle('active'));