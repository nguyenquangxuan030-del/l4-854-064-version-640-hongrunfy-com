(function () {
  var toggle = document.querySelector('[data-menu-toggle]');
  var nav = document.querySelector('[data-mobile-nav]');

  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      nav.classList.toggle('is-open');
    });
  }

  var scopes = document.querySelectorAll('[data-filter-scope]');

  scopes.forEach(function (scope) {
    var search = scope.querySelector('[data-filter-search]');
    var type = scope.querySelector('[data-filter-type]');
    var year = scope.querySelector('[data-filter-year]');
    var cards = Array.prototype.slice.call(scope.querySelectorAll('[data-movie-card]'));
    var empty = scope.querySelector('[data-no-results]');

    function valueOf(node) {
      return node ? node.value.trim().toLowerCase() : '';
    }

    function applyFilter() {
      var query = valueOf(search);
      var selectedType = valueOf(type);
      var selectedYear = valueOf(year);
      var visible = 0;

      cards.forEach(function (card) {
        var text = [
          card.getAttribute('data-title'),
          card.getAttribute('data-region'),
          card.getAttribute('data-type'),
          card.getAttribute('data-year'),
          card.getAttribute('data-tags'),
          card.textContent
        ].join(' ').toLowerCase();
        var cardType = (card.getAttribute('data-type') || '').toLowerCase();
        var cardYear = (card.getAttribute('data-year') || '').toLowerCase();
        var matched = true;

        if (query && text.indexOf(query) === -1) {
          matched = false;
        }

        if (selectedType && cardType !== selectedType) {
          matched = false;
        }

        if (selectedYear && cardYear !== selectedYear) {
          matched = false;
        }

        card.classList.toggle('is-hidden', !matched);

        if (matched) {
          visible += 1;
        }
      });

      if (empty) {
        empty.classList.toggle('is-visible', visible === 0);
      }
    }

    [search, type, year].forEach(function (node) {
      if (node) {
        node.addEventListener('input', applyFilter);
        node.addEventListener('change', applyFilter);
      }
    });
  });
})();
