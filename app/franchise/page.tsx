"use client";

import Link from "next/link";
import { Building2, Award, Users, TrendingUp, Check, Phone, Mail, MapPin, ArrowRight } from "lucide-react";
import SiteNav from "@/components/site/SiteNav";
import SiteFooter from "@/components/site/SiteFooter";

export default function FranchisePage() {
  return (
    <div className="min-h-screen bg-white">
      <SiteNav />

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-red-700 to-red-600 py-16">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Franchise Opportunity</h1>
          <p className="text-xl text-red-100 mb-6">Join Our Growing Network of Computer Education Centers</p>
          <div className="flex flex-wrap justify-center gap-4">
            <div className="bg-white/20 backdrop-blur-sm px-6 py-3 rounded-lg">
              <div className="text-2xl font-bold text-white">55+</div>
              <div className="text-sm text-red-100">Active Centers</div>
            </div>
            <div className="bg-white/20 backdrop-blur-sm px-6 py-3 rounded-lg">
              <div className="text-2xl font-bold text-white">50+</div>
              <div className="text-sm text-red-100">Districts Covered</div>
            </div>
            <div className="bg-white/20 backdrop-blur-sm px-6 py-3 rounded-lg">
              <div className="text-2xl font-bold text-white">100%</div>
              <div className="text-sm text-red-100">Success Rate</div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Partner With Us */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">Why Partner With Rama Coaching Center?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-red-50 p-6 rounded-xl border-l-4 border-red-600">
              <Building2 className="w-12 h-12 text-red-600 mb-4" />
              <h3 className="font-bold text-gray-800 mb-2">Established Brand</h3>
              <p className="text-sm text-gray-600">10+ years of trusted brand recognition in computer education</p>
            </div>
            <div className="bg-blue-50 p-6 rounded-xl border-l-4 border-blue-600">
              <Award className="w-12 h-12 text-blue-600 mb-4" />
              <h3 className="font-bold text-gray-800 mb-2">Proven Model</h3>
              <p className="text-sm text-gray-600">Tested business model with high success rate across UP</p>
            </div>
            <div className="bg-green-50 p-6 rounded-xl border-l-4 border-green-600">
              <Users className="w-12 h-12 text-green-600 mb-4" />
              <h3 className="font-bold text-gray-800 mb-2">Full Support</h3>
              <p className="text-sm text-gray-600">Complete training, marketing, and operational support</p>
            </div>
            <div className="bg-yellow-50 p-6 rounded-xl border-l-4 border-yellow-600">
              <TrendingUp className="w-12 h-12 text-yellow-600 mb-4" />
              <h3 className="font-bold text-gray-800 mb-2">High Returns</h3>
              <p className="text-sm text-gray-600">Lucrative business opportunity with excellent ROI potential</p>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-800 mb-6">Franchise Benefits</h2>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-green-600 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-bold text-gray-800">Brand Recognition</h4>
                    <p className="text-sm text-gray-600">Leverage our established brand name and reputation</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-green-600 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-bold text-gray-800">Complete Training</h4>
                    <p className="text-sm text-gray-600">Comprehensive training for center management and faculty</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-green-600 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-bold text-gray-800">Marketing Support</h4>
                    <p className="text-sm text-gray-600">Marketing materials, advertising strategies, and promotional support</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-green-600 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-bold text-gray-800">Curriculum & Study Material</h4>
                    <p className="text-sm text-gray-600">Access to updated curriculum and comprehensive study materials</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-green-600 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-bold text-gray-800">Technical Support</h4>
                    <p className="text-sm text-gray-600">Ongoing technical support and software assistance</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-green-600 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-bold text-gray-800">Student Management System</h4>
                    <p className="text-sm text-gray-600">Access to our proprietary student management and verification system</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-red-600 to-red-700 p-8 rounded-2xl text-white">
              <h3 className="text-2xl font-bold mb-6">Investment Details</h3>
              <div className="space-y-4">
                <div className="bg-white/10 p-4 rounded-lg">
                  <div className="text-sm text-red-100">Franchise Fee</div>
                  <div className="text-2xl font-bold">₹50,000 - ₹1,00,000</div>
                </div>
                <div className="bg-white/10 p-4 rounded-lg">
                  <div className="text-sm text-red-100">Infrastructure Investment</div>
                  <div className="text-2xl font-bold">₹2,00,000 - ₹5,00,000</div>
                </div>
                <div className="bg-white/10 p-4 rounded-lg">
                  <div className="text-sm text-red-100">Expected ROI</div>
                  <div className="text-2xl font-bold">40% - 60% annually</div>
                </div>
                <div className="bg-white/10 p-4 rounded-lg">
                  <div className="text-sm text-red-100">Break-even Period</div>
                  <div className="text-2xl font-bold">6 - 12 months</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Requirements */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">Franchise Requirements</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-4">
                <Building2 className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="font-bold text-gray-800 mb-2">Space Requirement</h3>
              <p className="text-sm text-gray-600">Minimum 500 sq. ft. commercial space in prime location</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="font-bold text-gray-800 mb-2">Staff Requirements</h3>
              <p className="text-sm text-gray-600">Minimum 2-3 qualified instructors and 1 administrative staff</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <Award className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="font-bold text-gray-800 mb-2">Infrastructure</h3>
              <p className="text-sm text-gray-600">15-20 computers, internet connection, basic furniture</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mb-4">
                <TrendingUp className="w-6 h-6 text-yellow-600" />
              </div>
              <h3 className="font-bold text-gray-800 mb-2">Investment Capacity</h3>
              <p className="text-sm text-gray-600">Minimum investment of ₹3-5 lakhs including franchise fee</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <Phone className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="font-bold text-gray-800 mb-2">Business Experience</h3>
              <p className="text-sm text-gray-600">Prior business or educational experience preferred</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
              <div className="w-12 h-12 bg-pink-100 rounded-lg flex items-center justify-center mb-4">
                <Award className="w-6 h-6 text-pink-600" />
              </div>
              <h3 className="font-bold text-gray-800 mb-2">Commitment</h3>
              <p className="text-sm text-gray-600">Full-time commitment to run and manage the center</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-red-700 to-red-600">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to Start Your Own Computer Education Center?</h2>
          <p className="text-xl text-red-100 mb-8">Join our successful franchise network and become part of the computer education revolution</p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/contact" className="px-8 py-3 bg-white text-red-600 rounded-lg font-bold hover:bg-gray-100 transition-colors">
              Apply Now
            </Link>
            <Link href="tel:08299121689" className="px-8 py-3 bg-yellow-500 text-gray-900 rounded-lg font-bold hover:bg-yellow-600 transition-colors">
              Call: 08299121689
            </Link>
          </div>
        </div>
      </section>

      {/* Contact Information */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">Contact Us for Franchise Inquiry</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-xl shadow-md text-center">
              <Phone className="w-12 h-12 text-red-600 mx-auto mb-4" />
              <h3 className="font-bold text-gray-800 mb-2">Phone</h3>
              <Link href="tel:08299121689" className="text-red-600 hover:text-red-700 transition-colors">08299121689</Link>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-md text-center">
              <Mail className="w-12 h-12 text-blue-600 mx-auto mb-4" />
              <h3 className="font-bold text-gray-800 mb-2">Email</h3>
              <Link href="mailto:franchise@ramacoaching.com" className="text-red-600 hover:text-red-700 transition-colors">franchise@ramacoaching.com</Link>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-md text-center">
              <MapPin className="w-12 h-12 text-green-600 mx-auto mb-4" />
              <h3 className="font-bold text-gray-800 mb-2">Address</h3>
              <p className="text-gray-600">Fatehpur, Uttar Pradesh 212601</p>
            </div>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
