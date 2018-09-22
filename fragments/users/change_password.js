(function(smack, $) {
    'use strict';
    var $form = $('#change_password_form');
    var $password = $('#password');
    var $passwordConfirm = $('#password_confirm');

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

        smack.apiPost('users', 'change_password', data, function(resp){
            if (resp.success) {
                smack.loadPage('/users/change_password', null, function(){
                    smack.showMessage('success', 'Password changed!');
                    window.scrollTo(0, 0);
                });
            }
        });
    });
}(window.smack, window.jQuery));
