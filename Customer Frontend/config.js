// Configuration file for Policy Bridge Frontend
// Update this file to change backend URL and other settings

const CONFIG = {
    // Backend API Configuration
    API_BASE_URL: 'http://localhost:8000/api',
    BACKEND_URL: 'http://localhost:8000',

    // WebSocket Configuration
    WS_BASE_URL: 'ws://localhost:8000/ws',

    // Application Settings
    APP_NAME: 'Policy Bridge',
    VERSION: '1.0.0',

    // Feature Flags
    ENABLE_DEBUG: true,
    ENABLE_ANALYTICS: false,

    // Timeouts (in milliseconds)
    API_TIMEOUT: 10000,
    WS_RECONNECT_INTERVAL: 5000,

    // Pagination
    DEFAULT_PAGE_SIZE: 10,
    MAX_PAGE_SIZE: 100
};

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CONFIG;
}