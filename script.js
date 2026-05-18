const DEFAULT_PASS = '0101Mitoevol@#@';
const QUESTION_TYPES = ['Texto libre', 'Sí / No', 'Selección múltiple', 'Numérico'];
const INIT_JOBS = [{
  id:'job1', title:'Técnico de Soporte IT', dept:'Tecnología', location:'Sevilla', type:'Jornada completa',
  description:'Buscamos técnico con experiencia en soporte a usuarios, resolución de incidencias y mantenimiento de infraestructura IT.',
  requirements:'Ciclo Superior Informática, experiencia mínima 2 años, inglés técnico.', active:true,
  questions:[
    { id:'q1', text:'¿Cuántos años de experiencia tienes en soporte IT?', type:'Numérico', options:[] },
    { id:'q2', text:'¿Cuál es tu nivel de inglés?', type:'Selección múltiple', options:['Básico','Intermedio','Avanzado','Nativo'] },
    { id:'q3', text:'¿Tienes carnet de conducir?', type:'Sí / No', options:[] }
  ]
}];

const state = { view:'portal', auth:false, pass:'', savedPass:localStorage.getItem('admin_pass')||DEFAULT_PASS, adminTab:'jobs', jobs:INIT_JOBS, applications:[], applyingJob:null, applyStep:1, answers:{}, name:'', email:'', phone:'', done:false };
const app = document.getElementById('app');

function esc(s=''){ return String(s).replace(/[&<>"']/g,m=>({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' }[m])); }

function top(){ return `<div class="topbar"><div class="brand">TEKNOSERVICE · ttl Professional ${isAdmin()? '· Panel RRHH':''}</div><div class="row">${isAdmin()?`<button class="btn ghost" data-a="portal">Ver portal</button><button class="btn ghost" data-a="logout">Cerrar sesión</button>`:`<button class="btn ghost" data-a="admin">Acceso RRHH</button>`}</div></div>`; }
function foot(){ return `<div class="footer"><span>© Teknoservice SL</span><span>info@teknoservice.es</span></div>`; }
function isAdmin(){ return state.view==='admin' && state.auth; }

function render(){
  app.innerHTML = top() + `<main class="container">${body()}</main>` + foot();
  bind();
}

function body(){
  if(state.view==='admin' && !state.auth) return loginView();
  if(isAdmin()) return adminView();
  return portalView();
}

function loginView(){ return `<div class="card" style="max-width:380px;margin:30px auto"><h3>Acceso RRHH</h3><div class="field"><label>Contraseña</label><input id="admin-pass" type="password"/></div><button class="btn" data-a="login">Entrar</button></div>`; }

function portalView(){
  if(state.applyingJob) return applyView();
  const active = state.jobs.filter(j=>j.active);
  return `<div class="between" style="margin-bottom:16px"><div><h2 style="color:var(--blue)">Únete a nuestro equipo</h2><p class="muted">${active.length} ofertas activas</p></div></div>` +
  (active.length? active.map(j=>`<div class="card"><div class="between"><div><h3 style="color:var(--blue)">${esc(j.title)}</h3><div class="row" style="margin-top:6px"><span class="badge">${esc(j.dept)}</span><span class="badge gray">${esc(j.location)}</span><span class="badge green">${esc(j.type)}</span></div></div><button class="btn" data-a="apply" data-id="${j.id}">Inscribirse</button></div><p class="muted" style="margin-top:10px">${esc(j.description||'')}</p></div>`).join('') : '<div class="card">No hay ofertas activas.</div>');
}

function applyView(){
  const j=state.applyingJob;
  if(state.done) return `<div class="card"><h3 style="color:var(--blue)">¡Candidatura enviada!</h3><p class="muted" style="margin:8px 0 14px">Gracias, ${esc(state.name)}.</p><button class="btn" data-a="resetApply">Ver más ofertas</button></div>`;
  const qHtml=j.questions.map((q,i)=>`<div class="field"><label>${i+1}. ${esc(q.text)}</label>${q.type==='Sí / No' ? `<select data-q="${q.id}"><option value="">Selecciona</option><option>Sí</option><option>No</option></select>` : q.type==='Selección múltiple' ? `<select data-q="${q.id}"><option value="">Selecciona</option>${q.options.map(o=>`<option>${esc(o)}</option>`).join('')}</select>` : `<input data-q="${q.id}" type="${q.type==='Numérico'?'number':'text'}"/>`}</div>`).join('');
  return `<div class="card"><div class="between"><h3 style="color:var(--blue)">${esc(j.title)}</h3><span class="muted">Paso ${state.applyStep} de 2</span></div>${state.applyStep===1?`${qHtml}<button class="btn" data-a="nextStep">Siguiente</button>`:`<div class="field"><label>Nombre completo</label><input id="n"/></div><div class="field"><label>Email</label><input id="e" type="email"/></div><div class="field"><label>Teléfono</label><input id="p"/></div><div class="row"><button class="btn ghost" data-a="prevStep">Atrás</button><button class="btn" data-a="submit">Enviar candidatura</button></div>`}</div>`;
}

function adminView(){
  return `<div class="tabs"><button class="tab ${state.adminTab==='jobs'?'active':''}" data-a="tabJobs">Ofertas</button><button class="tab ${state.adminTab==='apps'?'active':''}" data-a="tabApps">Candidaturas (${state.applications.length})</button></div>`+
  (state.adminTab==='jobs' ? `<div class="card"><p class="muted" style="margin-bottom:10px">Gestión básica de ofertas</p>${state.jobs.map(j=>`<div class="between" style="padding:8px 0;border-bottom:1px solid var(--border)"><div><strong>${esc(j.title)}</strong><div class="row" style="margin-top:4px"><span class="badge ${j.active?'green':'gray'}">${j.active?'Activa':'Inactiva'}</span></div></div><button class="btn danger" data-a="delJob" data-id="${j.id}">Eliminar</button></div>`).join('')}</div>` : `<div class="card">${state.applications.length?state.applications.map(a=>`<div style="border-bottom:1px solid var(--border);padding:8px 0"><strong>${esc(a.name)}</strong><div class="muted">${esc(a.jobTitle)} · ${esc(a.email)}</div></div>`).join(''):'Aún no hay candidaturas.'}</div>`);
}

function bind(){
  app.querySelectorAll('[data-a]').forEach(el=>el.onclick=handle);
  app.querySelectorAll('[data-q]').forEach(el=>el.oninput=()=>state.answers[el.dataset.q]=el.value);
}
function handle(e){
  const a=e.currentTarget.dataset.a;
  if(a==='admin') state.view='admin';
  if(a==='portal') state.view='portal';
  if(a==='logout'){ state.auth=false; state.view='portal'; }
  if(a==='login'){ const v=document.getElementById('admin-pass').value; if(v===state.savedPass){state.auth=true;} else alert('Contraseña incorrecta'); }
  if(a==='tabJobs') state.adminTab='jobs';
  if(a==='tabApps') state.adminTab='apps';
  if(a==='apply'){ state.applyingJob=state.jobs.find(j=>j.id===e.currentTarget.dataset.id); state.applyStep=1; state.done=false; state.answers={}; }
  if(a==='nextStep') state.applyStep=2;
  if(a==='prevStep') state.applyStep=1;
  if(a==='submit'){
    state.name=document.getElementById('n').value.trim(); state.email=document.getElementById('e').value.trim(); state.phone=document.getElementById('p').value.trim();
    if(!state.name||!state.email) return alert('Nombre y email son obligatorios.');
    state.applications.push({ id:'app_'+Date.now(), jobId:state.applyingJob.id, jobTitle:state.applyingJob.title, name:state.name, email:state.email, phone:state.phone, answers:{...state.answers} });
    state.done=true;
  }
  if(a==='resetApply'){ state.applyingJob=null; state.done=false; }
  if(a==='delJob') state.jobs=state.jobs.filter(j=>j.id!==e.currentTarget.dataset.id);
  render();
}

render();
