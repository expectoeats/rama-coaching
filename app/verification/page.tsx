"use client";

import { useState } from "react";
import Link from "next/link";
import { Shield, Search, Check, X, FileText, Award, Calendar, User } from "lucide-react";
import SiteNav from "@/components/site/SiteNav";
import SiteFooter from "@/components/site/SiteFooter";

export default function VerificationPage() {
  const [certificateNumber, setCertificateNumber] = useState("");
  const [rollNumber, setRollNumber] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSearching(true);

    // Simulate search - in real app, this would be an API call
    setTimeout(() => {
      if (certificateNumber || rollNumber) {
        setResult({
          found: true,
          studentName: "Rahul Kumar",
          course: "RSCIT / Basic Computer Course",
          certificateNumber: certificateNumber || "RCC/2026/1234",
          rollNumber: rollNumber || "RCC/2026/001",
          issueDate: "15th August 2026",
          validity: "Lifetime",
          grade: "A+",
          center: "Rama Coaching Center, Fatehpur"
        });
      } else {
        setResult({
          found: false,
          message: "Please enter a certificate number or roll number"
        });
      }
      setIsSearching(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-white">
      <SiteNav />

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-red-700 to-red-600 py-16">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
              <Shield className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Certificate Verification</h1>
          <p className="text-xl text-red-100 mb-6">Verify Student Certificates Instantly Online</p>
          <div className="flex flex-wrap justify-center gap-4">
            <div className="bg-white/20 backdrop-blur-sm px-6 py-3 rounded-lg">
              <div className="text-2xl font-bold text-white">100%</div>
              <div className="text-sm text-red-100">Authentic</div>
            </div>
            <div className="bg-white/20 backdrop-blur-sm px-6 py-3 rounded-lg">
              <div className="text-2xl font-bold text-white">24/7</div>
              <div className="text-sm text-red-100">Available</div>
            </div>
            <div className="bg-white/20 backdrop-blur-sm px-6 py-3 rounded-lg">
              <div className="text-2xl font-bold text-white">Instant</div>
              <div className="text-sm text-red-100">Results</div>
            </div>
          </div>
        </div>
      </section>

      {/* Search Section */}
      <section className="py-16">
        <div className="max-w-3xl mx-auto px-6">
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Search Certificate</h2>
            <form onSubmit={handleSearch} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Certificate Number</label>
                <input
                  type="text"
                  value={certificateNumber}
                  onChange={(e) => setCertificateNumber(e.target.value)}
                  placeholder="Enter certificate number (e.g., RCC/2026/1234)"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
              </div>

              <div className="text-center text-gray-500">OR</div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Roll Number</label>
                <input
                  type="text"
                  value={rollNumber}
                  onChange={(e) => setRollNumber(e.target.value)}
                  placeholder="Enter roll number (e.g., RCC/2026/001)"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
              </div>

              <button
                type="submit"
                disabled={isSearching}
                className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSearching ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Searching...
                  </>
                ) : (
                  <>
                    <Search className="w-5 h-5" />
                    Verify Certificate
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Results Section */}
      {result && (
        <section className="py-8">
          <div className="max-w-3xl mx-auto px-6">
            {result.found ? (
              <div className="bg-white rounded-2xl shadow-xl p-8 border-2 border-green-500">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <Check className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-green-600">Certificate Verified</h3>
                    <p className="text-sm text-gray-600">This certificate is authentic and valid</p>
                  </div>
                </div>

                <div className="bg-green-50 rounded-xl p-6 mb-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-start gap-3">
                      <User className="w-5 h-5 text-green-600 mt-1 flex-shrink-0" />
                      <div>
                        <div className="text-sm text-gray-600">Student Name</div>
                        <div className="font-bold text-gray-800">{result.studentName}</div>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <FileText className="w-5 h-5 text-green-600 mt-1 flex-shrink-0" />
                      <div>
                        <div className="text-sm text-gray-600">Course</div>
                        <div className="font-bold text-gray-800">{result.course}</div>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Award className="w-5 h-5 text-green-600 mt-1 flex-shrink-0" />
                      <div>
                        <div className="text-sm text-gray-600">Certificate Number</div>
                        <div className="font-bold text-gray-800">{result.certificateNumber}</div>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <FileText className="w-5 h-5 text-green-600 mt-1 flex-shrink-0" />
                      <div>
                        <div className="text-sm text-gray-600">Roll Number</div>
                        <div className="font-bold text-gray-800">{result.rollNumber}</div>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Calendar className="w-5 h-5 text-green-600 mt-1 flex-shrink-0" />
                      <div>
                        <div className="text-sm text-gray-600">Issue Date</div>
                        <div className="font-bold text-gray-800">{result.issueDate}</div>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Shield className="w-5 h-5 text-green-600 mt-1 flex-shrink-0" />
                      <div>
                        <div className="text-sm text-gray-600">Validity</div>
                        <div className="font-bold text-gray-800">{result.validity}</div>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Award className="w-5 h-5 text-green-600 mt-1 flex-shrink-0" />
                      <div>
                        <div className="text-sm text-gray-600">Grade</div>
                        <div className="font-bold text-gray-800">{result.grade}</div>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <FileText className="w-5 h-5 text-green-600 mt-1 flex-shrink-0" />
                      <div>
                        <div className="text-sm text-gray-600">Issuing Center</div>
                        <div className="font-bold text-gray-800">{result.center}</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="text-center">
                  <p className="text-sm text-gray-600 mb-4">This certificate can be verified by contacting our office</p>
                  <Link href="tel:08299121689" className="inline-flex items-center px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors">
                    Contact for Verification: 08299121689
                  </Link>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-2xl shadow-xl p-8 border-2 border-red-500">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                    <X className="w-6 h-6 text-red-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-red-600">Certificate Not Found</h3>
                    <p className="text-sm text-gray-600">{result.message}</p>
                  </div>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-600 mb-4">Please check the certificate number or contact our office for assistance</p>
                  <Link href="tel:08299121689" className="inline-flex items-center px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors">
                    Contact: 08299121689
                  </Link>
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      {/* How It Works */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">How Certificate Verification Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-xl shadow-md text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-red-600" />
              </div>
              <div className="text-2xl font-bold text-gray-800 mb-2">1. Enter Details</div>
              <p className="text-sm text-gray-600">Enter certificate number or roll number in the search field</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-md text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-blue-600" />
              </div>
              <div className="text-2xl font-bold text-gray-800 mb-2">2. Verify</div>
              <p className="text-sm text-gray-600">Our system instantly verifies the certificate authenticity</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-md text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Check className="w-8 h-8 text-green-600" />
              </div>
              <div className="text-2xl font-bold text-gray-800 mb-2">3. Get Results</div>
              <p className="text-sm text-gray-600">View complete certificate details and verification status</p>
            </div>
          </div>
        </div>
      </section>

      {/* Important Notice */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-6">
          <div className="bg-yellow-50 border-l-4 border-yellow-500 p-6 rounded-r-xl">
            <h3 className="text-xl font-bold text-yellow-800 mb-4">Important Notice</h3>
            <ul className="space-y-2 text-sm text-yellow-700">
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 mt-1 flex-shrink-0" />
                <span>All certificates issued by Rama Coaching Center are verifiable through this system</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 mt-1 flex-shrink-0" />
                <span>Employers and institutions can use this system to verify candidate certificates</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 mt-1 flex-shrink-0" />
                <span>For any verification issues, please contact our office directly</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 mt-1 flex-shrink-0" />
                <span>Fake certificates will not be found in our verification system</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
