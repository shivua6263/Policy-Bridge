/**
 * Customer Policy Management Module
 * Handles fetching, displaying, and managing customer policies (purchased policies)
 */

class CustomerPolicyManager {
    constructor() {
        this.apiBaseUrl = CONFIG.API_BASE_URL;
        this.customerPolicies = [];
        this.currentUser = null;
        this.init();
    }

    init() {
        this.loadCurrentUser();
        if (this.currentUser) {
            this.loadCustomerPolicies();
        }
        
        // If we're on the account page, set up a listener for when policies load
        if (window.location.pathname.includes('account.html')) {
            this.setupAccountPageIntegration();
        }
    }

    setupAccountPageIntegration() {
        // Call display method after a short delay to ensure DOM is ready
        setTimeout(() => {
            if (this.customerPolicies.length > 0) {
                this.displayCustomerPoliciesInAccount();
            }
        }, 1000);
    }

    loadCurrentUser() {
        const userStr = localStorage.getItem('currentUser');
        if (userStr) {
            try {
                this.currentUser = JSON.parse(userStr);
            } catch (e) {
                console.error('Error parsing user data:', e);
                this.currentUser = null;
            }
        }
    }

    async loadCustomerPolicies() {
        if (!this.currentUser || !this.currentUser.id) return;

        try {
            const response = await fetch(`${this.apiBaseUrl}/customerpolicy/`);
            if (response.ok) {
                const allPolicies = await response.json();
                // Filter policies for current user
                this.customerPolicies = allPolicies.filter(policy => policy.customer === this.currentUser.id);
                
                // Enrich with policy details
                await this.enrichCustomerPolicies();
                
                // Update UI if functions exist or if we're on the account page
                if (typeof this.displayCustomerPoliciesInAccount === 'function') {
                    this.displayCustomerPoliciesInAccount();
                } else if (window.location.pathname.includes('account.html')) {
                    this.displayCustomerPoliciesInAccount();
                }
            } else {
                console.error('Failed to load customer policies');
            }
        } catch (error) {
            console.error('Error loading customer policies:', error);
        }
    }

    async enrichCustomerPolicies() {
        if (this.customerPolicies.length === 0) return;

        try {
            // Load policies and agents for enrichment
            const [policiesResponse, agentsResponse] = await Promise.all([
                fetch(`${this.apiBaseUrl}/policy/`),
                fetch(`${this.apiBaseUrl}/agent/`)
            ]);

            const policies = policiesResponse.ok ? await policiesResponse.json() : [];
            const agents = agentsResponse.ok ? await agentsResponse.json() : [];

            // Create lookup maps
            const policyMap = {};
            policies.forEach(policy => policyMap[policy.id] = policy);

            const agentMap = {};
            agents.forEach(agent => agentMap[agent.id] = agent);

            // Enrich customer policies
            this.customerPolicies = this.customerPolicies.map(cp => ({
                ...cp,
                policy_details: policyMap[cp.policy] || null,
                agent_details: agentMap[cp.agent] || null
            }));

        } catch (error) {
            console.error('Error enriching customer policies:', error);
        }
    }

    getActivePolicies() {
        return this.customerPolicies.filter(cp => cp.status === 'active');
    }

    getExpiredPolicies() {
        return this.customerPolicies.filter(cp => cp.status === 'expired');
    }

    getTotalPremiumPaid() {
        return this.customerPolicies.reduce((total, cp) => total + parseFloat(cp.premium_amount_paid || 0), 0);
    }

    async purchasePolicy(policyId, agentId = null) {
        if (!this.currentUser || !this.currentUser.id) {
            alert('Please login to purchase a policy');
            window.location.href = 'login.html';
            return false;
        }

        try {
            // Get the agent ID - either provided or fetch the first available agent
            let finalAgentId = agentId;
            if (!finalAgentId) {
                const agentsResponse = await fetch(`${this.apiBaseUrl}/agent/`);
                if (agentsResponse.ok) {
                    const agents = await agentsResponse.json();
                    if (agents.length > 0) {
                        finalAgentId = agents[0].id; // Use the first available agent
                    } else {
                        alert('No agents available. Please contact support.');
                        return false;
                    }
                } else {
                    alert('Unable to fetch agents. Please try again.');
                    return false;
                }
            }

            const purchaseData = {
                customer: this.currentUser.id,
                policy: policyId,
                agent: finalAgentId,
                subscription_date: new Date().toISOString(),
                expiry_date: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(), // 1 year from now
                premium_amount_paid: 0, // Will be set based on policy
                status: 'active'
            };

            // Get policy details to set premium
            const policyResponse = await fetch(`${this.apiBaseUrl}/policy/${policyId}/`);
            if (policyResponse.ok) {
                const policy = await policyResponse.json();
                purchaseData.premium_amount_paid = policy.premium_amount;
            }

            const response = await fetch(`${this.apiBaseUrl}/customerpolicy/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(purchaseData)
            });

            if (response.ok) {
                const result = await response.json();
                alert('Policy purchased successfully!');
                // Reload customer policies
                await this.loadCustomerPolicies();
                return true;
            } else {
                const error = await response.json();
                alert(`Purchase failed: ${JSON.stringify(error)}`);
                return false;
            }
        } catch (error) {
            console.error('Error purchasing policy:', error);
            alert('Error purchasing policy. Please try again.');
            return false;
        }
    }

    displayCustomerPoliciesInAccount() {
        const container = document.getElementById('customer-policies-container');
        if (!container) return;

        if (this.customerPolicies.length === 0) {
            container.innerHTML = `
                <div class="text-center py-4">
                    <i class="fas fa-file-alt fa-3x text-muted mb-3"></i>
                    <h5 class="text-muted">No Policies Purchased</h5>
                    <p class="text-muted">You haven't purchased any policies yet.</p>
                    <a href="policies.html" class="btn btn-primary">Browse Policies</a>
                </div>
            `;
            return;
        }

        const activePolicies = this.getActivePolicies();
        const recentPolicies = this.customerPolicies.slice(0, 5); // Show last 5

        container.innerHTML = recentPolicies.map(cp => `
            <div class="policy-item mb-3 p-3 border rounded">
                <div class="d-flex justify-content-between align-items-start">
                    <div>
                        <h6 class="mb-1">${cp.policy_details ? cp.policy_details.policy_name : 'Unknown Policy'}</h6>
                        <p class="text-muted small mb-1">${cp.policy_details ? cp.policy_details.insurance_company_name : 'Unknown Company'}</p>
                        <span class="badge ${cp.status === 'active' ? 'bg-success' : 'bg-secondary'}">${cp.status}</span>
                    </div>
                    <div class="text-end">
                        <div class="fw-bold">₹${cp.premium_amount_paid}</div>
                        <small class="text-muted">Paid</small>
                    </div>
                </div>
                <div class="mt-2">
                    <small class="text-muted">
                        Purchased: ${new Date(cp.subscription_date).toLocaleDateString()} | 
                        Expires: ${new Date(cp.expiry_date).toLocaleDateString()}
                    </small>
                </div>
            </div>
        `).join('');
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    window.customerPolicyManager = new CustomerPolicyManager();
});