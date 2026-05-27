let allVendors = [...vendors];
let saved = JSON.parse(localStorage.getItem('computexSaved') || '[]');
let currentRole = roleRoutes[0].id;

const $ = (id)=>document.getElementById(id);
document.querySelectorAll('[data-view]').forEach(btn=>btn.addEventListener('click',()=>showView(btn.dataset.view)));
function showView(id){document.querySelectorAll('.view').forEach(v=>v.classList.remove('active'));$(id).classList.add('active');window.scrollTo({top:0,behavior:'smooth'});}

function renderStats(){
  $('vendorCount').textContent = allVendors.length;
  $('areaStats').innerHTML = officialAreas.map(([name,count])=>`<div class="area-pill"><span>${name}</span><b>${count}</b></div>`).join('');
}
function renderRoles(){
  $('roleTabs').innerHTML = roleRoutes.map(r=>`<button class="role-tab ${r.id===currentRole?'active':''}" data-role="${r.id}">${r.icon} ${r.title}</button>`).join('');
  document.querySelectorAll('[data-role]').forEach(b=>b.onclick=()=>{currentRole=b.dataset.role;renderRoles();renderVendors();});
  const r = roleRoutes.find(x=>x.id===currentRole);
  const matched = allVendors.filter(v=>v.roles.includes(r.id)).slice(0,12);
  $('roleRoute').innerHTML = `
    <div class="route-hero">
      <div class="panel"><p class="eyebrow">${r.icon} ${r.title}</p><h3>觀展目標</h3><p class="note">${r.objective}</p><h3>優先展區</h3><div class="tags">${r.areas.map(a=>`<span class="tag">${a}</span>`).join('')}</div></div>
      <div class="panel"><h3>現場提問腳本</h3><div class="route-list">${r.questions.map(q=>`<div class="item">${q}</div>`).join('')}</div></div>
    </div>
    <div class="cards two" style="margin-top:16px">
      <div class="panel"><h3>建議產出</h3><div class="route-list">${r.output.map(o=>`<div class="item">${o}</div>`).join('')}</div></div>
      <div class="panel"><h3>此角色優先廠商</h3><div class="route-list">${matched.map(v=>`<div class="item"><b>${v.company}</b><br><span class="meta">${v.area} · ${v.booth}</span></div>`).join('')}</div></div>
    </div>`;
}
function initFilters(){
  const roleSelect = $('roleFilter');
  roleSelect.innerHTML = '<option value="all">所有角色</option>' + roleRoutes.map(r=>`<option value="${r.id}">${r.title}</option>`).join('');
  const areas = [...new Set(allVendors.map(v=>v.area))].sort();
  $('areaFilter').innerHTML = '<option value="all">所有展區</option>' + areas.map(a=>`<option value="${a}">${a}</option>`).join('');
}
function renderVendors(){
  const q = $('searchInput')?.value?.toLowerCase() || '';
  const role = $('roleFilter')?.value || 'all';
  const area = $('areaFilter')?.value || 'all';
  let data = allVendors.filter(v=>{
    const hay = [v.company,v.brand,v.area,v.booth,v.country,v.products,...v.tags].join(' ').toLowerCase();
    return (!q || hay.includes(q)) && (role==='all' || v.roles.includes(role)) && (area==='all' || v.area===area);
  });
  $('vendorList').innerHTML = data.map((v,i)=>vendorCard(v,i)).join('') || '<div class="panel">找不到符合條件的廠商，請調整關鍵字或匯入更多官方名單。</div>';
  document.querySelectorAll('[data-open]').forEach(b=>b.onclick=()=>openVendor(Number(b.dataset.open)));
  document.querySelectorAll('[data-save]').forEach(b=>b.onclick=()=>toggleSave(b.dataset.save));
  renderSaved();
  renderStats();
}
function vendorCard(v,i){
  const isSaved = saved.includes(v.company);
  return `<article class="vendor-card"><h3>${v.company}</h3><div class="meta">Brand: ${v.brand||'-'}<br>Area: ${v.area}<br>Booth: ${v.booth||'-'}<br>Country: ${v.country||'-'}</div><p class="meta">${v.products||''}</p><div class="tags">${v.tags.map(t=>`<span class="tag">${t}</span>`).join('')}</div><div class="card-actions"><button class="secondary small" data-save="${v.company}">${isSaved?'已收藏':'收藏'}</button><button class="linkbtn" data-open="${allVendors.indexOf(v)}">查看詳情</button></div></article>`;
}
function openVendor(i){
  const v = allVendors[i];
  const roleNames = v.roles.map(id=>roleRoutes.find(r=>r.id===id)?.title).filter(Boolean).join('、');
  $('modalContent').innerHTML = `<p class="eyebrow">Vendor Detail</p><h2>${v.company}</h2><p class="note">${v.products}</p><div class="cards two"><div class="item"><b>Brand</b><br>${v.brand||'-'}</div><div class="item"><b>Booth</b><br>${v.booth||'-'}</div><div class="item"><b>Area</b><br>${v.area}</div><div class="item"><b>Country</b><br>${v.country||'-'}</div></div><h3>適合角色</h3><p class="note">${roleNames}</p><h3>建議追問</h3><div class="route-list"><div class="item">這項展示目前是 demo、PoC、design-in 還是量產？</div><div class="item">主要目標客戶與落地場景是什麼？</div><div class="item">是否有可公開的效益數據、合作案例或市場規模？</div></div>`;
  $('modal').classList.remove('hidden');
}
function toggleSave(company){
  saved = saved.includes(company) ? saved.filter(x=>x!==company) : [...saved,company];
  localStorage.setItem('computexSaved', JSON.stringify(saved));
  renderVendors();
}
function renderSaved(){
  const items = allVendors.filter(v=>saved.includes(v.company));
  $('savedList').innerHTML = items.map(v=>`<div class="item"><b>${v.company}</b><br><span class="meta">${v.area} · ${v.booth}</span></div>`).join('') || '<p class="note">尚未收藏廠商。</p>';
}
function parseCSV(text){
  const lines=text.trim().split(/\r?\n/).filter(Boolean);
  const headers=lines.shift().split(',').map(h=>h.trim().toLowerCase());
  return lines.map(line=>{
    const cols=line.match(/("[^"]*"|[^,]+)/g)?.map(c=>c.replace(/^"|"$/g,'').trim())||[];
    const o={}; headers.forEach((h,i)=>o[h]=cols[i]||'');
    return {company:o.company||o.exhibitor||o.name||'Unknown', brand:o.brand||'', area:o.area||o.exhibition_area||'Imported', booth:o.booth||'', country:o.country||'', products:o.products||o.product||'', tags:(o.tags||'Imported').split(/[;|]/).map(x=>x.trim()).filter(Boolean), roles:(o.roles||'sales;marketing;analyst').split(/[;|]/).map(x=>x.trim()).filter(Boolean)};
  });
}
function exportCSV(){
  const headers=['Company','Brand','Area','Booth','Country','Products','Tags','Roles'];
  const rows=allVendors.map(v=>[v.company,v.brand,v.area,v.booth,v.country,v.products,v.tags.join(';'),v.roles.join(';')].map(x=>`"${String(x||'').replaceAll('"','""')}"`).join(','));
  const blob=new Blob([[headers.join(','),...rows].join('\n')],{type:'text/csv'});
  const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download='computex-vendors.csv';a.click();URL.revokeObjectURL(a.href);
}
$('closeModal').onclick=()=>$('modal').classList.add('hidden');
$('modal').onclick=e=>{if(e.target.id==='modal')$('modal').classList.add('hidden')};
['searchInput','roleFilter','areaFilter'].forEach(id=>$(id).addEventListener('input',renderVendors));
$('clearFilters').onclick=()=>{$('searchInput').value='';$('roleFilter').value='all';$('areaFilter').value='all';renderVendors();};
$('csvFile').onchange=(e)=>{const file=e.target.files[0];if(!file)return;const reader=new FileReader();reader.onload=()=>{allVendors=[...allVendors,...parseCSV(reader.result)];initFilters();renderRoles();renderVendors();};reader.readAsText(file);};
$('exportBtn').onclick=exportCSV;
$('saveNotes').onclick=()=>{localStorage.setItem('computexNotes',$('notes').value);alert('已儲存到瀏覽器 localStorage');};
$('notes').value=localStorage.getItem('computexNotes')||'';
renderStats();initFilters();renderRoles();renderVendors();
