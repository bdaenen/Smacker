(function() {
    'use strict';

    window.config = {
      apiHost: 'https://smashtrack.benn0.be',
      endpoints: {
        login: {
          login: '/login'
        },
        matches: {
          list: '/matches',
          detail: '/matches',
          add: '/matches/add'
        },
        characters: {
          list: '/characters'
        },
        stages: {
          list: '/stages'
        },
        users: {
          list: '/users',
          add: '/users/add'
        },
        teams: {
          list: '/teams'
        }
      }
    };

  $.ajaxSetup({
    xhrFields: {
      withCredentials: true
    }
  });
}());
