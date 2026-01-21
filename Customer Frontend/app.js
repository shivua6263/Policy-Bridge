// AngularJS Application for Policy Bridge Login

var app = angular.module('loginApp', []);

app.controller('LoginController', ['$scope', '$http', '$window', function($scope, $http, $window) {
    
    // ========== INITIALIZATION ==========
    $scope.userType = 'customer'; // 'customer' or 'agent'
    $scope.currentMode = 'login'; // 'login' or 'signup'
    $scope.isLoading = false;
    $scope.errorMessage = '';
    $scope.successMessage = '';
    $scope.passwordMismatch = false;

    // API Base URL - Match your backend server
    const API_BASE_URL = CONFIG.API_BASE_URL; // Centralized configuration

    // ========== MODE AND TYPE SWITCHING ==========
    $scope.switchMode = function(mode) {
        $scope.currentMode = mode;
        $scope.errorMessage = '';
        $scope.successMessage = '';
        
        // Clear forms
        if (mode === 'login') {
            $scope.loginData = {};
        } else {
            $scope.signupData = {};
            $scope.passwordMismatch = false;
        }
    };

    $scope.switchUserType = function(type) {
        $scope.userType = type;
        $scope.errorMessage = '';
        $scope.successMessage = '';
        $scope.currentMode = 'login';
        
        // Clear forms
        $scope.loginData = {};
        $scope.signupData = {};
        $scope.passwordMismatch = false;
    };

    // ========== PASSWORD VALIDATION ==========
    $scope.$watch('signupData.password + signupData.confirmPassword', function() {
        if ($scope.signupData && $scope.signupData.password && $scope.signupData.confirmPassword) {
            $scope.passwordMismatch = $scope.signupData.password !== $scope.signupData.confirmPassword;
        }
    });

    // ========== LOGIN FUNCTIONALITY ==========
    $scope.login = function() {
        if (!$scope.loginData.email || !$scope.loginData.password) {
            $scope.errorMessage = 'Please fill in all fields';
            return;
        }

        $scope.isLoading = true;
        $scope.errorMessage = '';
        $scope.successMessage = '';

        // Determine the endpoint based on user type
        const endpoint = $scope.userType === 'customer' 
            ? `${API_BASE_URL}/customer/login/`
            : `${API_BASE_URL}/agent/login/`;

        const loginPayload = {
            email: $scope.loginData.email,
            password: $scope.loginData.password
        };

        // Configure CORS request
        $http.defaults.headers.post['Content-Type'] = 'application/json';

        $http.post(endpoint, loginPayload)
            .then(function(response) {
                $scope.successMessage = response.data.message || 'Login successful!';
                
                // Store user data in localStorage
                localStorage.setItem('currentUser', JSON.stringify({
                    ...response.data,
                    userType: $scope.userType
                }));

                // Redirect to home page after 1.5 seconds
                setTimeout(function() {
                    $window.location.href = 'index.html';
                }, 1500);
            })
            .catch(function(error) {
                $scope.isLoading = false;
                
                if (error.data && error.data.message) {
                    $scope.errorMessage = error.data.message;
                } else if (error.status === 401) {
                    $scope.errorMessage = 'Invalid email or password';
                } else if (error.status === 0) {
                    $scope.errorMessage = 'Unable to connect to server. Please check your internet connection.';
                } else {
                    $scope.errorMessage = 'An error occurred. Please try again.';
                }
            });
    };

    // ========== SIGNUP FUNCTIONALITY ==========
    $scope.signup = function() {
        // Validation
        if (!$scope.signupData.name || !$scope.signupData.email || 
            !$scope.signupData.phone_number || !$scope.signupData.password) {
            $scope.errorMessage = 'Please fill in all required fields';
            return;
        }

        if ($scope.passwordMismatch) {
            $scope.errorMessage = 'Passwords do not match';
            return;
        }

        if (!$scope.signupData.agreeTerms) {
            $scope.errorMessage = 'Please agree to the terms and conditions';
            return;
        }

        if ($scope.signupData.password.length < 6) {
            $scope.errorMessage = 'Password must be at least 6 characters';
            return;
        }

        $scope.isLoading = true;
        $scope.errorMessage = '';
        $scope.successMessage = '';

        // Determine the endpoint based on user type
        const endpoint = $scope.userType === 'customer'
            ? `${API_BASE_URL}/customer/signup/`
            : `${API_BASE_URL}/agent/signup/`;

        const signupPayload = {
            name: $scope.signupData.name,
            email: $scope.signupData.email,
            phone_number: $scope.signupData.phone_number,
            password: $scope.signupData.password
        };

        // Configure CORS request
        $http.defaults.headers.post['Content-Type'] = 'application/json';

        $http.post(endpoint, signupPayload)
            .then(function(response) {
                $scope.isLoading = false;
                $scope.successMessage = response.data.message || 'Account created successfully! Please login.';
                
                // Clear signup form and switch to login
                setTimeout(function() {
                    $scope.$apply(function() {
                        $scope.currentMode = 'login';
                        $scope.signupData = {};
                        $scope.passwordMismatch = false;
                        $scope.successMessage = '';
                    });
                }, 2000);
            })
            .catch(function(error) {
                $scope.isLoading = false;
                
                if (error.data) {
                    // Handle field-specific errors
                    if (error.data.email) {
                        $scope.errorMessage = 'Email: ' + error.data.email[0];
                    } else if (error.data.phone_number) {
                        $scope.errorMessage = 'Phone: ' + error.data.phone_number[0];
                    } else if (error.data.name) {
                        $scope.errorMessage = 'Name: ' + error.data.name[0];
                    } else if (error.data.password) {
                        $scope.errorMessage = 'Password: ' + error.data.password[0];
                    } else if (error.data.message) {
                        $scope.errorMessage = error.data.message;
                    } else {
                        $scope.errorMessage = 'Unable to create account. Please try again.';
                    }
                } else if (error.status === 0) {
                    $scope.errorMessage = 'Unable to connect to server. Please check your internet connection.';
                } else {
                    $scope.errorMessage = 'An error occurred. Please try again.';
                }
            });
    };

    // ========== UTILITY FUNCTIONS ==========

    // Check if user is already logged in
    $scope.checkExistingSession = function() {
        const currentUser = localStorage.getItem('currentUser');
        if (currentUser) {
            // User is already logged in, redirect to home
            $window.location.href = 'index.html';
        }
    };

    // Initialize on page load
    $scope.checkExistingSession();

    // ========== FORM INITIALIZATION ==========
    $scope.loginData = {};
    $scope.signupData = {};
}]);

