import { useState, useRef, useEffect } from "react";

// ── Constants ────────────────────────────────────────────────────────────────
const STEPS = [
  { id: "personal",       label: "Heading",      n: "1", icon: "👤" },
  { id: "workExperience", label: "Experience",   n: "2", icon: "💼" },
  { id: "education",      label: "Education",    n: "3", icon: "🎓" },
  { id: "skills",         label: "Skills",       n: "4", icon: "⚡" },
  { id: "projects",       label: "Projects",     n: "5", icon: "💻" },
  { id: "achievements",   label: "Achievements", n: "6", icon: "🏆" },
  { id: "finalize",       label: "Finalize",     n: "7", icon: "✨" },
];

const TEMPLATES = [
  { value: "classic",      title: "Classic Serif",  recommended: true,  desc: "Timeless elegant serif, highly trusted by recruiters." },
  { value: "modern",       title: "Modern Bold",    recommended: false, desc: "Sleek and bold header, excellent contrast." },
  { value: "executive",    title: "Executive Two",  recommended: false, desc: "A tailored two-column layout for senior roles." },
  { value: "greenclassic", title: "Sage Classic",   recommended: false, desc: "Serif layout with professional green headers." },
  { value: "twocolumn",    title: "Two Column",     recommended: false, desc: "Left sidebar for details + right main column." },
  { value: "simplesans",   title: "Simple Sans",    recommended: false, desc: "Clean, minimalist sans-serif with thin rules." },
];

const EXP = [
  { value: "none",  label: "Fresher",         icon: "🌱", desc: "Just starting out, seeking entry-level opportunity." },
  { value: "lt3",   label: "Junior (0-3 yr)", icon: "🚀", desc: "Building core skills and gaining initial experience." },
  { value: "3to5",  label: "Mid (3-5 yr)",    icon: "💼", desc: "Demonstrated skills and solid track record." },
  { value: "5to10", label: "Senior (5-10 yr)",icon: "🌟", desc: "Leading projects and mentoring team members." },
  { value: "10p",   label: "Executive (10+)", icon: "👑", desc: "Shaping strategy and driving organizational growth." },
];

// ── Helpers ──────────────────────────────────────────────────────────────────
const s = (base, f) => base * f;

// Clickable link — opens in new tab
function L({ href, children, style }) {
  if (!href) return <span style={style}>{children}</span>;
  const url = href.startsWith("http") ? href : `https://${href}`;
  return (
    <a href={url} target="_blank" rel="noopener noreferrer" style={{ color: "inherit", textDecoration: "underline", ...style }}>
      {children}
    </a>
  );
}

// Lines from textarea
const lines = str => (str || "").split("\n").map(l => l.trim()).filter(Boolean);

// ── Section title components ─────────────────────────────────────────────────
const SecTitle = ({ text, f, color = "#222", borderColor = "#bbb", serif }) => (
  <div style={{
    fontFamily: serif ? "'Lora', Georgia, serif" : "'Inter', sans-serif",
    fontSize: s(9.5, f),
    fontWeight: 700,
    borderBottom: `${s(1.5, f)}px solid ${borderColor}`,
    paddingBottom: s(3, f),
    marginBottom: s(6, f),
    letterSpacing: "0.06em",
    textTransform: "uppercase",
    color
  }}>
    {text}
  </div>
);

// ── Resume contact line ──────────────────────────────────────────────────────
function ContactLine({ d, f, sep = " • " }) {
  const parts = [];
  if (d.city)     parts.push(<span key="c">{d.city}</span>);
  if (d.phone)    parts.push(<span key="p">{d.phone}</span>);
  if (d.email)    parts.push(<span key="e">{d.email}</span>);
  if (d.linkedin) parts.push(<L key="li" href={d.linkedin}>LinkedIn</L>);
  if (d.github)   parts.push(<L key="gh" href={d.github}>GitHub</L>);
  return (
    <div style={{
      fontSize: s(8.5, f),
      color: "#555",
      display: "flex",
      flexWrap: "wrap",
      justifyContent: "center",
      gap: s(4, f),
      fontWeight: 400
    }}>
      {parts.map((el, i) => (
        <span key={i} style={{ display: "inline-flex", alignItems: "center" }}>
          {i > 0 && <span style={{ margin: `0 ${s(2.5, f)}px`, color: "#888", fontWeight: "normal" }}>{sep}</span>}
          {el}
        </span>
      ))}
    </div>
  );
}

// ── TEMPLATE: Classic ────────────────────────────────────────────────────────
function TClassic({ d, f = 1 }) {
  const p = d.personal;
  return (
    <div style={{
      fontFamily: "'Lora', Georgia, serif",
      fontSize: s(10, f),
      color: "#27272a",
      lineHeight: 1.5,
      padding: `${s(24, f)}px ${s(26, f)}px`,
      width: "100%",
      boxSizing: "border-box",
      background: "#fff"
    }}>
      {/* Header */}
      <div style={{ textAlign: "center", borderBottom: `${s(2.5, f)}px solid #1e3a8a`, paddingBottom: s(10, f), marginBottom: s(12, f) }}>
        <div style={{ fontSize: s(22, f), fontWeight: 700, color: "#1e3a8a", letterSpacing: "-0.01em" }}>
          {p.firstName} {p.lastName}
        </div>
        {p.profession && <div style={{ fontSize: s(10, f), color: "#4b5563", textTransform: "uppercase", letterSpacing: "0.1em", marginTop: s(2, f), fontWeight: 500 }}>{p.profession}</div>}
        <div style={{ marginTop: s(6, f) }}><ContactLine d={p} f={f} /></div>
      </div>

      {/* Summary */}
      {d.summary && (
        <div style={{ marginBottom: s(10, f), fontSize: s(9.5, f), fontStyle: "italic", color: "#3f3f46", textAlign: "center", padding: `0 ${s(10, f)}px` }}>
          "{d.summary}"
        </div>
      )}

      {/* Education */}
      {d.education.some(e => e.degree || e.institution) && (
        <div style={{ marginBottom: s(10, f) }}>
          <SecTitle text="Education" f={f} color="#1e3a8a" borderColor="#1e3a8a" serif />
          {d.education.filter(e => e.degree || e.institution).map((e, i) => (
            <div key={i} style={{ display: "flex", justifyContent: "space-between", fontSize: s(9.5, f), marginBottom: s(4, f) }}>
              <div>
                <strong>{e.degree}</strong>
                <br />
                <span style={{ color: "#4b5563" }}>{e.institution}{e.location ? ` – ${e.location}` : ""}</span>
              </div>
              <div style={{ color: "#4b5563", whiteSpace: "nowrap", marginLeft: s(10, f), fontWeight: 500 }}>{e.year}</div>
            </div>
          ))}
        </div>
      )}

      {/* Experience */}
      {(d.workExperience.some(w => w.jobTitle || w.company) || d.isFresher) && (
        <div style={{ marginBottom: s(10, f) }}>
          <SecTitle text="Experience" f={f} color="#1e3a8a" borderColor="#1e3a8a" serif />
          {d.isFresher && <div style={{ fontSize: s(9.5, f), color: "#52525b", fontStyle: "italic", marginBottom: s(6, f) }}>Fresher – Seeking entry-level opportunity</div>}
          {d.fresherExperience && <div style={{ fontSize: s(9, f), color: "#4b5563", marginBottom: s(6, f), lineHeight: 1.4 }}>{d.fresherExperience}</div>}
          {d.workExperience.filter(w => w.jobTitle || w.company).map((w, i) => (
            <div key={i} style={{ marginBottom: s(8, f) }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: s(10, f) }}>
                <strong>{w.jobTitle}</strong>
                <span style={{ color: "#4b5563", fontWeight: 500, fontSize: s(9.5, f) }}>{w.duration}</span>
              </div>
              <div style={{ fontSize: s(9.5, f), color: "#4b5563", fontStyle: "italic", marginBottom: s(2, f) }}>
                {w.company}{w.location ? ` – ${w.location}` : ""}
              </div>
              {lines(w.rawText).map((b, j) => (
                <div key={j} style={{ fontSize: s(9, f), marginLeft: s(12, f), marginTop: s(2, f), display: "flex", gap: s(4, f) }}>
                  <span>•</span>
                  <span>{b}</span>
                </div>
              ))}
            </div>
          ))}
        </div>
      )}

      {/* Projects */}
      {d.projects.some(p => p.name) && (
        <div style={{ marginBottom: s(10, f) }}>
          <SecTitle text="Projects" f={f} color="#1e3a8a" borderColor="#1e3a8a" serif />
          {d.projects.filter(p => p.name).map((p, i) => (
            <div key={i} style={{ marginBottom: s(6, f) }}>
              <div style={{ fontSize: s(10, f), display: "flex", justifyContent: "space-between" }}>
                <strong>{p.name}</strong>
                {p.tech && <span style={{ fontSize: s(8.5, f), color: "#6b7280", fontWeight: 500 }}>{p.tech}</span>}
              </div>
              {lines(p.description).map((b, j) => (
                <div key={j} style={{ fontSize: s(9, f), marginLeft: s(8, f), marginTop: s(2, f), display: "flex", gap: s(4, f), color: "#3f3f46" }}>
                  <span>•</span>
                  <span>{b}</span>
                </div>
              ))}
            </div>
          ))}
        </div>
      )}

      {/* Skills */}
      {lines(d.skillsText).length > 0 && (
        <div style={{ marginBottom: s(10, f) }}>
          <SecTitle text="Skills" f={f} color="#1e3a8a" borderColor="#1e3a8a" serif />
          <div style={{ display: "flex", flexWrap: "wrap", gap: `${s(4, f)}px ${s(8, f)}px`, fontSize: s(9.5, f), color: "#27272a" }}>
            {lines(d.skillsText).map((sk, i) => (
              <span key={i} style={{ background: "#f3f4f6", padding: `${s(2, f)}px ${s(6, f)}px`, borderRadius: s(4, f), fontWeight: 500 }}>
                {sk}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Achievements */}
      {d.achievements.some(a => a.text) && (
        <div style={{ marginBottom: s(10, f) }}>
          <SecTitle text="Achievements" f={f} color="#1e3a8a" borderColor="#1e3a8a" serif />
          {d.achievements.filter(a => a.text).map((a, i) => (
            lines(a.text).map((b, j) => (
              <div key={`${i}-${j}`} style={{ fontSize: s(9.5, f), marginBottom: s(3, f), display: "flex", gap: s(4, f) }}>
                <span>•</span>
                <span>{b}</span>
              </div>
            ))
          ))}
        </div>
      )}
    </div>
  );
}

// ── TEMPLATE: Modern ─────────────────────────────────────────────────────────
function TModern({ d, f = 1 }) {
  const p = d.personal;
  return (
    <div style={{
      fontFamily: "'Inter', sans-serif",
      fontSize: s(9.5, f),
      color: "#1f2937",
      lineHeight: 1.45,
      width: "100%",
      boxSizing: "border-box",
      background: "#fff"
    }}>
      {/* Top Header Block */}
      <div style={{ background: "#0f172a", color: "#fff", padding: `${s(20, f)}px ${s(24, f)}px` }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
          <div>
            <span style={{ fontSize: s(24, f), fontFamily: "'Outfit', sans-serif", fontWeight: 800, color: "#38bdf8", letterSpacing: "-0.02em" }}>
              {p.firstName}{" "}
            </span>
            <span style={{ fontSize: s(24, f), fontFamily: "'Outfit', sans-serif", fontWeight: 800, color: "#fff" }}>
              {p.lastName}
            </span>
            {p.profession && <div style={{ fontSize: s(10.5, f), color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.12em", marginTop: s(3, f), fontWeight: 600 }}>{p.profession}</div>}
          </div>
          <div style={{ textAlign: "right", fontSize: s(8, f), color: "#cbd5e1", lineHeight: 1.6 }}>
            {p.city && <div>📍 {p.city}</div>}
            {p.phone && <div>📞 {p.phone}</div>}
            {p.email && <div>✉️ <L href={`mailto:${p.email}`} style={{ color: "#38bdf8" }}>{p.email}</L></div>}
            <div style={{ display: "flex", gap: s(6, f), marginTop: s(2, f), justifyContent: "flex-end" }}>
              {p.linkedin && <L href={p.linkedin} style={{ color: "#38bdf8" }}>LinkedIn</L>}
              {p.github && <L href={p.github} style={{ color: "#38bdf8" }}>GitHub</L>}
            </div>
          </div>
        </div>
      </div>

      <div style={{ padding: `${s(20, f)}px ${s(24, f)}px` }}>
        {/* Summary */}
        {d.summary && (
          <div style={{ marginBottom: s(12, f), borderLeft: `${s(3, f)}px solid #38bdf8`, paddingLeft: s(10, f), fontSize: s(9.5, f), color: "#4b5563" }}>
            {d.summary}
          </div>
        )}

        {/* Experience */}
        {(d.workExperience.some(w => w.jobTitle || w.company) || d.isFresher) && (
          <div style={{ marginBottom: s(12, f) }}>
            <SecTitle text="Professional Experience" f={f} color="#0f172a" borderColor="#e2e8f0" />
            {d.isFresher && <div style={{ fontSize: s(9.5, f), fontStyle: "italic", color: "#6b7280", marginBottom: s(6, f) }}>Fresher – Seeking entry-level opportunity</div>}
            {d.fresherExperience && <div style={{ fontSize: s(9, f), color: "#4b5563", marginBottom: s(6, f) }}>{d.fresherExperience}</div>}
            {d.workExperience.filter(w => w.jobTitle || w.company).map((w, i) => (
              <div key={i} style={{ marginBottom: s(8, f) }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: s(10, f) }}>
                  <strong>{w.jobTitle}</strong>
                  <span style={{ color: "#4f46e5", fontWeight: 600 }}>{w.duration}</span>
                </div>
                <div style={{ fontSize: s(9.5, f), color: "#4b5563", fontWeight: 500 }}>
                  {w.company}{w.location ? ` – ${w.location}` : ""}
                </div>
                {lines(w.rawText).map((b, j) => (
                  <div key={j} style={{ fontSize: s(9, f), marginLeft: s(10, f), marginTop: s(2, f), display: "flex", gap: s(4, f), color: "#374151" }}>
                    <span>•</span>
                    <span>{b}</span>
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}

        {/* Projects */}
        {d.projects.some(p => p.name) && (
          <div style={{ marginBottom: s(12, f) }}>
            <SecTitle text="Key Projects" f={f} color="#0f172a" borderColor="#e2e8f0" />
            {d.projects.filter(p => p.name).map((p, i) => (
              <div key={i} style={{ marginBottom: s(8, f) }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: s(10, f) }}>
                  <strong>{p.name}</strong>
                  {p.tech && <span style={{ fontSize: s(8.5, f), color: "#6b7280", fontWeight: 500, background: "#f3f4f6", padding: `1px ${s(4, f)}px`, borderRadius: 4 }}>{p.tech}</span>}
                </div>
                {lines(p.description).map((b, j) => (
                  <div key={j} style={{ fontSize: s(9, f), marginLeft: s(8, f), marginTop: s(2, f), color: "#4b5563", display: "flex", gap: s(4, f) }}>
                    <span>•</span>
                    <span>{b}</span>
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}

        {/* Grid for Skills and Education */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: s(16, f), marginTop: s(10, f) }}>
          {/* Education */}
          {d.education.some(e => e.degree || e.institution) && (
            <div>
              <SecTitle text="Education" f={f} color="#0f172a" borderColor="#e2e8f0" />
              {d.education.filter(e => e.degree || e.institution).map((e, i) => (
                <div key={i} style={{ fontSize: s(9, f), marginBottom: s(6, f) }}>
                  <strong>{e.degree}</strong>
                  <div style={{ color: "#4b5563" }}>{e.institution}</div>
                  <div style={{ color: "#9ca3af" }}>{e.year} {e.location ? ` | ${e.location}` : ""}</div>
                </div>
              ))}
            </div>
          )}

          {/* Skills */}
          {lines(d.skillsText).length > 0 && (
            <div>
              <SecTitle text="Core Skills" f={f} color="#0f172a" borderColor="#e2e8f0" />
              <div style={{ display: "flex", flexWrap: "wrap", gap: s(4, f) }}>
                {lines(d.skillsText).map((sk, i) => (
                  <span key={i} style={{ fontSize: s(8.5, f), background: "#f1f5f9", color: "#334155", padding: `${s(2, f)}px ${s(6, f)}px`, borderRadius: s(4, f), fontWeight: 600, border: "1px solid #e2e8f0" }}>
                    {sk}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Achievements */}
        {d.achievements.some(a => a.text) && (
          <div style={{ marginTop: s(10, f) }}>
            <SecTitle text="Achievements & Certifications" f={f} color="#0f172a" borderColor="#e2e8f0" />
            {d.achievements.filter(a => a.text).map((a, i) => (
              lines(a.text).map((b, j) => (
                <div key={`${i}-${j}`} style={{ fontSize: s(9, f), marginBottom: s(3, f), display: "flex", gap: s(4, f), color: "#374151" }}>
                  <span>🏆</span>
                  <span>{b}</span>
                </div>
              ))
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ── TEMPLATE: Executive (2-col) ──────────────────────────────────────────────
function TExecutive({ d, f = 1 }) {
  const p = d.personal;
  return (
    <div style={{
      fontFamily: "'Inter', sans-serif",
      fontSize: s(9.5, f),
      color: "#27272a",
      display: "flex",
      width: "100%",
      boxSizing: "border-box",
      background: "#fff",
      minHeight: "100%"
    }}>
      {/* Sidebar (left) */}
      <div style={{ width: s(125, f), background: "#1e293b", color: "#f8fafc", padding: `${s(20, f)}px ${s(14, f)}px`, flexShrink: 0, display: "flex", flexDirection: "column", gap: s(16, f) }}>
        <div>
          <div style={{ fontSize: s(14, f), fontFamily: "'Outfit', sans-serif", fontWeight: 800, color: "#fff" }}>{p.firstName}</div>
          <div style={{ fontSize: s(14, f), fontFamily: "'Outfit', sans-serif", fontWeight: 800, color: "#38bdf8", marginBottom: s(4, f) }}>{p.lastName}</div>
          {p.profession && <div style={{ fontSize: s(8, f), color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 600 }}>{p.profession}</div>}
        </div>

        {/* Contact details */}
        <div>
          <div style={{ fontSize: s(8.5, f), fontWeight: 700, color: "#38bdf8", borderBottom: "1px solid rgba(255,255,255,0.15)", marginBottom: s(6, f), paddingBottom: s(2, f), letterSpacing: "0.05em" }}>CONTACT</div>
          <div style={{ fontSize: s(8, f), color: "#cbd5e1", lineHeight: 1.7, display: "flex", flexDirection: "column", gap: s(3, f) }}>
            {p.city && <div>📍 {p.city}</div>}
            {p.phone && <div>📞 {p.phone}</div>}
            {p.email && <div style={{ wordBreak: "break-all" }}>✉️ <L href={`mailto:${p.email}`} style={{ color: "#38bdf8" }}>{p.email}</L></div>}
            {p.linkedin && <div>🔗 <L href={p.linkedin} style={{ color: "#38bdf8" }}>LinkedIn</L></div>}
            {p.github && <div>🐙 <L href={p.github} style={{ color: "#38bdf8" }}>GitHub</L></div>}
          </div>
        </div>

        {/* Skills */}
        {lines(d.skillsText).length > 0 && (
          <div>
            <div style={{ fontSize: s(8.5, f), fontWeight: 700, color: "#38bdf8", borderBottom: "1px solid rgba(255,255,255,0.15)", marginBottom: s(6, f), paddingBottom: s(2, f), letterSpacing: "0.05em" }}>SKILLS</div>
            <div style={{ display: "flex", flexDirection: "column", gap: s(4, f) }}>
              {lines(d.skillsText).map((sk, i) => (
                <div key={i} style={{ fontSize: s(8, f), color: "#cbd5e1", display: "flex", gap: s(3, f) }}>
                  <span>⚡</span>
                  <span>{sk}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Education */}
        {d.education.some(e => e.degree || e.institution) && (
          <div>
            <div style={{ fontSize: s(8.5, f), fontWeight: 700, color: "#38bdf8", borderBottom: "1px solid rgba(255,255,255,0.15)", marginBottom: s(6, f), paddingBottom: s(2, f), letterSpacing: "0.05em" }}>EDUCATION</div>
            {d.education.filter(e => e.degree || e.institution).map((e, i) => (
              <div key={i} style={{ marginBottom: s(6, f), fontSize: s(7.5, f), color: "#cbd5e1" }}>
                <strong style={{ color: "#fff" }}>{e.degree}</strong>
                <div>{e.institution}</div>
                <div style={{ color: "#94a3b8" }}>{e.year}</div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Main column (right) */}
      <div style={{ flex: 1, padding: `${s(20, f)}px ${s(20, f)}px` }}>
        {/* Summary */}
        {d.summary && (
          <div style={{ marginBottom: s(12, f), fontSize: s(9.5, f), color: "#4b5563", lineHeight: 1.5 }}>
            {d.summary}
          </div>
        )}

        {/* Experience */}
        {(d.workExperience.some(w => w.jobTitle || w.company) || d.isFresher) && (
          <div style={{ marginBottom: s(12, f) }}>
            <SecTitle text="Professional Experience" f={f} color="#1e293b" borderColor="#cbd5e1" />
            {d.isFresher && <div style={{ fontSize: s(9, f), fontStyle: "italic", color: "#6b7280", marginBottom: s(6, f) }}>Fresher – Seeking entry-level opportunity</div>}
            {d.fresherExperience && <div style={{ fontSize: s(9, f), color: "#4b5563", marginBottom: s(6, f) }}>{d.fresherExperience}</div>}
            {d.workExperience.filter(w => w.jobTitle || w.company).map((w, i) => (
              <div key={i} style={{ marginBottom: s(8, f) }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: s(10, f) }}>
                  <strong>{w.jobTitle}</strong>
                  <span style={{ color: "#64748b", fontSize: s(9, f), fontWeight: 500 }}>{w.duration}</span>
                </div>
                <div style={{ fontSize: s(9, f), color: "#4f46e5", fontWeight: 600, marginBottom: s(3, f) }}>
                  {w.company}{w.location ? ` | ${w.location}` : ""}
                </div>
                {lines(w.rawText).map((b, j) => (
                  <div key={j} style={{ fontSize: s(9, f), marginLeft: s(10, f), marginTop: s(2, f), display: "flex", gap: s(4, f), color: "#3f3f46" }}>
                    <span>•</span>
                    <span>{b}</span>
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}

        {/* Projects */}
        {d.projects.some(p => p.name) && (
          <div style={{ marginBottom: s(12, f) }}>
            <SecTitle text="Projects" f={f} color="#1e293b" borderColor="#cbd5e1" />
            {d.projects.filter(p => p.name).map((p, i) => (
              <div key={i} style={{ marginBottom: s(8, f) }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: s(10, f) }}>
                  <strong>{p.name}</strong>
                  {p.tech && <span style={{ fontSize: s(8.5, f), color: "#4f46e5", fontWeight: 600 }}>{p.tech}</span>}
                </div>
                {lines(p.description).map((b, j) => (
                  <div key={j} style={{ fontSize: s(9, f), marginLeft: s(8, f), marginTop: s(2, f), color: "#4b5563", display: "flex", gap: s(4, f) }}>
                    <span>•</span>
                    <span>{b}</span>
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}

        {/* Achievements */}
        {d.achievements.some(a => a.text) && (
          <div>
            <SecTitle text="Achievements" f={f} color="#1e293b" borderColor="#cbd5e1" />
            {d.achievements.filter(a => a.text).map((a, i) => (
              lines(a.text).map((b, j) => (
                <div key={`${i}-${j}`} style={{ fontSize: s(9.5, f), marginBottom: s(3, f), display: "flex", gap: s(4, f) }}>
                  <span>•</span>
                  <span>{b}</span>
                </div>
              ))
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ── TEMPLATE: Green Classic (Sage) ────────────────────────────────────────────
function TGreenClassic({ d, f = 1 }) {
  const p = d.personal;
  const G = "#0f5132"; // Emerald green
  return (
    <div style={{
      fontFamily: "'Lora', Georgia, serif",
      fontSize: s(10, f),
      color: "#2d3748",
      lineHeight: 1.5,
      padding: `${s(24, f)}px ${s(26, f)}px`,
      width: "100%",
      boxSizing: "border-box",
      background: "#fff"
    }}>
      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: s(14, f) }}>
        <div style={{ fontSize: s(22, f), fontWeight: 700, letterSpacing: "0.05em", textTransform: "uppercase", color: G }}>
          {p.firstName} {p.lastName}
        </div>
        {p.profession && <div style={{ fontSize: s(10, f), color: "#555", textTransform: "uppercase", letterSpacing: "0.1em", marginTop: s(2, f) }}>{p.profession}</div>}
        <div style={{ marginTop: s(6, f) }}><ContactLine d={p} f={f} sep=" | " /></div>
      </div>

      {/* Summary */}
      {d.summary && (
        <div style={{ marginBottom: s(12, f), fontSize: s(9.5, f), color: "#4a5568", textAlign: "center", fontStyle: "italic", borderTop: "1px solid #e2e8f0", borderBottom: "1px solid #e2e8f0", padding: `${s(6, f)}px 0` }}>
          {d.summary}
        </div>
      )}

      {/* Education */}
      {d.education.some(e => e.degree || e.institution) && (
        <div style={{ marginBottom: s(12, f) }}>
          <SecTitle text="Education" f={f} borderColor={G} color={G} serif />
          {d.education.filter(e => e.degree || e.institution).map((e, i) => (
            <div key={i} style={{ marginBottom: s(6, f) }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: s(9.5, f) }}>
                <strong>{e.degree}</strong>
                <span style={{ color: "#4a5568", fontWeight: 500 }}>{e.year}</span>
              </div>
              <div style={{ fontSize: s(9, f), color: "#4a5568" }}>{e.institution}{e.location ? ` | ${e.location}` : ""}</div>
            </div>
          ))}
        </div>
      )}

      {/* Experience */}
      {(d.workExperience.some(w => w.jobTitle || w.company) || d.isFresher) && (
        <div style={{ marginBottom: s(12, f) }}>
          <SecTitle text="Professional Experience" f={f} borderColor={G} color={G} serif />
          {d.isFresher && <div style={{ fontSize: s(9.5, f), color: "#718096", fontStyle: "italic", marginBottom: s(6, f) }}>Fresher – seeking industry opportunity</div>}
          {d.fresherExperience && <div style={{ fontSize: s(9, f), color: "#4a5568", marginBottom: s(6, f) }}>{d.fresherExperience}</div>}
          {d.workExperience.filter(w => w.jobTitle || w.company).map((w, i) => (
            <div key={i} style={{ marginBottom: s(8, f) }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: s(10, f) }}>
                <strong>{w.jobTitle}</strong>
                <span style={{ color: "#4a5568", fontWeight: 500 }}>{w.duration}</span>
              </div>
              <div style={{ fontSize: s(9.5, f), color: G, fontStyle: "italic", marginBottom: s(2, f) }}>{w.company}{w.location ? ` | ${w.location}` : ""}</div>
              {lines(w.rawText).map((b, j) => (
                <div key={j} style={{ fontSize: s(9, f), marginLeft: s(12, f), marginTop: s(2, f), display: "flex", gap: s(4, f) }}>
                  <span>•</span>
                  <span>{b}</span>
                </div>
              ))}
            </div>
          ))}
        </div>
      )}

      {/* Projects */}
      {d.projects.some(p => p.name) && (
        <div style={{ marginBottom: s(12, f) }}>
          <SecTitle text="Projects" f={f} borderColor={G} color={G} serif />
          {d.projects.filter(p => p.name).map((p, i) => (
            <div key={i} style={{ marginBottom: s(6, f) }}>
              <div style={{ fontSize: s(10, f), display: "flex", justifyContent: "space-between" }}>
                <strong>{p.name}</strong>
                {p.tech && <span style={{ fontSize: s(8.5, f), color: "#718096", fontWeight: 500 }}>{p.tech}</span>}
              </div>
              {lines(p.description).map((b, j) => (
                <div key={j} style={{ fontSize: s(9, f), marginLeft: s(10, f), marginTop: s(2, f), display: "flex", gap: s(4, f), color: "#4a5568" }}>
                  <span>•</span>
                  <span>{b}</span>
                </div>
              ))}
            </div>
          ))}
        </div>
      )}

      {/* Skills */}
      {lines(d.skillsText).length > 0 && (
        <div style={{ marginBottom: s(12, f) }}>
          <SecTitle text="Core Skills" f={f} borderColor={G} color={G} serif />
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: `${s(4, f)}px ${s(12, f)}px`, fontSize: s(9.5, f) }}>
            {lines(d.skillsText).map((sk, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: s(4, f) }}>
                <span style={{ color: G }}>✔</span>
                <span>{sk}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Achievements */}
      {d.achievements.some(a => a.text) && (
        <div>
          <SecTitle text="Achievements" f={f} borderColor={G} color={G} serif />
          {d.achievements.filter(a => a.text).map((a, i) => (
            lines(a.text).map((b, j) => (
              <div key={`${i}-${j}`} style={{ fontSize: s(9.5, f), marginBottom: s(3, f), display: "flex", gap: s(4, f) }}>
                <span>•</span>
                <span>{b}</span>
              </div>
            ))
          ))}
        </div>
      )}
    </div>
  );
}

// ── TEMPLATE: Two Column ─────────────────────────────────────────────────────
function TTwoColumn({ d, f = 1 }) {
  const p = d.personal;
  return (
    <div style={{
      fontFamily: "'Inter', sans-serif",
      fontSize: s(9.5, f),
      color: "#374151",
      width: "100%",
      boxSizing: "border-box",
      background: "#fff",
      display: "flex",
      flexDirection: "column"
    }}>
      {/* Top Banner */}
      <div style={{ padding: `${s(20, f)}px ${s(24, f)}px`, borderBottom: "1px solid #e5e7eb", background: "#f9fafb" }}>
        <div style={{ fontSize: s(26, f), fontFamily: "'Outfit', sans-serif", fontWeight: 800, color: "#111827", letterSpacing: "-0.02em" }}>
          {p.firstName} {p.lastName}
        </div>
        {p.profession && <div style={{ fontSize: s(10, f), color: "#4f46e5", textTransform: "uppercase", letterSpacing: "0.1em", marginTop: s(2, f), fontWeight: 700 }}>{p.profession}</div>}
      </div>

      <div style={{ display: "flex", flex: 1 }}>
        {/* Left Column (details sidebar) */}
        <div style={{ width: s(130, f), flexShrink: 0, background: "#f8fafc", borderRight: "1px solid #e5e7eb", padding: `${s(16, f)}px ${s(14, f)}px`, display: "flex", flexDirection: "column", gap: s(14, f) }}>
          <div>
            <div style={{ fontSize: s(8.5, f), fontWeight: 700, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: s(6, f) }}>CONTACT</div>
            <div style={{ fontSize: s(8, f), color: "#4b5563", display: "flex", flexDirection: "column", gap: s(4, f) }}>
              {p.city && <div>📍 {p.city}</div>}
              {p.phone && <div>📞 {p.phone}</div>}
              {p.email && <div style={{ wordBreak: "break-all" }}>✉️ <L href={`mailto:${p.email}`}>{p.email}</L></div>}
              {p.linkedin && <div>🔗 <L href={p.linkedin}>LinkedIn</L></div>}
              {p.github && <div>🐙 <L href={p.github}>GitHub</L></div>}
            </div>
          </div>

          {lines(d.skillsText).length > 0 && (
            <div>
              <div style={{ fontSize: s(8.5, f), fontWeight: 700, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: s(6, f), borderTop: "1px solid #e5e7eb", paddingTop: s(8, f) }}>SKILLS</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: s(4, f) }}>
                {lines(d.skillsText).map((sk, i) => (
                  <span key={i} style={{ fontSize: s(8, f), background: "#e2e8f0", color: "#1e293b", padding: `${s(1.5, f)}px ${s(5, f)}px`, borderRadius: s(4, f), fontWeight: 600 }}>
                    {sk}
                  </span>
                ))}
              </div>
            </div>
          )}

          {d.education.some(e => e.degree || e.institution) && (
            <div>
              <div style={{ fontSize: s(8.5, f), fontWeight: 700, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: s(6, f), borderTop: "1px solid #e5e7eb", paddingTop: s(8, f) }}>EDUCATION</div>
              {d.education.filter(e => e.degree || e.institution).map((e, i) => (
                <div key={i} style={{ marginBottom: s(8, f), fontSize: s(8, f) }}>
                  <div style={{ fontWeight: 700, color: "#1f2937" }}>{e.institution}</div>
                  <div style={{ color: "#4f46e5", fontWeight: 600 }}>{e.year}</div>
                  <div style={{ color: "#4b5563", fontStyle: "italic" }}>{e.degree}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Column (main experience) */}
        <div style={{ flex: 1, padding: `${s(16, f)}px ${s(18, f)}px`, display: "flex", flexDirection: "column", gap: s(12, f) }}>
          {/* Summary */}
          {d.summary && (
            <div style={{ fontSize: s(9.5, f), color: "#4b5563", lineHeight: 1.45 }}>
              {d.summary}
            </div>
          )}

          {/* Experience */}
          {(d.workExperience.some(w => w.jobTitle || w.company) || d.isFresher) && (
            <div>
              <div style={{ fontSize: s(9, f), fontWeight: 700, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: s(6, f) }}>EXPERIENCE</div>
              {d.isFresher && <div style={{ fontSize: s(9.5, f), fontStyle: "italic", color: "#6b7280", marginBottom: s(6, f) }}>Fresher – Seeking entry-level opportunity</div>}
              {d.fresherExperience && <div style={{ fontSize: s(9, f), color: "#4b5563", marginBottom: s(6, f) }}>{d.fresherExperience}</div>}
              {d.workExperience.filter(w => w.jobTitle || w.company).map((w, i) => (
                <div key={i} style={{ marginBottom: s(8, f) }}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: s(10, f) }}>
                    <strong>{w.jobTitle}</strong>
                    <span style={{ color: "#6b7280", fontSize: s(9, f) }}>{w.duration}</span>
                  </div>
                  <div style={{ fontSize: s(9, f), color: "#4f46e5", fontWeight: 600 }}>{w.company}{w.location ? ` – ${w.location}` : ""}</div>
                  {lines(w.rawText).map((b, j) => (
                    <div key={j} style={{ fontSize: s(9, f), marginLeft: s(10, f), marginTop: s(2, f), display: "flex", gap: s(4, f), color: "#374151" }}>
                      <span>•</span>
                      <span>{b}</span>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          )}

          {/* Projects */}
          {d.projects.some(p => p.name) && (
            <div style={{ borderTop: "1px solid #f3f4f6", paddingTop: s(8, f) }}>
              <div style={{ fontSize: s(9, f), fontWeight: 700, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: s(6, f) }}>PROJECTS</div>
              {d.projects.filter(p => p.name).map((p, i) => (
                <div key={i} style={{ marginBottom: s(8, f) }}>
                  <div style={{ fontSize: s(10, f), display: "flex", justifyContent: "space-between" }}>
                    <strong>{p.name}</strong>
                    {p.tech && <span style={{ fontSize: s(8.5, f), color: "#6b7280", fontWeight: 500 }}>{p.tech}</span>}
                  </div>
                  {lines(p.description).map((b, j) => (
                    <div key={j} style={{ fontSize: s(9, f), color: "#4b5563", marginTop: s(2, f), display: "flex", gap: s(4, f) }}>
                      <span>•</span>
                      <span>{b}</span>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          )}

          {/* Achievements */}
          {d.achievements.some(a => a.text) && (
            <div style={{ borderTop: "1px solid #f3f4f6", paddingTop: s(8, f) }}>
              <div style={{ fontSize: s(9, f), fontWeight: 700, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: s(6, f) }}>ACHIEVEMENTS</div>
              {d.achievements.filter(a => a.text).map((a, i) => (
                lines(a.text).map((b, j) => (
                  <div key={`${i}-${j}`} style={{ fontSize: s(9.5, f), color: "#374151", marginBottom: s(3, f), display: "flex", gap: s(4, f) }}>
                    <span>🏆</span>
                    <span>{b}</span>
                  </div>
                ))
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ── TEMPLATE: Simple Sans ────────────────────────────────────────────────────
function TSimpleSans({ d, f = 1 }) {
  const p = d.personal;
  return (
    <div style={{
      fontFamily: "'Inter', sans-serif",
      fontSize: s(9.5, f),
      color: "#18181b",
      lineHeight: 1.5,
      padding: `${s(20, f)}px ${s(24, f)}px`,
      width: "100%",
      boxSizing: "border-box",
      background: "#fff"
    }}>
      <div style={{ marginBottom: s(12, f) }}>
        <div style={{ fontSize: s(24, f), fontWeight: 800, color: "#09090b", fontFamily: "'Outfit', sans-serif", letterSpacing: "-0.02em" }}>
          {p.firstName} {p.lastName}
        </div>
        {p.profession && <div style={{ fontSize: s(10, f), color: "#71717a", textTransform: "uppercase", letterSpacing: "0.05em", marginTop: s(2, f), fontWeight: 600 }}>{p.profession}</div>}
        <div style={{ fontSize: s(8.5, f), color: "#52525b", marginTop: s(6, f), display: "flex", flexWrap: "wrap", gap: `${s(2, f)}px ${s(8, f)}px` }}>
          {p.city && <span>📍 {p.city}</span>}
          {p.phone && <span>📞 {p.phone}</span>}
          {p.email && <span>✉️ <L href={`mailto:${p.email}`}>{p.email}</L></span>}
          {p.linkedin && <span>🔗 <L href={p.linkedin}>LinkedIn</L></span>}
          {p.github && <span>🐙 <L href={p.github}>GitHub</L></span>}
        </div>
      </div>

      {/* Summary */}
      {d.summary && (
        <div style={{ marginBottom: s(12, f), color: "#3f3f46", fontSize: s(9.5, f) }}>
          {d.summary}
        </div>
      )}

      {/* Education */}
      {d.education.some(e => e.degree || e.institution) && (
        <div style={{ marginBottom: s(12, f) }}>
          <div style={{ fontSize: s(10.5, f), fontWeight: 700, color: "#09090b", textTransform: "uppercase", letterSpacing: "0.05em" }}>Education</div>
          <div style={{ borderBottom: "1px solid #e4e4e7", margin: `${s(3, f)}px 0 ${s(6, f)}px` }} />
          {d.education.filter(e => e.degree || e.institution).map((e, i) => (
            <div key={i} style={{ marginBottom: s(4, f), display: "flex", justifyContent: "space-between", fontSize: s(9.5, f) }}>
              <div>
                <strong>{e.degree}</strong>
                <span style={{ color: "#52525b" }}> – {e.institution}{e.location ? `, ${e.location}` : ""}</span>
              </div>
              <div style={{ color: "#71717a", fontWeight: 500 }}>{e.year}</div>
            </div>
          ))}
        </div>
      )}

      {/* Experience */}
      {(d.workExperience.some(w => w.jobTitle || w.company) || d.isFresher) && (
        <div style={{ marginBottom: s(12, f) }}>
          <div style={{ fontSize: s(10.5, f), fontWeight: 700, color: "#09090b", textTransform: "uppercase", letterSpacing: "0.05em" }}>Experience</div>
          <div style={{ borderBottom: "1px solid #e4e4e7", margin: `${s(3, f)}px 0 ${s(6, f)}px` }} />
          {d.isFresher && <div style={{ fontSize: s(9.5, f), fontStyle: "italic", color: "#71717a", marginBottom: s(4, f) }}>Fresher – Seeking opportunity</div>}
          {d.fresherExperience && <div style={{ fontSize: s(9, f), color: "#52525b", marginBottom: s(5, f) }}>{d.fresherExperience}</div>}
          {d.workExperience.filter(w => w.jobTitle || w.company).map((w, i) => (
            <div key={i} style={{ marginBottom: s(8, f) }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: s(9.5, f) }}>
                <strong>{w.jobTitle}</strong>
                <span style={{ color: "#71717a", fontWeight: 500 }}>{w.duration}</span>
              </div>
              <div style={{ fontSize: s(9.5, f), color: "#52525b", fontStyle: "italic" }}>{w.company}{w.location ? ` – ${w.location}` : ""}</div>
              {lines(w.rawText).map((b, j) => (
                <div key={j} style={{ fontSize: s(9, f), marginLeft: s(10, f), marginTop: s(2, f), display: "flex", gap: s(4, f), color: "#27272a" }}>
                  <span>•</span>
                  <span>{b}</span>
                </div>
              ))}
            </div>
          ))}
        </div>
      )}

      {/* Projects */}
      {d.projects.some(p => p.name) && (
        <div style={{ marginBottom: s(12, f) }}>
          <div style={{ fontSize: s(10.5, f), fontWeight: 700, color: "#09090b", textTransform: "uppercase", letterSpacing: "0.05em" }}>Projects</div>
          <div style={{ borderBottom: "1px solid #e4e4e7", margin: `${s(3, f)}px 0 ${s(6, f)}px` }} />
          {d.projects.filter(p => p.name).map((p, i) => (
            <div key={i} style={{ marginBottom: s(6, f) }}>
              <div style={{ fontSize: s(9.5, f), display: "flex", justifyContent: "space-between" }}>
                <div><strong>{p.name}</strong>{p.tech && <span style={{ color: "#71717a" }}> — {p.tech}</span>}</div>
              </div>
              {lines(p.description).map((b, j) => (
                <div key={j} style={{ fontSize: s(9, f), marginLeft: s(10, f), marginTop: s(2, f), display: "flex", gap: s(4, f), color: "#3f3f46" }}>
                  <span>•</span>
                  <span>{b}</span>
                </div>
              ))}
            </div>
          ))}
        </div>
      )}

      {/* Skills */}
      {lines(d.skillsText).length > 0 && (
        <div style={{ marginBottom: s(12, f) }}>
          <div style={{ fontSize: s(10.5, f), fontWeight: 700, color: "#09090b", textTransform: "uppercase", letterSpacing: "0.05em" }}>Skills</div>
          <div style={{ borderBottom: "1px solid #e4e4e7", margin: `${s(3, f)}px 0 ${s(6, f)}px` }} />
          <div style={{ display: "flex", flexWrap: "wrap", gap: s(6, f), fontSize: s(9, f) }}>
            {lines(d.skillsText).map((sk, i) => (
              <span key={i} style={{ border: "1px solid #e4e4e7", padding: `2px ${s(6, f)}px`, borderRadius: 4, background: "#fafafa", fontWeight: 500 }}>
                {sk}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Achievements */}
      {d.achievements.some(a => a.text) && (
        <div>
          <div style={{ fontSize: s(10.5, f), fontWeight: 700, color: "#09090b", textTransform: "uppercase", letterSpacing: "0.05em" }}>Achievements</div>
          <div style={{ borderBottom: "1px solid #e4e4e7", margin: `${s(3, f)}px 0 ${s(6, f)}px` }} />
          {d.achievements.filter(a => a.text).map((a, i) => (
            lines(a.text).map((b, j) => (
              <div key={`${i}-${j}`} style={{ fontSize: s(9.5, f), marginBottom: s(3, f), display: "flex", gap: s(4, f) }}>
                <span>•</span>
                <span>{b}</span>
              </div>
            ))
          ))}
        </div>
      )}
    </div>
  );
}

// ── Template router ──────────────────────────────────────────────────────────
function Resume({ tmpl, d, f = 1 }) {
  if (tmpl === "modern")       return <TModern d={d} f={f} />;
  if (tmpl === "executive")    return <TExecutive d={d} f={f} />;
  if (tmpl === "greenclassic") return <TGreenClassic d={d} f={f} />;
  if (tmpl === "twocolumn")    return <TTwoColumn d={d} f={f} />;
  if (tmpl === "simplesans")   return <TSimpleSans d={d} f={f} />;
  return <TClassic d={d} f={f} />;
}

// ── Template Card — portrait preview ────────────────────────────────────────
function TCard({ tmpl, sel, data, onSelect }) {
  return (
    <div className={`template-card ${sel ? "selected" : ""}`} onClick={onSelect}>
      {tmpl.recommended && <div className="template-badge">★ RECOMMENDED</div>}
      {sel && (
        <div style={{ position: "absolute", top: 12, right: 12, width: 24, height: 24, background: "var(--primary)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 12, zIndex: 10, fontWeight: "bold", border: "2px solid #fff" }}>
          ✓
        </div>
      )}
      <div className="template-preview-wrapper">
        <div className="template-preview-scale">
          <div style={{ transform: "scale(0.36)", transformOrigin: "top left", width: "278%", pointerEvents: "none" }}>
            <Resume tmpl={tmpl.value} d={data} f={1.4} />
          </div>
        </div>
      </div>
      <div className="template-info">
        <div className="template-name">{tmpl.title}</div>
        <div className="template-desc">{tmpl.desc}</div>
      </div>
    </div>
  );
}

// ── Sample data for template previews ────────────────────────────────────────
const SAMPLE = {
  personal: { firstName: "Saanvi", lastName: "Patel", profession: "Software Engineer", city: "New Delhi", phone: "+91 98765 43210", email: "saanvi.patel@sample.in", linkedin: "linkedin.com/in/saanvi", github: "github.com/saanvi" },
  summary: "Highly motivated Software Engineer with 3+ years of experience designing and developing web applications. Skilled in React, Node.js, and cloud services, with a strong focus on clean code and performance optimization.",
  education: [{ degree: "B.Tech Computer Science", institution: "Delhi Technological University", location: "Delhi", year: "2018 – 2022" }],
  workExperience: [{ jobTitle: "Software Developer", company: "TechSolutions Corp", location: "Bengaluru", duration: "06/2022 – Present", rawText: "Built and deployed core dashboard using React and Redux.\nOptimized API responsiveness by 40% using Redis caching.\nCoached 3 junior developers and established CI/CD protocols." }],
  skillsText: "React.js\nNode.js\nJavaScript (ES6+)\nSQL & MongoDB\nGit & CI/CD",
  projects: [{ name: "Collaborative Task Manager", description: "Created a real-time board with drag-and-drop mechanics.\nIntegrated Socket.io to sync state across concurrent users.", tech: "React, Express, WebSockets" }],
  achievements: [{ text: "Received Best Debutant Award at TechSolutions for dashboard execution" }],
  isFresher: false,
};

// ═══════════════════════════════════════════════════════════════════════════════
//  MAIN APP
// ═══════════════════════════════════════════════════════════════════════════════
export default function App() {
  const [page,    setPage]    = useState("welcome");
  const [exp,     setExp]     = useState("");
  const [tmpl,    setTmpl]    = useState("classic");
  const [step,    setStep]    = useState("personal");
  const [done,    setDone]    = useState(new Set());
  const [activeMobileTab, setActiveMobileTab] = useState("editor"); // "editor" or "preview"
  const printRef = useRef(null);
  const previewContainerRef = useRef(null);
  const [previewScale, setPreviewScale] = useState(0.5);

  const [data, setData] = useState({
    personal: { firstName: "", lastName: "", profession: "", city: "", country: "", phone: "", email: "", linkedin: "", github: "" },
    summary: "",
    education: [{ degree: "", institution: "", location: "", year: "" }],
    workExperience: [{ jobTitle: "", company: "", location: "", duration: "", rawText: "" }],
    skillsText: "",
    fresherExperience: "",
    projects: [{ name: "", description: "", tech: "" }],
    achievements: [{ text: "", image: null }],
  });

  const isFresher = exp === "none";

  // live preview data — fall back to sample when fields empty
  const pd = {
    personal: {
      ...data.personal,
      firstName: data.personal.firstName || SAMPLE.personal.firstName,
      lastName:  data.personal.lastName  || SAMPLE.personal.lastName,
      profession:data.personal.profession|| SAMPLE.personal.profession,
    },
    summary:   data.summary || SAMPLE.summary,
    education: data.education.some(e => e.degree || e.institution) ? data.education : SAMPLE.education,
    workExperience: data.workExperience.some(w => w.jobTitle || w.company) ? data.workExperience : SAMPLE.workExperience,
    skillsText: data.skillsText || SAMPLE.skillsText,
    fresherExperience: data.fresherExperience || "",
    projects:  data.projects.some(p => p.name) ? data.projects : SAMPLE.projects,
    achievements: data.achievements.some(a => a.text) ? data.achievements : SAMPLE.achievements,
    isFresher,
  };

  // helpers
  const setP   = (k, v) => setData(p => ({ ...p, personal: { ...p.personal, [k]: v } }));
  const setArr = (key, i, k, v) => setData(p => { const a = [...p[key]]; a[i] = { ...a[i], [k]: v }; return { ...p, [key]: a }; });
  const addRow = (key, t) => setData(p => ({ ...p, [key]: [...p[key], { ...t }] }));
  const delRow = (key, i) => setData(p => ({ ...p, [key]: p[key].filter((_, j) => j !== i) }));
  const markDone = st => setDone(p => new Set([...p, st]));
  const progress = Math.round((done.size / (STEPS.length - 1)) * 100);

  const goNext = () => {
    markDone(step);
    if (step === "finalize") { setPage("preview"); return; }
    const i = STEPS.findIndex(s => s.id === step);
    setStep(STEPS[i + 1].id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const goBackStep = () => {
    const i = STEPS.findIndex(s => s.id === step);
    if (i > 0) {
      setStep(STEPS[i - 1].id);
    }
  };

  // Dynamic Scale Observer for Preview A4 Sheet
  useEffect(() => {
    if (page !== "builder" || !previewContainerRef.current) return;
    
    const handleResize = () => {
      if (previewContainerRef.current) {
        const rect = previewContainerRef.current.getBoundingClientRect();
        // Give 32px safety padding inside preview pane container
        const availableWidth = rect.width - 32;
        if (availableWidth > 50) {
          setPreviewScale(availableWidth / 794);
        }
      }
    };

    handleResize();
    const observer = new ResizeObserver(handleResize);
    observer.observe(previewContainerRef.current);
    
    return () => observer.disconnect();
  }, [page]);

  // Hidden print window generation loading all required fonts
  const handlePrint = () => {
    const el = printRef.current;
    if (!el) return;
    const win = window.open("", "_blank", "width=950,height=750");
    if (!win) {
      alert("Please allow pop-up windows to save your resume.");
      return;
    }
    win.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Resume - ${data.personal.firstName || "ProResume"} ${data.personal.lastName || ""}</title>
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Lora:ital,wght@0,400;0,500;0,600;0,700;1,400&family=Outfit:wght@300;400;500;600;700;800&family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
        <style>
          body {
            margin: 0;
            padding: 0;
            background: #fff;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
          @page {
            size: A4;
            margin: 0;
          }
          a {
            color: inherit !important;
            text-decoration: underline !important;
          }
        </style>
      </head>
      <body>
        <div style="width: 210mm; min-height: 297mm; box-sizing: border-box; background: white; margin: 0 auto; overflow: hidden;">
          ${el.innerHTML}
        </div>
        <script>
          window.onload = function() {
            setTimeout(function() {
              window.print();
            }, 600);
          };
        </script>
      </body>
      </html>
    `);
    win.document.close();
  };

  const Next = ({ label }) => (
    <div className="action-row">
      {step !== "personal" ? (
        <button onClick={goBackStep} className="btn btn-secondary">
          ← Back
        </button>
      ) : (
        <div />
      )}
      <button onClick={goNext} className="btn btn-primary">
        {label || "Continue →"}
      </button>
    </div>
  );

  // ── WELCOME SCREEN ────────────────────────────────────────────────────────
  if (page === "welcome") {
    return (
      <div className="onboarding-screen">
        <div className="bg-bubbles">
          <div className="bubble bubble-1"></div>
          <div className="bubble bubble-2"></div>
        </div>
        <div className="glass-card animate-slide-up" style={{ maxWidth: 640 }}>
          <div style={{ textAlign: "center", marginBottom: 12, fontSize: "0.85rem", letterSpacing: "0.15em", textTransform: "uppercase", color: "var(--secondary)", fontWeight: 700 }}>
            ProResume Builder
          </div>
          <h1 className="onboarding-title">
            Design Your <br />
            <span style={{ background: "linear-gradient(135deg, var(--secondary) 0%, var(--primary) 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Perfect Resume</span>
          </h1>
          <p className="onboarding-subtitle" style={{ maxWidth: 440, margin: "0 auto 36px" }}>
            Create professional, job-winning A4 resumes in minutes. Follow simple guided steps, choose from recruiter-approved templates, and download instantly.
          </p>
          <div style={{ textAlign: "center" }}>
            <button onClick={() => setPage("experience")} className="btn btn-primary" style={{ padding: "16px 42px", fontSize: "1.05rem" }}>
              Start Building Now
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── EXPERIENCE SCREEN ─────────────────────────────────────────────────────
  if (page === "experience") {
    return (
      <div className="onboarding-screen">
        <div className="bg-bubbles">
          <div className="bubble bubble-1"></div>
          <div className="bubble bubble-2"></div>
        </div>
        <div className="glass-card animate-slide-up" style={{ maxWidth: 840 }}>
          <h1 className="onboarding-title">How far along are you?</h1>
          <p className="onboarding-subtitle">
            Tell us about your career path so we can tailor templates and recommendations for you.
          </p>
          <div className="option-grid">
            {EXP.map(o => (
              <div
                key={o.value}
                onClick={() => setExp(o.value)}
                className={`option-card ${exp === o.value ? "selected" : ""}`}
              >
                <div className="option-icon">{o.icon}</div>
                <div className="option-title">{o.label}</div>
                <div className="option-desc">{o.desc}</div>
              </div>
            ))}
          </div>
          <div className="action-row">
            <button onClick={() => setPage("welcome")} className="btn btn-secondary">
              ← Back
            </button>
            <button
              onClick={() => { if (exp) setPage("templates"); }}
              className="btn btn-primary"
              disabled={!exp}
            >
              Continue →
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── TEMPLATES SCREEN ──────────────────────────────────────────────────────
  if (page === "templates") {
    return (
      <div className="onboarding-screen" style={{ display: "block", overflowY: "auto", minHeight: "100vh" }}>
        <div className="bg-bubbles">
          <div className="bubble bubble-1"></div>
          <div className="bubble bubble-2"></div>
        </div>
        <div className="glass-card animate-slide-up" style={{ maxWidth: 1100, margin: "40px auto" }}>
          <div style={{ textAlign: "center", marginBottom: 32 }}>
            <h1 className="onboarding-title" style={{ fontSize: "2.2rem" }}>Select a Base Layout</h1>
            <p className="onboarding-subtitle" style={{ marginBottom: 0 }}>
              Showing recommended designs for: <strong style={{ color: "#fff" }}>{EXP.find(e => e.value === exp)?.label}</strong>
            </p>
          </div>

          <div className="template-grid">
            {TEMPLATES.map(t => (
              <TCard
                key={t.value}
                tmpl={t}
                sel={tmpl === t.value}
                data={SAMPLE}
                onSelect={() => setTmpl(t.value)}
              />
            ))}
          </div>

          <div className="action-row">
            <button onClick={() => setPage("experience")} className="btn btn-secondary">
              ← Back to Experience
            </button>
            <button onClick={() => setPage("builder")} className="btn btn-primary">
              Use {TEMPLATES.find(t => t.value === tmpl)?.title} →
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── BUILDER WORKSPACE ─────────────────────────────────────────────────────
  if (page === "builder") {
    return (
      <div className="builder-container">
        
        {/* Sidebar Nav */}
        <div className="builder-sidebar">
          <div className="sidebar-logo">
            <div className="logo-text">
              Pro<span className="logo-accent">Resume</span>
            </div>
          </div>
          
          <nav className="sidebar-nav">
            {STEPS.map(st => {
              const isA = step === st.id;
              const isD = done.has(st.id);
              return (
                <button
                  key={st.id}
                  onClick={() => setStep(st.id)}
                  className={`step-item ${isA ? "active" : ""} ${isD ? "completed" : ""}`}
                >
                  <div className="step-num">{isD ? "✓" : st.n}</div>
                  <span style={{ fontSize: "0.85rem" }}>{st.label}</span>
                </button>
              );
            })}
          </nav>

          <div className="sidebar-footer">
            <div className="progress-header">
              <span>Progress</span>
              <span>{progress}%</span>
            </div>
            <div className="progress-bar-bg">
              <div className="progress-bar-fill" style={{ width: `${progress}%` }}></div>
            </div>
            <button
              onClick={() => setPage("templates")}
              className="btn-text"
              style={{ display: "block", marginTop: 12, fontSize: "0.75rem", margin: "12px auto 0" }}
            >
              Change Layout Template
            </button>
          </div>
        </div>

        {/* Mobile Tab Switcher */}
        <div className="mobile-tabs">
          <button
            className={`mobile-tab-btn ${activeMobileTab === "editor" ? "active" : ""}`}
            onClick={() => setActiveMobileTab("editor")}
          >
            📝 Edit Details
          </button>
          <button
            className={`mobile-tab-btn ${activeMobileTab === "preview" ? "active" : ""}`}
            onClick={() => setActiveMobileTab("preview")}
          >
            👁️ Live Preview
          </button>
        </div>

        {/* Form Details Pane */}
        <div className={`editor-pane ${activeMobileTab !== "editor" ? "hidden" : ""}`}>
          
          {step === "personal" && (
            <div className="animate-fade-in">
              <h2 className="editor-title">Contact & Heading</h2>
              <p className="editor-subtitle">Let's start with your primary identification details.</p>
              
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">First Name *</label>
                  <input className="form-input" value={data.personal.firstName} onChange={e => setP("firstName", e.target.value)} placeholder="Jane" />
                </div>
                <div className="form-group">
                  <label className="form-label">Last Name *</label>
                  <input className="form-input" value={data.personal.lastName} onChange={e => setP("lastName", e.target.value)} placeholder="Doe" />
                </div>
              </div>
              
              <div className="form-group">
                <label className="form-label">Profession / Target Role</label>
                <input className="form-input" value={data.personal.profession} onChange={e => setP("profession", e.target.value)} placeholder="Senior Front-end Engineer" />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">City</label>
                  <input className="form-input" value={data.personal.city} onChange={e => setP("city", e.target.value)} placeholder="San Francisco" />
                </div>
                <div className="form-group">
                  <label className="form-label">Country</label>
                  <input className="form-input" value={data.personal.country} onChange={e => setP("country", e.target.value)} placeholder="United States" />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Phone</label>
                  <input className="form-input" value={data.personal.phone} onChange={e => setP("phone", e.target.value)} placeholder="+1 415 555 0199" />
                </div>
                <div className="form-group">
                  <label className="form-label">Email Address *</label>
                  <input className="form-input" type="email" value={data.personal.email} onChange={e => setP("email", e.target.value)} placeholder="jane.doe@email.com" />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">LinkedIn URL</label>
                <input className="form-input" value={data.personal.linkedin} onChange={e => setP("linkedin", e.target.value)} placeholder="linkedin.com/in/janedoe" />
              </div>

              <div className="form-group">
                <label className="form-label">GitHub URL</label>
                <input className="form-input" value={data.personal.github} onChange={e => setP("github", e.target.value)} placeholder="github.com/janedoe" />
              </div>
              
              <Next />
            </div>
          )}

          {step === "workExperience" && (
            <div className="animate-fade-in">
              <h2 className="editor-title">Work Experience</h2>
              <p className="editor-subtitle">List your previous employment. Summarize key results in bullet points.</p>
              
              {isFresher && (
                <div className="finalize-card" style={{ background: "rgba(79, 70, 229, 0.08)", borderColor: "rgba(79, 70, 229, 0.25)" }}>
                  <div className="finalize-title" style={{ color: "var(--secondary)" }}>Fresher Profile Active</div>
                  <div className="finalize-desc" style={{ color: "var(--text-secondary)" }}>
                    You marked yourself as a fresher. A placeholder seeking entry-level opportunity is enabled. You can summarize training, bootcamps, or internship details below:
                  </div>
                  <textarea
                    className="form-input"
                    style={{ width: "100%", marginTop: 12, resize: "vertical", minHeight: 90, lineHeight: 1.6 }}
                    value={data.fresherExperience}
                    onChange={e => setData(p => ({ ...p, fresherExperience: e.target.value }))}
                    placeholder="E.g. Completed 300+ hours of advanced React and frontend architecture bootcamps. Built multiple capstone responsive projects."
                  />
                </div>
              )}

              {data.workExperience.map((w, i) => (
                <div key={i} className="repeater-card">
                  <div className="repeater-header">
                    <div className="repeater-title">Job Position #{i + 1}</div>
                    {data.workExperience.length > 1 && (
                      <button onClick={() => delRow("workExperience", i)} className="btn btn-danger" style={{ padding: "6px 12px", fontSize: "0.8rem" }}>
                        ✕ Delete Position
                      </button>
                    )}
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label className="form-label">Job Title</label>
                      <input className="form-input" value={w.jobTitle} onChange={e => setArr("workExperience", i, "jobTitle", e.target.value)} placeholder="Senior Software Developer" />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Company Name</label>
                      <input className="form-input" value={w.company} onChange={e => setArr("workExperience", i, "company", e.target.value)} placeholder="Google Inc." />
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label className="form-label">Location</label>
                      <input className="form-input" value={w.location} onChange={e => setArr("workExperience", i, "location", e.target.value)} placeholder="Mountain View, CA" />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Duration / Dates</label>
                      <input className="form-input" value={w.duration} onChange={e => setArr("workExperience", i, "duration", e.target.value)} placeholder="Jan 2022 – Present" />
                    </div>
                  </div>

                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label">Responsibilities & Outcomes (Press Enter for new bullet)</label>
                    <textarea
                      className="form-input"
                      style={{ resize: "vertical", minHeight: 100, lineHeight: 1.6 }}
                      value={w.rawText}
                      onChange={e => setArr("workExperience", i, "rawText", e.target.value)}
                      placeholder="Led a core development team of 5 engineers.&#10;Decreased React app initial rendering speed by 35%.&#10;Migrated legacy systems to clean REST endpoints."
                    />
                    
                    {lines(w.rawText).length > 0 && (
                      <div className="bullet-preview-box">
                        <div className="bullet-preview-title">Bullet Preview</div>
                        {lines(w.rawText).map((b, j) => (
                          <div key={j} className="bullet-preview-item">• {b}</div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}

              <button className="btn-add-repeater" onClick={() => addRow("workExperience", { jobTitle: "", company: "", location: "", duration: "", rawText: "" })}>
                ➕ Add Another Job Experience
              </button>
              
              <Next />
            </div>
          )}

          {step === "education" && (
            <div className="animate-fade-in">
              <h2 className="editor-title">Education</h2>
              <p className="editor-subtitle">List your academic achievements, starting with your highest degree.</p>
              
              {data.education.map((e, i) => (
                <div key={i} className="repeater-card">
                  <div className="repeater-header">
                    <div className="repeater-title">Education Degree #{i + 1}</div>
                    {data.education.length > 1 && (
                      <button onClick={() => delRow("education", i)} className="btn btn-danger" style={{ padding: "6px 12px", fontSize: "0.8rem" }}>
                        ✕ Delete Entry
                      </button>
                    )}
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label className="form-label">Degree / Course Major</label>
                      <input className="form-input" value={e.degree} onChange={ev => setArr("education", i, "degree", ev.target.value)} placeholder="B.S. in Computer Science" />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Year of Graduation</label>
                      <input className="form-input" value={e.year} onChange={ev => setArr("education", i, "year", ev.target.value)} placeholder="2018 – 2022" />
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label className="form-label">School / University</label>
                      <input className="form-input" value={e.institution} onChange={ev => setArr("education", i, "institution", ev.target.value)} placeholder="Stanford University" />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Location</label>
                      <input className="form-input" value={e.location} onChange={ev => setArr("education", i, "location", ev.target.value)} placeholder="Stanford, CA" />
                    </div>
                  </div>
                </div>
              ))}

              <button className="btn-add-repeater" onClick={() => addRow("education", { degree: "", institution: "", location: "", year: "" })}>
                ➕ Add Another Education Entry
              </button>
              
              <Next />
            </div>
          )}

          {step === "skills" && (
            <div className="animate-fade-in">
              <h2 className="editor-title">Technical Skills</h2>
              <p className="editor-subtitle">Type key skills. Enter one skill per line to format them correctly.</p>
              
              <textarea
                className="form-input"
                style={{ width: "100%", resize: "vertical", minHeight: 200, lineHeight: 1.8, fontSize: "0.95rem", marginBottom: 20 }}
                value={data.skillsText}
                onChange={e => setData(p => ({ ...p, skillsText: e.target.value }))}
                placeholder="React.js&#10;Node.js&#10;TypeScript&#10;Redux & Context API&#10;UI/UX Designing"
              />

              {lines(data.skillsText).length > 0 && (
                <div className="bullet-preview-box" style={{ marginBottom: 20 }}>
                  <div className="bullet-preview-title" style={{ color: "var(--secondary)" }}>Preview List</div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 8 }}>
                    {lines(data.skillsText).map((sk, i) => (
                      <span key={i} style={{ background: "rgba(14, 165, 233, 0.12)", color: "#38bdf8", padding: "4px 10px", borderRadius: 6, fontSize: "0.8rem", border: "1px solid rgba(14, 165, 233, 0.25)", fontWeight: 500 }}>
                        {sk}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              
              <Next />
            </div>
          )}

          {step === "projects" && (
            <div className="animate-fade-in">
              <h2 className="editor-title">Projects</h2>
              <p className="editor-subtitle">Highlight notable side projects, personal apps, or key freelance efforts.</p>
              
              {data.projects.map((p, i) => (
                <div key={i} className="repeater-card">
                  <div className="repeater-header">
                    <div className="repeater-title">Project #{i + 1}</div>
                    {data.projects.length > 1 && (
                      <button onClick={() => delRow("projects", i)} className="btn btn-danger" style={{ padding: "6px 12px", fontSize: "0.8rem" }}>
                        ✕ Delete Project
                      </button>
                    )}
                  </div>

                  <div className="form-group">
                    <label className="form-label">Project Name</label>
                    <input className="form-input" value={p.name} onChange={e => setArr("projects", i, "name", e.target.value)} placeholder="E-Commerce Microservices Engine" />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Key Points / Description (Press Enter for new point)</label>
                    <textarea
                      className="form-input"
                      style={{ resize: "vertical", minHeight: 90, lineHeight: 1.6 }}
                      value={p.description}
                      onChange={e => setArr("projects", i, "description", e.target.value)}
                      placeholder="Integrated Stripe API resolving complex billing structures.&#10;Decreased DB payload sizes 50% through Redis key normalization."
                    />
                  </div>

                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label">Technologies Used</label>
                    <input className="form-input" value={p.tech} onChange={e => setArr("projects", i, "tech", e.target.value)} placeholder="Next.js, TailwindCSS, Express, MongoDB" />
                  </div>
                </div>
              ))}

              <button className="btn-add-repeater" onClick={() => addRow("projects", { name: "", description: "", tech: "" })}>
                ➕ Add Another Project
              </button>
              
              <Next />
            </div>
          )}

          {step === "achievements" && (
            <div className="animate-fade-in">
              <h2 className="editor-title">Achievements & Certification</h2>
              <p className="editor-subtitle">Add honors, academy certificates, or professional achievements.</p>
              
              {data.achievements.map((a, i) => (
                <div key={i} className="repeater-card">
                  <div className="repeater-header">
                    <div className="repeater-title">Achievement #{i + 1}</div>
                    {data.achievements.length > 1 && (
                      <button onClick={() => delRow("achievements", i)} className="btn btn-danger" style={{ padding: "6px 12px", fontSize: "0.8rem" }}>
                        ✕ Delete Entry
                      </button>
                    )}
                  </div>

                  <div className="form-group">
                    <label className="form-label">Details / Title (Press Enter for multiple lines)</label>
                    <textarea
                      className="form-input"
                      style={{ resize: "vertical", minHeight: 70, lineHeight: 1.6 }}
                      value={a.text}
                      onChange={e => setArr("achievements", i, "text", e.target.value)}
                      placeholder="AWS Certified Solutions Architect (Associate 2024).&#10;Awarded 'Developer of the Quarter' out of 250 engineers."
                    />
                  </div>

                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label">Certification Badge / Image (Optional)</label>
                    <div className="file-upload-box">
                      {a.image ? (
                        <div>
                          <img src={a.image} alt="cert" style={{ maxWidth: "100%", maxHeight: 180, borderRadius: 8, objectFit: "contain" }} />
                          <div style={{ marginTop: 12 }}>
                            <button onClick={() => setArr("achievements", i, "image", null)} className="btn btn-danger" style={{ padding: "6px 14px", fontSize: "0.8rem" }}>
                              Remove Image
                            </button>
                          </div>
                        </div>
                      ) : (
                        <label style={{ cursor: "pointer", display: "block" }}>
                          <div style={{ fontSize: "2.5rem", marginBottom: 8 }}>📎</div>
                          <div style={{ fontSize: "0.9rem", fontWeight: 700, color: "#fff", marginBottom: 4 }}>Upload proof image</div>
                          <div style={{ fontSize: "0.75rem", color: "var(--text-secondary)" }}>PNG, JPG supported. Click to browse files.</div>
                          <input
                            type="file"
                            accept="image/*"
                            style={{ display: "none" }}
                            onChange={ev => {
                              const f = ev.target.files[0];
                              if (!f) return;
                              const r = new FileReader();
                              r.onload = e2 => setArr("achievements", i, "image", e2.target.result);
                              r.readAsDataURL(f);
                            }}
                          />
                        </label>
                      )}
                    </div>
                  </div>
                </div>
              ))}

              <button className="btn-add-repeater" onClick={() => addRow("achievements", { text: "", image: null })}>
                ➕ Add Another Achievement / Certificate
              </button>
              
              <Next />
            </div>
          )}

          {step === "finalize" && (
            <div className="animate-fade-in">
              <h2 className="editor-title">Looking Good!</h2>
              <p className="editor-subtitle">Review the live A4 preview on the side pane, then proceed to download.</p>
              
              <div className="finalize-card">
                <div className="finalize-title">Ready to Review</div>
                <div className="finalize-desc">
                  Your profile details are complete. Double-check email addresses, links, and job dates. You can click any step in the sidebar to return and edit at any time.
                </div>
              </div>

              <div style={{ background: "rgba(30, 41, 59, 0.4)", borderRadius: 12, padding: 18, border: "1px solid var(--border-glass)", fontSize: "0.85rem", color: "var(--text-secondary)", display: "flex", flexDirection: "column", gap: 6, marginBottom: 12 }}>
                <div><strong>Selected Layout:</strong> {TEMPLATES.find(t => t.value === tmpl)?.title}</div>
                <div><strong>Experience Profile:</strong> {EXP.find(e => e.value === exp)?.label}</div>
              </div>
              
              <Next label="Finish & Generate Resume →" />
            </div>
          )}
        </div>

        {/* Live A4 Preview Pane */}
        <div className={`preview-pane ${activeMobileTab !== "preview" ? "hidden" : ""}`} ref={previewContainerRef}>
          <div className="preview-pane-header">
            <div className="preview-label">Live A4 Preview</div>
            <button onClick={() => setPage("templates")} className="btn btn-secondary" style={{ padding: "6px 14px", fontSize: "0.75rem" }}>
              🎨 Layouts
            </button>
          </div>
          
          <div className="a4-container">
            <div className="a4-scale-wrapper" style={{ transform: `scale(${previewScale})` }}>
              <div className="a4-scaler" ref={printRef}>
                <Resume tmpl={tmpl} d={pd} f={1} />
              </div>
            </div>
          </div>

          <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", textAlign: "center", lineHeight: 1.4 }}>
            Visual preview fits page height. <br />
            Download matches exactly A4 printing grids.
          </div>
        </div>
      </div>
    );
  }

  // ── PREVIEW SCREEN ────────────────────────────────────────────────────────
  if (page === "preview") {
    return (
      <div className="preview-screen animate-fade-in">
        <h2 style={{ fontSize: "1.75rem", fontWeight: 800, textAlign: "center", color: "#fff", marginBottom: 30, fontFamily: "var(--font-heading)" }}>
          Your Resume is Ready to Download
        </h2>
        
        <div className="preview-grid">
          {/* Resume A4 display */}
          <div className="preview-output-card">
            <div style={{ background: "#fff", padding: 0 }}>
              <Resume tmpl={tmpl} d={pd} f={1} />
            </div>

            {data.achievements.some(a => a.image) && (
              <div style={{ padding: 24, borderTop: "1px solid #e5e7eb", background: "#f9fafb" }}>
                <h3 style={{ fontSize: "0.95rem", fontWeight: 700, color: "#1f2937", marginBottom: 12 }}>Proof Documents Attached:</h3>
                <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
                  {data.achievements.filter(a => a.image).map((a, i) => (
                    <div key={i} style={{ border: "1px solid #e5e7eb", borderRadius: 8, overflow: "hidden", background: "#fff", width: 180, boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}>
                      <img src={a.image} alt={`certificate-proof-${i}`} style={{ width: "100%", height: 110, objectFit: "cover" }} />
                      {a.text && <div style={{ padding: 8, fontSize: "0.75rem", color: "#4b5563", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{lines(a.text)[0]}</div>}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Action sidebar details */}
          <div className="preview-sidebar-card">
            <div style={{ fontSize: "2rem", marginBottom: 12 }}>✨</div>
            <h3 style={{ fontSize: "1.2rem", fontWeight: 700, color: "#fff", marginBottom: 8, fontFamily: "var(--font-heading)" }}>All Finished!</h3>
            <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", marginBottom: 24, lineHeight: 1.5 }}>
              Choose your next action. You can print directly or save as A4 vector PDF.
            </p>

            <button onClick={handlePrint} className="btn btn-primary" style={{ width: "100%", marginBottom: 10, padding: "14px 0" }}>
              🖨️ Print / Save PDF
            </button>
            
            <button onClick={() => setPage("builder")} className="btn btn-secondary" style={{ width: "100%", marginBottom: 10, padding: "12px 0" }}>
              ✏️ Back to Editor
            </button>
            
            <button
              onClick={() => {
                setPage("welcome");
                setDone(new Set());
                setStep("personal");
                setExp("");
                setData({
                  personal: { firstName: "", lastName: "", profession: "", city: "", country: "", phone: "", email: "", linkedin: "", github: "" },
                  summary: "",
                  education: [{ degree: "", institution: "", location: "", year: "" }],
                  workExperience: [{ jobTitle: "", company: "", location: "", duration: "", rawText: "" }],
                  skillsText: "",
                  fresherExperience: "",
                  projects: [{ name: "", description: "", tech: "" }],
                  achievements: [{ text: "", image: null }],
                });
              }}
              className="btn"
              style={{ width: "100%", background: "rgba(239, 68, 68, 0.1)", color: "var(--danger)", border: "1px solid rgba(239, 68, 68, 0.2)", padding: "12px 0" }}
            >
              ➕ Create New Resume
            </button>

            <div style={{ marginTop: 24, paddingTop: 16, borderTop: "1px solid var(--border-glass)", fontSize: "0.75rem", color: "var(--text-secondary)", display: "flex", flexDirection: "column", gap: 4 }}>
              <div><strong>Selected layout:</strong> {TEMPLATES.find(t => t.value === tmpl)?.title}</div>
              <div><strong>Experience:</strong> {EXP.find(e => e.value === exp)?.label}</div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}