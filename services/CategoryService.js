function CategoryService(app) {
    app.factory('CategoryService', function (CategoryApi) {
        return {
            async filter(params) {
                return CategoryApi.filter(params);
            },

            async getExistCategory() {
                return CategoryApi.getExistCategory();
            },

            async getAll() {
                return CategoryApi.getAll();
            },

            async getCategoryProductCount() {
                return CategoryApi.getCategoryProductCount();
            },

            async createCategory(category) {
                return CategoryApi.createCategory(category);
            },

            async updateCategory(category) {
                return CategoryApi.updateCategory(category);
            },

            async deleteCategory(id) {
                return CategoryApi.deleteCategory(id);
            }
        };
    });
}

export default CategoryService;
