(function($) {
    'use strict';
    var config = window.config;
    var _isLoading = false;
    var _ignoreHashChange = false;
    var _localStorageCache = JSON.parse(localStorage.getItem('smacker_storage')) || {};

    var app = {
        $mainContent: $('.js-main'),
        isAuthenticated: function(callback) {
            if (this.getUser()) {
                callback(true);
            }
            else {
                this.apiGet('login', 'login', function(response){
                    if (response.authenticated && !this.getUser()) {
                        setUser(response.user);
                    }
                    callback(response.authenticated)
                }.bind(this));
            }
        },
        authenticate: function(data, callback) {
            this.apiPost('login', 'login', data, function(response){
                if (response.authenticated) {
                    setUser(response.user);
                    callback(this.getUser());
                }
                else {
                    clearUser();
                    this.showMessage('danger', 'Authentication failed. Please try again.')
                }
            }.bind(this));
        },
        getUser: function() {
            var user = sessionStorage.getItem('user');
            if (user) {
                return JSON.parse(user);
            }
            return null;
        },
        apiGet: function(router, route, params, callback) {
            if (arguments.length === 3) {
                return this.apiGet(router, route, null, params);
            }
            var url = this.getEndpointUrl(router, route);
            this.apiGetUrl(url, params, callback);
        },
        apiGetUrl: function(url, params, callback) {
            if (arguments.length === 2) {
                return this.apiGetUrl(url, null, params);
            }
            $.ajax({
                url: url,
                data: params || {},
                method: 'get',
                xhrFields: {withCredentials: true},
                crossDomain: true
            })
              .done(function(data, textStatus, jqXHR){
                  if(data.authenticated !== undefined && data.authenticated === false && data.user !== undefined && data.user === null) {
                      clearUser();
                      this.loadPage('/login/login');
                  }
                  else {
                      callback(data, textStatus, jqXHR);
                  }
              }.bind(this))
              .fail(function(xhr, status, error){
                  if (status == 'error' && error === 'Forbidden') {
                      clearUser();
                      this.loadPage('/login/login');
                  }
              }.bind(this));
        },
        apiPost: function(router, route, data, callback) {
            this.clearMessages();
            $.ajax({
                url: this.getEndpointUrl(router, route),
                data: JSON.stringify(data),
                method: 'post',
                dataType: 'json',
                contentType: 'application/json; charset=utf-8',
                crossDomain: true
            }).done(callback)
              .fail(function(xhr, status, error){
                  if (xhr.responseJSON && xhr.responseJSON.error) {
                      this.showMessage('danger', xhr.responseJSON.error);
                  }
                  else {
                      this.showMessage('danger', 'Something went wrong. The submitted data was probably not saved.')
                  }
              }.bind(this));
        },
        getStages: function(callback) {
            this.apiGet('stages', 'list', {order: 'name', pageSize: 200}, callback);
        },
        getCharacters: function(callback) {
            this.apiGet('characters', 'list', {order: 'name', pageSize: 100}, callback);
        },
        getUsers: function(callback) {
            this.apiGet('users', 'list', {order: 'tag'}, callback);
        },
        getTeams: function(callback) {
            this.apiGet('teams', 'list', {order: 'name'}, callback);
        },
        getCharactersForUser: function(userId, callback) {
            this.apiGet('characters', 'byUser', {order: 'count', orderDir: 'desc', userId: userId, pageSize: 100}, callback)
        },
        getBoard: function(id, callback) {
            this.apiGetUrl(config.apiHost + '/boards/'+id, callback)
        },
        getEndpointUrl: function(router, route) {
            return config.apiHost + config.endpoints[router][route];
        },
        loadPage: function(path, data, callback) {
            if (path === '/login/login') {
                $('.sidebar').css('display', 'none');
                return _loadPage.call(this, '/login/login');
            }
            this.isAuthenticated(function(authenticated){
                if (authenticated) {
                    $('.sidebar').removeAttr('style');
                    _loadPage.call(this, path, data, callback);
                }
                else {
                    _loadPage.call(this, '/login/login');
                    setTimeout(function(){this.showMessage('info', 'Please log in to continue.')}.bind(this), 100);
                }
            }.bind(this))
        },
        renderTemplate: function(template, data) {
            if (!data) {return template;}
            Object.keys(data).forEach(function(d) {
                var regex = new RegExp('{{' + d + '}}', 'g');
                template = template.replace(regex, data[d]);
            }, this);

            return template;
        },
        handleHashChange: function() {
            if (_ignoreHashChange) {
                return;
            }
            var path = window.location.hash.substr(1) || '/home/home';
            this.loadPage(path);
        },
        showMessage: function(type, message, duration) {
            if (duration === undefined) {
                duration = duration || (type !== 'danger' ? 10000 : -1);
            }

            var $message = $('<div role="alert" class="alert alert-' + type + '">');
            $message.html(message);
            this.$mainContent.prepend($message);

            if (duration > 0) {
                setTimeout(function(){
                    $message.addClass('fade');
                    $message.one('transitionend', function(){
                        $(this).remove();
                    })
                }, duration)
            }
        },
        clearMessages: function() {
            this.$mainContent.find('.alert').remove();
        },
        saveMatch: function(data, callback) {
            this.apiPost('matches', 'add', data, callback);
        },
        saveBoard: function(data, callback) {
            if (!data.id) {
                this.apiPost('board', 'add', data, callback)
            }
            else {
                this.apiPost('board', 'edit', data, callback);
            }
        },
        localStore: {
            get: function(key) {
                return _localStorageCache[key];
            },
            set: function(key, value) {
                _localStorageCache[key] = value;
                localStorage.setItem('smacker_storage', JSON.stringify(_localStorageCache));
            }
        }
    };

    /**
     * @param user
     */
    function setUser(user) {
        sessionStorage.setItem('user', JSON.stringify(user));
    }

    /**
     *
     */
    function clearUser() {
        sessionStorage.removeItem('user');
    }

    function _loadPage(path, data, callback) {
        var timeStart;
        data = data || null;
        callback = callback || null;

        if (_isLoading) {return;}
        _isLoading = true;
        $.ajax({
            beforeSend: function() {
                timeStart = window.performance.now();
                $('.js-main-wrapper').addClass('fade');
            },
            url: '/fragments' + path + '.html',
            method: 'get'
        }).done(function(response){
            // TODO: we could just hook into transition end.
            var elapsed = window.performance.now() - timeStart;
            setTimeout(function(){
                this.$mainContent.html(this.renderTemplate(response, data));
                $('.js-main-wrapper').removeClass('fade');
                $(window.app).trigger('page.loaded');
            }.bind(this), Math.max(0, 300 - elapsed));
            _isLoading = false;
            _ignoreHashChange = true;
            window.location.hash = '#' + path;
            _ignoreHashChange = false;
            callback && callback(path);
        }.bind(this))
          .fail(function(){
              _isLoading = false;
          });
    }

    if (sessionStorage.getItem('user')) {
        setUser(JSON.parse(sessionStorage.getItem('user')));
    }

    Object.defineProperty(app, 'user', {
        get: function() {
            var user = sessionStorage.getItem('user');
            if (!user) {
                return null;
            }
            return JSON.parse(user);
        }
    });

    window.onhashchange = app.handleHashChange.bind(app);
    !_isLoading && app.handleHashChange();

    window.app = app;
}(window.jQuery));
