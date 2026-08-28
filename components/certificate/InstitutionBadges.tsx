export function InstitutionBadges() {
  return (
    <div className="doc-badges" aria-hidden="true">
      <div className="doc-badge">
        <svg viewBox="0 0 80 84" className="doc-badge-svg" role="img" aria-label="MSME">
          {/* simplified lion capital / national emblem */}
          <circle cx="40" cy="26" r="13" fill="none" stroke="#7a1f1f" strokeWidth="2" />
          {Array.from({ length: 12 }).map((_, i) => {
            const a = (i * 30 * Math.PI) / 180;
            return (
              <line
                key={i}
                x1={40 + Math.cos(a) * 4}
                y1={26 + Math.sin(a) * 4}
                x2={40 + Math.cos(a) * 12}
                y2={26 + Math.sin(a) * 12}
                stroke="#7a1f1f"
                strokeWidth="1.4"
              />
            );
          })}
          <rect x="20" y="42" width="40" height="6" fill="#7a1f1f" />
          <path d="M24,42 a6,6 0 0,1 12,0 Z" fill="#7a1f1f" />
          <path d="M34,42 a6,6 0 0,1 12,0 Z" fill="#7a1f1f" />
          <path d="M44,42 a6,6 0 0,1 12,0 Z" fill="#7a1f1f" />
          <path d="M22,50 L58,50 L54,64 L26,64 Z" fill="#7a1f1f" />
          <rect x="18" y="64" width="44" height="6" fill="#7a1f1f" />
        </svg>
        <span className="doc-badge-text">
          MICRO, SMALL &amp; MEDIUM
          <br />
          ENTERPRISES · MSME
        </span>
      </div>

      <div className="doc-badge">
        <svg viewBox="0 0 80 80" className="doc-badge-svg" role="img" aria-label="ISO 9001:2015">
          <defs>
            <path
              id="iso-arc"
              d="M40,40 m-32,0 a32,32 0 1,1 64,0 a32,32 0 1,1 -64,0"
            />
          </defs>
          <circle cx="40" cy="40" r="38" fill="#0b3d91" />
          <circle cx="40" cy="40" r="31" fill="none" stroke="#fff" strokeWidth="1.4" />
          <text className="doc-badge-iso-text">
            <textPath href="#iso-arc" startOffset="3%">
              CERTIFIED · ISO 9001:2015 · COMPANY
            </textPath>
          </text>
          <text x="40" y="38" className="doc-badge-iso-mark">
            ISO
          </text>
          <text x="40" y="54" className="doc-badge-iso-mark2">
            9001
          </text>
        </svg>
        <span className="doc-badge-text">CERTIFIED COMPANY</span>
      </div>

      <div className="doc-badge">
        <svg viewBox="0 0 80 84" className="doc-badge-svg" role="img" aria-label="NITI Aayog">
          <circle cx="40" cy="26" r="13" fill="none" stroke="#7a1f1f" strokeWidth="2" />
          {Array.from({ length: 12 }).map((_, i) => {
            const a = (i * 30 * Math.PI) / 180;
            return (
              <line
                key={i}
                x1={40 + Math.cos(a) * 4}
                y1={26 + Math.sin(a) * 4}
                x2={40 + Math.cos(a) * 12}
                y2={26 + Math.sin(a) * 12}
                stroke="#7a1f1f"
                strokeWidth="1.4"
              />
            );
          })}
          <rect x="20" y="42" width="40" height="6" fill="#7a1f1f" />
          <path d="M24,42 a6,6 0 0,1 12,0 Z" fill="#7a1f1f" />
          <path d="M34,42 a6,6 0 0,1 12,0 Z" fill="#7a1f1f" />
          <path d="M44,42 a6,6 0 0,1 12,0 Z" fill="#7a1f1f" />
          <path d="M22,50 L58,50 L54,64 L26,64 Z" fill="#7a1f1f" />
          <rect x="18" y="64" width="44" height="6" fill="#7a1f1f" />
        </svg>
        <span className="doc-badge-text">नीति आयोग · NITI AAYOG</span>
      </div>
    </div>
  );
}
