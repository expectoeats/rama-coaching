export type CertificateData = {
  instituteName: string;
  studentName: string;
  parentName: string;
  dateOfBirth: string;
  enrollmentNumber: string;
  courseName: string;
  courseDuration: string;
  completionDate: string;
  certificateNumber: string;
  marksOrGrade: string;
  issueDate: string;
  authorizedSignatory: string;
};

export type CertificateErrors = Partial<Record<keyof CertificateData, string>>;
