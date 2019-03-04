(function() {
    'use strict';
    var $form = $('#add_match_form');
    var app = window.app;
    var $playerStocks;
    var $playerWinner;
    var boardData;

    /**
     * Initialize the page.
     */
    function init() {
        $form.find('#match_board').on('change', function() {
            clearFields();
            removeMatchCard();
            removePlayerCards();
            removeFormButtons();

            if ($(this).val()) {
                app.getBoard($(this).val(), function(data){
                    boardData = data.data[0];
                    initMatchCard();
                    addPlayerCards(2);
                    addFormButtons();
                });
            }
        });

        $form.on('submit', submitForm);

        $form.on('change', '[id*="player_winner_"]', function(e) {
            $(this).prev().prop('checked', !$(this).prop('checked'));
        });
    }

    /**
     * @type {Function}
     * Show/Hide the teams input fields if it's (not) a team match.
     */
    var updateTeamDisplay = function($wrapper) {
        var $this = $(this);
        $wrapper = $wrapper || $form;

        if ($this.prop('checked')) {
            $wrapper.find('[name="players[team_id][]"]').closest('.col-sm').show();
        }
        else {
            $wrapper.find('[name="players[team_id][]"]').closest('.col-sm').hide();
        }
    };

    /**
     * @type {Function}
     */
    var updateStockFields = function() {
        var $maxStocks = $(this);
        var $stockFields = $playerStocks;
        $stockFields.attr('max', $maxStocks.val());
        $stockFields.each(function(){
            var $this = $(this);
            if ($this.val() > $maxStocks.val()) {
                $this.val($maxStocks.val());
            }
        });
    };

    /**
     * Initialize and append the match card.
     */
    function initMatchCard() {
        var $option;
        var $stageSelect;
        var $wrapper = $('.js-match-card-wrapper');
        var stages = boardData.stages;
        var i;

        var $html = $($('#match-card-template').html());
        updateTeamDisplay = updateTeamDisplay.bind($html.find('#is_team'));
        updateStockFields = updateStockFields.bind($html.find('#match_stocks'));
        $html.find('#match_date').val(new Date().toISOString().substr(0, 19));
        $html.find('#is_team').on('change', function(){updateTeamDisplay()});
        $html.find('#match_stocks').on('input', function(){updateStockFields()});

        $stageSelect = $html.find('#match_stage');

        for (i = 0; i < stages.length; i++) {
            $option = $('<option>');
            $option.val(stages[i].id);
            $option.text(stages[i].name);
            $stageSelect.append($option);
        }

        $wrapper.append($html);

        setTimeout(function(){
            app.select2.initLocalSelect2($wrapper);
        }, 0);
    }

    /**
     * Submit the form
     * @param e
     */
    function submitForm(e) {
        e.preventDefault();
        var data = $(this).serializeObject();
        var formattedData = {};
        formattedData.match = data.match;
        formattedData.match.board_ids = [formattedData.match.board_ids];
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
                app.showMessage('success', 'Match saved!');
                clearFields();
                window.scrollTo(0, 0);
            }
        });
    }

    /**
     * Adds a number of player rows
     */
    function addPlayerCards(amount) {
        var users = boardData.users;
        var addedRows = [];
        for (var i = 0; i < amount; i++) {
            var count = $form.find('.js-player-row').length;
            var $template = $('#player-row-template');
            var rowHtml = $template.html();
            rowHtml = rowHtml.replace(/\$PLAYER_COUNT\+1\$/g, count+1);
            rowHtml = rowHtml.replace(/\$PLAYER_COUNT\$/g, count);
            var $row = $(rowHtml);
            var $rowWrapper = $form.find('.player-row-wrapper');
            if (!(count % 2)) {
                $rowWrapper.append($('<div>').addClass('row').addClass('js-player-card-row'));
            }
            $rowWrapper.find('.js-player-card-row').last().append($row);
            initPlayerRow($row);
            addedRows.push($row);
        }

        setTimeout(function(){
            addedRows.forEach(function($row){
                app.select2.initAjaxSelect2($row);
                app.select2.initLocalSelect2($row);

                var $userSelect = $row.find('[name="players[user_id][]"]');
                users.forEach(function(user){
                    var $option = $('<option>');
                    $option.val(user.id);
                    $option.text(user.tag);
                    $userSelect.append($option);
                });
            });


            $playerWinner = $form.find('[id*="player_winner_"]');
            $playerStocks = $form.find('[id*="player_stocks_"]');
            updateTeamDisplay();
            updateStockFields();
        }, 0);
    }

    /**
     * Removes a player row
     */
    function removePlayerCard() {
        var $playerRow = $form.find('.js-player-row').last();
        var $parentRow = $playerRow.closest('.js-player-card-row');
        $form.find('.js-player-row').last().remove();
        if ($parentRow.is(':empty')) {
            $parentRow.remove();
        }

        $playerWinner = $form.find('[id*="player_winner_"]');
        $playerStocks = $form.find('[id*="player_stocks_"]');
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
        $playerRow.find('[name="players[user_id][]"]').on('change', function(e){
            var $userSelect = $(this);
            var $select = $userSelect.closest('.js-player-row').find('[name="players[character_id][]"]');
            $select.html('');
            app.getCharactersForUser($(this).val(), function(characters){
                characters.data.forEach(function(character) {
                    $select.append($('<option>').text(character.name).attr('value', character.id));
                });
                $select.trigger('change');
            });
        });

        $playerRow.find('[data-src="characters"]').on('change', function() {
            var $this = $(this);
            var charname = $this.find('option:selected').text();
            charname = charname.toLowerCase().trim().replace(/\s/g, "").replace(/\./g, "");
            $this.closest('.card-accent-character').get(0).style.setProperty("--color-character", 'var(--' + 'color-' + charname + ')');
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

    /**
     *
     */
    function addFormButtons() {
        var $html = $($('#form-buttons-template').html());
        $('.js-form-button-wrapper').append($html);

        $('.js-add-player').on('click', function(e) {
            e.preventDefault();
            addPlayerCards(1);
        });

        $('.js-remove-player').on('click', function(e) {
            e.preventDefault();
            removePlayerCard();
        });
    }

    /**
     *
     */
    function removeMatchCard() {
        $('.js-match-card-wrapper').empty();
    }

    /**
     *
     */
    function removePlayerCards() {
        $('.js-player-row').remove();
        $playerWinner = $form.find('[id*="player_winner_"]');
        $playerStocks = $form.find('[id*="player_stocks_"]');
    }

    /**
     *
     */
    function removeFormButtons() {
        $('.js-form-button-wrapper').empty();
    }

    function clearFields() {
        $('.js-player-row input').val('');
        $('.js-player-row select').each(function(){
            var $this = $(this);
            if ($this.hasClass('js-select2-local') || $this.hasClass('js-select2')) {
                $this.select2('destroy');
            }
            $this.val(null);
        });

        removeMatchCard();
        removePlayerCards();
    }

    init();
}());
