import { useState, useRef } from "react";

// ── Constants ────────────────────────────────────────────────────────────────
const STEPS = [
  { id:"personal",       label:"Heading",      n:"1" },
  { id:"workExperience", label:"Experience",   n:"2" },
  { id:"education",      label:"Education",    n:"3" },
  { id:"skills",         label:"Skills",       n:"4" },
  { id:"projects",       label:"Projects",     n:"5" },
  { id:"achievements",   label:"Achievements", n:"6" },
  { id:"finalize",       label:"Finalize",     n:"7" },
];

const TEMPLATES = [
  { value:"classic",      title:"Classic",       recommended:true,  desc:"Timeless serif, trusted by recruiters." },
  { value:"modern",       title:"Modern",        recommended:false, desc:"Bold dark header, strong contrast." },
  { value:"executive",    title:"Executive",     recommended:false, desc:"Two-column layout for senior roles." },
  { value:"greenclassic", title:"Green Classic", recommended:false, desc:"Serif with green section dividers." },
  { value:"twocolumn",    title:"Two Column",    recommended:false, desc:"Left sidebar + right main content." },
  { value:"simplesans",   title:"Simple Sans",   recommended:false, desc:"Clean sans-serif with ruled sections." },
];

const EXP = [
  { value:"none",  label:"No Experience" },
  { value:"lt3",   label:"Less Than 3 Years" },
  { value:"3to5",  label:"3-5 Years" },
  { value:"5to10", label:"5-10 Years" },
  { value:"10p",   label:"10+ Years" },
];

// ── Helpers ──────────────────────────────────────────────────────────────────
const s = (base, f) => base * f;

// Clickable link — opens in new tab
function L({ href, children, style }) {
  if (!href) return <span style={style}>{children}</span>;
  const url = href.startsWith("http") ? href : `https://${href}`;
  return <a href={url} target="_blank" rel="noopener noreferrer" style={{ color:"inherit", textDecoration:"underline", ...style }}>{children}</a>;
}

// lines from textarea
const lines = str => (str || "").split("\n").map(l => l.trim()).filter(Boolean);

// ── Section title components ─────────────────────────────────────────────────
const SecTitle = ({ text, f, color="#222", borderColor="#bbb", serif }) => (
  <div style={{ fontFamily:serif?"Georgia,serif":"inherit", fontSize:s(9,f), fontWeight:700,
    borderBottom:`${s(1,f)}px solid ${borderColor}`, paddingBottom:s(2,f), marginBottom:s(4,f),
    letterSpacing:"0.07em", textTransform:"uppercase", color }}>
    {text}
  </div>
);

// ── Resume contact line ──────────────────────────────────────────────────────
function ContactLine({ d, f, sep=" • " }) {
  const parts = [];
  if (d.city)     parts.push(<span key="c">{d.city}</span>);
  if (d.phone)    parts.push(<span key="p">{d.phone}</span>);
  if (d.email)    parts.push(<span key="e">{d.email}</span>);
  if (d.linkedin) parts.push(<L key="li" href={d.linkedin}>LinkedIn</L>);
  if (d.github)   parts.push(<L key="gh" href={d.github}>GitHub</L>);
  return (
    <div style={{ fontSize:s(8.5,f), color:"#555", display:"flex", flexWrap:"wrap", justifyContent:"center", gap:s(4,f) }}>
      {parts.map((el, i) => (
        <span key={i}>{i > 0 && <span style={{ margin:`0 ${s(2,f)}px` }}>{sep}</span>}{el}</span>
      ))}
    </div>
  );
}

// ── TEMPLATE: Classic ────────────────────────────────────────────────────────
function TClassic({ d, f=1 }) {
  const p = d.personal;
  return (
    <div style={{ fontFamily:"Georgia,serif", fontSize:s(10,f), color:"#222", lineHeight:1.55,
      padding:`${s(22,f)}px ${s(24,f)}px`, width:"100%", boxSizing:"border-box" }}>
      {/* header */}
      <div style={{ textAlign:"center", borderBottom:`${s(2,f)}px solid #1a3c6e`, paddingBottom:s(10,f), marginBottom:s(12,f) }}>
        <div style={{ fontSize:s(22,f), fontWeight:700, color:"#1a3c6e" }}>{p.firstName} {p.lastName}</div>
        <div style={{ marginTop:s(5,f) }}><ContactLine d={p} f={f} /></div>
      </div>
      {/* education */}
      {d.education.some(e=>e.degree||e.institution) && (
        <div style={{ marginBottom:s(8,f) }}>
          <SecTitle text="Education" f={f} serif />
          {d.education.filter(e=>e.degree||e.institution).map((e,i)=>(
            <div key={i} style={{ display:"flex", justifyContent:"space-between", fontSize:s(9,f), marginBottom:s(5,f) }}>
              <div><strong>{e.degree}</strong><br/><span style={{ color:"#555" }}>{e.institution}{e.location?` – ${e.location}`:""}</span></div>
              <div style={{ color:"#555", whiteSpace:"nowrap", marginLeft:s(10,f) }}>{e.year}</div>
            </div>
          ))}
        </div>
      )}
      {/* experience */}
      {(d.workExperience.some(w=>w.jobTitle||w.company)||d.isFresher) && (
        <div style={{ marginBottom:s(8,f) }}>
          <SecTitle text="Experience" f={f} serif />
          {d.isFresher && <div style={{ fontSize:s(9,f), color:"#666", fontStyle:"italic", marginBottom:s(4,f) }}>Fresher – seeking entry-level opportunity</div>}
          {d.fresherExperience && <div style={{ fontSize:s(9,f), color:"#666", marginBottom:s(4,f) }}>{d.fresherExperience}</div>}
          {d.workExperience.filter(w=>w.jobTitle||w.company).map((w,i)=>(
            <div key={i} style={{ marginBottom:s(7,f) }}>
              <div style={{ display:"flex", justifyContent:"space-between", fontSize:s(9.5,f) }}>
                <strong>{w.jobTitle}</strong><span style={{ color:"#666" }}>{w.duration}</span>
              </div>
              <div style={{ fontSize:s(9,f), color:"#555" }}>{w.company}{w.location?` – ${w.location}`:""}</div>
              {lines(w.rawText).map((b,j)=><div key={j} style={{ fontSize:s(8.5,f), marginLeft:s(10,f), marginTop:s(2,f) }}>• {b}</div>)}
            </div>
          ))}
        </div>
      )}
      {/* skills */}
      {lines(d.skillsText).length>0 && (
        <div style={{ marginBottom:s(8,f) }}>
          <SecTitle text="Skills" f={f} serif />
          {lines(d.skillsText).map((sk,i)=><div key={i} style={{ fontSize:s(9,f) }}>• {sk}</div>)}
        </div>
      )}
      {/* projects */}
      {d.projects.some(p=>p.name) && (
        <div style={{ marginBottom:s(8,f) }}>
          <SecTitle text="Projects" f={f} serif />
          {d.projects.filter(p=>p.name).map((p,i)=>(
            <div key={i} style={{ marginBottom:s(6,f) }}>
              <strong style={{ fontSize:s(9.5,f) }}>• {p.name}</strong>{p.tech && <span style={{ fontSize:s(8.5,f), color:"#666" }}> — {p.tech}</span>}
              {lines(p.description).map((b,j)=><div key={j} style={{ fontSize:s(8.5,f), marginLeft:s(12,f), marginTop:s(1,f) }}>{b}</div>)}
            </div>
          ))}
        </div>
      )}
      {/* achievements */}
      {d.achievements.some(a=>a.text) && (
        <div style={{ marginBottom:s(8,f) }}>
          <SecTitle text="Achievements" f={f} serif />
          {d.achievements.filter(a=>a.text).map((a,i)=>(
            lines(a.text).map((b,j)=><div key={`${i}-${j}`} style={{ fontSize:s(9,f), marginBottom:s(2,f) }}>• {b}</div>)
          ))}
        </div>
      )}
      {/* summary — always LAST */}
    </div>
  );
}

// ── TEMPLATE: Modern ─────────────────────────────────────────────────────────
function TModern({ d, f=1 }) {
  const p = d.personal;
  return (
    <div style={{ fontFamily:"Arial,sans-serif", fontSize:s(10,f), color:"#222", lineHeight:1.5, width:"100%", boxSizing:"border-box" }}>
      <div style={{ background:"#111", color:"#fff", padding:`${s(16,f)}px ${s(20,f)}px` }}>
        <span style={{ fontSize:s(24,f), fontWeight:700, color:"#e07b3a" }}>{p.firstName} </span>
        <span style={{ fontSize:s(24,f), fontWeight:700 }}>{p.lastName}</span>
      </div>
      <div style={{ background:"#2a2a2a", color:"#ddd", padding:`${s(5,f)}px ${s(20,f)}px`, fontSize:s(8.5,f), display:"flex", flexWrap:"wrap", gap:s(6,f) }}>
        {p.city && <span>{p.city}</span>}
        {p.phone && <span>| {p.phone}</span>}
        {p.email && <span>| <L href={`mailto:${p.email}`} style={{ color:"#aad4ff" }}>{p.email}</L></span>}
        {p.linkedin && <span>| <L href={p.linkedin} style={{ color:"#aad4ff" }}>LinkedIn</L></span>}
        {p.github && <span>| <L href={p.github} style={{ color:"#aad4ff" }}>GitHub</L></span>}
      </div>
      <div style={{ padding:`${s(16,f)}px ${s(20,f)}px` }}>
        {d.education.some(e=>e.degree||e.institution) && (
          <div style={{ marginBottom:s(8,f) }}>
            <SecTitle text="Education" f={f} />
            {d.education.filter(e=>e.degree||e.institution).map((e,i)=>(
              <div key={i} style={{ display:"flex", justifyContent:"space-between", fontSize:s(9,f), marginBottom:s(4,f) }}>
                <div><strong>{e.degree}</strong><br/><span style={{ color:"#555" }}>{e.institution}{e.location?` – ${e.location}`:""}</span></div>
                <div style={{ color:"#555", whiteSpace:"nowrap", marginLeft:s(10,f) }}>{e.year}</div>
              </div>
            ))}
          </div>
        )}
        {(d.workExperience.some(w=>w.jobTitle||w.company)||d.isFresher) && (
          <div style={{ marginBottom:s(8,f) }}>
            <SecTitle text="Experience" f={f} />
            {d.isFresher && <div style={{ fontSize:s(9,f), fontStyle:"italic", color:"#666", marginBottom:s(4,f) }}>Fresher – seeking entry-level opportunity</div>}
            {d.fresherExperience && <div style={{ fontSize:s(9,f), color:"#666", marginBottom:s(4,f) }}>{d.fresherExperience}</div>}
            {d.workExperience.filter(w=>w.jobTitle||w.company).map((w,i)=>(
              <div key={i} style={{ marginBottom:s(7,f) }}>
                <div style={{ display:"flex", justifyContent:"space-between", fontSize:s(9.5,f) }}><strong>{w.jobTitle}</strong><span style={{ color:"#666" }}>{w.duration}</span></div>
                <div style={{ fontSize:s(9,f), color:"#555" }}>{w.company}{w.location?` – ${w.location}`:""}</div>
                {lines(w.rawText).map((b,j)=><div key={j} style={{ fontSize:s(8.5,f), marginLeft:s(10,f), marginTop:s(2,f) }}>• {b}</div>)}
              </div>
            ))}
          </div>
        )}
        {lines(d.skillsText).length>0 && <div style={{ marginBottom:s(8,f) }}><SecTitle text="Skills" f={f} />{lines(d.skillsText).map((sk,i)=><div key={i} style={{ fontSize:s(9,f) }}>• {sk}</div>)}</div>}
        {d.projects.some(p=>p.name) && (
          <div style={{ marginBottom:s(8,f) }}>
            <SecTitle text="Projects" f={f} />
            {d.projects.filter(p=>p.name).map((p,i)=>(
              <div key={i} style={{ marginBottom:s(6,f) }}>
                <strong style={{ fontSize:s(9.5,f) }}>• {p.name}</strong>{p.tech && <span style={{ fontSize:s(8.5,f), color:"#666" }}> — {p.tech}</span>}
                {lines(p.description).map((b,j)=><div key={j} style={{ fontSize:s(8.5,f), marginLeft:s(12,f), marginTop:s(1,f) }}>{b}</div>)}
              </div>
            ))}
          </div>
        )}
        {d.achievements.some(a=>a.text) && <div style={{ marginBottom:s(8,f) }}><SecTitle text="Achievements" f={f} />{d.achievements.filter(a=>a.text).map((a,i)=>lines(a.text).map((b,j)=><div key={`${i}-${j}`} style={{ fontSize:s(9,f), marginBottom:s(2,f) }}>• {b}</div>))}</div>}
      </div>
    </div>
  );
}

// ── TEMPLATE: Executive (2-col) ──────────────────────────────────────────────
function TExecutive({ d, f=1 }) {
  const p = d.personal;
  return (
    <div style={{ fontFamily:"Arial,sans-serif", fontSize:s(10,f), color:"#222", display:"flex", width:"100%", boxSizing:"border-box" }}>
      <div style={{ width:s(120,f), background:"#f0f4fa", padding:`${s(18,f)}px ${s(12,f)}px`, flexShrink:0 }}>
        <div style={{ fontSize:s(9,f), fontWeight:700, color:"#2e6da4", borderBottom:"1px solid #2e6da4", marginBottom:s(5,f), paddingBottom:s(2,f) }}>CONTACT</div>
        <div style={{ fontSize:s(8,f), color:"#444", lineHeight:1.8, marginBottom:s(12,f) }}>
          {p.city && <div>{p.city}</div>}
          {p.phone && <div>{p.phone}</div>}
          {p.email && <div><L href={`mailto:${p.email}`}>{p.email}</L></div>}
          {p.linkedin && <div><L href={p.linkedin}>LinkedIn</L></div>}
          {p.github && <div><L href={p.github}>GitHub</L></div>}
        </div>
        {lines(d.skillsText).length>0 && <>
          <div style={{ fontSize:s(9,f), fontWeight:700, color:"#2e6da4", borderBottom:"1px solid #2e6da4", marginBottom:s(5,f), paddingBottom:s(2,f) }}>SKILLS</div>
          {lines(d.skillsText).map((sk,i)=><div key={i} style={{ fontSize:s(8,f), color:"#444", marginBottom:s(3,f) }}>• {sk}</div>)}
        </>}
      </div>
      <div style={{ flex:1, padding:`${s(18,f)}px ${s(16,f)}px` }}>
        <div style={{ borderBottom:"1px solid #ddd", paddingBottom:s(8,f), marginBottom:s(10,f) }}>
          <div style={{ fontSize:s(20,f), fontWeight:700 }}>{p.firstName} {p.lastName}</div>
        </div>
        {d.education.some(e=>e.degree||e.institution) && (
          <div style={{ marginBottom:s(8,f) }}>
            <SecTitle text="Education" f={f} color="#c0390b" borderColor="#c0390b" />
            {d.education.filter(e=>e.degree||e.institution).map((e,i)=>(
              <div key={i} style={{ display:"flex", justifyContent:"space-between", fontSize:s(9,f), marginBottom:s(4,f) }}>
                <div><strong>{e.degree}</strong><br/><span style={{ color:"#555" }}>{e.institution}{e.location?` – ${e.location}`:""}</span></div>
                <div style={{ color:"#555", whiteSpace:"nowrap", marginLeft:s(10,f) }}>{e.year}</div>
              </div>
            ))}
          </div>
        )}
        {(d.workExperience.some(w=>w.jobTitle)||d.isFresher) && (
          <div style={{ marginBottom:s(8,f) }}>
            <SecTitle text="Experience" f={f} color="#c0390b" borderColor="#c0390b" />
            {d.isFresher && <div style={{ fontSize:s(9,f), fontStyle:"italic", color:"#666", marginBottom:s(4,f) }}>Fresher – entry-level</div>}
            {d.fresherExperience && <div style={{ fontSize:s(9,f), color:"#666", marginBottom:s(4,f) }}>{d.fresherExperience}</div>}
            {d.workExperience.filter(w=>w.jobTitle||w.company).map((w,i)=>(
              <div key={i} style={{ marginBottom:s(7,f) }}>
                <div style={{ display:"flex", justifyContent:"space-between", fontSize:s(9.5,f) }}><strong>{w.jobTitle}{w.company?` | ${w.company}`:""}</strong><span style={{ color:"#666" }}>{w.duration}</span></div>
                {lines(w.rawText).map((b,j)=><div key={j} style={{ fontSize:s(8.5,f), marginLeft:s(10,f), marginTop:s(2,f) }}>• {b}</div>)}
              </div>
            ))}
          </div>
        )}
        {d.projects.some(p=>p.name) && (
          <div style={{ marginBottom:s(8,f) }}>
            <SecTitle text="Projects" f={f} color="#c0390b" borderColor="#c0390b" />
            {d.projects.filter(p=>p.name).map((p,i)=>(
              <div key={i} style={{ marginBottom:s(6,f) }}>
                <strong style={{ fontSize:s(9.5,f) }}>• {p.name}</strong>{p.tech && <span style={{ fontSize:s(8.5,f), color:"#666" }}> — {p.tech}</span>}
                {lines(p.description).map((b,j)=><div key={j} style={{ fontSize:s(8.5,f), marginLeft:s(12,f), marginTop:s(1,f) }}>{b}</div>)}
              </div>
            ))}
          </div>
        )}
        {d.achievements.some(a=>a.text) && <div style={{ marginBottom:s(8,f) }}><SecTitle text="Achievements" f={f} color="#c0390b" borderColor="#c0390b" />{d.achievements.filter(a=>a.text).map((a,i)=>lines(a.text).map((b,j)=><div key={`${i}-${j}`} style={{ fontSize:s(9,f), marginBottom:s(2,f) }}>• {b}</div>))}</div>}
      </div>
    </div>
  );
}

// ── TEMPLATE: Green Classic ──────────────────────────────────────────────────
function TGreenClassic({ d, f=1 }) {
  const p = d.personal; const G="#4a7c3f";
  return (
    <div style={{ fontFamily:"'Times New Roman',Georgia,serif", fontSize:s(10,f), color:"#222", lineHeight:1.55, padding:`${s(22,f)}px ${s(24,f)}px`, width:"100%", boxSizing:"border-box" }}>
      <div style={{ textAlign:"center", marginBottom:s(12,f) }}>
        <div style={{ fontSize:s(22,f), fontWeight:700, letterSpacing:"0.08em", textTransform:"uppercase" }}>{p.firstName} {p.lastName}</div>
        <div style={{ marginTop:s(5,f) }}><ContactLine d={p} f={f} sep=" | " /></div>
      </div>
      {d.education.some(e=>e.degree||e.institution) && (
        <div style={{ marginBottom:s(8,f) }}>
          <SecTitle text="Education" f={f} borderColor={G} />
          {d.education.filter(e=>e.degree||e.institution).map((e,i)=>(
            <div key={i} style={{ marginBottom:s(5,f) }}>
              <div style={{ display:"flex", justifyContent:"space-between", fontSize:s(9,f) }}><strong>{e.degree||e.institution}</strong><span style={{ color:"#555" }}>{e.year}</span></div>
              <div style={{ fontSize:s(8.5,f), color:"#555" }}>{e.institution}{e.location?` | ${e.location}`:""}</div>
            </div>
          ))}
        </div>
      )}
      {(d.workExperience.some(w=>w.jobTitle)||d.isFresher) && (
        <div style={{ marginBottom:s(8,f) }}>
          <SecTitle text="Experience" f={f} borderColor={G} />
          {d.isFresher && <div style={{ fontSize:s(9,f), color:"#666", fontStyle:"italic", marginBottom:s(4,f) }}>Fresher in industry</div>}
          {d.fresherExperience && <div style={{ fontSize:s(9,f), color:"#666", marginBottom:s(4,f) }}>{d.fresherExperience}</div>}
          {d.workExperience.filter(w=>w.jobTitle||w.company).map((w,i)=>(
            <div key={i} style={{ marginBottom:s(7,f) }}>
              <div style={{ fontWeight:700, fontSize:s(9.5,f) }}>{w.jobTitle}</div>
              <div style={{ display:"flex", justifyContent:"space-between", fontSize:s(9,f) }}><span style={{ color:"#555" }}>{w.company}{w.location?` | ${w.location}`:""}</span><span style={{ color:"#555" }}>{w.duration}</span></div>
              {lines(w.rawText).map((b,j)=><div key={j} style={{ fontSize:s(8.5,f), marginLeft:s(10,f), marginTop:s(2,f) }}>• {b}</div>)}
            </div>
          ))}
        </div>
      )}
      {lines(d.skillsText).length>0 && <div style={{ marginBottom:s(8,f) }}><SecTitle text="Skills" f={f} borderColor={G} /><div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:`${s(2,f)}px`, fontSize:s(9,f) }}>{lines(d.skillsText).map((sk,i)=><div key={i}>• {sk}</div>)}</div></div>}
      {d.projects.some(p=>p.name) && (
        <div style={{ marginBottom:s(8,f) }}>
          <SecTitle text="Projects" f={f} borderColor={G} />
          {d.projects.filter(p=>p.name).map((p,i)=>(
            <div key={i} style={{ marginBottom:s(6,f) }}>
              <strong style={{ fontSize:s(9.5,f) }}>• {p.name}</strong>{p.tech && <span style={{ fontSize:s(8.5,f), color:"#666" }}> — {p.tech}</span>}
              {lines(p.description).map((b,j)=><div key={j} style={{ fontSize:s(8.5,f), marginLeft:s(12,f), marginTop:s(1,f) }}>{b}</div>)}
            </div>
          ))}
        </div>
      )}
      {d.achievements.some(a=>a.text) && <div style={{ marginBottom:s(8,f) }}><SecTitle text="Achievements" f={f} borderColor={G} />{d.achievements.filter(a=>a.text).map((a,i)=>lines(a.text).map((b,j)=><div key={`${i}-${j}`} style={{ fontSize:s(9,f), marginBottom:s(2,f) }}>• {b}</div>))}</div>}
    </div>
  );
}

// ── TEMPLATE: Two Column ─────────────────────────────────────────────────────
function TTwoColumn({ d, f=1 }) {
  const p = d.personal;
  return (
    <div style={{ fontFamily:"'Helvetica Neue',Arial,sans-serif", fontSize:s(10,f), color:"#333", width:"100%", boxSizing:"border-box" }}>
      <div style={{ padding:`${s(16,f)}px ${s(18,f)}px ${s(10,f)}px`, borderBottom:"1px solid #ccc" }}>
        <div style={{ fontSize:s(26,f), fontWeight:200, letterSpacing:"0.1em", textTransform:"uppercase" }}>{p.firstName} {p.lastName}</div>
      </div>
      <div style={{ display:"flex" }}>
        {/* sidebar */}
        <div style={{ width:s(115,f), flexShrink:0, background:"#fafafa", borderRight:"1px solid #e8e8e8", padding:`${s(14,f)}px ${s(12,f)}px` }}>
          <div style={{ fontSize:s(8,f), fontWeight:700, letterSpacing:"0.1em", textTransform:"uppercase", color:"#888", marginBottom:s(5,f) }}>Contact</div>
          {p.city && <div style={{ fontSize:s(8,f), color:"#555", marginBottom:s(2,f) }}>{p.city}</div>}
          {p.phone && <div style={{ fontSize:s(8,f), color:"#555", marginBottom:s(2,f) }}>{p.phone}</div>}
          {p.email && <div style={{ fontSize:s(8,f), marginBottom:s(2,f), wordBreak:"break-all" }}><L href={`mailto:${p.email}`}>{p.email}</L></div>}
          {p.linkedin && <div style={{ fontSize:s(8,f), marginBottom:s(2,f) }}><L href={p.linkedin}>LinkedIn</L></div>}
          {p.github && <div style={{ fontSize:s(8,f), marginBottom:s(2,f) }}><L href={p.github}>GitHub</L></div>}
          {lines(d.skillsText).length>0 && <>
            <div style={{ fontSize:s(8,f), fontWeight:700, letterSpacing:"0.1em", textTransform:"uppercase", color:"#888", margin:`${s(12,f)}px 0 ${s(4,f)}px`, borderTop:"1px solid #ddd", paddingTop:s(8,f) }}>Skills</div>
            {lines(d.skillsText).map((sk,i)=><div key={i} style={{ fontSize:s(8,f), color:"#555", marginBottom:s(3,f) }}>{sk}</div>)}
          </>}
          <div style={{ fontSize:s(8,f), fontWeight:700, letterSpacing:"0.1em", textTransform:"uppercase", color:"#888", margin:`${s(12,f)}px 0 ${s(4,f)}px`, borderTop:"1px solid #ddd", paddingTop:s(8,f) }}>Education</div>
          {d.education.filter(e=>e.degree||e.institution).map((e,i)=>(
            <div key={i} style={{ marginBottom:s(6,f) }}>
              <div style={{ fontSize:s(8.5,f), color:"#444", fontWeight:600 }}>{e.institution}</div>
              <div style={{ fontSize:s(8,f), color:"#777", fontWeight:700 }}>{e.year}</div>
              <div style={{ fontSize:s(8,f), color:"#555" }}>{e.degree}</div>
            </div>
          ))}
        </div>
        {/* main */}
        <div style={{ flex:1, padding:`${s(14,f)}px ${s(16,f)}px` }}>
          {(d.workExperience.some(w=>w.jobTitle||w.company)||d.isFresher) && (
            <div style={{ marginBottom:s(10,f) }}>
              <div style={{ fontSize:s(8.5,f), fontWeight:700, letterSpacing:"0.1em", textTransform:"uppercase", color:"#888", marginBottom:s(5,f) }}>Experience</div>
              {d.isFresher && <div style={{ fontSize:s(9,f), fontStyle:"italic", color:"#888", marginBottom:s(5,f) }}>Fresher – seeking opportunity</div>}
              {d.fresherExperience && <div style={{ fontSize:s(9,f), color:"#666", marginBottom:s(5,f) }}>{d.fresherExperience}</div>}
              {d.workExperience.filter(w=>w.jobTitle||w.company).map((w,i)=>(
                <div key={i} style={{ marginBottom:s(8,f) }}>
                  <div style={{ fontSize:s(9.5,f), fontWeight:600 }}>{w.jobTitle}</div>
                  <div style={{ fontSize:s(8.5,f), color:"#888", fontWeight:600 }}>{w.duration}</div>
                  <div style={{ fontSize:s(8.5,f), color:"#555" }}>{w.company}{w.location?` – ${w.location}`:""}</div>
                  {lines(w.rawText).map((b,j)=><div key={j} style={{ fontSize:s(8.5,f), color:"#444", marginLeft:s(8,f), marginTop:s(1,f) }}>• {b}</div>)}
                </div>
              ))}
            </div>
          )}
          {d.projects.some(p=>p.name) && (
            <div style={{ marginBottom:s(10,f), borderTop:"1px solid #eee", paddingTop:s(8,f) }}>
              <div style={{ fontSize:s(8.5,f), fontWeight:700, letterSpacing:"0.1em", textTransform:"uppercase", color:"#888", marginBottom:s(5,f) }}>Projects</div>
              {d.projects.filter(p=>p.name).map((p,i)=>(
                <div key={i} style={{ marginBottom:s(6,f) }}>
                  <div style={{ fontSize:s(9.5,f), fontWeight:600 }}>{p.name}{p.tech && <span style={{ fontSize:s(8,f), color:"#888", fontWeight:400 }}> | {p.tech}</span>}</div>
                  {lines(p.description).map((b,j)=><div key={j} style={{ fontSize:s(8.5,f), color:"#444", marginTop:s(1,f) }}>{b}</div>)}
                </div>
              ))}
            </div>
          )}
          {d.achievements.some(a=>a.text) && <div style={{ marginBottom:s(10,f), borderTop:"1px solid #eee", paddingTop:s(8,f) }}><div style={{ fontSize:s(8.5,f), fontWeight:700, letterSpacing:"0.1em", textTransform:"uppercase", color:"#888", marginBottom:s(5,f) }}>Achievements</div>{d.achievements.filter(a=>a.text).map((a,i)=>lines(a.text).map((b,j)=><div key={`${i}-${j}`} style={{ fontSize:s(9,f), color:"#444", marginBottom:s(3,f) }}>• {b}</div>))}</div>}
        </div>
      </div>
    </div>
  );
}

// ── TEMPLATE: Simple Sans ────────────────────────────────────────────────────
function TSimpleSans({ d, f=1 }) {
  const p = d.personal;
  return (
    <div style={{ fontFamily:"'Calibri',Arial,sans-serif", fontSize:s(10,f), color:"#222", lineHeight:1.6, padding:`${s(20,f)}px ${s(22,f)}px`, width:"100%", boxSizing:"border-box" }}>
      <div style={{ marginBottom:s(8,f) }}>
        <div style={{ fontSize:s(24,f), fontWeight:700, color:"#111" }}>{p.firstName} {p.lastName}</div>
        <div style={{ fontSize:s(9,f), color:"#444", marginTop:s(4,f), display:"flex", flexWrap:"wrap", gap:s(8,f) }}>
          {p.phone && <span>📞 {p.phone}</span>}
          {p.email && <span>✉ <L href={`mailto:${p.email}`}>{p.email}</L></span>}
          {p.linkedin && <span>in <L href={p.linkedin} style={{ color:"#0077b5" }}>{p.linkedin}</L></span>}
          {p.github && <span>⌥ <L href={p.github}>{p.github}</L></span>}
        </div>
      </div>
      {d.education.some(e=>e.degree||e.institution) && (
        <div style={{ marginBottom:s(8,f) }}>
          <div style={{ fontSize:s(11,f), fontWeight:700 }}>Education</div>
          <div style={{ borderBottom:"1px solid #999", margin:`${s(2,f)}px 0 ${s(5,f)}px` }} />
          {d.education.filter(e=>e.degree||e.institution).map((e,i)=>(
            <div key={i} style={{ marginBottom:s(4,f) }}>
              <div style={{ fontSize:s(9.5,f) }}>{e.institution}{e.location?` (${e.location})`:""}</div>
              <div style={{ fontSize:s(9,f) }}>{e.degree}{e.year?` (${e.year})`:""}</div>
            </div>
          ))}
        </div>
      )}
      <div style={{ marginBottom:s(8,f) }}>
        <div style={{ fontSize:s(11,f), fontWeight:700 }}>Experience</div>
        <div style={{ borderBottom:"1px solid #999", margin:`${s(2,f)}px 0 ${s(5,f)}px` }} />
        {d.isFresher && <div style={{ fontSize:s(9,f), marginLeft:s(10,f) }}>Fresher in tech Industry</div>}
        {d.fresherExperience && <div style={{ fontSize:s(9,f), marginLeft:s(10,f), color:"#666", marginBottom:s(5,f) }}>{d.fresherExperience}</div>}
        {d.workExperience.filter(w=>w.jobTitle||w.company).map((w,i)=>(
          <div key={i} style={{ marginBottom:s(6,f) }}>
            <div style={{ display:"flex", justifyContent:"space-between", fontSize:s(9.5,f) }}><strong>{w.jobTitle}</strong><span style={{ color:"#666" }}>{w.duration}</span></div>
            <div style={{ fontSize:s(9,f), color:"#555" }}>{w.company}{w.location?` – ${w.location}`:""}</div>
            {lines(w.rawText).map((b,j)=><div key={j} style={{ fontSize:s(8.5,f), marginLeft:s(10,f) }}>• {b}</div>)}
          </div>
        ))}
      </div>
      {d.projects.some(p=>p.name) && (
        <div style={{ marginBottom:s(8,f) }}>
          <div style={{ fontSize:s(11,f), fontWeight:700 }}>Project</div>
          <div style={{ borderBottom:"1px solid #999", margin:`${s(2,f)}px 0 ${s(5,f)}px` }} />
          {d.projects.filter(p=>p.name).map((p,i)=>(
            <div key={i} style={{ marginBottom:s(5,f) }}>
              <div style={{ fontSize:s(9.5,f) }}>• <strong>{p.name}</strong>{p.tech && <span style={{ fontSize:s(8.5,f), color:"#555" }}> — {p.tech}</span>}</div>
              {lines(p.description).map((b,j)=><div key={j} style={{ fontSize:s(8.5,f), marginLeft:s(14,f) }}>{b}</div>)}
            </div>
          ))}
        </div>
      )}
      {lines(d.skillsText).length>0 && (
        <div style={{ marginBottom:s(8,f) }}>
          <div style={{ fontSize:s(11,f), fontWeight:700 }}>Technical Skills</div>
          <div style={{ borderBottom:"1px solid #999", margin:`${s(2,f)}px 0 ${s(5,f)}px` }} />
          {lines(d.skillsText).map((sk,i)=><div key={i} style={{ fontSize:s(9,f) }}>• {sk}</div>)}
        </div>
      )}
      {d.achievements.some(a=>a.text) && (
        <div style={{ marginBottom:s(8,f) }}>
          <div style={{ fontSize:s(11,f), fontWeight:700 }}>Achievements</div>
          <div style={{ borderBottom:"1px solid #999", margin:`${s(2,f)}px 0 ${s(5,f)}px` }} />
          {d.achievements.filter(a=>a.text).map((a,i)=>lines(a.text).map((b,j)=><div key={`${i}-${j}`} style={{ fontSize:s(9,f), marginBottom:s(2,f) }}>• {b}</div>))}
        </div>
      )}
    </div>
  );
}

// ── Template router ──────────────────────────────────────────────────────────
function Resume({ tmpl, d, f=1 }) {
  if (tmpl==="modern")       return <TModern d={d} f={f} />;
  if (tmpl==="executive")    return <TExecutive d={d} f={f} />;
  if (tmpl==="greenclassic") return <TGreenClassic d={d} f={f} />;
  if (tmpl==="twocolumn")    return <TTwoColumn d={d} f={f} />;
  if (tmpl==="simplesans")   return <TSimpleSans d={d} f={f} />;
  return <TClassic d={d} f={f} />;
}

// ── Template Card — portrait preview ────────────────────────────────────────
function TCard({ tmpl, sel, data, onSelect }) {
  return (
    <div onClick={onSelect} style={{ border:sel?"2.5px solid #1a3c6e":"1.5px solid #dde2ec", borderRadius:10, background:"#fff", cursor:"pointer", overflow:"hidden", boxShadow:sel?"0 4px 20px rgba(26,60,110,.2)":"0 1px 6px rgba(0,0,0,.06)", position:"relative" }}>
      {tmpl.recommended && <div style={{ position:"absolute", bottom:46, left:"50%", transform:"translateX(-50%)", background:"rgba(255,220,220,.97)", color:"#c0392b", fontSize:9, fontWeight:800, padding:"4px 12px", borderRadius:4, textTransform:"uppercase", zIndex:2, whiteSpace:"nowrap", border:"1px solid #e8b4b4" }}>★ RECOMMENDED</div>}
      {sel && <div style={{ position:"absolute", top:8, right:8, width:22, height:22, background:"#1a3c6e", borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center", color:"#fff", fontSize:12, zIndex:2 }}>✓</div>}
      {/* A4 portrait ratio 210:297 */}
      <div style={{ width:"100%", paddingTop:"141.4%", position:"relative", overflow:"hidden", background:"#fff", borderBottom:"1px solid #f0f0f0" }}>
        <div style={{ position:"absolute", top:0, left:0, width:"100%", height:"100%", overflow:"hidden" }}>
          <div style={{ transform:"scale(0.27)", transformOrigin:"top left", width:"370%", pointerEvents:"none" }}>
            <Resume tmpl={tmpl.value} d={data} f={1.8} />
          </div>
        </div>
      </div>
      <div style={{ padding:"10px 14px 12px" }}>
        <div style={{ fontWeight:700, fontSize:13, color:"#1a1a1a", marginBottom:2 }}>{tmpl.title}</div>
        <div style={{ fontSize:11, color:"#888" }}>{tmpl.desc}</div>
      </div>
    </div>
  );
}

// ── Sample data for template previews ────────────────────────────────────────
const SAMPLE = {
  personal:{ firstName:"Saanvi", lastName:"Patel", profession:"Retail Sales Associate", city:"New Delhi", phone:"+91 22 1234 5677", email:"saanvipatel@sample.in", linkedin:"linkedin.com/in/saanvi", github:"github.com/saanvi" },
  summary:"Motivated Sales Associate with 5 years of experience boosting sales and customer loyalty through individualized service.",
  education:[{ degree:"Diploma: Financial Accounting", institution:"Oxford Software Institute", location:"New Delhi", year:"June 2016" }],
  workExperience:[{ jobTitle:"Retail Sales Associate", company:"H&M", location:"New Delhi", duration:"05/2016 – Current", rawText:"Upsold products adding ₹3000 to monthly sales.\nGenerated brand awareness to increase sales 22%." }],
  skillsText:"Store opening and closing\nAccurate Money Handling\nLoss prevention\nSales expertise\nStore Merchandising",
  projects:[{ name:"Sales Tracker", description:"Built a dashboard to track daily targets.", tech:"React, Node.js" }],
  achievements:[{ text:"Achieved A Grade in Python Training from PC Training Institute", image:null }],
  isFresher:false,
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
  const printRef = useRef(null);

  const [data, setData] = useState({
    personal:{ firstName:"", lastName:"", profession:"", city:"", country:"", phone:"", email:"", linkedin:"", github:"" },
    summary:"",
    education:[{ degree:"", institution:"", location:"", year:"" }],
    workExperience:[{ jobTitle:"", company:"", location:"", duration:"", rawText:"" }],
    skillsText:"",
    fresherExperience:"",
    projects:[{ name:"", description:"", tech:"" }],
    achievements:[{ text:"", image:null }],
  });

  const isFresher = exp==="none";

  // live preview data — fall back to sample when fields empty
  const pd = {
    personal:{
      ...data.personal,
      firstName: data.personal.firstName||SAMPLE.personal.firstName,
      lastName:  data.personal.lastName ||SAMPLE.personal.lastName,
      profession:data.personal.profession||SAMPLE.personal.profession,
    },
    summary:   data.summary||SAMPLE.summary,
    education: data.education.some(e=>e.degree||e.institution)?data.education:SAMPLE.education,
    workExperience: data.workExperience.some(w=>w.jobTitle||w.company)?data.workExperience:SAMPLE.workExperience,
    skillsText: data.skillsText||SAMPLE.skillsText,
    fresherExperience: data.fresherExperience||"",
    projects:  data.projects.some(p=>p.name)?data.projects:SAMPLE.projects,
    achievements: data.achievements.some(a=>a.text)?data.achievements:SAMPLE.achievements,
    isFresher,
  };

  // helpers
  const setP  = (k,v) => setData(p=>({...p, personal:{...p.personal,[k]:v}}));
  const setArr= (key,i,k,v)=>setData(p=>{const a=[...p[key]];a[i]={...a[i],[k]:v};return{...p,[key]:a};});
  const addRow= (key,t)=>setData(p=>({...p,[key]:[...p[key],{...t}]}));
  const delRow= (key,i)=>setData(p=>({...p,[key]:p[key].filter((_,j)=>j!==i)}));
  const markDone = st=>setDone(p=>new Set([...p,st]));
  const progress = Math.round((done.size/(STEPS.length-1))*100);

  const goNext=()=>{
    markDone(step);
    if(step==="finalize"){setPage("preview");return;}
    const i=STEPS.findIndex(s=>s.id===step);
    setStep(STEPS[i+1].id);
  };

  // Print — injects resume into a hidden print container
  const handlePrint=()=>{
    const el=printRef.current; if(!el) return;
    const win=window.open("","_blank","width=900,height=700");
    win.document.write(`<!DOCTYPE html><html><head><title>Resume</title><style>body{margin:0;padding:0;}@page{margin:0;size:A4;}</style></head><body>${el.innerHTML}</body></html>`);
    win.document.close();
    win.focus();
    setTimeout(()=>{win.print();},400);
  };

  // Styles
  const inp = {width:"100%",border:"1.5px solid #dde2ec",borderRadius:6,padding:"9px 12px",fontSize:14,color:"#222",background:"#fff",boxSizing:"border-box",outline:"none",fontFamily:"inherit"};
  const lbl = {display:"block",fontSize:11,fontWeight:600,color:"#555",marginBottom:5,textTransform:"uppercase",letterSpacing:"0.07em"};
  const g   = {marginBottom:16};
  const r2  = {display:"grid",gridTemplateColumns:"1fr 1fr",gap:14};
  const crd = {background:"#f9fafb",borderRadius:8,padding:16,marginBottom:16,border:"1px solid #eee"};
  const abtn= {background:"none",border:"1.5px dashed #1a3c6e",borderRadius:6,padding:"9px 18px",color:"#1a3c6e",fontSize:13,fontWeight:600,cursor:"pointer",marginBottom:24};

  const Next=({label})=>(
    <div style={{display:"flex",justifyContent:"flex-end",marginTop:8}}>
      <button onClick={goNext} style={{background:"#1a3c6e",color:"#fff",border:"none",borderRadius:6,padding:"11px 28px",fontSize:14,fontWeight:600,cursor:"pointer"}}>
        {label||"Next →"}
      </button>
    </div>
  );

  // ── WELCOME ──────────────────────────────────────────────────────────────
  if(page==="welcome") return(
    <div style={{minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",background:"linear-gradient(135deg,#1a3c6e,#2e6da4)",fontFamily:"'Helvetica Neue',Arial,sans-serif"}}>
      <div style={{textAlign:"center",color:"#fff",padding:"40px 24px"}}>
        <div style={{fontSize:12,letterSpacing:"0.15em",textTransform:"uppercase",color:"#a8c6e8",marginBottom:16,fontWeight:600}}>Resume Builder</div>
        <h1 style={{fontSize:48,fontWeight:300,margin:"0 0 12px",letterSpacing:"-0.02em"}}>Create Your<br/><span style={{fontWeight:700}}>Perfect Resume</span></h1>
        <p style={{fontSize:16,color:"#a8c6e8",margin:"0 0 40px",maxWidth:420}}>6 professional templates. Fill your details in minutes.</p>
        <button onClick={()=>setPage("experience")} style={{background:"#fff",color:"#1a3c6e",border:"none",borderRadius:8,padding:"14px 40px",fontSize:16,fontWeight:700,cursor:"pointer"}}>Start Building →</button>
      </div>
    </div>
  );

  // ── EXPERIENCE — only Continue, no Back ──────────────────────────────────
  if(page==="experience") return(
    <div style={{minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",background:"#fff",fontFamily:"'Helvetica Neue',Arial,sans-serif",padding:"40px 24px"}}>
      <div style={{textAlign:"center",maxWidth:820,width:"100%"}}>
        <h1 style={{fontSize:34,fontWeight:800,color:"#0d1b3e",margin:"0 0 10px"}}>
          How long have you been working?{" "}
          <span title="Helps us recommend the best template" style={{display:"inline-flex",alignItems:"center",justifyContent:"center",width:24,height:24,borderRadius:"50%",background:"#0d1b3e",color:"#fff",fontSize:12,fontWeight:700,verticalAlign:"middle",cursor:"help"}}>i</span>
        </h1>
        <p style={{fontSize:16,color:"#666",margin:"0 0 44px"}}>We'll find the best templates for your experience level.</p>
        <div style={{display:"flex",gap:14,justifyContent:"center",flexWrap:"wrap",marginBottom:48}}>
          {EXP.map(o=>(
            <button key={o.value} onClick={()=>setExp(o.value)} style={{border:exp===o.value?"2px solid #1a3c6e":"1.5px solid #ccc",borderRadius:14,padding:"16px 28px",fontSize:15,fontWeight:500,background:exp===o.value?"#eef3fb":"#fff",color:exp===o.value?"#1a3c6e":"#333",cursor:"pointer",minWidth:152}}>
              {o.label}
            </button>
          ))}
        </div>
        <button onClick={()=>{if(exp)setPage("templates");}} style={{background:exp?"#1a3c6e":"#ccc",color:"#fff",border:"none",borderRadius:8,padding:"13px 48px",fontSize:15,fontWeight:700,cursor:exp?"pointer":"not-allowed"}}>
          Continue →
        </button>
      </div>
    </div>
  );

  // ── TEMPLATES ─────────────────────────────────────────────────────────────
  if(page==="templates") return(
    <div style={{minHeight:"100vh",background:"#f7f8fc",fontFamily:"'Helvetica Neue',Arial,sans-serif",padding:"36px 24px"}}>
      <div style={{maxWidth:1060,margin:"0 auto"}}>
        <div style={{textAlign:"center",marginBottom:28}}>
          <h1 style={{fontSize:26,fontWeight:700,color:"#1a1a1a",margin:"0 0 6px"}}>Pick Your Design</h1>
          <p style={{fontSize:13,color:"#666",margin:0}}>Experience: <strong>{EXP.find(e=>e.value===exp)?.label}</strong></p>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:18,marginBottom:18}}>
          {TEMPLATES.slice(0,3).map(t=><TCard key={t.value} tmpl={t} sel={tmpl===t.value} data={SAMPLE} onSelect={()=>setTmpl(t.value)}/>)}
        </div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:18,marginBottom:32}}>
          {TEMPLATES.slice(3,6).map(t=><TCard key={t.value} tmpl={t} sel={tmpl===t.value} data={SAMPLE} onSelect={()=>setTmpl(t.value)}/>)}
        </div>
        <div style={{textAlign:"center"}}>
          <button onClick={()=>setPage("builder")} style={{background:"#1a3c6e",color:"#fff",border:"none",borderRadius:8,padding:"13px 48px",fontSize:15,fontWeight:700,cursor:"pointer"}}>
            Use {TEMPLATES.find(t=>t.value===tmpl)?.title} Template →
          </button>
        </div>
      </div>
    </div>
  );

  // ── BUILDER ───────────────────────────────────────────────────────────────
  if(page==="builder") return(
    <div style={{minHeight:"100vh",display:"flex",fontFamily:"'Helvetica Neue',Arial,sans-serif",background:"#f7f8fc"}}>

      {/* Sidebar */}
      <div style={{width:200,background:"#1a2744",color:"#fff",display:"flex",flexDirection:"column",flexShrink:0}}>
        <div style={{padding:"18px 16px 12px",borderBottom:"1px solid rgba(255,255,255,.1)"}}>
          <div style={{fontSize:9,letterSpacing:"0.12em",color:"#7b9ec8",textTransform:"uppercase",fontWeight:600}}>Resume Builder</div>
        </div>
        <nav style={{flex:1,padding:"6px 0",overflowY:"auto"}}>
          {STEPS.map(st=>{
            const isA=step===st.id, isD=done.has(st.id);
            return(
              <button key={st.id} onClick={()=>setStep(st.id)} style={{width:"100%",background:isA?"rgba(255,255,255,.12)":"transparent",border:"none",color:isA?"#fff":isD?"#7fc47f":"#8aacd4",padding:"10px 16px",textAlign:"left",cursor:"pointer",display:"flex",alignItems:"center",gap:10,fontSize:12,fontWeight:isA?600:400}}>
                <div style={{width:22,height:22,borderRadius:"50%",border:`2px solid ${isA?"#fff":isD?"#7fc47f":"#4a6fa5"}`,background:isD?"#7fc47f":isA?"rgba(255,255,255,.2)":"transparent",display:"flex",alignItems:"center",justifyContent:"center",fontSize:9,fontWeight:700,flexShrink:0}}>
                  {isD?"✓":st.n}
                </div>
                {st.label}
              </button>
            );
          })}
        </nav>
        <div style={{padding:"10px 16px",borderTop:"1px solid rgba(255,255,255,.1)"}}>
          <div style={{fontSize:9,color:"#7b9ec8",marginBottom:4,display:"flex",justifyContent:"space-between"}}><span>Completeness</span><span>{progress}%</span></div>
          <div style={{height:3,background:"rgba(255,255,255,.15)",borderRadius:2}}>
            <div style={{height:"100%",width:`${progress}%`,background:"#4caf50",borderRadius:2,transition:"width .4s"}}/>
          </div>
        </div>
        <div style={{padding:"8px 16px",borderTop:"1px solid rgba(255,255,255,.1)"}}>
          <button onClick={()=>setPage("templates")} style={{background:"none",border:"none",color:"#4a9fd4",fontSize:10,cursor:"pointer",padding:0,textDecoration:"underline"}}>Change template</button>
        </div>
      </div>

      {/* Form */}
      <div style={{flex:1,padding:"26px 30px",overflowY:"auto",maxWidth:600}}>

        {step==="personal" && (
          <div>
            <h2 style={{fontSize:21,fontWeight:700,color:"#1a1a1a",margin:"0 0 4px"}}>Contact Details</h2>
            <p style={{fontSize:13,color:"#888",margin:"0 0 22px"}}>Include email, phone, LinkedIn & GitHub for best results.</p>
            <div style={r2}>
              <div style={g}><label style={lbl}>First Name *</label><input style={inp} value={data.personal.firstName} onChange={e=>setP("firstName",e.target.value)} placeholder="First Name"/></div>
              <div style={g}><label style={lbl}>Last Name *</label><input style={inp} value={data.personal.lastName} onChange={e=>setP("lastName",e.target.value)} placeholder="Last Name"/></div>
            </div>
            <div style={r2}>
              <div style={g}><label style={lbl}>City</label><input style={inp} value={data.personal.city} onChange={e=>setP("city",e.target.value)} placeholder="New Delhi"/></div>
              <div style={g}><label style={lbl}>Country</label><input style={inp} value={data.personal.country} onChange={e=>setP("country",e.target.value)} placeholder="India"/></div>
            </div>
            <div style={r2}>
              <div style={g}><label style={lbl}>Phone</label><input style={inp} value={data.personal.phone} onChange={e=>setP("phone",e.target.value)} placeholder="+91 98765 43210"/></div>
              <div style={g}><label style={lbl}>Email *</label><input style={inp} type="email" value={data.personal.email} onChange={e=>setP("email",e.target.value)} placeholder="you@example.com"/></div>
            </div>
            <div style={g}><label style={lbl}>LinkedIn URL</label><input style={inp} value={data.personal.linkedin} onChange={e=>setP("linkedin",e.target.value)} placeholder="linkedin.com/in/yourprofile"/></div>
            <div style={g}><label style={lbl}>GitHub URL</label><input style={inp} value={data.personal.github} onChange={e=>setP("github",e.target.value)} placeholder="github.com/yourusername"/></div>
            <Next/>
          </div>
        )}

        {step==="workExperience" && (
          <div>
            <h2 style={{fontSize:21,fontWeight:700,color:"#1a1a1a",margin:"0 0 4px"}}>Work Experience</h2>
            {isFresher && <div style={{background:"#e8f5e9",border:"1px solid #c8e6c9",borderRadius:8,padding:"12px 16px",marginBottom:14,fontSize:13,color:"#2e7d32"}}><strong>Fresher!</strong> "Fresher in tech industry" will appear on your resume. Add internships below if any.</div>}
            {isFresher && <div style={g}><label style={lbl}>Fresher Tech Experience</label><textarea style={{...inp,resize:"vertical",minHeight:90,lineHeight:1.8}} value={data.fresherExperience} onChange={e=>setData(p=>({...p,fresherExperience:e.target.value}))} placeholder="Summarize your technical projects, bootcamps, or training."/></div>}
            <p style={{fontSize:13,color:"#888",margin:"0 0 16px"}}>Press <kbd style={{background:"#eee",padding:"1px 6px",borderRadius:3,fontSize:12}}>Enter</kbd> after each responsibility to add a new bullet point.</p>
            {data.workExperience.map((w,i)=>(
              <div key={i} style={crd}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
                  <div style={{fontSize:13,fontWeight:600}}>Job #{i+1}</div>
                  {data.workExperience.length>1 && <button onClick={()=>delRow("workExperience",i)} style={{background:"none",border:"none",color:"#e53935",cursor:"pointer",fontSize:12}}>✕ Remove</button>}
                </div>
                <div style={r2}>
                  <div style={g}><label style={lbl}>Job Title</label><input style={inp} value={w.jobTitle} onChange={e=>setArr("workExperience",i,"jobTitle",e.target.value)} placeholder="Software Developer"/></div>
                  <div style={g}><label style={lbl}>Company</label><input style={inp} value={w.company} onChange={e=>setArr("workExperience",i,"company",e.target.value)} placeholder="Company Name"/></div>
                </div>
                <div style={r2}>
                  <div style={g}><label style={lbl}>Location</label><input style={inp} value={w.location} onChange={e=>setArr("workExperience",i,"location",e.target.value)} placeholder="City, Country"/></div>
                  <div style={g}><label style={lbl}>Duration</label><input style={inp} value={w.duration} onChange={e=>setArr("workExperience",i,"duration",e.target.value)} placeholder="Jan 2022 – Present"/></div>
                </div>
                <div style={g}>
                  <label style={lbl}>Responsibilities (Enter = new bullet)</label>
                  <textarea style={{...inp,resize:"vertical",minHeight:90,lineHeight:1.9}} value={w.rawText} onChange={e=>setArr("workExperience",i,"rawText",e.target.value)} placeholder={"Managed team of 5 engineers\nImproved performance by 30%\nDeployed CI/CD pipeline"}/>
                  {lines(w.rawText).length>0 && <div style={{marginTop:6,background:"#f0f4ff",borderRadius:6,padding:"8px 12px"}}>{lines(w.rawText).map((b,j)=><div key={j} style={{fontSize:12,color:"#1a3c6e"}}>• {b}</div>)}</div>}
                </div>
              </div>
            ))}
            <button style={abtn} onClick={()=>addRow("workExperience",{jobTitle:"",company:"",location:"",duration:"",rawText:""})}>+ Add Another Job</button>
            <Next/>
          </div>
        )}

        {step==="education" && (
          <div>
            <h2 style={{fontSize:21,fontWeight:700,color:"#1a1a1a",margin:"0 0 4px"}}>Education</h2>
            <p style={{fontSize:13,color:"#888",margin:"0 0 16px"}}>Add highest qualification first.</p>
            {data.education.map((e,i)=>(
              <div key={i} style={crd}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
                  <div style={{fontSize:13,fontWeight:600}}>Education #{i+1}</div>
                  {data.education.length>1 && <button onClick={()=>delRow("education",i)} style={{background:"none",border:"none",color:"#e53935",cursor:"pointer",fontSize:12}}>✕ Remove</button>}
                </div>
                <div style={r2}>
                  <div style={g}><label style={lbl}>Degree / Course</label><input style={inp} value={e.degree} onChange={ev=>setArr("education",i,"degree",ev.target.value)} placeholder="B.Tech Computer Science"/></div>
                  <div style={g}><label style={lbl}>Year</label><input style={inp} value={e.year} onChange={ev=>setArr("education",i,"year",ev.target.value)} placeholder="2020–2024"/></div>
                </div>
                <div style={r2}>
                  <div style={g}><label style={lbl}>Institution</label><input style={inp} value={e.institution} onChange={ev=>setArr("education",i,"institution",ev.target.value)} placeholder="University / College"/></div>
                  <div style={g}><label style={lbl}>Location</label><input style={inp} value={e.location} onChange={ev=>setArr("education",i,"location",ev.target.value)} placeholder="Delhi"/></div>
                </div>
              </div>
            ))}
            <button style={abtn} onClick={()=>addRow("education",{degree:"",institution:"",location:"",year:""})}>+ Add Education</button>
            <Next/>
          </div>
        )}

        {step==="skills" && (
          <div>
            <h2 style={{fontSize:21,fontWeight:700,color:"#1a1a1a",margin:"0 0 4px"}}>Skills</h2>
            <p style={{fontSize:13,color:"#888",margin:"0 0 6px"}}>Type one skill per line. Press <kbd style={{background:"#eee",padding:"1px 6px",borderRadius:3,fontSize:12}}>Enter</kbd> to go to the next line — each line becomes a bullet on your resume.</p>
            <textarea
              style={{...inp,resize:"vertical",minHeight:220,lineHeight:2.1,fontSize:14,marginBottom:10}}
              value={data.skillsText}
              onChange={e=>setData(p=>({...p,skillsText:e.target.value}))}
              placeholder={"React.js\nNode.js\nMongoDB\nCommunication\nTeam Leadership"}
            />
            {lines(data.skillsText).length>0 && (
              <div style={{background:"#f0f4ff",borderRadius:8,padding:"10px 14px",marginBottom:16}}>
                <div style={{fontSize:11,color:"#1a3c6e",fontWeight:600,marginBottom:6,textTransform:"uppercase",letterSpacing:"0.08em"}}>Preview</div>
                {lines(data.skillsText).map((sk,i)=><div key={i} style={{fontSize:13,color:"#1a3c6e"}}>• {sk}</div>)}
              </div>
            )}
            <Next/>
          </div>
        )}

        {step==="projects" && (
          <div>
            <h2 style={{fontSize:21,fontWeight:700,color:"#1a1a1a",margin:"0 0 4px"}}>Projects</h2>
            <p style={{fontSize:13,color:"#888",margin:"0 0 16px"}}>Press <kbd style={{background:"#eee",padding:"1px 6px",borderRadius:3,fontSize:12}}>Enter</kbd> in description to add new points.</p>
            {data.projects.map((p,i)=>(
              <div key={i} style={crd}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
                  <div style={{fontSize:13,fontWeight:600}}>Project #{i+1}</div>
                  {data.projects.length>1 && <button onClick={()=>delRow("projects",i)} style={{background:"none",border:"none",color:"#e53935",cursor:"pointer",fontSize:12}}>✕ Remove</button>}
                </div>
                <div style={g}><label style={lbl}>Project Name</label><input style={inp} value={p.name} onChange={e=>setArr("projects",i,"name",e.target.value)} placeholder="e.g. To-Do App"/></div>
                <div style={g}>
                  <label style={lbl}>Description (Enter = new line)</label>
                  <textarea style={{...inp,resize:"vertical",minHeight:90,lineHeight:1.9}} value={p.description} onChange={e=>setArr("projects",i,"description",e.target.value)} placeholder={"Created a responsive to-do list using HTML, CSS, JS\nFeatures: add, delete, mark as complete\nDeployed on GitHub Pages"}/>
                </div>
                <div style={g}><label style={lbl}>Technologies</label><input style={inp} value={p.tech} onChange={e=>setArr("projects",i,"tech",e.target.value)} placeholder="HTML, CSS, JavaScript, React"/></div>
              </div>
            ))}
            <button style={abtn} onClick={()=>addRow("projects",{name:"",description:"",tech:""})}>+ Add Project</button>
            <Next/>
          </div>
        )}

        {step==="achievements" && (
          <div>
            <h2 style={{fontSize:21,fontWeight:700,color:"#1a1a1a",margin:"0 0 4px"}}>Achievements & Certificates</h2>
            <p style={{fontSize:13,color:"#888",margin:"0 0 16px"}}>Awards, grades, certifications. Press Enter for multiple items. Certificate image is optional.</p>
            {data.achievements.map((a,i)=>(
              <div key={i} style={crd}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
                  <div style={{fontSize:13,fontWeight:600}}>Achievement #{i+1}</div>
                  {data.achievements.length>1 && <button onClick={()=>delRow("achievements",i)} style={{background:"none",border:"none",color:"#e53935",cursor:"pointer",fontSize:12}}>✕ Remove</button>}
                </div>
                <div style={g}>
                  <label style={lbl}>Description (Enter = new line)</label>
                  <textarea style={{...inp,resize:"vertical",minHeight:72,lineHeight:1.9}} value={a.text} onChange={e=>setArr("achievements",i,"text",e.target.value)} placeholder={'Achieved "A" Grade in Python Training from PC Training Institute\nGot Silver Certificate from FEA Employability Academy'}/>
                </div>
                <div style={g}>
                  <label style={lbl}>Certificate Image <span style={{fontWeight:400,textTransform:"none",letterSpacing:0,color:"#aaa"}}>(optional)</span></label>
                  <div style={{border:"1.5px dashed #ccc",borderRadius:8,padding:"14px 16px",textAlign:"center",background:"#fafafa"}}>
                    {a.image?(
                      <div>
                        <img src={a.image} alt="cert" style={{maxWidth:"100%",maxHeight:160,borderRadius:6,objectFit:"contain"}}/>
                        <div style={{marginTop:8}}><button onClick={()=>setArr("achievements",i,"image",null)} style={{background:"none",border:"1px solid #e53935",borderRadius:4,color:"#e53935",fontSize:11,padding:"3px 10px",cursor:"pointer"}}>✕ Remove</button></div>
                      </div>
                    ):(
                      <label style={{cursor:"pointer",display:"block"}}>
                        <div style={{fontSize:26,marginBottom:4}}>📎</div>
                        <div style={{fontSize:13,color:"#888"}}>Click to upload certificate image</div>
                        <div style={{fontSize:11,color:"#bbb",marginTop:3}}>PNG, JPG supported</div>
                        <input type="file" accept="image/*" style={{display:"none"}} onChange={ev=>{
                          const f=ev.target.files[0]; if(!f) return;
                          const r=new FileReader();
                          r.onload=e2=>setArr("achievements",i,"image",e2.target.result);
                          r.readAsDataURL(f);
                        }}/>
                      </label>
                    )}
                  </div>
                </div>
              </div>
            ))}
            <button style={abtn} onClick={()=>addRow("achievements",{text:"",image:null})}>+ Add Achievement</button>
            <Next/>
          </div>
        )}

        {step==="finalize" && (
          <div>
            <h2 style={{fontSize:21,fontWeight:700,color:"#1a1a1a",margin:"0 0 4px"}}>Ready to Finalize?</h2>
            <p style={{fontSize:13,color:"#888",margin:"0 0 16px"}}>Review the live preview on the right, then click Finish.</p>
            <div style={{background:"#e8f5e9",borderRadius:10,padding:18,marginBottom:18,border:"1px solid #c8e6c9"}}>
              <div style={{fontSize:14,fontWeight:700,color:"#2e7d32",marginBottom:4}}>✅ Looking good!</div>
              <div style={{fontSize:13,color:"#388e3c"}}>Click any sidebar section to edit. When ready, click Finish & Preview.</div>
            </div>
            <div style={{background:"#f5f5f5",borderRadius:8,padding:"10px 14px",marginBottom:18,fontSize:12,color:"#555"}}>
              <strong>Template:</strong> {TEMPLATES.find(t=>t.value===tmpl)?.title} &nbsp;|&nbsp;
              <strong>Experience:</strong> {EXP.find(e=>e.value===exp)?.label}
            </div>
            <Next label="Finish & Preview →"/>
          </div>
        )}
      </div>

      {/* Live preview panel — A4 portrait */}
      <div style={{width:150,background:"#fff",borderLeft:"1px solid #e5e9f0",padding:"12px 10px",overflowY:"auto",display:"flex",flexDirection:"column",gap:10,flexShrink:0}}>
        <div style={{fontSize:10,color:"#888",textAlign:"center",letterSpacing:"0.08em",textTransform:"uppercase",fontWeight:600}}>Live Preview</div>
        <div style={{background:"#e8f5e9",borderRadius:7,padding:"6px 10px",display:"flex",alignItems:"center",gap:8}}>
          <div style={{fontSize:12,color:"#2e7d32",fontWeight:700}}>↑ 30%</div>
          <div style={{fontSize:10,color:"#388e3c"}}>Higher chance of getting a job</div>
        </div>
        {/* strict A4 portrait container */}
        <div style={{width:"100%",paddingTop:"141.4%",position:"relative",border:"1.5px solid #1a3c6e",borderRadius:4,overflow:"hidden",background:"#fff"}}>
          <div style={{position:"absolute",top:0,left:0,width:"100%",height:"100%",overflow:"hidden"}}>
            <div style={{transform:"scale(0.31)",transformOrigin:"top left",width:"323%",pointerEvents:"none"}}>
              <Resume tmpl={tmpl} d={pd} f={1.65}/>
            </div>
          </div>
        </div>
        <button onClick={()=>setPage("templates")} style={{fontSize:10,color:"#1a3c6e",background:"none",border:"none",cursor:"pointer",textDecoration:"underline",padding:0,textAlign:"center"}}>Change template</button>
      </div>
    </div>
  );

  // ── PREVIEW / DOWNLOAD ────────────────────────────────────────────────────
  if(page==="preview") return(
    <div style={{minHeight:"100vh",background:"#f7f8fc",fontFamily:"'Helvetica Neue',Arial,sans-serif",padding:"28px 20px"}}>
      <div style={{maxWidth:1060,margin:"0 auto",display:"flex",gap:28}}>

        {/* Resume display */}
        <div style={{flex:1}}>
          <h2 style={{fontSize:20,fontWeight:700,color:"#1a1a1a",marginBottom:14}}>Your Resume is Ready</h2>
          <div ref={printRef} style={{background:"#fff",borderRadius:8,overflow:"hidden",boxShadow:"0 2px 24px rgba(0,0,0,.10)"}}>
            <Resume tmpl={tmpl} d={pd} f={1.05}/>
          </div>
          {data.achievements.some(a=>a.image) && (
            <div style={{marginTop:24}}>
              <h3 style={{fontSize:15,fontWeight:700,color:"#1a1a1a",marginBottom:10}}>Uploaded Certificates</h3>
              <div style={{display:"flex",gap:12,flexWrap:"wrap"}}>
                {data.achievements.filter(a=>a.image).map((a,i)=>(
                  <div key={i} style={{border:"1px solid #eee",borderRadius:8,overflow:"hidden",width:185}}>
                    <img src={a.image} alt={`cert-${i}`} style={{width:"100%",height:125,objectFit:"cover"}}/>
                    {a.text && <div style={{padding:"6px 10px",fontSize:10,color:"#555"}}>{lines(a.text)[0]?.slice(0,60)}</div>}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Actions */}
        <div style={{width:210,flexShrink:0}}>
          <div style={{background:"#fff",borderRadius:12,padding:22,boxShadow:"0 2px 16px rgba(0,0,0,.08)",position:"sticky",top:20}}>
            <div style={{fontSize:22,marginBottom:4}}>✨</div>
            <h3 style={{fontSize:17,fontWeight:700,margin:"0 0 6px",color:"#1a1a1a"}}>All Set!</h3>
            <p style={{fontSize:12,color:"#666",margin:"0 0 18px"}}>Your resume is ready to download.</p>
            <button onClick={handlePrint} style={{width:"100%",background:"#1a3c6e",color:"#fff",border:"none",borderRadius:7,padding:"11px 0",fontSize:13,fontWeight:600,cursor:"pointer",marginBottom:8}}>🖨️ Print / Save PDF</button>
            <button onClick={()=>setPage("builder")} style={{width:"100%",background:"none",color:"#1a3c6e",border:"1.5px solid #1a3c6e",borderRadius:7,padding:"9px 0",fontSize:12,fontWeight:600,cursor:"pointer",marginBottom:8}}>✏️ Edit Details</button>
            <button onClick={()=>{setPage("welcome");setDone(new Set());setStep("personal");setExp("");}} style={{width:"100%",background:"none",color:"#666",border:"1.5px solid #ddd",borderRadius:7,padding:"9px 0",fontSize:12,fontWeight:600,cursor:"pointer"}}>➕ Create New Resume</button>
            <div style={{marginTop:14,padding:"10px 0",borderTop:"1px solid #f0f0f0",fontSize:11,color:"#888"}}>
              <div><strong>Template:</strong> {TEMPLATES.find(t=>t.value===tmpl)?.title}</div>
              <div><strong>Experience:</strong> {EXP.find(e=>e.value===exp)?.label}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}