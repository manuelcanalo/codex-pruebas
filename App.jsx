import { useState } from "react";

const EMAILJS_SERVICE_ID = "TU_SERVICE_ID";
const EMAILJS_TEMPLATE_ID = "TU_TEMPLATE_ID";
const EMAILJS_PUBLIC_KEY = "TU_PUBLIC_KEY";
const RRHH_EMAIL = "manuel.canalo@teknoservice.es";
const ADMIN_PASS_DEFAULT = "0101Mitoevol@#@";

const TK_BLUE = "#1a3f8f";
const TK_BLUE_LIGHT = "#e8eef8";
const Q_TYPES = ["Texto libre", "Sí / No", "Selección múltiple", "Numérico"];

const INIT_JOBS = [{
  id: "job1", title: "Técnico de Soporte IT", dept: "Tecnología",
  location: "Sevilla", type: "Jornada completa", active: true,
  description: "Buscamos técnico con experiencia en soporte a usuarios, resolución de incidencias y mantenimiento de infraestructura IT.",
  requirements: "Ciclo Superior Informática, experiencia mínima 2 años, inglés técnico.",
  questions: [
    { id: "q1", text: "¿Cuántos años de experiencia tienes en soporte IT?", type: "Numérico", options: [] },
    { id: "q2", text: "¿Cuál es tu nivel de inglés?", type: "Selección múltiple", options: ["Básico", "Intermedio", "Avanzado", "Nativo"] },
    { id: "q3", text: "¿Tienes carnet de conducir?", type: "Sí / No", options: [] },
    { id: "q4", text: "¿Cuál es tu residencia actual?", type: "Texto libre", options: [] },
    { id: "q5", text: "¿Tienes certificación de Microsoft o similar?", type: "Sí / No", options: [] },
  ]
}];

const save = (k, v) => localStorage.setItem(k, JSON.stringify(v));
const load = (k, def) => { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : def; } catch { return def; } };

function Badge({ children, color = "blue" }) {
  const c = { blue: { bg: TK_BLUE_LIGHT, text: TK_BLUE, border: "#a0b8e0" }, green: { bg: "#EAF3DE", text: "#27500A", border: "#97C459" }, gray: { bg: "#F1EFE8", text: "#444", border: "#B4B2A9" }, red: { bg: "#FCEBEB", text: "#791F1F", border: "#F09595" } }[color];
  return <span style={{ background: c.bg, color: c.text, border: `0.5px solid ${c.border}`, borderRadius: 6, padding: "2px 10px", fontSize: 12, fontWeight: 500 }}>{children}</span>;
}

function Card({ children, style = {}, ...props }) {
  return <div style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 12, padding: "1.25rem", ...style }} {...props}>{children}</div>;
}

function Btn({ children, onClick, variant = "primary", style = {}, disabled = false }) {
  const v = { primary: { background: TK_BLUE, color: "#fff", borderColor: TK_BLUE }, danger: { background: "#FCEBEB", color: "#791F1F", borderColor: "#F09595" }, ghost: { background: "transparent", color: "#333", borderColor: "#ccc" } }[variant];
  return <button onClick={onClick} disabled={disabled} style={{ padding: "8px 18px", borderRadius: 8, fontWeight: 500, fontSize: 14, cursor: disabled ? "not-allowed" : "pointer", border: "0.5px solid", opacity: disabled ? 0.5 : 1, ...v, ...style }}>{children}</button>;
}

export default function App() {
  const [jobs, setJobs] = useState(() => load("tk_jobs", INIT_JOBS));
  const [applications, setApplications] = useState(() => load("tk_apps", []));
  const [adminAuth, setAdminAuth] = useState(false);
  const [view, setView] = useState("portal");
  const [adminPassInput, setAdminPassInput] = useState("");
  const [savedPass, setSavedPass] = useState(() => load("tk_pass", ADMIN_PASS_DEFAULT));
  const [applyingJob, setApplyingJob] = useState(null);
  const [applyName, setApplyName] = useState("");
  const [applyEmail, setApplyEmail] = useState("");

  const activeJobs = jobs.filter(j => j.active);
  const saveJobs = (j) => { setJobs(j); save("tk_jobs", j); };

  function loginAdmin() {
    if (adminPassInput === savedPass) { setAdminAuth(true); setAdminPassInput(""); }
    else alert("Contraseña incorrecta");
  }

  async function submitApplication() {
    const app = { id: "app_" + Date.now(), jobId: applyingJob.id, jobTitle: applyingJob.title, name: applyName, email: applyEmail, date: new Date().toLocaleDateString("es-ES") };
    const next = [...applications, app];
    setApplications(next); save("tk_apps", next);

    if (window.emailjs && EMAILJS_SERVICE_ID !== "TU_SERVICE_ID") {
      await window.emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, { to_email: RRHH_EMAIL, puesto: applyingJob.title, nombre: applyName, email_candidato: applyEmail }, EMAILJS_PUBLIC_KEY);
    }

    alert("¡Candidatura enviada!");
    setApplyingJob(null); setApplyName(""); setApplyEmail("");
  }

  const isAdmin = view === "admin" && adminAuth;

  return <div style={{ fontFamily: "Arial, sans-serif", background: "#f5f7fa", minHeight: "100vh", color: "#222" }}>
    <div style={{ background: "#fff", padding: "10px 20px", display: "flex", justifyContent: "space-between", borderBottom: `3px solid ${TK_BLUE}` }}>
      <strong style={{ color: TK_BLUE }}>Portal de Empleo · Teknoservice SL</strong>
      {isAdmin && <span>PANEL RRHH</span>}
    </div>
    <div style={{ background: TK_BLUE, padding: "7px 20px", display: "flex", justifyContent: "flex-end", gap: 8 }}>
      {isAdmin ? <>
        <Btn variant="ghost" style={{ color: "#fff", borderColor: "rgba(255,255,255,.4)" }} onClick={() => setView("portal")}>Ver portal</Btn>
        <Btn variant="ghost" style={{ color: "#fff", borderColor: "rgba(255,255,255,.4)" }} onClick={() => { setAdminAuth(false); setView("portal"); }}>Cerrar sesión</Btn>
      </> : <Btn variant="ghost" style={{ color: "#fff", borderColor: "rgba(255,255,255,.4)" }} onClick={() => setView("admin")}>Acceso RRHH</Btn>}
    </div>

    <div style={{ maxWidth: 700, margin: "0 auto", padding: "1rem" }}>
      {view === "admin" && !adminAuth && <Card style={{ maxWidth: 360, margin: "2rem auto" }}>
        <div style={{ fontWeight: 600, color: TK_BLUE, marginBottom: 12 }}>Acceso RRHH</div>
        <input type="password" value={adminPassInput} onChange={e => setAdminPassInput(e.target.value)} style={{ width: "100%", marginBottom: 10, padding: "8px 12px" }} />
        <Btn onClick={loginAdmin}>Entrar</Btn>
      </Card>}

      {isAdmin && <>
        <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 12 }}>
          <Btn onClick={() => saveJobs([...jobs, { id: "job_" + Date.now(), title: "Nueva oferta", dept: "", location: "", type: "Jornada completa", active: true, description: "", requirements: "", questions: [{ id: "q_" + Date.now(), text: "", type: Q_TYPES[0], options: [] }] }])}>+ Nueva oferta</Btn>
        </div>
        {jobs.map(job => <Card key={job.id} style={{ marginBottom: 10 }}>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <div><div style={{ color: TK_BLUE, fontWeight: 600 }}>{job.title}</div><Badge color={job.active ? "green" : "gray"}>{job.active ? "Activa" : "Inactiva"}</Badge></div>
            <Btn variant="danger" onClick={() => saveJobs(jobs.filter(j => j.id !== job.id))}>Eliminar</Btn>
          </div>
        </Card>)}
      </>}

      {view === "portal" && !applyingJob && activeJobs.map(job => <Card key={job.id} style={{ marginBottom: 12 }}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: 8 }}>
          <div><div style={{ color: TK_BLUE, fontWeight: 600 }}>{job.title}</div><div style={{ marginTop: 8 }}>{job.description}</div></div>
          <Btn onClick={() => setApplyingJob(job)}>Inscribirse</Btn>
        </div>
      </Card>)}

      {applyingJob && <Card>
        <div style={{ color: TK_BLUE, fontWeight: 600, marginBottom: 12 }}>{applyingJob.title}</div>
        <input placeholder="Nombre completo" value={applyName} onChange={e => setApplyName(e.target.value)} style={{ width: "100%", marginBottom: 10, padding: "8px 12px" }} />
        <input placeholder="Correo" value={applyEmail} onChange={e => setApplyEmail(e.target.value)} style={{ width: "100%", marginBottom: 10, padding: "8px 12px" }} />
        <div style={{ display: "flex", gap: 10 }}>
          <Btn variant="ghost" onClick={() => setApplyingJob(null)}>Cancelar</Btn>
          <Btn disabled={!applyName || !applyEmail} onClick={submitApplication}>Enviar candidatura</Btn>
        </div>
      </Card>}
    </div>
  </div>;
}
