"use client";

import { useState } from "react";
import Link from "next/link";
import { Phone, Mail, MapPin, Clock, Send, Check, Building2, Users } from "lucide-react";
import SiteNav from "@/components/site/SiteNav";
import SiteFooter from "@/components/site/SiteFooter";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          message: `[${formData.subject}] ${formData.message}`,
        }),
      });
      const j = await res.json();
      if (j.success) {
        setSubmitted(true);
        setFormData({ name: "", email: "", phone: "", subject: "", message: "" });
        setTimeout(() => setSubmitted(false), 5000);
      } else {
        alert(j.error || "Failed to send message");
      }
    } catch {
      alert("Network error. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen bg-white">
      <SiteNav />

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-red-700 to-red-600 py-16">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Contact Us</h1>
          <p className="text-xl text-red-100 mb-6">Get in Touch with Rama Coaching Center</p>
          <div className="flex flex-wrap justify-center gap-4">
            <div className="bg-white/20 backdrop-blur-sm px-6 py-3 rounded-lg">
              <div className="text-2xl font-bold text-white">24/7</div>
              <div className="text-sm text-red-100">Support Available</div>
            </div>
            <div className="bg-white/20 backdrop-blur-sm px-6 py-3 rounded-lg">
              <div className="text-2xl font-bold text-white">Quick</div>
              <div className="text-sm text-red-100">Response Time</div>
            </div>
            <div className="bg-white/20 backdrop-blur-sm px-6 py-3 rounded-lg">
              <div className="text-2xl font-bold text-white">Free</div>
              <div className="text-sm text-red-100">Consultation</div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Information */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 text-center">
              <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Phone className="w-7 h-7 text-red-600" />
              </div>
              <h3 className="font-bold text-gray-800 mb-2">Phone</h3>
              <Link href="tel:08299121689" className="text-red-600 hover:text-red-700 transition-colors">08299121689</Link>
              <p className="text-sm text-gray-500 mt-1">Mon - Sat, 9AM - 6PM</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 text-center">
              <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail className="w-7 h-7 text-blue-600" />
              </div>
              <h3 className="font-bold text-gray-800 mb-2">Email</h3>
              <Link href="mailto:info@ramacoaching.com" className="text-red-600 hover:text-red-700 transition-colors">info@ramacoaching.com</Link>
              <p className="text-sm text-gray-500 mt-1">We reply within 24 hours</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 text-center">
              <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin className="w-7 h-7 text-green-600" />
              </div>
              <h3 className="font-bold text-gray-800 mb-2">Address</h3>
              <p className="text-gray-600 text-sm">UPHC, Andauli Puliya, Ghazipur Rd, Radha Nagar, Harihar Ganj, Fatehpur, UP 212601</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 text-center">
              <div className="w-14 h-14 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="w-7 h-7 text-yellow-600" />
              </div>
              <h3 className="font-bold text-gray-800 mb-2">Working Hours</h3>
              <p className="text-gray-600 text-sm">Mon - Sat: 9:00 AM - 6:00 PM</p>
              <p className="text-sm text-gray-500 mt-1">Sunday: Closed</p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-6">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Send us a Message</h2>

            {submitted && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6 flex items-center gap-3">
                <Check className="w-5 h-5 text-green-600" />
                <p className="text-green-800">Thank you for your message! We'll get back to you soon.</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    placeholder="Enter your full name"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email Address *</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="Enter your email address"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Enter your phone number"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Subject *</label>
                  <select
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  >
                    <option value="">Select a subject</option>
                    <option value="course-inquiry">Course Inquiry</option>
                    <option value="admission">Admission Query</option>
                    <option value="franchise">Franchise Inquiry</option>
                    <option value="certification">Certificate Verification</option>
                    <option value="feedback">Feedback</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Message *</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={5}
                  placeholder="Type your message here..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    Send Message
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">Find Us on Map</h2>
          <div className="bg-gray-200 rounded-2xl overflow-hidden h-96 flex items-center justify-center">
            <div className="text-center">
              <MapPin className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">Interactive Map</p>
              <p className="text-sm text-gray-500">UPHC, Andauli Puliya, Ghazipur Rd, Fatehpur, UP 212601</p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">Frequently Asked Questions</h2>
          <div className="space-y-4">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="font-bold text-gray-800 mb-2">What courses do you offer?</h3>
              <p className="text-sm text-gray-600">We offer RSCIT, Tally Prime, Digital Marketing, RSCFA Accounting, ADCA/DCA Diploma, and Graphic Design courses.</p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="font-bold text-gray-800 mb-2">What is the admission process?</h3>
              <p className="text-sm text-gray-600">Visit our center, fill the admission form, submit required documents, and pay the course fee to get started.</p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="font-bold text-gray-800 mb-2">Do you provide placement assistance?</h3>
              <p className="text-sm text-gray-600">Yes, we provide career guidance and placement support to help students find suitable job opportunities.</p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="font-bold text-gray-800 mb-2">Are your certificates government recognized?</h3>
              <p className="text-sm text-gray-600">Yes, our certificates are government recognized and can be verified through our online verification system.</p>
            </div>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
