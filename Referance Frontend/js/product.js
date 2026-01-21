angular.module('productApp', [])
    .controller('ProductController', ['$scope', '$http', function($scope, $http) {
        
        const API_URL = 'http://localhost:3000/api/products';
        
        $scope.products = [];
        $scope.formData = {};
        $scope.editingId = null;
        $scope.successMessage = '';
        $scope.errorMessage = '';

        // Load all products
        $scope.loadProducts = function() {
            $http.get(API_URL)
                .then(function(response) {
                    $scope.products = response.data;
                })
                .catch(function(error) {
                    $scope.errorMessage = 'Error loading products: ' + (error.data?.message || error.statusText);
                    console.error('Error loading products:', error);
                });
        };

        // Save product (Create or Update)
        $scope.saveProduct = function() {
            if (!$scope.formData.name || !$scope.formData.sku || !$scope.formData.price) {
                $scope.errorMessage = 'Please fill in all required fields';
                return;
            }

            if ($scope.editingId) {
                // Update existing product
                $http.put(API_URL + '/' + $scope.editingId, $scope.formData)
                    .then(function(response) {
                        $scope.successMessage = 'Product updated successfully!';
                        $scope.loadProducts();
                        $scope.resetForm();
                        setTimeout(() => $scope.successMessage = '', 3000);
                    })
                    .catch(function(error) {
                        $scope.errorMessage = 'Error updating product: ' + (error.data?.message || error.statusText);
                    });
            } else {
                // Create new product
                $http.post(API_URL, $scope.formData)
                    .then(function(response) {
                        $scope.successMessage = 'Product created successfully!';
                        $scope.loadProducts();
                        $scope.resetForm();
                        setTimeout(() => $scope.successMessage = '', 3000);
                    })
                    .catch(function(error) {
                        $scope.errorMessage = 'Error creating product: ' + (error.data?.message || error.statusText);
                    });
            }
        };

        // Edit product
        $scope.editProduct = function(product) {
            $scope.formData = angular.copy(product);
            $scope.editingId = product.id;
            window.scrollTo({ top: 0, behavior: 'smooth' });
        };

        // Delete product
        $scope.deleteProduct = function(id) {
            if (confirm('Are you sure you want to delete this product?')) {
                $http.delete(API_URL + '/' + id)
                    .then(function(response) {
                        $scope.successMessage = 'Product deleted successfully!';
                        $scope.loadProducts();
                        setTimeout(() => $scope.successMessage = '', 3000);
                    })
                    .catch(function(error) {
                        $scope.errorMessage = 'Error deleting product: ' + (error.data?.message || error.statusText);
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
        $scope.loadProducts();
        $scope.resetForm();
    }]);
