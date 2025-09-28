class AuthManager {
    constructor() {
        this.token = localStorage.getItem('authToken');
        this.user = JSON.parse(localStorage.getItem('userData') || 'null');
        this.apiBase = 'http://localhost:5000/api';
        this.init();
    }

    init() {
        this.bindAuthEvents();
        this.checkAuthStatus();
    }

    bindAuthEvents() {
        // Login form
        const loginForm = document.getElementById('loginForm');
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => this.handleLogin(e));
        }

        // Register form
        const registerForm = document.getElementById('registerForm');
        if (registerForm) {
            registerForm.addEventListener('submit', (e) => this.handleRegister(e));
        }

        // Show register form
        const showRegister = document.getElementById('showRegister');
        if (showRegister) {
            showRegister.addEventListener('click', (e) => {
                e.preventDefault();
                this.showAuthPage('register');
            });
        }

        // Show login form
        const showLogin = document.getElementById('showLogin');
        if (showLogin) {
            showLogin.addEventListener('click', (e) => {
                e.preventDefault();
                this.showAuthPage('login');
            });
        }

        // Logout button
        const logoutBtn = document.getElementById('logoutBtn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => this.logout());
        }
    }

    showAuthPage(page) {
        document.querySelectorAll('.auth-page').forEach(p => p.classList.remove('active'));
        document.getElementById(page + 'Page').classList.add('active');
    }

    async handleLogin(e) {
        e.preventDefault();
        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;

        try {
            const response = await fetch(`${this.apiBase}/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();

            if (response.ok) {
                this.setAuthData(data.token, data.user);
                this.showNotification('Login successful!', 'success');
                this.showApp();
            } else {
                this.showNotification(data.message || 'Login failed', 'error');
            }
        } catch (error) {
            this.showNotification('Network error. Please try again.', 'error');
        }
    }

    async handleRegister(e) {
        e.preventDefault();
        const username = document.getElementById('registerUsername').value;
        const email = document.getElementById('registerEmail').value;
        const password = document.getElementById('registerPassword').value;

        try {
            const response = await fetch(`${this.apiBase}/auth/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, email, password })
            });

            const data = await response.json();

            if (response.ok) {
                this.setAuthData(data.token, data.user);
                this.showNotification('Registration successful!', 'success');
                this.showApp();
            } else {
                this.showNotification(data.message || 'Registration failed', 'error');
            }
        } catch (error) {
            this.showNotification('Network error. Please try again.', 'error');
        }
    }

    setAuthData(token, user) {
        this.token = token;
        this.user = user;
        localStorage.setItem('authToken', token);
        localStorage.setItem('userData', JSON.stringify(user));
        
        // Apply user's theme preference if available
        if (user && user.themePreference) {
            themeManager.applyTheme(user.themePreference);
        }
    }

    checkAuthStatus() {
        if (this.token && this.user) {
            this.showApp();
        } else {
            this.showAuth();
        }
    }

    showApp() {
        document.getElementById('authPages').classList.remove('active');
        document.getElementById('appPages').classList.add('active');
        this.loadFeedbackHistory();
    }

    showAuth() {
        document.getElementById('appPages').classList.remove('active');
        document.getElementById('authPages').classList.add('active');
        this.showAuthPage('login');
    }

    logout() {
        this.token = null;
        this.user = null;
        localStorage.removeItem('authToken');
        localStorage.removeItem('userData');
        this.showAuth();
        this.showNotification('Logged out successfully', 'success');
    }

    getAuthHeaders() {
        return {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.token}`
        };
    }

    showNotification(message, type = 'info') {
        const notification = document.getElementById('notification');
        notification.textContent = message;
        notification.className = `notification ${type} show`;
        
        setTimeout(() => {
            notification.classList.remove('show');
        }, 3000);
    }

    async loadFeedbackHistory() {
        if (!this.token) return;
        
        try {
            const response = await fetch(`${this.apiBase}/feedback/history`, {
                headers: this.getAuthHeaders()
            });
            
            if (response.ok) {
                const data = await response.json();
                this.displayFeedbackHistory(data.feedbacks);
            }
        } catch (error) {
            console.error('Error loading feedback history:', error);
        }
    }

    displayFeedbackHistory(feedbacks) {
        const feedbackList = document.getElementById('feedbackList');
        if (!feedbackList) return;

        if (!feedbacks || feedbacks.length === 0) {
            feedbackList.innerHTML = '<p class="no-feedback">No feedback submitted yet.</p>';
            return;
        }

        feedbackList.innerHTML = feedbacks.map(feedback => `
            <div class="feedback-item">
                <div class="feedback-item-header">
                    <span class="feedback-item-name">${this.escapeHtml(feedback.name)}</span>
                    <span class="feedback-item-date">${new Date(feedback.createdAt).toLocaleDateString()}</span>
                </div>
                <p class="feedback-item-message">${this.escapeHtml(feedback.message)}</p>
            </div>
        `).join('');
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

// Initialize auth manager
const authManager = new AuthManager();