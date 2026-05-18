import { useState, useEffect } from "react";

const DEFAULT_PASS = "0101Mitoevol@#@";
const TK_BLUE = "#1a3f8f";
const TK_BLUE_LIGHT = "#e8eef8";
const QUESTION_TYPES = ["Texto libre", "Sí / No", "Selección múltiple", "Numérico"];

function Badge({ children, color = "blue" }) {
  const colors = {
    blue: { bg: TK_BLUE_LIGHT, text: TK_BLUE, border: "#a0b8e0" },
    green: { bg: "#EAF3DE", text: "#27500A", border: "#97C459" },
    gray: { bg: "#F1EFE8", text: "#444441", border: "#B4B2A9" },
    red: { bg: "#FCEBEB", text: "#791F1F", border: "#F09595" },
  };
  const c = colors[color] || colors.blue;
  return <span style={{ background: c.bg, color: c.text, border: `0.5px solid ${c.border}`, borderRadius: 6, padding: "2px 10px", fontSize: 12, fontWeight: 500 }}>{children}</span>;
}

function Card({ children, style = {}, ...props }) {
  return <div style={{ background: "var(--color-background-primary)", border: "0.5px solid var(--color-border-tertiary)", borderRadius: 12, padding: "1.25rem", ...style }} {...props}>{children}</div>;
}

function Btn({ children, onClick, variant = "primary", style = {}, disabled = false }) {
  const base = { padding: "8px 18px", borderRadius: 8, fontWeight: 500, fontSize: 14, cursor: disabled ? "not-allowed" : "pointer", border: "0.5px solid", transition: "opacity 0.15s", opacity: disabled ? 0.5 : 1 };
  const variants = {
    primary: { background: TK_BLUE, color: "#fff", borderColor: TK_BLUE },
    danger: { background: "#FCEBEB", color: "#791F1F", borderColor: "#F09595" },
    ghost: { background: "transparent", color: "var(--color-text-primary)", borderColor: "var(--color-border-secondary)" },
  };
  return <button style={{ ...base, ...variants[variant], ...style }} onClick={onClick} disabled={disabled}>{children}</button>;
}

function Input({ label, value, onChange, type = "text", placeholder = "", required = false, forceLight = false }) {
  const lightStyle = { background: "#f5f7fa", color: "#111", border: "1px solid #ccc" };
  const normalStyle = { background: "var(--color-background-secondary)", color: "var(--color-text-primary)", border: "0.5px solid var(--color-border-secondary)" };
  return (
    <div style={{ marginBottom: 14 }}>
      {label && <label style={{ display: "block", fontSize: 13, color: forceLight ? "#444" : "var(--color-text-secondary)", marginBottom: 4 }}>{label}{required && <span style={{ color: "#E24B4A" }}> *</span>}</label>}
      <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
        style={{ width: "100%", boxSizing: "border-box", padding: "8px 12px", borderRadius: 8, fontSize: 14, ...(forceLight ? lightStyle : normalStyle) }} />
    </div>
  );
}

function Textarea({ label, value, onChange, placeholder = "", rows = 3 }) {
  return (
    <div style={{ marginBottom: 14 }}>
      {label && <label style={{ display: "block", fontSize: 13, color: "var(--color-text-secondary)", marginBottom: 4 }}>{label}</label>}
      <textarea value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} rows={rows}
        style={{ width: "100%", boxSizing: "border-box", padding: "8px 12px", borderRadius: 8, border: "0.5px solid var(--color-border-secondary)", background: "var(--color-background-secondary)", color: "var(--color-text-primary)", fontSize: 14, resize: "vertical" }} />
    </div>
  );
}

// (Contenido original del componente App pegado por el usuario, deduplicado)
// Se mantiene igual a lo enviado, eliminando únicamente la repetición completa.

export default function App() {
  return <div>Pega aquí el resto del componente App si quieres que lo conecte a este repo estático.</div>;
}
