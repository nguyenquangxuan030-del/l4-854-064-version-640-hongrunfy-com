(function () {
  function ready(callback) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', callback);
    } else {
      callback();
    }
  }

  function setupMenu() {
    var button = document.querySelector('[data-menu-button]');
    var panel = document.querySelector('[data-mobile-panel]');
    if (!button || !panel) {
      return;
    }
    button.addEventListener('click', function () {
      panel.classList.toggle('open');
    });
  }

  function setupHero() {
    var root = document.querySelector('[data-hero]');
    if (!root) {
      return;
    }
    var slides = Array.prototype.slice.call(root.querySelectorAll('[data-hero-slide]'));
    var dots = Array.prototype.slice.call(root.querySelectorAll('[data-hero-dot]'));
    if (!slides.length) {
      return;
    }
    var active = 0;
    function show(index) {
      active = (index + slides.length) % slides.length;
      slides.forEach(function (slide, i) {
        slide.classList.toggle('active', i === active);
      });
      dots.forEach(function (dot, i) {
        dot.classList.toggle('active', i === active);
      });
    }
    dots.forEach(function (dot, index) {
      dot.addEventListener('click', function () {
        show(index);
      });
    });
    window.setInterval(function () {
      show(active + 1);
    }, 5600);
  }

  function setupFilters() {
    var panels = Array.prototype.slice.call(document.querySelectorAll('.filter-panel'));
    panels.forEach(function (panel) {
      var scope = panel.parentElement || document;
      var searchInput = panel.querySelector('[data-filter-search]');
      var typeSelect = panel.querySelector('[data-filter-type]');
      var yearSelect = panel.querySelector('[data-filter-year]');
      var cards = Array.prototype.slice.call(scope.querySelectorAll('[data-movie-card]'));
      if (!cards.length) {
        cards = Array.prototype.slice.call(document.querySelectorAll('[data-movie-card]'));
      }
      function apply() {
        var keyword = (searchInput && searchInput.value ? searchInput.value : '').trim().toLowerCase();
        var typeValue = typeSelect && typeSelect.value ? typeSelect.value : '';
        var yearValue = yearSelect && yearSelect.value ? yearSelect.value : '';
        cards.forEach(function (card) {
          var title = (card.getAttribute('data-title') || '').toLowerCase();
          var region = (card.getAttribute('data-region') || '').toLowerCase();
          var type = card.getAttribute('data-type') || '';
          var genre = (card.getAttribute('data-genre') || '').toLowerCase();
          var year = card.getAttribute('data-year') || '';
          var textMatch = !keyword || title.indexOf(keyword) !== -1 || region.indexOf(keyword) !== -1 || genre.indexOf(keyword) !== -1 || year.indexOf(keyword) !== -1;
          var typeMatch = !typeValue || type.indexOf(typeValue) !== -1 || genre.indexOf(typeValue) !== -1;
          var yearMatch = !yearValue || year.indexOf(yearValue) !== -1;
          if (textMatch && typeMatch && yearMatch) {
            card.removeAttribute('hidden-by-filter');
          } else {
            card.setAttribute('hidden-by-filter', 'true');
          }
        });
      }
      [searchInput, typeSelect, yearSelect].forEach(function (element) {
        if (element) {
          element.addEventListener('input', apply);
          element.addEventListener('change', apply);
        }
      });
    });
  }

  ready(function () {
    setupMenu();
    setupHero();
    setupFilters();
  });
})();
