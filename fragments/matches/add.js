(function() {
  'use strict';
  var $form = $('#add_match_form');
  var app = window.app;
  var $playerStocks;
  var $playerWinner;

  function init() {
      $form.find('#match_date').val(new Date().toISOString().substr(0, 10));
      $form.find('[data-src="stages"]').each(function(){
          var $select = $(this);
          app.getStages(function(stages){
              stages.data.forEach(function(stage){
                  $select.append($('<option>').text(stage.name).attr('value', stage.id));
              })
          });
      });
      $form.find('#is_team').on('change', updateTeamDisplay);
      $form.find('#match_stocks').on('input', updateStockFields);

      $form.on('submit', submitForm);

      addRow();
      addRow();

      $('.js-add-player').on('click', function(e) {
          e.preventDefault();
          addRow();
      });

      $('.js-remove-player').on('click', function(e) {
          e.preventDefault();
          removeRow();
      });

      $form.on('change', '[id*="player_winner_"]', function(e){
          $(this).prev().prop('checked', !$(this).prop('checked'));
      });
  }

  function submitForm(e) {
      e.preventDefault();
      var data = $(this).serializeObject();
      console.log(data);
      debugger;
      var formattedData = {};
      formattedData.match = data.match;
      formattedData.players = [];

      for (var i = 0; i < $form.find('.js-player-row').length; i++) {
          formattedData.players[i] = {};
          Object.keys(data.players).forEach(function(key){
              formattedData.players[i][key] = data.players[key][i]
          });
          formattedData.players[i].data = data.players.data[i];
          formattedData.players[i].is_winner = +(data.players.winner[i]);
      }

      app.saveMatch(formattedData, function(resp){
          if (resp.success) {
              app.loadPage('/matches/add', null, function(){
                  app.showMessage('success', 'Match saved!');
                  window.scrollTo(0, 0);
              });
          }
      });
  }

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

    /**
     * Adds a player row
     */
  function addRow() {
    var count = $form.find('.js-player-row').length;
    var $template = $('#player-row-template');
    var rowHtml = $template.html();
    rowHtml = rowHtml.replace(/\$PLAYER_COUNT\+1\$/g, count+1);
    rowHtml = rowHtml.replace(/\$PLAYER_COUNT\$/g, count);
    var $row = $(rowHtml);
    $form.find('.player-row-wrapper').append($row);
    initPlayerRow($row);

    $playerWinner = $form.find('[id*="player_winner_"]');
    $playerStocks = $form.find('[id*="player_stocks_"]');
    updateTeamDisplay();
    updateStockFields();
  }

    /**
     * Removes a player row
     */
  function removeRow() {
      $form.find('.js-player-row').last().remove();
      $playerWinner = $form.find('[id*="player_winner_"]');
      $playerStocks = $form.find('[id*="player_stocks_"]');
      updateTeamDisplay();
      updateStockFields();
  }

    /**
     * Init a new player row
     * @param $playerRow
     */
  function initPlayerRow($playerRow) {
      $playerRow.find('[data-src="characters"]').each(function(){
          var $select = $(this);
          app.getCharacters(function(characters){
              characters.data.forEach(function(character){
                  $select.append($('<option>').text(character.name).attr('value', character.id));
              })
          });
      });
      $playerRow.find('[data-src="users"]').each(function(){
          var $select = $(this);
          app.getUsers(function(users){
              users.data.forEach(function(user){
                  $select.append($('<option>').text(user.tag).attr('value', user.id));
              })
          });
      })
        .on('change', function(e){
            var $userSelect = $(this);
            var $select = $userSelect.closest('.js-player-row').find('[data-src="characters"]');
            $select.html('');
            app.getCharactersForUser($(this).val(), function(characters){
                characters.data.forEach(function(character) {
                    $select.append($('<option>').text(character.name).attr('value', character.id));
                });
            });
        });

      $playerRow.find('[data-src="characters"]').on('change', function() {
         var $this = $(this);
         var charname = $this.find('option:selected').text();
         charname = charname.toLowerCase().trim().replace(/\s/g, "").replace(/\./g, "");
          $this.closest('.player-row').get(0).style.setProperty("--input-border", 'var(--' + 'color-' + charname + ')');
          $this.closest('.player-row').get(0).style.setProperty("--checkbox-fill", 'var(--' + 'color-' + charname + ')');
      });

      $playerRow.find('[data-src="teams"]').each(function(){
          var $select = $(this);
          app.getTeams(function(teams){
              teams.data.forEach(function(team){
                  $select.append($('<option>').text(team.name).attr('value', team.id));
              })
          });
      });

      $playerRow.find('[id*="player_stocks_"]').on('change', function() {
          var highestVal = 0;
          var equalValue = 0;
          $playerStocks.each(function(i){
              var $this = $(this);
              if ($this.val() > highestVal) {
                  highestVal = $this.val();
                  $playerWinner.prop('checked', false).trigger('change');
                  $playerWinner.eq(i).prop('checked', true).trigger('change');
              }
              else if ($this.val() === highestVal) {
                  equalValue = $this.val();
              }
          });

          if (equalValue) {
              $playerWinner.prop('checked', false).trigger('change');
          }
      });
  }

  init();
}());
