import { H as Hls } from './hls-vendor.js';

function preparePlayer(shell) {
  var video = shell.querySelector('video[data-hls]');
  var button = shell.querySelector('[data-play-button]');
  var state = shell.querySelector('[data-player-state]');
  if (!video || !button) {
    return;
  }
  var source = video.getAttribute('data-hls');
  var initialized = false;
  var hlsInstance = null;

  function setState(message) {
    if (state) {
      state.textContent = message || '';
    }
  }

  function initSource() {
    if (initialized || !source) {
      return;
    }
    if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = source;
      initialized = true;
      return;
    }
    if (Hls && Hls.isSupported()) {
      hlsInstance = new Hls({
        enableWorker: true,
        lowLatencyMode: true,
        backBufferLength: 90
      });
      hlsInstance.loadSource(source);
      hlsInstance.attachMedia(video);
      hlsInstance.on(Hls.Events.ERROR, function (_, data) {
        if (data && data.fatal) {
          setState('视频加载遇到问题，请稍后重试。');
        }
      });
      initialized = true;
      return;
    }
    setState('此浏览器暂不支持播放。');
  }

  function playVideo() {
    initSource();
    shell.classList.add('is-started');
    setState('视频加载中…');
    var playPromise = video.play();
    if (playPromise && typeof playPromise.then === 'function') {
      playPromise.then(function () {
        setState('');
      }).catch(function () {
        setState('请再次点击播放。');
      });
    }
  }

  button.addEventListener('click', playVideo);
  video.addEventListener('click', function () {
    if (!initialized) {
      playVideo();
    }
  });
  window.addEventListener('beforeunload', function () {
    if (hlsInstance) {
      hlsInstance.destroy();
    }
  });
}

document.querySelectorAll('[data-player]').forEach(preparePlayer);
