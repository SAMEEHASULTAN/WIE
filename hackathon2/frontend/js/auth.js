console.log("✅ auth.js loaded");

class Auth {
    constructor() {
        this.baseURL = 'http://localhost:5000/api';
        this.token = localStorage.getItem('token') || sessionStorage.getItem('token');
        this.user = JSON.parse(localStorage.getItem('user') || sessionStorage.getItem('user') || '{}');
        this.init();
    }
    
    init() {
        this.setupEventListeners();
    }
    
    setupEventListeners() {
        const loginBtn = document.getElementById('login-btn') || document.querySelector('.btn-secondary');
        const signupBtn = document.getElementById('signup-btn') || document.querySelector('.btn-primary');
        const startBtn = document.getElementById('start-journey-btn');
        const ctaBtn = document.getElementById('cta-start-btn');
        const watchBtn = document.getElementById('watch-stories-btn');
        
        if (loginBtn) loginBtn.onclick = () => this.showModal('login-modal');
        if (signupBtn) signupBtn.onclick = () => this.showModal('signup-modal');
        if (startBtn) startBtn.onclick = () => this.showModal('signup-modal');
        if (ctaBtn) ctaBtn.onclick = () => this.showModal('signup-modal');
        if (watchBtn) watchBtn.onclick = () => alert("✨ Success Stories coming soon!");
        
        document.querySelectorAll('.close').forEach(btn => {
            btn.onclick = () => btn.closest('.modal')?.classList.remove('active');
        });
        
        document.getElementById('login-form')?.addEventListener('submit', e => { e.preventDefault(); this.login(); });
        document.getElementById('signup-form')?.addEventListener('submit', e => { e.preventDefault(); this.signup(); });
        
        document.getElementById('show-signup')?.addEventListener('click', e => { e.preventDefault(); this.hideModal('login-modal'); this.showModal('signup-modal'); });
        document.getElementById('show-login')?.addEventListener('click', e => { e.preventDefault(); this.hideModal('signup-modal'); this.showModal('login-modal'); });
    }
    
    showModal(id) { document.getElementById(id)?.classList.add('active'); }
    hideModal(id) { document.getElementById(id)?.classList.remove('active'); }
    
    async login() {
        const email = document.getElementById('login-email')?.value;
        const password = document.getElementById('login-password')?.value;
        if (!email || !password) return this.showNotification('Please fill all fields', 'error');
        
        this.showNotification('Logging in...', 'info');
        setTimeout(() => {
            const demoUser = { firstName: email.split('@')[0], lastName: 'User', email: email };
            localStorage.setItem('token', 'demo-token');
            localStorage.setItem('user', JSON.stringify(demoUser));
            this.showNotification('Login successful!', 'success');
            this.hideModal('login-modal');
            setTimeout(() => window.location.href = 'dashboard.html', 500);
        }, 500);
    }
    
    async signup() {
        const firstName = document.getElementById('signup-firstname')?.value;
        const lastName = document.getElementById('signup-lastname')?.value;
        const email = document.getElementById('signup-email')?.value;
        const password = document.getElementById('signup-password')?.value;
        const confirm = document.getElementById('signup-confirm-password')?.value;
        
        if (!firstName || !lastName || !email || !password) return this.showNotification('Please fill all fields', 'error');
        if (password !== confirm) return this.showNotification('Passwords do not match', 'error');
        
        this.showNotification('Creating account...', 'info');
        setTimeout(() => {
            const user = { firstName, lastName, email };
            localStorage.setItem('token', 'demo-token');
            localStorage.setItem('user', JSON.stringify(user));
            this.showNotification('Account created!', 'success');
            this.hideModal('signup-modal');
            setTimeout(() => this.showOnboarding(), 500);
        }, 500);
    }
    
    showOnboarding() {
        const modal = document.getElementById('onboarding-modal');
        if (modal) { modal.classList.add('active'); this.initOnboarding(); }
        else window.location.href = 'dashboard.html';
    }
    
    initOnboarding() {
        let step = 1;
        const skills = new Set();
        
        const update = () => {
            document.querySelector('.progress-fill').style.width = `${(step/4)*100}%`;
            document.querySelectorAll('.step').forEach((s, i) => s.classList.toggle('active', i+1 === step));
            document.querySelectorAll('.onboarding-step').forEach(s => s.classList.remove('active'));
            document.querySelector(`[data-step="${step}"]`)?.classList.add('active');
            document.getElementById('prev-step').disabled = step === 1;
            const isLast = step === 4;
            document.getElementById('next-step').style.display = isLast ? 'none' : 'block';
            document.getElementById('submit-onboarding').style.display = isLast ? 'block' : 'none';
        };
        
        document.getElementById('next-step')?.addEventListener('click', () => { if(step<4) { step++; update(); } });
        document.getElementById('prev-step')?.addEventListener('click', () => { if(step>1) { step--; update(); } });
        document.getElementById('available-hours')?.addEventListener('input', e => document.getElementById('hours-value').textContent = e.target.value);
        
        document.querySelectorAll('.chip').forEach(chip => {
            chip.onclick = () => {
                const skill = chip.dataset.skill;
                if(skills.has(skill)) skills.delete(skill);
                else skills.add(skill);
                chip.classList.toggle('selected');
                this.updateSelectedSkills(skills);
            };
        });
        
        document.getElementById('add-skill-btn')?.addEventListener('click', () => {
            const custom = document.getElementById('custom-skill')?.value.trim();
            if(custom && !skills.has(custom)) {
                skills.add(custom);
                const chip = document.createElement('div');
                chip.className = 'chip selected';
                chip.dataset.skill = custom;
                chip.textContent = custom;
                chip.onclick = () => { skills.delete(custom); chip.remove(); this.updateSelectedSkills(skills); };
                document.querySelector('.skills-chips')?.appendChild(chip);
                document.getElementById('custom-skill').value = '';
                this.updateSelectedSkills(skills);
            }
        });
        
        document.getElementById('onboarding-form')?.addEventListener('submit', e => {
            e.preventDefault();
            this.showNotification('Onboarding completed!', 'success');
            this.hideModal('onboarding-modal');
            setTimeout(() => window.location.href = 'dashboard.html', 500);
        });
        
        update();
    }
    
    updateSelectedSkills(skills) {
        const container = document.getElementById('selected-skills');
        if(!container) return;
        container.innerHTML = '';
        skills.forEach(skill => {
            const el = document.createElement('div');
            el.className = 'selected-skill';
            el.innerHTML = `<span>${skill}</span><i class="fas fa-times"></i>`;
            el.querySelector('i').onclick = () => {
                skills.delete(skill);
                this.updateSelectedSkills(skills);
                document.querySelector(`.chip[data-skill="${skill}"]`)?.classList.remove('selected');
            };
            container.appendChild(el);
        });
    }
    
    showNotification(msg, type) {
        let container = document.getElementById('notification-container');
        if(!container) {
            container = document.createElement('div');
            container.id = 'notification-container';
            container.style.cssText = 'position:fixed;top:20px;right:20px;z-index:10000';
            document.body.appendChild(container);
        }
        const colors = {success:'#10B981', error:'#EF4444', info:'#38BDF8'};
        const notif = document.createElement('div');
        notif.style.cssText = `background:white;padding:12px 20px;border-radius:50px;box-shadow:0 5px 15px rgba(0,0,0,0.2);margin-bottom:10px;display:flex;align-items:center;gap:10px;border-left:4px solid ${colors[type]}`;
        notif.innerHTML = `<span style="color:${colors[type]}">${type==='success'?'✓':type==='error'?'✗':'ℹ'}</span><span>${msg}</span>`;
        container.appendChild(notif);
        setTimeout(() => notif.remove(), 3000);
    }
}

document.addEventListener('DOMContentLoaded', () => { if(!window.auth) window.auth = new Auth(); });