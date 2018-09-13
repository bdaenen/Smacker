(function () {
    'use strict';
    var list = document.querySelector('.match.list');
    var template = document.querySelector('#list-entry');
    var queryParams = new URLSearchParams(document.location.search);
    var currentPage = queryParams.has('page') ? parseInt(queryParams.get('page'), 10) : 1;
    var pageSize = 20;
    var pagerOffset = 2;

    function bindPageEvents() {
      document.querySelectorAll('.pagination a').forEach(function(el){
        el.addEventListener('click', function(e) {
          e.preventDefault();
          history.pushState({}, window.title, el.href + window.location.hash);
          currentPage = parseInt(el.dataset.page);
          loadItems();
        });
      });
    }

    function loadItems() {
      app.apiGet('matches', 'list', {
        page: currentPage,
        pageSize: pageSize,
        sort: 'match.id',
        direction: 'desc'
      }, renderList);
    }

    function renderList(matches) {
        list.innerHTML = '';
        renderPager(matches);
        var frag = document.createDocumentFragment();
        matches.data.forEach(function(data){
            var item = template.content.cloneNode(true);
            var p1 = data.players[0];
            var p2 = data.players[1];
            var p3 = data.players[2];
            var p4 = data.players[3];

            var domP1 = item.querySelector('.js-p1');
            var domP2 = item.querySelector('.js-p2');
            var domP3 = item.querySelector('.js-p3');
            var domP4 = item.querySelector('.js-p4');
            item.querySelector('.js-id').innerText = data.match.id;
            domP1.innerText = p1.user.tag + '(' + p1.character.name + ')';
            p1.is_winner && (domP1.classList.add('winner'));
            domP2.innerText = p2.user.tag + '(' + p2.character.name + ')';
            p2.is_winner && (domP2.classList.add('winner'));


            if (p3) {
              domP3.innerText = p3.user.tag + '(' + p3.character.name + ')';
              p3.is_winner && (domP3.classList.add('winner'));
            }

            if (p4) {
              domP4.innerText = p4.user.tag + '(' + p4.character.name + ')';
              p4.is_winner && (domP4.classList.add('winner'));

            }

            item.querySelector('.js-teams').innerText = data.match.is_team;
            item.querySelector('.js-stage').innerText = data.match.stage.name;
            item.querySelector('.js-date').innerText = data.match.date;

            frag.appendChild(item);
        });

        list.appendChild(frag);
    }

    function renderPager(matches) {
      var list = document.querySelector('.pagination');
      list.innerHTML = '';
      var frag = document.createDocumentFragment();
      var i = 0;

      var pages = Math.ceil(matches.total / pageSize) + 100;
      if (pages > 1) {
        i = Math.max(currentPage - pagerOffset, 1);
        frag.appendChild(createPageItem('&laquo;', currentPage-1, (currentPage===1) ? 'disabled' : ''));
        if (i > 1) {
          frag.appendChild(createPageItem(1, 1));
          if (i > pagerOffset) {
            frag.appendChild(createPageItem('...', 1, 'disabled'));
          }
        }
        for (; i < pages+1; i++) {
          if (i === currentPage+pagerOffset+1) {
            frag.appendChild(createPageItem('...', i, 'disabled'));
            i = pages;
          }
          frag.appendChild(createPageItem(i, i, currentPage===i?'active':''));
        }
        frag.appendChild(createPageItem('&raquo;', currentPage+1, currentPage===pages ? 'disabled' : ''));
        list.appendChild(frag);
        bindPageEvents();
      }
    }

    function createPageItem(text, page, state) {
      var template = document.querySelector('#page-item');
      var item = template.content.cloneNode(true);
      var jsPage = item.querySelector('.js-page');
      jsPage.innerHTML = text;
      jsPage.href = '?page=' + page;
      jsPage.dataset.page = page;

      if (state) {
        item.querySelector('li').classList.add(state);
      }

      return item;
    }

    loadItems();

}());
