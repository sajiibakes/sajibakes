/* === rewards.js — Saji Bakes Sweet Rewards — Mother's Day Special === */

document.addEventListener('DOMContentLoaded', () => {
  const OFFERS = [
    { text: 'Free "Happy Mother\'s Day" Topper with any cake order', emoji: '💐' },
    { text: 'Free Cupcake for Mom with any cake order', emoji: '🧁' },
    { text: 'Mother’s Day Combo (Cake + 2 Cupcakes Special Price)', emoji: '🎁' },
    { text: '10% OFF Mother\'s Day Special Cakes', emoji: '🎉' },
    { text: 'Free Message Card for Mom', emoji: '💌' },
  ];

  let selectedOffer = null;
  let isScratched = false;

  // Elements
  const step1 = document.getElementById('step-1');
  const step2 = document.getElementById('step-2');
  const step3 = document.getElementById('step-3');
  const step4 = document.getElementById('step-4');

  const rewardsForm = document.getElementById('rewards-form');
  const gotoScratch = document.getElementById('goto-scratch');
  const canvas = document.getElementById('scratch-canvas');
  const ctx = canvas.getContext('2d');
  const rewardText = document.getElementById('reward-text');
  const rewardEmoji = document.getElementById('reward-emoji');
  const finalRewardText = document.getElementById('final-reward-text');
  const displayName = document.getElementById('display-name');

  // Check Local Storage
  const savedReward = localStorage.getItem('saji_bakes_reward');
  const savedName = localStorage.getItem('saji_bakes_user');

  if (savedReward && savedName) {
    showFinalReward(savedName, savedReward);
  }

  // --- Step 1: Handle Form ---
  rewardsForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('user-name').value;
    const phone = document.getElementById('user-phone').value;

    localStorage.setItem('saji_bakes_user', name);
    localStorage.setItem('saji_bakes_phone', phone);
    
    // Select a random offer
    selectedOffer = OFFERS[Math.floor(Math.random() * OFFERS.length)];
    rewardText.innerText = selectedOffer.text;
    rewardEmoji.innerText = selectedOffer.emoji;

    // Transition to Step 2
    step1.classList.remove('active');
    step2.classList.add('active');
  });

  // --- Step 2: Handle Follow ---
  gotoScratch.addEventListener('click', () => {
    step2.classList.remove('active');
    step3.classList.add('active');
    initScratchCanvas();
  });

  // --- Step 3: Scratch Logic ---
  function initScratchCanvas() {
    // Fill the canvas with a solid "scratch" layer
    ctx.fillStyle = '#FFC6D9'; // Pastel Pink
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Add some "scratch here" text
    ctx.font = 'bold 20px Quicksand';
    ctx.fillStyle = '#FF9BBA';
    ctx.textAlign = 'center';
    ctx.fillText('SCRATCH HERE', canvas.width / 2, canvas.height / 2 + 10);
    
    // Create floral pattern / hearts
    ctx.font = '24px serif';
    ctx.fillText('🌸 🧁 🌸 🧁', canvas.width / 2, canvas.height / 2 + 50);

    let isDrawing = false;

    function scratch(e) {
      if (!isDrawing) return;
      
      const rect = canvas.getBoundingClientRect();
      const x = (e.clientX || e.touches[0].clientX) - rect.left;
      const y = (e.clientY || e.touches[0].clientY) - rect.top;

      ctx.globalCompositeOperation = 'destination-out';
      ctx.beginPath();
      ctx.arc(x, y, 30, 0, Math.PI * 2);
      ctx.fill();

      checkScratchPercentage();
    }

    const startDrawing = () => { isDrawing = true; };
    const stopDrawing = () => { isDrawing = false; };

    canvas.addEventListener('mousedown', startDrawing);
    canvas.addEventListener('touchstart', startDrawing);
    window.addEventListener('mouseup', stopDrawing);
    window.addEventListener('touchend', stopDrawing);

    canvas.addEventListener('mousemove', scratch);
    canvas.addEventListener('touchmove', (e) => {
      e.preventDefault(); // Stop scrolling while scratching
      scratch(e);
    });
  }

  function checkScratchPercentage() {
    if (isScratched) return;

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const pixels = imageData.data;
    let transparentPixels = 0;

    for (let i = 0; i < pixels.length; i += 4) {
      if (pixels[i + 3] === 0) {
        transparentPixels++;
      }
    }

    const percentage = (transparentPixels / (canvas.width * canvas.height)) * 100;

    if (percentage > 50) {
      isScratched = true;
      // Complete the reveal
      canvas.style.transition = 'opacity 1s ease';
      canvas.style.opacity = '0';
      
      setTimeout(() => {
        canvas.style.display = 'none';
        // Save to localStorage
        localStorage.setItem('saji_bakes_reward', selectedOffer.text);
        showFinalReward(localStorage.getItem('saji_bakes_user'), selectedOffer.text);
      }, 1000);
    }
  }

  function showFinalReward(name, reward) {
    displayName.innerText = name;
    finalRewardText.innerHTML = `<div style="font-size: 0.9rem; margin-bottom: 0.5rem; color: var(--color-mother-text);">Happy New Year 2083 & Mother's Day!</div> <div>${reward}</div>`;

    // Hide all steps, show step 4
    [step1, step2, step3].forEach(s => s.classList.remove('active'));
    step4.classList.add('active');
  }
});
