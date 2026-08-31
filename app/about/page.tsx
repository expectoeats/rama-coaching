"use client";

import Link from "next/link";
import { GraduationCap, Award, Users, Building2, Target, BookOpen, FileText, Check } from "lucide-react";
import SiteNav from "@/components/site/SiteNav";
import SiteFooter from "@/components/site/SiteFooter";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      <SiteNav />

      {/* Hero Section */}
      <section className="relative py-16 bg-cover bg-center" style={{ backgroundImage: "url('https://lakshaygroupedu.co.in/assets/images/bg3.jpg')" }}>
        <div className="absolute inset-0 bg-red-700/40" />
        <div className="relative max-w-7xl mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">About Rama Coaching Center</h1>
          <p className="text-xl text-red-100">Empowering Students with Quality Computer Education Since 2016</p>
        </div>
      </section>

      {/* About Content */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-800 mb-6">Our Mission</h2>
              <p className="text-gray-600 mb-4 leading-relaxed">
                Rama Coaching Center And Computer Education Center is committed to providing quality computer education to students in Fatehpur, Uttar Pradesh and surrounding areas. Our mission is to bridge the digital divide by making computer education accessible and affordable for everyone.
              </p>
              <p className="text-gray-600 mb-6 leading-relaxed">
                We believe that every student deserves the opportunity to develop essential computer skills that are crucial in today's digital world. Our courses are designed to be practical, industry-relevant, and taught by experienced instructors who are passionate about education.
              </p>

              <div className="grid grid-cols-2 gap-4 mt-8">
                <div className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-green-600 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-bold text-gray-800">Quality Education</h4>
                    <p className="text-sm text-gray-600">Industry-aligned curriculum</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-green-600 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-bold text-gray-800">Expert Faculty</h4>
                    <p className="text-sm text-gray-600">Experienced instructors</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-green-600 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-bold text-gray-800">Practical Training</h4>
                    <p className="text-sm text-gray-600">Hands-on learning approach</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-green-600 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-bold text-gray-800">Certification</h4>
                    <p className="text-sm text-gray-600">Recognized certificates</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-red-50 to-red-100 p-8 rounded-2xl">
              <div className="grid grid-cols-2 gap-6">
                <div className="text-center p-6 bg-white rounded-xl shadow-md">
                  <GraduationCap className="w-12 h-12 text-red-600 mx-auto mb-3" />
                  <div className="text-3xl font-bold text-gray-800">4987+</div>
                  <div className="text-sm text-gray-600">Students Trained</div>
                </div>
                <div className="text-center p-6 bg-white rounded-xl shadow-md">
                  <Building2 className="w-12 h-12 text-blue-600 mx-auto mb-3" />
                  <div className="text-3xl font-bold text-gray-800">55+</div>
                  <div className="text-sm text-gray-600">Centers</div>
                </div>
                <div className="text-center p-6 bg-white rounded-xl shadow-md">
                  <BookOpen className="w-12 h-12 text-green-600 mx-auto mb-3" />
                  <div className="text-3xl font-bold text-gray-800">345+</div>
                  <div className="text-sm text-gray-600">Courses</div>
                </div>
                <div className="text-center p-6 bg-white rounded-xl shadow-md">
                  <Award className="w-12 h-12 text-yellow-600 mx-auto mb-3" />
                  <div className="text-3xl font-bold text-gray-800">10+</div>
                  <div className="text-sm text-gray-600">Years Experience</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Vision & Values */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">Our Vision & Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition-shadow">
              <Target className="w-12 h-12 text-red-600 mb-4" />
              <h3 className="text-xl font-bold text-gray-800 mb-3">Our Vision</h3>
              <p className="text-gray-600">To be the leading computer education provider in Uttar Pradesh, known for excellence in teaching and student success.</p>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition-shadow">
              <Users className="w-12 h-12 text-blue-600 mb-4" />
              <h3 className="text-xl font-bold text-gray-800 mb-3">Student-Centric</h3>
              <p className="text-gray-600">We prioritize student success through personalized attention, mentorship, and career guidance.</p>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition-shadow">
              <Award className="w-12 h-12 text-green-600 mb-4" />
              <h3 className="text-xl font-bold text-gray-800 mb-3">Excellence</h3>
              <p className="text-gray-600">We maintain high standards in curriculum, teaching methodology, and infrastructure to ensure quality education.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">Why Choose Rama Coaching Center?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-red-50 p-6 rounded-xl border-l-4 border-red-600">
              <GraduationCap className="w-10 h-10 text-red-600 mb-3" />
              <h3 className="font-bold text-gray-800 mb-2">Expert Faculty</h3>
              <p className="text-sm text-gray-600">Learn from industry professionals with years of experience</p>
            </div>
            <div className="bg-blue-50 p-6 rounded-xl border-l-4 border-blue-600">
              <BookOpen className="w-10 h-10 text-blue-600 mb-3" />
              <h3 className="font-bold text-gray-800 mb-2">Modern Curriculum</h3>
              <p className="text-sm text-gray-600">Updated course content aligned with current industry trends</p>
            </div>
            <div className="bg-green-50 p-6 rounded-xl border-l-4 border-green-600">
              <FileText className="w-10 h-10 text-green-600 mb-3" />
              <h3 className="font-bold text-gray-800 mb-2">Certification</h3>
              <p className="text-sm text-gray-600">Government recognized certificates for better job prospects</p>
            </div>
            <div className="bg-yellow-50 p-6 rounded-xl border-l-4 border-yellow-600">
              <Target className="w-10 h-10 text-yellow-600 mb-3" />
              <h3 className="font-bold text-gray-800 mb-2">Placement Support</h3>
              <p className="text-sm text-gray-600">Career guidance and job placement assistance</p>
            </div>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
