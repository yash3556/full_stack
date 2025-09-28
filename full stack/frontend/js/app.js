class App {
    constructor() {
        this.currentPage = 'home';
        this.init();
    }

    init() {
        this.bindNavigation();
        this.bindFeedbackForm();
        this.initAnimations();
    }

    bindNavigation() {
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const page = link.getAttribute('data-page');
                this.navigateTo(page);
            });
        });
    }

    bindFeedbackForm() {
        const feedbackForm = document.getElementById('feedbackForm');
        if (feedbackForm) {
            feedbackForm.addEventListener('submit', (e) => this.handleFeedbackSubmit(e));
        }
    }

    navigateTo(page) {
        // Update active navigation link
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
        });
        document.querySelector(`[data-page="${page}"]`).classList.add('active');

        // Update active page
        document.querySelectorAll('.app-page').forEach(pageEl => {
            pageEl.classList.remove('active');
        });
        document.getElementById(`${page}Page`).classList.add('active');

        this.currentPage = page;

        // Load page-specific content
        if (page === 'feedback') {
            authManager.loadFeedbackHistory();
        }
    }

    async handleFeedbackSubmit(e) {
        e.preventDefault();
        
        if (!authManager.token) {
            authManager.showNotification('Please log in to submit feedback', 'error');
            return;
        }

        const submitBtn = e.target.querySelector('.submit-btn');
        const originalText = submitBtn.innerHTML;
        
        // Add loading state
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
        submitBtn.classList.add('loading');
        submitBtn.disabled = true;

        const name = document.getElementById('feedbackName').value;
        const email = document.getElementById('feedbackEmail').value;
        const message = document.getElementById('feedbackMessage').value;

        try {
            const response = await fetch(`${authManager.apiBase}/feedback/submit`, {
                method: 'POST',
                headers: authManager.getAuthHeaders(),
                body: JSON.stringify({ name, email, message })
            });

            const data = await response.json();

            if (response.ok) {
                authManager.showNotification('Feedback submitted successfully!', 'success');
                document.getElementById('feedbackForm').reset();
                authManager.loadFeedbackHistory();
                
                // Add success animation
                submitBtn.innerHTML = '<i class="fas fa-check"></i> Sent!';
                submitBtn.style.background = 'linear-gradient(135deg, #10b981 0%, #059669 100%)';
                
                setTimeout(() => {
                    submitBtn.innerHTML = originalText;
                    submitBtn.style.background = '';
                    submitBtn.classList.remove('loading');
                    submitBtn.disabled = false;
                }, 2000);
            } else {
                authManager.showNotification(data.message || 'Error submitting feedback', 'error');
                submitBtn.innerHTML = originalText;
                submitBtn.classList.remove('loading');
                submitBtn.disabled = false;
            }
        } catch (error) {
            authManager.showNotification('Network error. Please try again.', 'error');
            submitBtn.innerHTML = originalText;
            submitBtn.classList.remove('loading');
            submitBtn.disabled = false;
        }
    }

    initAnimations() {
        // Intersection Observer for scroll animations
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                }
            });
        }, observerOptions);

        // Observe elements for animation
        document.querySelectorAll('.stat-card, .auth-card, .feedback-item').forEach(el => {
            observer.observe(el);
        });

        // Add CSS for animations
        this.addAnimationStyles();
    }

    addAnimationStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .stat-card, .auth-card, .feedback-item, .hero-content, .hero-visual {
                opacity: 0;
                transform: translateY(30px);
                transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1);
            }
            
            .animate-in {
                opacity: 1;
                transform: translateY(0);
            }
            
            .stat-card:nth-child(1) { transition-delay: 0.1s; }
            .stat-card:nth-child(2) { transition-delay: 0.2s; }
            .stat-card:nth-child(3) { transition-delay: 0.3s; }
            
            .hero-content {
                transition-delay: 0.2s;
            }
            
            .hero-visual {
                transition-delay: 0.4s;
            }
            
            .feedback-item:nth-child(odd) {
                transition-delay: 0.1s;
            }
            
            .feedback-item:nth-child(even) {
                transition-delay: 0.2s;
            }
            
            /* Hover animations */
            .stat-card:hover {
                animation: pulse 0.6s ease-in-out;
            }
            
            @keyframes pulse {
                0% { transform: translateY(-8px) scale(1.02); }
                50% { transform: translateY(-12px) scale(1.05); }
                100% { transform: translateY(-8px) scale(1.02); }
            }
            
            /* Button press animation */
            .auth-btn:active, .submit-btn:active {
                animation: press 0.2s ease;
            }
            
            @keyframes press {
                0% { transform: translateY(-3px) scale(1.02); }
                100% { transform: translateY(0) scale(0.98); }
            }
        `;
        document.head.appendChild(style);
    }
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new App();
});