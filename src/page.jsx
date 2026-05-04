import { useState, useRef } from "react";

const STEPS = [
  { id: "personal",       label: "Heading",      icon: "1" },
  { id: "workExperience", label: "Experience",   icon: "2" },
  { id: "education",      label: "Education",    icon: "3" },
  { id: "skills",         label: "Skills",       icon: "4" },
  { id: "projects",       label: "Projects",     icon: "5" },
  { id: "achievements",   label: "Achievements", icon: "6" },
  { id: "summary",        label: "Summary",      icon: "7" },
  { id: "finalize",       label: "Finalize",     icon: "8" },
];

const TEMPLATES = [
  { value: "classic",      title: "Classic",       recommended: true,  description: "Timeless serif — trusted by recruiters." },
  { value: "modern",       title: "Modern",        recommended: false, description: "Bold dark header, strong contrast." },
  { value: "executive",    title: "Executive",     recommended: false, description: "Two-column layout for senior roles." },
  { value: "greenclassic", title: "Green Classic", recommended: false, description: "Clean serif with green section dividers." },
  { value: "twocolumn",    title: "Two Column",    recommended: false, description: "Left sidebar with right main content." },
  { value: "simplesans",   title: "Simple Sans",   recommended: false, description: "Clean sans-serif with ruled sections." },
];

const EXP_OPTIONS = [
  { value: "none",  label: "No Experience" },
  { value: "lt3",   label: "Less Than 3 Years" },
  { value: "3to5",  label: "3-5 Years" },
  { value: "5to10", label: "5-10 Years" },
  { value: "10p",   label: "10+ Years" },
];

const sc = (base, f) => base * f;

// ── Section wrappers ─────────────────────────────────────────────────────────
function RSection({ title, f, serif, children }) {
  return (
    <div style={{ marginBottom: sc(5, f) }}>
      <div style={{ fontFamily: serif ? "Georgia,serif" : "inherit", fontSize: sc(9, f), fontWeight: 700, borderBottom: "1px solid #ccc", marginBottom: sc(3, f), paddingBottom: sc(2, f), letterSpacing: "0.06em" }}>{title}</div>
      {children}
    </div>
  );
}
function GSection({ title, green, f, children }) {
  return (
    <div style={{ marginBottom: sc(6, f) }}>
      <div style={{ fontSize: sc(9, f), fontWeight: 700, color: "#222", borderBottom: `${sc(1.5, f)}px solid ${green}`, marginBottom: sc(3, f), paddingBottom: sc(2, f), letterSpacing: "0.06em" }}>{title}</div>
      {children}
    </div>
  );
}
function ESection({ title, f, children }) {
  return (
    <div style={{ marginBottom: sc(5, f) }}>
      <div style={{ fontSize: sc(9, f), fontWeight: 700, color: "#e07b3a", borderBottom: "1px solid #e07b3a", marginBottom: sc(3, f), paddingBottom: sc(2, f), letterSpacing: "0.06em" }}>{title}</div>
      {children}
    </div>
  );
}
function SSSection({ title, f, children }) {
  return (
    <div style={{ marginBottom: sc(6, f) }}>
      <div style={{ fontSize: sc(10, f), fontWeight: 700, color: "#111", marginBottom: sc(1, f) }}>{title}</div>
      <div style={{ borderBottom: "1px solid #999", marginBottom: sc(3, f) }} />
      {children}
    </div>
  );
}

// ── Templates ────────────────────────────────────────────────────────────────
function ClassicT({ d, f = 1 }) {
  return (
    <div style={{ fontFamily: "Georgia,serif", fontSize: sc(10, f), color: "#222", lineHeight: 1.4, padding: sc(12, f) }}>
      <div style={{ textAlign: "center", borderBottom: `${sc(2, f)}px solid #1a3c6e`, paddingBottom: sc(6, f), marginBottom: sc(6, f) }}>
        <div style={{ fontSize: sc(18, f), fontWeight: 700, color: "#1a3c6e" }}>{d.personal.firstName} {d.personal.lastName}</div>
        <div style={{ fontSize: sc(8.5, f), color: "#555", letterSpacing: "0.08em", textTransform: "uppercase", marginTop: sc(2, f) }}>{d.personal.profession}</div>
        <div style={{ fontSize: sc(7.5, f), color: "#666", marginTop: sc(3, f) }}>{[d.personal.city, d.personal.phone, d.personal.email, d.personal.linkedin, d.personal.github].filter(Boolean).join(" • ")}</div>
      </div>
      {d.personal.summary && <RSection title="PROFESSIONAL SUMMARY" f={f} serif><div style={{ fontSize: sc(8, f) }}>{d.personal.summary}</div></RSection>}
      {d.education.length > 0 && <RSection title="EDUCATION" f={f} serif>{d.education.map((e, i) => <div key={i} style={{ display: "flex", justifyContent: "space-between", fontSize: sc(8, f), marginBottom: sc(3, f) }}><div><strong>{e.degree}</strong><br /><span style={{ color: "#555" }}>{e.institution}{e.location ? ` – ${e.location}` : ""}</span></div><div style={{ color: "#555", whiteSpace: "nowrap", marginLeft: sc(6, f) }}>{e.year}</div></div>)}</RSection>}
      {(d.workExperience.some(w => w.jobTitle || w.company) || d.isFresher) && (
        <RSection title="EXPERIENCE" f={f} serif>
          {d.isFresher && <div style={{ fontSize: sc(8, f), color: "#555", fontStyle: "italic" }}>Fresher – seeking entry-level opportunity</div>}
          {d.workExperience.filter(w => w.jobTitle || w.company).map((w, i) => (
            <div key={i} style={{ marginBottom: sc(4, f) }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: sc(8.5, f) }}><strong>{w.jobTitle}</strong><span style={{ color: "#555" }}>{w.duration}</span></div>
              <div style={{ fontSize: sc(8, f), color: "#555" }}>{w.company}{w.location ? ` – ${w.location}` : ""}</div>
              {w.description && <div style={{ fontSize: sc(7.5, f), color: "#333", marginLeft: sc(6, f) }}>• {w.description}</div>}
            </div>
          ))}
        </RSection>
      )}
      {d.skills.some(s => s.name) && <RSection title="SKILLS" f={f} serif>{d.skills.filter(s => s.name).map((s, i) => <div key={i} style={{ fontSize: sc(8, f) }}>• {s.name}</div>)}</RSection>}
      {d.projects.some(p => p.name) && (
        <RSection title="PROJECTS" f={f} serif>
          {d.projects.filter(p => p.name).map((p, i) => (
            <div key={i} style={{ marginBottom: sc(3, f) }}>
              <strong style={{ fontSize: sc(8.5, f) }}>• {p.name}</strong>
              {p.description && <div style={{ fontSize: sc(7.5, f), color: "#333", marginLeft: sc(8, f) }}>{p.description}</div>}
              {p.tech && <div style={{ fontSize: sc(7.5, f), color: "#555", marginLeft: sc(8, f) }}><em>Tech: {p.tech}</em></div>}
            </div>
          ))}
        </RSection>
      )}
      {d.achievements.some(a => a.text) && <RSection title="ACHIEVEMENTS" f={f} serif>{d.achievements.filter(a => a.text).map((a, i) => <div key={i} style={{ fontSize: sc(8, f) }}>• {a.text}</div>)}</RSection>}
    </div>
  );
}

function ModernT({ d, f = 1 }) {
  return (
    <div style={{ fontFamily: "Arial,sans-serif", fontSize: sc(10, f), color: "#222", lineHeight: 1.4 }}>
      <div style={{ background: "#111", color: "#fff", padding: `${sc(12, f)}px ${sc(14, f)}px` }}>
        <span style={{ fontSize: sc(18, f), fontWeight: 700, color: "#e07b3a" }}>{d.personal.firstName} </span>
        <span style={{ fontSize: sc(18, f), fontWeight: 700, color: "#fff" }}>{d.personal.lastName}</span>
        <div style={{ fontSize: sc(8.5, f), color: "#ccc", marginTop: sc(2, f) }}>{d.personal.profession}</div>
      </div>
      <div style={{ background: "#333", color: "#fff", padding: `${sc(4, f)}px ${sc(14, f)}px`, fontSize: sc(7.5, f) }}>{[d.personal.city, d.personal.phone, d.personal.email, d.personal.linkedin, d.personal.github].filter(Boolean).join(" | ")}</div>
      <div style={{ padding: `${sc(8, f)}px ${sc(14, f)}px` }}>
        {d.personal.summary && <RSection title="PROFESSIONAL SUMMARY" f={f}><div style={{ fontSize: sc(8, f) }}>{d.personal.summary}</div></RSection>}
        {d.education.length > 0 && <RSection title="EDUCATION" f={f}>{d.education.map((e, i) => <div key={i} style={{ display: "flex", justifyContent: "space-between", fontSize: sc(8, f), marginBottom: sc(2, f) }}><div><strong>{e.degree}</strong><br /><span style={{ color: "#555" }}>{e.institution}{e.location ? ` – ${e.location}` : ""}</span></div><div style={{ color: "#555", whiteSpace: "nowrap", marginLeft: sc(6, f) }}>{e.year}</div></div>)}</RSection>}
        {(d.workExperience.some(w => w.jobTitle || w.company) || d.isFresher) && (
          <RSection title="EXPERIENCE" f={f}>
            {d.isFresher && <div style={{ fontSize: sc(8, f), color: "#555", fontStyle: "italic" }}>Fresher – seeking entry-level opportunity</div>}
            {d.workExperience.filter(w => w.jobTitle || w.company).map((w, i) => (
              <div key={i} style={{ marginBottom: sc(4, f) }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: sc(8.5, f) }}><strong>{w.jobTitle}</strong><span style={{ color: "#555" }}>{w.duration}</span></div>
                <div style={{ fontSize: sc(8, f), color: "#555" }}>{w.company}{w.location ? ` – ${w.location}` : ""}</div>
                {w.description && <div style={{ fontSize: sc(7.5, f), marginLeft: sc(6, f) }}>• {w.description}</div>}
              </div>
            ))}
          </RSection>
        )}
        {d.skills.some(s => s.name) && <RSection title="SKILLS" f={f}>{d.skills.filter(s => s.name).map((s, i) => <div key={i} style={{ fontSize: sc(8, f) }}>• {s.name}</div>)}</RSection>}
        {d.projects.some(p => p.name) && <RSection title="PROJECTS" f={f}>{d.projects.filter(p => p.name).map((p, i) => <div key={i} style={{ marginBottom: sc(3, f) }}><strong style={{ fontSize: sc(8.5, f) }}>• {p.name}</strong>{p.description && <div style={{ fontSize: sc(7.5, f), marginLeft: sc(8, f) }}>{p.description}</div>}{p.tech && <div style={{ fontSize: sc(7.5, f), color: "#555", marginLeft: sc(8, f) }}><em>Tech: {p.tech}</em></div>}</div>)}</RSection>}
        {d.achievements.some(a => a.text) && <RSection title="ACHIEVEMENTS" f={f}>{d.achievements.filter(a => a.text).map((a, i) => <div key={i} style={{ fontSize: sc(8, f) }}>• {a.text}</div>)}</RSection>}
      </div>
    </div>
  );
}

function ExecutiveT({ d, f = 1 }) {
  return (
    <div style={{ fontFamily: "Arial,sans-serif", fontSize: sc(10, f), color: "#222", display: "flex", minHeight: sc(300, f) }}>
      <div style={{ width: sc(90, f), background: "#f4f7fb", padding: `${sc(12, f)}px ${sc(8, f)}px`, flexShrink: 0 }}>
        <div style={{ fontSize: sc(9, f), fontWeight: 700, color: "#2e6da4", borderBottom: "1px solid #2e6da4", marginBottom: sc(4, f), paddingBottom: sc(2, f) }}>CONTACT</div>
        <div style={{ fontSize: sc(7, f), color: "#444", marginBottom: sc(8, f) }}>{[d.personal.email, d.personal.phone, d.personal.city, d.personal.linkedin, d.personal.github].filter(Boolean).map((v, i) => <div key={i} style={{ wordBreak: "break-all", marginBottom: sc(1, f) }}>{v}</div>)}</div>
        {d.skills.some(s => s.name) && <><div style={{ fontSize: sc(9, f), fontWeight: 700, color: "#2e6da4", borderBottom: "1px solid #2e6da4", marginBottom: sc(4, f), paddingBottom: sc(2, f) }}>SKILLS</div>{d.skills.filter(s => s.name).map((s, i) => <div key={i} style={{ fontSize: sc(7, f), color: "#444", marginBottom: sc(2, f) }}>• {s.name}</div>)}</>}
      </div>
      <div style={{ flex: 1, padding: `${sc(12, f)}px ${sc(10, f)}px` }}>
        <div style={{ marginBottom: sc(6, f) }}>
          <div style={{ fontSize: sc(16, f), fontWeight: 700 }}>{d.personal.firstName} {d.personal.lastName}</div>
          <div style={{ fontSize: sc(8.5, f), color: "#2e6da4", marginTop: sc(2, f) }}>{d.personal.profession}</div>
        </div>
        {d.personal.summary && <ESection title="SUMMARY" f={f}><div style={{ fontSize: sc(7.5, f) }}>{d.personal.summary}</div></ESection>}
        {d.education.length > 0 && <ESection title="EDUCATION" f={f}>{d.education.map((e, i) => <div key={i} style={{ display: "flex", justifyContent: "space-between", fontSize: sc(8, f), marginBottom: sc(2, f) }}><div>{e.institution}{e.location ? ` – ${e.location}` : ""} | {e.degree}</div><div style={{ color: "#555", whiteSpace: "nowrap", marginLeft: sc(6, f) }}>{e.year}</div></div>)}</ESection>}
        {(d.workExperience.some(w => w.jobTitle) || d.isFresher) && (
          <ESection title="EXPERIENCE" f={f}>
            {d.isFresher && <div style={{ fontSize: sc(7.5, f), fontStyle: "italic" }}>Fresher – entry-level</div>}
            {d.workExperience.filter(w => w.jobTitle || w.company).map((w, i) => (
              <div key={i} style={{ marginBottom: sc(3, f) }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: sc(8, f) }}><strong>{w.jobTitle} | {w.company}</strong><span style={{ color: "#555" }}>{w.duration}</span></div>
                {w.description && <div style={{ fontSize: sc(7.5, f), marginLeft: sc(6, f) }}>• {w.description}</div>}
              </div>
            ))}
          </ESection>
        )}
        {d.projects.some(p => p.name) && <ESection title="PROJECTS" f={f}>{d.projects.filter(p => p.name).map((p, i) => <div key={i} style={{ marginBottom: sc(3, f) }}><strong style={{ fontSize: sc(8, f) }}>• {p.name}</strong>{p.description && <div style={{ fontSize: sc(7.5, f), marginLeft: sc(6, f) }}>{p.description}</div>}{p.tech && <div style={{ fontSize: sc(7.5, f), color: "#555", marginLeft: sc(6, f) }}><em>Tech: {p.tech}</em></div>}</div>)}</ESection>}
        {d.achievements.some(a => a.text) && <ESection title="ACHIEVEMENTS" f={f}>{d.achievements.filter(a => a.text).map((a, i) => <div key={i} style={{ fontSize: sc(7.5, f) }}>• {a.text}</div>)}</ESection>}
      </div>
    </div>
  );
}

function GreenClassicT({ d, f = 1 }) {
  const green = "#4a7c3f";
  return (
    <div style={{ fontFamily: "'Times New Roman',Georgia,serif", fontSize: sc(10, f), color: "#222", lineHeight: 1.45, padding: `${sc(14, f)}px ${sc(16, f)}px` }}>
      <div style={{ textAlign: "center", marginBottom: sc(10, f) }}>
        <div style={{ fontSize: sc(20, f), fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase" }}>{d.personal.firstName} {d.personal.lastName}</div>
        <div style={{ fontSize: sc(8, f), color: "#555", marginTop: sc(3, f) }}>{[d.personal.city, d.personal.phone, d.personal.email, d.personal.linkedin, d.personal.github].filter(Boolean).join(" | ")}</div>
      </div>
      {d.personal.summary && <GSection title="OBJECTIVE" green={green} f={f}><div style={{ fontSize: sc(8, f) }}>{d.personal.summary}</div></GSection>}
      {(d.workExperience.some(w => w.jobTitle) || d.isFresher) && (
        <GSection title="EXPERIENCE" green={green} f={f}>
          {d.isFresher && <div style={{ fontSize: sc(8, f), color: "#555", fontStyle: "italic", marginBottom: sc(3, f) }}>Fresher in industry</div>}
          {d.workExperience.filter(w => w.jobTitle || w.company).map((w, i) => (
            <div key={i} style={{ marginBottom: sc(6, f) }}>
              <div style={{ fontWeight: 700, fontSize: sc(8.5, f) }}>{w.jobTitle}</div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: sc(8, f) }}><span style={{ color: "#555" }}>{w.company}{w.location ? ` | ${w.location}` : ""}</span><span style={{ color: "#555" }}>{w.duration}</span></div>
              {w.description && <div style={{ fontSize: sc(7.5, f), marginLeft: sc(6, f), marginTop: sc(1, f) }}>• {w.description}</div>}
            </div>
          ))}
        </GSection>
      )}
      {d.education.length > 0 && (
        <GSection title="EDUCATION" green={green} f={f}>
          {d.education.map((e, i) => (
            <div key={i} style={{ marginBottom: sc(4, f) }}>
              <div style={{ fontWeight: 700, fontSize: sc(8.5, f) }}>{e.degree || e.institution}</div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: sc(8, f) }}><span style={{ color: "#555" }}>{e.institution}{e.location ? ` | ${e.location}` : ""}</span><span style={{ color: "#555" }}>{e.year}</span></div>
            </div>
          ))}
        </GSection>
      )}
      {d.skills.some(s => s.name) && <GSection title="SKILLS" green={green} f={f}><div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: `${sc(2, f)}px`, fontSize: sc(8, f) }}>{d.skills.filter(s => s.name).map((s, i) => <div key={i}>• {s.name}</div>)}</div></GSection>}
      {d.projects.some(p => p.name) && <GSection title="PROJECTS" green={green} f={f}>{d.projects.filter(p => p.name).map((p, i) => <div key={i} style={{ marginBottom: sc(3, f) }}><strong style={{ fontSize: sc(8.5, f) }}>• {p.name}</strong>{p.description && <div style={{ fontSize: sc(7.5, f), marginLeft: sc(8, f) }}>{p.description}</div>}{p.tech && <div style={{ fontSize: sc(7.5, f), color: "#555", marginLeft: sc(8, f) }}><em>Tech: {p.tech}</em></div>}</div>)}</GSection>}
      {d.achievements.some(a => a.text) && <GSection title="ACHIEVEMENTS" green={green} f={f}>{d.achievements.filter(a => a.text).map((a, i) => <div key={i} style={{ fontSize: sc(8, f) }}>• {a.text}</div>)}</GSection>}
    </div>
  );
}

function TwoColumnT({ d, f = 1 }) {
  return (
    <div style={{ fontFamily: "'Helvetica Neue',Arial,sans-serif", fontSize: sc(10, f), color: "#333", background: "#f5f5f0" }}>
      <div style={{ padding: `${sc(14, f)}px ${sc(14, f)}px ${sc(8, f)}px`, borderBottom: `${sc(1, f)}px solid #ccc` }}>
        <div style={{ fontSize: sc(22, f), fontWeight: 200, letterSpacing: "0.08em", textTransform: "uppercase" }}>{d.personal.firstName} {d.personal.lastName}</div>
        <div style={{ fontSize: sc(8, f), color: "#666", letterSpacing: "0.12em", textTransform: "uppercase", marginTop: sc(2, f) }}>{d.personal.profession}</div>
      </div>
      <div style={{ display: "flex", gap: sc(12, f), padding: `${sc(10, f)}px ${sc(14, f)}px` }}>
        <div style={{ width: sc(80, f), flexShrink: 0 }}>
          <div style={{ fontSize: sc(7.5, f), color: "#555", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: sc(4, f) }}>CONTACT</div>
          {[d.personal.phone, d.personal.email, d.personal.linkedin, d.personal.github].filter(Boolean).map((v, i) => <div key={i} style={{ fontSize: sc(7, f), color: "#555", marginBottom: sc(1, f), wordBreak: "break-all" }}>{v}</div>)}
          {d.skills.some(s => s.name) && <>
            <div style={{ fontSize: sc(7.5, f), color: "#555", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", marginTop: sc(8, f), marginBottom: sc(2, f), borderBottom: `${sc(1, f)}px solid #bbb`, paddingBottom: sc(1, f) }}>SKILLS</div>
            {d.skills.filter(s => s.name).map((s, i) => <div key={i} style={{ fontSize: sc(7, f), color: "#555", marginBottom: sc(2, f) }}>{s.name}</div>)}
          </>}
          <div style={{ fontSize: sc(7.5, f), color: "#555", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", marginTop: sc(8, f), marginBottom: sc(2, f), borderBottom: `${sc(1, f)}px solid #bbb`, paddingBottom: sc(1, f) }}>EDUCATION</div>
          {d.education.map((e, i) => <div key={i} style={{ marginBottom: sc(4, f) }}><div style={{ fontSize: sc(7.5, f), color: "#444" }}>{e.institution}</div><div style={{ fontSize: sc(7, f), color: "#777", fontWeight: 700 }}>{e.year}</div><div style={{ fontSize: sc(7, f), color: "#555" }}>{e.degree}</div></div>)}
        </div>
        <div style={{ flex: 1 }}>
          {d.personal.summary && <><div style={{ fontSize: sc(7.5, f), color: "#555", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: sc(3, f) }}>PROFILE</div><div style={{ fontSize: sc(7.5, f), color: "#444", marginBottom: sc(8, f) }}>{d.personal.summary}</div></>}
          <div style={{ fontSize: sc(7.5, f), color: "#555", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: sc(3, f) }}>EXPERIENCE</div>
          {d.isFresher && <div style={{ fontSize: sc(7.5, f), fontStyle: "italic", color: "#777", marginBottom: sc(4, f) }}>Fresher – seeking opportunity</div>}
          {d.workExperience.filter(w => w.jobTitle || w.company).map((w, i) => <div key={i} style={{ marginBottom: sc(6, f) }}><div style={{ fontSize: sc(8, f), color: "#333" }}>{w.jobTitle}</div><div style={{ fontSize: sc(7.5, f), color: "#777", fontWeight: 700 }}>{w.duration}</div><div style={{ fontSize: sc(7.5, f), color: "#444" }}>{w.description}</div></div>)}
          {d.projects.some(p => p.name) && <><div style={{ fontSize: sc(7.5, f), color: "#555", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", margin: `${sc(4, f)}px 0 ${sc(3, f)}px` }}>PROJECTS</div>{d.projects.filter(p => p.name).map((p, i) => <div key={i} style={{ marginBottom: sc(4, f) }}><strong style={{ fontSize: sc(8, f) }}>{p.name}</strong>{p.tech && <span style={{ fontSize: sc(7, f), color: "#777" }}> | {p.tech}</span>}{p.description && <div style={{ fontSize: sc(7.5, f), color: "#444" }}>{p.description}</div>}</div>)}</>}
          {d.achievements.some(a => a.text) && <><div style={{ fontSize: sc(7.5, f), color: "#555", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", margin: `${sc(4, f)}px 0 ${sc(3, f)}px` }}>ACHIEVEMENTS</div>{d.achievements.filter(a => a.text).map((a, i) => <div key={i} style={{ fontSize: sc(7.5, f), color: "#444" }}>• {a.text}</div>)}</>}
        </div>
      </div>
    </div>
  );
}

function SimpleSansT({ d, f = 1 }) {
  return (
    <div style={{ fontFamily: "'Calibri',Arial,sans-serif", fontSize: sc(10, f), color: "#222", lineHeight: 1.5, padding: `${sc(14, f)}px ${sc(16, f)}px`, background: "#fff" }}>
      <div style={{ marginBottom: sc(6, f) }}>
        <div style={{ fontSize: sc(20, f), fontWeight: 700, color: "#111" }}>{d.personal.firstName} {d.personal.lastName}</div>
        <div style={{ fontSize: sc(8, f), color: "#444", marginTop: sc(2, f) }}>
          {d.personal.phone && <span>📞 {d.personal.phone}  </span>}
          {d.personal.email && <span>✉ {d.personal.email}  </span>}
          {d.personal.linkedin && <span style={{ color: "#0077b5" }}>in {d.personal.linkedin}  </span>}
          {d.personal.github && <span>⌥ {d.personal.github}</span>}
        </div>
      </div>
      {d.education.length > 0 && <SSSection title="Education" f={f}>{d.education.map((e, i) => <div key={i} style={{ marginBottom: sc(3, f) }}><div style={{ fontSize: sc(8.5, f) }}>{e.institution}{e.location ? ` (${e.location})` : ""}</div><div style={{ fontSize: sc(8, f) }}>{e.degree}{e.year ? ` (${e.year})` : ""}</div></div>)}</SSSection>}
      <SSSection title="Experience" f={f}>
        {d.isFresher && <div style={{ fontSize: sc(8, f), marginLeft: sc(8, f) }}>Fresher in tech Industry</div>}
        {d.workExperience.filter(w => w.jobTitle || w.company).map((w, i) => <div key={i} style={{ marginBottom: sc(4, f) }}><div style={{ display: "flex", justifyContent: "space-between", fontSize: sc(8.5, f) }}><strong>{w.jobTitle}</strong><span style={{ color: "#555" }}>{w.duration}</span></div><div style={{ fontSize: sc(8, f), color: "#555" }}>{w.company}{w.location ? ` – ${w.location}` : ""}</div>{w.description && <div style={{ fontSize: sc(7.5, f), marginLeft: sc(8, f) }}>• {w.description}</div>}</div>)}
      </SSSection>
      {d.projects.some(p => p.name) && <SSSection title="Project" f={f}>{d.projects.filter(p => p.name).map((p, i) => <div key={i} style={{ marginBottom: sc(3, f) }}><strong style={{ fontSize: sc(8, f) }}>• {p.name}</strong><div style={{ fontSize: sc(7.5, f), marginLeft: sc(10, f) }}>{p.description}</div>{p.tech && <div style={{ fontSize: sc(7.5, f), color: "#555", marginLeft: sc(10, f) }}>Tech: {p.tech}</div>}</div>)}</SSSection>}
      {d.skills.some(s => s.name) && <SSSection title="Technical Skills" f={f}>{d.skills.filter(s => s.name).map((s, i) => <div key={i} style={{ fontSize: sc(8, f) }}>• {s.name}</div>)}</SSSection>}
      {d.achievements.some(a => a.text) && <SSSection title="Achievements" f={f}>{d.achievements.filter(a => a.text).map((a, i) => <div key={i} style={{ fontSize: sc(8, f) }}>• {a.text}</div>)}</SSSection>}
      {d.personal.summary && <SSSection title="Summary" f={f}><div style={{ fontSize: sc(8, f) }}>{d.personal.summary}</div></SSSection>}
    </div>
  );
}

function ResumePreview({ template, data, f = 1 }) {
  if (template === "modern")       return <ModernT d={data} f={f} />;
  if (template === "executive")    return <ExecutiveT d={data} f={f} />;
  if (template === "greenclassic") return <GreenClassicT d={data} f={f} />;
  if (template === "twocolumn")    return <TwoColumnT d={data} f={f} />;
  if (template === "simplesans")   return <SimpleSansT d={data} f={f} />;
  return <ClassicT d={data} f={f} />;
}

function TemplateCard({ tmpl, selected, data, onSelect }) {
  return (
    <div onClick={onSelect} style={{ border: selected ? "2.5px solid #1a3c6e" : "1.5px solid #dde2ec", borderRadius: 10, background: "#fff", cursor: "pointer", overflow: "hidden", boxShadow: selected ? "0 4px 20px rgba(26,60,110,.18)" : "0 1px 6px rgba(0,0,0,.06)", transition: "all .2s", position: "relative" }}>
      {tmpl.recommended && <div style={{ position: "absolute", bottom: 44, left: "50%", transform: "translateX(-50%)", background: "rgba(255,220,220,.95)", color: "#c0392b", fontSize: 10, fontWeight: 800, letterSpacing: "0.08em", padding: "4px 14px", borderRadius: 4, textTransform: "uppercase", zIndex: 2, whiteSpace: "nowrap", border: "1px solid #e8b4b4" }}>★ RECOMMENDED</div>}
      {selected && <div style={{ position: "absolute", top: 8, right: 8, width: 24, height: 24, background: "#1a3c6e", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 13, fontWeight: 700, zIndex: 2 }}>✓</div>}
      <div style={{ height: 230, overflow: "hidden", borderBottom: "1px solid #f0f0f0", position: "relative" }}>
        <div style={{ transform: "scale(0.44)", transformOrigin: "top left", width: "227%", pointerEvents: "none" }}>
          <ResumePreview template={tmpl.value} data={data} f={1} />
        </div>
      </div>
      <div style={{ padding: "10px 14px 12px" }}>
        <div style={{ fontWeight: 700, fontSize: 13, color: "#1a1a1a", marginBottom: 2 }}>{tmpl.title}</div>
        <div style={{ fontSize: 11, color: "#888" }}>{tmpl.description}</div>
      </div>
    </div>
  );
}

// ── MAIN ─────────────────────────────────────────────────────────────────────
export default function ResumeBuilder() {
  const [page, setPage] = useState("welcome");
  const [experience, setExperience] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState("classic");
  const [activeStep, setActiveStep] = useState("personal");
  const [completedSteps, setCompletedSteps] = useState(new Set());

  const [resumeData, setResumeData] = useState({
    personal: { firstName:"", lastName:"", profession:"", city:"", country:"", phone:"", email:"", linkedin:"", github:"" },
    personal_summary: "",
    education: [{ degree:"", institution:"", location:"", year:"" }],
    workExperience: [{ jobTitle:"", company:"", location:"", duration:"", description:"" }],
    skills: [{ name:"" }, { name:"" }],
    projects: [{ name:"", description:"", tech:"" }],
    achievements: [{ text:"", image:null }],
  });

  const isFresher = experience === "none";

  const sampleData = {
    personal: { firstName:"Saanvi", lastName:"Patel", profession:"Retail Sales Associate", city:"New Delhi", phone:"+91 22 1234 5677", email:"saanvipatel@sample.in", linkedin:"linkedin.com/in/saanvi", github:"github.com/saanvi" },
    personal_summary: "Motivated Sales Associate with 5 years of experience boosting sales.",
    education: [{ degree:"Diploma: Financial Accounting", institution:"Oxford Software Institute", location:"New Delhi, India", year:"June 2016" }],
    workExperience: [{ jobTitle:"Retail Sales Associate", company:"H&M", location:"New Delhi, India", duration:"05/2016 – Current", description:"Effectively upsold products, adding ₹3000 to average monthly sales." }],
    skills: [{ name:"Store opening and closing" },{ name:"Accurate Money Handling" },{ name:"Loss prevention" },{ name:"Sales expertise" },{ name:"Store Merchandising" }],
    projects: [{ name:"Sales Tracker App", description:"Built a dashboard to track daily sales targets.", tech:"React, Node.js" }],
    achievements: [{ text:"Achieved A Grade in Python Training from PC Training Institute", image:null }],
    isFresher: false,
  };

  const activeData = {
    personal: {
      firstName:  resumeData.personal.firstName  || sampleData.personal.firstName,
      lastName:   resumeData.personal.lastName   || sampleData.personal.lastName,
      profession: resumeData.personal.profession || sampleData.personal.profession,
      city:       resumeData.personal.city       || sampleData.personal.city,
      phone:      resumeData.personal.phone      || sampleData.personal.phone,
      email:      resumeData.personal.email      || sampleData.personal.email,
      linkedin:   resumeData.personal.linkedin   || sampleData.personal.linkedin,
      github:     resumeData.personal.github     || sampleData.personal.github,
    },
    personal_summary: resumeData.personal_summary || sampleData.personal_summary,
    education: resumeData.education.some(e => e.degree || e.institution) ? resumeData.education : sampleData.education,
    workExperience: resumeData.workExperience,
    skills: resumeData.skills,
    projects: resumeData.projects,
    achievements: resumeData.achievements,
    isFresher,
  };

  // preview-ready adapter
  const pd = { ...activeData, personal: { ...activeData.personal, summary: activeData.personal_summary } };

  const progress = Math.round((completedSteps.size / (STEPS.length - 1)) * 100);
  const setP = (f, v) => setResumeData(p => ({ ...p, personal: { ...p.personal, [f]: v } }));
  const setA = (key, idx, f, v) => setResumeData(p => { const a = [...p[key]]; a[idx] = { ...a[idx], [f]: v }; return { ...p, [key]: a }; });
  const addR = (key, tmpl) => setResumeData(p => ({ ...p, [key]: [...p[key], { ...tmpl }] }));
  const delR = (key, idx) => setResumeData(p => ({ ...p, [key]: p[key].filter((_, i) => i !== idx) }));

  const inp = { width:"100%", border:"1.5px solid #dde2ec", borderRadius:6, padding:"9px 12px", fontSize:14, color:"#222", background:"#fff", boxSizing:"border-box", outline:"none", fontFamily:"inherit" };
  const lbl = { display:"block", fontSize:11, fontWeight:600, color:"#555", marginBottom:5, textTransform:"uppercase", letterSpacing:"0.07em" };
  const grp = { marginBottom:16 };
  const row2 = { display:"grid", gridTemplateColumns:"1fr 1fr", gap:14 };
  const card = { background:"#f9fafb", borderRadius:8, padding:16, marginBottom:16, border:"1px solid #eee" };
  const addBtn = { background:"none", border:"1.5px dashed #1a3c6e", borderRadius:6, padding:"9px 18px", color:"#1a3c6e", fontSize:13, fontWeight:600, cursor:"pointer", marginBottom:24 };

  const markDone = s => setCompletedSteps(p => new Set([...p, s]));
  const goNext = () => {
    markDone(activeStep);
    if (activeStep === "finalize") { setPage("preview"); return; }
    const idx = STEPS.findIndex(s => s.id === activeStep);
    setActiveStep(STEPS[idx + 1].id);
  };
  const goBack = () => {
    const idx = STEPS.findIndex(s => s.id === activeStep);
    if (idx === 0) { setPage("templates"); return; }
    setActiveStep(STEPS[idx - 1].id);
  };

  const NavBtns = ({ nextLabel }) => (
    <div style={{ display:"flex", justifyContent:"space-between", marginTop:8 }}>
      <button onClick={goBack} style={{ background:"none", border:"1.5px solid #ddd", borderRadius:6, padding:"10px 20px", fontSize:13, fontWeight:600, color:"#555", cursor:"pointer" }}>← Go Back</button>
      <button onClick={goNext} style={{ background:"#1a3c6e", color:"#fff", border:"none", borderRadius:6, padding:"10px 24px", fontSize:13, fontWeight:600, cursor:"pointer" }}>{nextLabel || "Next →"}</button>
    </div>
  );

  // ── WELCOME ────────────────────────────────────────────────────────────────
  if (page === "welcome") return (
    <div style={{ minHeight:"100vh", display:"flex", alignItems:"center", justifyContent:"center", background:"linear-gradient(135deg,#1a3c6e,#2e6da4)", fontFamily:"'Helvetica Neue',Arial,sans-serif" }}>
      <div style={{ textAlign:"center", color:"#fff", padding:"40px 24px" }}>
        <div style={{ fontSize:12, letterSpacing:"0.15em", textTransform:"uppercase", color:"#a8c6e8", marginBottom:16, fontWeight:600 }}>Resume Builder</div>
        <h1 style={{ fontSize:48, fontWeight:300, margin:"0 0 12px", letterSpacing:"-0.02em" }}>Create Your<br /><span style={{ fontWeight:700 }}>Perfect Resume</span></h1>
        {/* <p style={{ fontSize:16, color:"#a8c6e8", margin:"0 0 40px", maxWidth:420 }}>6 professional templates. Fill your details in minutes.</p> */}
        <button onClick={() => setPage("experience")} style={{ background:"#fff", color:"#1a3c6e", border:"none", borderRadius:8, padding:"14px 40px", fontSize:16, fontWeight:700, cursor:"pointer" }}>Start Building →</button>
      </div>
    </div>
  );

  // ── EXPERIENCE ─────────────────────────────────────────────────────────────
  if (page === "experience") return (
    <div style={{ minHeight:"100vh", display:"flex", alignItems:"center", justifyContent:"center", background:"#fff", fontFamily:"'Helvetica Neue',Arial,sans-serif", padding:"40px 24px" }}>
      <div style={{ textAlign:"center", maxWidth:820, width:"100%" }}>
        <h1 style={{ fontSize:34, fontWeight:800, color:"#0d1b3e", margin:"0 0 10px" }}>
          How long have you been working?{" "}
          <span title="We use this to recommend best-fit templates" style={{ display:"inline-flex", alignItems:"center", justifyContent:"center", width:24, height:24, borderRadius:"50%", background:"#0d1b3e", color:"#fff", fontSize:12, fontWeight:700, verticalAlign:"middle", cursor:"help" }}>i</span>
        </h1>
        <p style={{ fontSize:16, color:"#666", margin:"0 0 40px" }}>We'll find the best templates for your experience level.</p>
        <div style={{ display:"flex", gap:12, justifyContent:"center", flexWrap:"wrap", marginBottom:44 }}>
          {EXP_OPTIONS.map(opt => (
            <button key={opt.value} onClick={() => setExperience(opt.value)} style={{ border: experience === opt.value ? "2px solid #1a3c6e" : "1.5px solid #ccc", borderRadius:12, padding:"15px 26px", fontSize:14, fontWeight:500, background: experience === opt.value ? "#eef3fb" : "#fff", color: experience === opt.value ? "#1a3c6e" : "#333", cursor:"pointer", transition:"all .15s", minWidth:148 }}>{opt.label}</button>
          ))}
        </div>
        <div style={{ display:"flex", justifyContent:"space-between", maxWidth:340, margin:"0 auto" }}>
          <button onClick={() => setPage("welcome")} style={{ background:"none", border:"1.5px solid #ddd", borderRadius:6, padding:"10px 20px", fontSize:13, fontWeight:600, color:"#555", cursor:"pointer" }}>← Back</button>
          <button onClick={() => { if (experience) setPage("templates"); }} style={{ background: experience ? "#1a3c6e" : "#ccc", color:"#fff", border:"none", borderRadius:6, padding:"10px 24px", fontSize:13, fontWeight:600, cursor: experience ? "pointer" : "not-allowed" }}>Continue →</button>
        </div>
      </div>
    </div>
  );

  // ── TEMPLATES ──────────────────────────────────────────────────────────────
  if (page === "templates") return (
    <div style={{ minHeight:"100vh", background:"#f7f8fc", fontFamily:"'Helvetica Neue',Arial,sans-serif", padding:"36px 24px" }}>
      <div style={{ maxWidth:1060, margin:"0 auto" }}>
        <div style={{ textAlign:"center", marginBottom:28 }}>
          <h1 style={{ fontSize:26, fontWeight:700, color:"#1a1a1a", margin:"0 0 6px" }}>Pick Your Design</h1>
          <p style={{ fontSize:13, color:"#666", margin:0 }}>Experience: <strong>{EXP_OPTIONS.find(e => e.value === experience)?.label}</strong></p>
        </div>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:16, marginBottom:16 }}>
          {TEMPLATES.slice(0, 3).map(t => <TemplateCard key={t.value} tmpl={t} selected={selectedTemplate === t.value} data={pd} onSelect={() => setSelectedTemplate(t.value)} />)}
        </div>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:16, marginBottom:28 }}>
          {TEMPLATES.slice(3, 6).map(t => <TemplateCard key={t.value} tmpl={t} selected={selectedTemplate === t.value} data={pd} onSelect={() => setSelectedTemplate(t.value)} />)}
        </div>
        <div style={{ textAlign:"center" }}>
          <button onClick={() => setPage("builder")} style={{ background:"#1a3c6e", color:"#fff", border:"none", borderRadius:8, padding:"13px 44px", fontSize:15, fontWeight:700, cursor:"pointer" }}>
            Use {TEMPLATES.find(t => t.value === selectedTemplate)?.title} Template →
          </button>
          <div style={{ marginTop:10 }}>
            <button onClick={() => setPage("experience")} style={{ background:"none", border:"none", color:"#888", fontSize:12, cursor:"pointer", textDecoration:"underline" }}>← Change experience level</button>
          </div>
        </div>
      </div>
    </div>
  );

  // ── BUILDER ────────────────────────────────────────────────────────────────
  if (page === "builder") return (
    <div style={{ minHeight:"100vh", display:"flex", fontFamily:"'Helvetica Neue',Arial,sans-serif", background:"#f7f8fc" }}>
      {/* Sidebar */}
      <div style={{ width:205, background:"#1a2744", color:"#fff", display:"flex", flexDirection:"column", flexShrink:0 }}>
        <div style={{ padding:"20px 16px 12px", borderBottom:"1px solid rgba(255,255,255,.1)" }}>
          <div style={{ fontSize:9, letterSpacing:"0.12em", color:"#7b9ec8", textTransform:"uppercase", fontWeight:600 }}>Resume Builder</div>
        </div>
        <nav style={{ flex:1, padding:"6px 0" }}>
          {STEPS.map(step => {
            const isA = activeStep === step.id;
            const isD = completedSteps.has(step.id);
            return (
              <button key={step.id} onClick={() => setActiveStep(step.id)} style={{ width:"100%", background:isA?"rgba(255,255,255,.12)":"transparent", border:"none", color:isA?"#fff":isD?"#7fc47f":"#8aacd4", padding:"10px 16px", textAlign:"left", cursor:"pointer", display:"flex", alignItems:"center", gap:10, fontSize:12, fontWeight:isA?600:400 }}>
                <div style={{ width:22, height:22, borderRadius:"50%", border:`2px solid ${isA?"#fff":isD?"#7fc47f":"#4a6fa5"}`, background:isD?"#7fc47f":isA?"rgba(255,255,255,.2)":"transparent", display:"flex", alignItems:"center", justifyContent:"center", fontSize:9, fontWeight:700, color:isD?"#fff":isA?"#fff":"#8aacd4", flexShrink:0 }}>
                  {isD ? "✓" : step.icon}
                </div>
                {step.label}
              </button>
            );
          })}
        </nav>
        <div style={{ padding:"12px 16px", borderTop:"1px solid rgba(255,255,255,.1)" }}>
          <div style={{ fontSize:9, color:"#7b9ec8", marginBottom:5, display:"flex", justifyContent:"space-between" }}><span>Completeness</span><span>{progress}%</span></div>
          <div style={{ height:3, background:"rgba(255,255,255,.15)", borderRadius:2 }}>
            <div style={{ height:"100%", width:`${progress}%`, background:"#4caf50", borderRadius:2, transition:"width .4s" }} />
          </div>
        </div>
        <div style={{ padding:"8px 16px", borderTop:"1px solid rgba(255,255,255,.1)" }}>
          <button onClick={() => setPage("templates")} style={{ background:"none", border:"none", color:"#4a9fd4", fontSize:10, cursor:"pointer", padding:0, textDecoration:"underline" }}>Change template</button>
        </div>
      </div>

      {/* Form area */}
      <div style={{ flex:1, padding:"26px 32px", overflowY:"auto", maxWidth:600 }}>

        {activeStep === "personal" && (
          <div>
            <h2 style={{ fontSize:21, fontWeight:700, color:"#1a1a1a", margin:"0 0 4px" }}>What's the best way for employers to contact you?</h2>
            <p style={{ fontSize:13, color:"#888", margin:"0 0 22px" }}>Include email, phone, LinkedIn & GitHub for best results.</p>
            <div style={row2}>
              <div style={grp}><label style={lbl}>First Name *</label><input style={inp} value={resumeData.personal.firstName} onChange={e => setP("firstName", e.target.value)} placeholder="First Name" /></div>
              <div style={grp}><label style={lbl}>Last Name *</label><input style={inp} value={resumeData.personal.lastName} onChange={e => setP("lastName", e.target.value)} placeholder="Last Name" /></div>
            </div>
            {/* <div style={grp}><label style={lbl}>Profession / Job Title</label><input style={inp} value={resumeData.personal.profession} onChange={e => setP("profession", e.target.value)} placeholder="e.g. Software Developer" /></div> */}
            <div style={row2}>
              <div style={grp}><label style={lbl}>City</label><input style={inp} value={resumeData.personal.city} onChange={e => setP("city", e.target.value)} placeholder="New Delhi" /></div>
              <div style={grp}><label style={lbl}>Country</label><input style={inp} value={resumeData.personal.country} onChange={e => setP("country", e.target.value)} placeholder="India" /></div>
            </div>
            <div style={row2}>
              <div style={grp}><label style={lbl}>Phone</label><input style={inp} value={resumeData.personal.phone} onChange={e => setP("phone", e.target.value)} placeholder="+91 98765 43210" /></div>
              <div style={grp}><label style={lbl}>Email *</label><input style={inp} type="email" value={resumeData.personal.email} onChange={e => setP("email", e.target.value)} placeholder="you@example.com" /></div>
            </div>
            <div style={grp}><label style={lbl}>LinkedIn URL</label><input style={inp} value={resumeData.personal.linkedin} onChange={e => setP("linkedin", e.target.value)} placeholder="linkedin.com/in/yourprofile" /></div>
            <div style={grp}><label style={lbl}>GitHub URL</label><input style={inp} value={resumeData.personal.github} onChange={e => setP("github", e.target.value)} placeholder="github.com/yourusername" /></div>
            <NavBtns />
          </div>
        )}

        {activeStep === "workExperience" && (
          <div>
            <h2 style={{ fontSize:21, fontWeight:700, color:"#1a1a1a", margin:"0 0 4px" }}>Work Experience</h2>
            {isFresher && (
              <div style={{ background:"#e8f5e9", border:"1px solid #c8e6c9", borderRadius:8, padding:"12px 16px", marginBottom:16, fontSize:13, color:"#2e7d32" }}>
                <strong>Fresher!</strong> Your resume will show "Fresher in tech industry." You can still add internships or part-time work below.
              </div>
            )}
            <p style={{ fontSize:13, color:"#888", margin:"0 0 18px" }}>{isFresher ? "Add any internship or volunteer work (optional)." : "List your most recent job first."}</p>
            {resumeData.workExperience.map((w, i) => (
              <div key={i} style={card}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:10 }}>
                  <div style={{ fontSize:13, fontWeight:600, color:"#1a1a1a" }}>Job #{i + 1}</div>
                  {resumeData.workExperience.length > 1 && <button onClick={() => delR("workExperience", i)} style={{ background:"none", border:"none", color:"#e53935", cursor:"pointer", fontSize:12 }}>✕ Remove</button>}
                </div>
                <div style={row2}>
                  <div style={grp}><label style={lbl}>Job Title</label><input style={inp} value={w.jobTitle} onChange={e => setA("workExperience", i, "jobTitle", e.target.value)} placeholder="Software Developer" /></div>
                  <div style={grp}><label style={lbl}>Company</label><input style={inp} value={w.company} onChange={e => setA("workExperience", i, "company", e.target.value)} placeholder="Company Name" /></div>
                </div>
                <div style={row2}>
                  <div style={grp}><label style={lbl}>Location</label><input style={inp} value={w.location} onChange={e => setA("workExperience", i, "location", e.target.value)} placeholder="City, Country" /></div>
                  <div style={grp}><label style={lbl}>Duration</label><input style={inp} value={w.duration} onChange={e => setA("workExperience", i, "duration", e.target.value)} placeholder="Jan 2022 – Present" /></div>
                </div>
                <div style={grp}><label style={lbl}>Description / Responsibilities</label><textarea style={{ ...inp, resize:"vertical", minHeight:72 }} value={w.description} onChange={e => setA("workExperience", i, "description", e.target.value)} placeholder="Describe what you did and achieved..." /></div>
              </div>
            ))}
            <button style={addBtn} onClick={() => addR("workExperience", { jobTitle:"", company:"", location:"", duration:"", description:"" })}>+ Add Another Job</button>
            <NavBtns />
          </div>
        )}

        {activeStep === "education" && (
          <div>
            <h2 style={{ fontSize:21, fontWeight:700, color:"#1a1a1a", margin:"0 0 4px" }}>Education</h2>
            <p style={{ fontSize:13, color:"#888", margin:"0 0 18px" }}>Add your highest qualification first.</p>
            {resumeData.education.map((e, i) => (
              <div key={i} style={card}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:10 }}>
                  <div style={{ fontSize:13, fontWeight:600, color:"#1a1a1a" }}>Education #{i + 1}</div>
                  {resumeData.education.length > 1 && <button onClick={() => delR("education", i)} style={{ background:"none", border:"none", color:"#e53935", cursor:"pointer", fontSize:12 }}>✕ Remove</button>}
                </div>
                <div style={row2}>
                  <div style={grp}><label style={lbl}>Degree / Course</label><input style={inp} value={e.degree} onChange={ev => setA("education", i, "degree", ev.target.value)} placeholder="B.Tech Computer Science" /></div>
                  <div style={grp}><label style={lbl}>Year</label><input style={inp} value={e.year} onChange={ev => setA("education", i, "year", ev.target.value)} placeholder="2020–2024" /></div>
                </div>
                <div style={row2}>
                  <div style={grp}><label style={lbl}>Institution</label><input style={inp} value={e.institution} onChange={ev => setA("education", i, "institution", ev.target.value)} placeholder="University / College" /></div>
                  <div style={grp}><label style={lbl}>Location</label><input style={inp} value={e.location} onChange={ev => setA("education", i, "location", ev.target.value)} placeholder="Delhi" /></div>
                </div>
              </div>
            ))}
            <button style={addBtn} onClick={() => addR("education", { degree:"", institution:"", location:"", year:"" })}>+ Add Education</button>
            <NavBtns />
          </div>
        )}

        {activeStep === "skills" && (
          <div>
            <h2 style={{ fontSize:21, fontWeight:700, color:"#1a1a1a", margin:"0 0 4px" }}>Skills</h2>
            <p style={{ fontSize:13, color:"#888", margin:"0 0 18px" }}>  </p>
            <div style={{ background:"#f9fafb", borderRadius:8, padding:16, border:"1px solid #eee", marginBottom:16 }}>
              {resumeData.skills.map((s, i) => (
                <div key={i} style={{ display:"flex", alignItems:"center", gap:10, marginBottom:10 }}>
                  <span style={{ color:"#1a3c6e", fontSize:20, fontWeight:700, lineHeight:1, flexShrink:0 }}>•</span>
                  <input style={{ ...inp, flex:1 }} value={s.name} onChange={e => setA("skills", i, "name", e.target.value)} placeholder={`e.g. React.js, Node.js, Communication…`} />
                  {resumeData.skills.length > 1 && <button onClick={() => delR("skills", i)} style={{ background:"none", border:"none", color:"#e53935", cursor:"pointer", fontSize:14, padding:"0 4px", flexShrink:0 }}>✕</button>}
                </div>
              ))}
            </div>
            <button style={addBtn} onClick={() => addR("skills", { name:"" })}>+ Add Skill</button>
            <NavBtns />
          </div>
        )}

        {activeStep === "projects" && (
          <div>
            <h2 style={{ fontSize:21, fontWeight:700, color:"#1a1a1a", margin:"0 0 4px" }}>Projects</h2>
            <p style={{ fontSize:13, color:"#888", margin:"0 0 18px" }}>Showcase your best work — even personal or college projects count!</p>
            {resumeData.projects.map((p, i) => (
              <div key={i} style={card}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:10 }}>
                  <div style={{ fontSize:13, fontWeight:600, color:"#1a1a1a" }}>Project #{i + 1}</div>
                  {resumeData.projects.length > 1 && <button onClick={() => delR("projects", i)} style={{ background:"none", border:"none", color:"#e53935", cursor:"pointer", fontSize:12 }}>✕ Remove</button>}
                </div>
                <div style={grp}><label style={lbl}>Project Name</label><input style={inp} value={p.name} onChange={e => setA("projects", i, "name", e.target.value)} placeholder="e.g. To-Do App" /></div>
                <div style={grp}><label style={lbl}>Description</label><textarea style={{ ...inp, resize:"vertical", minHeight:80 }} value={p.description} onChange={e => setA("projects", i, "description", e.target.value)} placeholder="Created a responsive to-do list web app using HTML, CSS, and JavaScript. Features include add, delete, and mark tasks as completed." /></div>
                <div style={grp}><label style={lbl}>Technologies Used</label><input style={inp} value={p.tech} onChange={e => setA("projects", i, "tech", e.target.value)} placeholder="HTML, CSS, JavaScript, React" /></div>
              </div>
            ))}
            <button style={addBtn} onClick={() => addR("projects", { name:"", description:"", tech:"" })}>+ Add Project</button>
            <NavBtns />
          </div>
        )}

        {activeStep === "achievements" && (
          <div>
            <h2 style={{ fontSize:21, fontWeight:700, color:"#1a1a1a", margin:"0 0 4px" }}>Achievements & Certificates</h2>
            <p style={{ fontSize:13, color:"#888", margin:"0 0 18px" }}>Awards, certifications, grades. Upload certificate image optionally.</p>
            {resumeData.achievements.map((a, i) => (
              <div key={i} style={card}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:10 }}>
                  <div style={{ fontSize:13, fontWeight:600, color:"#1a1a1a" }}>Achievement #{i + 1}</div>
                  {resumeData.achievements.length > 1 && <button onClick={() => delR("achievements", i)} style={{ background:"none", border:"none", color:"#e53935", cursor:"pointer", fontSize:12 }}>✕ Remove</button>}
                </div>
                <div style={grp}>
                  <label style={lbl}>Description *</label>
                  <textarea style={{ ...inp, resize:"vertical", minHeight:64 }} value={a.text} onChange={e => setA("achievements", i, "text", e.target.value)} placeholder='e.g. Achieved "A" Grade in Python Programming Training from PC Training Institute Limited' />
                </div>
                <div style={grp}>
                  <label style={lbl}>Certificate Image <span style={{ fontWeight:400, color:"#aaa", textTransform:"none", letterSpacing:0 }}>(optional)</span></label>
                  <div style={{ border:"1.5px dashed #ccc", borderRadius:8, padding:"14px 16px", textAlign:"center", background:"#fafafa" }}>
                    {a.image ? (
                      <div>
                        <img src={a.image} alt="cert" style={{ maxWidth:"100%", maxHeight:160, borderRadius:6, objectFit:"contain" }} />
                        <div style={{ marginTop:8 }}>
                          <button onClick={() => setA("achievements", i, "image", null)} style={{ background:"none", border:"1px solid #e53935", borderRadius:4, color:"#e53935", fontSize:11, padding:"3px 10px", cursor:"pointer" }}>✕ Remove Image</button>
                        </div>
                      </div>
                    ) : (
                      <label style={{ cursor:"pointer", display:"block" }}>
                        <div style={{ fontSize:26, marginBottom:4 }}>📎</div>
                        <div style={{ fontSize:13, color:"#888" }}>Click to upload certificate image</div>
                        <div style={{ fontSize:11, color:"#bbb", marginTop:3 }}>PNG, JPG supported</div>
                        <input type="file" accept="image/*" style={{ display:"none" }} onChange={ev => {
                          const file = ev.target.files[0];
                          if (!file) return;
                          const r = new FileReader();
                          r.onload = e2 => setA("achievements", i, "image", e2.target.result);
                          r.readAsDataURL(file);
                        }} />
                      </label>
                    )}
                  </div>
                </div>
              </div>
            ))}
            <button style={addBtn} onClick={() => addR("achievements", { text:"", image:null })}>+ Add Achievement</button>
            <NavBtns />
          </div>
        )}

        {activeStep === "summary" && (
          <div>
            <h2 style={{ fontSize:21, fontWeight:700, color:"#1a1a1a", margin:"0 0 4px" }}>Professional Summary</h2>
            <p style={{ fontSize:13, color:"#888", margin:"0 0 8px" }}>This appears prominently on your resume. 2–4 powerful sentences.</p>
            <div style={{ background:"#fffbea", border:"1px solid #f0e0a0", borderRadius:8, padding:"10px 14px", marginBottom:18, fontSize:12, color:"#7a5c00" }}>
              💡 <strong>Tip:</strong> Mention your top skills, experience level, and what value you bring. Keep it focused and punchy.
            </div>
            <div style={grp}>
              <label style={lbl}>Summary</label>
              <textarea style={{ ...inp, resize:"vertical", minHeight:130 }}
                value={resumeData.personal_summary}
                onChange={e => setResumeData(p => ({ ...p, personal_summary: e.target.value }))}
                placeholder={isFresher
                  ? "Recent graduate eager to apply knowledge in a real-world setting. Proficient in HTML, CSS, JavaScript and React. Passionate about building user-friendly web applications and solving problems with clean code."
                  : "Motivated [profession] with [X] years of experience in [field]. Skilled in [top skills]. Known for [strength]. Committed to [outcome]."
                }
              />
              <div style={{ fontSize:11, color:"#aaa", marginTop:4, textAlign:"right" }}>{resumeData.personal_summary.length} characters</div>
            </div>
            <NavBtns />
          </div>
        )}

        {activeStep === "finalize" && (
          <div>
            <h2 style={{ fontSize:21, fontWeight:700, color:"#1a1a1a", margin:"0 0 4px" }}>Ready to Finalize?</h2>
            <p style={{ fontSize:13, color:"#888", margin:"0 0 18px" }}>Check the live preview on the right, then click Finish.</p>
            <div style={{ background:"#e8f5e9", borderRadius:10, padding:18, marginBottom:20, border:"1px solid #c8e6c9" }}>
              <div style={{ fontSize:14, fontWeight:700, color:"#2e7d32", marginBottom:5 }}>✅ Looking good!</div>
              <div style={{ fontSize:13, color:"#388e3c" }}>Click any section in the sidebar to make edits. When you're happy, click Finish & Preview.</div>
            </div>
            <div style={{ background:"#f5f5f5", borderRadius:8, padding:"10px 14px", marginBottom:18, fontSize:12, color:"#555" }}>
              <strong>Template:</strong> {TEMPLATES.find(t => t.value === selectedTemplate)?.title} &nbsp;|&nbsp;
              <strong>Experience:</strong> {EXP_OPTIONS.find(e => e.value === experience)?.label}
            </div>
            <NavBtns nextLabel="Finish & Preview →" />
          </div>
        )}

      </div>

      {/* Right preview */}
      <div style={{ width:262, background:"#fff", borderLeft:"1px solid #e5e9f0", padding:"12px 10px", overflowY:"auto", display:"flex", flexDirection:"column", gap:10, flexShrink:0 }}>
        <div style={{ fontSize:10, color:"#888", textAlign:"center", letterSpacing:"0.08em", textTransform:"uppercase", fontWeight:600 }}>Live Preview</div>
        <div style={{ background:"#e8f5e9", borderRadius:7, padding:"6px 10px", display:"flex", alignItems:"center", gap:8 }}>
          <div style={{ fontSize:12, color:"#2e7d32", fontWeight:700 }}>↑ 30%</div>
          <div style={{ fontSize:10, color:"#388e3c" }}>Higher chance of getting a job</div>
        </div>
        <div style={{ border:"2px solid #1a3c6e", borderRadius:4, overflow:"hidden", background:"#fff" }}>
          <ResumePreview template={selectedTemplate} data={pd} f={0.48} />
        </div>
        <button onClick={() => setPage("templates")} style={{ fontSize:10, color:"#1a3c6e", background:"none", border:"none", cursor:"pointer", textDecoration:"underline", padding:0, textAlign:"center" }}>Change template</button>
      </div>
    </div>
  );

  // ── PREVIEW ────────────────────────────────────────────────────────────────
  if (page === "preview") return (
    <div style={{ minHeight:"100vh", background:"#f7f8fc", fontFamily:"'Helvetica Neue',Arial,sans-serif", padding:"28px 20px" }}>
      <div style={{ maxWidth:1060, margin:"0 auto", display:"flex", gap:28 }}>
        <div style={{ flex:1 }}>
          <h2 style={{ fontSize:20, fontWeight:700, color:"#1a1a1a", marginBottom:14 }}>Your Resume is Ready</h2>
          <div style={{ background:"#fff", borderRadius:8, overflow:"hidden", boxShadow:"0 2px 24px rgba(0,0,0,.10)" }}>
            <ResumePreview template={selectedTemplate} data={pd} f={1.1} />
          </div>
          {resumeData.achievements.some(a => a.image) && (
            <div style={{ marginTop:20 }}>
              <h3 style={{ fontSize:15, fontWeight:700, color:"#1a1a1a", marginBottom:10 }}>Uploaded Certificates</h3>
              <div style={{ display:"flex", gap:10, flexWrap:"wrap" }}>
                {resumeData.achievements.filter(a => a.image).map((a, i) => (
                  <div key={i} style={{ border:"1px solid #eee", borderRadius:8, overflow:"hidden", width:190 }}>
                    <img src={a.image} alt={`cert-${i}`} style={{ width:"100%", height:130, objectFit:"cover" }} />
                    {a.text && <div style={{ padding:"6px 10px", fontSize:10, color:"#555" }}>{a.text.slice(0, 55)}{a.text.length > 55 ? "…" : ""}</div>}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        <div style={{ width:210, flexShrink:0 }}>
          <div style={{ background:"#fff", borderRadius:12, padding:20, boxShadow:"0 2px 16px rgba(0,0,0,.08)" }}>
            <div style={{ fontSize:20, marginBottom:4 }}>✨</div>
            <h3 style={{ fontSize:16, fontWeight:700, margin:"0 0 6px", color:"#1a1a1a" }}>All Set!</h3>
            <p style={{ fontSize:12, color:"#666", margin:"0 0 16px" }}>Your resume is ready to download.</p>
            <button onClick={() => window.print()} style={{ width:"100%", background:"#1a3c6e", color:"#fff", border:"none", borderRadius:7, padding:"10px 0", fontSize:13, fontWeight:600, cursor:"pointer", marginBottom:8 }}>🖨️ Print Resume</button>
            <button style={{ width:"100%", background:"#2e6da4", color:"#fff", border:"none", borderRadius:7, padding:"10px 0", fontSize:13, fontWeight:600, cursor:"pointer", marginBottom:16 }}>📥 Download PDF</button>
            <button onClick={() => setPage("builder")} style={{ width:"100%", background:"none", color:"#1a3c6e", border:"1.5px solid #1a3c6e", borderRadius:7, padding:"9px 0", fontSize:12, fontWeight:600, cursor:"pointer", marginBottom:8 }}>✏️ Edit Details</button>
            <button onClick={() => { setPage("welcome"); setCompletedSteps(new Set()); setActiveStep("personal"); setExperience(""); }} style={{ width:"100%", background:"none", color:"#666", border:"1.5px solid #ddd", borderRadius:7, padding:"9px 0", fontSize:12, fontWeight:600, cursor:"pointer" }}>➕ Create New Resume</button>
            <div style={{ marginTop:14, padding:"10px 0", borderTop:"1px solid #f0f0f0", fontSize:11, color:"#888" }}>
              <div><strong>Template:</strong> {TEMPLATES.find(t => t.value === selectedTemplate)?.title}</div>
              <div><strong>Experience:</strong> {EXP_OPTIONS.find(e => e.value === experience)?.label}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}