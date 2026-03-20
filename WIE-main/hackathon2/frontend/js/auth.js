// auth.js - Updated with path selection after login

console.log("✅ auth.js loaded");

class Auth {
    constructor() {
        this.baseURL = 'http://localhost:5000/api';
        this.token = localStorage.getItem('token') || sessionStorage.getItem('token');
        this.user = JSON.parse(localStorage.getItem('user') || sessionStorage.getItem('user') || '{}');
        this.selectedPath = null;
        this.init();
    }
    
    init() {
        this.setupEventListeners();
        this.checkAuthStatus();
    }
    
    setupEventListeners() {
        // Auth tabs
        const tabs = document.querySelectorAll('.auth-tab');
        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                const tabName = tab.dataset.tab;
                document.querySelectorAll('.auth-tab').forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                document.querySelectorAll('.auth-form').forEach(form => form.classList.remove('active'));
                document.getElementById(`${tabName}-form`).classList.add('active');
            });
        });
        
        // Login form
        const loginForm = document.getElementById('login-form');
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.login();
            });
        }
        
        // Signup form
        const signupForm = document.getElementById('signup-form');
        if (signupForm) {
            signupForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.signup();
            });
        }
        
        // Path selection
        const pathCards = document.querySelectorAll('.choice-card');
        pathCards.forEach(card => {
            card.addEventListener('click', () => {
                pathCards.forEach(c => c.classList.remove('selected'));
                card.classList.add('selected');
                this.selectedPath = card.dataset.path;
            });
        });
        
        // Profile form
        const profileForm = document.getElementById('profile-form');
        if (profileForm) {
            profileForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.saveProfile();
            });
        }
        
        // Modal close buttons
        document.querySelectorAll('.close').forEach(btn => {
            btn.onclick = () => btn.closest('.modal')?.classList.remove('active');
        });
        
        // Show signup from login
        const showSignup = document.getElementById('show-signup');
        if (showSignup) {
            showSignup.addEventListener('click', (e) => {
                e.preventDefault();
                this.hideModal('login-modal');
                this.showModal('signup-modal');
            });
        }
        
        // Show login from signup
        const showLogin = document.getElementById('show-login');
        if (showLogin) {
            showLogin.addEventListener('click', (e) => {
                e.preventDefault();
                this.hideModal('signup-modal');
                this.showModal('login-modal');
            });
        }
    }
    
    checkAuthStatus() {
        if (this.token && this.user.firstName) {
            // User is logged in, check if onboarding is needed
            const onboardingCompleted = localStorage.getItem('onboarding_completed');
            if (!onboardingCompleted) {
                this.showPathSelection();
            } else {
                window.location.href = 'dashboard.html';
            }
        }
    }
    
    showModal(id) {
        document.getElementById(id)?.classList.add('active');
    }
    
    hideModal(id) {
        document.getElementById(id)?.classList.remove('active');
    }
    
    showPathSelection() {
        this.showModal('onboarding-modal');
    }
    
    async login() {
        const email = document.getElementById('login-email')?.value;
        const password = document.getElementById('login-password')?.value;
        
        if (!email || !password) {
            this.showNotification('Please fill all fields', 'error');
            return;
        }
        
        this.showNotification('Logging in...', 'info');
        
        try {
            // For demo, create a user
            const user = {
                firstName: email.split('@')[0],
                lastName: 'User',
                email: email
            };
            
            localStorage.setItem('token', 'demo-token');
            localStorage.setItem('user', JSON.stringify(user));
            this.user = user;
            this.token = 'demo-token';
            
            this.showNotification('Login successful!', 'success');
            this.hideModal('login-modal');
            this.hideModal('signup-modal');
            
            this.showPathSelection();
            
        } catch (error) {
            console.error('Login error:', error);
            this.showNotification('Login failed. Please try again.', 'error');
        }
    }
    
    async signup() {
        const firstName = document.getElementById('signup-firstname')?.value;
        const lastName = document.getElementById('signup-lastname')?.value;
        const email = document.getElementById('signup-email')?.value;
        const password = document.getElementById('signup-password')?.value;
        const confirm = document.getElementById('signup-confirm-password')?.value;
        
        if (!firstName || !lastName || !email || !password) {
            this.showNotification('Please fill all fields', 'error');
            return;
        }
        
        if (password !== confirm) {
            this.showNotification('Passwords do not match', 'error');
            return;
        }
        
        this.showNotification('Creating account...', 'info');
        
        try {
            const user = { firstName, lastName, email };
            localStorage.setItem('token', 'demo-token');
            localStorage.setItem('user', JSON.stringify(user));
            this.user = user;
            this.token = 'demo-token';
            
            this.showNotification('Account created successfully!', 'success');
            this.hideModal('signup-modal');
            this.hideModal('login-modal');
            
            this.showPathSelection();
            
        } catch (error) {
            console.error('Signup error:', error);
            this.showNotification('Signup failed. Please try again.', 'error');
        }
    }
    
    saveProfile() {
        const prevCompany = document.getElementById('prev-company')?.value;
        const prevRole = document.getElementById('prev-role')?.value;
        const prevSalary = document.getElementById('prev-salary')?.value;
        const prevExperience = document.getElementById('prev-experience')?.value;
        const breakDuration = document.getElementById('break-duration')?.value;
        
        const profile = {
            prevCompany,
            prevRole,
            prevSalary,
            prevExperience: parseInt(prevExperience),
            breakDuration: parseInt(breakDuration)
        };
        
        localStorage.setItem('userProfile', JSON.stringify(profile));
        
        // Save to user object
        this.user.profile = profile;
        localStorage.setItem('user', JSON.stringify(this.user));
        
        this.hideModal('profile-modal');
        
        // Mark onboarding as completed
        localStorage.setItem('onboarding_completed', 'true');
        
        // Redirect based on selected path
        if (this.selectedPath === 'career') {
            window.location.href = 'career-restart.html';
        } else if (this.selectedPath === 'business') {
            window.location.href = 'business-generator.html';
        } else {
            window.location.href = 'dashboard.html';
        }
    }
    
    showNotification(msg, type) {
        let container = document.getElementById('notification-container');
        if (!container) {
            container = document.createElement('div');
            container.id = 'notification-container';
            container.style.cssText = 'position:fixed;top:20px;right:20px;z-index:10000';
            document.body.appendChild(container);
        }
        
        const colors = { success: '#10B981', error: '#EF4444', info: '#38BDF8' };
        const notif = document.createElement('div');
        notif.style.cssText = `background:white;padding:12px 20px;border-radius:50px;box-shadow:0 5px 15px rgba(0,0,0,0.2);margin-bottom:10px;display:flex;align-items:center;gap:10px;border-left:4px solid ${colors[type]}`;
        notif.innerHTML = `<span style="color:${colors[type]}">${type === 'success' ? '✓' : type === 'error' ? '✗' : 'ℹ'}</span><span>${msg}</span>`;
        container.appendChild(notif);
        setTimeout(() => notif.remove(), 3000);
    }
}

// Initialize auth
document.addEventListener('DOMContentLoaded', () => {
    if (!window.auth) window.auth = new Auth();
});