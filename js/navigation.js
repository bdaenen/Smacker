(function() {
    $(window.app).on('page.loaded', function(){
        $('a.nav-link').removeClass('active');
        $('a[href="/'+window.location.hash+'"]').addClass('active');
    });
}());

