// Main Application JavaScript

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    // Load testimonials
    loadTestimonials();
    
    // Smooth scroll for navigation
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // Add intersection observer for animations
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, {
        threshold: 0.1
    });
    
    document.querySelectorAll('.feature-card, .step-item, .testimonial-card').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        observer.observe(el);
    });
});

// Load testimonials from API
async function loadTestimonials() {
    try {
        const response = await fetch('http://localhost:5000/api/testimonials');
        const testimonials = await response.json();
        
        const container = document.getElementById('testimonials-container');
        container.innerHTML = testimonials.map(testimonial => `
            <div class="testimonial-card">
                <div class="testimonial-header">
                    <div class="testimonial-avatar">${testimonial.avatar}</div>
                    <div class="testimonial-info">
                        <h4>${testimonial.name}</h4>
                        <p>${testimonial.role}</p>
                    </div>
                </div>
                <div class="testimonial-rating">
                    ${Array(testimonial.rating).fill('<i class="fas fa-star"></i>').join('')}
                </div>
                <p class="testimonial-content">"${testimonial.content}"</p>
            </div>
        `).join('');
    } catch (error) {
        console.error('Error loading testimonials:', error);
    }
}

// Utility functions
function formatCurrency(amount) {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 0
    }).format(amount);
}

function formatDate(date) {
    return new Date(date).toLocaleDateString('en-IN', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}

function showLoading(element) {
    element.innerHTML = '<div class="skeleton" style="height: 200px;"></div>';
}

function hideLoading(element, content) {
    element.innerHTML = content;
}

// Add CSS for notifications
const style = document.createElement('style');
style.textContent = `
    .notification {
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 1rem 1.5rem;
        background: white;
        border-radius: 50px;
        box-shadow: var(--shadow-lg);
        display: flex;
        align-items: center;
        gap: 0.75rem;
        transform: translateX(120%);
        transition: transform 0.3s ease;
        z-index: 3000;
    }
    
    .notification.show {
        transform: translateX(0);
    }
    
    .notification.success {
        border-left: 4px solid var(--success);
    }
    
    .notification.success i {
        color: var(--success);
    }
    
    .notification.error {
        border-left: 4px solid var(--error);
    }
    
    .notification.error i {
        color: var(--error);
    }
    
    .notification.info {
        border-left: 4px solid var(--accent);
    }
    
    .notification.info i {
        color: var(--accent);
    }
`;

document.head.appendChild(style);