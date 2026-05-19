const DEFAULT_PASS = '0101Mitoevol@#@';
const INIT_JOBS = [
  {
    id: 'job1',
    title: 'Técnico de Soporte IT',
    dept: 'Tecnología',
    location: 'Sevilla',
    type: 'Jornada completa',
    salary: '22.000€ - 28.000€',
    description: 'Buscamos técnico con experiencia en soporte a usuarios, resolución de incidencias y mantenimiento de infraestructura IT.',
    requirements: 'Ciclo Superior Informática, experiencia mínima 2 años, inglés técnico.',
    active: true,
    createdAt: '2026-05-18'
  }
];

const state = {
  view: 'portal',
  auth: false,
  pass: '',
  savedPass: localStorage.getItem('admin_pass') || DEFAULT_PASS,
  adminTab: 'jobs',
  jobs: load('tk_jobs', INIT_JOBS),
  applications: load('tk_apps', []),
  applyingJob: null,
  form: { name: '', email: '', phone: '', coverLetter: '' },
  filters: { text: '', location: 'all', type: 'all' },
  newJob: blankJob()
};

const app = document.getElementById('app');

function blankJob() {
  return { title: '', dept: '', location: '', type: 'Jornada completa', salary: '', description: '', requirements: '' };
}

function load(key, fallback) {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
}

function persist() {
  localStorage.setItem('tk_jobs', JSON.stringify(state.jobs));
  localStorage.setItem('tk_apps', JSON.stringify(state.applications));
}

function esc(s = '') {
  return String(s).replace(/[&<>"']/g, m => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[m]));
}

function isAdmin() { return state.view === 'admin' && state.auth; }

function top() {
  return `<div class="topbar"><div class="brand">TEKNOSERVICE · Portal de Empleo ${isAdmin() ? '· Panel RRHH' : ''}</div><div class="row">${
    isAdmin()
      ? `<button class="btn ghost light" data-a="portal">Ver portal</button><button class="btn ghost light" data-a="logout">Cerrar sesión</button>`
      : `<button class="btn ghost light" data-a="admin">Acceso RRHH</button>`
  }</div></div>`;
}

function foot() {
  return `<div class="footer"><span>© Teknoservice SL</span><span>rrhh@teknoservice.es</span></div>`;
}

function render() {
  app.innerHTML = top() + `<main class="container">${body()}</main>` + foot();
  bind();
}

function body() {
  if (state.view === 'admin' && !state.auth) return loginView();
  if (isAdmin()) return adminView();
  return portalView();
}

function loginView() {
  return `<div class="card" style="max-width:380px;margin:30px auto"><h3>Acceso RRHH</h3><div class="field"><label>Contraseña</label><input id="admin-pass" type="password"/></div><button class="btn" data-a="login">Entrar</button></div>`;
}

function portalView() {
  const active = state.jobs
    .filter(j => j.active)
    .filter(j => j.title.toLowerCase().includes(state.filters.text.toLowerCase()) || j.dept.toLowerCase().includes(state.filters.text.toLowerCase()))
    .filter(j => state.filters.location === 'all' ? true : j.location === state.filters.location)
    .filter(j => state.filters.type === 'all' ? true : j.type === state.filters.type);

  const locations = ['all', ...new Set(state.jobs.filter(j => j.active).map(j => j.location))];
  const types = ['all', ...new Set(state.jobs.filter(j => j.active).map(j => j.type))];

  if (state.applyingJob) return applyView();

  return `
  <div class="card">
    <div class="between">
      <div>
        <h2 style="color:var(--blue)">Únete a Teknoservice</h2>
        <p class="muted">${active.length} ofertas activas</p>
      </div>
    </div>
    <div class="grid3" style="margin-top:12px">
      <div class="field"><label>Buscar</label><input data-f="text" placeholder="Puesto o área" value="${esc(state.filters.text)}"></div>
      <div class="field"><label>Ubicación</label><select data-f="location">${locations.map(l => `<option ${state.filters.location === l ? 'selected' : ''} value="${esc(l)}">${l === 'all' ? 'Todas' : esc(l)}</option>`).join('')}</select></div>
      <div class="field"><label>Tipo</label><select data-f="type">${types.map(t => `<option ${state.filters.type === t ? 'selected' : ''} value="${esc(t)}">${t === 'all' ? 'Todos' : esc(t)}</option>`).join('')}</select></div>
    </div>
  </div>
  ${active.length ? active.map(jobCard).join('') : '<div class="card">No hay ofertas para ese filtro.</div>'}`;
}

function jobCard(j) {
  return `<div class="card"><div class="between"><div><h3 style="color:var(--blue)">${esc(j.title)}</h3><div class="row" style="margin-top:6px"><span class="badge">${esc(j.dept)}</span><span class="badge gray">${esc(j.location)}</span><span class="badge green">${esc(j.type)}</span><span class="badge">${esc(j.salary || 'Salario a convenir')}</span></div></div><button class="btn" data-a="apply" data-id="${j.id}">Inscribirse</button></div><p class="muted" style="margin-top:10px"><strong>Descripción:</strong> ${esc(j.description || '')}</p><p class="muted" style="margin-top:8px"><strong>Requisitos:</strong> ${esc(j.requirements || '')}</p></div>`;
}

function applyView() {
  const j = state.applyingJob;
  return `<div class="card"><h3 style="color:var(--blue)">${esc(j.title)}</h3><p class="muted" style="margin:8px 0 16px">Completa tus datos para enviar la candidatura.</p><div class="field"><label>Nombre completo*</label><input id="n" value="${esc(state.form.name)}"></div><div class="field"><label>Email*</label><input id="e" type="email" value="${esc(state.form.email)}"></div><div class="field"><label>Teléfono</label><input id="p" value="${esc(state.form.phone)}"></div><div class="field"><label>Mensaje / carta de presentación</label><textarea id="c" rows="4">${esc(state.form.coverLetter)}</textarea></div><div class="row"><button class="btn ghost" data-a="cancelApply">Cancelar</button><button class="btn" data-a="submit">Enviar candidatura</button></div></div>`;
}

function adminView() {
  return `<div class="tabs"><button class="tab ${state.adminTab === 'jobs' ? 'active' : ''}" data-a="tabJobs">Ofertas</button><button class="tab ${state.adminTab === 'apps' ? 'active' : ''}" data-a="tabApps">Candidaturas (${state.applications.length})</button></div>${state.adminTab === 'jobs' ? adminJobs() : adminApps()}`;
}

function adminJobs() {
  return `<div class="card"><h3 style="margin-bottom:12px">Crear oferta nueva</h3>
  <div class="grid2">
  <div class="field"><label>Título*</label><input data-j="title" value="${esc(state.newJob.title)}"></div>
  <div class="field"><label>Departamento</label><input data-j="dept" value="${esc(state.newJob.dept)}"></div>
  <div class="field"><label>Ubicación</label><input data-j="location" value="${esc(state.newJob.location)}"></div>
  <div class="field"><label>Tipo</label><input data-j="type" value="${esc(state.newJob.type)}"></div>
  <div class="field"><label>Rango salarial</label><input data-j="salary" value="${esc(state.newJob.salary)}"></div>
  </div>
  <div class="field"><label>Descripción</label><textarea data-j="description" rows="3">${esc(state.newJob.description)}</textarea></div>
  <div class="field"><label>Requisitos</label><textarea data-j="requirements" rows="3">${esc(state.newJob.requirements)}</textarea></div>
  <button class="btn" data-a="createJob">Publicar oferta</button>
  </div>
  <div class="card"><h3 style="margin-bottom:10px">Ofertas publicadas</h3>${state.jobs.map(j => `<div class="between" style="padding:10px 0;border-bottom:1px solid var(--border)"><div><strong>${esc(j.title)}</strong><div class="muted">${esc(j.location)} · ${esc(j.type)} · ${j.active ? 'Activa' : 'Inactiva'}</div></div><div class="row"><button class="btn ghost" data-a="toggleJob" data-id="${j.id}">${j.active ? 'Desactivar' : 'Activar'}</button><button class="btn danger" data-a="delJob" data-id="${j.id}">Eliminar</button></div></div>`).join('')}</div>`;
}

function adminApps() {
  return `<div class="card">${state.applications.length ? state.applications.map(a => `<div style="border-bottom:1px solid var(--border);padding:10px 0"><strong>${esc(a.name)}</strong><div class="muted">${esc(a.jobTitle)} · ${esc(a.email)} ${a.phone ? `· ${esc(a.phone)}` : ''}</div>${a.coverLetter ? `<p style="margin-top:6px">${esc(a.coverLetter)}</p>` : ''}</div>`).join('') : 'Aún no hay candidaturas.'}</div>`;
}

function bind() {
  app.querySelectorAll('[data-a]').forEach(el => (el.onclick = handle));
  app.querySelectorAll('[data-f]').forEach(el => (el.oninput = () => { state.filters[el.dataset.f] = el.value; render(); }));
  app.querySelectorAll('[data-j]').forEach(el => (el.oninput = () => { state.newJob[el.dataset.j] = el.value; }));
}

function handle(e) {
  const a = e.currentTarget.dataset.a;
  if (a === 'admin') state.view = 'admin';
  if (a === 'portal') state.view = 'portal';
  if (a === 'logout') { state.auth = false; state.view = 'portal'; }
  if (a === 'login') { const v = document.getElementById('admin-pass').value; if (v === state.savedPass) state.auth = true; else alert('Contraseña incorrecta'); }
  if (a === 'tabJobs') state.adminTab = 'jobs';
  if (a === 'tabApps') state.adminTab = 'apps';
  if (a === 'apply') { state.applyingJob = state.jobs.find(j => j.id === e.currentTarget.dataset.id); }
  if (a === 'cancelApply') { state.applyingJob = null; state.form = { name: '', email: '', phone: '', coverLetter: '' }; }
  if (a === 'submit') {
    state.form.name = document.getElementById('n').value.trim();
    state.form.email = document.getElementById('e').value.trim();
    state.form.phone = document.getElementById('p').value.trim();
    state.form.coverLetter = document.getElementById('c').value.trim();
    if (!state.form.name || !state.form.email) return alert('Nombre y email son obligatorios.');
    state.applications.unshift({ id: 'app_' + Date.now(), date: new Date().toISOString().slice(0, 10), jobId: state.applyingJob.id, jobTitle: state.applyingJob.title, ...state.form });
    persist();
    alert('Candidatura enviada correctamente.');
    state.applyingJob = null;
    state.form = { name: '', email: '', phone: '', coverLetter: '' };
  }
  if (a === 'createJob') {
    if (!state.newJob.title.trim()) return alert('El título es obligatorio.');
    state.jobs.unshift({ id: 'job_' + Date.now(), ...state.newJob, active: true, createdAt: new Date().toISOString().slice(0, 10) });
    state.newJob = blankJob();
    persist();
  }
  if (a === 'toggleJob') {
    state.jobs = state.jobs.map(j => j.id === e.currentTarget.dataset.id ? { ...j, active: !j.active } : j);
    persist();
  }
  if (a === 'delJob') {
    state.jobs = state.jobs.filter(j => j.id !== e.currentTarget.dataset.id);
    persist();
  }
  render();
}

render();
