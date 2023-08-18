function ShopController(app) {
    app.controller('ShopController', function ($scope, $rootScope, CartService, ProductService, CategoryService) {
        $scope.tagParams = { Category: 'All', SortBy: 'Default' };
        $scope.searchParams = { page: 0, pageSize: 8, sortField: 'id', orderBy: 'desc' };
        $scope.min = 0;
        $scope.max;
        $scope.maxValue;
        $scope.TotalProduct;
        $scope.RightValue = '0%';
        $scope.LeftValue = '0%';
        const priceGap = 20;
        $scope.products = [];

        $scope.$watch('searchParams', function () {
            $scope.getData();
        });

        $scope.getData = async () => {
            $rootScope.loading = true;
            try {
                const res = await ProductService.filter($scope.searchParams);
                const { totalPage, totalItems, datas } = res.data.data;
                $scope.products = [...datas];
                $scope.totalPage = totalPage;
                $scope.totalItems = totalItems;
            } catch (error) {
                Promise.reject(error);
            } finally {
                $scope.getTotalPage = () => {
                    return Array.from({ length: $scope.totalPage }, (_, index) => index + 1);
                };
                $rootScope.loading = false;
            }
        };

        $rootScope.getCategoryExist = async () => {
            try {
                const res = await CategoryService.getCategoryProductCount();
                $scope.categories = res.data.data;
                $scope.TotalProduct = res.data.data.reduce((total, item) => total + item[2], 0);
            } catch (error) {
                Promise.reject(error);
            }
        };
        $rootScope.getCategoryExist();

        $scope.getMinMax = async () => {
            try {
                const res = await ProductService.getMax();
                $scope.max = res.data.data;
                $scope.maxValue = res.data.data + priceGap;
                $scope.min += priceGap;
                $scope.tagParams = {
                    ...$scope.tagParams,
                    From: 0,
                    To: $scope.maxValue
                };
            } catch (error) {
                Promise.reject(error);
            }
        };
        $scope.getMinMax();

        $scope.$watch('max', function () {
            if ($scope.max - $scope.min < priceGap) {
                $scope.max = $scope.min + priceGap;
            }
            $scope.RightValue = 100 - ($scope.max / $scope.maxValue) * 100 + '%';
        });

        $scope.$watch('min', function () {
            if ($scope.max - $scope.min < priceGap) {
                $scope.min = $scope.max - priceGap;
            }
            $scope.LeftValue = ($scope.min / $scope.maxValue) * 100 + '%';
        });

        $scope.getProductByPriceRange = () => {
            $scope.tagParams = { ...$scope.tagParams, From: $scope.min, To: $scope.max };
            $scope.searchParams = { ...$scope.searchParams, minPrice: $scope.min, maxPrice: $scope.max };
        };

        $scope.resetProduct = () => {
            $scope.tagParams = { Category: 'All', From: 0, To: $scope.max };
            $scope.searchParams = { page: 0, pageSize: 8, sortFiled: 'id', orderBy: 'desc' };
            $scope.search = '';
        };

        $scope.deleteTag = (key) => {
            switch (key) {
                case 'Search':
                    $scope.search = '';
                    break;
                case 'Category':
                    $scope.tagParams['Category'] = 'All';
                    $scope.searchParams = { ..._.omit($scope.searchParams, 'categoryId') };
                    break;
                case 'To':
                    $scope.max = $scope.maxValue;
                    $scope.getProductByPriceRange();
                    break;
                case 'From':
                    $scope.min = 0;
                    $scope.getProductByPriceRange();
                    break;
                case 'SortBy':
                    $scope.tagParams['SortBy'] = 'Default';
                    $scope.searchParams = { ...$scope.searchParams, orderBy: 'desc', sortField: 'id' };
                    break;
                default:
                    console.log('key not exist');
                    break;
            }
        };

        $scope.$watch('search', function () {
            if ($scope.search) {
                $scope.searchParams = { ...$scope.searchParams, page: 0, keyword: $scope.search };
                $scope.tagParams = { ...$scope.tagParams, Search: '" ' + $scope.search + ' "' };
            } else {
                delete $scope.searchParams.keyword;
                delete $scope.tagParams.Search;
                $scope.searchParams = { ...$scope.searchParams };
                $scope.tagParams = { ...$scope.tagParams };
            }
        });

        $scope.removeSearch = () => {
            $scope.search = '';
        };

        $scope.nextPage = () => {
            if ($scope.searchParams.page < $scope.totalPage - 1) {
                $scope.searchParams = { ...$scope.searchParams, page: ++$scope.searchParams.page };
            }
        };

        $scope.prevPage = () => {
            if ($scope.searchParams.page > 0) {
                $scope.searchParams = { ...$scope.searchParams, page: --$scope.searchParams.page };
            }
        };

        $scope.changePage = (index) => {
            $scope.searchParams = { ...$scope.searchParams, page: --index };
        };

        $scope.getProductByCategory_Id = (id, name) => {
            if ($scope.search) {
                $scope.searchParams = { ...$scope.searchParams, keyword: $scope.search, categoryId: id };
                $scope.tagParams = { ...$scope.tagParams, Search: '" ' + $scope.search + ' "', Category: name };
            } else {
                $scope.searchParams = { ...$scope.searchParams, categoryId: id };
                $scope.tagParams = { ...$scope.tagParams, Category: name };
            }
        };

        $scope.sortProduct = (field, orderBy, name) => {
            $scope.searchParams = { ...$scope.searchParams, orderBy: orderBy, sortField: field };
            if (name) {
                $scope.tagParams = { ...$scope.tagParams, SortBy: name };
            }
        };

        $scope.addToCart = (product) => {
            CartService.addToCart(product);
            $rootScope.carts = CartService.getCartFromLS();
        };
    });
}

export default ShopController;
