angular.module('insurancecompanyApp', [])
    .controller('InsuranceCompanyController', ['$scope', '$http', function($scope, $http) {
        
        const API_URL = 'http://127.0.0.1:8000/api/insurancecompany';
        
        $scope.companies = [];
        $scope.formData = {};
        $scope.editingId = null;
        $scope.successMessage = '';
        $scope.errorMessage = '';

        // Load all companies
        $scope.loadCompanies = function() {
            $http.get(API_URL + '/')
                .then(function(response) {
                    $scope.companies = response.data;
                })
                .catch(function(error) {
                    $scope.errorMessage = 'Error loading companies: ' + (error.data?.message || error.statusText);
                    console.error('Error loading companies:', error);
                });
        };

        // Save company (Create or Update)
        $scope.saveCompany = function() {
            if (!$scope.formData.name || !$scope.formData.email) {
                $scope.errorMessage = 'Please fill in all required fields';
                return;
            }

            if ($scope.editingId) {
                // Update existing company
                $http.put(API_URL + '/' + $scope.editingId + '/', $scope.formData)
                    .then(function(response) {
                        $scope.successMessage = 'Company updated successfully!';
                        $scope.loadCompanies();
                        $scope.resetForm();
                        setTimeout(() => $scope.successMessage = '', 3000);
                    })
                    .catch(function(error) {
                        $scope.errorMessage = 'Error updating company: ' + (error.data?.message || error.statusText);
                    });
            } else {
                // Create new company
                $http.post(API_URL + '/', $scope.formData)
                    .then(function(response) {
                        $scope.successMessage = 'Company created successfully!';
                        $scope.loadCompanies();
                        $scope.resetForm();
                        setTimeout(() => $scope.successMessage = '', 3000);
                    })
                    .catch(function(error) {
                        $scope.errorMessage = 'Error creating company: ' + (error.data?.message || error.statusText);
                    });
            }
        };

        // Edit company
        $scope.editCompany = function(company) {
            $scope.formData = angular.copy(company);
            $scope.editingId = company.id;
            window.scrollTo({ top: 0, behavior: 'smooth' });
        };

        // Delete company
        $scope.deleteCompany = function(id) {
            if (confirm('Are you sure you want to delete this company?')) {
                $http.delete(API_URL + '/' + id + '/')
                    .then(function(response) {
                        $scope.successMessage = 'Company deleted successfully!';
                        $scope.loadCompanies();
                        setTimeout(() => $scope.successMessage = '', 3000);
                    })
                    .catch(function(error) {
                        $scope.errorMessage = 'Error deleting company: ' + (error.data?.message || error.statusText);
                    });
            }
        };

        // Reset form
        $scope.resetForm = function() {
            $scope.formData = {};
            $scope.editingId = null;
            $scope.errorMessage = '';
        };

        // Initialize
        $scope.loadCompanies();
        $scope.resetForm();
    }]);
