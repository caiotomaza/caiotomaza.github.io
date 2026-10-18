(() => {
  'use strict';
  const root = document.documentElement;
  const menu = document.querySelector('#menu');
  const menuToggle = document.querySelector('#menu-toggle');
  const menuIcon = document.querySelector('#menu-icon');
  const themeToggle = document.querySelector('#theme-toggle');
  const themeIcon = document.querySelector('#theme-icon');
  const year = document.querySelector('#year');
  if (year) year.textContent = String(new Date().getFullYear());

  const setTheme = (theme) => {
    root.setAttribute('data-theme', theme);
    if (themeIcon) themeIcon.setAttribute('href', theme === 'dark' ? '#i-sun' : '#i-moon');
    if (themeToggle) {
      themeToggle.setAttribute('aria-label', theme === 'dark' ? 'Ativar tema claro' : 'Ativar tema escuro');
      themeToggle.setAttribute('title', theme === 'dark' ? 'Ativar tema claro' : 'Ativar tema escuro');
    }
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', theme === 'dark' ? '#071713' : '#0b2c21');
  };
  let initialTheme = 'dark';
  try { const saved = localStorage.getItem('alece-portfolio-theme-v2'); if (saved === 'dark' || saved === 'light') initialTheme = saved; } catch (_) {}
  setTheme(initialTheme);
  themeToggle?.addEventListener('click', () => {
    const next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    setTheme(next);
    try { localStorage.setItem('alece-portfolio-theme-v2', next); } catch (_) {}
  });

  const closeMenu = () => {
    menu?.classList.remove('is-open');
    menuToggle?.setAttribute('aria-expanded', 'false');
    menuToggle?.setAttribute('aria-label', 'Abrir menu');
    menuIcon?.setAttribute('href', '#i-menu');
  };
  menuToggle?.addEventListener('click', () => {
    const opened = menu?.classList.toggle('is-open') ?? false;
    menuToggle.setAttribute('aria-expanded', String(opened));
    menuToggle.setAttribute('aria-label', opened ? 'Fechar menu' : 'Abrir menu');
    menuIcon?.setAttribute('href', opened ? '#i-close' : '#i-menu');
  });
  menu?.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenu));
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeMenu(); });
  document.addEventListener('click', e => { if (menu && menuToggle && !menu.contains(e.target) && !menuToggle.contains(e.target)) closeMenu(); });
  window.addEventListener('resize', () => { if (window.innerWidth > 960) closeMenu(); });
  const copyBtn = document.querySelector('#copy-commands');
  copyBtn?.addEventListener('click', async () => {
    const commands = 'bash scripts/bootstrap.sh\nbash scripts/deploy.sh\ndocker compose exec web python manage.py createsuperuser';
    try { await navigator.clipboard.writeText(commands); copyBtn.textContent = 'Copiado!'; }
    catch (_) { copyBtn.textContent = 'Selecione no bloco'; }
  });
})();
