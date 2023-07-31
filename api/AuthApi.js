import { getApiUrl } from '../utils/Utils.js';
function AuthApi(app) {
    app.factory('AuthApi', function ($http) {
        return {
            login(formLogin) {
                return $http.post(getApiUrl('/auth/login'), formLogin);
            },
            register(formRegister) {
                return $http.post(getApiUrl('/auth/register'), formRegister);
            },
            registerWithAvatar(formRegister) {
                return $http.post(getApiUrl('/auth/register'), formRegister);
            },
        };
    });
}

export default AuthApi;
