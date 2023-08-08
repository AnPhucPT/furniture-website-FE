function AuthController(app) {
    app.controller('AuthController', function ($scope, $http, $location, $rootScope, AuthService) {
        $scope.activeTab = 1
        $scope.changeTab = (tab) => {
            $scope.activeTab = tab
        }
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
            const res = await AuthService.login($scope.formLogin);
            console.log(res);
            if (res?.data?.success) {
                const { accessToken, accountDto } = res.data.data
                localStorage.setItem('access_token', accessToken);
                localStorage.setItem('user', JSON.stringify(accountDto));
                $rootScope.isAdmin = accountDto.role === "ROLE_ADMIN"
                $rootScope.$apply()
                $rootScope.user = accountDto;
                window.open('#!/', '_self');
            } else {
                alert(res?.data?.message || "Server interval")
            }
        };

        $scope.register = async () => {
            const res = await AuthService.register($scope.formRegister);
            console.log(res);
            if (res?.data?.success) {
                $scope.activeTab = 1;
                $scope.$apply()
            }
        };
    });
}

export default AuthController;
