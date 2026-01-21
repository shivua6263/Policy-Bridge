
        angular.module('userApp', [])
            .controller('UserController', ['$scope', '$http', function($scope, $http) {
                const API_URL = 'http://127.0.0.1:8000/api/user';
                
                $scope.users = [];
                $scope.formData = {};
                $scope.editingId = null;
                $scope.successMessage = '';
                $scope.errorMessage = '';

                // Load users
                $scope.loadUsers = function() {
                    $http.get(API_URL + '/')
                        .then(function(response) {
                            $scope.users = response.data;
                        })
                        .catch(function(error) {
                            $scope.errorMessage = 'Error loading users: ' + (error.data?.message || error.statusText);
                            console.error('Error loading users:', error);
                        });
                };

                // Save user (Create or Update)
                $scope.saveUser = function() {
                    if (!$scope.formData.name || !$scope.formData.email) {
                        $scope.errorMessage = 'Please fill in all required fields';
                        return;
                    }

                    if ($scope.editingId) {
                        // Update existing user
                        $http.put(API_URL + '/' + $scope.editingId + '/', $scope.formData)
                            .then(function(response) {
                                $scope.successMessage = 'User updated successfully!';
                                $scope.loadUsers();
                                $scope.resetForm();
                                setTimeout(() => $scope.successMessage = '', 3000);
                            })
                            .catch(function(error) {
                                $scope.errorMessage = 'Error updating user: ' + (error.data?.message || error.statusText);
                            });
                    } else {
                        // Create new user
                        $http.post(API_URL + '/', $scope.formData)
                            .then(function(response) {
                                $scope.successMessage = 'User created successfully!';
                                $scope.loadUsers();
                                $scope.resetForm();
                                setTimeout(() => $scope.successMessage = '', 3000);
                            })
                            .catch(function(error) {
                                $scope.errorMessage = 'Error creating user: ' + (error.data?.message || error.statusText);
                            });
                    }
                };

                // Edit user
                $scope.editUser = function(user) {
                    $scope.formData = angular.copy(user);
                    $scope.editingId = user.id;
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                };

                // Delete user
                $scope.deleteUser = function(id) {
                    if (confirm('Are you sure you want to delete this user?')) {
                        $http.delete(API_URL + '/' + id + '/')
                            .then(function(response) {
                                $scope.successMessage = 'User deleted successfully!';
                                $scope.loadUsers();
                                setTimeout(() => $scope.successMessage = '', 3000);
                            })
                            .catch(function(error) {
                                $scope.errorMessage = 'Error deleting user: ' + (error.data?.message || error.statusText);
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
                $scope.loadUsers();
                $scope.resetForm();
            }]);
            //             })
            //             .catch(function(error) {
            //                 console.error('Error adding user:', error);
            //                 alert('Failed to add user');
            //             });
            //     };

            //     // Edit user
            //     $scope.editUser = function(user) {
            //         user.original = angular.copy(user);
            //         user.editing = true;
            //     };

            //     // Save user
            //     $scope.saveUser = function(user) {
            //         if (!user.name || !user.email) {
            //             alert('Name and Email are required');
            //             return;
            //         }
            //         var updateData = {
            //             name: user.name,
            //             email: user.email,
            //             phone: user.phone,
            //             address: user.address
            //         };
            //         $http.put(API_URL + user.id + '/', updateData)
            //             .then(function(response) {
            //                 user.editing = false;
            //                 delete user.original;
            //                 alert('User updated successfully');
            //             })
            //             .catch(function(error) {
            //                 console.error('Error saving user:', error);
            //                 alert('Failed to update user');
            //             });
            //     };

            //     // Cancel edit
            //     $scope.cancelEdit = function(user) {
            //         angular.copy(user.original, user);
            //         user.editing = false;
            //         delete user.original;
            //     };

            //     // Delete user
            //     $scope.deleteUser = function(user) {
            //         if (confirm('Are you sure you want to delete this user?')) {
            //             $http.delete(API_URL + user.id + '/')
            //                 .then(function() {
            //                     var index = $scope.users.indexOf(user);
            //                     $scope.users.splice(index, 1);
            //                     alert('User deleted successfully');
            //                 })
            //                 .catch(function(error) {
            //                     console.error('Error deleting user:', error);
            //                     alert('Failed to delete user');
            //                 });
            //         }
            //     };

            //     // Initial load
            //     $scope.loadUsers();
            // });
