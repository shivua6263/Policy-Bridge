class ClaimsManager {
    constructor() {
        this.baseURL = CONFIG.API_BASE_URL;
        this.websocket = null;
        this.customerId = null;
        this.init();
    }

    init() {
        this.customerId = authManager.getCurrentUser()?.id;
        if (this.customerId) {
            this.connectWebSocket();
            this.loadCustomerPolicies();
            this.loadClaims();
            this.loadStatistics();
        }
        this.bindEvents();
    }

    bindEvents() {
        // Claim form submission
        const claimForm = document.getElementById('claim-form');
        if (claimForm) {
            claimForm.addEventListener('submit', (e) => this.handleClaimSubmission(e));
        }

        // Status filter
        const statusFilter = document.getElementById('status-filter');
        if (statusFilter) {
            statusFilter.addEventListener('change', (e) => this.filterClaims(e.target.value));
        }

        // File upload handling
        const fileInput = document.getElementById('claim-documents');
        if (fileInput) {
            fileInput.addEventListener('change', (e) => this.handleFileUpload(e));
        }
    }

    connectWebSocket() {
        if (!this.customerId) return;

        const wsURL = `${CONFIG.WS_BASE_URL}/claims/${this.customerId}/`;
        this.websocket = new WebSocket(wsURL);

        this.websocket.onopen = () => {
            console.log('Claims WebSocket connected');
        };

        this.websocket.onmessage = (event) => {
            const data = JSON.parse(event.data);
            if (data.type === 'claims_update') {
                this.updateClaimsDisplay(data.data);
                this.updateStatistics(data.data);
            }
        };

        this.websocket.onclose = () => {
            console.log('Claims WebSocket disconnected');
            // Reconnect after 5 seconds
            setTimeout(() => this.connectWebSocket(), 5000);
        };

        this.websocket.onerror = (error) => {
            console.error('WebSocket error:', error);
        };
    }

    async handleClaimSubmission(event) {
        event.preventDefault();

        const formData = new FormData(event.target);
        const claimData = {
            customer_policy: parseInt(formData.get('policy-number')),
            customer_id: this.customerId,
            claim_type: formData.get('claim-type'),
            incident_date: formData.get('incident-date'),
            claim_amount: parseFloat(formData.get('claim-amount')),
            incident_location: formData.get('incident-location') || '',
            description: formData.get('description'),
            supporting_documents: [] // Will be handled separately for file uploads
        };

        try {
            const response = await fetch(`${this.baseURL}/claims/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(claimData)
            });

            if (response.ok) {
                this.showAlert('Claim submitted successfully!', 'success');
                event.target.reset();
                this.loadClaims(); // Refresh claims list
            } else {
                const error = await response.json();
                this.showAlert(`Error submitting claim: ${error.detail || 'Unknown error'}`, 'danger');
            }
        } catch (error) {
            console.error('Error submitting claim:', error);
            this.showAlert('Error submitting claim. Please try again.', 'danger');
        }
    }

    async loadCustomerPolicies() {
        if (!this.customerId) return;

        try {
            const response = await fetch(`${this.baseURL}/customerpolicy/?customer=${this.customerId}`);
            if (response.ok) {
                const policies = await response.json();
                this.populatePolicyDropdown(policies);
            }
        } catch (error) {
            console.error('Error loading customer policies:', error);
        }
    }

    populatePolicyDropdown(policies) {
        const policySelect = document.getElementById('policy-number');
        if (!policySelect) return;

        // Clear existing options except the first
        while (policySelect.options.length > 1) {
            policySelect.remove(1);
        }

        policies.forEach(policy => {
            const option = document.createElement('option');
            option.value = policy.id;
            option.textContent = `${policy.policy.policy_name} (${policy.policy.insurance_company.name})`;
            policySelect.appendChild(option);
        });
    }

    async loadClaims(statusFilter = '') {
        if (!this.customerId) return;

        try {
            let url = `${this.baseURL}/claims/my_claims/?customer_id=${this.customerId}`;
            if (statusFilter) {
                url += `&status=${statusFilter}`;
            }

            const response = await fetch(url);
            if (response.ok) {
                const claims = await response.json();
                this.displayClaims(claims);
            }
        } catch (error) {
            console.error('Error loading claims:', error);
        }
    }

    async loadStatistics() {
        if (!this.customerId) return;

        try {
            const response = await fetch(`${this.baseURL}/claims/statistics/?customer_id=${this.customerId}`);
            if (response.ok) {
                const stats = await response.json();
                this.displayStatistics(stats);
            }
        } catch (error) {
            console.error('Error loading statistics:', error);
        }
    }

    displayClaims(claims) {
        const claimsTable = document.getElementById('claims-table-body');
        if (!claimsTable) return;

        claimsTable.innerHTML = '';

        if (claims.length === 0) {
            claimsTable.innerHTML = `
                <tr>
                    <td colspan="7" class="text-center py-4">
                        <i class="fas fa-inbox fa-2x text-muted mb-2"></i>
                        <p class="text-muted">No claims found</p>
                    </td>
                </tr>
            `;
            return;
        }

        claims.forEach(claim => {
            const row = document.createElement('tr');

            const statusBadge = this.getStatusBadge(claim.status);
            const submittedDate = new Date(claim.submitted_at).toLocaleDateString();
            const incidentDate = new Date(claim.incident_date).toLocaleDateString();

            row.innerHTML = `
                <td>${claim.id}</td>
                <td>${claim.policy_name}</td>
                <td>${claim.claim_type.replace('_', ' ').toUpperCase()}</td>
                <td>₹${claim.claim_amount.toLocaleString()}</td>
                <td>${incidentDate}</td>
                <td>${submittedDate}</td>
                <td>${statusBadge}</td>
            `;

            claimsTable.appendChild(row);
        });
    }

    displayStatistics(stats) {
        // Update dashboard statistics
        const totalClaimsElement = document.getElementById('total-claims-count');
        const pendingClaimsElement = document.getElementById('pending-claims-count');
        const approvedClaimsElement = document.getElementById('approved-claims-count');

        if (totalClaimsElement) totalClaimsElement.textContent = stats.total_claims || 0;
        if (pendingClaimsElement) pendingClaimsElement.textContent = stats.pending_claims || 0;
        if (approvedClaimsElement) approvedClaimsElement.textContent = stats.approved_claims || 0;

        // Update account page claims count
        const accountClaimsElement = document.getElementById('totalClaimsCount');
        if (accountClaimsElement) accountClaimsElement.textContent = stats.total_claims || 0;
    }

    updateClaimsDisplay(claimsData) {
        this.displayClaims(claimsData);
    }

    updateStatistics(claimsData) {
        // Calculate statistics from claims data
        const stats = {
            total_claims: claimsData.length,
            pending_claims: claimsData.filter(c => c.status === 'pending').length,
            approved_claims: claimsData.filter(c => c.status === 'approved').length,
            rejected_claims: claimsData.filter(c => c.status === 'rejected').length,
            paid_claims: claimsData.filter(c => c.status === 'paid').length,
        };
        this.displayStatistics(stats);
    }

    filterClaims(status) {
        this.loadClaims(status);
        if (this.websocket && this.websocket.readyState === WebSocket.OPEN) {
            this.websocket.send(JSON.stringify({
                action: 'filter',
                status: status
            }));
        }
    }

    getStatusBadge(status) {
        const badges = {
            'pending': '<span class="badge bg-warning">Pending</span>',
            'under_review': '<span class="badge bg-info">Under Review</span>',
            'approved': '<span class="badge bg-success">Approved</span>',
            'rejected': '<span class="badge bg-danger">Rejected</span>',
            'paid': '<span class="badge bg-primary">Paid</span>',
            'closed': '<span class="badge bg-secondary">Closed</span>'
        };
        return badges[status] || `<span class="badge bg-light text-dark">${status}</span>`;
    }

    handleFileUpload(event) {
        const files = event.target.files;
        // In a real implementation, you would upload files to server
        // For now, just show selected files
        if (files.length > 0) {
            const fileList = document.getElementById('file-list');
            if (fileList) {
                fileList.innerHTML = '';
                Array.from(files).forEach(file => {
                    const li = document.createElement('li');
                    li.className = 'list-group-item d-flex justify-content-between align-items-center';
                    li.innerHTML = `
                        ${file.name} <small class="text-muted">(${this.formatFileSize(file.size)})</small>
                        <button type="button" class="btn btn-sm btn-outline-danger" onclick="this.parentElement.remove()">
                            <i class="fas fa-times"></i>
                        </button>
                    `;
                    fileList.appendChild(li);
                });
            }
        }
    }

    formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    showAlert(message, type = 'info') {
        // Create alert element
        const alertDiv = document.createElement('div');
        alertDiv.className = `alert alert-${type} alert-dismissible fade show position-fixed`;
        alertDiv.style.cssText = 'top: 20px; right: 20px; z-index: 9999; min-width: 300px;';
        alertDiv.innerHTML = `
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        `;

        document.body.appendChild(alertDiv);

        // Auto remove after 5 seconds
        setTimeout(() => {
            if (alertDiv.parentElement) {
                alertDiv.remove();
            }
        }, 5000);
    }

    // Load customer policies for dropdown
    async loadCustomerPolicies() {
        if (!this.customerId) return;

        try {
            const response = await fetch(`${this.baseURL}/customerpolicy/?customer=${this.customerId}`);
            if (response.ok) {
                const policies = await response.json();
                this.populatePolicyDropdown(policies);
            }
        } catch (error) {
            console.error('Error loading customer policies:', error);
        }
    }

    populatePolicyDropdown(policies) {
        const policySelect = document.getElementById('policy-number');
        if (!policySelect) return;

        // Clear existing options except the first
        while (policySelect.options.length > 1) {
            policySelect.remove(1);
        }

        policies.forEach(policy => {
            const option = document.createElement('option');
            option.value = policy.id;
            option.textContent = `${policy.policy.policy_name} (${policy.policy.insurance_company.name})`;
            policySelect.appendChild(option);
        });
    }
}

// Initialize claims manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.claimsManager = new ClaimsManager();
});