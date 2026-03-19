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

// Syntax highlight (lightweight, no external deps)
document.querySelectorAll('pre code').forEach(block => {
  const lang = block.className.replace('lang-', '');
  if (!lang) return;

  let html = block.textContent
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

  if (lang === 'json') {
    html = html
      .replace(/(".*?")(\s*:)/g, '<span class="key">$1</span>$2')
      .replace(/:\s*(".*?")/g, ': <span class="str">$1</span>')
      .replace(/:\s*(\d+\.?\d*)/g, ': <span class="num">$1</span>')
      .replace(/:\s*(true|false|null)/g, ': <span class="kw">$1</span>');
  } else if (lang === 'python') {
    html = html
      .replace(/(#.*)/g, '<span class="cm">$1</span>')
      .replace(/\b(import|from|def|class|if|else|elif|while|for|in|return|True|False|None|and|or|not)\b/g, '<span class="kw">$1</span>')
      .replace(/(".*?"|'.*?')/g, '<span class="str">$1</span>')
      .replace(/\b(\d+\.?\d*)\b/g, '<span class="num">$1</span>');
  } else if (lang === 'bash') {
    html = html
      .replace(/(#.*)/g, '<span class="cm">$1</span>')
      .replace(/\b(curl|docker|cd|cat|echo|export|sudo|git)\b/g, '<span class="kw">$1</span>')
      .replace(/(".*?"|'.*?')/g, '<span class="str">$1</span>');
  } else if (lang === 'yaml') {
    html = html
      .replace(/(#.*)/g, '<span class="cm">$1</span>')
      .replace(/^(\s*[\w-]+):/gm, '<span class="key">$1</span>:')
      .replace(/:\s*(".*?"|'.*?')/g, ': <span class="str">$1</span>');
  } else if (lang === 'cpp') {
    html = html
      .replace(/(\/\/.*)/g, '<span class="cm">$1</span>')
      .replace(/\b(include|const|char|int|void|bool|while|if|else|setup|loop|new|delete|return|true|false)\b/g, '<span class="kw">$1</span>')
      .replace(/(".*?")/g, '<span class="str">$1</span>')
      .replace(/\b(\d+\.?\d*)\b/g, '<span class="num">$1</span>');
  }

  block.innerHTML = html;
});

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
