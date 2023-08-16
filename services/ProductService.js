import { convertToBlob } from '../utils/Utils.js';
function ProductService(app) {
    app.factory('ProductService', function ($rootScope, $timeout, ProductApi) {
        return {
            async filter(params) {
                $rootScope.loading = true;
                $timeout(function () {
                    $rootScope.loading = false;
                }, 500);
                return ProductApi.filter(params);
            },

            async createProduct(product, imageFile) {
                const formData = new FormData();
                formData.append('product', convertToBlob(product));
                formData.append('image', imageFile);

                return ProductApi.createProduct(formData);
            },

            async updateProduct(product, id, imageFile) {
                const formData = new FormData();
                formData.append('product', convertToBlob({ ...product, id: id }));
                if (imageFile) {
                    formData.append('image', imageFile);
                }

                return ProductApi.updateProduct(formData);
            },

            async deleteProduct(product) {
                $rootScope.loading = true;
                $timeout(function () {
                    $rootScope.loading = false;
                }, 500);
                return ProductApi.deleteProduct(product.id);
            },

            async getMax() {
                return ProductApi.getMax();
            }
        };
    });
}

export default ProductService;
