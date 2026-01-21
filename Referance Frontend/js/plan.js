angular.module('planApp', [])
    .controller('PlanController', ['$scope', '$http', function($scope, $http) {
        
        const API_URL = 'http://127.0.0.1:8000/api/plan';
        
        $scope.plans = [];
        $scope.formData = {};
        $scope.editingId = null;
        $scope.successMessage = '';
        $scope.errorMessage = '';

        // Load all plans
        $scope.loadPlans = function() {
            $http.get(API_URL + '/')
                .then(function(response) {
                    $scope.plans = response.data;
                })
                .catch(function(error) {
                    $scope.errorMessage = 'Error loading plans: ' + (error.data?.message || error.statusText);
                    console.error('Error loading plans:', error);
                });
        };

        // Save plan (Create or Update)
        $scope.savePlan = function() {
            if (!$scope.formData.name || !$scope.formData.price || !$scope.formData.coverage_amount || !$scope.formData.duration_months) {
                $scope.errorMessage = 'Please fill in all required fields';
                return;
            }

            if ($scope.editingId) {
                // Update existing plan
                $http.put(API_URL + '/' + $scope.editingId + '/', $scope.formData)
                    .then(function(response) {
                        $scope.successMessage = 'Plan updated successfully!';
                        $scope.loadPlans();
                        $scope.resetForm();
                        setTimeout(() => $scope.successMessage = '', 3000);
                    })
                    .catch(function(error) {
                        $scope.errorMessage = 'Error updating plan: ' + (error.data?.message || error.statusText);
                    });
            } else {
                // Create new plan
                $http.post(API_URL + '/', $scope.formData)
                    .then(function(response) {
                        $scope.successMessage = 'Plan created successfully!';
                        $scope.loadPlans();
                        $scope.resetForm();
                        setTimeout(() => $scope.successMessage = '', 3000);
                    })
                    .catch(function(error) {
                        $scope.errorMessage = 'Error creating plan: ' + (error.data?.message || error.statusText);
                    });
            }
        };

        // Edit plan
        $scope.editPlan = function(plan) {
            $scope.formData = angular.copy(plan);
            $scope.editingId = plan.id;
            window.scrollTo({ top: 0, behavior: 'smooth' });
        };

        // Delete plan
        $scope.deletePlan = function(id) {
            if (confirm('Are you sure you want to delete this plan?')) {
                $http.delete(API_URL + '/' + id + '/')
                    .then(function(response) {
                        $scope.successMessage = 'Plan deleted successfully!';
                        $scope.loadPlans();
                        setTimeout(() => $scope.successMessage = '', 3000);
                    })
                    .catch(function(error) {
                        $scope.errorMessage = 'Error deleting plan: ' + (error.data?.message || error.statusText);
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
        $scope.loadPlans();
        $scope.resetForm();
    }]);
