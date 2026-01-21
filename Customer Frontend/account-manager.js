/**
 * Account Management Module
 * Handles profile loading, updating, and image upload functionality
 */

class AccountManager {
    constructor() {
        this.apiBaseUrl = CONFIG.API_BASE_URL;
        this.currentUser = null;
        this.init();
    }

    init() {
        this.loadCurrentUser();
        this.setupEventListeners();
        this.loadUserProfile();
        this.loadUserStats();
    }

    loadCurrentUser() {
        const userStr = localStorage.getItem('currentUser');
        if (userStr) {
            try {
                this.currentUser = JSON.parse(userStr);
            } catch (e) {
                console.error('Error parsing user data:', e);
                window.location.href = 'login.html';
            }
        } else {
            window.location.href = 'login.html';
        }
    }

    setupEventListeners() {
        // Profile image upload
        const editProfileBtn = document.getElementById('editProfileBtn');
        const profileImageInput = document.getElementById('profileImageInput');

        if (editProfileBtn && profileImageInput) {
            editProfileBtn.addEventListener('click', () => {
                profileImageInput.click();
            });

            profileImageInput.addEventListener('change', (e) => {
                this.handleImageUpload(e.target.files[0]);
            });
        }

        // Profile update form
        const updateProfileBtn = document.getElementById('updateProfileBtn');
        if (updateProfileBtn) {
            updateProfileBtn.addEventListener('click', () => {
                this.updateProfile();
            });
        }
    }

    async loadUserProfile() {
        if (!this.currentUser || !this.currentUser.id) return;

        try {
            const response = await fetch(`${this.apiBaseUrl}/customer/${this.currentUser.id}/`);
            if (response.ok) {
                const userData = await response.json();
                this.displayUserProfile(userData);
            } else {
                console.error('Failed to load user profile');
            }
        } catch (error) {
            console.error('Error loading user profile:', error);
        }
    }

    displayUserProfile(userData) {
        // Update profile name and email
        const profileName = document.getElementById('profileName');
        const profileEmail = document.getElementById('profileEmail');

        if (profileName) profileName.textContent = userData.name || 'N/A';
        if (profileEmail) profileEmail.textContent = userData.email || 'N/A';

        // Update profile image
        const profileImage = document.getElementById('profileImage');
        if (profileImage && userData.profile_image) {
            // Check if it's base64 or a file path
            if (userData.profile_image.startsWith('data:image')) {
                profileImage.src = userData.profile_image;
            } else {
                // Assume it's base64 without data URL prefix
                profileImage.src = `data:image/jpeg;base64,${userData.profile_image}`;
            }
            profileImage.style.opacity = '1';
        }

        // Update navbar user name
        const userNameDisplay = document.getElementById('userNameDisplay');
        if (userNameDisplay) {
            userNameDisplay.textContent = userData.name || 'User';
        }

        // Populate form fields if they exist
        const nameInput = document.getElementById('name');
        const emailInput = document.getElementById('email');
        const phoneInput = document.getElementById('phone_number');

        if (nameInput) nameInput.value = userData.name || '';
        if (emailInput) emailInput.value = userData.email || '';
        if (phoneInput) phoneInput.value = userData.phone_number || '';
    }

    async loadUserStats() {
        if (!this.currentUser || !this.currentUser.id) return;

        // Use customer policy manager if available
        if (window.customerPolicyManager) {
            // Wait a bit for customer policies to load
            setTimeout(async () => {
                const activePolicies = window.customerPolicyManager.getActivePolicies().length;
                const totalPremium = window.customerPolicyManager.getTotalPremiumPaid();

                // Update stats cards
                const activePoliciesElement = document.getElementById('activePoliciesCount');
                if (activePoliciesElement) {
                    activePoliciesElement.textContent = activePolicies;
                }

                const totalPaymentsElement = document.getElementById('totalPaymentsCount');
                if (totalPaymentsElement) {
                    totalPaymentsElement.textContent = `₹${totalPremium.toLocaleString()}`;
                }

                // Claims count - load from API
                try {
                    const claimsResponse = await fetch(`${this.apiBaseUrl}/claims/statistics/?customer_id=${this.currentUser.id}`);
                    if (claimsResponse.ok) {
                        const claimsStats = await claimsResponse.json();
                        const totalClaimsElement = document.getElementById('totalClaimsCount');
                        if (totalClaimsElement) {
                            totalClaimsElement.textContent = claimsStats.total_claims || 0;
                        }
                    }
                } catch (error) {
                    console.error('Error loading claims stats:', error);
                    const totalClaimsElement = document.getElementById('totalClaimsCount');
                    if (totalClaimsElement) {
                        totalClaimsElement.textContent = '0';
                    }
                }
            }, 1000);
        } else {
            // Fallback: load from API directly
            try {
                const response = await fetch(`${this.apiBaseUrl}/customerpolicy/`);
                if (response.ok) {
                    const policies = await response.json();
                    const userPolicies = policies.filter(policy => policy.customer_id === this.currentUser.id);
                    this.displayUserStats(userPolicies);
                }
            } catch (error) {
                console.error('Error loading user stats:', error);
            }
        }
    }

    async displayUserStats(policies) {
        // Count active policies
        const activePolicies = policies.filter(policy => policy.status === 'active').length;

        // Update stats cards
        const activePoliciesElement = document.getElementById('activePoliciesCount');
        if (activePoliciesElement) {
            activePoliciesElement.textContent = activePolicies;
        }

        // Load claims statistics
        try {
            const claimsResponse = await fetch(`${this.apiBaseUrl}/claims/statistics/?customer_id=${this.currentUser.id}`);
            if (claimsResponse.ok) {
                const claimsStats = await claimsResponse.json();
                const totalClaims = document.getElementById('totalClaimsCount');
                if (totalClaims) totalClaims.textContent = claimsStats.total_claims || 0;
            }
        } catch (error) {
            console.error('Error loading claims stats:', error);
            const totalClaims = document.getElementById('totalClaimsCount');
            if (totalClaims) totalClaims.textContent = '0';
        }

        // Calculate total premium paid
        const totalPremium = policies.reduce((sum, policy) => sum + (policy.premium_amount_paid || 0), 0);
        const totalPayments = document.getElementById('totalPaymentsCount');
        if (totalPayments) totalPayments.textContent = `₹${totalPremium.toLocaleString()}`;
    }

    async handleImageUpload(file) {
        if (!file || !this.currentUser || !this.currentUser.id) return;

        // Validate file type
        if (!file.type.match('image/(png|jpg|jpeg)')) {
            alert('Please select a PNG or JPG image file.');
            return;
        }

        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            alert('File size must be less than 5MB.');
            return;
        }

        try {
            // Convert file to base64
            const base64String = await this.fileToBase64(file);

            // Update profile via API
            const updateData = {
                profile_image: base64String
            };

            const response = await fetch(`${this.apiBaseUrl}/customer/${this.currentUser.id}/`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updateData)
            });

            if (response.ok) {
                const result = await response.json();
                alert('Profile image uploaded successfully!');

                // Update the displayed image
                const profileImage = document.getElementById('profileImage');
                if (profileImage) {
                    profileImage.src = `data:image/jpeg;base64,${base64String}`;
                    profileImage.style.opacity = '1';
                }

                // Update localStorage
                this.currentUser.profile_image = base64String;
                localStorage.setItem('currentUser', JSON.stringify(this.currentUser));

            } else {
                const error = await response.json();
                alert(`Upload failed: ${JSON.stringify(error)}`);
            }
        } catch (error) {
            console.error('Error uploading image:', error);
            alert('Error uploading image. Please try again.');
        }
    }

    fileToBase64(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => {
                // Remove the data:image/jpeg;base64, prefix
                const base64 = reader.result.split(',')[1];
                resolve(base64);
            };
            reader.onerror = error => reject(error);
        });
    }

    async updateProfile() {
        if (!this.currentUser || !this.currentUser.id) return;

        const nameInput = document.getElementById('name');
        const emailInput = document.getElementById('email');
        const phoneInput = document.getElementById('phone_number');
        const currentPasswordInput = document.getElementById('current_password');
        const newPasswordInput = document.getElementById('new_password');

        const updateData = {};

        if (nameInput && nameInput.value) updateData.name = nameInput.value;
        if (emailInput && emailInput.value) updateData.email = emailInput.value;
        if (phoneInput && phoneInput.value) updateData.phone_number = phoneInput.value;
        if (newPasswordInput && newPasswordInput.value) updateData.password = newPasswordInput.value;

        // If changing password, require current password
        if (newPasswordInput && newPasswordInput.value && (!currentPasswordInput || !currentPasswordInput.value)) {
            alert('Please enter your current password to change password.');
            return;
        }

        try {
            const response = await fetch(`${this.apiBaseUrl}/customer/${this.currentUser.id}/`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updateData)
            });

            if (response.ok) {
                const result = await response.json();
                alert('Profile updated successfully!');

                // Update localStorage
                this.currentUser.name = result.name;
                this.currentUser.email = result.email;
                this.currentUser.phone_number = result.phone_number;
                localStorage.setItem('currentUser', JSON.stringify(this.currentUser));

                // Refresh display
                this.displayUserProfile(result);

            } else {
                const error = await response.json();
                alert(`Update failed: ${JSON.stringify(error)}`);
            }
        } catch (error) {
            console.error('Error updating profile:', error);
            alert('Error updating profile. Please try again.');
        }
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    window.accountManager = new AccountManager();
});