(function() {
  var menuButton = document.querySelector('[data-mobile-menu-button]');
  var mobileMenu = document.querySelector('[data-mobile-menu]');

  if (menuButton && mobileMenu) {
    menuButton.addEventListener('click', function() {
      mobileMenu.classList.toggle('is-open');
    });
  }

  var hero = document.querySelector('[data-hero]');
  if (hero) {
    var slides = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-slide]'));
    var dots = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-dot]'));
    var current = 0;
    var timer = null;

    function showSlide(index) {
      if (!slides.length) {
        return;
      }
      current = (index + slides.length) % slides.length;
      slides.forEach(function(slide, slideIndex) {
        slide.classList.toggle('is-active', slideIndex === current);
      });
      dots.forEach(function(dot, dotIndex) {
        dot.classList.toggle('is-active', dotIndex === current);
      });
    }

    function startTimer() {
      timer = window.setInterval(function() {
        showSlide(current + 1);
      }, 5200);
    }

    dots.forEach(function(dot, index) {
      dot.addEventListener('click', function() {
        window.clearInterval(timer);
        showSlide(index);
        startTimer();
      });
    });

    startTimer();
  }

  var lists = Array.prototype.slice.call(document.querySelectorAll('[data-card-list]'));
  if (!lists.length) {
    return;
  }

  var input = document.querySelector('[data-filter-input]');
  var typeFilter = document.querySelector('[data-type-filter]');
  var yearFilter = document.querySelector('[data-year-filter]');
  var categoryFilter = document.querySelector('[data-category-filter]');
  var emptyState = document.querySelector('[data-empty-state]');
  var chips = Array.prototype.slice.call(document.querySelectorAll('[data-filter-chip]'));

  function includesValue(value, query) {
    return String(value || '').toLowerCase().indexOf(query) !== -1;
  }

  function activeCategory() {
    var selectedChip = chips.find(function(chip) {
      return chip.classList.contains('is-active');
    });
    if (selectedChip) {
      return selectedChip.getAttribute('data-filter-chip') || '';
    }
    return categoryFilter ? categoryFilter.value : '';
  }

  function applyFilters() {
    var query = input ? input.value.trim().toLowerCase() : '';
    var typeValue = typeFilter ? typeFilter.value : '';
    var yearValue = yearFilter ? yearFilter.value : '';
    var categoryValue = activeCategory();
    var visible = 0;

    lists.forEach(function(list) {
      Array.prototype.slice.call(list.querySelectorAll('[data-movie-card]')).forEach(function(card) {
        var haystack = [
          card.getAttribute('data-title'),
          card.getAttribute('data-tags'),
          card.getAttribute('data-region'),
          card.getAttribute('data-type'),
          card.getAttribute('data-year')
        ].join(' ').toLowerCase();
        var matchQuery = !query || haystack.indexOf(query) !== -1;
        var matchType = !typeValue || includesValue(card.getAttribute('data-type'), typeValue);
        var matchYear = !yearValue || card.getAttribute('data-year') === yearValue;
        var matchCategory = !categoryValue || card.getAttribute('data-category') === categoryValue;
        var show = matchQuery && matchType && matchYear && matchCategory;
        card.style.display = show ? '' : 'none';
        if (show) {
          visible += 1;
        }
      });
    });

    if (emptyState) {
      emptyState.classList.toggle('is-visible', visible === 0);
    }
  }

  [input, typeFilter, yearFilter, categoryFilter].forEach(function(control) {
    if (control) {
      control.addEventListener('input', applyFilters);
      control.addEventListener('change', applyFilters);
    }
  });

  chips.forEach(function(chip) {
    chip.addEventListener('click', function() {
      chips.forEach(function(item) {
        item.classList.remove('is-active');
      });
      chip.classList.add('is-active');
      if (categoryFilter) {
        categoryFilter.value = chip.getAttribute('data-filter-chip') || '';
      }
      applyFilters();
    });
  });

  applyFilters();
}());
