// Active nav link on scroll
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-link');

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navLinks.forEach(l => l.classList.remove('active'));
      const link = document.querySelector(`.nav-link[href="#${entry.target.id}"]`);
      if (link) link.classList.add('active');
    }
  });
}, { rootMargin: '-20% 0px -70% 0px' });

sections.forEach(s => observer.observe(s));

// Smooth scroll
function setActive(el) {
  navLinks.forEach(l => l.classList.remove('active'));
  el.classList.add('active');
}

// Mobile sidebar
function toggleSidebar() {
  document.getElementById('sidebar').classList.toggle('open');
}
document.addEventListener('click', (e) => {
  const sidebar = document.getElementById('sidebar');
  if (sidebar.classList.contains('open') &&
      !sidebar.contains(e.target) &&
      !e.target.closest('.mobile-toggle')) {
    sidebar.classList.remove('open');
  }
});

// Search
function searchDocs(query) {
  const q = query.toLowerCase().trim();
  navLinks.forEach(link => {
    const text = link.textContent.toLowerCase();
    const sectionId = link.getAttribute('href')?.slice(1);
    const section = sectionId ? document.getElementById(sectionId) : null;
    const sectionText = section ? section.textContent.toLowerCase() : '';
    link.classList.toggle('hidden', q.length > 0 && !text.includes(q) && !sectionText.includes(q));
  });
}

// Syntax highlight via Prism (loaded in HTML head)

// Copy button on hover over code blocks
document.querySelectorAll('pre').forEach(pre => {
  const btn = document.createElement('button');
  btn.textContent = 'Copy';
  btn.style.cssText = `
    position:absolute; top:8px; right:8px; padding:3px 10px;
    background:rgba(59,130,246,.15); border:1px solid rgba(59,130,246,.25);
    color:#60a5fa; font-size:11px; font-weight:600; border-radius:5px;
    cursor:pointer; opacity:0; transition:opacity .15s; font-family:inherit;
  `;
  btn.onclick = () => {
    const code = pre.querySelector('code');
    navigator.clipboard.writeText(code.textContent).then(() => {
      btn.textContent = 'Copied!';
      setTimeout(() => btn.textContent = 'Copy', 1500);
    });
  };
  pre.addEventListener('mouseenter', () => btn.style.opacity = '1');
  pre.addEventListener('mouseleave', () => btn.style.opacity = '0');
  pre.appendChild(btn);
});
