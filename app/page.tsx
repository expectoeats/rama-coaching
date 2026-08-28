"use client";

import { useState } from "react";
import type { CertificateData } from "@/types/certificate";
import { CertificateForm } from "@/components/forms/CertificateForm";
import { CertificatePreview } from "@/components/certificate/CertificatePreview";

export default function Page() {
  const [certificate, setCertificate] = useState<CertificateData | null>(null);

  return (
    <div className="app">
      <header className="app-header no-print">
        <div className="app-header-inner">
          <div className="brand">
            <span className="brand-mark" aria-hidden="true">
              RC
            </span>
            <span className="brand-text">
              <span className="brand-name">Rama Coaching Center</span>
              <span className="brand-tag">Certificate Generator</span>
            </span>
          </div>
          <span className="app-header-note">Admin · Issue Completion Certificates</span>
        </div>
      </header>

      <main className="app-main">
        <div className="app-layout">
          <div className="app-form-col">
            <CertificateForm onGenerate={setCertificate} />
          </div>
          <div className="app-preview-col">
            <CertificatePreview data={certificate} />
          </div>
        </div>
      </main>

      <footer className="app-footer no-print">
        <span>
          Rama Coaching Center — Certificate Generator POC. Sample data is editable.
        </span>
      </footer>
    </div>
  );
}
