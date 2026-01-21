angular.module('policyApp', [])
    .controller('PolicyController', ['$scope', '$http', function($scope, $http) {
        
        const API_URL = 'http://127.0.0.1:8000/api/policy';
        
        $scope.policies = [];
        $scope.formData = {};
        $scope.editingId = null;
        $scope.successMessage = '';
        $scope.errorMessage = '';

        // Load all policies
        $scope.loadPolicies = function() {
            $http.get(API_URL + '/')
                .then(function(response) {
                    $scope.policies = response.data;
                })
                .catch(function(error) {
                    $scope.errorMessage = 'Error loading policies: ' + (error.data?.message || error.statusText);
                    console.error('Error loading policies:', error);
                });
        };

        // Save policy (Create or Update)
        $scope.savePolicy = function() {
            if (!$scope.formData.policy_number || !$scope.formData.plan_id || !$scope.formData.insurance_company_id || !$scope.formData.insurance_type_id || !$scope.formData.start_date || !$scope.formData.end_date) {
                $scope.errorMessage = 'Please fill in all required fields';
                return;
            }

            if ($scope.editingId) {
                // Update existing policy
                $http.put(API_URL + '/' + $scope.editingId + '/', $scope.formData)
                    .then(function(response) {
                        $scope.successMessage = 'Policy updated successfully!';
                        $scope.loadPolicies();
                        $scope.resetForm();
                        setTimeout(() => $scope.successMessage = '', 3000);
                    })
                    .catch(function(error) {
                        $scope.errorMessage = 'Error updating policy: ' + (error.data?.message || error.statusText);
                    });
            } else {
                // Create new policy
                $http.post(API_URL + '/', $scope.formData)
                    .then(function(response) {
                        $scope.successMessage = 'Policy created successfully!';
                        $scope.loadPolicies();
                        $scope.resetForm();
                        setTimeout(() => $scope.successMessage = '', 3000);
                    })
                    .catch(function(error) {
                        $scope.errorMessage = 'Error creating policy: ' + (error.data?.message || error.statusText);
                    });
            }
        };

        // Edit policy
        $scope.editPolicy = function(policy) {
            $scope.formData = angular.copy(policy);
            $scope.editingId = policy.id;
            window.scrollTo({ top: 0, behavior: 'smooth' });
        };

        // Delete policy
        $scope.deletePolicy = function(id) {
            if (confirm('Are you sure you want to delete this policy?')) {
                $http.delete(API_URL + '/' + id + '/')
                    .then(function(response) {
                        $scope.successMessage = 'Policy deleted successfully!';
                        $scope.loadPolicies();
                        setTimeout(() => $scope.successMessage = '', 3000);
                    })
                    .catch(function(error) {
                        $scope.errorMessage = 'Error deleting policy: ' + (error.data?.message || error.statusText);
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
        $scope.loadPolicies();
        $scope.resetForm();
    }]);
