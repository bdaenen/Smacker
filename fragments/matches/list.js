app.apiGetUrl(app.getEndpointUrl('matches', 'list') + '?pageSize=10000', null, (response) => {
   response.data
     .sort((data1, data2) => (data2.match.id - data1.match.id))
     .forEach((match) => {
       let $matchDiv = $(`<div class="row py-3" data-id="${match.match.id}" style="border-bottom: 1px solid grey">`);
       $matchDiv.data('match', match);
       $matchDiv.html(`
      <div class="col-md">
        ${match.match.id}
      </div>
      <div class="col-md">
        ${match.match.date}
      </div>
       <div class="col-md">${
           match.players.map(
             player => (
               `<span ${player.is_winner ? 'style="font-weight: bold;"' : ''}>
                  ${player.user.tag} (${player.character.name})
                </span>`))
             .join(' vs ')
       }</div>
       <div class="col-md">${
           match.players.map(
             player => (
               `<span>
                  ${player.data.stocks}
                </span>`))
             .join(' - ')
       }</div>
       <div class="col-md">
        ${match.match.stage.name}
       </div>
       <div class="col-md">
        <a class="cui-pencil js-edit-match" href="#"></a>
        <a class="cui-trash js-delete-match" href="#"></a>
       </div>
       `);
       $('.matchlist').append($matchDiv)
   });

   $('.matchlist').on('click', '.js-edit-match', function(e) {
       e.preventDefault();
       let row = $(this).closest('.row');
       app.localStore.set('item_to_edit', row.data('match'));
       app.loadPage('/matches/edit');
   })
});