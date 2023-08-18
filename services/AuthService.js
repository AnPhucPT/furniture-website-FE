function AuthService(app) {
    app.factory('AuthService', function (AuthApi) {
        const login = async (formLogin) => {
            try {
                return AuthApi.login(formLogin);
            } catch (error) {
                Promise.reject(error);
            }
        };

        const register = async (formRegister) => {
            try {
                return AuthApi.register(formRegister);
            } catch (error) {
                Promise.reject(error);
            }
        };

        const registerWithAvatar = async (formData) => {
            try {
                return AuthApi.registerWithAvatar(formData);
            } catch (error) {
                Promise.reject(error);
            }
        };

        return {
            login,
            register,
            registerWithAvatar
        };
    });
}

export default AuthService;
