/**
 * Quote Manager - Handles quick quote functionality
 * Manages insurance type selection, dynamic forms, and quote calculation
 */

class QuoteManager {
    constructor() {
        this.apiBaseUrl = CONFIG.API_BASE_URL;
        this.authManager = new AuthManager();
        this.currentStep = 1;
        this.selectedInsuranceType = null;
        this.quoteData = {};
        this.init();
    }

    /**
     * Initialize quote functionality
     */
    init() {
        this.loadUserInfo();
        this.loadInsuranceTypes();
        this.setupEventListeners();
    }

    /**
     * Load user information for forms
     */
    loadUserInfo() {
        if (this.authManager.isLoggedIn()) {
            const user = this.authManager.getCurrentUser();
            document.getElementById('userNameDisplay').textContent = user.name || 'User';

            // Pre-fill form if user is logged in
            if (user.email) {
                document.getElementById('email').value = user.email;
            }
            if (user.name) {
                const nameParts = user.name.split(' ');
                document.getElementById('firstName').value = nameParts[0] || '';
                document.getElementById('lastName').value = nameParts.slice(1).join(' ') || '';
            }
        }
    }

    /**
     * Load and display insurance types
     */
    loadInsuranceTypes() {
        const insuranceTypes = [
            {
                id: 'health',
                name: 'Health Insurance',
                icon: 'fas fa-heartbeat',
                color: 'success',
                description: 'Medical coverage for you and your family',
                image: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=200&fit=crop'
            },
            {
                id: 'life',
                name: 'Life Insurance',
                icon: 'fas fa-shield-alt',
                color: 'primary',
                description: 'Financial protection for your loved ones',
                image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=200&fit=crop'
            },
            {
                id: 'motor',
                name: 'Motor Insurance',
                icon: 'fas fa-car',
                color: 'warning',
                description: 'Coverage for your vehicle and personal accident',
                image: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=400&h=200&fit=crop'
            },
            {
                id: 'home',
                name: 'Home Insurance',
                icon: 'fas fa-home',
                color: 'info',
                description: 'Protect your property and belongings',
                image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=400&h=200&fit=crop'
            },
            {
                id: 'travel',
                name: 'Travel Insurance',
                icon: 'fas fa-plane',
                color: 'danger',
                description: 'Coverage for trips and vacations',
                image: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=400&h=200&fit=crop'
            },
            {
                id: 'business',
                name: 'Business Insurance',
                icon: 'fas fa-building',
                color: 'secondary',
                description: 'Comprehensive coverage for your business',
                image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=200&fit=crop'
            }
        ];

        const container = document.getElementById('insuranceTypeCards');
        container.innerHTML = '';

        insuranceTypes.forEach(type => {
            const card = this.createInsuranceTypeCard(type);
            container.appendChild(card);
        });
    }

    /**
     * Create insurance type card
     */
    createInsuranceTypeCard(type) {
        const col = document.createElement('div');
        col.className = 'col-md-4';

        col.innerHTML = `
            <div class="card h-100 border-0 shadow-sm insurance-type-card" onclick="selectInsuranceType('${type.id}')">
                <div class="card-img-top-wrapper">
                    <img src="${type.image}" class="card-img-top" alt="${type.name}">
                </div>
                <div class="card-body text-center p-4">
                    <div class="insurance-icon bg-${type.color} bg-gradient text-white rounded-3 mb-3 mx-auto">
                        <i class="${type.icon} fa-2x p-3"></i>
                    </div>
                    <h4 class="card-title text-dark">${type.name}</h4>
                    <p class="card-text text-muted">${type.description}</p>
                    <span class="btn btn-outline-${type.color} mt-2">Get Quote <i class="fas fa-arrow-right ms-1"></i></span>
                </div>
            </div>
        `;

        return col;
    }

    /**
     * Setup event listeners
     */
    setupEventListeners() {
        // Add form validation
        const forms = ['personalInfoForm', 'insuranceDetailsForm'];
        forms.forEach(formId => {
            const form = document.getElementById(formId);
            if (form) {
                form.addEventListener('submit', (e) => e.preventDefault());
            }
        });
    }

    /**
     * Select insurance type and show quote form
     */
    selectInsuranceType(typeId) {
        this.selectedInsuranceType = typeId;
        this.quoteData.insuranceType = typeId;

        // Update form title
        const typeNames = {
            'health': 'Health Insurance',
            'life': 'Life Insurance',
            'motor': 'Motor Insurance',
            'home': 'Home Insurance',
            'travel': 'Travel Insurance',
            'business': 'Business Insurance'
        };

        document.getElementById('formTitle').innerHTML = `<i class="fas fa-calculator me-2"></i> ${typeNames[typeId]} Quote`;
        document.getElementById('insuranceDetailsTitle').textContent = `${typeNames[typeId]} Details`;

        // Show quote form and hide insurance types
        document.getElementById('insurance-types').style.display = 'none';
        document.getElementById('quote-form').style.display = 'block';

        // Generate dynamic fields for step 2
        this.generateDynamicFields(typeId);

        // Scroll to form
        scrollToSection('quote-form');
    }

    /**
     * Generate dynamic fields based on insurance type
     */
    generateDynamicFields(typeId) {
        const container = document.getElementById('dynamicFields');
        let fields = '';

        switch (typeId) {
            case 'health':
                fields = this.getHealthInsuranceFields();
                break;
            case 'life':
                fields = this.getLifeInsuranceFields();
                break;
            case 'motor':
                fields = this.getMotorInsuranceFields();
                break;
            case 'home':
                fields = this.getHomeInsuranceFields();
                break;
            case 'travel':
                fields = this.getTravelInsuranceFields();
                break;
            case 'business':
                fields = this.getBusinessInsuranceFields();
                break;
            default:
                fields = '<p class="text-center text-muted">Please select an insurance type first.</p>';
        }

        container.innerHTML = fields;
    }

    /**
     * Get health insurance specific fields
     */
    getHealthInsuranceFields() {
        return `
            <div class="row">
                <div class="col-md-6 mb-3">
                    <label for="sumInsured" class="form-label">Sum Insured *</label>
                    <select class="form-select" id="sumInsured" required>
                        <option value="">Select sum insured...</option>
                        <option value="300000">₹3,00,000</option>
                        <option value="500000">₹5,00,000</option>
                        <option value="1000000">₹10,00,000</option>
                        <option value="2000000">₹20,00,000</option>
                        <option value="5000000">₹50,00,000</option>
                    </select>
                </div>
                <div class="col-md-6 mb-3">
                    <label for="familySize" class="form-label">Family Size *</label>
                    <select class="form-select" id="familySize" required>
                        <option value="">Select family size...</option>
                        <option value="individual">Individual</option>
                        <option value="couple">Couple</option>
                        <option value="family3">Family of 3</option>
                        <option value="family4">Family of 4</option>
                        <option value="family5plus">Family of 5+</option>
                    </select>
                </div>
            </div>
            <div class="mb-3">
                <label for="preExisting" class="form-label">Pre-existing Conditions</label>
                <select class="form-select" id="preExisting">
                    <option value="no">No pre-existing conditions</option>
                    <option value="yes">Have pre-existing conditions</option>
                </select>
            </div>
            <div class="mb-3">
                <label for="cityTier" class="form-label">City Tier *</label>
                <select class="form-select" id="cityTier" required>
                    <option value="">Select city tier...</option>
                    <option value="tier1">Tier 1 (Delhi, Mumbai, etc.)</option>
                    <option value="tier2">Tier 2 (Pune, Ahmedabad, etc.)</option>
                    <option value="tier3">Tier 3 (Other cities)</option>
                </select>
            </div>
        `;
    }

    /**
     * Get life insurance specific fields
     */
    getLifeInsuranceFields() {
        return `
            <div class="row">
                <div class="col-md-6 mb-3">
                    <label for="coverageAmount" class="form-label">Coverage Amount *</label>
                    <select class="form-select" id="coverageAmount" required>
                        <option value="">Select coverage amount...</option>
                        <option value="500000">₹5,00,000</option>
                        <option value="1000000">₹10,00,000</option>
                        <option value="2500000">₹25,00,000</option>
                        <option value="5000000">₹50,00,000</option>
                        <option value="10000000">₹1,00,00,000</option>
                    </select>
                </div>
                <div class="col-md-6 mb-3">
                    <label for="policyTerm" class="form-label">Policy Term *</label>
                    <select class="form-select" id="policyTerm" required>
                        <option value="">Select term...</option>
                        <option value="10">10 years</option>
                        <option value="15">15 years</option>
                        <option value="20">20 years</option>
                        <option value="25">25 years</option>
                        <option value="30">30 years</option>
                    </select>
                </div>
            </div>
            <div class="mb-3">
                <label for="annualIncome" class="form-label">Annual Income *</label>
                <select class="form-select" id="annualIncome" required>
                    <option value="">Select annual income...</option>
                    <option value="300000">₹3,00,000 - ₹5,00,000</option>
                    <option value="600000">₹6,00,000 - ₹10,00,000</option>
                    <option value="1200000">₹12,00,000 - ₹20,00,000</option>
                    <option value="2500000">₹25,00,000+</option>
                </select>
            </div>
            <div class="mb-3">
                <label for="smokingHabit" class="form-label">Smoking Habit</label>
                <select class="form-select" id="smokingHabit">
                    <option value="no">Non-smoker</option>
                    <option value="occasional">Occasional smoker</option>
                    <option value="regular">Regular smoker</option>
                </select>
            </div>
        `;
    }

    /**
     * Get motor insurance specific fields
     */
    getMotorInsuranceFields() {
        return `
            <div class="mb-3">
                <label for="vehicleType" class="form-label">Vehicle Type *</label>
                <select class="form-select" id="vehicleType" required>
                    <option value="">Select vehicle type...</option>
                    <option value="car">Car</option>
                    <option value="bike">Two Wheeler</option>
                    <option value="commercial">Commercial Vehicle</option>
                </select>
            </div>
            <div class="row">
                <div class="col-md-6 mb-3">
                    <label for="vehicleMake" class="form-label">Vehicle Make *</label>
                    <input type="text" class="form-control" id="vehicleMake" placeholder="e.g., Honda, Toyota" required>
                </div>
                <div class="col-md-6 mb-3">
                    <label for="vehicleModel" class="form-label">Vehicle Model *</label>
                    <input type="text" class="form-control" id="vehicleModel" placeholder="e.g., City, Activa" required>
                </div>
            </div>
            <div class="row">
                <div class="col-md-6 mb-3">
                    <label for="manufacturingYear" class="form-label">Manufacturing Year *</label>
                    <select class="form-select" id="manufacturingYear" required>
                        <option value="">Select year...</option>
                        ${this.generateYearOptions(1990, new Date().getFullYear())}
                    </select>
                </div>
                <div class="col-md-6 mb-3">
                    <label for="vehicleValue" class="form-label">Vehicle Value (IDV) *</label>
                    <select class="form-select" id="vehicleValue" required>
                        <option value="">Select approximate value...</option>
                        <option value="200000">₹2,00,000 - ₹5,00,000</option>
                        <option value="600000">₹6,00,000 - ₹10,00,000</option>
                        <option value="1200000">₹12,00,000 - ₹20,00,000</option>
                        <option value="2500000">₹25,00,000+</option>
                    </select>
                </div>
            </div>
        `;
    }

    /**
     * Get home insurance specific fields
     */
    getHomeInsuranceFields() {
        return `
            <div class="mb-3">
                <label for="propertyType" class="form-label">Property Type *</label>
                <select class="form-select" id="propertyType" required>
                    <option value="">Select property type...</option>
                    <option value="apartment">Apartment</option>
                    <option value="house">Independent House</option>
                    <option value="villa">Villa</option>
                    <option value="office">Office/Commercial</option>
                </select>
            </div>
            <div class="row">
                <div class="col-md-6 mb-3">
                    <label for="propertyValue" class="form-label">Property Value *</label>
                    <select class="form-select" id="propertyValue" required>
                        <option value="">Select property value...</option>
                        <option value="1000000">₹10,00,000 - ₹25,00,000</option>
                        <option value="3000000">₹30,00,000 - ₹50,00,000</option>
                        <option value="6000000">₹60,00,000 - ₹1,00,00,000</option>
                        <option value="15000000">₹1,50,00,000+</option>
                    </select>
                </div>
                <div class="col-md-6 mb-3">
                    <label for="builtUpArea" class="form-label">Built-up Area (sq ft) *</label>
                    <input type="number" class="form-control" id="builtUpArea" placeholder="e.g., 1200" required>
                </div>
            </div>
            <div class="mb-3">
                <label for="city" class="form-label">City *</label>
                <input type="text" class="form-control" id="city" placeholder="Enter your city" required>
            </div>
        `;
    }

    /**
     * Get travel insurance specific fields
     */
    getTravelInsuranceFields() {
        return `
            <div class="row">
                <div class="col-md-6 mb-3">
                    <label for="tripType" class="form-label">Trip Type *</label>
                    <select class="form-select" id="tripType" required>
                        <option value="">Select trip type...</option>
                        <option value="single">Single Trip</option>
                        <option value="annual">Annual Multi-Trip</option>
                    </select>
                </div>
                <div class="col-md-6 mb-3">
                    <label for="travelers" class="form-label">Number of Travelers *</label>
                    <select class="form-select" id="travelers" required>
                        <option value="">Select number...</option>
                        <option value="1">1 Person</option>
                        <option value="2">2 Persons</option>
                        <option value="3">3 Persons</option>
                        <option value="4">4 Persons</option>
                        <option value="5">5+ Persons</option>
                    </select>
                </div>
            </div>
            <div class="row">
                <div class="col-md-6 mb-3">
                    <label for="departureDate" class="form-label">Departure Date *</label>
                    <input type="date" class="form-control" id="departureDate" required>
                </div>
                <div class="col-md-6 mb-3">
                    <label for="returnDate" class="form-label">Return Date *</label>
                    <input type="date" class="form-control" id="returnDate" required>
                </div>
            </div>
            <div class="mb-3">
                <label for="destination" class="form-label">Destination Country *</label>
                <select class="form-select" id="destination" required>
                    <option value="">Select destination...</option>
                    <option value="asia">Asia</option>
                    <option value="europe">Europe</option>
                    <option value="america">North/South America</option>
                    <option value="australia">Australia/New Zealand</option>
                    <option value="africa">Africa</option>
                    <option value="worldwide">Worldwide</option>
                </select>
            </div>
        `;
    }

    /**
     * Get business insurance specific fields
     */
    getBusinessInsuranceFields() {
        return `
            <div class="mb-3">
                <label for="businessType" class="form-label">Business Type *</label>
                <select class="form-select" id="businessType" required>
                    <option value="">Select business type...</option>
                    <option value="retail">Retail/Shop</option>
                    <option value="office">Office</option>
                    <option value="manufacturing">Manufacturing</option>
                    <option value="restaurant">Restaurant/Hotel</option>
                    <option value="professional">Professional Services</option>
                    <option value="other">Other</option>
                </select>
            </div>
            <div class="row">
                <div class="col-md-6 mb-3">
                    <label for="annualRevenue" class="form-label">Annual Revenue *</label>
                    <select class="form-select" id="annualRevenue" required>
                        <option value="">Select annual revenue...</option>
                        <option value="500000">₹5,00,000 - ₹10,00,000</option>
                        <option value="1500000">₹15,00,000 - ₹50,00,000</option>
                        <option value="7500000">₹75,00,000 - ₹2,00,00,000</option>
                        <option value="30000000">₹3,00,00,000+</option>
                    </select>
                </div>
                <div class="col-md-6 mb-3">
                    <label for="employees" class="form-label">Number of Employees *</label>
                    <select class="form-select" id="employees" required>
                        <option value="">Select number...</option>
                        <option value="1-5">1-5 employees</option>
                        <option value="6-20">6-20 employees</option>
                        <option value="21-50">21-50 employees</option>
                        <option value="51-100">51-100 employees</option>
                        <option value="100plus">100+ employees</option>
                    </select>
                </div>
            </div>
            <div class="mb-3">
                <label for="businessLocation" class="form-label">Business Location *</label>
                <input type="text" class="form-control" id="businessLocation" placeholder="Enter city/state" required>
            </div>
        `;
    }

    /**
     * Generate year options for select dropdown
     */
    generateYearOptions(startYear, endYear) {
        let options = '';
        for (let year = endYear; year >= startYear; year--) {
            options += `<option value="${year}">${year}</option>`;
        }
        return options;
    }

    /**
     * Navigate to next step
     */
    nextStep(step) {
        if (!this.validateCurrentStep()) {
            return;
        }

        this.collectStepData();
        this.showStep(step);
    }

    /**
     * Navigate to previous step
     */
    previousStep(step) {
        this.showStep(step);
    }

    /**
     * Show specific step
     */
    showStep(step) {
        // Hide all steps
        document.querySelectorAll('.quote-step').forEach(stepDiv => {
            stepDiv.style.display = 'none';
        });

        // Show target step
        document.getElementById(`step${step}`).style.display = 'block';

        // Update progress
        this.currentStep = step;
        document.getElementById('currentStep').textContent = step;
        const progress = (step / 3) * 100;
        document.getElementById('quoteProgress').style.width = `${progress}%`;

        // Generate coverage options for step 3
        if (step === 3) {
            this.generateCoverageOptions();
        }
    }

    /**
     * Validate current step
     */
    validateCurrentStep() {
        const currentStepDiv = document.getElementById(`step${this.currentStep}`);
        const requiredFields = currentStepDiv.querySelectorAll('[required]');

        for (let field of requiredFields) {
            if (!field.value.trim()) {
                this.showErrorMessage(`Please fill in all required fields.`);
                field.focus();
                return false;
            }
        }

        return true;
    }

    /**
     * Collect data from current step
     */
    collectStepData() {
        if (this.currentStep === 1) {
            this.quoteData.personalInfo = {
                firstName: document.getElementById('firstName').value,
                lastName: document.getElementById('lastName').value,
                email: document.getElementById('email').value,
                phone: document.getElementById('phone').value,
                dateOfBirth: document.getElementById('dateOfBirth').value
            };
        } else if (this.currentStep === 2) {
            this.quoteData.insuranceDetails = this.collectInsuranceDetails();
        }
    }

    /**
     * Collect insurance-specific details
     */
    collectInsuranceDetails() {
        const details = {};

        // Get all form fields from the dynamic fields container
        const container = document.getElementById('dynamicFields');
        const inputs = container.querySelectorAll('input, select');

        inputs.forEach(input => {
            if (input.id) {
                details[input.id] = input.value;
            }
        });

        return details;
    }

    /**
     * Generate coverage options for step 3
     */
    generateCoverageOptions() {
        const container = document.getElementById('coverageOptions');

        const coverageOptions = this.getCoverageOptionsForType(this.selectedInsuranceType);

        container.innerHTML = `
            <div class="row">
                ${coverageOptions.map(option => `
                    <div class="col-md-4 mb-3">
                        <div class="card h-100 coverage-option-card">
                            <div class="card-body text-center">
                                <h5 class="card-title">${option.name}</h5>
                                <p class="card-text text-muted">${option.description}</p>
                                <div class="form-check">
                                    <input class="form-check-input" type="checkbox" id="${option.id}" checked>
                                    <label class="form-check-label" for="${option.id}">
                                        Include in quote
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    }

    /**
     * Get coverage options based on insurance type
     */
    getCoverageOptionsForType(type) {
        const options = {
            health: [
                { id: 'hospitalization', name: 'Hospitalization', description: 'Coverage for hospital stays and treatment' },
                { id: 'daycare', name: 'Day Care Procedures', description: 'Coverage for same-day surgeries' },
                { id: 'maternity', name: 'Maternity Benefits', description: 'Coverage for pregnancy and childbirth' }
            ],
            life: [
                { id: 'death', name: 'Death Benefit', description: 'Lump sum payment on death' },
                { id: 'disability', name: 'Disability Benefit', description: 'Income replacement if disabled' },
                { id: 'critical', name: 'Critical Illness', description: 'Coverage for major illnesses' }
            ],
            motor: [
                { id: 'thirdparty', name: 'Third Party Liability', description: 'Legal liability to third parties' },
                { id: 'ownDamage', name: 'Own Damage', description: 'Coverage for your vehicle damage' },
                { id: 'personalAccident', name: 'Personal Accident', description: 'Accident coverage for driver' }
            ],
            home: [
                { id: 'structure', name: 'Building Structure', description: 'Coverage for building damage' },
                { id: 'contents', name: 'Contents Insurance', description: 'Coverage for household items' },
                { id: 'theft', name: 'Theft Coverage', description: 'Protection against burglary' }
            ],
            travel: [
                { id: 'medical', name: 'Medical Expenses', description: 'Emergency medical coverage abroad' },
                { id: 'tripCancellation', name: 'Trip Cancellation', description: 'Coverage for cancelled trips' },
                { id: 'baggage', name: 'Baggage Loss', description: 'Coverage for lost luggage' }
            ],
            business: [
                { id: 'property', name: 'Property Damage', description: 'Coverage for business property' },
                { id: 'liability', name: 'Public Liability', description: 'Legal liability coverage' },
                { id: 'businessInterruption', name: 'Business Interruption', description: 'Lost income coverage' }
            ]
        };

        return options[type] || [];
    }

    /**
     * Get insurance quote
     */
    async getQuote() {
        try {
            // Collect coverage options
            const selectedCoverages = [];
            document.querySelectorAll('#coverageOptions input[type="checkbox"]:checked').forEach(checkbox => {
                selectedCoverages.push(checkbox.id);
            });

            this.quoteData.selectedCoverages = selectedCoverages;

            // Show loading
            const quoteButton = document.querySelector('#step3 button[onclick="getQuote()"]');
            const originalText = quoteButton.innerHTML;
            quoteButton.disabled = true;
            quoteButton.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i> Calculating...';

            // Simulate API call delay
            await new Promise(resolve => setTimeout(resolve, 3000));

            // Generate quote results
            const quotes = this.generateQuoteResults();

            // Display results
            this.displayQuoteResults(quotes);

            // Hide form and show results
            document.getElementById('quote-form').style.display = 'none';
            document.getElementById('quote-results').style.display = 'block';

            // Reset button
            quoteButton.disabled = false;
            quoteButton.innerHTML = originalText;

        } catch (error) {
            console.error('Error getting quote:', error);
            this.showErrorMessage('Failed to generate quote. Please try again.');
        }
    }

    /**
     * Generate mock quote results
     */
    generateQuoteResults() {
        const basePrices = {
            health: { min: 5000, max: 15000 },
            life: { min: 8000, max: 25000 },
            motor: { min: 3000, max: 12000 },
            home: { min: 2000, max: 8000 },
            travel: { min: 1500, max: 5000 },
            business: { min: 10000, max: 50000 }
        };

        const insurers = ['HDFC ERGO', 'ICICI Lombard', 'Bajaj Allianz', 'SBI General', 'Tata AIG'];

        const quotes = insurers.map((insurer, index) => {
            const basePrice = basePrices[this.selectedInsuranceType];
            const price = Math.floor(Math.random() * (basePrice.max - basePrice.min) + basePrice.min);
            const discount = Math.floor(Math.random() * 20) + 5; // 5-25% discount

            return {
                id: `quote-${index + 1}`,
                insurer: insurer,
                price: price,
                discountedPrice: Math.floor(price * (1 - discount / 100)),
                discount: discount,
                rating: (Math.random() * 1 + 4).toFixed(1), // 4.0-5.0 rating
                features: this.getRandomFeatures(),
                logo: `https://via.placeholder.com/60x60/0066cc/white?text=${insurer.charAt(0)}`
            };
        });

        // Sort by discounted price
        return quotes.sort((a, b) => a.discountedPrice - b.discountedPrice);
    }

    /**
     * Get random features for quote
     */
    getRandomFeatures() {
        const allFeatures = [
            '24/7 Claim Support', 'Cashless Hospitals', 'No Claim Bonus', 'Free Health Checkup',
            'Personal Accident Cover', 'Zero Depreciation', 'Roadside Assistance', 'Concierge Services'
        ];

        const numFeatures = Math.floor(Math.random() * 3) + 3; // 3-5 features
        const shuffled = allFeatures.sort(() => 0.5 - Math.random());
        return shuffled.slice(0, numFeatures);
    }

    /**
     * Display quote results
     */
    displayQuoteResults(quotes) {
        const container = document.getElementById('quoteResultsContainer');

        container.innerHTML = quotes.map(quote => `
            <div class="col-lg-4 mb-4">
                <div class="card h-100 quote-result-card border-0 shadow-sm">
                    <div class="card-header bg-primary text-white text-center py-3">
                        <img src="${quote.logo}" alt="${quote.insurer}" class="rounded-circle mb-2" style="width: 40px; height: 40px;">
                        <h5 class="mb-0">${quote.insurer}</h5>
                        <div class="rating">
                            ${'★'.repeat(Math.floor(quote.rating))}${'☆'.repeat(5 - Math.floor(quote.rating))}
                            <small class="ms-1">${quote.rating}</small>
                        </div>
                    </div>
                    <div class="card-body text-center p-4">
                        <div class="price-section mb-3">
                            <span class="original-price text-muted">₹${quote.price.toLocaleString()}</span>
                            <h3 class="final-price text-success fw-bold">₹${quote.discountedPrice.toLocaleString()}</h3>
                            <span class="badge bg-success">${quote.discount}% OFF</span>
                        </div>
                        <div class="features mb-3">
                            <small class="text-muted">Key Features:</small>
                            <ul class="list-unstyled small mt-2">
                                ${quote.features.map(feature => `<li><i class="fas fa-check text-success me-1"></i>${feature}</li>`).join('')}
                            </ul>
                        </div>
                        <div class="d-grid gap-2">
                            <button class="btn btn-primary" onclick="selectQuote('${quote.id}')">
                                <i class="fas fa-shopping-cart me-2"></i> Buy Now
                            </button>
                            <button class="btn btn-outline-primary" onclick="viewQuoteDetails('${quote.id}')">
                                <i class="fas fa-info-circle me-2"></i> View Details
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `).join('');
    }

    /**
     * Purchase selected policy
     */
    purchasePolicy() {
        if (this.authManager.isLoggedIn()) {
            // Redirect to policies page or handle purchase
            window.location.href = 'policies.html';
        } else {
            // Redirect to login
            window.location.href = 'login.html';
        }
    }

    /**
     * Reset quote process
     */
    resetQuote() {
        this.currentStep = 1;
        this.selectedInsuranceType = null;
        this.quoteData = {};

        // Reset form
        document.getElementById('personalInfoForm').reset();
        document.getElementById('insuranceDetailsForm').reset();

        // Show insurance types, hide form and results
        document.getElementById('insurance-types').style.display = 'block';
        document.getElementById('quote-form').style.display = 'none';
        document.getElementById('quote-results').style.display = 'none';

        // Reset progress
        document.getElementById('quoteProgress').style.width = '33%';
        document.getElementById('currentStep').textContent = '1';

        // Scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    /**
     * Show success message
     */
    showSuccessMessage(message) {
        this.showAlert(message, 'success');
    }

    /**
     * Show error message
     */
    showErrorMessage(message) {
        this.showAlert(message, 'danger');
    }

    /**
     * Show alert message
     */
    showAlert(message, type) {
        // Remove existing alerts
        const existingAlerts = document.querySelectorAll('.alert');
        existingAlerts.forEach(alert => alert.remove());

        // Create new alert
        const alertDiv = document.createElement('div');
        alertDiv.className = `alert alert-${type} alert-dismissible fade show`;
        alertDiv.innerHTML = `
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        `;

        // Insert at top of page
        const container = document.querySelector('.container');
        if (container) {
            container.insertBefore(alertDiv, container.firstChild);
        }

        // Auto-dismiss after 5 seconds
        setTimeout(() => {
            if (alertDiv.parentNode) {
                alertDiv.remove();
            }
        }, 5000);
    }
}

// Global functions for HTML onclick handlers
function selectInsuranceType(typeId) {
    if (window.quoteManager) {
        window.quoteManager.selectInsuranceType(typeId);
    }
}

function nextStep(step) {
    if (window.quoteManager) {
        window.quoteManager.nextStep(step);
    }
}

function previousStep(step) {
    if (window.quoteManager) {
        window.quoteManager.previousStep(step);
    }
}

function getQuote() {
    if (window.quoteManager) {
        window.quoteManager.getQuote();
    }
}

function selectQuote(quoteId) {
    if (window.quoteManager) {
        window.quoteManager.purchasePolicy();
    }
}

function viewQuoteDetails(quoteId) {
    // For now, just show an alert
    alert('Quote details would be shown here in a modal or separate page.');
}

function purchasePolicy() {
    if (window.quoteManager) {
        window.quoteManager.purchasePolicy();
    }
}

function resetQuote() {
    if (window.quoteManager) {
        window.quoteManager.resetQuote();
    }
}

function scrollToSection(sectionId) {
    const element = document.getElementById(sectionId);
    if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
    }
}

function logoutUser(event) {
    event.preventDefault();
    if (window.authManager) {
        window.authManager.logout();
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    window.quoteManager = new QuoteManager();
});