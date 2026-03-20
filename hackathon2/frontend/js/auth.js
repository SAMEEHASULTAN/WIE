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
        this.setupEventListeners();
    }
    
    setupEventListeners() {
        console.log("✅ Setting up event listeners");
        
        // Get buttons by ID first (most reliable)
        const loginBtn = document.getElementById('login-btn') || document.querySelector('.btn-secondary');
        const signupBtn = document.getElementById('signup-btn') || document.querySelector('.btn-primary');
        const startBtn = document.getElementById('start-journey-btn') || document.querySelector('.btn-large');
        const watchBtn = document.getElementById('watch-stories-btn') || document.querySelectorAll('.btn-large')[1];
        const ctaBtn = document.getElementById('cta-start-btn');
        
        console.log("Login button found:", !!loginBtn);
        console.log("Signup button found:", !!signupBtn);
        console.log("Start button found:", !!startBtn);
        console.log("Watch button found:", !!watchBtn);
        console.log("CTA button found:", !!ctaBtn);
        
        // Add click listeners
        if (loginBtn) {
            loginBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log("Login clicked");
                this.showModal('login-modal');
            });
        }
        
        if (signupBtn) {
            signupBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log("Signup clicked");
                this.showModal('signup-modal');
            });
        }
        
        if (startBtn) {
            startBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log("Start clicked");
                this.showModal('signup-modal');
            });
        }
        
        if (ctaBtn) {
            ctaBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log("CTA clicked");
                this.showModal('signup-modal');
            });
        }
        
        if (watchBtn) {
            watchBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log("Watch clicked");
                this.showTestimonials();
            });
        }
        
        // Setup close buttons for modals
        document.querySelectorAll('.close').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const modal = btn.closest('.modal');
                if (modal) {
                    modal.classList.remove('active');
                }
                document.body.style.overflow = '';
            });
        });
        
        // Click outside modal to close
        window.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal')) {
                e.target.classList.remove('active');
                document.body.style.overflow = '';
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
    }
    
    showModal(modalId) {
        console.log("Showing modal:", modalId);
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.add('active');
            document.body.style.overflow = 'hidden'; // Prevent scrolling
        } else {
            console.error("Modal not found:", modalId);
            alert(`Opening ${modalId.replace('-modal', '')}...`);
        }
    }
    
    hideModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.remove('active');
            document.body.style.overflow = ''; // Restore scrolling
        }
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
        
        // For demo purposes, just redirect to dashboard
        setTimeout(() => {
            // Store demo user data
            const demoUser = {
                firstName: email.split('@')[0],
                lastName: 'User',
                email: email
            };
            
            if (remember) {
                localStorage.setItem('token', 'demo-token');
                localStorage.setItem('user', JSON.stringify(demoUser));
            } else {
                sessionStorage.setItem('token', 'demo-token');
                sessionStorage.setItem('user', JSON.stringify(demoUser));
            }
            
            this.showNotification('Login successful! Redirecting...', 'success');
            this.hideModal('login-modal');
            
            // Redirect to dashboard
            setTimeout(() => {
                window.location.href = 'dashboard.html';
            }, 1000);
        }, 500);
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
        
        this.showNotification('Creating account...', 'info');
        
        // For demo purposes
        setTimeout(() => {
            // Store user data
            const user = { firstName, lastName, email };
            localStorage.setItem('token', 'demo-token');
            localStorage.setItem('user', JSON.stringify(user));
            
            this.showNotification('Account created!', 'success');
            this.hideModal('signup-modal');
            
            // Show onboarding
            setTimeout(() => {
                this.showOnboarding();
            }, 500);
        }, 500);
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
    
    // FIXED: Added the missing setupOnboarding function
    setupOnboarding() {
        console.log("Setting up onboarding");
        // This function is called but we're using initOnboarding directly
        // Keeping for compatibility
        if (document.getElementById('onboarding-modal')) {
            this.initOnboarding();
        }
    }
    
    initOnboarding() {
        console.log("Initializing onboarding");
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
    // Check if auth already exists to avoid duplicates
    if (!window.auth) {
        window.auth = new Auth();
    }
});

// Also initialize if DOM is already loaded
if (document.readyState === 'complete' || document.readyState === 'interactive') {
    setTimeout(() => {
        if (!window.auth) {
            console.log("DOM already ready, creating Auth now");
            window.auth = new Auth();
        }
    }, 100);
}