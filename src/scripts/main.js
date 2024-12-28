//Dark Mode
const themeToggle = document.getElementById('themeToggle');
  const htmlElement = document.documentElement;

  themeToggle.addEventListener('click', () => {
    htmlElement.classList.toggle('dark');
  });

  // Progress Bar Logic
  const progressBar = document.getElementById('progressBar');
  const updateProgressBar = () => {
    const scrollTop = window.scrollY;
    const docHeight = document.body.scrollHeight - window.innerHeight;
    const progress = (scrollTop / docHeight) * 100;
    progressBar.style.width = progress + '%';
  };

  window.addEventListener('scroll', updateProgressBar);