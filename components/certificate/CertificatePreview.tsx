import { useRef } from "react";
import { Printer, FileDown } from "lucide-react";
import type { CertificateData } from "@/types/certificate";
import { CertificateDocument } from "./CertificateDocument";
import { useFitScale } from "@/lib/useFitScale";

export function CertificatePreview({ data }: { data: CertificateData | null }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const scale = useFitScale(containerRef);

  return (
    <section className="preview" aria-label="Certificate preview">
      <div className="preview-toolbar no-print">
        <div className="preview-toolbar-title">
          <span className="preview-toolbar-eyebrow">Live Preview</span>
          <span className="preview-toolbar-heading">Certificate</span>
        </div>
        <button
          type="button"
          className="btn-print"
          onClick={() => window.print()}
          disabled={!data}
        >
          <Printer size={16} />
          Print / Save as PDF
        </button>
      </div>

      <div className="preview-stage" ref={containerRef}>
        {data ? (
          <div
            className="cert-scale-wrap"
            style={
              {
                ["--cert-scale" as string]: scale,
                width: `calc(794px * var(--cert-scale))`,
                height: `calc(1123px * var(--cert-scale))`,
              } as React.CSSProperties
            }
          >
            <CertificateDocument data={data} />
          </div>
        ) : (
          <div className="preview-empty">
            <FileDown size={28} strokeWidth={1.4} />
            <p className="preview-empty-title">No certificate generated yet</p>
            <p className="preview-empty-text">
              Fill in the student and course details on the left, then click
              <strong> Generate Certificate</strong> to see the result here.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
