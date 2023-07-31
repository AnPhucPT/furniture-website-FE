function AuthController(app) {
    app.controller('AuthController', function ($scope, $http, $rootScope) {
        $scope.formLogin = {
            email: '',
            password: '',
        };
        $scope.formRegister = {
            email: '',
            password: '',
            confirmPassword: '',
        };
        $scope.login = $scope.login = () => {
            $http
                .post('http://localhost:8080/api/public/accounts', {
                    ...$scope.form,
                })
                .then((res) => {
                    const data = res.data;
                    if (data.success) {
                        localStorage.setItem('access_token', data.message);
                        localStorage.setItem('user', JSON.stringify(data.data));
                        $rootScope.user = data.data;
                        window.open('#!/', '_self');
                    }
                })
                .catch((err) => {
                    Promise.reject(err);
                });
        };
    });
}

export default AuthController;
