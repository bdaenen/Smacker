(function (app) {
    'use strict';

    $(app).on('page.loaded', function() {
        app.select2.initAjaxSelect2();
        app.select2.initLocalSelect2();
    });

    app.select2 = {};

    /**
     *
     */
    app.select2.initAjaxSelect2 = function($parent) {
        $parent = $parent || $('body');
        $parent.find('.js-select2').each(function(){
            var $select = $(this);
            var router = $select.data('router');
            var route = $select.data('route');

            $select.select2({
                placeholder: $select.data('placeholder') || 'Select an item',
                minimumResultsForSearch: 10,
                ajax: {
                    url: app.getEndpointUrl(router, route),
                    dataType: 'json',
                    data: function(params) {
                        return {
                            q: params.term || '',
                            page: params.page || 0,
                            pageSize: 50
                        }
                    },
                    processResults: function (data, params) {
                        params.page = params.page || 0;

                        return {
                            results: data.results,
                            pagination: {
                                more: ((params.page+1) * 50) < data.total
                            }
                        };
                    },
                    method: 'get',
                    xhrFields: {withCredentials: true},
                    crossDomain: true
                }
            });
        });
    };

    /**
     *
     */
    app.select2.initLocalSelect2 = function($parent) {
        $parent = $parent || $('body');
        $parent.find('.js-select2-local').each(function(){
            var $select = $(this);
            $select.select2({
                placeholder: $select.data('placeholder') || 'Select an item',
                minimumResultsForSearch: 10
            });
        });
    }
}(window.app));
