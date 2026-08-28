export function LogoEmblem() {
  return (
    <svg viewBox="0 0 100 100" className="doc-logo-svg" aria-hidden="true">
      <circle cx="50" cy="50" r="48" className="doc-logo-outer" />
      <circle cx="50" cy="50" r="42" className="doc-logo-inner" />
      <text x="50" y="46" className="doc-logo-monogram">
        RCC
      </text>
      <text x="50" y="64" className="doc-logo-sub">
        ACE
      </text>
    </svg>
  );
}
