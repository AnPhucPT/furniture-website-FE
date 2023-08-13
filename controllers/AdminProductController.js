function AdminProductController(app) {
    app.controller('AdminProductController', function ($scope, $timeout, $rootScope, ProductService, CategoryService) {
        $scope.image =
            'https://media.istockphoto.com/id/1222357475/vector/image-preview-icon-picture-placeholder-for-website-or-ui-ux-design-vector-illustration.jpg?s=612x612&w=0&k=20&c=KuCo-dRBYV7nz2gbk4J9w1WtTAgpTdznHu55W9FjimE=';
        $scope.products = [];
        $scope.current = null;
        $scope.params = { page: 0, pageSize: 3, sortField: 'id', orderBy: 'desc' };
        $scope.flagUpdateImg = 0;

        $scope.$watch('params', function () {
            $scope.getData();
        });

        $scope.getData = async () => {
            try {
                const res = await ProductService.filter($scope.params);
                const { totalPage, totalItems, datas } = res.data.data;
                $scope.products = [...datas];
                $scope.totalPage = totalPage;
                $scope.totalItems = totalItems;
                $scope.getTotalPage = () => {
                    return Array.from({ length: totalPage }, (_, index) => index + 1);
                };
            } catch (error) {
                Promise.reject(error);
            }
        };

        $scope.getCategories = async () => {
            try {
                const res = await CategoryService.getAll();
                $scope.categories = res.data.data;
            } catch (error) {
                Promise.reject(error);
            }
        };

        $scope.getCategories();

        $scope.$watch('search', function () {
            if ($scope.search) {
                $scope.params = { ...$scope.params, page: 0, keyword: $scope.search };
            } else {
                delete $scope.params.keyword;
                $scope.params = { ...$scope.params };
            }
        });

        $scope.removeSearch = () => {
            $scope.search = '';
        };

        $scope.nextPage = () => {
            if ($scope.params.page < $scope.totalPage - 1) {
                $scope.params = { ...$scope.params, page: ++$scope.params.page };
            }
        };

        $scope.prevPage = () => {
            if ($scope.params.page > 0) {
                $scope.params = { ...$scope.params, page: --$scope.params.page };
            }
        };

        $scope.changePage = (index) => {
            $scope.params = { ...$scope.params, page: --index };
        };

        $scope.sortFiled = (sortFiled) => {
            if (sortFiled == $scope.params.sortFiled) {
                if ($scope.params.orderBy === 'desc') {
                    $scope.params = { ...$scope.params, orderBy: 'asc' };
                } else {
                    $scope.params = { ...$scope.params, orderBy: 'desc' };
                }
            } else {
                $scope.params = { ...$scope.params, sortFiled: sortFiled };
            }
        };

        $scope.modal = $rootScope.initModal('#deleteModal');

        $scope.showModal = () => {
            $scope.modal.show();
        };

        $scope.hideModal = () => {
            $scope.modal.hide();
        };

        $scope.setRemoveProduct = (product) => {
            $scope.showModal();
            $scope.current = product;
        };

        $scope.removeCurrentCategory = async () => {
            $scope.modal.hide();
            try {
                const res = await ProductService.deleteCategory($scope.current);
                if (res?.data?.success) {
                    $scope.getData();
                    $timeout(function () {
                        showSuccessToast(`Delete Product 
                        <span class="dark:text-red-300 text-red-500">${$scope.current.name}</span>
                        Successful`);
                    }, 700);
                } else {
                    alert(res?.data?.message || 'Server interval');
                }
            } catch (error) {
                Promise.reject(error);
            }
        };

        $scope.modalProduct = $rootScope.initModal('#product-modal');

        $scope.showModalProduct = () => {
            $scope.modalProduct.show();
        };

        $scope.hideModalProduct = () => {
            $scope.modalProduct.hide();
        };

        $scope.showModalForEdit = (product) => {
            $scope.flagUpdateImg = 0;
            $scope.current = product;
            $scope.image = product.image;
            $scope.product = { ...product };
            $scope.showModalProduct();
        };

        $scope.showModalForCreate = () => {
            document.getElementById('image').value = null;
            $scope.current = null;
            $scope.reset();
            $scope.showModalProduct();
        };

        $scope.product = {
            name: '',
            stock: 0,
            price: 0,
            category: null
        };

        $scope.reset = () => {
            $scope.product = {
                name: 'Product Test',
                stock: 10,
                price: 100,
                category: {
                    id: null
                }
            };
            $scope.image =
                'https://media.istockphoto.com/id/1222357475/vector/image-preview-icon-picture-placeholder-for-website-or-ui-ux-design-vector-illustration.jpg?s=612x612&w=0&k=20&c=KuCo-dRBYV7nz2gbk4J9w1WtTAgpTdznHu55W9FjimE=';
        };

        $scope.submit = async () => {
            if ($scope.product.name && $scope.product.category && $scope.product.price && $scope.product.stock) {
                if ($scope.current) {
                    if ($scope.flagUpdateImg) {
                        //Update with Image
                        try {
                            $rootScope.loading = true;
                            const res = await ProductService.updateProduct(
                                $scope.product,
                                $scope.current.id,
                                document.getElementById('image').files[0]
                            );
                            $timeout(function () {
                                showSuccessToast(
                                    `Update Product
                                    <span class="dark:text-blue-300 text-blue-500">${$scope.current.name}</span>
                                    Successful`
                                );
                            }, 700);
                        } catch (error) {
                            alert(error.data.message);
                            Promise.reject(error);
                        } finally {
                            $timeout(function () {
                                $rootScope.loading = false;
                            }, 300);
                        }
                    } else {
                        // Update without Image
                        try {
                            $rootScope.loading = true;
                            const res = await ProductService.updateProduct($scope.product, $scope.current.id);
                            $timeout(function () {
                                showSuccessToast(
                                    `Update Product
                                    <span class="dark:text-blue-300 text-blue-500">${$scope.current.name}</span>
                                    Successful`
                                );
                            }, 700);
                        } catch (error) {
                            alert(error.data.message);
                            Promise.reject(error);
                        } finally {
                            $timeout(function () {
                                $rootScope.loading = false;
                            }, 300);
                        }
                    }
                } else if (document.getElementById('image').files[0]) {
                    // Create Product
                    try {
                        $rootScope.loading = true;
                        const res = await ProductService.createProduct(
                            $scope.product,
                            document.getElementById('image').files[0]
                        );
                        $scope.getData();
                        $timeout(function () {
                            showSuccessToast(`Create Product
                            <span class="dark:text-green-300 text-green-500">${$scope.product.name}</span>
                            Successful`);
                        }, 700);
                    } catch (error) {
                        alert(error.data.message);
                        Promise.reject(error);
                    } finally {
                        $timeout(function () {
                            $rootScope.loading = false;
                        }, 300);
                    }
                }
                $scope.hideModalProduct();
                $scope.getData();
            } else {
                alert('Please enter full information');
            }
        };

        $scope.toggleFlagUpdateImg = () => {
            $scope.flagUpdateImg = 1;
        };

        $scope.handleUploadImage = (e) => {
            if (e.target.files.length) {
                $scope.image = URL.createObjectURL(e.target.files[0]);
                $scope.$apply();
            }
        };
    });
}
export default AdminProductController;
