function AuthController(app) {
    app.controller('AuthController', function ($scope, $http, $rootScope, AuthService) {
        $scope.formLogin = {
            email: '',
            password: '',
        };
        $scope.formRegister = {
            email: '',
            password: '',
            confirmPassword: '',
        };

        $scope.login = async () => {
            const { accessToken, accountDto } = await AuthService.login($scope.formLogin);
            localStorage.setItem('access_token', accessToken);
            localStorage.setItem('user', JSON.stringify(accountDto));
            $rootScope.isAdmin = accountDto.role === "ROLE_ADMIN"
            console.log($rootScope.isAdmin);
            $rootScope.$apply()
            $rootScope.user = accountDto;
            window.open('#!/', '_self');
        };

        $scope.register = async () => {
            await AuthService.register($scope.formRegister);
            window.open('#!/login', '_self');
        };
    });
}

export default AuthController;
