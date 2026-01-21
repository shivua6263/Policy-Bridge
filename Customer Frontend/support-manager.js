/**
 * Support Manager - Handles customer support functionality
 * Manages support tickets, live chat, and contact forms
 */

class SupportManager {
    constructor() {
        this.apiBaseUrl = CONFIG.API_BASE_URL;
        this.authManager = new AuthManager();
        this.init();
    }

    /**
     * Initialize support functionality
     */
    init() {
        this.loadUserInfo();
        this.setupEventListeners();
        this.loadSupportTickets();
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
     * Setup event listeners for support forms and buttons
     */
    setupEventListeners() {
        // Support form submission
        const supportForm = document.getElementById('supportForm');
        if (supportForm) {
            supportForm.addEventListener('submit', (e) => this.handleSupportFormSubmit(e));
        }

        // File upload validation
        const attachmentsInput = document.getElementById('attachments');
        if (attachmentsInput) {
            attachmentsInput.addEventListener('change', (e) => this.validateAttachments(e));
        }
    }

    /**
     * Handle support form submission
     */
    async handleSupportFormSubmit(event) {
        event.preventDefault();

        const submitButton = event.target.querySelector('button[type="submit"]');
        const originalText = submitButton.innerHTML;

        // Show loading state
        submitButton.disabled = true;
        submitButton.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i> Submitting...';

        try {
            const formData = this.collectFormData();

            // Validate form data
            if (!this.validateFormData(formData)) {
                throw new Error('Please fill in all required fields');
            }

            // Submit support ticket
            const response = await this.submitSupportTicket(formData);

            if (response.success) {
                this.showSuccessMessage('Support ticket submitted successfully! Ticket ID: ' + response.ticketId);
                this.resetForm();
                this.loadSupportTickets(); // Refresh tickets list
            } else {
                throw new Error(response.message || 'Failed to submit support ticket');
            }

        } catch (error) {
            console.error('Support form submission error:', error);
            this.showErrorMessage(error.message || 'An error occurred while submitting your request');
        } finally {
            // Reset button state
            submitButton.disabled = false;
            submitButton.innerHTML = originalText;
        }
    }

    /**
     * Collect form data from support form
     */
    collectFormData() {
        return {
            firstName: document.getElementById('firstName').value.trim(),
            lastName: document.getElementById('lastName').value.trim(),
            email: document.getElementById('email').value.trim(),
            phone: document.getElementById('phone').value.trim(),
            subject: document.getElementById('subject').value,
            priority: document.getElementById('priority').value,
            message: document.getElementById('message').value.trim(),
            attachments: document.getElementById('attachments').files,
            newsletter: document.getElementById('newsletter').checked,
            customerId: this.authManager.getUserId(),
            submittedAt: new Date().toISOString()
        };
    }

    /**
     * Validate form data
     */
    validateFormData(data) {
        if (!data.firstName || !data.lastName || !data.email || !data.subject || !data.message) {
            return false;
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(data.email)) {
            return false;
        }

        return true;
    }

    /**
     * Validate file attachments
     */
    validateAttachments(event) {
        const files = event.target.files;
        const maxSize = 5 * 1024 * 1024; // 5MB
        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];

        for (let file of files) {
            if (file.size > maxSize) {
                this.showErrorMessage(`File "${file.name}" is too large. Maximum size is 5MB.`);
                event.target.value = '';
                return;
            }

            if (!allowedTypes.includes(file.type)) {
                this.showErrorMessage(`File type "${file.type}" is not allowed. Supported formats: JPG, PNG, PDF, DOC, DOCX.`);
                event.target.value = '';
                return;
            }
        }
    }

    /**
     * Submit support ticket to backend
     */
    async submitSupportTicket(formData) {
        try {
            const response = await fetch(`${this.apiBaseUrl}/support-tickets/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    // Add authentication header if needed
                    // 'Authorization': `Bearer ${this.authManager.getToken()}`
                },
                body: JSON.stringify({
                    customer: formData.customerId,
                    subject: formData.subject,
                    priority: formData.priority,
                    first_name: formData.firstName,
                    last_name: formData.lastName,
                    email: formData.email,
                    phone: formData.phone,
                    message: formData.message,
                    attachments: formData.attachments ? Array.from(formData.attachments).map(file => file.name) : []
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.detail || 'Failed to submit support ticket');
            }

            const data = await response.json();
            return {
                success: true,
                ticketId: data.ticket_id,
                message: 'Support ticket created successfully'
            };

        } catch (error) {
            console.error('Error submitting support ticket:', error);
            // Fallback to localStorage for demo purposes if API fails
            const ticketId = 'TICK-' + Date.now();
            const tickets = JSON.parse(localStorage.getItem('supportTickets') || '[]');
            const ticket = {
                id: ticketId,
                ...formData,
                status: 'open',
                createdAt: new Date().toISOString(),
                responses: []
            };
            tickets.push(ticket);
            localStorage.setItem('supportTickets', JSON.stringify(tickets));

            return {
                success: true,
                ticketId: ticketId,
                message: 'Support ticket created successfully (offline mode)'
            };
        }
    }

    /**
     * Load and display support tickets
     */
    async loadSupportTickets() {
        if (!this.authManager.isLoggedIn()) return;

        try {
            const customerId = this.authManager.getUserId();
            const response = await fetch(`${this.apiBaseUrl}/support-tickets/?customer=${customerId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    // Add authentication header if needed
                }
            });

            if (response.ok) {
                const tickets = await response.json();
                console.log('Support tickets from API:', tickets);
                // Store in localStorage as backup
                localStorage.setItem('supportTickets', JSON.stringify(tickets));
            } else {
                console.warn('Failed to load tickets from API, using localStorage');
                // Fallback to localStorage
                const tickets = JSON.parse(localStorage.getItem('supportTickets') || '[]');
                console.log('Support tickets from localStorage:', tickets);
            }
        } catch (error) {
            console.error('Error loading support tickets:', error);
            // Fallback to localStorage
            const tickets = JSON.parse(localStorage.getItem('supportTickets') || '[]');
            console.log('Support tickets from localStorage:', tickets);
        }
    }

    /**
     * Start live chat simulation
     */
    startLiveChat() {
        // Simulate live chat functionality
        const chatWindow = window.open('', 'LiveChat', 'width=400,height=600,scrollbars=yes,resizable=yes');

        if (chatWindow) {
            chatWindow.document.write(`
                <!DOCTYPE html>
                <html>
                <head>
                    <title>Live Chat - Policy Bridge</title>
                    <style>
                        body { font-family: Arial, sans-serif; margin: 0; padding: 20px; background: #f8f9fa; }
                        .chat-container { max-width: 350px; margin: 0 auto; background: white; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
                        .chat-header { background: #0066cc; color: white; padding: 15px; border-radius: 10px 10px 0 0; text-align: center; }
                        .chat-messages { height: 300px; padding: 15px; overflow-y: auto; }
                        .message { margin-bottom: 10px; padding: 8px 12px; border-radius: 18px; max-width: 80%; }
                        .agent { background: #e3f2fd; margin-right: auto; }
                        .user { background: #0066cc; color: white; margin-left: auto; text-align: right; }
                        .chat-input { padding: 15px; border-top: 1px solid #eee; }
                        .chat-input input { width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 20px; }
                        .chat-input button { width: 100%; margin-top: 10px; padding: 10px; background: #0066cc; color: white; border: none; border-radius: 20px; cursor: pointer; }
                    </style>
                </head>
                <body>
                    <div class="chat-container">
                        <div class="chat-header">
                            <h4>Live Chat Support</h4>
                            <small>Typically responds in under 2 minutes</small>
                        </div>
                        <div class="chat-messages" id="chatMessages">
                            <div class="message agent">Hi! Welcome to Policy Bridge support. How can I help you today?</div>
                        </div>
                        <div class="chat-input">
                            <input type="text" id="messageInput" placeholder="Type your message..." onkeypress="handleKeyPress(event)">
                            <button onclick="sendMessage()">Send</button>
                        </div>
                    </div>
                    <script>
                        let messageCount = 0;
                        function sendMessage() {
                            const input = document.getElementById('messageInput');
                            const message = input.value.trim();
                            if (message) {
                                addMessage(message, 'user');
                                input.value = '';

                                // Simulate agent response
                                setTimeout(() => {
                                    const responses = [
                                        "I understand your concern. Let me check that for you.",
                                        "Thank you for providing that information. I'm looking into this now.",
                                        "I can help you with that. Could you please provide more details?",
                                        "That's a great question! Here's what I can tell you...",
                                        "I'm sorry for any inconvenience. Let me assist you with this issue."
                                    ];
                                    const randomResponse = responses[Math.floor(Math.random() * responses.length)];
                                    addMessage(randomResponse, 'agent');
                                }, 1000 + Math.random() * 2000);
                            }
                        }

                        function addMessage(text, sender) {
                            const messagesDiv = document.getElementById('chatMessages');
                            const messageDiv = document.createElement('div');
                            messageDiv.className = 'message ' + sender;
                            messageDiv.textContent = text;
                            messagesDiv.appendChild(messageDiv);
                            messagesDiv.scrollTop = messagesDiv.scrollHeight;
                        }

                        function handleKeyPress(event) {
                            if (event.key === 'Enter') {
                                sendMessage();
                            }
                        }
                    </script>
                </body>
                </html>
            `);
        } else {
            alert('Please allow popups for this site to use live chat.');
        }
    }

    /**
     * Handle phone support call
     */
    callSupport() {
        // In a real implementation, this would integrate with a VoIP service
        // For now, show contact information
        if (confirm('Would you like to call our support line at +1 (800) 123-4567?')) {
            window.location.href = 'tel:+18001234567';
        }
    }

    /**
     * Reset support form
     */
    resetForm() {
        document.getElementById('supportForm').reset();
        document.getElementById('priority').value = 'medium'; // Reset to default
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

        // Insert at top of form
        const form = document.getElementById('supportForm');
        if (form) {
            form.parentNode.insertBefore(alertDiv, form);
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
function startLiveChat() {
    if (window.supportManager) {
        window.supportManager.startLiveChat();
    }
}

function callSupport() {
    if (window.supportManager) {
        window.supportManager.callSupport();
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
    window.supportManager = new SupportManager();
});