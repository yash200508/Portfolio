(() => {
  document.querySelectorAll('.print-document').forEach(button => {
    button.addEventListener('click', () => window.print());
  });
  const controls = document.querySelector('.project-controls');
  const projects = [...document.querySelectorAll('[data-project-category]')];
  if (controls && projects.length) {
    controls.hidden = false;
    controls.querySelectorAll('[data-filter]').forEach(button => {
      button.addEventListener('click', () => {
        const category = button.dataset.filter;
        let count = 0;
        projects.forEach(project => {
          project.hidden = category !== 'all' && project.dataset.projectCategory !== category;
          if (!project.hidden) count++;
        });
        controls.querySelectorAll('[data-filter]').forEach(item => {
          item.setAttribute('aria-pressed', String(item === button));
        });
        controls.querySelector('.filter-status').textContent = `${count} ${count === 1 ? 'project' : 'projects'}`;
      });
    });
  }
  const toggle = document.querySelector('.menu-toggle');
  const navigation = document.querySelector('#navigation');
  const closeMenu = () => {
    if (!toggle || !navigation) return;
    toggle.setAttribute('aria-expanded', 'false');
    navigation.classList.remove('is-open');
  };
  toggle?.addEventListener('click', () => {
    const open = toggle.getAttribute('aria-expanded') !== 'true';
    toggle.setAttribute('aria-expanded', String(open));
    navigation.classList.toggle('is-open', open);
  });
  navigation?.addEventListener('click', event => {
    if (event.target.closest('a')) closeMenu();
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && toggle?.getAttribute('aria-expanded') === 'true') {
      closeMenu();
      toggle.focus();
    }
  });
  const progress = document.querySelector('#scrollIndicator');
  let pending = false;
  const updateProgress = () => {
    const distance = document.documentElement.scrollHeight - window.innerHeight;
    if (progress) progress.style.width = `${distance > 0 ? Math.min(100, window.scrollY / distance * 100) : 0}%`;
    pending = false;
  };
  window.addEventListener('scroll', () => {
    if (!pending) { pending = true; requestAnimationFrame(updateProgress); }
  }, { passive: true });
  window.addEventListener('resize', updateProgress);
  updateProgress();
  if ('IntersectionObserver' in window) {
    const links = document.querySelectorAll('#navigation a');
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        links.forEach(link => {
          if (link.hash === `#${entry.target.id}`) link.setAttribute('aria-current', 'location');
          else link.removeAttribute('aria-current');
        });
      });
    }, { rootMargin: '-15% 0px -65% 0px' });
    document.querySelectorAll('main > section[id]').forEach(section => observer.observe(section));
  }
})();
