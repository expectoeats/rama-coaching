import type { CertificateData } from "@/types/certificate";
import { LogoEmblem } from "./DocumentParts";
import { InstitutionBadges } from "./InstitutionBadges";
import { WATERMARK_TEXT } from "./CertificateShell";

const WIDTH = 794;
const HEIGHT = 1123;

export function ExcellenceCertificate({ data }: { data: CertificateData }) {
  const fields: { label: string; value: string }[] = [
    { label: "Name Of Student", value: data.studentName },
    { label: "Father's Name", value: data.fatherName },
    { label: "Course Code", value: data.courseCode },
    { label: "Name Of Course", value: data.courseName },
    { label: "Date Of Completion", value: data.completionDate },
    { label: "Center Code", value: data.centerCode },
    { label: "Name Of Training Center", value: data.trainingCenter },
    { label: "Performance", value: data.performance },
  ];

  return (
    <div className="doc-shell" style={{ width: WIDTH, height: HEIGHT }}>
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

          <div className="doc-flow">
            <div className="doc-flow-top">
              <header className="doc-flow-header">
                <svg className="doc-arch-flow" viewBox="-30 -70 960 320" aria-hidden="true">
                  <defs>
                    <path id="archPathFlow" d="M 20,250 A 470,250 0 0 1 880,250" fill="none" />
                  </defs>
                  <text style={{ fontSize: 110 }} fill="#000000">
                    <textPath
                      href="#archPathFlow"
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
                <div className="doc-logo">
                  <LogoEmblem />
                </div>
              </header>

              <div className="doc-meta-row">
                <div className="doc-meta-left">
                  <div>
                    <span className="doc-meta-label">क्रम संख्या / Si. No. :</span>
                    <span className="doc-meta-value">{data.slNo || "—"}</span>
                  </div>
                  <div>
                    <span className="doc-meta-label">Roll No. :</span>
                    <span className="doc-meta-value">{data.rollNo || "—"}</span>
                  </div>
                </div>
                <div className="doc-meta-right">
                  <div>
                    <span className="doc-meta-label">Enrollment No. :</span>
                    <span className="doc-meta-value">{data.enrollmentNo || "—"}</span>
                  </div>
                </div>
              </div>

              <div className="doc-title-block">
                <div className="doc-coe-flow">Certificate Of Excellence</div>
                <div className="doc-course-flow">{data.courseName}</div>
              </div>
            </div>

            <div className="doc-flow-body">
              {fields.map((f) => (
                <div key={f.label} className="doc-field-pair">
                  <span className="doc-field-label">{f.label}</span>
                  <span className="doc-field-value">{f.value || "—"}</span>
                </div>
              ))}
            </div>

            <InstitutionBadges />

            <footer className="doc-flow-footer">
              <div className="doc-footer-left">
                <div>Dated : {data.dated || "—"}</div>
                <div>Place : {data.place || "—"}</div>
              </div>
              <div className="doc-footer-secretary">Secretary</div>
              <div className="doc-footer-controller">Controller Of Examination</div>
            </footer>
          </div>
        </div>
      </div>
    </div>
  );
}
