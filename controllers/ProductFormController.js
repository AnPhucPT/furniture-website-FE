import { getApiUrl, convertToBlob } from "../utils/Utils.js";

function ProductFormController(app) {
    app.controller('ProductFormController', function ($scope, $http, $rootScope) {
        $scope.image = "https://media.istockphoto.com/id/1222357475/vector/image-preview-icon-picture-placeholder-for-website-or-ui-ux-design-vector-illustration.jpg?s=612x612&w=0&k=20&c=KuCo-dRBYV7nz2gbk4J9w1WtTAgpTdznHu55W9FjimE=";
        $scope.product = {
            name: 'Sanpham 1',
            stock: 120,
            price: 100000,
            category: {
                id: 1
            }
        };
        $scope.imageFile = null;

        $scope.submitProduct = function () {
            const formData = new FormData();
            formData.append('product', convertToBlob($scope.product));
            formData.append('image', $scope.imageFile);
            $http.post(getApiUrl('/public/products'), formData, {
                headers: {
                    "Content-Type": undefined
                }
            })
                .then(function (response) {
                    console.log('Product created successfully:', response.data);
                    $scope.product = {
                        name: '',
                        stock: 0,
                        price: 1,
                        category: {
                            name: ''
                        }
                    };
                    $scope.imageFile = null;
                    $scope.imagePreviewUrl = null;
                    $scope.productForm.$setPristine();
                    $scope.productForm.$setUntouched();
                })
                .catch(function (error) {
                    // Handle the error response if needed
                    console.error('Error creating product:', error);
                });
        };
        $scope.handleChangeImage = (e) => {
            if (e?.target.files.length) {
                const src = URL.createObjectURL(e.target.files[0]);
                $scope.imageFile = e.target.files[0]
                document.getElementById('previewImage').src = src;
                $scope.image = src;
            }
        };
    });
}
export default ProductFormController;
