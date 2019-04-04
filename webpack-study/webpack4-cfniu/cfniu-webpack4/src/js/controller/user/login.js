require('../../../scss/user/login.scss');
import utilService from '../../service/utilService';
import userService from '../../service/userService';

const $loginForm = $('.JS-login-form');

$('.JS-login-btn').click(function () {
    let user = {
        username: utilService.getValue($loginForm, 'username'),
        password: utilService.getValue($loginForm, 'password'),
    }
    let result = utilService.validate(['username', 'password'], user);
    if (result.status) {
        userService.login(user).then(data => {
            utilService.toHref('/');
        }, err => {
            utilService.setError($loginForm, err);
        })
    } else {
        utilService.setError($loginForm, result);
    }
});