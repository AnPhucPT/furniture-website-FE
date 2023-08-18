import { convertToBlob } from '../utils/Utils.js';
function ProductService(app) {
    app.factory('ProductService', function (ProductApi) {
        return {
            async filter(params) {
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
                return ProductApi.deleteProduct(product.id);
            },

            async getMax() {
                return ProductApi.getMax();
            }
        };
    });
}

export default ProductService;
