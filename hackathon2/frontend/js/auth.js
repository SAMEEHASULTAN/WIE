// auth.js - Complete Fixed Version
console.log("✅ auth.js loaded - FIXED VERSION");

class Auth {
    constructor() {
        console.log("✅ Auth constructor called");
        this.baseURL = 'http://localhost:5000/api';
        this.token = localStorage.getItem('token') || sessionStorage.getItem('token');
        this.user = JSON.parse(localStorage.getItem('user') || sessionStorage.getItem('user'));
        
        console.log("Token:", this.token ? "Present" : "None");
        console.log("User:", this.user);
        
        this.init();
    }
    
    init() {
        console.log("✅ Auth init called");
        
        // Check if user is logged in
        if (this.token && this.user && window.location.pathname === '/') {
            // Only redirect if on landing page
            // this.redirectToDashboard(); // Uncomment to enable auto-redirect
        }
        
        this.setupEventListeners();
    }
    
    setupEventListeners() {
        console.log("✅ Setting up event listeners");
        
        // Get all possible buttons with different selectors
        const loginBtn = document.querySelector('.btn-secondary') || 
                        document.querySelector('button:contains("Login")') ||
                        document.getElementById('login-btn');
        
        const signupBtn = document.querySelector('.btn-primary') || 
                         document.querySelector('button:contains("Join Free")') ||
                         document.getElementById('signup-btn');
        
        const startBtn = document.querySelector('.btn-large') || 
                        document.querySelector('button:contains("Start Your Journey")');
        
        const watchBtn = document.querySelectorAll('.btn-large')[1] || 
                        document.querySelector('button:contains("Watch Stories")');
        
        console.log("Login button found:", !!loginBtn);
        console.log("Signup button found:", !!signupBtn);
        console.log("Start button found:", !!startBtn);
        console.log("Watch button found:", !!watchBtn);
        
        // Add click listeners with both addEventListener and onclick fallback
        if (loginBtn) {
            // Remove any existing listeners by cloning
            const newLoginBtn = loginBtn.cloneNode(true);
            loginBtn.parentNode.replaceChild(newLoginBtn, loginBtn);
            
            newLoginBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log("Login clicked");
                this.showModal('login-modal');
            });
            
            // Fallback onclick
            newLoginBtn.onclick = (e) => {
                e.preventDefault();
                this.showModal('login-modal');
                return false;
            };
        }
        
        if (signupBtn) {
            const newSignupBtn = signupBtn.cloneNode(true);
            signupBtn.parentNode.replaceChild(newSignupBtn, signupBtn);
            
            newSignupBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log("Signup clicked");
                this.showModal('signup-modal');
            });
            
            newSignupBtn.onclick = (e) => {
                e.preventDefault();
                this.showModal('signup-modal');
                return false;
            };
        }
        
        if (startBtn) {
            const newStartBtn = startBtn.cloneNode(true);
            startBtn.parentNode.replaceChild(newStartBtn, startBtn);
            
            newStartBtn.addEventListener('click', (e) => {
                e.preventDefault();
                console.log("Start clicked");
                this.showModal('signup-modal');
            });
        }
        
        if (watchBtn) {
            const newWatchBtn = watchBtn.cloneNode(true);
            watchBtn.parentNode.replaceChild(newWatchBtn, watchBtn);
            
            newWatchBtn.addEventListener('click', (e) => {
                e.preventDefault();
                console.log("Watch clicked");
                this.showTestimonials();
            });
        }
        
        // Setup close buttons for modals
        document.querySelectorAll('.close').forEach(btn => {
            btn.addEventListener('click', () => {
                this.hideModal('login-modal');
                this.hideModal('signup-modal');
                this.hideModal('onboarding-modal');
            });
        });
        
        // Click outside modal to close
        window.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal')) {
                e.target.classList.remove('active');
            }
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
        
        // Show login from signup modal
        const showLogin = document.getElementById('show-login');
        if (showLogin) {
            showLogin.addEventListener('click', (e) => {
                e.preventDefault();
                this.hideModal('signup-modal');
                this.showModal('login-modal');
            });
        }
        
        // Show signup from login modal
        const showSignup = document.getElementById('show-signup');
        if (showSignup) {
            showSignup.addEventListener('click', (e) => {
                e.preventDefault();
                this.hideModal('login-modal');
                this.showModal('signup-modal');
            });
        }
        
        // Setup onboarding navigation
        this.setupOnboarding();
    }
    
    showModal(modalId) {
        console.log("Showing modal:", modalId);
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.add('active');
            document.body.style.overflow = 'hidden'; // Prevent scrolling
        } else {
            console.error("Modal not found:", modalId);
            alert(`Opening ${modalId.replace('-', ' ')}...`);
            
            // Fallback - create simple modal
            this.createFallbackModal(modalId);
        }
    }
    
    hideModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.remove('active');
            document.body.style.overflow = ''; // Restore scrolling
        }
    }
    
    createFallbackModal(type) {
        const modal = document.createElement('div');
        modal.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: white;
            padding: 30px;
            border-radius: 20px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.2);
            z-index: 10000;
            max-width: 400px;
            width: 90%;
        `;
        
        if (type === 'login-modal') {
            modal.innerHTML = `
                <h2 style="margin-bottom: 20px;">Login</h2>
                <input type="email" placeholder="Email" style="width:100%; padding:10px; margin-bottom:10px; border:2px solid #e5e7eb; border-radius:8px;">
                <input type="password" placeholder="Password" style="width:100%; padding:10px; margin-bottom:20px; border:2px solid #e5e7eb; border-radius:8px;">
                <button onclick="this.parentElement.remove()" style="padding:10px 20px; background:#7F56D9; color:white; border:none; border-radius:8px; margin-right:10px; cursor:pointer;">Login</button>
                <button onclick="this.parentElement.remove()" style="padding:10px 20px; background:#f0f0f0; border:none; border-radius:8px; cursor:pointer;">Close</button>
            `;
        } else {
            modal.innerHTML = `
                <h2 style="margin-bottom: 20px;">Sign Up</h2>
                <input type="text" placeholder="First Name" style="width:100%; padding:10px; margin-bottom:10px; border:2px solid #e5e7eb; border-radius:8px;">
                <input type="text" placeholder="Last Name" style="width:100%; padding:10px; margin-bottom:10px; border:2px solid #e5e7eb; border-radius:8px;">
                <input type="email" placeholder="Email" style="width:100%; padding:10px; margin-bottom:10px; border:2px solid #e5e7eb; border-radius:8px;">
                <input type="password" placeholder="Password" style="width:100%; padding:10px; margin-bottom:20px; border:2px solid #e5e7eb; border-radius:8px;">
                <button onclick="this.parentElement.remove()" style="padding:10px 20px; background:#7F56D9; color:white; border:none; border-radius:8px; margin-right:10px; cursor:pointer;">Sign Up</button>
                <button onclick="this.parentElement.remove()" style="padding:10px 20px; background:#f0f0f0; border:none; border-radius:8px; cursor:pointer;">Close</button>
            `;
        }
        
        document.body.appendChild(modal);
        
        // Click outside to close
        setTimeout(() => {
            window.addEventListener('click', function closeModal(e) {
                if (e.target === modal) {
                    modal.remove();
                    window.removeEventListener('click', closeModal);
                }
            });
        }, 100);
    }
    
    showTestimonials() {
        alert("✨ Success Stories\n\n• Priya Sharma: Restarted as Software Developer after 5-year break\n• Anita Desai: Started Home Bakery business\n• Meera Reddy: Became Freelance Writer\n\nWatch full stories coming soon!");
    }
    
    async login() {
        console.log("Handling login");
        const email = document.getElementById('login-email')?.value;
        const password = document.getElementById('login-password')?.value;
        const remember = document.getElementById('remember-me')?.checked;
        
        if (!email || !password) {
            this.showNotification('Please enter email and password', 'error');
            return;
        }
        
        this.showNotification('Logging in...', 'info');
        
        try {
            const response = await fetch(`${this.baseURL}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });
            
            const data = await response.json();
            
            if (response.ok) {
                this.token = data.access_token;
                this.user = data.user;
                
                if (remember) {
                    localStorage.setItem('token', this.token);
                    localStorage.setItem('user', JSON.stringify(this.user));
                } else {
                    sessionStorage.setItem('token', this.token);
                    sessionStorage.setItem('user', JSON.stringify(this.user));
                }
                
                this.showNotification('Login successful!', 'success');
                this.hideModal('login-modal');
                
                // Redirect to dashboard
                setTimeout(() => {
                    window.location.href = 'dashboard.html';
                }, 1000);
            } else {
                this.showNotification(data.error || 'Login failed', 'error');
            }
        } catch (error) {
            console.error('Login error:', error);
            this.showNotification('Network error. Using demo mode.', 'warning');
            
            // Demo mode - redirect anyway
            setTimeout(() => {
                window.location.href = 'dashboard.html';
            }, 1000);
        }
    }
    
    async signup() {
        console.log("Handling signup");
        const firstName = document.getElementById('signup-firstname')?.value;
        const lastName = document.getElementById('signup-lastname')?.value;
        const email = document.getElementById('signup-email')?.value;
        const password = document.getElementById('signup-password')?.value;
        const confirmPassword = document.getElementById('signup-confirm-password')?.value;
        
        if (!firstName || !lastName || !email || !password) {
            this.showNotification('Please fill all fields', 'error');
            return;
        }
        
        if (password !== confirmPassword) {
            this.showNotification('Passwords do not match', 'error');
            return;
        }
        
        if (password.length < 6) {
            this.showNotification('Password must be at least 6 characters', 'error');
            return;
        }
        
        this.showNotification('Creating account...', 'info');
        
        try {
            const response = await fetch(`${this.baseURL}/auth/signup`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ firstName, lastName, email, password })
            });
            
            const data = await response.json();
            
            if (response.ok) {
                this.token = data.access_token;
                this.user = data.user;
                
                localStorage.setItem('token', this.token);
                localStorage.setItem('user', JSON.stringify(this.user));
                
                this.showNotification('Account created!', 'success');
                this.hideModal('signup-modal');
                
                // Show onboarding
                setTimeout(() => {
                    this.showOnboarding();
                }, 500);
            } else {
                this.showNotification(data.error || 'Signup failed', 'error');
            }
        } catch (error) {
            console.error('Signup error:', error);
            this.showNotification('Network error. Using demo mode.', 'warning');
            
            // Demo mode - show onboarding anyway
            this.hideModal('signup-modal');
            setTimeout(() => {
                this.showOnboarding();
            }, 500);
        }
    }
    
    showOnboarding() {
        console.log("Showing onboarding");
        const onboardingModal = document.getElementById('onboarding-modal');
        
        if (onboardingModal) {
            onboardingModal.classList.add('active');
            this.initOnboarding();
        } else {
            alert('Welcome to ReLaunchHer! In the full version, you would now complete your profile.');
            window.location.href = 'dashboard.html';
        }
    }
    
    initOnboarding() {
        let currentStep = 1;
        const totalSteps = 4;
        const selectedSkills = new Set();
        
        const updateProgress = () => {
            const progress = (currentStep / totalSteps) * 100;
            const progressFill = document.querySelector('.progress-fill');
            if (progressFill) progressFill.style.width = `${progress}%`;
            
            document.querySelectorAll('.step').forEach((step, index) => {
                if (index + 1 === currentStep) {
                    step.classList.add('active');
                } else {
                    step.classList.remove('active');
                }
            });
            
            document.querySelectorAll('.onboarding-step').forEach(step => {
                step.classList.remove('active');
            });
            
            const activeStep = document.querySelector(`[data-step="${currentStep}"]`);
            if (activeStep) activeStep.classList.add('active');
            
            const prevBtn = document.getElementById('prev-step');
            if (prevBtn) prevBtn.disabled = currentStep === 1;
            
            const nextBtn = document.getElementById('next-step');
            const submitBtn = document.getElementById('submit-onboarding');
            
            if (nextBtn && submitBtn) {
                if (currentStep === totalSteps) {
                    nextBtn.style.display = 'none';
                    submitBtn.style.display = 'block';
                } else {
                    nextBtn.style.display = 'block';
                    submitBtn.style.display = 'none';
                }
            }
        };
        
        // Next step
        const nextBtn = document.getElementById('next-step');
        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                if (currentStep < totalSteps) {
                    currentStep++;
                    updateProgress();
                }
            });
        }
        
        // Previous step
        const prevBtn = document.getElementById('prev-step');
        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                if (currentStep > 1) {
                    currentStep--;
                    updateProgress();
                }
            });
        }
        
        // Range slider
        const hoursSlider = document.getElementById('available-hours');
        const hoursValue = document.getElementById('hours-value');
        if (hoursSlider && hoursValue) {
            hoursSlider.addEventListener('input', () => {
                hoursValue.textContent = hoursSlider.value;
            });
        }
        
        // Skills chips
        document.querySelectorAll('.chip').forEach(chip => {
            chip.addEventListener('click', () => {
                const skill = chip.dataset.skill;
                
                if (selectedSkills.has(skill)) {
                    selectedSkills.delete(skill);
                    chip.classList.remove('selected');
                } else {
                    selectedSkills.add(skill);
                    chip.classList.add('selected');
                }
                
                this.updateSelectedSkills(selectedSkills);
            });
        });
        
        // Add custom skill
        const addSkillBtn = document.getElementById('add-skill-btn');
        if (addSkillBtn) {
            addSkillBtn.addEventListener('click', () => {
                const customSkill = document.getElementById('custom-skill')?.value.trim();
                
                if (customSkill && !selectedSkills.has(customSkill)) {
                    selectedSkills.add(customSkill);
                    this.updateSelectedSkills(selectedSkills);
                    
                    const chip = document.createElement('div');
                    chip.className = 'chip selected';
                    chip.dataset.skill = customSkill;
                    chip.textContent = customSkill;
                    document.querySelector('.skills-chips')?.appendChild(chip);
                    
                    const input = document.getElementById('custom-skill');
                    if (input) input.value = '';
                }
            });
        }
        
        // Submit onboarding
        const onboardingForm = document.getElementById('onboarding-form');
        if (onboardingForm) {
            onboardingForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                
                this.showNotification('Onboarding completed!', 'success');
                this.hideModal('onboarding-modal');
                
                setTimeout(() => {
                    window.location.href = 'dashboard.html';
                }, 1000);
            });
        }
        
        updateProgress();
    }
    
    updateSelectedSkills(selectedSkills) {
        const container = document.getElementById('selected-skills');
        if (!container) return;
        
        container.innerHTML = '';
        
        selectedSkills.forEach(skill => {
            const skillElement = document.createElement('div');
            skillElement.className = 'selected-skill';
            skillElement.innerHTML = `
                <span>${skill}</span>
                <i class="fas fa-times" data-skill="${skill}"></i>
            `;
            
            skillElement.querySelector('i').addEventListener('click', () => {
                selectedSkills.delete(skill);
                this.updateSelectedSkills(selectedSkills);
                
                const chip = document.querySelector(`.chip[data-skill="${skill}"]`);
                if (chip) chip.classList.remove('selected');
            });
            
            container.appendChild(skillElement);
        });
    }
    
    showNotification(message, type = 'info') {
        // Check if notification container exists
        let container = document.getElementById('notification-container');
        if (!container) {
            container = document.createElement('div');
            container.id = 'notification-container';
            container.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                z-index: 10000;
            `;
            document.body.appendChild(container);
        }
        
        const notification = document.createElement('div');
        notification.style.cssText = `
            background: white;
            padding: 15px 25px;
            border-radius: 50px;
            box-shadow: 0 5px 15px rgba(0,0,0,0.2);
            margin-bottom: 10px;
            display: flex;
            align-items: center;
            gap: 10px;
            animation: slideIn 0.3s ease;
            border-left: 4px solid ${type === 'success' ? '#10B981' : type === 'error' ? '#EF4444' : '#38BDF8'};
        `;
        
        const icon = type === 'success' ? '✓' : type === 'error' ? '✗' : 'ℹ';
        notification.innerHTML = `
            <span style="color: ${type === 'success' ? '#10B981' : type === 'error' ? '#EF4444' : '#38BDF8'}; font-weight: bold;">${icon}</span>
            <span>${message}</span>
        `;
        
        container.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }
    
    redirectToDashboard() {
        window.location.href = 'dashboard.html';
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    console.log("✅ DOM ready, creating Auth instance");
    window.auth = new Auth();
});

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
`;
document.head.appendChild(style);