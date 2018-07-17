(function() {
    'use strict';
    var config = window.config;
    var _isLoading = false;
    var _ignoreHashChange = false;

    var app = {
      $mainContent: $('.js-main'),
      isAuthenticated: function(callback) {
        if (this.getUser()) {
          callback(true);
        }
        else {
          this.apiGet('login', 'login', function(response){
            callback(response.authenticated)
          });
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
      apiGet: function(router, route, callback) {
        this.clearMessages();
        $.ajax({
          url: this.getEndpointUrl(router, route),
          method: 'get',
          xhrFields: {withCredentials: true},
          crossDomain: true
        })
          .done(callback)
          .fail(function(xhr, status, error){
            if (status == 'error') {
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
          contentType: "application/json; charset=utf-8",
          crossDomain: true
        }).done(callback)
          .fail(function(){
            this.showMessage('danger', 'Something went wrong. The submitted data was probably not saved.')
          });
      },
      getStages: function(callback) {
        this.apiGet('stages', 'list', callback);
      },
      getCharacters: function(callback) {
        this.apiGet('characters', 'list', callback);
      },
      getUsers: function(callback) {
        this.apiGet('users', 'list', callback);
      },
      getTeams: function(callback) {
        this.apiGet('teams', 'list', callback);
      },
      getEndpointUrl: function(router, route) {
        return config.apiHost + config.endpoints[router][route];
      },
      loadPage: function(path, data, callback) {
        this.isAuthenticated(function(authenticated){
          if (authenticated) {
            loadPage.call(this, path, data, callback);
          }
          else {
            loadPage.call(this, '/login/login');
            setTimeout(function(){this.showMessage('info', 'You were logged out. Please log in to continue.')}.bind(this), 100);
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
        var data = {};
        if (this.getUser()) {
          data.userTag = this.getUser().tag;
        }
        this.loadPage(path, data);
      },
      showMessage: function(type, message) {
        var $message = $('<div role="alert" class="alert alert-' + type + '">');
        $message.html(message);
        this.$mainContent.prepend($message);
      },
      clearMessages: function() {
        this.$mainContent.find('.alert').remove();
      },
      saveMatch: function(data, callback) {
        console.log(data);
        this.apiPost('matches', 'add', data, callback);
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

    function loadPage(path, data, callback) {
        data = data || null;
        callback = callback || null;

        if (_isLoading) {return;}
        _isLoading = true;
        $.ajax({
          url: '/fragments' + path + '.html',
          method: 'get'
        }).done(function(response){
          this.$mainContent.html(this.renderTemplate(response, data));
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
}());