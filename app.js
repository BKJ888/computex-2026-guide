const $ = (s, r=document) => r.querySelector(s);
const $$ = (s, r=document) => [...r.querySelectorAll(s)];
const routes = window.routes || [];
const keynotes = window.keynotes || [];
const analystRoute = window.analystRoute || {};
const vendors = routes.flatMap(route => route.venues.map((v, i) => ({...v, routeId: route.id, routeTitle: route.title, routeColor: route.color, idx: `${route.id}-${i}`})));
let currentRoute = routes[0]?.id;
let routeTab = 'flow';
let vendorFilter = 'all';
let saved = JSON.parse(localStorage.getItem('computexSaved') || '[]');

function saveStore(){ localStorage.setItem('computexSaved', JSON.stringify(saved)); }
function isSaved(id){ return saved.includes(id); }
function toggleSave(id){ saved = isSaved(id) ? saved.filter(x=>x!==id) : [...saved,id]; saveStore(); renderAll(false); }
function esc(s=''){ return String(s).replace(/[&<>"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c])); }
function view(name){ $$('.view').forEach(v=>v.classList.toggle('show', v.id===name)); $$('.nav').forEach(n=>n.classList.toggle('active', n.dataset.view===name)); window.scrollTo({top:0,behavior:'smooth'}); }

function renderHome(){
  $('#mVendors').textContent = vendors.length;
  $('#mKeynotes').textContent = keynotes.length;
  $('#home').innerHTML = `
    <div class="section-title"><div><h2>網站互動設計</h2><p>這版不是單純文章頁，而是可以讓主管點、查、篩、收藏的觀展工具。</p></div></div>
    <div class="grid cols-3">
      ${[
        ['01','路線入口','5 大主題路線卡片，點進去看完整行走流程與廠商詳情。'],
        ['02','搜尋廠商','可用公司名、展區、主題關鍵字搜尋，快速定位攤位與提問。'],
        ['03','收藏清單','把想看的廠商加入 Saved，變成自己的觀展清單。'],
        ['04','Keynote 時間軸','將 CEO Keynote 變成橫向資訊卡與時間序。'],
        ['05','分析師模式','用訊號捕捉角度整理每日行程與必追數據。'],
        ['06','GitHub Pages Ready','純 HTML/CSS/JS，不需要 React 編譯，可直接部署。'],
      ].map(x=>`<article class="card"><span class="pill">${x[0]}</span><h3>${x[1]}</h3><p>${x[2]}</p></article>`).join('')}
    </div>
    <div class="section-title"><div><h2>CEO Keynotes</h2><p>可作為首頁上方快速資訊模組。</p></div></div>
    <div class="grid cols-3">${keynotes.map(k=>`<article class="card" style="border-color:${k.color}55"><span class="pill" style="color:${k.color};border-color:${k.color}55">${esc(k.time)}</span><h3>${esc(k.speaker)} · ${esc(k.company)}</h3><p>${esc(k.topic)}<br><small>${esc(k.venue)}</small></p></article>`).join('')}</div>`;
}

function renderRoutes(){
  const active = routes.find(r=>r.id===currentRoute) || routes[0];
  $('#routes').innerHTML = `
    <div class="section-title"><div><h2>5 大議題路線</h2><p>點選不同路線，右側內容會切換為流程、廠商或提問清單。</p></div></div>
    <div class="grid cols-3">${routes.map(r=>`<article class="card route-card" data-route="${r.id}" style="--route:${r.color}66"><div class="emoji">${r.emoji}</div><h3>${esc(r.title)}</h3><p>${esc(r.subtitle)}</p><span class="pill">${r.venues.length} 個展區/廠商</span></article>`).join('')}</div>
    ${active ? `<div class="route-detail" style="border-color:${active.color}55"><h2>${active.emoji} ${esc(active.title)}</h2><p>${esc(active.subtitle)}</p><div class="grid cols-2"><div class="list-item"><b style="color:${active.color}">PM 視角</b><br>${esc(active.pm)}</div><div class="list-item"><b style="color:${active.accent}">數據分析師視角</b><br>${esc(active.da)}</div></div><div class="tabs"><button class="chip tab ${routeTab==='flow'?'active':''}" data-tab="flow">行走流程</button><button class="chip tab ${routeTab==='vendors'?'active':''}" data-tab="vendors">廠商詳情</button><button class="chip tab ${routeTab==='questions'?'active':''}" data-tab="questions">問題清單</button></div><div>${routeTabContent(active)}</div></div>` : ''}`;
  $$('.route-card').forEach(el=>el.onclick=()=>{currentRoute=el.dataset.route; routeTab='flow'; renderRoutes();});
  $$('.tab').forEach(el=>el.onclick=()=>{routeTab=el.dataset.tab; renderRoutes();});
}
function routeTabContent(r){
  if(routeTab==='flow') return `<div class="timeline">${r.flow.map(f=>`<div class="time-item"><div class="time">${esc(f.step)}</div><b>${esc(f.action)}</b></div>`).join('')}</div>`;
  if(routeTab==='vendors') return `<div class="grid cols-2">${r.venues.map(v=>vendorCard(v, false)).join('')}</div>`;
  return `<div class="list">${r.venues.map(v=>`<div class="list-item"><b>${esc(v.name)}</b>${v.questions.map((q,i)=>`<div style="margin-top:8px;color:#aeb5c8">${i+1}. ${esc(q)}</div>`).join('')}</div>`).join('')}</div>`;
}
function vendorCard(v, showRoute=true){
  return `<article class="card vendor-card"><div class="vendor-head"><div><div class="vendor-name">${esc(v.name)}</div>${showRoute?`<div class="vendor-meta">${esc(v.routeTitle || '')}</div>`:''}<div class="vendor-meta">${esc(v.hall)}${v.booth?`<br>攤位：${esc(v.booth)}`:''}</div></div><button class="smallbtn save ${isSaved(v.idx)?'active':''}" data-save="${v.idx}">${isSaved(v.idx)?'已收藏':'收藏'}</button></div><p>${esc(v.why).slice(0,120)}...</p><button class="smallbtn" data-open="${v.idx}">查看展示與問題</button></article>`;
}
function renderVendors(){
  const q = ($('#vendorSearch')?.value || '').trim().toLowerCase();
  const halls = ['all', ...new Set(vendors.map(v=>v.routeId))];
  const filtered = vendors.filter(v => (vendorFilter==='all'||v.routeId===vendorFilter) && (`${v.name} ${v.hall} ${v.booth} ${v.why} ${v.demos?.join(' ')}`.toLowerCase().includes(q)));
  $('#vendors').innerHTML = `<div class="section-title"><div><h2>廠商搜尋與篩選</h2><p>輸入 NVIDIA、液冷、AI PC、機器人、CPO、南港等關鍵字都可以找。</p></div></div><div class="toolbar"><input id="vendorSearch" class="search" placeholder="搜尋廠商、展區、技術關鍵字..." value="${esc(q)}">${halls.map(h=>`<button class="chip ${vendorFilter===h?'active':''}" data-filter="${h}">${h==='all'?'全部':esc(routes.find(r=>r.id===h)?.emoji || '')+' '+esc(routes.find(r=>r.id===h)?.title.replace(/^路線.：/,'') || h)}</button>`).join('')}</div><div class="grid cols-3">${filtered.map(v=>vendorCard(v)).join('') || `<div class="empty">找不到符合的結果，換個關鍵字試試。</div>`}</div>`;
  $('#vendorSearch').oninput = renderVendors;
  $$('[data-filter]').forEach(b=>b.onclick=()=>{vendorFilter=b.dataset.filter; renderVendors();});
  bindCards();
}
function renderTimeline(){
  $('#timeline').innerHTML = `<div class="section-title"><div><h2>Keynote 時間軸</h2><p>適合放在首頁第二屏，讓主管快速看到今年重點人物與主題。</p></div></div><div class="timeline">${keynotes.map(k=>`<div class="time-item" style="border-color:${k.color}55"><div class="time" style="color:${k.color}">${esc(k.time)}</div><h3>${esc(k.speaker)} · ${esc(k.company)}</h3><p>${esc(k.topic)}<br><small>${esc(k.venue)}</small></p></div>`).join('')}</div>`;
}
function renderAnalyst(){
  $('#analyst').innerHTML = `<div class="section-title"><div><h2>${esc(analystRoute.title || 'Analyst Mode')}</h2><p>${esc(analystRoute.description || '')}</p></div><button class="primary" onclick="window.print()">列印觀展筆記</button></div><div class="grid cols-2">${(analystRoute.schedule||[]).map(day=>`<article class="card"><h3>${esc(day.day)}</h3>${day.items.map(it=>`<div class="list-item"><span class="time">${esc(it.time)}</span><br><b>${esc(it.event)}</b><p>${esc(it.note)}</p></div>`).join('')}</article>`).join('')}</div><div class="section-title"><div><h2>必追關鍵指標</h2><p>可轉成報告或會後簡報的追蹤欄位。</p></div></div><div class="grid cols-2">${(analystRoute.metrics||[]).map((m,i)=>`<div class="list-item map-row"><b>Metric ${String(i+1).padStart(2,'0')}</b><span>${esc(m)}</span></div>`).join('')}</div>`;
}
function renderSaved(){
  const items = vendors.filter(v=>saved.includes(v.idx));
  $('#saved').innerHTML = `<div class="section-title"><div><h2>Saved 觀展清單</h2><p>收藏後可以變成自己的現場拜訪清單。</p></div><button class="ghost" id="clearSaved">清空收藏</button></div><div class="grid cols-3">${items.map(v=>vendorCard(v)).join('') || `<div class="empty">目前沒有收藏。到 Vendors 頁點「收藏」即可加入。</div>`}</div>`;
  $('#clearSaved').onclick=()=>{saved=[];saveStore();renderAll(false);}; bindCards();
}
function openVendor(id){
  const v = vendors.find(x=>x.idx===id); if(!v) return;
  $('#modalContent').innerHTML = `<h2>${esc(v.name)}</h2><p class="vendor-meta">${esc(v.routeTitle)}｜${esc(v.hall)}${v.booth?`｜${esc(v.booth)}`:''}</p><h3>預期展示內容</h3><ul>${v.demos.map(d=>`<li>${esc(d)}</li>`).join('')}</ul><h3>為什麼要看</h3><p>${esc(v.why)}</p><h3>建議提問</h3><ul>${v.questions.map(q=>`<li>${esc(q)}</li>`).join('')}</ul>`;
  $('#modal').classList.add('show'); $('#modal').setAttribute('aria-hidden','false');
}
function bindCards(){ $$('[data-save]').forEach(b=>b.onclick=()=>toggleSave(b.dataset.save)); $$('[data-open]').forEach(b=>b.onclick=()=>openVendor(b.dataset.open)); }
function renderAll(initial=true){ renderHome(); renderRoutes(); renderVendors(); renderTimeline(); renderAnalyst(); renderSaved(); if(initial) bindCards(); }

$$('.nav').forEach(b=>b.onclick=()=>view(b.dataset.view));
$$('[data-jump]').forEach(b=>b.onclick=()=>view(b.dataset.jump));
$$('[data-close]').forEach(b=>b.onclick=()=>{$('#modal').classList.remove('show'); $('#modal').setAttribute('aria-hidden','true');});
renderAll();
