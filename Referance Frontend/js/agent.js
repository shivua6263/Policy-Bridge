angular.module('agentApp', [])
    .controller('AgentController', ['$scope', '$http', function($scope, $http) {
        
        const API_URL = 'http://127.0.0.1:8000/api/agent';
        
        $scope.agents = [];
        $scope.formData = {};
        $scope.editingId = null;
        $scope.successMessage = '';
        $scope.errorMessage = '';

        // Load all agents
        $scope.loadAgents = function() {
            $http.get(API_URL + '/')
                .then(function(response) {
                    $scope.agents = response.data;
                })
                .catch(function(error) {
                    $scope.errorMessage = 'Error loading agents: ' + (error.data?.message || error.statusText);
                    console.error('Error loading agents:', error);
                });
        };

        // Save agent (Create or Update)
        $scope.saveAgent = function() {
            if (!$scope.formData.name || !$scope.formData.email || !$scope.formData.referral_code || !$scope.formData.commission_percentage) {
                $scope.errorMessage = 'Please fill in all required fields';
                return;
            }

            if ($scope.editingId) {
                // Update existing agent
                $http.put(API_URL + '/' + $scope.editingId + '/', $scope.formData)
                    .then(function(response) {
                        $scope.successMessage = 'Agent updated successfully!';
                        $scope.loadAgents();
                        $scope.resetForm();
                        setTimeout(() => $scope.successMessage = '', 3000);
                    })
                    .catch(function(error) {
                        $scope.errorMessage = 'Error updating agent: ' + (error.data?.message || error.statusText);
                    });
            } else {
                // Create new agent
                $http.post(API_URL + '/', $scope.formData)
                    .then(function(response) {
                        $scope.successMessage = 'Agent created successfully!';
                        $scope.loadAgents();
                        $scope.resetForm();
                        setTimeout(() => $scope.successMessage = '', 3000);
                    })
                    .catch(function(error) {
                        $scope.errorMessage = 'Error creating agent: ' + (error.data?.message || error.statusText);
                    });
            }
        };

        // Edit agent
        $scope.editAgent = function(agent) {
            $scope.formData = angular.copy(agent);
            $scope.editingId = agent.id;
            window.scrollTo({ top: 0, behavior: 'smooth' });
        };

        // Delete agent
        $scope.deleteAgent = function(id) {
            if (confirm('Are you sure you want to delete this agent?')) {
                $http.delete(API_URL + '/' + id + '/')
                    .then(function(response) {
                        $scope.successMessage = 'Agent deleted successfully!';
                        $scope.loadAgents();
                        setTimeout(() => $scope.successMessage = '', 3000);
                    })
                    .catch(function(error) {
                        $scope.errorMessage = 'Error deleting agent: ' + (error.data?.message || error.statusText);
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
        $scope.loadAgents();
        $scope.resetForm();
    }]);
