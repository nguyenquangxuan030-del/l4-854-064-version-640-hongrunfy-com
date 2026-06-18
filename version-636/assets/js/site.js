(function () {
    function ready(callback) {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', callback);
        } else {
            callback();
        }
    }

    function normalize(value) {
        return String(value || '').trim().toLowerCase();
    }

    function setupHeader() {
        var header = document.querySelector('[data-header]');
        var button = document.querySelector('[data-menu-button]');
        var panel = document.querySelector('[data-mobile-panel]');

        function updateHeader() {
            if (!header) {
                return;
            }
            header.classList.toggle('is-scrolled', window.scrollY > 16);
        }

        updateHeader();
        window.addEventListener('scroll', updateHeader, { passive: true });

        if (button && panel) {
            button.addEventListener('click', function () {
                var isOpen = panel.classList.toggle('is-open');
                document.body.classList.toggle('menu-open', isOpen);
                button.textContent = isOpen ? '×' : '☰';
            });
        }
    }

    function setupSearchForms() {
        var forms = document.querySelectorAll('[data-search-form]');
        forms.forEach(function (form) {
            form.addEventListener('submit', function (event) {
                event.preventDefault();
                var input = form.querySelector('input[name="q"]');
                var query = input ? input.value.trim() : '';
                var target = form.getAttribute('data-search-target') || 'search.html';
                if (query) {
                    window.location.href = target + '?q=' + encodeURIComponent(query);
                } else {
                    window.location.href = target;
                }
            });
        });
    }

    function setupHero() {
        var hero = document.querySelector('[data-hero]');
        if (!hero) {
            return;
        }
        var slides = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-slide]'));
        var dotBox = hero.querySelector('[data-hero-dots]');
        if (!slides.length || !dotBox) {
            return;
        }
        var current = 0;
        var dots = slides.map(function (_, index) {
            var dot = document.createElement('button');
            dot.type = 'button';
            dot.className = index === 0 ? 'hero-dot is-active' : 'hero-dot';
            dot.setAttribute('aria-label', '切换推荐影片 ' + (index + 1));
            dot.addEventListener('click', function () {
                show(index);
            });
            dotBox.appendChild(dot);
            return dot;
        });

        function show(index) {
            slides[current].classList.remove('is-active');
            dots[current].classList.remove('is-active');
            current = index;
            slides[current].classList.add('is-active');
            dots[current].classList.add('is-active');
        }

        window.setInterval(function () {
            show((current + 1) % slides.length);
        }, 5200);
    }

    function setupFilters() {
        var panel = document.querySelector('[data-filter-panel]');
        var list = document.querySelector('[data-filter-list]');
        if (!panel || !list) {
            return;
        }
        var input = panel.querySelector('[data-filter-input]');
        var year = panel.querySelector('[data-filter-year]');
        var type = panel.querySelector('[data-filter-type]');
        var category = panel.querySelector('[data-filter-category]');
        var count = panel.querySelector('[data-filter-count]');
        var items = Array.prototype.slice.call(list.children);
        var params = new URLSearchParams(window.location.search);
        var query = params.get('q') || '';

        if (input && query) {
            input.value = query;
        }

        function matches(item) {
            var text = normalize([
                item.getAttribute('data-title'),
                item.getAttribute('data-region'),
                item.getAttribute('data-type'),
                item.getAttribute('data-tags'),
                item.textContent
            ].join(' '));
            var queryValue = input ? normalize(input.value) : '';
            var yearValue = year ? normalize(year.value) : '';
            var typeValue = type ? normalize(type.value) : '';
            var categoryValue = category ? normalize(category.value) : '';
            var itemYear = normalize(item.getAttribute('data-year'));
            var itemType = normalize(item.getAttribute('data-type'));
            var itemCategory = normalize(item.getAttribute('data-category'));

            if (queryValue && text.indexOf(queryValue) === -1) {
                return false;
            }
            if (yearValue && itemYear.indexOf(yearValue) === -1) {
                return false;
            }
            if (typeValue && itemType.indexOf(typeValue) === -1) {
                return false;
            }
            if (categoryValue && itemCategory !== categoryValue) {
                return false;
            }
            return true;
        }

        function apply() {
            var visible = 0;
            items.forEach(function (item) {
                var ok = matches(item);
                item.classList.toggle('is-hidden', !ok);
                if (ok) {
                    visible += 1;
                }
            });
            if (count) {
                count.textContent = '显示 ' + visible + ' 部';
            }
        }

        [input, year, type, category].forEach(function (control) {
            if (control) {
                control.addEventListener('input', apply);
                control.addEventListener('change', apply);
            }
        });
        apply();
    }

    ready(function () {
        setupHeader();
        setupSearchForms();
        setupHero();
        setupFilters();
    });
}());
