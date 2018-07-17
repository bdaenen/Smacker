(function() {
  'use strict';
  var $form = $('#add_match_form');
  var app = window.app;

  $form.find('#match_date').val(new Date().toISOString().substr(0, 10));
  $form.find('[data-src="stages"]').each(function(){
    var $select = $(this);
    app.getStages(function(stages){
      stages.data.forEach(function(stage){
        $select.append($('<option>').text(stage.name).attr('value', stage.id));
      })
    });
  });
  $form.find('[data-src="characters"]').each(function(){
    var $select = $(this);
    app.getCharacters(function(characters){
      characters.data.forEach(function(character){
        $select.append($('<option>').text(character.name).attr('value', character.id));
      })
    });
  });
  $form.find('[data-src="users"]').each(function(){
    var $select = $(this);
    app.getUsers(function(users){
      users.data.forEach(function(user){
        $select.append($('<option>').text(user.tag).attr('value', user.id));
      })
    });
  });
  $form.find('[data-src="teams"]').each(function(){
    var $select = $(this);
    app.getTeams(function(teams){
      teams.data.forEach(function(team){
        $select.append($('<option>').text(team.name).attr('value', team.id));
      })
    });
  });

  $form.on('submit', function(e) {
    e.preventDefault();
    var data = $(this).serializeObject();
    var formattedData = {};
    formattedData.match = data.match;
    // TODO: make dynamic nr
    formattedData.players = [];

    for (var i = 0; i < 2; i++) {
      formattedData.players[i] = {};
      Object.keys(data.players).forEach(function(key){
        formattedData.players[i][key] = data.players[key][i]
      });
      formattedData.players[i].data = data.players.data[i];
      formattedData.players[i].is_winner = +(i == data.winner);
    }

    app.saveMatch(formattedData, function(resp){
      if (resp.success) {
        app.loadPage('/matches/add', null, function(){
          app.showMessage('success', 'Match saved!');
          window.scrollTo(0, 0);
        });
      }
    });

  });
}());
