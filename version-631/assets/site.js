(function () {
  function qs(selector, root) {
    return (root || document).querySelector(selector);
  }

  function qsa(selector, root) {
    return Array.prototype.slice.call((root || document).querySelectorAll(selector));
  }

  var menuButton = qs('.menu-toggle');
  var mobilePanel = qs('.mobile-panel');

  if (menuButton && mobilePanel) {
    menuButton.addEventListener('click', function () {
      var opened = mobilePanel.classList.toggle('is-open');
      menuButton.setAttribute('aria-expanded', opened ? 'true' : 'false');
    });
  }

  qsa('img').forEach(function (img) {
    img.addEventListener('error', function () {
      img.style.display = 'none';
      var poster = img.closest('.poster');
      if (poster) {
        poster.classList.add('missing-image');
      }
    });
  });

  var slides = qsa('[data-hero-slide]');
  var dots = qsa('[data-hero-dot]');
  var prev = qs('[data-hero-prev]');
  var next = qs('[data-hero-next]');
  var current = 0;
  var timer = null;

  function showSlide(index) {
    if (!slides.length) {
      return;
    }
    current = (index + slides.length) % slides.length;
    slides.forEach(function (slide, i) {
      slide.classList.toggle('is-active', i === current);
    });
    dots.forEach(function (dot, i) {
      dot.classList.toggle('is-active', i === current);
    });
  }

  function restartHero() {
    if (timer) {
      window.clearInterval(timer);
    }
    if (slides.length > 1) {
      timer = window.setInterval(function () {
        showSlide(current + 1);
      }, 5200);
    }
  }

  if (slides.length) {
    showSlide(0);
    restartHero();
    if (prev) {
      prev.addEventListener('click', function () {
        showSlide(current - 1);
        restartHero();
      });
    }
    if (next) {
      next.addEventListener('click', function () {
        showSlide(current + 1);
        restartHero();
      });
    }
    dots.forEach(function (dot, i) {
      dot.addEventListener('click', function () {
        showSlide(i);
        restartHero();
      });
    });
  }

  var params = new URLSearchParams(window.location.search);
  var initialQuery = params.get('q') || '';
  var filterInput = qs('[data-filter-input]');
  var yearSelect = qs('[data-year-select]');
  var regionSelect = qs('[data-region-select]');
  var typeSelect = qs('[data-type-select]');

  if (filterInput && initialQuery) {
    filterInput.value = initialQuery;
  }

  function normalize(value) {
    return String(value || '').toLowerCase().trim();
  }

  function applyFilters() {
    var keyword = normalize(filterInput ? filterInput.value : '');
    var year = yearSelect ? yearSelect.value : '';
    var region = regionSelect ? regionSelect.value : '';
    var type = typeSelect ? typeSelect.value : '';

    qsa('[data-card]').forEach(function (card) {
      var text = normalize([
        card.getAttribute('data-title'),
        card.getAttribute('data-year'),
        card.getAttribute('data-region'),
        card.getAttribute('data-type'),
        card.getAttribute('data-tags'),
        card.textContent
      ].join(' '));
      var ok = true;
      if (keyword && text.indexOf(keyword) === -1) {
        ok = false;
      }
      if (year && card.getAttribute('data-year') !== year) {
        ok = false;
      }
      if (region && card.getAttribute('data-region') !== region) {
        ok = false;
      }
      if (type && card.getAttribute('data-type') !== type) {
        ok = false;
      }
      card.classList.toggle('is-hidden', !ok);
    });
  }

  [filterInput, yearSelect, regionSelect, typeSelect].forEach(function (control) {
    if (control) {
      control.addEventListener('input', applyFilters);
      control.addEventListener('change', applyFilters);
    }
  });

  if (filterInput || yearSelect || regionSelect || typeSelect) {
    applyFilters();
  }

  qsa('.player-shell[data-video]').forEach(function (box) {
    var video = qs('video', box);
    var button = qs('.play-button', box);
    var streamUrl = box.getAttribute('data-video');
    var prepared = false;
    var hlsInstance = null;

    function prepare() {
      if (prepared || !video || !streamUrl) {
        return;
      }
      prepared = true;
      if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = streamUrl;
      } else if (window.Hls && window.Hls.isSupported()) {
        hlsInstance = new window.Hls({
          enableWorker: true,
          lowLatencyMode: true
        });
        hlsInstance.loadSource(streamUrl);
        hlsInstance.attachMedia(video);
      } else {
        video.src = streamUrl;
      }
    }

    function play() {
      prepare();
      if (!video) {
        return;
      }
      var action = video.play();
      if (action && typeof action.catch === 'function') {
        action.catch(function () {
          box.classList.remove('is-playing');
        });
      }
      box.classList.add('is-playing');
    }

    if (button) {
      button.addEventListener('click', play);
    }
    if (video) {
      video.addEventListener('play', function () {
        box.classList.add('is-playing');
      });
      video.addEventListener('pause', function () {
        box.classList.remove('is-playing');
      });
      video.addEventListener('click', function () {
        if (video.paused) {
          play();
        }
      });
      window.addEventListener('beforeunload', function () {
        if (hlsInstance) {
          hlsInstance.destroy();
        }
      });
    }
  });
})();
