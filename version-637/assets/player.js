(function() {
  function initMoviePlayer(options) {
    var video = document.getElementById(options.videoId);
    var overlay = document.getElementById(options.overlayId);
    var button = document.getElementById(options.buttonId);
    var source = options.source;
    var hlsInstance = null;
    var prepared = false;

    if (!video || !overlay || !source) {
      return;
    }

    function prepare() {
      if (prepared) {
        return;
      }
      prepared = true;
      if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = source;
      } else if (window.Hls && window.Hls.isSupported()) {
        hlsInstance = new window.Hls({
          enableWorker: true,
          lowLatencyMode: true
        });
        hlsInstance.loadSource(source);
        hlsInstance.attachMedia(video);
      } else {
        video.src = source;
      }
    }

    function play() {
      prepare();
      overlay.classList.add('is-hidden');
      var promise = video.play();
      if (promise && typeof promise.catch === 'function') {
        promise.catch(function() {
          overlay.classList.remove('is-hidden');
        });
      }
    }

    overlay.addEventListener('click', play);
    if (button) {
      button.addEventListener('click', function(event) {
        event.stopPropagation();
        play();
      });
    }
    video.addEventListener('click', function() {
      if (!prepared) {
        play();
      }
    });
    video.addEventListener('play', function() {
      overlay.classList.add('is-hidden');
    });
    video.addEventListener('pause', function() {
      if (!video.currentTime) {
        overlay.classList.remove('is-hidden');
      }
    });
    window.addEventListener('beforeunload', function() {
      if (hlsInstance) {
        hlsInstance.destroy();
      }
    });
  }

  window.initMoviePlayer = initMoviePlayer;
}());
