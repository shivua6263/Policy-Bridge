angular.module('customerApp', [])
    .controller('CustomerController', ['$scope', '$http', '$window', function($scope, $http, $window) {
        
        const API_URL = 'http://127.0.0.1:8000/api/customer/';
        
        $scope.customers = [];
        $scope.formData = {};
        $scope.editingId = null;
        $scope.successMessage = '';
        $scope.errorMessage = '';
        $scope.userData = {};

        // Check if user is logged in
        $scope.checkLogin = function() {
            var userData = sessionStorage.getItem('userData');
            if (!userData) {
                userData = localStorage.getItem('userData');
                if (!userData) {
                    $window.location.href = '../login.html';
                    return;
                }
            }
            $scope.userData = JSON.parse(userData);
        };

        // Logout
        $scope.logout = function() {
            if (confirm('Are you sure you want to logout?')) {
                sessionStorage.removeItem('userData');
                localStorage.removeItem('userData');
                $window.location.href = '../login.html';
            }
        };

        // Load all customers
        $scope.loadCustomers = function() {
            $http.get(API_URL)
                .then(function(response) {
                    $scope.customers = response.data;
                    console.log('Customers loaded:', $scope.customers);
                })
                .catch(function(error) {
                    $scope.errorMessage = 'Error loading customers: ' + (error.data?.message || error.statusText);
                    console.error('Error loading customers:', error);
                });
        };

        // Save customer (Create or Update)
        $scope.saveCustomer = function() {
            if (!$scope.formData.name || !$scope.formData.email) {
                $scope.errorMessage = 'Please fill in all required fields';
                return;
            }

            if ($scope.editingId) {
                // Update existing customer
                $http.put(API_URL + $scope.editingId + '/', $scope.formData)
                    .then(function(response) {
                        $scope.successMessage = 'Customer updated successfully!';
                        $scope.loadCustomers();
                        $scope.resetForm();
                        setTimeout(() => $scope.successMessage = '', 3000);
                    })
                    .catch(function(error) {
                        $scope.errorMessage = 'Error updating customer: ' + (error.data?.message || error.statusText);
                    });
            } else {
                // Create new customer
                $http.post(API_URL, $scope.formData)
                    .then(function(response) {
                        $scope.successMessage = 'Customer created successfully!';
                        $scope.loadCustomers();
                        $scope.resetForm();
                        setTimeout(() => $scope.successMessage = '', 3000);
                    })
                    .catch(function(error) {
                        $scope.errorMessage = 'Error creating customer: ' + (error.data?.message || error.statusText);
                    });
            }
        };

        // Edit customer
        $scope.editCustomer = function(customer) {
            $scope.formData = angular.copy(customer);
            $scope.editingId = customer.id;
            window.scrollTo({ top: 0, behavior: 'smooth' });
        };

        // Delete customer
        $scope.deleteCustomer = function(id) {
            if (confirm('Are you sure you want to delete this customer?')) {
                $http.delete(API_URL + id + '/')
                    .then(function(response) {
                        $scope.successMessage = 'Customer deleted successfully!';
                        $scope.loadCustomers();
                        setTimeout(() => $scope.successMessage = '', 3000);
                    })
                    .catch(function(error) {
                        $scope.errorMessage = 'Error deleting customer: ' + (error.data?.message || error.statusText);
                    });
            }
        };

        // Reset form
        $scope.resetForm = function() {
            $scope.formData = { status: 'active' };
            $scope.editingId = null;
            $scope.errorMessage = '';
        };

        // Initialize
        $scope.checkLogin();
        $scope.loadCustomers();
        $scope.resetForm();
    }]);

