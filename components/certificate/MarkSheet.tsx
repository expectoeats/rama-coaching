import type { CertificateData } from "@/types/certificate";
import { LogoEmblem } from "./DocumentParts";
import { InstitutionBadges } from "./InstitutionBadges";
import { WATERMARK_TEXT } from "./CertificateShell";

const WIDTH = 794;
const HEIGHT = 1123;

export function Marksheet({ data }: { data: CertificateData }) {
  const leftFields: { label: string; value: string }[] = [
    { label: "Roll No. :",           value: data.rollNo },
    { label: "Name:",                value: data.studentName },
    { label: "Father's Name :",      value: data.fatherName },
    { label: "Course Code :",        value: data.courseCode },
    { label: "Date Of Completion :", value: data.completionDate },
    { label: "Training Centre :",    value: data.trainingCenter },
  ];

  const rightFields: { label: string; value: string }[] = [
    { label: "Enrollment No. :", value: data.enrollmentNo },
    { label: "Mother Name :",    value: data.motherName },
    { label: "Course Duration :", value: data.courseDuration },
  ];

  const grades = ["A+", "A", "B", "C", "D"];

  // Use student's profile photo if available, otherwise fall back to public avatar PNG
  const photoSrc = data.photoUrl && data.photoUrl.trim() !== ""
    ? data.photoUrl
    : "/student-avatar.png";

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
              <text x="100" y="106" className="seal-wm-text">RCCACE</text>
            </svg>
          </div>

          <div className="doc-flow doc-flow-marks">
            <div className="doc-flow-top">
              <header className="doc-flow-header doc-flow-header-marks">
                <div className="doc-header-center">
                  {/* Arched institution name — increased font size for prominence */}
                  <svg className="doc-arch-flow" viewBox="-30 -70 960 320" aria-hidden="true">
                    <defs>
                      <path id="archPathMarks" d="M 20,250 A 470,250 0 0 1 880,250" fill="none" />
                    </defs>
                    <text style={{ fontSize: 130 }} fill="#000000">
                      <textPath
                        href="#archPathMarks"
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
                </div>

                {/* Student photo — uses profile photo or student-avatar.png fallback */}
                <div className="doc-photo">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={photoSrc}
                    alt="Student"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      display: "block",
                    }}
                    onError={(e) => {
                      // If profile URL 404s, fall back to avatar
                      (e.currentTarget as HTMLImageElement).src = "/student-avatar.png";
                    }}
                  />
                </div>
              </header>

              <div className="doc-title-block">
                <div className="doc-msheet-flow">MARKSHEET</div>
                <div className="doc-course-flow">{data.courseName}</div>
              </div>

              <div className="doc-marks-meta">
                <div className="doc-marks-meta-col">
                  {leftFields.map((f) => (
                    <div key={f.label} className="doc-meta-field">
                      <span className="doc-field-label">{f.label}</span>
                      <span className="doc-field-value">{f.value || "—"}</span>
                    </div>
                  ))}
                </div>
                <div className="doc-marks-meta-col">
                  {rightFields.map((f) => (
                    <div key={f.label} className="doc-meta-field">
                      <span className="doc-field-label">{f.label}</span>
                      <span className="doc-field-value">{f.value || "—"}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <table className="doc-marks">
              <thead>
                <tr>
                  <th rowSpan={2}>PAPER</th>
                  <th rowSpan={2}>SUBJECT</th>
                  <th colSpan={2}>THEORY</th>
                  <th colSpan={2}>PRACTICAL</th>
                  <th rowSpan={2}>TOTAL</th>
                  <th rowSpan={2}>GRADE</th>
                </tr>
                <tr>
                  <th>MAX</th>
                  <th>MIN</th>
                  <th>MAX</th>
                  <th>MIN</th>
                </tr>
              </thead>
              <tbody>
                {data.subjects.map((s) => (
                  <tr key={s.paper}>
                    <td className="doc-paper">{s.paper}</td>
                    <td className="doc-subject">{s.subject}</td>
                    <td>{s.theoryMax}</td>
                    <td>{s.theoryMin}</td>
                    <td>{s.practicalMax}</td>
                    <td>{s.practicalMin}</td>
                    <td>{s.total}</td>
                    <td>{s.grade}</td>
                  </tr>
                ))}
                <tr className="doc-total-row">
                  <td className="doc-paper" />
                  <td className="doc-subject">TOTAL MARKS</td>
                  <td /><td /><td /><td /><td /><td />
                </tr>
              </tbody>
            </table>

            <div className="doc-disclaimer-flow">
              Disclaimer : The information shown is provisional and provided for the convenience of
              students. The final result will be published after verification by the COE office,
              RCCACE
            </div>

            <div className="doc-legend-flow">
              <div className="doc-legend-head-flow">
                श्रेणियों का आख्यान GRADE LEGEND
              </div>
              <div className="doc-legend-boxes">
                {grades.map((g) => (
                  <div key={g} className="doc-legend-box">{g}</div>
                ))}
              </div>
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
