(function (smack, $) {
    'use strict';
    var list = smack.dom$('.match.list');
    var template = smack.dom$('#list-entry');
    var currentPage = smack.getQueryParam('page');
    currentPage = currentPage ? parseInt(currentPage, 10) : 1;
    var pageSize = 20;
    var pagerOffset = 2;

    /**
     * bind click events
     **/
    function bindPageEvents() {
      smack.dom$All('.pagination a').forEach(function(el) {
        el.addEventListener('click', function(e) {
          e.preventDefault();
          history.pushState({}, window.title, el.href + window.location.hash);
          currentPage = parseInt(el.dataset.page);
          loadItems();
        });
      });
    }

    /**
     *
     */
    function bindActions() {
      smack.dom$All('.actions a').forEach(function(el){
        var action = el.dataset.action;
        el.addEventListener('click', function(e) {

        });
      });
    }

    /**
     * load items for current page
     */
    function loadItems() {
      smack.apiGet('matches', 'list', {
        page: currentPage,
        pageSize: pageSize,
        sort: 'match.id',
        direction: 'desc'
      }, renderList);
    }

    /**
     * render the list based on the results
     * @param matches
     */
    function renderList(matches) {
        list.querySelectorAll('.tbody').forEach(function(el){
          el.remove();
        });

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

            item.querySelector('.edit').href = '/?id=' + data.match.id + '#/matches/add';
            item.querySelector('.delete').href = '/?id=' + data.match.id + '#/matches/delete';
            item.querySelector('.js-id').innerText = data.match.id;
            domP1.innerText = p1.user.tag + ', ' + p1.character.name + (p1.data.stocks ? ', ' + p1.data.stocks : '');
            p1.is_winner && (domP1.classList.add('winner'));
            domP2.innerText = p2.user.tag + ', ' + p2.character.name + (p2.data.stocks ? ', ' + p2.data.stocks : '');
            p2.is_winner && (domP2.classList.add('winner'));


            if (p3) {
              domP3.innerText = p3.user.tag + ', ' + p3.character.name + (p3.data.stocks ? ', ' + p3.data.stocks : '');
              p3.is_winner && (domP3.classList.add('winner'));
            }

            if (p4) {
              domP4.innerText = p4.user.tag + ', ' + p4.character.name + (p4.data.stocks ? ', ' + p4.data.stocks : '');
              p4.is_winner && (domP4.classList.add('winner'));

            }

            item.querySelector('.js-teams').innerText = data.match.is_team;
            item.querySelector('.js-stage').innerText = data.match.stage.name;
            item.querySelector('.js-date').innerText = data.match.date;

            frag.appendChild(item);
        });

        list.appendChild(frag);
    }

    /**
     * Render the pager
     * @param matches
     */
    function renderPager(matches) {
      var list = smack.dom$('.pagination');
      list.innerHTML = '';
      var frag = document.createDocumentFragment();
      var i = 0;

      var pages = Math.ceil(matches.total / pageSize);
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

    /**
     * Create a single pager button
     * @param text
     * @param page
     * @param state
     * @returns {ActiveX.IXMLDOMNode | Node}
     */
    function createPageItem(text, page, state) {
      var template = smack.dom$('#page-item');
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

}(window.smack, window.jQuery));
