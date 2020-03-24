const LoginController = require('../controller/LoginController');

module.exports = (router) => {
    router.route('/login').post(LoginController.login);
    router.route('/register').post(LoginController.register);
    router.route('/forgot/password').post(LoginController.forgotPassword);
    router.route('/reset').post(LoginController.reset);
    router.route('/change/password').post(LoginController.changePassword);
    router.route('/validate/reset/password/:token').get(LoginController.validateResetPassword);
}