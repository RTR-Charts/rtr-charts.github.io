// ---------- Particle network background ----------
const canvas = document.getElementById('particle-canvas');
const ctx = canvas.getContext('2d');
let w, h, particles = [];
const reduceMotion = false;

function resize(){ w = canvas.width = window.innerWidth; h = canvas.height = window.innerHeight; }
resize();
window.addEventListener('resize', resize);

const COUNT = Math.min(85, Math.floor((window.innerWidth*window.innerHeight)/18000));
for(let i=0;i<COUNT;i++){
  particles.push({ x:Math.random()*w, y:Math.random()*h, vx:(Math.random()-0.5)*0.08, vy:(Math.random()-0.5)*0.08, r:Math.random()*1.5+0.5, alpha: Math.random()*0.4+0.35 });
}
function step(){
  ctx.clearRect(0,0,w,h);
  for(const p of particles){ p.x += p.vx; p.y += p.vy; if(p.x<0||p.x>w) p.vx*=-1; if(p.y<0||p.y>h) p.vy*=-1; }
  for(let i=0;i<particles.length;i++){
    for(let j=i+1;j<particles.length;j++){
      const a=particles[i], b=particles[j];
      const dx=a.x-b.x, dy=a.y-b.y; const dist=Math.sqrt(dx*dx+dy*dy);
      if(dist<80){ ctx.strokeStyle = `rgba(255,210,31,${0.08*(1-dist/80)})`; ctx.lineWidth=1; ctx.beginPath(); ctx.moveTo(a.x,a.y); ctx.lineTo(b.x,b.y); ctx.stroke(); }
    }
  }
  for(const p of particles){ ctx.beginPath(); ctx.arc(p.x,p.y,p.r,0,Math.PI*2); ctx.fillStyle=`rgba(255,210,31,${p.alpha})`; ctx.shadowColor = 'rgba(255,193,7,0.8)'; ctx.shadowBlur = 3.5; ctx.fill(); }
  ctx.shadowBlur = 0;
  if(!reduceMotion) requestAnimationFrame(step);
}
step();

// ---------- Scroll reveal ----------
const io = new IntersectionObserver((entries)=>{
  entries.forEach(e=>{ if(e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target); } });
}, {threshold:0.12});
document.querySelectorAll('.reveal').forEach(el=>io.observe(el));

// ---------- Founder modal ----------
const founderOverlay = document.getElementById('founderOverlay');
function openFounder(){ founderOverlay.classList.add('open'); }
function closeFounder(){ founderOverlay.classList.remove('open'); }
founderOverlay.addEventListener('click', (e)=>{ if(e.target===founderOverlay) closeFounder(); });
const regionNotice = document.getElementById('regionNotice');
function showRegionNotice(){ regionNotice.classList.add('open'); }
function closeRegionNotice(){ regionNotice.classList.remove('open'); }
regionNotice.addEventListener('click', (e)=>{ if(e.target===regionNotice) closeRegionNotice(); });
document.addEventListener('keydown', (e)=>{ if(e.key==='Escape') closeFounder(); });
document.addEventListener('keydown', (e)=>{ if(e.key==='Escape') closeRegionNotice(); });

// ---------- Chart carousel ----------
let ccIndex = 0;
const ccTrack = document.getElementById('ccTrack');
const ccDots = document.querySelectorAll('.cc-dot');
function chartRender(){
  ccTrack.style.transform = `translateX(-${ccIndex*100}%)`;
  ccDots.forEach((d,i)=>d.classList.toggle('active', i===ccIndex));
}
function chartNext(){ ccIndex = (ccIndex+1)%3; chartRender(); }
function chartPrev(){ ccIndex = (ccIndex+2)%3; chartRender(); }
function chartGo(i){ ccIndex = i; chartRender(); }
setInterval(()=>{ if(!reduceMotion) chartNext(); }, 5000);

// ---------- Product toggle (Indicator / Algo detail sections) ----------
const productPill = document.getElementById('productTogglePill');
const prodTabInd = document.getElementById('prodTabInd');
const prodTabAlgo = document.getElementById('prodTabAlgo');
const prodInd = document.getElementById('prodInd');
const prodAlgo = document.getElementById('prodAlgo');
function switchProductTab(idx){
  productPill.setAttribute('data-active', idx);
  prodTabInd.classList.toggle('active', idx===0);
  prodTabAlgo.classList.toggle('active', idx===1);
  prodInd.classList.toggle('hidden', idx!==0);
  prodAlgo.classList.toggle('hidden', idx!==1);
}

// ---------- Pricing toggle (Indicator Plans / Algo Plans) ----------
const priceGrid = document.getElementById('priceGrid');
const pill = document.getElementById('togglePill');
const tabInd = document.getElementById('tabInd');
const tabAlgo = document.getElementById('tabAlgo');

const dataSets = [
  {
    yearly:{p1:['$49',''], d1:'Access for 6 Months', p2:['$129',''], d2:'Access for Lifetime'}
  },
  {
    yearly:{p1:['$49',''], d1:'Access for 6 Months', p2:['$129',''], d2:'Access for Lifetime'}
  }
];

function updatePrices(){
  const d = dataSets[Number(pill.getAttribute('data-active') || 0)].yearly;
  ['1','2'].forEach((id)=>{
    document.getElementById(`p${id}`).textContent = d[`p${id}`][0];
    document.getElementById(`d${id}`).textContent = d[`d${id}`];
  });
}

function switchTab(idx){
  pill.setAttribute('data-active', idx);
  tabInd.classList.toggle('active', idx===0);
  tabAlgo.classList.toggle('active', idx===1);
  priceGrid.classList.add('fading');
  setTimeout(()=>{
    updatePrices();
    priceGrid.classList.remove('fading');
  }, 220);
}

// ---------- FAQ toggle tabs ----------
const faqPill = document.getElementById('faqTogglePill');
const faqTabInd = document.getElementById('faqTabInd');
const faqTabAlgo = document.getElementById('faqTabAlgo');
const faqListInd = document.getElementById('faqListInd');
const faqListAlgo = document.getElementById('faqListAlgo');
function switchFaqTab(idx){
  faqPill.setAttribute('data-active', idx);
  faqTabInd.classList.toggle('active', idx===0);
  faqTabAlgo.classList.toggle('active', idx===1);
  faqListInd.classList.toggle('hidden', idx!==0);
  faqListAlgo.classList.toggle('hidden', idx!==1);
}

// ---------- FAQ accordion ----------
function toggleFaq(btn){
  const item = btn.parentElement;
  const wasOpen = item.classList.contains('open');
  item.parentElement.querySelectorAll('.faq-item').forEach(i=>{
    i.classList.remove('open');
    i.querySelector('.faq-q').setAttribute('aria-expanded','false');
  });
  if(!wasOpen){
    item.classList.add('open');
    btn.setAttribute('aria-expanded','true');
  }
}

// ---------- FAQ Load More ----------
function loadMoreFaq(){
  document.querySelectorAll('.faq-list:not(.hidden) .hidden-faq').forEach(el=>el.classList.remove('hidden-faq'));
}

// ---------- Review lightbox ----------
function openReviewImage(src){
  const lightbox = document.getElementById('reviewLightbox');
  const image = document.getElementById('reviewLightboxImage');
  image.src = src;
  image.alt = 'Customer review image';
  lightbox.classList.add('open');
  lightbox.setAttribute('aria-hidden', 'false');
}

function closeReviewImage(){
  const lightbox = document.getElementById('reviewLightbox');
  lightbox.classList.remove('open');
  lightbox.setAttribute('aria-hidden', 'true');
}

document.addEventListener('keydown', (event)=>{
  if(event.key === 'Escape'){
    closeReviewImage();
    setMenu(false);
  }
});

// ---------- Navigation menu and color theme ----------
const menuToggle = document.getElementById('menuToggle');
const navLinks = document.getElementById('navLinks');
const themeToggle = document.getElementById('themeToggle');

function setMenu(open){
  menuToggle.classList.toggle('open', open);
  navLinks.classList.toggle('open', open);
  menuToggle.setAttribute('aria-expanded', String(open));
  menuToggle.setAttribute('aria-label', open ? 'Close navigation menu' : 'Open navigation menu');
}

menuToggle.addEventListener('click', ()=>setMenu(!navLinks.classList.contains('open')));
navLinks.querySelectorAll('a').forEach(link=>link.addEventListener('click', ()=>setMenu(false)));

function setTheme(theme){
  const isLight = theme === 'light';
  document.documentElement.setAttribute('data-theme', isLight ? 'light' : 'dark');
  themeToggle.setAttribute('aria-pressed', String(isLight));
  themeToggle.setAttribute('aria-label', isLight ? 'Switch to dark theme' : 'Switch to light theme');
  themeToggle.querySelector('.theme-icon').textContent = isLight ? '☾' : '☼';
  localStorage.setItem('rtrcharts-theme', isLight ? 'light' : 'dark');
}

const savedTheme = localStorage.getItem('rtrcharts-theme');
setTheme(savedTheme === 'light' ? 'light' : 'dark');
themeToggle.addEventListener('click', ()=>{
  const nextTheme = document.documentElement.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
  setTheme(nextTheme);
});

document.addEventListener('keydown', (event)=>{
  if(event.key === 'Escape') setMenu(false);
});
window.addEventListener('resize', ()=>{
  if(window.innerWidth > 880) setMenu(false);
});

// ---------- Active navigation and page loading ----------
function hidePageLoader(){ document.body.classList.add('loaded'); }
window.addEventListener('DOMContentLoaded', hidePageLoader, {once:true});
window.addEventListener('load', hidePageLoader, {once:true});
setTimeout(hidePageLoader, 1200);

const navTargets = [...document.querySelectorAll('.nav-link')]
  .map(link=>{
    const href = link.getAttribute('href');
    if(!href || href === '#') return null;
    return {link, section:document.querySelector(href)};
  })
  .filter(item=>item && item.section);
const navObserver = new IntersectionObserver((entries)=>{
  entries.forEach(entry=>{
    if(!entry.isIntersecting) return;
    navTargets.forEach(item=>item.link.classList.toggle('active', item.section === entry.target));
  });
}, {rootMargin:'-35% 0px -55% 0px', threshold:0});
navTargets.forEach(item=>navObserver.observe(item.section));
document.querySelectorAll('.faq-q').forEach(button=>button.setAttribute('aria-expanded','false'));

function openLegalFromHash(){
  const legalItem = document.getElementById(window.location.hash.slice(1));
  if(legalItem && legalItem.matches('details')) legalItem.open = true;
}
window.addEventListener('hashchange', openLegalFromHash);
openLegalFromHash();
