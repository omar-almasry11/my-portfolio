// Progress Bar Logic
  const progressBar = document.getElementById('progressBar');
  const updateProgressBar = () => {
    const scrollTop = window.scrollY;
    const docHeight = document.body.scrollHeight - window.innerHeight;
    const progress = (scrollTop / docHeight) * 100;
    progressBar.style.width = progress + '%';
  };

  window.addEventListener('scroll', updateProgressBar);

 // Dark Mode Logic
const themeToggle = document.getElementById('themeToggle');
const savedTheme = localStorage.getItem('theme');
const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;

// Apply saved theme or default to system preference
if (savedTheme) {
  document.documentElement.classList.toggle('dark', savedTheme === 'dark');
} else {
  document.documentElement.classList.toggle('dark', prefersDarkMode);
}

// Toggle theme and save preference
themeToggle.addEventListener('click', () => {
  const isDarkMode = document.documentElement.classList.toggle('dark');
  localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
});

// Back to Top Button Logic
const backToTopButton = document.getElementById('back-to-top');

window.addEventListener('scroll', () => {
  if (window.scrollY > 300) {
    backToTopButton.classList.remove('hidden');
  } else {
    backToTopButton.classList.add('hidden');
  }
});

backToTopButton.addEventListener('click', () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth',
  });
});
