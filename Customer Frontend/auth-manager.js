/**
 * Authentication and Session Management Module
 * Provides utilities for handling user login, logout, and session persistence
 */

class AuthManager {
    constructor() {
        this.currentUser = null;
        this.loadSession();
    }

    /**
     * Load session from localStorage
     */
    loadSession() {
        const userStr = localStorage.getItem('currentUser');
        if (userStr) {
            try {
                this.currentUser = JSON.parse(userStr);
            } catch (e) {
                console.error('Error parsing user session:', e);
                this.currentUser = null;
            }
        }
    }

    /**
     * Check if user is logged in
     */
    isLoggedIn() {
        return this.currentUser !== null && this.currentUser.id;
    }

    /**
     * Get current user
     */
    getCurrentUser() {
        return this.currentUser;
    }

    /**
     * Get user type (customer or agent)
     */
    getUserType() {
        return this.currentUser ? this.currentUser.userType : null;
    }

    /**
     * Get user name
     */
    getUserName() {
        return this.currentUser ? this.currentUser.name : null;
    }

    /**
     * Get user email
     */
    getUserEmail() {
        return this.currentUser ? this.currentUser.email : null;
    }

    /**
     * Get user ID
     */
    getUserId() {
        return this.currentUser ? this.currentUser.id : null;
    }

    /**
     * Logout user
     */
    logout() {
        localStorage.removeItem('currentUser');
        this.currentUser = null;
        // Redirect to login page
        window.location.href = 'login.html';
    }

    /**
     * Update user session
     */
    updateSession(userData) {
        this.currentUser = userData;
        localStorage.setItem('currentUser', JSON.stringify(userData));
    }

    /**
     * Check if user is customer
     */
    isCustomer() {
        return this.currentUser && this.currentUser.userType === 'customer';
    }

    /**
     * Check if user is agent
     */
    isAgent() {
        return this.currentUser && this.currentUser.userType === 'agent';
    }

    /**
     * Require authentication (redirect to login if not authenticated)
     */
    requireAuth() {
        if (!this.isLoggedIn()) {
            window.location.href = 'login.html';
        }
    }

    /**
     * Display user info in navbar
     */
    displayUserInNavbar() {
        if (!this.isLoggedIn()) {
            return;
        }

        const userNameElement = document.getElementById('user-name');
        const userTypeElement = document.getElementById('user-type');
        
        if (userNameElement) {
            userNameElement.textContent = this.getUserName();
        }
        
        if (userTypeElement) {
            const type = this.getUserType();
            userTypeElement.textContent = type.charAt(0).toUpperCase() + type.slice(1);
            userTypeElement.classList.add(type === 'agent' ? 'badge-primary' : 'badge-success');
        }
    }

    /**
     * Create logout button
     */
    createLogoutButton(containerId) {
        const container = document.getElementById(containerId);
        if (!container) return;

        const logoutBtn = document.createElement('button');
        logoutBtn.className = 'btn btn-danger btn-sm';
        logoutBtn.innerHTML = '<i class="fas fa-sign-out-alt"></i> Logout';
        logoutBtn.addEventListener('click', () => this.logout());
        
        container.appendChild(logoutBtn);
    }

    /**
     * Show user profile info
     */
    showUserProfile() {
        if (!this.isLoggedIn()) {
            return null;
        }

        return {
            id: this.getUserId(),
            name: this.getUserName(),
            email: this.getUserEmail(),
            type: this.getUserType(),
            fullData: this.getCurrentUser()
        };
    }
}

// Create global instance
const authManager = new AuthManager();

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    // Display user info in navbar if logged in
    if (authManager.isLoggedIn()) {
        authManager.displayUserInNavbar();
    }
    
    // Log current user for debugging
    console.log('Current User:', authManager.getCurrentUser());
});
