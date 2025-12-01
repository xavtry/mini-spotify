// Glow animation on play button
const playBtn = document.getElementById('playBtn');

audio.addEventListener('play', () => {
  playBtn.classList.add('playing');
});
audio.addEventListener('pause', () => {
  playBtn.classList.remove('playing');
});

// Smooth progress bar animation
const progressBar = document.getElementById('progress');
let animationId;

function animateProgress() {
  progressBar.value = audio.currentTime;
  animationId = requestAnimationFrame(animateProgress);
}

audio.addEventListener('play', () => animateProgress());
audio.addEventListener('pause', () => cancelAnimationFrame(animationId));

// Background pulse effect
const player = document.querySelector('.player');
audio.addEventListener('play', () => {
  player.style.boxShadow = '0 10px 50px rgba(29, 185, 84, 0.6)';
});
audio.addEventListener('pause', () => {
  player.style.boxShadow = '0 10px 30px rgba(0,0,0,0.6)';
});
