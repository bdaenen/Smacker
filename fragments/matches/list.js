(function () {
    'use strict';
    var list = document.querySelector('.match-list');
    var template = document.querySelector('#list-entry');
    var queryParams = new URLSearchParams(document.location.search);
    var page = queryParams.has('page') ? queryParams.get('page') : 1;

    var matches = app.apiGet('matches', 'list', {
        page: page,
        pageSize: 50
    }, renderList);


    function renderList(matches) {
        var frag = document.createDocumentFragment();
        matches.data.forEach(function(data){
            var item = template.content.cloneNode(true);
            var p1 = data.players[0];
            var p2 = data.players[1];
            var p3 = data.players[2];
            var p4 = data.players[3];
console.log(data);
            item.querySelector('.id').innerText = data.match.id;
            item.querySelector('.p1').innerText = p1.user.tag + '(' + p1.character.name + ')';
            item.querySelector('.p2').innerText = p2.user.tag + '(' + p1.character.name + ')';

            p3 && (item.querySelector('.p3').innerText = p3.user.tag + '(' + p1.character.name + ')');
            p4 && (item.querySelector('.p4').innerText = p4.user.tag + '(' + p1.character.name + ')');

            frag.appendChild(item);
        });

        list.appendChild(frag);
    }
}());