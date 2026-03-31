// JavaScript Entry Point

document.addEventListener('DOMContentLoaded', () => {
  console.log('Main logic loaded.');

  // 1. Generate hero slides dynamically if the hero-slider exists
  const sliderContainer = document.getElementById('hero-slider');
  if (sliderContainer && typeof sliderData !== 'undefined') {
    // Shuffle the slider data
    const shuffledSlider = [...sliderData].sort(() => Math.random() - 0.5);

    shuffledSlider.forEach((slide, index) => {
      const img = document.createElement('img');
      img.src = slide.src;
      img.alt = slide.alt;
      img.className = index === 0 ? 'slide active' : 'slide';
      sliderContainer.appendChild(img);
    });
  }

  // 2. Generate flavor cards for Home Page (limit 4, shuffle)
  const flavorGrid = document.getElementById('flavor-grid');
  if (flavorGrid && typeof flavorData !== 'undefined') {
    const shuffledFlavors = [...flavorData]
      .sort(() => Math.random() - 0.5)
      .slice(0, 4);

    renderFlavorCards(shuffledFlavors, flavorGrid);
  }

  // 3. Generate flavor cards for Menu Page (Full list)
  const menuFlavorGrid = document.getElementById('menu-flavor-grid');
  if (menuFlavorGrid && typeof flavorData !== 'undefined') {
    renderFlavorCards(flavorData, menuFlavorGrid);
  }

  // 4. Generate muffin cards for Menu Page (using flavorData for now)
  const muffinGrid = document.getElementById('muffin-grid');
  if (muffinGrid && typeof flavorData !== 'undefined') {
    renderFlavorCards(flavorData, muffinGrid);
  }

  // 5. Generate donut cards for Menu Page (using flavorData for now)
  const donutGrid = document.getElementById('donut-grid');
  if (donutGrid && typeof flavorData !== 'undefined') {
    renderFlavorCards(flavorData, donutGrid);
  }

  // Helper function to render cards
  function renderFlavorCards(data, container) {
    data.forEach((flavor, index) => {
      const delayClass = index % 4 !== 0 ? `delay-${index % 4}` : '';
      const cardHtml = `
        <div class="cupcake-card fade-in ${delayClass}">
          <div class="card-image">
            <img src="${flavor.src}" alt="${flavor.alt}" />
            <div class="card-hover">
              <a href="product.html" class="view-btn">Order</a>
            </div>
          </div>
          <h3><a href="product.html" style="text-decoration: underline; color: var(--color-text);">${flavor.title}</a></h3>
          <p>${flavor.price}</p>
        </div>
      `;
      container.insertAdjacentHTML('beforeend', cardHtml);
    });
  }

  // 6. Auto-playing hero Image slider logic
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
    }, 4000); 
  }
});
