angular.module('customerpolicyApp', [])
    .controller('CustomerPolicyController', ['$scope', '$http', function($scope, $http) {
        
        const API_URL = 'http://127.0.0.1:8000/api/customerpolicy';
        
        $scope.mappings = [];
        $scope.formData = {};
        $scope.editingId = null;
        $scope.successMessage = '';
        $scope.errorMessage = '';

        // Load all mappings
        $scope.loadMappings = function() {
            $http.get(API_URL + '/')
                .then(function(response) {
                    $scope.mappings = response.data;
                })
                .catch(function(error) {
                    $scope.errorMessage = 'Error loading mappings: ' + (error.data?.message || error.statusText);
                    console.error('Error loading mappings:', error);
                });
        };

        // Save mapping (Create or Update)
        $scope.saveMapping = function() {
            if (!$scope.formData.customer_id || !$scope.formData.policy_id) {
                $scope.errorMessage = 'Please fill in all required fields';
                return;
            }

            if ($scope.editingId) {
                // Update existing mapping
                $http.put(API_URL + '/' + $scope.editingId + '/', $scope.formData)
                    .then(function(response) {
                        $scope.successMessage = 'Mapping updated successfully!';
                        $scope.loadMappings();
                        $scope.resetForm();
                        setTimeout(() => $scope.successMessage = '', 3000);
                    })
                    .catch(function(error) {
                        $scope.errorMessage = 'Error updating mapping: ' + (error.data?.message || error.statusText);
                    });
            } else {
                // Create new mapping
                $http.post(API_URL + '/', $scope.formData)
                    .then(function(response) {
                        $scope.successMessage = 'Mapping created successfully!';
                        $scope.loadMappings();
                        $scope.resetForm();
                        setTimeout(() => $scope.successMessage = '', 3000);
                    })
                    .catch(function(error) {
                        $scope.errorMessage = 'Error creating mapping: ' + (error.data?.message || error.statusText);
                    });
            }
        };

        // Edit mapping
        $scope.editMapping = function(mapping) {
            $scope.formData = angular.copy(mapping);
            $scope.editingId = mapping.id;
            window.scrollTo({ top: 0, behavior: 'smooth' });
        };

        // Delete mapping
        $scope.deleteMapping = function(id) {
            if (confirm('Are you sure you want to delete this mapping?')) {
                $http.delete(API_URL + '/' + id + '/')
                    .then(function(response) {
                        $scope.successMessage = 'Mapping deleted successfully!';
                        $scope.loadMappings();
                        setTimeout(() => $scope.successMessage = '', 3000);
                    })
                    .catch(function(error) {
                        $scope.errorMessage = 'Error deleting mapping: ' + (error.data?.message || error.statusText);
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
        $scope.loadMappings();
        $scope.resetForm();
    }]);
