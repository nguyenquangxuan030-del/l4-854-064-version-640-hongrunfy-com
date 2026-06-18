(function () {
    function ready(callback) {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', callback);
        } else {
            callback();
        }
    }

    function setupPlayer(box) {
        var video = box.querySelector('video');
        var button = box.querySelector('[data-player-start]');
        var source = box.getAttribute('data-video-src');
        var poster = box.getAttribute('data-poster');
        var hlsInstance = null;
        var isLoaded = false;

        if (!video || !source) {
            return;
        }

        if (poster) {
            video.setAttribute('poster', poster);
        }

        function loadSource() {
            if (isLoaded) {
                return;
            }
            isLoaded = true;

            if (video.canPlayType('application/vnd.apple.mpegurl')) {
                video.src = source;
                return;
            }

            if (window.Hls && window.Hls.isSupported()) {
                hlsInstance = new window.Hls({
                    enableWorker: true,
                    lowLatencyMode: true,
                    backBufferLength: 90
                });
                hlsInstance.loadSource(source);
                hlsInstance.attachMedia(video);
                hlsInstance.on(window.Hls.Events.ERROR, function (_, data) {
                    if (data && data.fatal) {
                        hlsInstance.destroy();
                        hlsInstance = null;
                        video.src = source;
                    }
                });
                return;
            }

            video.src = source;
        }

        function play() {
            loadSource();
            var request = video.play();
            if (request && typeof request.catch === 'function') {
                request.catch(function () {});
            }
        }

        if (button) {
            button.addEventListener('click', play);
        }

        video.addEventListener('play', function () {
            box.classList.add('is-playing');
        });

        video.addEventListener('pause', function () {
            if (!video.ended) {
                box.classList.remove('is-playing');
            }
        });

        video.addEventListener('click', function () {
            if (video.paused) {
                play();
            }
        });

        video.addEventListener('loadedmetadata', function () {
            box.classList.add('is-ready');
        });
    }

    ready(function () {
        document.querySelectorAll('[data-player]').forEach(setupPlayer);
    });
}());
