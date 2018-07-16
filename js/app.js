(function() {
    'use strict';
    var config = window.config;
    var _isLoading = false;
    var _ignoreHashChange = false;

    var app = {
      $mainContent: $('.js-main'),
      isAuthenticated: function(callback) {
        if (sessionStorage.getItem('authenticated') === 'true') {
          callback(true);
        }
        $.ajax({
          url: this.getEndpointUrl('login', 'login'),
          method: 'GET'
        }).done(function(response){
          console.log(response);
          callback(response.authenticated);
        })
      },
      authenticate: function(data, callback) {
        $.ajax({
          url: window.app.getEndpointUrl('login', 'login'),
          method: 'post',
          data: data
        }).done(function(response){
          if (response.authenticated) {
            setUser(response.user);
            callback(this.getUser());
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
      getStages: function(callback) {
        $.ajax({
          url: this.getEndpointUrl('stages', 'list'),
          method: 'get',
        }).done(function(response){
          callback(response);
        });
      },
      getCharacters: function(callback) {
        $.ajax({
          url: this.getEndpointUrl('characters', 'list'),
          method: 'get',
        }).done(function(response){
          callback(response);
        });
      },
      getUsers: function(callback) {
        $.ajax({
          url: this.getEndpointUrl('users', 'list'),
          method: 'get',
        }).done(function(response){
          callback(response);
        });
      },
      getTeams: function(callback) {
        $.ajax({
          url: this.getEndpointUrl('teams', 'list'),
          method: 'get',
        }).done(function(response){
          callback(response);
        });
      },
      getEndpointUrl: function(entity, route) {
        return config.apiHost + config.endpoints[entity][route];
      },
      loadPage: function(path, data, callback) {
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
        }.bind(this));
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
        var path = window.location.hash.substr(1);
        console.log(path);
        this.loadPage(path);
      }
    };

    /**
     * @param user
     */
    function setUser(user) {
      sessionStorage.setItem('user', JSON.stringify(user));
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
    app.handleHashChange();

    window.app = app;
}());
