(function (app) {
    'use strict';

    var $form = $('#add_board_form');

    $form.on('submit', submitForm);

    function submitForm(e) {
        e.preventDefault();
        var $name = $form.find('#board_name');
        var $users = $form.find('#board_users');
        var $stages = $form.find('#board_stages');
        var data = {
            name: $name.val(),
            users: $users.val(),
            stages: $stages.val()
        };

        app.saveBoard(data, function(resp){
            if (resp.success) {
                app.showMessage('success', 'Board saved!');
                $stages.val([]);
                $users.val([]);
                $name.val('');
                window.scrollTo(0, 0);
            }
            else {
                app.showMessage('danger', 'Something went wrong :(');
            }
        });
    }

}(window.app));
