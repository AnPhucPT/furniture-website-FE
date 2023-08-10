function AdminCategoryController(app) {
    app.controller('AdminCategoryController', function ($scope, $timeout, $rootScope, CategoryService) {
        $scope.categories = [];
        $scope.current = null;
        $scope.params = { page: 0, pageSize: 3, sortFiled: 'id', orderBy: 'desc' };

        $scope.$watch('params', function () {
            $scope.getData();
        });

        $scope.getData = async () => {
            try {
                const res = await CategoryService.filter($scope.params);
                const { totalPage, totalItems, datas } = res.data.data;
                $scope.categories = [...datas];
                $scope.totalPage = totalPage;
                $scope.totalItems = totalItems;
                $scope.getTotalPage = () => {
                    return Array.from({ length: totalPage }, (_, index) => index + 1);
                };
            } catch (error) {
                Promise.reject(error);
            }
        };

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

        $scope.setRemoveCategory = (category) => {
            $scope.showModal();
            $scope.current = category;
        };

        $scope.removeCurrentCategory = async () => {
            $scope.modal.hide();
            try {
                const res = await CategoryService.deleteCategory($scope.current.id);
                console.log(res);
                if (res?.data?.success) {
                    $scope.getData();
                    $timeout(function () {
                        showSuccessToast(res?.data?.message || 'Delete Action have been done !');
                    }, 700);
                } else {
                    alert(res?.data?.message || 'Server interval');
                }
            } catch (error) {
                Promise.reject(error);
            }
        };

        $scope.category = {
            name: ''
        };
        $scope.reset = () => {
            $scope.category = {
                name: ''
            };
        };

        $scope.submitProduct = function () {
            if ($scope.current) {
                // formData.append('product', convertToBlob({ ...$scope.product, id: $scope.current.id }));
                // $scope.getData();
                // $scope.reset();
            } else {
                // formData.append('product', convertToBlob($scope.product));
                // $scope.getData();
                // $scope.reset();
            }
        };

        $scope.edit = (category) => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth' // This triggers the smooth scrolling
            });
            $scope.current = category;
            $scope.category = {
                ...category
            };
        };

        $scope.delete = (category) => {};
    });
}

export default AdminCategoryController;
