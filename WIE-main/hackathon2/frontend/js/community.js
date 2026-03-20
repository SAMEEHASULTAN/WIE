// community-fix.js
console.log("✅ community-fix.js loaded");

document.addEventListener('DOMContentLoaded', function() {
    // Sidebar navigation
    document.querySelectorAll('.sidebar-nav a').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            if (this.id === 'logout-btn') {
                handleLogout();
            } else {
                window.location.href = this.getAttribute('href');
            }
        });
    });
    
    // Handle logout
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function(e) {
            e.preventDefault();
            handleLogout();
        });
    }
    
    // Create post button
    const createPostBtn = document.getElementById('create-post-btn');
    if (createPostBtn) {
        createPostBtn.addEventListener('click', function() {
            document.getElementById('create-post-modal').classList.add('active');
        });
    }
    
    // Close modals
    document.querySelectorAll('.close').forEach(btn => {
        btn.addEventListener('click', function() {
            this.closest('.modal').classList.remove('active');
        });
    });
    
    // Create post form
    const postForm = document.getElementById('create-post-form');
    if (postForm) {
        postForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Add new post to the list
            const title = document.getElementById('post-title').value;
            const category = document.getElementById('post-category').value;
            const content = document.getElementById('post-content').value;
            
            const postsList = document.querySelector('.posts-list');
            const newPost = document.createElement('div');
            newPost.className = 'post-card';
            newPost.innerHTML = `
                <div class="post-header">
                    <div class="post-avatar">${getInitials()}</div>
                    <div class="post-info">
                        <h4>You</h4>
                        <div class="post-meta">
                            <span>Just now</span>
                            <span class="post-category">${category}</span>
                        </div>
                    </div>
                </div>
                <h3 class="post-title">${title}</h3>
                <p class="post-content">${content.substring(0, 100)}${content.length > 100 ? '...' : ''}</p>
                <div class="post-footer">
                    <span class="post-stats"><i class="far fa-heart"></i> 0</span>
                    <span class="post-stats"><i class="far fa-comment"></i> 0</span>
                </div>
            `;
            
            postsList.insertBefore(newPost, postsList.firstChild);
            
            alert('Post created successfully!');
            this.reset();
            document.getElementById('create-post-modal').classList.remove('active');
        });
    }
    
    // Make posts clickable
    document.querySelectorAll('.post-card').forEach(card => {
        card.addEventListener('click', function() {
            const title = this.querySelector('.post-title')?.textContent || 'Post';
            alert(`Viewing post: ${title}\n\nFull post content would be displayed here.`);
        });
    });
    
    // Category filters
    document.querySelectorAll('.category').forEach(cat => {
        cat.addEventListener('click', function(e) {
            e.preventDefault();
            document.querySelectorAll('.category').forEach(c => c.classList.remove('active'));
            this.classList.add('active');
            alert(`Filtering by: ${this.textContent}`);
        });
    });
    
    // Tags click
    document.querySelectorAll('.tag').forEach(tag => {
        tag.addEventListener('click', function() {
            alert(`Searching for posts tagged: ${this.textContent}`);
        });
    });
});

function getInitials() {
    const user = JSON.parse(localStorage.getItem('user') || sessionStorage.getItem('user') || '{}');
    const firstName = user.firstName || '';
    const lastName = user.lastName || '';
    return (firstName[0] || 'U') + (lastName[0] || '');
}

function handleLogout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('user');
    window.location.href = 'index.html';
}