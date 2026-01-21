/**
 * Home/Dashboard Management Module
 * Handles dynamic content display based on user authentication status
 */

class HomeManager {
    constructor() {
        this.init();
    }

    init() {
        this.checkAuthStatus();
        this.setupEventListeners();
    }

    checkAuthStatus() {
        const currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null');
        if (currentUser) {
            this.showLoggedInContent(currentUser);
        } else {
            this.showLoggedOutContent();
        }
    }

    showLoggedInContent(user) {
        // Update hero section for logged-in users
        const heroContent = document.querySelector('.hero-content');
        if (heroContent) {
            const welcomeMessage = heroContent.querySelector('h1');
            if (welcomeMessage) {
                welcomeMessage.innerHTML = `Welcome back, <span class="text-primary">${user.name}</span>!`;
            }

            const subtitle = heroContent.querySelector('p');
            if (subtitle) {
                subtitle.textContent = 'Continue your insurance journey with personalized recommendations and easy management.';
            }

            // Update CTA buttons
            const ctaButtons = heroContent.querySelector('.d-flex');
            if (ctaButtons) {
                ctaButtons.innerHTML = `
                    <a href="policies.html" class="btn btn-light btn-lg btn-glow">Browse Policies <i class="fas fa-arrow-right ms-2"></i></a>
                    <a href="account.html" class="btn btn-outline-light btn-lg">My Account</a>
                `;
            }
        }

        // Update navbar user display
        this.updateNavbarUser(user);
    }

    showLoggedOutContent() {
        // Ensure navbar shows login/signup for non-authenticated users
        const userDropdown = document.getElementById('userDropdown');
        if (userDropdown) {
            userDropdown.innerHTML = `
                <i class="fas fa-user me-1"></i> Login
            `;
            userDropdown.setAttribute('onclick', "window.location.href='login.html'");
            userDropdown.classList.remove('dropdown-toggle');
            userDropdown.removeAttribute('data-bs-toggle');
        }
    }

    updateNavbarUser(user) {
        const userNameDisplay = document.getElementById('userNameDisplay');
        if (userNameDisplay) {
            userNameDisplay.textContent = user.name || 'User';
        }
    }

    setupEventListeners() {
        // Add click handlers for service cards if needed
        const serviceCards = document.querySelectorAll('.service-card');
        serviceCards.forEach(card => {
            card.addEventListener('click', (e) => {
                // Check if user is logged in for certain actions
                const currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null');
                const href = card.getAttribute('href');

                if (!currentUser && (href === 'account.html' || href === 'policies.html' || href === 'claims.html')) {
                    e.preventDefault();
                    if (confirm('Please login to access this feature. Would you like to login now?')) {
                        window.location.href = 'login.html';
                    }
                }
            });
        });
    }

    // Method to refresh content when user logs in/out
    refreshContent() {
        this.checkAuthStatus();
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    window.homeManager = new HomeManager();
});