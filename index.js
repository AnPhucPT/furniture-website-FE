import controller from './controllers/Controller.js';
import service from './services/Service.js';
import api from './api/Api.js';

const app = angular.module('app', ['ngRoute']);

for (const key in api) {
    api[key](app);
}
// setup service
for (const key in service) {
    service[key](app);
}
// set up controller
for (const key in controller) {
    controller[key](app);
}

app.run(function ($rootScope, $http) {
    //before init
    $http.get('').then((res) => {
        $rootScope.categories = res.data;
    });

    $rootScope.initModal = (selector, options) => {
        const $targetEl = document.querySelector(selector);
        const modal = new Modal($targetEl, {
            ...defaultOptions,
            ...options,
        });
        return modal;
    };

    $rootScope.user = JSON.parse(localStorage.getItem('user')) || null;
});

app.config(function ($routeProvider) {
    $routeProvider
        .when('/', {
            templateUrl: '/pages/home.html',
            controller: 'HomeController',
        })
        .when('/shop', {
            templateUrl: '/pages/shop.html',
            controller: 'ShopController',
        })
        .when('/login', {
            templateUrl: '/pages/login.html',
            controller: 'LoginController',
        })
        .when('/cart', {
            templateUrl: '/pages/cart.html',
            controller: 'CartController',
        })
        .when('/order', {
            templateUrl: '/pages/order.html',
            controller: 'OrderController',
        })
        .otherwise({
            templateUrl: 'views/notFound.html',
        });
});

const defaultOptions = {
    placement: 'bottom-right',
    backdrop: 'dynamic',
    backdropClasses: 'bg-gray-900 bg-opacity-50 dark:bg-opacity-80 fixed inset-0 z-40',
    closable: true,
};
export default app;
