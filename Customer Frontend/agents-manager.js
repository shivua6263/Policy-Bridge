/**
 * Agents Management Module
 * Handles fetching and displaying insurance agents from database
 */

class AgentsManager {
    constructor() {
        this.apiBaseUrl = CONFIG.API_BASE_URL;
        this.agents = [];
        this.filteredAgents = [];
        this.currentFilter = 'all';
        this.init();
    }

    init() {
        this.loadAgents();
        this.setupEventListeners();
    }

    setupEventListeners() {
        // Search functionality
        const searchInput = document.querySelector('input[type="search"]');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.searchAgents(e.target.value);
            });
        }

        // Location filter
        const locationSelect = document.querySelector('select[name="location"]');
        if (locationSelect) {
            locationSelect.addEventListener('change', (e) => {
                this.filterByLocation(e.target.value);
            });
        }

        // Specialty filter
        const specialtySelect = document.querySelector('select[name="specialty"]');
        if (specialtySelect) {
            specialtySelect.addEventListener('change', (e) => {
                this.filterBySpecialty(e.target.value);
            });
        }
    }

    async loadAgents() {
        try {
            const response = await fetch(`${this.apiBaseUrl}/agent/`);
            if (!response.ok) {
                throw new Error('Failed to load agents');
            }
            this.agents = await response.json();
            this.filteredAgents = [...this.agents];
            this.displayAgents();
        } catch (error) {
            console.error('Error loading agents:', error);
            this.displayError('Failed to load agents. Please try again later.');
        }
    }

    searchAgents(query) {
        this.filteredAgents = this.agents.filter(agent =>
            agent.name.toLowerCase().includes(query.toLowerCase()) ||
            agent.email.toLowerCase().includes(query.toLowerCase())
        );
        this.displayAgents();
    }

    filterByLocation(location) {
        if (location === 'all') {
            this.filteredAgents = [...this.agents];
        } else {
            // For now, we'll just show all agents since location isn't stored
            // In a real app, you'd filter by agent location
            this.filteredAgents = [...this.agents];
        }
        this.displayAgents();
    }

    filterBySpecialty(specialty) {
        if (specialty === 'all') {
            this.filteredAgents = [...this.agents];
        } else {
            // For now, we'll show all agents since specialties aren't stored
            // In a real app, you'd filter by agent specialties
            this.filteredAgents = [...this.agents];
        }
        this.displayAgents();
    }

    displayAgents() {
        const container = document.querySelector('.row.g-4');
        if (!container) return;

        // Clear existing agent cards (keep the first few static elements if any)
        const agentCards = container.querySelectorAll('.agent-card');
        agentCards.forEach(card => card.remove());

        if (this.filteredAgents.length === 0) {
            const noAgentsHtml = `
                <div class="col-12 text-center py-5">
                    <i class="fas fa-users fa-3x text-muted mb-3"></i>
                    <h4 class="text-muted">No agents found</h4>
                    <p class="text-muted">Try adjusting your search criteria</p>
                </div>
            `;
            container.insertAdjacentHTML('beforeend', noAgentsHtml);
            return;
        }

        // Generate agent cards from database
        const agentsHtml = this.filteredAgents.map(agent => this.createAgentCard(agent)).join('');
        container.insertAdjacentHTML('beforeend', agentsHtml);
    }

    createAgentCard(agent) {
        // Generate a random rating for demo purposes
        const rating = (4 + Math.random()).toFixed(1);
        const reviewCount = Math.floor(Math.random() * 200) + 50;

        // Default profile image if none provided
        const profileImage = agent.profile_image ?
            `data:image/jpeg;base64,${agent.profile_image}` :
            'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=120&h=120&fit=crop&crop=face';

        return `
            <div class="col-md-6 col-lg-4" data-specialties="health,life">
                <div class="card border-0 shadow-sm agent-card h-100">
                    <div class="card-body text-center p-4">
                        <img src="${profileImage}"
                             alt="${agent.name}" class="agent-img mb-3 rounded-circle" style="width: 80px; height: 80px; object-fit: cover;">
                        <h5 class="card-title agent-name">${agent.name}</h5>
                        <p class="text-muted small agent-location">
                            <i class="fas fa-map-marker-alt me-1"></i> ${this.getRandomLocation()}
                        </p>
                        <div class="mb-3">
                            <span class="badge bg-primary me-1">Health Insurance</span>
                            <span class="badge bg-success">Life Insurance</span>
                            <span class="badge bg-info">Motor Insurance</span>
                        </div>
                        <div class="d-flex justify-content-center align-items-center mb-3">
                            <div class="rating-stars me-2">
                                ${this.generateStars(rating)}
                            </div>
                            <small class="text-muted">(${reviewCount} reviews)</small>
                        </div>
                        <p class="card-text text-muted small">
                            Professional insurance advisor with ${Math.floor(Math.random() * 15) + 5} years of experience.
                            Specializes in comprehensive insurance solutions for individuals and families.
                        </p>
                        <div class="d-flex gap-2 justify-content-center">
                            <button class="btn btn-primary btn-sm consult-btn" data-agent="${agent.name}" data-phone="${agent.phone_number}">
                                <i class="fas fa-phone me-1"></i> Call Now
                            </button>
                            <button class="btn btn-outline-primary btn-sm" data-email="${agent.email}">
                                <i class="fas fa-envelope me-1"></i> Email
                            </button>
                        </div>
                    </div>
                    <div class="card-footer bg-transparent border-top">
                        <div class="d-flex justify-content-between small text-muted">
                            <span><i class="fas fa-check-circle text-success me-1"></i> Verified</span>
                            <span><i class="fas fa-briefcase me-1"></i> ${Math.floor(Math.random() * 15) + 5} yrs exp.</span>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    generateStars(rating) {
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 >= 0.5;
        let starsHtml = '';

        for (let i = 0; i < fullStars; i++) {
            starsHtml += '<i class="fas fa-star"></i>';
        }

        if (hasHalfStar) {
            starsHtml += '<i class="fas fa-star-half-alt"></i>';
        }

        const remainingStars = 5 - Math.ceil(rating);
        for (let i = 0; i < remainingStars; i++) {
            starsHtml += '<i class="far fa-star"></i>';
        }

        return starsHtml;
    }

    getRandomLocation() {
        const locations = ['Mumbai, Maharashtra', 'Delhi, NCR', 'Bangalore, Karnataka', 'Chennai, Tamil Nadu', 'Pune, Maharashtra', 'Hyderabad, Telangana', 'Kolkata, West Bengal'];
        return locations[Math.floor(Math.random() * locations.length)];
    }

    displayError(message) {
        const container = document.querySelector('.row.g-4');
        if (container) {
            container.innerHTML = `
                <div class="col-12 text-center py-5">
                    <i class="fas fa-exclamation-triangle fa-3x text-warning mb-3"></i>
                    <h4 class="text-muted">${message}</h4>
                </div>
            `;
        }
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    window.agentsManager = new AgentsManager();

    // Handle consult buttons
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('consult-btn') || e.target.closest('.consult-btn')) {
            const button = e.target.classList.contains('consult-btn') ? e.target : e.target.closest('.consult-btn');
            const agentName = button.getAttribute('data-agent');
            const phoneNumber = button.getAttribute('data-phone');

            if (phoneNumber) {
                // In a real app, you'd integrate with a calling service
                alert(`Calling ${agentName} at ${phoneNumber}`);
            }
        }
    });
});