(function(smack, $) {
  'use strict';
  var $form = $('#add_match_form');
  var matchId = smack.getQueryParam('id');
  var $playerStocks = $form.find('[id*="player_stocks_"]');
  var $playerWinner = $form.find('[id*="player_winner_"]');

  if (matchId) {
    matchId = parseInt(matchId, 10);
  }

  $form.find('#match_date').val(new Date().toISOString().substr(0, 10));

  loadAjaxFields();


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


  $form.find('#is_team').on('change', updateTeamDisplay.bind($form.find('#is_team')));
  updateTeamDisplay.bind($form.find('#is_team'))();

  $form.find('#match_stocks').on('input', updateStockFields);
  updateStockFields();

  $form.on('submit', submitData);

  if (matchId) {
    var interval = null;
    interval = setInterval(function(){
      if ($.active <= 0) {
        clearInterval(interval);
        prefillData();
      }
    }, 250);
  }

  /**
   * @param e
   */
  function submitData (e) {
    e.preventDefault();
    var data = $(this).serializeObject();
    var formattedData = {};
    formattedData.match = data.match;

    if (matchId) {
      formattedData.match.id = matchId;
    }

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

    smack.saveMatch(formattedData, function(resp){
      if (resp.success) {
        smack.loadPage('/matches/add', null, function(){
          smack.showMessage('success', 'Match saved!');
          window.scrollTo(0, 0);
        });
      }
    });
  }

  /**
   *
   */
  function loadAjaxFields() {
    $form.find('[data-src="stages"]').each(function(){
      var $select = $(this);
      smack.getStages(function(stages){
        stages.data.forEach(function(stage){
          $select.append($('<option>').text(stage.name).attr('value', stage.id));
        })
      });
    });

    $form.find('[data-src="characters"]').each(function(){
      var $select = $(this);
      smack.getCharacters(function(characters){
        characters.data.forEach(function(character){
          $select.append($('<option>').text(character.name).attr('value', character.id));
        })
      });
    });

    $form.find('[data-src="users"]').each(function(){
      var $select = $(this);
      smack.getUsers(function(users){
        users.data.forEach(function(user){
          $select.append($('<option>').text(user.tag).attr('value', user.id));
        })
      });
    });

    $form.find('[data-src="teams"]').each(function(){
      var $select = $(this);
      smack.getTeams(function(teams){
        teams.data.forEach(function(team){
          $select.append($('<option>').text(team.name).attr('value', team.id));
        })
      });
    });
  }

  /**
   * @type {Function}
   * Show/Hide the teams input fields if it's (not) a team match.
   */
  function updateTeamDisplay(){
    var $this = $(this);
    if ($this.prop('checked')) {
      $form.find('[data-src="teams"]').closest('.col-sm').show();
    }
    else {
      $form.find('[data-src="teams"]').closest('.col-sm').hide();
    }
  }

  /**
   *
   */
  function prefillData() {
    smack.apiGet('matches', 'detail/' + matchId, function(data) {
      data = data.data[0];
      if (data) {
        var match_date = smack.dom$('#match_date');
        var is_team = smack.dom$('#is_team');
        var match_stage = smack.dom$('#match_stage');
        var match_stocks = smack.dom$('#match_stocks');
        var match_time = smack.dom$('#match_time');
        var match_time_remaining = smack.dom$('#match_time_remaining');

        for (var i = 0; i < data.players.length; i++) {
          var player = data.players[i];
          prefillPlayerData(player, i);
        }

        if (data.match.date) {
          match_date.value = data.match.date;
        }
        else {
          match_date.value = '';
        }

        is_team.checked = data.match.is_team;

        if (data.match.stage && data.match.stage.id) {
          match_stage.querySelector('option[value="' + data.match.stage.id + '"]').selected = true;
        }

        if(data.match.stocks) {
          match_stocks.value  = data.match.stocks;
        }
        else {
          match_stocks.value = '';
        }

        if (data.match.time) {
          match_time.value  = data.match.time;
        }
        else {
          match_time.value = '';
        }

        if (data.match.time_remaining) {
          match_time_remaining.value = data.match.time_remaining;
        }
        smack.dom$('#match_date').value = data.match.date;
      }
    });
  }

  /**
   * @param playerData
   * @param i
   */
  function prefillPlayerData(playerData, i) {
    if (playerData.user.id) {
      smack.dom$('#player_user_' + i + ' option[value="' + playerData.user.id + '"]').selected = true;
    }
    if (playerData.character.id) {
      smack.dom$('#player_character_' + i + ' option[value="' + playerData.character.id + '"]').selected = true;
    }
    if (playerData.data && playerData.data.stocks) {
      smack.dom$('#player_stocks_' + i).value = playerData.data.stocks;
    }
    else {
      smack.dom$('#player_stocks_' + i).value = '';
    }
    if (playerData.team) {
      smack.dom$('#player_team_' + i).value = playerData.team.id;
    }
    smack.dom$('#player_winner_' + i).checked = playerData.is_winner;
  }
}(window.smack, window.jQuery));
