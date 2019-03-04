(function (app) {
    'use strict';
    var $userSelect = $('#board_users');
    var $stageSelect = $('#board_stages');
    var boardData = null;

    $('#board').on('change', function(e) {
        var $this = $(this);
        var hasValue = $this.val();
        $userSelect.find('option').remove();
        $userSelect.val(null).trigger('change');
        $stageSelect.find('option').remove();
        $stageSelect.val(null).trigger('change');

        $this.closest('form').find(':submit').prop('disabled', !hasValue);
        $userSelect.prop('disabled', !hasValue);
        $stageSelect.prop('disabled', !hasValue);

        app.getBoard($(this).val(), function(response) {
            boardData = response.data[0];
            var users = boardData.users;
            var admins = boardData.admins;
            var stages = boardData.stages;

            users.forEach(function(item){
                var option = new Option(item.tag, item.id, true, true);
                $userSelect.append(option).trigger('change');
                $userSelect.trigger({
                    type: 'select2:select',
                    params: {
                        data: item
                    }
                });
            });

            stages.forEach(function(item){
                var option = new Option(item.name, item.id, true, true);
                $stageSelect.append(option).trigger('change');
                $stageSelect.trigger({
                    type: 'select2:select',
                    params: {
                        data: item
                    }
                });
            });

        });
    });

    $('#edit_board_form').on('submit', function(e) {
        e.preventDefault();
        var $form = $(this);
        var $boardId = $form.find('#board');
        var $users = $form.find('#board_users');
        var $stages = $form.find('#board_stages');

        var data = {
            id: boardData.board.id,
            uuid: boardData.board.uuid,
            users: $users.val(),
            stages: $stages.val(),
            admins: boardData.admins,
            name: boardData.board.name
        };

        app.saveBoard(data, function(resp){
            if (resp.success) {
                app.showMessage('success', 'Board updated!');
                $stages.val([]);
                $users.val([]);
                $boardId.val('');
                window.scrollTo(0, 0);
            }
            else {
                app.showMessage('danger', 'Something went wrong :(');
            }
        });
    });
}(window.app));
