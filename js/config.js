(function() {
    'use strict';

    window.config = {
      apiHost: 'http://127.0.0.1:3000',
      endpoints: {
        board: {
          add: '/boards/add',
          edit: '/boards/edit'
        },
        login: {
          login: '/login'
        },
        matches: {
          list: '/matches',
          detail: '/matches',
          add: '/matches/add'
        },
        characters: {
          list: '/characters',
          select: '/characters/select',
          byUser: '/stats/user/characters'
        },
        stages: {
          list: '/stages',
          select: '/stages/select',
        },
        users: {
          list: '/users',
          select: '/users/select',
          add: '/users/add',
          change_password: '/users/change_password',
          boards: '/users/me/boards/select'
        },
        teams: {
          list: '/teams',
          select: '/teams/select',
        }
      }
    };

  $.ajaxSetup({
    xhrFields: {
      withCredentials: true
    }
  });
}());
