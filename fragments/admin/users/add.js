(function() {
    'use strict';
    var $form = $('#add_user_form');
    var app = window.app;
    var $password = $('#password');
    var $passwordConfirm = $('#password_confirmation');
    var $isApiUser = $('#is_api_user');
    var $isAdminUser = $('#is_admin_user');

    function checkPasswordEquality(input1, input2) {
        input1 = input1 instanceof jQuery ? input1.get(0) : input1;
        input2 = input2 instanceof jQuery ? input2.get(0) : input2;

        if (input1.value !== input2.value) {
            input2.setCustomValidity('Passwords must match!');
        } else {
            input2.setCustomValidity('');
        }
    }

    $password.on('input', function(){
        checkPasswordEquality($password, $passwordConfirm);
    });

    $passwordConfirm.on('input', function(){
        checkPasswordEquality($password, $passwordConfirm);
    });

    $form.on('submit', function(e) {
        e.preventDefault();
        var data = $(this).serializeObject();
        if (!data.password.trim().length) {
            data.password = data.password.trim();
        }
        data.is_api_user = $isApiUser.prop('checked');
        data.is_admin_user = $isAdminUser.prop('checked');

        app.apiPost('admin', 'user_add', data, function(resp){
            if (resp.success) {
                app.loadPage('/admin/users/add');
                $(window.app).one('page.loaded', () => {
                    app.showMessage('success', 'The user was added!');
                    window.scrollTo(0, 0);
                });
            }
        });
    });
}());
