// Spotify-like glow, pulse and smooth progress animations
const player = document.querySelector('.player');

audio.addEventListener('play', () => {
  playBtn.classList.add('playing');
  player.style.boxShadow = '0 10px 50px rgba(29, 185, 84, 0.6)';
  animateProgress();
});

audio.addEventListener('pause', () => {
  playBtn.classList.remove('playing');
  player.style.boxShadow = '0 10px 30px rgba(0,0,0,0.6)';
  cancelAnimationFrame(animationId);
});

let animationId;
function animateProgress() {
  progress.value = audio.currentTime;
  animationId = requestAnimationFrame(animateProgress);
}

// Optional: click on album art to toggle play/pause
document.querySelector('.album-art img').addEventListener('click', () => {
  playBtn.click();
});
