(function(app) {
    'use strict';

    $('#theme-switch').on('change', function() {
        var checked = $(this).prop('checked');
        $('body').toggleClass('dark', checked);
        app.localStore.set('darkTheme', checked);
    });

    if (app.localStore.get('darkTheme')) {
        $('body').addClass('dark');
        $('#theme-switch').prop('checked', true);
    }
    else {
        $('body').removeClass('dark');
        $('#theme-switch').prop('checked', false);
    }
}(window.app));
