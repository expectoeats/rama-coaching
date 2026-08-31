"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Check, GraduationCap, Trophy, Users, Building2, FileText, HeadphonesIcon, Award, CreditCard, ArrowRight, BookOpen } from "lucide-react";
import SiteNav from "@/components/site/SiteNav";
import SiteFooter from "@/components/site/SiteFooter";

export default function HomePage() {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % 1);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <SiteNav />

      {/* Hero Slider Section */}
      <section className="relative w-full overflow-hidden">
        <div className="w-full h-64 md:h-96 bg-gradient-to-br from-red-600 to-red-700 flex items-center justify-center text-white">
          <GraduationCap className="w-24 h-24" />
        </div>
      </section>

      {/* Be Part of Us Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="w-full md:w-1/2">
              <div className="w-full h-64 md:h-80 rounded-lg shadow-lg bg-gradient-to-br from-red-600 to-red-700 flex items-center justify-center text-white">
                <Users className="w-20 h-20" />
              </div>
            </div>
            <div className="w-full md:w-1/2">
              <h2 className="text-4xl font-bold mb-4">
                <span className="text-red-700">Be Part</span> <span className="text-gray-800">of Us</span>
              </h2>
              <p className="text-gray-600 text-lg mb-6">
                Join our mission to provide quality computer education to students across Uttar Pradesh. 
                We are committed to shaping the future of our students with practical skills and industry-relevant knowledge.
              </p>
              <Link href="/contact" className="inline-flex items-center bg-red-700 hover:bg-red-800 text-white px-8 py-3 rounded-lg font-bold transition-colors">
                Join Our Community <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 4-Color Quick Action Cards */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-0">
            <div className="bg-emerald-600 p-8 text-white text-center hover:bg-emerald-700 transition-colors">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-white/20 flex items-center justify-center">
                <FileText className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold">Apply Online</h3>
              <p className="text-sm mt-2 opacity-90">Easy admission process</p>
            </div>
            <div className="bg-blue-600 p-8 text-white text-center hover:bg-blue-700 transition-colors">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-white/20 flex items-center justify-center">
                <HeadphonesIcon className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold">Superfast Support</h3>
              <p className="text-sm mt-2 opacity-90">24/7 assistance available</p>
            </div>
            <div className="bg-amber-500 p-8 text-white text-center hover:bg-amber-600 transition-colors">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-white/20 flex items-center justify-center">
                <Award className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold">Certification</h3>
              <p className="text-sm mt-2 opacity-90">Government recognized</p>
            </div>
            <div className="bg-red-600 p-8 text-white text-center hover:bg-red-700 transition-colors">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-white/20 flex items-center justify-center">
                <CreditCard className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold">Online Payment</h3>
              <p className="text-sm mt-2 opacity-90">Secure transactions</p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-12">
            <div className="w-full lg:w-1/2">
              <h2 className="text-3xl font-bold mb-8 text-center">Why Choose Us?</h2>
              <div className="grid grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                  <GraduationCap className="w-12 h-12 mb-4 text-red-600" />
                  <h3 className="font-bold text-gray-800">Futuristic Curriculum</h3>
                  <p className="text-sm text-gray-600 mt-2">Industry-aligned courses</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                  <FileText className="w-12 h-12 mb-4 text-blue-600" />
                  <h3 className="font-bold text-gray-800">Cutting Edge Course</h3>
                  <p className="text-sm text-gray-600 mt-2">Latest technologies</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                  <Trophy className="w-12 h-12 mb-4 text-green-600" />
                  <h3 className="font-bold text-gray-800">Tech Revolution</h3>
                  <p className="text-sm text-gray-600 mt-2">Digital transformation</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                  <Users className="w-12 h-12 mb-4 text-purple-600" />
                  <h3 className="font-bold text-gray-800">Empowering Minds</h3>
                  <p className="text-sm text-gray-600 mt-2">Skill development</p>
                </div>
              </div>
            </div>
            <div className="w-full lg:w-1/2">
              <div className="w-full h-64 md:h-80 rounded-lg shadow-lg bg-gradient-to-br from-red-600 to-red-700 flex items-center justify-center text-white">
                <Award className="w-20 h-20" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Course Catalogue Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8 text-center">Pick a Course to Get Started</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Course 1 */}
            <div className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
              <div className="w-full h-48 bg-gradient-to-br from-red-600 to-red-700 flex items-center justify-center text-white">
                <BookOpen className="w-16 h-16" />
              </div>
              <div className="p-6">
                <span className="bg-red-100 text-red-700 text-xs px-3 py-1 rounded-full">Popular</span>
                <h3 className="text-xl font-bold mt-3 mb-2">RSCIT / Basic Computer Course</h3>
                <p className="text-gray-600 text-sm mb-4">Learn fundamental computer skills and operations</p>
                <Link href="/courses" className="block bg-red-700 hover:bg-red-800 text-white text-center py-2 rounded-lg font-bold transition-colors">
                  Enroll Now <ArrowRight className="w-4 h-4 inline ml-1" />
                </Link>
              </div>
            </div>

            {/* Course 2 */}
            <div className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
              <div className="w-full h-48 bg-gradient-to-br from-red-600 to-red-700 flex items-center justify-center text-white">
                <CreditCard className="w-16 h-16" />
              </div>
              <div className="p-6">
                <span className="bg-blue-100 text-blue-700 text-xs px-3 py-1 rounded-full">Accounting</span>
                <h3 className="text-xl font-bold mt-3 mb-2">Tally Prime Course</h3>
                <p className="text-gray-600 text-sm mb-4">Master accounting software for business</p>
                <Link href="/courses" className="block bg-red-700 hover:bg-red-800 text-white text-center py-2 rounded-lg font-bold transition-colors">
                  Enroll Now <ArrowRight className="w-4 h-4 inline ml-1" />
                </Link>
              </div>
            </div>

            {/* Course 3 */}
            <div className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
              <div className="w-full h-48 bg-gradient-to-br from-red-600 to-red-700 flex items-center justify-center text-white">
                <Trophy className="w-16 h-16" />
              </div>
              <div className="p-6">
                <span className="bg-green-100 text-green-700 text-xs px-3 py-1 rounded-full">Marketing</span>
                <h3 className="text-xl font-bold mt-3 mb-2">Digital Marketing Course</h3>
                <p className="text-gray-600 text-sm mb-4">Learn online marketing strategies</p>
                <Link href="/courses" className="block bg-red-700 hover:bg-red-800 text-white text-center py-2 rounded-lg font-bold transition-colors">
                  Enroll Now <ArrowRight className="w-4 h-4 inline ml-1" />
                </Link>
              </div>
            </div>

            {/* Course 4 */}
            <div className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
              <div className="w-full h-48 bg-gradient-to-br from-red-600 to-red-700 flex items-center justify-center text-white">
                <Award className="w-16 h-16" />
              </div>
              <div className="p-6">
                <span className="bg-yellow-100 text-yellow-700 text-xs px-3 py-1 rounded-full">Finance</span>
                <h3 className="text-xl font-bold mt-3 mb-2">RSCFA Financial Accounting</h3>
                <p className="text-gray-600 text-sm mb-4">Advanced financial accounting skills</p>
                <Link href="/courses" className="block bg-red-700 hover:bg-red-800 text-white text-center py-2 rounded-lg font-bold transition-colors">
                  Enroll Now <ArrowRight className="w-4 h-4 inline ml-1" />
                </Link>
              </div>
            </div>

            {/* Course 5 */}
            <div className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
              <div className="w-full h-48 bg-gradient-to-br from-red-600 to-red-700 flex items-center justify-center text-white">
                <GraduationCap className="w-16 h-16" />
              </div>
              <div className="p-6">
                <span className="bg-purple-100 text-purple-700 text-xs px-3 py-1 rounded-full">Diploma</span>
                <h3 className="text-xl font-bold mt-3 mb-2">ADCA / DCA Diploma</h3>
                <p className="text-gray-600 text-sm mb-4">Comprehensive computer applications diploma</p>
                <Link href="/courses" className="block bg-red-700 hover:bg-red-800 text-white text-center py-2 rounded-lg font-bold transition-colors">
                  Enroll Now <ArrowRight className="w-4 h-4 inline ml-1" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Franchise Red Banner */}
      <section className="bg-red-700 py-12">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Our Center focus on Institute Management / Student Verification / No.1 Computer Education
          </h2>
          <Link href="/franchise" className="inline-flex items-center bg-yellow-500 hover:bg-yellow-600 text-gray-900 px-8 py-3 rounded-lg font-bold text-lg transition-colors mt-4">
            APPLY NOW <ArrowRight className="w-5 h-5 ml-2" />
          </Link>
        </div>
      </section>

      {/* Our Achievers Photo Gallery */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8 text-center">Our Achievers</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <div key={item} className="text-center">
                <div className="w-24 h-24 rounded-full mx-auto mb-3 border-4 border-red-700 bg-gradient-to-br from-red-600 to-red-700 flex items-center justify-center text-white">
                  <GraduationCap className="w-10 h-10" />
                </div>
                <p className="font-bold text-gray-800">Student {item}</p>
                <p className="text-sm text-gray-600">Course Graduate</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Counselling & Admission Guidance */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="w-full md:w-1/2">
              <div className="w-full h-64 md:h-80 rounded-lg shadow-lg bg-gradient-to-br from-red-600 to-red-700 flex items-center justify-center text-white">
                <Users className="w-20 h-20" />
              </div>
            </div>
            <div className="w-full md:w-1/2">
              <h2 className="text-3xl font-bold mb-4">Free Institute Admission Counselling</h2>
              <p className="text-xl text-red-700 font-bold mb-6">Expert Guidance</p>
              <ul className="space-y-3 mb-6">
                <li className="flex items-center text-gray-700">
                  <Check className="text-green-600 w-5 h-5 mr-2" /> Career guidance and counseling
                </li>
                <li className="flex items-center text-gray-700">
                  <Check className="text-green-600 w-5 h-5 mr-2" /> Course selection assistance
                </li>
                <li className="flex items-center text-gray-700">
                  <Check className="text-green-600 w-5 h-5 mr-2" /> Admission process support
                </li>
                <li className="flex items-center text-gray-700">
                  <Check className="text-green-600 w-5 h-5 mr-2" /> Scholarship information
                </li>
              </ul>
              <Link href="/contact" className="inline-flex items-center bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg font-bold transition-colors">
                Get Free Counselling <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8 text-center">What Our Students Say</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((item) => (
              <div key={item} className="bg-white p-6 rounded-lg shadow-lg border-l-4 border-green-600">
                <div className="flex items-center mb-4">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-red-600 to-red-700 flex items-center justify-center text-white mr-4">
                    <Trophy className="w-7 h-7" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-800">Student {item}</h4>
                    <p className="text-sm text-gray-600">Course Graduate</p>
                  </div>
                </div>
                <p className="text-gray-700 italic">
                  "Excellent teaching methodology and practical approach. The faculty is very supportive and the curriculum is industry-relevant."
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-10 border-y-4 border-yellow-500 bg-gradient-to-r from-red-700 via-red-600 to-red-700">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="w-14 h-14 rounded-full bg-white/10 flex items-center justify-center border border-white/20 mb-3 mx-auto">
                <Users className="w-7 h-7 text-yellow-300" />
              </div>
              <div className="font-extrabold text-4xl text-yellow-300 drop-shadow-md mb-2">4987+</div>
              <div className="text-white font-bold text-sm tracking-wider uppercase">Students</div>
            </div>
            <div>
              <div className="w-14 h-14 rounded-full bg-white/10 flex items-center justify-center border border-white/20 mb-3 mx-auto">
                <Building2 className="w-7 h-7 text-yellow-300" />
              </div>
              <div className="font-extrabold text-4xl text-yellow-300 drop-shadow-md mb-2">55+</div>
              <div className="text-white font-bold text-sm tracking-wider uppercase">Centers</div>
            </div>
            <div>
              <div className="w-14 h-14 rounded-full bg-white/10 flex items-center justify-center border border-white/20 mb-3 mx-auto">
                <FileText className="w-7 h-7 text-yellow-300" />
              </div>
              <div className="font-extrabold text-4xl text-yellow-300 drop-shadow-md mb-2">345+</div>
              <div className="text-white font-bold text-sm tracking-wider uppercase">Courses</div>
            </div>
            <div>
              <div className="w-14 h-14 rounded-full bg-white/10 flex items-center justify-center border border-white/20 mb-3 mx-auto">
                <Trophy className="w-7 h-7 text-yellow-300" />
              </div>
              <div className="font-extrabold text-4xl text-yellow-300 drop-shadow-md mb-2">10+</div>
              <div className="text-white font-bold text-sm tracking-wider uppercase">Years</div>
            </div>
          </div>
        </div>
      </section>

      {/* Franchise Promotion Cards */}
      <section className="py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto px-4 py-10">
          {/* Card Wrapper with light shadow & crisp border */}
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow">
            <div className="w-full bg-slate-50 flex items-center justify-center p-2">
              <div className="w-full h-48 bg-gradient-to-br from-red-600 to-red-700 flex items-center justify-center text-white">
                <Building2 className="w-16 h-16" />
              </div>
            </div>
            <div className="p-6 text-center">
              <h3 className="text-xl font-bold text-gray-900 mb-2">Join Our Franchise Network</h3>
              <p className="text-sm text-gray-600 mb-4">Become part of our growing network of computer education.</p>
              <Link href="/franchise" className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold text-sm rounded transition-colors">Apply Now</Link>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow">
            <div className="w-full bg-slate-50 flex items-center justify-center p-2">
              <div className="w-full h-48 bg-gradient-to-br from-red-600 to-red-700 flex items-center justify-center text-white">
                <Award className="w-16 h-16" />
              </div>
            </div>
            <div className="p-6 text-center">
              <h3 className="text-xl font-bold text-gray-900 mb-2">Student Verification System</h3>
              <p className="text-sm text-gray-600 mb-4">Easy and secure certificate verification for employers.</p>
              <Link href="/verification" className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold text-sm rounded transition-colors">Verify Now</Link>
            </div>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
