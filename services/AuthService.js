function AuthService(app) {
    app.factory('AuthService', function ($rootScope, $timeout, AuthApi) {
        const login = async (formLogin) => {
            $rootScope.loading = true;
            try {
                const res = await AuthApi.login(formLogin);
                const { accessToken, accountDto } = res.data.data;

                $timeout(function () {
                    $rootScope.loading = false;
                }, 500);

                return {
                    accessToken,
                    accountDto,
                };
            } catch (error) {
                Promise.reject(error);
                $rootScope.loading = false;
            }
        };

        const register = async (formRegister) => {
            $rootScope.loading = true;
            try {
                const res = await AuthApi.register(formRegister);
                console.log(res.data);

                $timeout(function () {
                    $rootScope.loading = false;
                }, 500);
            } catch (error) {
                Promise.reject(error);
                $rootScope.loading = false;
            }
        };

        return {
            login,
            register,
        };
    });
}

export default AuthService;
