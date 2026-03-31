// JavaScript Entry Point

document.addEventListener('DOMContentLoaded', () => {
  console.log('Main logic loaded.');

  // Auto-playing hero Image slider logic
  const slides = document.querySelectorAll('.slide');
  let currentSlide = 0;

  if (slides.length > 0) {
    setInterval(() => {
      // Fade out current
      slides[currentSlide].classList.remove('active');
      // Increment and wrap around
      currentSlide = (currentSlide + 1) % slides.length;
      // Fade in next
      slides[currentSlide].classList.add('active');
    }, 4000); // Switch slide every 4 seconds
  }
});
