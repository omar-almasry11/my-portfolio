// =============================
// 🌙 Dark Mode Optimization
// =============================
const themeToggle = document.getElementById('themeToggle');
const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
const savedTheme = localStorage.getItem('theme');

// Apply dark mode based on user preference or system settings
if (savedTheme) {
  document.documentElement.classList.toggle('dark', savedTheme === 'dark');
} else {
  document.documentElement.classList.toggle('dark', prefersDarkMode);
}

// Toggle theme and save preference
themeToggle?.addEventListener('click', () => {
  const isDarkMode = document.documentElement.classList.toggle('dark');
  localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
});


// =============================
// 📏 Progress Bar Optimization
// =============================
const progressBar = document.getElementById('progressBar');
let progressBarTicking = false;

function updateProgressBar() {
  if (!progressBarTicking) {
    requestAnimationFrame(() => {
      const scrollTop = window.scrollY;
      const docHeight = document.body.scrollHeight - window.innerHeight;
      // Clamp progress between 0% and 100%
      const progress = Math.min(Math.max(scrollTop / docHeight, 0), 1) * 100;
      progressBar.style.width = progress + '%';
      progressBarTicking = false;
    });
    progressBarTicking = true;
  }
}

// Use passive event listeners to improve scrolling performance
window.addEventListener('scroll', updateProgressBar, { passive: true });


// =============================
// ⬆️ Back to Top Button Optimization
// =============================
const backToTopButton = document.getElementById('back-to-top');
let backToTopTicking = false;

function checkScroll() {
  if (!backToTopTicking) {
    requestAnimationFrame(() => {
      if (window.scrollY > 300) {
        backToTopButton.classList.remove('hidden');
      } else {
        backToTopButton.classList.add('hidden');
      }
      backToTopTicking = false;
    });
    backToTopTicking = true;
  }
}

window.addEventListener('scroll', checkScroll, { passive: true });

backToTopButton?.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});