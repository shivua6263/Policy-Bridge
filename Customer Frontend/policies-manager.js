/**
 * Policies Management Module
 * Handles fetching, displaying, and filtering insurance policies
 */

class PoliciesManager {
    constructor() {
        this.apiBaseUrl = CONFIG.API_BASE_URL;
        this.policies = [];
        this.filteredPolicies = [];
        this.currentFilter = 'all';
        this.init();
    }

    async init() {
        await this.loadPolicies();
        this.setupEventListeners();
    }

    setupEventListeners() {
        // Filter buttons
        const filterButtons = document.querySelectorAll('.policy-filter-btn');
        filterButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                const filter = button.getAttribute('data-filter');
                if (filter) {
                    this.setFilter(filter);

                    // Update active button
                    filterButtons.forEach(btn => btn.classList.remove('active'));
                    button.classList.add('active');
                }
            });
        });

        // Search functionality
        const searchInput = document.querySelector('input[type="search"]');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.searchPolicies(e.target.value);
            });
        }
    }

    async loadPolicies() {
        try {
            // Load policies
            const policyResponse = await fetch(`${this.apiBaseUrl}/policy/`);
            if (!policyResponse.ok) {
                throw new Error('Failed to load policies');
            }
            const policies = await policyResponse.json();
            
            // Load insurance types and companies for mapping
            const [typesResponse, companiesResponse] = await Promise.all([
                fetch(`${this.apiBaseUrl}/insurancetype/`),
                fetch(`${this.apiBaseUrl}/insurancecompany/`)
            ]);
            
            const types = typesResponse.ok ? await typesResponse.json() : [];
            const companies = companiesResponse.ok ? await companiesResponse.json() : [];
            
            // Create lookup maps
            const typeMap = {};
            types.forEach(type => typeMap[type.id] = type.type_name);
            
            const companyMap = {};
            companies.forEach(company => companyMap[company.id] = company.name);
            
            // Enrich policies with names
            this.policies = policies.map(policy => ({
                ...policy,
                insurance_type_name: typeMap[policy.insurance_type] || 'Unknown',
                insurance_company_name: companyMap[policy.insurance_company] || 'Unknown'
            }));

            this.filteredPolicies = [...this.policies];
            this.displayPolicies();
        } catch (error) {
            console.error('Error loading policies:', error);
            this.showError('Failed to load policies. Please try again later.');
        }
    }

    setFilter(filter) {
        this.currentFilter = filter;
        this.applyFilters();
    }

    searchPolicies(query) {
        this.searchQuery = query.toLowerCase();
        this.applyFilters();
    }

    applyFilters() {
        let filtered = [...this.policies];

        // Apply category filter
        if (this.currentFilter !== 'all') {
            filtered = filtered.filter(policy => {
                // Get insurance type name for filtering
                return this.getPolicyCategory(policy) === this.currentFilter;
            });
        }

        // Apply search filter
        if (this.searchQuery) {
            filtered = filtered.filter(policy =>
                policy.policy_name.toLowerCase().includes(this.searchQuery) ||
                policy.policy_details.toLowerCase().includes(this.searchQuery) ||
                policy.insurance_company_name.toLowerCase().includes(this.searchQuery)
            );
        }

        this.filteredPolicies = filtered;
        this.displayPolicies();
    }

    getPolicyCategory(policy) {
        // Use the insurance type name for categorization
        const typeName = policy.insurance_type_name || '';
        if (typeName.toLowerCase().includes('health')) return 'health';
        if (typeName.toLowerCase().includes('life')) return 'life';
        if (typeName.toLowerCase().includes('motor')) return 'motor';
        if (typeName.toLowerCase().includes('home')) return 'home';
        return 'other';
    }

    displayPolicies() {
        const container = document.getElementById('policies-container');
        if (!container) return;

        if (this.filteredPolicies.length === 0) {
            container.innerHTML = `
                <div class="col-12 text-center py-5">
                    <i class="fas fa-search fa-3x text-muted mb-3"></i>
                    <h4 class="text-muted">No policies found</h4>
                    <p class="text-muted">Try adjusting your search or filter criteria</p>
                </div>
            `;
            return;
        }

        container.innerHTML = this.filteredPolicies.map(policy => this.createPolicyCard(policy)).join('');
    }

    createPolicyCard(policy) {
        const category = this.getPolicyCategory(policy);
        const categoryIcon = this.getCategoryIcon(category);
        const categoryColor = this.getCategoryColor(category);

        return `
            <div class="col-lg-4 col-md-6 mb-4">
                <div class="card h-100 policy-card border-0 shadow-sm">
                    <div class="card-header ${categoryColor} text-white">
                        <div class="d-flex align-items-center">
                            <i class="${categoryIcon} fa-2x me-3"></i>
                            <div>
                                <h5 class="mb-0">${policy.policy_name}</h5>
                                <small>${policy.insurance_company_name}</small>
                            </div>
                        </div>
                    </div>
                    <div class="card-body">
                        <p class="card-text text-muted">${policy.policy_details.substring(0, 100)}...</p>
                        <div class="row text-center mb-3">
                            <div class="col-6">
                                <div class="fw-bold text-primary">₹${policy.premium_amount}</div>
                                <small class="text-muted">Premium</small>
                            </div>
                            <div class="col-6">
                                <div class="fw-bold text-success">₹${policy.coverage}</div>
                                <small class="text-muted">Coverage</small>
                            </div>
                        </div>
                        <div class="d-grid gap-2">
                            <button class="btn btn-primary" onclick="policiesManager.viewPolicyDetails(${policy.id})">
                                <i class="fas fa-eye me-2"></i>View Details
                            </button>
                            <button class="btn btn-success" onclick="policiesManager.purchasePolicy(${policy.id})">
                                <i class="fas fa-shopping-cart me-2"></i>Purchase Now
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    getCategoryIcon(category) {
        const icons = {
            health: 'fas fa-heartbeat',
            life: 'fas fa-heart',
            motor: 'fas fa-car',
            home: 'fas fa-home',
            other: 'fas fa-shield-alt'
        };
        return icons[category] || icons.other;
    }

    getCategoryColor(category) {
        const colors = {
            health: 'bg-success',
            life: 'bg-danger',
            motor: 'bg-warning',
            home: 'bg-info',
            other: 'bg-primary'
        };
        return colors[category] || colors.other;
    }

    viewPolicyDetails(policyId) {
        const policy = this.policies.find(p => p.id === policyId);
        if (!policy) return;

        const category = this.getPolicyCategory(policy);
        const categoryIcon = this.getCategoryIcon(category);
        const categoryColor = this.getCategoryColor(category);

        const modal = document.getElementById('policyDetailsModal');
        const content = document.getElementById('policyDetailsContent');
        const purchaseBtn = document.getElementById('purchaseFromModalBtn');

        content.innerHTML = `
            <div class="row">
                <div class="col-md-4 mb-3">
                    <div class="card ${categoryColor} text-white">
                        <div class="card-body text-center">
                            <i class="${categoryIcon} fa-3x mb-3"></i>
                            <h5>${policy.policy_name}</h5>
                            <p class="mb-0">${policy.insurance_company_name}</p>
                        </div>
                    </div>
                </div>
                <div class="col-md-8">
                    <h6 class="fw-bold">Policy Details</h6>
                    <p class="text-muted mb-4">${policy.policy_details}</p>

                    <div class="row text-center mb-4">
                        <div class="col-6">
                            <div class="p-3 bg-light rounded">
                                <h4 class="text-primary mb-0">₹${policy.premium_amount}</h4>
                                <small class="text-muted">Monthly Premium</small>
                            </div>
                        </div>
                        <div class="col-6">
                            <div class="p-3 bg-light rounded">
                                <h4 class="text-success mb-0">₹${policy.coverage}</h4>
                                <small class="text-muted">Coverage Amount</small>
                            </div>
                        </div>
                    </div>

                    <div class="mb-3">
                        <h6 class="fw-bold">Key Features</h6>
                        <ul class="list-unstyled">
                            <li><i class="fas fa-check text-success me-2"></i> Comprehensive coverage</li>
                            <li><i class="fas fa-check text-success me-2"></i> 24/7 customer support</li>
                            <li><i class="fas fa-check text-success me-2"></i> Easy claims process</li>
                            <li><i class="fas fa-check text-success me-2"></i> Online policy management</li>
                        </ul>
                    </div>
                </div>
            </div>
        `;

        // Store current policy ID for purchase
        purchaseBtn.onclick = () => {
            bootstrap.Modal.getInstance(modal).hide();
            this.showPurchaseConfirmation(policyId);
        };

        // Show modal
        const bsModal = new bootstrap.Modal(modal);
        bsModal.show();
    }

    async purchasePolicy(policyId) {
        // Check if user is logged in
        const currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null');
        if (!currentUser) {
            alert('Please login to purchase a policy');
            window.location.href = 'login.html';
            return;
        }

        this.showPurchaseConfirmation(policyId);
    }

    showPurchaseConfirmation(policyId) {
        const policy = this.policies.find(p => p.id === policyId);
        if (!policy) return;

        const modal = document.getElementById('purchaseConfirmModal');
        const content = document.getElementById('purchaseConfirmContent');
        const confirmBtn = document.getElementById('confirmPurchaseBtn');

        content.innerHTML = `
            <div class="text-center mb-4">
                <i class="fas fa-shopping-cart fa-3x text-success mb-3"></i>
                <h5>Confirm Your Purchase</h5>
            </div>

            <div class="card mb-4">
                <div class="card-body">
                    <h6 class="card-title">${policy.policy_name}</h6>
                    <p class="card-text text-muted">${policy.insurance_company_name}</p>

                    <div class="row text-center">
                        <div class="col-6">
                            <div class="fw-bold text-primary">₹${policy.premium_amount}</div>
                            <small class="text-muted">Premium Amount</small>
                        </div>
                        <div class="col-6">
                            <div class="fw-bold text-success">₹${policy.coverage}</div>
                            <small class="text-muted">Coverage</small>
                        </div>
                    </div>
                </div>
            </div>

            <div class="alert alert-info">
                <i class="fas fa-info-circle me-2"></i>
                By confirming this purchase, you agree to the terms and conditions of the policy.
                The policy will be activated immediately after payment.
            </div>
        `;

        // Store current policy ID for confirmation
        confirmBtn.onclick = () => {
            this.confirmPurchase(policyId);
        };

        // Show modal
        const bsModal = new bootstrap.Modal(modal);
        bsModal.show();
    }

    async confirmPurchase(policyId) {
        const modal = document.getElementById('purchaseConfirmModal');
        const bsModal = bootstrap.Modal.getInstance(modal);

        try {
            // Use customer policy manager if available
            if (window.customerPolicyManager) {
                const success = await window.customerPolicyManager.purchasePolicy(policyId);
                if (success) {
                    bsModal.hide();
                    this.showSuccessMessage('Policy purchased successfully! You can view it in your account.');
                    // Refresh policies display
                    await this.loadPolicies();
                }
            } else {
                // Fallback: show success message
                bsModal.hide();
                this.showSuccessMessage('Purchase functionality will be fully implemented with customer policy management');
            }
        } catch (error) {
            console.error('Purchase error:', error);
            this.showErrorMessage('Failed to purchase policy. Please try again.');
        }
    }

    showSuccessMessage(message) {
        // Create a temporary success alert
        const alertDiv = document.createElement('div');
        alertDiv.className = 'alert alert-success alert-dismissible fade show position-fixed';
        alertDiv.style.cssText = 'top: 20px; right: 20px; z-index: 9999; min-width: 300px;';
        alertDiv.innerHTML = `
            <i class="fas fa-check-circle me-2"></i>${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        `;
        document.body.appendChild(alertDiv);

        // Auto remove after 5 seconds
        setTimeout(() => {
            if (alertDiv.parentNode) {
                alertDiv.remove();
            }
        }, 5000);
    }

    showErrorMessage(message) {
        // Create a temporary error alert
        const alertDiv = document.createElement('div');
        alertDiv.className = 'alert alert-danger alert-dismissible fade show position-fixed';
        alertDiv.style.cssText = 'top: 20px; right: 20px; z-index: 9999; min-width: 300px;';
        alertDiv.innerHTML = `
            <i class="fas fa-exclamation-triangle me-2"></i>${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        `;
        document.body.appendChild(alertDiv);

        // Auto remove after 5 seconds
        setTimeout(() => {
            if (alertDiv.parentNode) {
                alertDiv.remove();
            }
        }, 5000);
    }

    showError(message) {
        const container = document.getElementById('policies-container');
        if (container) {
            container.innerHTML = `
                <div class="col-12 text-center py-5">
                    <i class="fas fa-exclamation-triangle fa-3x text-danger mb-3"></i>
                    <h4 class="text-danger">Error</h4>
                    <p class="text-muted">${message}</p>
                </div>
            `;
        }
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    window.policiesManager = new PoliciesManager();
});