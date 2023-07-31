function AuthService(app) {
    app.factory('CartService', function ($rootScope, $timeout, AuthApi) {
        const getAuthResponse = async (formLogin) => {
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

        return {
            getAuthResponse,
        };
    });
}

export default AuthService;
