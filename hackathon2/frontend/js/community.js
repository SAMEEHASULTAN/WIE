// Community JavaScript
class Community {
    constructor() {
        this.baseURL = 'http://localhost:5000/api';
        this.token = localStorage.getItem('token') || sessionStorage.getItem('token');
        this.user = JSON.parse(localStorage.getItem('user') || sessionStorage.getItem('user'));
        
        if (!this.token || !this.user) {
            window.location.href = '/';
            return;
        }
        
        this.init();
    }
    
    init() {
        this.updateUserInfo();
        this.setupEventListeners();
        this.loadPosts();
    }
    
    updateUserInfo() {
        const avatar = document.getElementById('profile-avatar');
        if (avatar && this.user) {
            const initials = (this.user.firstName?.[0] || '') + (this.user.lastName?.[0] || '');
            avatar.textContent = initials || 'U';
        }
    }
    
    setupEventListeners() {
        // Logout
        document.getElementById('logout-btn')?.addEventListener('click', (e) => {
            e.preventDefault();
            auth.logout();
        });
        
        // Mobile menu toggle
        document.getElementById('menu-toggle')?.addEventListener('click', () => {
            document.getElementById('sidebar').classList.toggle('active');
        });
        
        // Create post button
        document.getElementById('create-post-btn')?.addEventListener('click', () => {
            document.getElementById('create-post-modal').classList.add('active');
        });
        
        // Close modals
        document.querySelectorAll('.modal .close').forEach(btn => {
            btn.addEventListener('click', () => {
                btn.closest('.modal').classList.remove('active');
            });
        });
        
        // Create post form
        document.getElementById('create-post-form')?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.createPost();
        });
        
        // Category filters
        document.querySelectorAll('.category').forEach(cat => {
            cat.addEventListener('click', (e) => {
                e.preventDefault();
                document.querySelectorAll('.category').forEach(c => c.classList.remove('active'));
                cat.classList.add('active');
                this.filterPosts(cat.textContent);
            });
        });
    }
    
    async loadPosts() {
        try {
            const response = await fetch(`${this.baseURL}/community/posts`);
            
            if (response.ok) {
                const posts = await response.json();
                this.displayPosts(posts);
            }
        } catch (error) {
            console.error('Error loading posts:', error);
        }
    }
    
    displayPosts(posts) {
        const container = document.getElementById('posts-list');
        
        if (posts.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-comments"></i>
                    <h3>No posts yet</h3>
                    <p>Be the first to share something with the community!</p>
                </div>
            `;
            return;
        }
        
        container.innerHTML = posts.map(post => `
            <div class="post-card" data-post-id="${post.id}">
                <div class="post-header">
                    <div class="post-avatar">${this.getInitials(post.user?.fullName)}</div>
                    <div class="post-info">
                        <h4>${post.user?.fullName || 'Anonymous'}</h4>
                        <div class="post-meta">
                            <span>${this.formatDate(post.createdAt)}</span>
                            <span class="post-category">${post.category}</span>
                        </div>
                    </div>
                </div>
                <h3 class="post-title">${post.title}</h3>
                <p class="post-content">${this.truncateText(post.content, 200)}</p>
                <div class="post-footer">
                    <span class="post-stats">
                        <i class="far fa-heart"></i> ${post.likes || 0}
                    </span>
                    <span class="post-stats">
                        <i class="far fa-comment"></i> ${post.comments?.length || 0}
                    </span>
                    <button class="btn-link read-more">Read More</button>
                </div>
            </div>
        `).join('');
        
        // Add click handlers
        container.querySelectorAll('.read-more').forEach((btn, index) => {
            btn.addEventListener('click', () => {
                this.showPostDetails(posts[index]);
            });
        });
    }
    
    showPostDetails(post) {
        const modal = document.getElementById('post-modal');
        const details = document.getElementById('post-details');
        
        details.innerHTML = `
            <div class="post-detail">
                <div class="post-header">
                    <div class="post-avatar large">${this.getInitials(post.user?.fullName)}</div>
                    <div class="post-info">
                        <h2>${post.title}</h2>
                        <p>By ${post.user?.fullName || 'Anonymous'} • ${this.formatDate(post.createdAt)}</p>
                        <span class="post-category">${post.category}</span>
                    </div>
                </div>
                
                <div class="post-content-full">
                    ${post.content}
                </div>
                
                <div class="post-actions">
                    <button class="btn-icon like-btn">
                        <i class="far fa-heart"></i> Like (${post.likes || 0})
                    </button>
                    <button class="btn-icon comment-btn">
                        <i class="far fa-comment"></i> Comment
                    </button>
                </div>
                
                <div class="comments-section">
                    <h3>Comments (${post.comments?.length || 0})</h3>
                    
                    <div class="comments-list">
                        ${this.renderComments(post.comments)}
                    </div>
                    
                    <div class="add-comment">
                        <textarea placeholder="Write a comment..." rows="3"></textarea>
                        <button class="btn-primary submit-comment">Post Comment</button>
                    </div>
                </div>
            </div>
        `;
        
        modal.classList.add('active');
        
        // Add comment handler
        const submitBtn = details.querySelector('.submit-comment');
        submitBtn.addEventListener('click', () => {
            const commentText = details.querySelector('textarea').value;
            if (commentText.trim()) {
                this.addComment(post.id, commentText);
            }
        });
    }
    
    renderComments(comments) {
        if (!comments || comments.length === 0) {
            return '<p class="no-comments">No comments yet. Be the first to comment!</p>';
        }
        
        return comments.map(comment => `
            <div class="comment">
                <div class="comment-header">
                    <strong>${comment.user?.fullName || 'Anonymous'}</strong>
                    <span>${this.formatDate(comment.createdAt)}</span>
                </div>
                <p>${comment.content}</p>
            </div>
        `).join('');
    }
    
    async createPost() {
        const title = document.getElementById('post-title').value;
        const category = document.getElementById('post-category').value;
        const content = document.getElementById('post-content').value;
        const tags = document.getElementById('post-tags').value;
        
        if (!title || !content) {
            auth.showNotification('Please fill in all required fields', 'error');
            return;
        }
        
        try {
            const response = await fetch(`${this.baseURL}/community/posts`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.token}`
                },
                body: JSON.stringify({
                    title,
                    category,
                    content,
                    tags: tags.split(',').map(t => t.trim())
                })
            });
            
            if (response.ok) {
                auth.showNotification('Post created successfully!', 'success');
                document.getElementById('create-post-modal').classList.remove('active');
                document.getElementById('create-post-form').reset();
                this.loadPosts();
            } else {
                auth.showNotification('Failed to create post', 'error');
            }
        } catch (error) {
            console.error('Error creating post:', error);
            auth.showNotification('Network error', 'error');
        }
    }
    
    async addComment(postId, comment) {
        try {
            const response = await fetch(`${this.baseURL}/community/posts/${postId}/comments`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.token}`
                },
                body: JSON.stringify({ content: comment })
            });
            
            if (response.ok) {
                auth.showNotification('Comment added!', 'success');
                
                // Reload post details
                const postResponse = await fetch(`${this.baseURL}/community/posts/${postId}`);
                if (postResponse.ok) {
                    const post = await postResponse.json();
                    this.showPostDetails(post);
                }
            }
        } catch (error) {
            console.error('Error adding comment:', error);
            auth.showNotification('Failed to add comment', 'error');
        }
    }
    
    filterPosts(category) {
        // Implement filtering logic
        if (category === 'All Posts') {
            this.loadPosts();
        } else {
            // Filter posts by category
        }
    }
    
    getInitials(name) {
        if (!name) return 'U';
        return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    }
    
    formatDate(dateString) {
        if (!dateString) return 'Recently';
        const date = new Date(dateString);
        const now = new Date();
        const diffTime = Math.abs(now - date);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        if (diffDays === 0) return 'Today';
        if (diffDays === 1) return 'Yesterday';
        if (diffDays < 7) return `${diffDays} days ago`;
        if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
        return date.toLocaleDateString('en-IN');
    }
    
    truncateText(text, length) {
        if (text.length <= length) return text;
        return text.substring(0, length) + '...';
    }
}

// Initialize community
document.addEventListener('DOMContentLoaded', () => {
    window.community = new Community();
});