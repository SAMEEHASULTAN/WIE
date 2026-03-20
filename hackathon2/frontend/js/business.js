// business-fix.js
console.log("✅ business-fix.js loaded");

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
    
    // Skills chips selection
    document.querySelectorAll('#business-skills .chip').forEach(chip => {
        chip.addEventListener('click', function() {
            this.classList.toggle('selected');
        });
    });
    
    // Generate ideas button
    const generateBtn = document.getElementById('generate-ideas');
    if (generateBtn) {
        generateBtn.addEventListener('click', function() {
            const selectedSkills = document.querySelectorAll('#business-skills .chip.selected').length;
            if (selectedSkills === 0) {
                alert('Please select at least one skill');
                return;
            }
            
            // Show results section
            document.getElementById('results-section').style.display = 'block';
            
            // Generate demo ideas
            const grid = document.getElementById('business-ideas-grid');
            grid.innerHTML = generateDemoIdeas();
            
            // Scroll to results
            document.getElementById('results-section').scrollIntoView({ behavior: 'smooth' });
        });
    }
    
    // Regenerate button
    const regenerateBtn = document.getElementById('regenerate-ideas');
    if (regenerateBtn) {
        regenerateBtn.addEventListener('click', function() {
            const grid = document.getElementById('business-ideas-grid');
            grid.innerHTML = generateDemoIdeas();
        });
    }
    
    // Close modal
    document.querySelectorAll('#business-modal .close').forEach(btn => {
        btn.addEventListener('click', function() {
            document.getElementById('business-modal').classList.remove('active');
        });
    });
});

function generateDemoIdeas() {
    const ideas = [
        {
            title: "Virtual Assistant Services",
            desc: "Provide administrative, creative, or technical support to businesses and entrepreneurs remotely.",
            cost: "₹5,000 - ₹15,000",
            profit: "₹15,000 - ₹40,000/month",
            time: "1-2 weeks",
            bestMatch: 85
        },
        {
            title: "Handmade Crafts Business",
            desc: "Create and sell handmade products like jewelry, home decor, candles, or personalized gifts.",
            cost: "₹3,000 - ₹10,000",
            profit: "₹5,000 - ₹30,000/month",
            time: "1-3 weeks",
            bestMatch: 92
        },
        {
            title: "Online Tutoring",
            desc: "Share your knowledge by teaching students online in subjects you excel at.",
            cost: "₹2,000 - ₹8,000",
            profit: "₹10,000 - ₹50,000/month",
            time: "1 week",
            bestMatch: 78
        },
        {
            title: "Social Media Management",
            desc: "Help small businesses grow their online presence by managing their social media accounts.",
            cost: "₹10,000 - ₹25,000",
            profit: "₹20,000 - ₹60,000/month",
            time: "2-4 weeks",
            bestMatch: 88
        },
        {
            title: "Healthy Food Business",
            desc: "Prepare and deliver healthy, homemade snacks and meals to health-conscious customers.",
            cost: "₹15,000 - ₹40,000",
            profit: "₹15,000 - ₹70,000/month",
            time: "3-5 weeks",
            bestMatch: 75
        }
    ];
    
    return ideas.map(idea => `
        <div class="business-card" onclick="showBusinessDetails('${idea.title}')">
            ${idea.bestMatch > 80 ? '<div class="best-match-badge">Best Match</div>' : ''}
            <h3 class="business-title">${idea.title}</h3>
            <p class="business-desc">${idea.desc}</p>
            <div class="business-meta">
                <div class="meta-item">
                    <span class="meta-label">Startup Cost</span>
                    <span class="meta-value">${idea.cost}</span>
                </div>
                <div class="meta-item">
                    <span class="meta-label">Expected Profit</span>
                    <span class="meta-value">${idea.profit}</span>
                </div>
                <div class="meta-item">
                    <span class="meta-label">Time to Start</span>
                    <span class="meta-value">${idea.time}</span>
                </div>
            </div>
            <div class="business-actions">
                <button class="btn-secondary view-details" onclick="event.stopPropagation(); showBusinessDetails('${idea.title}')">View Details</button>
                <button class="btn-icon save-idea" onclick="event.stopPropagation(); alert('Idea saved!')">
                    <i class="far fa-bookmark"></i>
                </button>
            </div>
        </div>
    `).join('');
}

function showBusinessDetails(title) {
    const modal = document.getElementById('business-modal');
    const details = document.getElementById('business-details');
    
    details.innerHTML = `
        <div class="business-detail">
            <h2>${title}</h2>
            <p class="description">Complete guide to start your ${title.toLowerCase()} business.</p>
            
            <div class="detail-section">
                <h3>Step-by-Step Execution Plan</h3>
                <ol class="execution-list">
                    <li>Research your target market</li>
                    <li>Create a business plan</li>
                    <li>Register your business</li>
                    <li>Set up your workspace</li>
                    <li>Market your services</li>
                    <li>Start with first clients</li>
                </ol>
            </div>
            
            <div class="detail-section">
                <h3>Required Tools & Resources</h3>
                <ul class="tools-list">
                    <li>Computer/Laptop with internet</li>
                    <li>Professional email and website</li>
                    <li>Accounting software</li>
                    <li>Marketing materials</li>
                </ul>
            </div>
            
            <div class="detail-section">
                <h3>Marketing Strategy</h3>
                <ul class="marketing-list">
                    <li>Create social media presence</li>
                    <li>Network with potential clients</li>
                    <li>Offer referral discounts</li>
                    <li>Collect and showcase testimonials</li>
                </ul>
            </div>
            
            <div class="detail-actions">
                <button class="btn-primary" onclick="alert('Idea saved!')">Save This Idea</button>
                <button class="btn-secondary" onclick="document.getElementById('business-modal').classList.remove('active')">Close</button>
            </div>
        </div>
    `;
    
    modal.classList.add('active');
}

function handleLogout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('user');
    window.location.href = 'index.html';
}