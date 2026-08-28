import type { CertificateData, CertificateErrors } from "@/types/certificate";

const REQUIRED: (keyof CertificateData)[] = [
  "instituteName",
  "studentName",
  "enrollmentNumber",
  "courseName",
  "courseDuration",
  "completionDate",
  "certificateNumber",
  "issueDate",
  "authorizedSignatory",
];

export function validateCertificate(data: CertificateData): CertificateErrors {
  const errors: CertificateErrors = {};

  for (const field of REQUIRED) {
    if (!data[field] || data[field].trim() === "") {
      errors[field] = "This field is required.";
    }
  }

  if (data.studentName && data.studentName.trim().length < 2) {
    errors.studentName = "Please enter the full student name.";
  }

  if (data.enrollmentNumber && !/^[A-Za-z0-9-]+$/.test(data.enrollmentNumber.trim())) {
    errors.enrollmentNumber = "Use letters, numbers and hyphens only.";
  }

  return errors;
}

export function hasErrors(errors: CertificateErrors): boolean {
  return Object.keys(errors).length > 0;
}
