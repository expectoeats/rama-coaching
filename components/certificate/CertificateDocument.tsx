import type { CertificateData } from "@/types/certificate";

function formatDetail(label: string, value?: string) {
  return { label, value: value && value.trim() !== "" ? value : "—" };
}

export function CertificateDocument({ data }: { data: CertificateData }) {
  const details = [
    formatDetail("Enrollment No.", data.enrollmentNumber),
    formatDetail("Certificate No.", data.certificateNumber),
    formatDetail("Completion Date", data.completionDate),
    formatDetail("Issue Date", data.issueDate),
  ];

  return (
    <div className="cert-page" id="print-certificate">
      <div className="cert-frame">
        <div className="cert-content">
          <header className="cert-header">
            <div className="cert-logo" aria-hidden="true">
              <span>RC</span>
            </div>
            <div className="cert-institute">{data.instituteName || "Rama Coaching Center"}</div>
            <div className="cert-institute-sub">Educational &amp; Computer Training Institute</div>
            <div className="cert-rule" />
          </header>

          <div className="cert-title">Certificate of Completion</div>
          <div className="cert-presented">This is proudly presented to</div>
          <div className="cert-student">{data.studentName || "—"}</div>
          {data.parentName && data.parentName.trim() !== "" ? (
            <div className="cert-parent">Son / Daughter of {data.parentName}</div>
          ) : null}

          <p className="cert-body">
            has successfully completed the course of{" "}
            <strong>{data.courseName || "—"}</strong> with a duration of{" "}
            <strong>{data.courseDuration || "—"}</strong> and is hereby awarded the grade{" "}
            <strong>{data.marksOrGrade || "—"}</strong>.{" "}
            {data.dateOfBirth && data.dateOfBirth.trim() !== "" ? (
              <>
                Date of birth recorded as <strong>{data.dateOfBirth}</strong>.
              </>
            ) : null}
          </p>

          <div className="cert-details">
            {details.map((d) => (
              <div className="cert-detail" key={d.label}>
                <span className="cert-detail-label">{d.label}</span>
                <span className="cert-detail-value">{d.value}</span>
              </div>
            ))}
          </div>

          <footer className="cert-footer">
            <div className="cert-sign">
              <div className="cert-sign-mark" aria-hidden="true">
                {data.authorizedSignatory ? "✶" : ""}
              </div>
              <div className="cert-sign-line" />
              <div className="cert-sign-name">{data.authorizedSignatory || "—"}</div>
              <div className="cert-sign-role">Authorized Signatory</div>
            </div>

            <div className="cert-seal" aria-hidden="true">
              <svg viewBox="0 0 130 130" className="cert-seal-svg">
                <defs>
                  <path
                    id="seal-arc"
                    d="M65,65 m-50,0 a50,50 0 1,1 100,0 a50,50 0 1,1 -100,0"
                  />
                </defs>
                <circle cx="65" cy="65" r="62" className="cert-seal-outer" />
                <circle cx="65" cy="65" r="52" className="cert-seal-inner" />
                <text className="cert-seal-text">
                  <textPath href="#seal-arc" startOffset="2%">
                    RAMA COACHING CENTER · ESTD. 2009 ·
                  </textPath>
                </text>
                <text x="65" y="60" className="cert-seal-monogram">
                  RC
                </text>
                <text x="65" y="82" className="cert-seal-star">
                  ★
                </text>
              </svg>
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
}
