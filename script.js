// Core player functionality — no globals leaked
document.addEventListener('DOMContentLoaded', () => {
  const audio = document.getElementById('audio');

  // Elements
  const playBtn = document.getElementById('playBtn');
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');
  const shuffleBtn = document.getElementById('shuffleBtn');
  const repeatBtn = document.getElementById('repeatBtn');
  const likeBtn = document.getElementById('likeBtn');
  const progress = document.getElementById('progress');
  const curTime = document.getElementById('curTime');
  const durTime = document.getElementById('durTime');
  const volume = document.getElementById('volume');
  const muteBtn = document.getElementById('muteBtn');

  // bottom controls mirror
  const mbPlay = document.getElementById('mbPlay');
  const mbPrev = document.getElementById('mbPrev');
  const mbNext = document.getElementById('mbNext');
  const miniProgress = document.getElementById('miniProgress');
  const miniTime = document.getElementById('miniTime');
  const coverImg = document.getElementById('coverImg');
  const miniCover = document.getElementById('miniCover');

  // state
  let isPlaying = false;
  let isMuted = false;
  let wasPlayingBeforeSeek = false;
  let rafId = null;

  function formatTime(seconds){
    if (!isFinite(seconds)) return '0:00';
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s.toString().padStart(2,'0')}`;
  }

  // load metadata
  audio.addEventListener('loadedmetadata', () => {
    progress.max = Math.floor(audio.duration);
    miniProgress.max = Math.floor(audio.duration);
    durTime.textContent = formatTime(audio.duration);
    miniTime.textContent = `${formatTime(audio.currentTime)} / ${formatTime(audio.duration)}`;
  });

  // play / pause
  function play() {
    audio.play();
  }
  function pause() {
    audio.pause();
  }

  playBtn.addEventListener('click', () => {
    if (audio.paused) play(); else pause();
  });
  mbPlay.addEventListener('click', () => {
    if (audio.paused) play(); else pause();
  });

  audio.addEventListener('play', () => {
    isPlaying = true;
    playBtn.textContent = '⏸️';
    mbPlay.textContent = '⏸️';
    // start RAF progress updater
    cancelAnimationFrame(rafId);
    rafId = requestAnimationFrame(updateProgressRAF);
    // update mini cover
    miniCover.src = coverImg.src;
  });

  audio.addEventListener('pause', () => {
    isPlaying = false;
    playBtn.textContent = '▶️';
    mbPlay.textContent = '▶️';
    cancelAnimationFrame(rafId);
  });

  // progress and seeking
  function updateProgressRAF(){
    progress.value = Math.floor(audio.currentTime);
    miniProgress.value = Math.floor(audio.currentTime);
    curTime.textContent = formatTime(audio.currentTime);
    miniTime.textContent = `${formatTime(audio.currentTime)} / ${formatTime(audio.duration)}`;
    rafId = requestAnimationFrame(updateProgressRAF);
  }

  audio.addEventListener('timeupdate', () => {
    // keep in sync if RAF missed
    if (!isFinite(audio.duration)) return;
    progress.max = Math.floor(audio.duration);
    miniProgress.max = Math.floor(audio.duration);
  });

  // handle main progress input
  let seeking = false;
  progress.addEventListener('input', (e) => {
    seeking = true;
    curTime.textContent = formatTime(e.target.value);
    miniProgress.value = e.target.value;
  });
  progress.addEventListener('change', (e) => {
    audio.currentTime = e.target.value;
    seeking = false;
  });

  // handle mini progress
  miniProgress.addEventListener('input', (e) => {
    curTime.textContent = formatTime(e.target.value);
  });
  miniProgress.addEventListener('change', (e) => {
    audio.currentTime = e.target.value;
  });

  // prev / next (single track: restart or do nothing)
  prevBtn.addEventListener('click', () => {
    audio.currentTime = 0;
  });
  mbPrev.addEventListener('click', () => audio.currentTime = 0);

  nextBtn.addEventListener('click', () => {
    // single-track player: jump to end then stop
    audio.currentTime = audio.duration || 0;
    audio.pause();
  });
  mbNext.addEventListener('click', () => {
    audio.currentTime = audio.duration || 0;
    audio.pause();
  });

  // volume and mute
  volume.addEventListener('input', (e) => {
    audio.volume = parseFloat(e.target.value);
    if (audio.volume === 0) {
      muteBtn.textContent = '🔈';
      isMuted = true;
    } else {
      muteBtn.textContent = '🔊';
      isMuted = false;
    }
  });
  muteBtn.addEventListener('click', () => {
    if (!isMuted) {
      audio.dataset.prevVolume = audio.volume;
      audio.volume = 0;
      volume.value = 0;
      muteBtn.textContent = '🔈';
      isMuted = true;
    } else {
      const prev = parseFloat(audio.dataset.prevVolume || 0.8);
      audio.volume = prev;
      volume.value = prev;
      muteBtn.textContent = '🔊';
      isMuted = false;
    }
  });

  // like (cosmetic)
  likeBtn.addEventListener('click', () => {
    likeBtn.textContent = likeBtn.textContent === '♡' ? '♥' : '♡';
  });

  // keyboard space toggles play/pause (when not focused on input)
  document.addEventListener('keydown', (e) => {
    const active = document.activeElement;
    if (e.code === 'Space' && active.tagName !== 'INPUT' && active.tagName !== 'TEXTAREA') {
      e.preventDefault();
      if (audio.paused) play(); else pause();
    }
  });

  // set initial volume
  audio.volume = parseFloat(volume.value || 0.8);

  // expose for spotifyEffects.js via dataset to avoid globals
  window.MINISPOTIFY = window.MINISPOTIFY || {};
  window.MINISPOTIFY.audio = audio;
  window.MINISPOTIFY.elements = {
    playBtn, mbPlay, progress, miniProgress, volume, play: play, pause: pause
  };
});
