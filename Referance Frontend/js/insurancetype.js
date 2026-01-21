angular.module('insurancetypeApp', [])
    .controller('InsuranceTypeController', ['$scope', '$http', function($scope, $http) {
        
        const API_URL = 'http://127.0.0.1:8000/api/insurancetype';
        
        $scope.types = [];
        $scope.formData = {};
        $scope.editingId = null;
        $scope.successMessage = '';
        $scope.errorMessage = '';

        // Load all types
        $scope.loadTypes = function() {
            $http.get(API_URL + '/')
                .then(function(response) {
                    $scope.types = response.data;
                })
                .catch(function(error) {
                    $scope.errorMessage = 'Error loading types: ' + (error.data?.message || error.statusText);
                    console.error('Error loading types:', error);
                });
        };

        // Save type (Create or Update)
        $scope.saveType = function() {
            if (!$scope.formData.name) {
                $scope.errorMessage = 'Please fill in all required fields';
                return;
            }

            if ($scope.editingId) {
                // Update existing type
                $http.put(API_URL + '/' + $scope.editingId + '/', $scope.formData)
                    .then(function(response) {
                        $scope.successMessage = 'Insurance type updated successfully!';
                        $scope.loadTypes();
                        $scope.resetForm();
                        setTimeout(() => $scope.successMessage = '', 3000);
                    })
                    .catch(function(error) {
                        $scope.errorMessage = 'Error updating type: ' + (error.data?.message || error.statusText);
                    });
            } else {
                // Create new type
                $http.post(API_URL + '/', $scope.formData)
                    .then(function(response) {
                        $scope.successMessage = 'Insurance type created successfully!';
                        $scope.loadTypes();
                        $scope.resetForm();
                        setTimeout(() => $scope.successMessage = '', 3000);
                    })
                    .catch(function(error) {
                        $scope.errorMessage = 'Error creating type: ' + (error.data?.message || error.statusText);
                    });
            }
        };

        // Edit type
        $scope.editType = function(type) {
            $scope.formData = angular.copy(type);
            $scope.editingId = type.id;
            window.scrollTo({ top: 0, behavior: 'smooth' });
        };

        // Delete type
        $scope.deleteType = function(id) {
            if (confirm('Are you sure you want to delete this type?')) {
                $http.delete(API_URL + '/' + id + '/')
                    .then(function(response) {
                        $scope.successMessage = 'Insurance type deleted successfully!';
                        $scope.loadTypes();
                        setTimeout(() => $scope.successMessage = '', 3000);
                    })
                    .catch(function(error) {
                        $scope.errorMessage = 'Error deleting type: ' + (error.data?.message || error.statusText);
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
        $scope.loadTypes();
        $scope.resetForm();
    }]);
