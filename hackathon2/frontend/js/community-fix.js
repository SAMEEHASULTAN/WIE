// community-fix.js - Navigation and Basic UI Fixes for Community Page
console.log("✅ community-fix.js loaded");

document.addEventListener('DOMContentLoaded', function() {
    console.log("Community-fix: Setting up navigation and basic handlers");
    
    // Make sidebar navigation work
    const navLinks = document.querySelectorAll('.sidebar-nav a');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const href = this.getAttribute('href');
            console.log("Navigating to:", href);
            
            if (this.id === 'logout-btn') {
                handleLogout();
            } else if (href && href !== '#') {
                window.location.href = href;
            }
        });
    });
    
    // Handle logout button
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function(e) {
            e.preventDefault();
            handleLogout();
        });
    }
    
    // Mobile menu toggle
    const menuToggle = document.getElementById('menu-toggle');
    const sidebar = document.getElementById('sidebar');
    if (menuToggle && sidebar) {
        menuToggle.addEventListener('click', function() {
            sidebar.classList.toggle('active');
        });
    }
    
    // Create post button
    const createPostBtn = document.getElementById('create-post-btn');
    if (createPostBtn) {
        createPostBtn.addEventListener('click', function() {
            const modal = document.getElementById('create-post-modal');
            if (modal) {
                modal.classList.add('active');
                document.body.style.overflow = 'hidden';
            }
        });
    }
    
    // Close modal buttons
    document.querySelectorAll('.close').forEach(btn => {
        btn.addEventListener('click', function() {
            const modal = this.closest('.modal');
            if (modal) {
                modal.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    });
    
    // Create post form submission
    const postForm = document.getElementById('create-post-form');
    if (postForm) {
        postForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const title = document.getElementById('post-title')?.value;
            const category = document.getElementById('post-category')?.value;
            const content = document.getElementById('post-content')?.value;
            
            if (!title || !content) {
                alert('Please fill in title and content');
                return;
            }
            
            // Add new post to the list
            const postsList = document.querySelector('.posts-list');
            if (postsList) {
                const user = JSON.parse(localStorage.getItem('user') || sessionStorage.getItem('user') || '{}');
                const initials = (user.firstName?.[0] || 'U') + (user.lastName?.[0] || '');
                
                const newPost = document.createElement('div');
                newPost.className = 'post-card';
                newPost.innerHTML = `
                    <div class="post-header">
                        <div class="post-avatar">${initials}</div>
                        <div class="post-info">
                            <h4>${user.firstName || 'You'} ${user.lastName || ''}</h4>
                            <div class="post-meta">
                                <span>Just now</span>
                                <span class="post-category">${category}</span>
                            </div>
                        </div>
                    </div>
                    <h3 class="post-title">${title}</h3>
                    <p class="post-content">${content.substring(0, 150)}${content.length > 150 ? '...' : ''}</p>
                    <div class="post-footer">
                        <span class="post-stats"><i class="far fa-heart"></i> 0</span>
                        <span class="post-stats"><i class="far fa-comment"></i> 0</span>
                    </div>
                `;
                
                // Add click handler to the new post
                newPost.addEventListener('click', function() {
                    alert(`Viewing post: ${title}\n\n${content}`);
                });
                
                postsList.insertBefore(newPost, postsList.firstChild);
            }
            
            // Close modal and reset form
            document.getElementById('create-post-modal')?.classList.remove('active');
            document.body.style.overflow = '';
            postForm.reset();
            
            // Show success message
            if (window.auth && typeof window.auth.showNotification === 'function') {
                window.auth.showNotification('Post created successfully!', 'success');
            } else {
                alert('Post created successfully!');
            }
        });
    }
    
    // Make posts clickable
    document.querySelectorAll('.post-card').forEach(card => {
        card.addEventListener('click', function() {
            const title = this.querySelector('.post-title')?.textContent || 'Post';
            const content = this.querySelector('.post-content')?.textContent || '';
            alert(`📝 ${title}\n\n${content}`);
        });
    });
    
    // Category filters
    document.querySelectorAll('.category').forEach(cat => {
        cat.addEventListener('click', function(e) {
            e.preventDefault();
            document.querySelectorAll('.category').forEach(c => c.classList.remove('active'));
            this.classList.add('active');
            
            const category = this.textContent;
            if (category === 'All Posts') {
                // Show all posts
                document.querySelectorAll('.post-card').forEach(card => {
                    card.style.display = 'block';
                });
            } else {
                // Filter posts by category
                document.querySelectorAll('.post-card').forEach(card => {
                    const postCategory = card.querySelector('.post-category')?.textContent;
                    if (postCategory === category) {
                        card.style.display = 'block';
                    } else {
                        card.style.display = 'none';
                    }
                });
            }
        });
    });
    
    // Tags click
    document.querySelectorAll('.tag').forEach(tag => {
        tag.addEventListener('click', function() {
            const tagText = this.textContent;
            alert(`Searching for posts tagged: ${tagText}`);
        });
    });
    
    // Profile menu click
    const profileMenu = document.getElementById('profile-menu');
    if (profileMenu) {
        profileMenu.addEventListener('click', function() {
            console.log("Profile menu clicked");
            // Could open profile dropdown here
        });
    }
    
    // Search bar functionality
    const searchInput = document.querySelector('.search-bar input');
    if (searchInput) {
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                const query = this.value.trim();
                if (query) {
                    alert(`Searching for: ${query}\nSearch feature coming soon!`);
                }
            }
        });
    }
    
    console.log("Community-fix: Navigation setup complete");
});

// Global logout function
function handleLogout() {
    console.log("Logging out");
    
    // Clear all storage
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('user');
    
    // Show notification if auth exists
    if (window.auth && typeof window.auth.showNotification === 'function') {
        window.auth.showNotification('Logged out successfully', 'success');
    } else {
        alert('Logged out successfully');
    }
    
    // Redirect to home page
    setTimeout(() => {
        window.location.href = 'index.html';
    }, 500);
}

// Helper function to get user initials for avatar
function getUserInitials() {
    const user = JSON.parse(localStorage.getItem('user') || sessionStorage.getItem('user') || '{}');
    const firstName = user.firstName || '';
    const lastName = user.lastName || '';
    return (firstName[0] || 'U') + (lastName[0] || '');
}

// Update profile avatar if exists
document.addEventListener('DOMContentLoaded', function() {
    const avatar = document.getElementById('profile-avatar');
    if (avatar && avatar.textContent === 'JD') {
        avatar.textContent = getUserInitials();
    }
});

console.log("✅ community-fix.js fully loaded");