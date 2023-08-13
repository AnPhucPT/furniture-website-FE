function CartService(app) {
    app.factory('CartService', function ($rootScope, $timeout) {
        const getCartFromLS = () => {
            return JSON.parse(localStorage.getItem('cart')) || [];
        };

        const setCartToLS = (cart) => {
            localStorage.setItem('cart', JSON.stringify(cart));
        };

        const addToCart = (product, quantity = 1) => {
            $rootScope.loading = true;
            let cartItems = getCartFromLS();
            let index = cartItems.findIndex((item) => item.id === product.id);
            if (index === -1) {
                cartItems = [...cartItems, { ...product, quantity }];
            } else {
                cartItems[index].quantity = cartItems[index].quantity + quantity;
            }
            setCartToLS(cartItems);
            $timeout(function () {
                $rootScope.loading = false;
            }, 500);
            $timeout(function () {
                showSuccessToast(`Add Product 
                <span class="dark:text-red-300 text-green-500">${product.name}</span>
                to <a class="underline text-blue-600 dark:text-blue-400" href="#!cart">Cart</a>
                Successful`);
            }, 700);
        };

        return {
            getCartFromLS,
            setCartToLS,
            addToCart
        };
    });
}

export default CartService;
