function cartController(app) {
    app.controller('CartController', function ($scope, $http, $rootScope, $timeout, CartService) {
        $scope.removeProduct = null;
        $scope.products = CartService.getCartFromLS();
        $scope.OrderAddress = 'HCM city';

        $rootScope.removeProductItem = () => {
            if ($scope.removeProduct) {
                $scope.products = $scope.products.filter((item) => item.id !== $scope.removeProduct.id);
            }
            CartService.setCartToLS($scope.products);
            $scope.hideModal();
            $timeout(function () {
                showSuccessToast(`Remove Product 
                <span class="dark:text-red-300 text-red-500">${$scope.removeProduct.name}</span>
                Successful`);
            }, 700);
        };

        $scope.modal = $rootScope.initModal('#deleteModal');

        $scope.showModal = () => {
            $scope.modal.show();
        };

        $scope.hideModal = () => {
            $scope.modal.hide();
        };

        $rootScope.setRemoveProduct = (product) => {
            $scope.showModal();
            $scope.removeProduct = product;
        };

        $scope.submit = (form) => {
            if (form.$valid) {
                $rootScope.loading = true;
                const orderItemDtos = $scope.products.map((product) => ({
                    quantity: product.quantity,
                    product
                }));
                const formData = { orderItemDtos, address: $scope.OrderAddress };
                $http
                    .post('http://localhost:8080/api/order', formData, {
                        headers: {
                            Authorization: 'Bearer ' + localStorage.getItem('access_token') || ''
                        }
                    })
                    .then((res) => {
                        const data = res.data;
                        if (data.success) {
                            $scope.products = [];
                            CartService.setCartToLS([]);
                        }
                        if (res?.data?.success) {
                            $scope.products = [];
                            CartService.setCartToLS([]);
                            $timeout(function () {
                                showSuccessToast(`Order Successful`);
                            }, 700);
                        } else {
                            alert(res?.data?.message || 'Server interval');
                        }
                    })
                    .catch((err) => {
                        Promise.reject(err);
                    })
                    .finally(() =>
                        $timeout(function () {
                            $rootScope.loading = false;
                        }, 300)
                    );
            }
        };

        $scope.getTotalPrice = () => {
            return $scope.products.reduce((acc, curr) => acc + curr.quantity * curr.price, 0);
        };

        $scope.getTotalQuantity = () => {
            return $scope.products.reduce((acc, curr) => acc + curr.quantity, 0);
        };

        $scope.getShippingFee = () => {
            if ($scope.getTotalPrice() > 100 || $scope.getTotalPrice() == 0) {
                return 0;
            } else {
                return 34;
            }
        };

        $scope.getTax = () => {
            return Math.floor($scope.getTotalPrice() * 0.02);
        };

        $scope.getTotalCartPrice = () => {
            return $scope.getTotalPrice() + $scope.getShippingFee() + $scope.getTax();
        };

        $scope.increaseQuantity = (product) => {
            product = { ...product, quantity: product.quantity++ };
            CartService.setCartToLS($scope.products);
        };

        $scope.decreaseQuantity = (product) => {
            if (product.quantity === 1) {
                $scope.setRemoveProduct(product);
            } else {
                product = { ...product, quantity: product.quantity-- };
            }
            CartService.setCartToLS($scope.products);
        };
    });
}

export default cartController;
