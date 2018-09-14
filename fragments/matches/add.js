(function() {
  'use strict';
  var $form = $('#add_match_form');
  var app = window.app;
  var matchId = app.getQueryParam('id');
  if (matchId) {
    matchId = parseInt(matchId, 10);
  }

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

  /**
   * @type {Function}
   * Show/Hide the teams input fields if it's (not) a team match.
   */
  var updateTeamDisplay = function (){
    var $this = $(this);
    if ($this.prop('checked')) {
      $form.find('[data-src="teams"]').closest('.col-sm').show();
    }
    else {
      $form.find('[data-src="teams"]').closest('.col-sm').hide();
    }
  }.bind($form.find('#is_team'));

  var $playerStocks = $form.find('[id*="player_stocks_"]');
  var $playerWinner = $form.find('[id*="player_winner_"]');

  /**
   * @type {Function}
   */
  var updateStockFields = function(){
    var $maxStocks = $(this);
    var $stockFields = $playerStocks;
    $stockFields.attr('max', $maxStocks.val());
    $stockFields.each(function(){
      var $this = $(this);
      if ($this.val() > $maxStocks.val()) {
        $this.val($maxStocks.val());
      }
    });
  }.bind($form.find('#match_stocks'));

  $playerStocks.on('change', function() {
    var highestVal = 0;
    var equalValue = 0;
    $playerStocks.each(function(i){
      var $this = $(this);
      if ($this.val() > highestVal) {
        highestVal = $this.val();
        $playerWinner.prop('checked', false);
        $playerWinner.eq(i).prop('checked', true)
      }
      else if ($this.val() === highestVal) {
        equalValue = $this.val();
      }
    });

    if (equalValue) {
      $playerWinner.prop('checked', false);
    }
  });


  $form.find('#is_team').on('change', updateTeamDisplay);
  updateTeamDisplay();

  $form.find('#match_stocks').on('input', updateStockFields);
  updateStockFields();

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

  function prefillData() {
    app.apiGet('matches', 'detail/' + matchId, function(data) {
      var data = data.data[0];
      if (data) {
        var match_date = document.querySelector('#match_date');
        var is_team = document.querySelector('#is_team');
        var match_stage = document.querySelector('#match_stage');
        var match_stocks = document.querySelector('#match_stocks');
        var match_time = document.querySelector('#match_time');
        var match_time_remaining = document.querySelector('#match_time_remaining');

        match_date.value = data.match.date;
        is_team.checked = data.match.is_team;
        match_stage.querySelector('option[value="' + data.match.stage.id + '"]').selected = true;
        match_stocks.value  = data.match.stocks;
        match_time.value  = data.match.time;
        match_time_remaining.value  = data.match.time_remaining;
        document.querySelector('#match_date').value = data.match.date;
      }
    });
  }

  if (matchId) {
    prefillData();
  }
}());
