console.log("✅ profile-menu.js loaded");

class ProfileMenu {
    constructor() {
        this.init();
    }
    
    init() {
        this.updateDisplay();
        const menu = document.getElementById('profile-menu');
        const dropdown = document.getElementById('profile-dropdown');
        if(menu) menu.onclick = (e) => { e.stopPropagation(); dropdown.style.display = dropdown.style.display === 'block' ? 'none' : 'block'; };
        document.addEventListener('click', () => { if(dropdown) dropdown.style.display = 'none'; });
        
        document.getElementById('dropdown-login')?.addEventListener('click', () => window.auth?.showModal('login-modal'));
        document.getElementById('dropdown-signup')?.addEventListener('click', () => window.auth?.showModal('signup-modal'));
        document.getElementById('dropdown-logout')?.addEventListener('click', () => this.logout());
    }
    
    updateDisplay() {
        const user = JSON.parse(localStorage.getItem('user') || sessionStorage.getItem('user') || '{}');
        const avatar = document.getElementById('profile-avatar');
        const nameSpan = document.getElementById('user-fullname');
        const loginItem = document.getElementById('dropdown-login');
        const signupItem = document.getElementById('dropdown-signup');
        const logoutItem = document.getElementById('dropdown-logout');
        
        if(user.firstName) {
            if(avatar) avatar.textContent = (user.firstName[0] + (user.lastName?.[0] || '')).toUpperCase();
            if(nameSpan) nameSpan.textContent = `${user.firstName} ${user.lastName || ''}`.trim();
            if(loginItem) loginItem.style.display = 'none';
            if(signupItem) signupItem.style.display = 'none';
            if(logoutItem) logoutItem.style.display = 'flex';
        } else {
            if(avatar) avatar.textContent = 'U';
            if(nameSpan) nameSpan.textContent = 'Guest User';
            if(loginItem) loginItem.style.display = 'flex';
            if(signupItem) signupItem.style.display = 'flex';
            if(logoutItem) logoutItem.style.display = 'none';
        }
    }
    
    logout() {
        localStorage.clear();
        sessionStorage.clear();
        window.location.href = 'index.html';
    }
}

document.addEventListener('DOMContentLoaded', () => { window.profileMenu = new ProfileMenu(); });