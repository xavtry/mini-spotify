// Small enhancement script — relies on window.MINISPOTIFY created in script.js
(function(){
  document.addEventListener('DOMContentLoaded', () => {
    const state = window.MINISPOTIFY;
    if (!state || !state.audio) return;

    const audio = state.audio;
    const { playBtn, mbPlay, progress, miniProgress, volume } = state.elements;
    let raf = null;

    // Add glow to play buttons when playing
    audio.addEventListener('play', () => {
      playBtn.classList && playBtn.classList.add('playing');
      mbPlay.classList && mbPlay.classList.add('playing');
      // subtle center card shadow pulse
      document.querySelector('.player-card').style.boxShadow = '0 20px 80px rgba(29,185,84,0.12)';
      // start smooth progress visual sync if needed
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(syncVisuals);
    });

    audio.addEventListener('pause', () => {
      playBtn.classList && playBtn.classList.remove('playing');
      mbPlay.classList && mbPlay.classList.remove('playing');
      document.querySelector('.player-card').style.boxShadow = '';
      cancelAnimationFrame(raf);
    });

    function syncVisuals(){
      // keep sliders visually in-sync in case of any drift
      if (audio.duration && isFinite(audio.duration)) {
        progress.value = Math.floor(audio.currentTime);
        miniProgress.value = Math.floor(audio.currentTime);
      }
      raf = requestAnimationFrame(syncVisuals);
    }

    // clickable album toggles play/pause (nice touch)
    const cover = document.querySelector('.cover img');
    if (cover) cover.addEventListener('click', () => {
      if (audio.paused) state.elements.play(); else state.elements.pause();
    });

    // subtle hover animation for playback buttons
    const buttons = document.querySelectorAll('.circle-btn, .play-btn, .icon-btn');
    buttons.forEach(b => {
      b.addEventListener('mouseenter', () => b.style.transform = 'translateY(-3px)');
      b.addEventListener('mouseleave', () => b.style.transform = '');
    });

    // ensure volume slider shows accent fill using CSS variable (simple visual)
    function updateVolumeFill() {
      const val = parseFloat(volume.value || 0);
      const pct = Math.round(val * 100);
      volume.style.background = `linear-gradient(90deg, ${getComputedStyle(document.documentElement).getPropertyValue('--accent') || '#1DB954'} ${pct}%, #2b2b2b ${pct}%)`;
    }
    volume.addEventListener('input', updateVolumeFill);
    updateVolumeFill();
  });
})();
