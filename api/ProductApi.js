import { getApiUrl } from '../utils/Utils.js';
function ProductApi(app) {
    app.factory('ProductApi', function ($http) {
        return {
            filter(params) {
                return $http.get(getApiUrl('/public/products/filter'), {
                    params
                });
            },

            getMax() {
                return $http.get(getApiUrl('/public/products/max-price'));
            },

            createProduct(formData) {
                return $http.post(getApiUrl('/admin/products'), formData, {
                    headers: {
                        'Content-Type': undefined,
                        Authorization: 'Bearer ' + localStorage.getItem('access_token')
                    }
                });
            },
            updateProduct(formData) {
                return $http.put(getApiUrl('/admin/products'), formData, {
                    headers: {
                        'Content-Type': undefined,
                        Authorization: 'Bearer ' + localStorage.getItem('access_token')
                    }
                });
            },
            deleteProduct(id) {
                return $http.delete(getApiUrl('/admin/products/' + id), {
                    headers: {
                        Authorization: 'Bearer ' + localStorage.getItem('access_token')
                    }
                });
            }
        };
    });
}
export default ProductApi;
