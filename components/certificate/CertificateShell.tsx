import type { ReactNode } from "react";
import { LogoEmblem } from "./DocumentParts";

export const WATERMARK_TEXT = Array(260).fill("RCCACE").join(" ");

export function CertificateShell({
  width,
  height,
  footerSecretary = "Secretary",
  footerController = "Controller Of Examination",
  dated,
  place,
  children,
}: {
  width: number;
  height: number;
  footerSecretary?: string;
  footerController?: string;
  dated: string;
  place: string;
  children: ReactNode;
}) {
  return (
    <div className="doc-shell" style={{ width, height }}>
      <div className="doc-frame">
        <div className="doc-sheet">
          <div className="tile-wm" aria-hidden="true">
            {WATERMARK_TEXT}
          </div>

          <div className="seal-wm" aria-hidden="true">
            <svg viewBox="0 0 200 200" className="seal-wm-svg">
              <circle cx="100" cy="100" r="96" className="seal-wm-outer" />
              <circle cx="100" cy="100" r="82" className="seal-wm-inner" />
              <text x="100" y="106" className="seal-wm-text">
                RCCACE
              </text>
            </svg>
          </div>

          <div className="doc-content">
            <svg className="doc-arch" viewBox="-30 0 960 280" aria-hidden="true">
              <defs>
                <path
                  id="archPath"
                  d="M 20,250 A 470,250 0 0 1 880,250"
                  fill="none"
                />
              </defs>
              <text>
                <textPath
                  href="#archPath"
                  startOffset="50%"
                  textAnchor="middle"
                  textLength={880}
                  lengthAdjust="spacingAndGlyphs"
                >
                  Rama Coaching Centre &amp; Computer Education
                </textPath>
              </text>
            </svg>

            <div className="doc-recognised">RECOGNISED BY GOVT. OF INDIA</div>
            <div className="doc-brand">RCCACE</div>

            <div className="doc-logo" aria-hidden="true">
              <LogoEmblem />
            </div>

            {children}

            <div className="doc-footer">
              <div className="doc-footer-dated">Dated : {dated || "—"}</div>
              <div className="doc-footer-row">
                <div className="doc-footer-place">Place: {place || "—"}</div>
                <div className="doc-footer-secretary">{footerSecretary}</div>
                <div className="doc-footer-controller">{footerController}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
