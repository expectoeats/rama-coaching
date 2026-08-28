import { useState } from "react";
import { FileCheck2 } from "lucide-react";
import type { CertificateData, CertificateErrors } from "@/types/certificate";
import { SAMPLE_CERTIFICATE } from "@/lib/defaults";
import { validateCertificate, hasErrors } from "@/lib/validation";
import { TextField } from "./TextField";

type FormSection = {
  title: string;
  note?: string;
  fields: {
    name: keyof CertificateData;
    label: string;
    placeholder: string;
    required?: boolean;
    full?: boolean;
  }[];
};

const SECTIONS: FormSection[] = [
  {
    title: "Student Information",
    fields: [
      { name: "studentName", label: "Student Name", placeholder: "Rahul Kumar", required: true },
      { name: "parentName", label: "Father / Mother Name", placeholder: "Rajesh Kumar" },
      { name: "dateOfBirth", label: "Date of Birth", placeholder: "12 March 2008" },
      {
        name: "enrollmentNumber",
        label: "Enrollment Number",
        placeholder: "RAMA-2026-001",
        required: true,
      },
    ],
  },
  {
    title: "Course Information",
    fields: [
      {
        name: "courseName",
        label: "Course Name",
        placeholder: "ADCA — Advanced Diploma in Computer Applications",
        required: true,
        full: true,
      },
      { name: "courseDuration", label: "Duration", placeholder: "12 Months", required: true },
      {
        name: "completionDate",
        label: "Completion Date",
        placeholder: "28 August 2026",
        required: true,
      },
      { name: "marksOrGrade", label: "Marks / Grade", placeholder: "A+" },
    ],
  },
  {
    title: "Certificate Information",
    fields: [
      {
        name: "certificateNumber",
        label: "Certificate Number",
        placeholder: "RCC-ADCA-2026-001",
        required: true,
      },
      { name: "issueDate", label: "Issue Date", placeholder: "28 August 2026", required: true },
      {
        name: "authorizedSignatory",
        label: "Authorized Signatory",
        placeholder: "Director, Rama Coaching Center",
        required: true,
        full: true,
      },
    ],
  },
];

export function CertificateForm({
  onGenerate,
}: {
  onGenerate: (data: CertificateData) => void;
}) {
  const [data, setData] = useState<CertificateData>(SAMPLE_CERTIFICATE);
  const [errors, setErrors] = useState<CertificateErrors>({});
  const [attempted, setAttempted] = useState(false);

  function handleChange(name: keyof CertificateData, value: string) {
    setData((prev) => ({ ...prev, [name]: value }));
    if (attempted) {
      setErrors(validateCertificate({ ...data, [name]: value }));
    }
  }

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setAttempted(true);
    const found = validateCertificate(data);
    setErrors(found);
    if (!hasErrors(found)) {
      onGenerate(data);
    }
  }

  function handleReset() {
    setData(SAMPLE_CERTIFICATE);
    setErrors({});
    setAttempted(false);
  }

  return (
    <form className="form no-print" onSubmit={handleSubmit} noValidate>
      <div className="form-head">
        <h2 className="form-title">Student &amp; Course Details</h2>
        <p className="form-sub">
          Enter the information exactly as it should appear on the certificate.
        </p>
      </div>

      {attempted && hasErrors(errors) ? (
        <div className="form-alert" role="alert">
          Please correct the {Object.keys(errors).length} highlighted{" "}
          {Object.keys(errors).length === 1 ? "field" : "fields"} below.
        </div>
      ) : null}

      {SECTIONS.map((section) => (
        <fieldset className="form-section" key={section.title}>
          <legend className="form-section-title">{section.title}</legend>
          <div className="form-grid">
            {section.fields.map((field) => (
              <TextField
                key={field.name}
                name={field.name}
                label={field.label}
                placeholder={field.placeholder}
                required={field.required}
                value={data[field.name]}
                error={errors[field.name]}
                autoComplete="off"
                full={field.full}
                onChange={(e) => handleChange(field.name, e.target.value)}
              />
            ))}
          </div>
        </fieldset>
      ))}

      <div className="form-actions">
        <button type="submit" className="btn-generate">
          <FileCheck2 size={18} />
          Generate Certificate
        </button>
        <button type="button" className="btn-secondary" onClick={handleReset}>
          Reset to sample
        </button>
      </div>
    </form>
  );
}
