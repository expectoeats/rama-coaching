"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { GraduationCap, Award, Clock, Users, BookOpen, Check, ArrowRight, CreditCard, Trophy } from "lucide-react";
import SiteNav from "@/components/site/SiteNav";
import SiteFooter from "@/components/site/SiteFooter";

const courseIcons: Record<number, React.ReactNode> = {
  1: <BookOpen className="w-16 h-16" />,
  2: <CreditCard className="w-16 h-16" />,
  3: <Trophy className="w-16 h-16" />,
  4: <Award className="w-16 h-16" />,
  5: <GraduationCap className="w-16 h-16" />,
  6: <Award className="w-16 h-16" />,
};

const fallbackCourses = [
  {
    id: 1,
    title: "RSCIT / Basic Computer Course",
    duration: "3 Months",
    students: "1200+",
    level: "Beginner",
    price: "₹2,500",
    description: "Learn fundamental computer skills including Windows, MS Office, Internet usage, and basic operations. Perfect for beginners.",
    features: ["Windows Operating System", "Microsoft Office Suite", "Internet & Email", "Basic Computer Hardware", "Government Certificate"]
  },
  {
    id: 2,
    title: "Tally Prime Course",
    duration: "2 Months",
    students: "850+",
    level: "Intermediate",
    price: "₹3,500",
    description: "Master Tally Prime accounting software for business management, inventory, and financial accounting.",
    features: ["Tally Prime Fundamentals", "Accounting Principles", "GST & Taxation", "Inventory Management", "Payroll Management"]
  },
  {
    id: 3,
    title: "Digital Marketing Course",
    duration: "4 Months",
    students: "600+",
    level: "Advanced",
    price: "₹8,000",
    description: "Comprehensive digital marketing training including SEO, social media, Google Ads, and content marketing.",
    features: ["SEO & SEM", "Social Media Marketing", "Google Ads", "Content Marketing", "Analytics & Reporting"]
  },
  {
    id: 4,
    title: "RSCFA Financial Accounting",
    duration: "3 Months",
    students: "450+",
    level: "Intermediate",
    price: "₹4,000",
    description: "Advanced financial accounting skills for professional accounting careers and business management.",
    features: ["Financial Accounting", "Cost Accounting", "Taxation", "Auditing Basics", "Financial Reporting"]
  },
  {
    id: 5,
    title: "ADCA / DCA Diploma",
    duration: "6 Months",
    students: "980+",
    level: "Beginner",
    price: "₹6,000",
    description: "Comprehensive diploma in computer applications covering programming, web development, and software skills.",
    features: ["C Programming", "Web Development", "Database Management", "Software Applications", "Project Work"]
  },
  {
    id: 6,
    title: "Graphic Design Course",
    duration: "3 Months",
    students: "320+",
    level: "Intermediate",
    price: "₹5,000",
    description: "Learn graphic design fundamentals using Photoshop, CorelDRAW, and Illustrator for creative careers.",
    features: ["Adobe Photoshop", "CorelDRAW", "Illustrator Basics", "Design Principles", "Portfolio Development"]
  }
];

export default function CoursesPage() {
  const [courses, setCourses] = useState<any[]>(fallbackCourses);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/courses?limit=50", { cache: "no-store" })
      .then((r) => r.json())
      .then((j) => {
        if (j.success && j.data.length) {
          setCourses(j.data.map((c: any, i: number) => ({
            id: c.id,
            title: c.name,
            duration: c.duration,
            students: "500+",
            level: c.category || "Beginner",
            price: c.fees,
            description: c.description,
            features: ["Government Certificate", "Expert Faculty", "Practical Training", "Placement Support"]
          })));
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <SiteNav />
        <div className="flex items-center justify-center py-20">
          <div className="w-8 h-8 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
        </div>
        <SiteFooter />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <SiteNav />
      <section className="bg-gradient-to-r from-red-700 to-red-600 py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h1 className="text-2xl sm:text-4xl md:text-5xl font-semibold sm:font-bold text-white mb-4">Our Courses</h1>
          <p className="text-base sm:text-xl text-red-100 mb-6">Industry-Relevant Computer Education Programs</p>
          <div className="flex flex-wrap justify-center gap-4">
            <div className="bg-white/20 backdrop-blur-sm px-6 py-3 rounded-lg">
              <div className="text-2xl font-bold text-white">345+</div>
              <div className="text-sm text-red-100">Courses Available</div>
            </div>
            <div className="bg-white/20 backdrop-blur-sm px-6 py-3 rounded-lg">
              <div className="text-2xl font-bold text-white">4987+</div>
              <div className="text-sm text-red-100">Students Enrolled</div>
            </div>
            <div className="bg-white/20 backdrop-blur-sm px-6 py-3 rounded-lg">
              <div className="text-2xl font-bold text-white">95%</div>
              <div className="text-sm text-red-100">Placement Rate</div>
            </div>
          </div>
        </div>
      </section>
      <section className="py-6 sm:py-8 bg-gray-50 border-b">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-wrap gap-2 sm:gap-4 items-center">
            <span className="font-semibold text-gray-700 text-sm sm:text-base">Filter by:</span>
            <button className="px-3 py-1.5 sm:px-4 sm:py-2 bg-red-600 text-white rounded-md text-xs sm:text-sm font-medium">All Courses</button>
            <button className="px-3 py-1.5 sm:px-4 sm:py-2 bg-white text-gray-700 rounded-md text-xs sm:text-sm font-medium hover:bg-red-50 transition-colors">Beginner</button>
            <button className="px-3 py-1.5 sm:px-4 sm:py-2 bg-white text-gray-700 rounded-md text-xs sm:text-sm font-medium hover:bg-red-50 transition-colors">Intermediate</button>
            <button className="px-3 py-1.5 sm:px-4 sm:py-2 bg-white text-gray-700 rounded-md text-xs sm:text-sm font-medium hover:bg-red-50 transition-colors">Advanced</button>
            <button className="px-3 py-1.5 sm:px-4 sm:py-2 bg-white text-gray-700 rounded-md text-xs sm:text-sm font-medium hover:bg-red-50 transition-colors">Diploma</button>
          </div>
        </div>
      </section>
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-8">
            {courses.map((course) => (
              <div key={course.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow border border-gray-100">
                <div className="relative">
                  <div className="w-full h-48 bg-gradient-to-br from-red-600 to-red-700 flex items-center justify-center text-white">
                    {courseIcons[Number(String(course.id).slice(-1)) % 6 + 1] || <BookOpen className="w-16 h-16" />}
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-lg sm:text-xl font-semibold sm:font-bold text-gray-800 mb-2">{course.title}</h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">{course.description}</p>
                  <div className="flex items-center gap-4 mb-4 text-sm text-gray-500">
                    <div className="flex items-center gap-1"><Clock className="w-4 h-4" /><span>{course.duration}</span></div>
                    <div className="flex items-center gap-1"><Users className="w-4 h-4" /><span>{course.students}</span></div>
                  </div>
                  <div className="space-y-2 mb-4">
                    {course.features.slice(0, 3).map((feature: string, index: number) => (
                      <div key={index} className="flex items-center gap-2 text-sm text-gray-600"><Check className="w-4 h-4 text-green-600 flex-shrink-0" /><span className="line-clamp-1">{feature}</span></div>
                    ))}
                  </div>
                  <div className="flex items-center justify-between pt-4 border-t">
                    <div><div className="text-2xl font-bold text-red-600">{course.price}</div><div className="text-xs text-gray-500">Course Fee</div></div>
                    <button className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md text-sm font-medium flex items-center gap-2 transition-colors">Enroll Now <ArrowRight className="w-4 h-4" /></button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">Why Choose Our Courses?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-xl shadow-md text-center"><GraduationCap className="w-12 h-12 text-red-600 mx-auto mb-4" /><h3 className="font-bold text-gray-800 mb-2">Expert Faculty</h3><p className="text-sm text-gray-600">Learn from industry professionals</p></div>
            <div className="bg-white p-6 rounded-xl shadow-md text-center"><BookOpen className="w-12 h-12 text-blue-600 mx-auto mb-4" /><h3 className="font-bold text-gray-800 mb-2">Updated Curriculum</h3><p className="text-sm text-gray-600">Industry-aligned course content</p></div>
            <div className="bg-white p-6 rounded-xl shadow-md text-center"><Award className="w-12 h-12 text-green-600 mx-auto mb-4" /><h3 className="font-bold text-gray-800 mb-2">Certification</h3><p className="text-sm text-gray-600">Government recognized certificates</p></div>
            <div className="bg-white p-6 rounded-xl shadow-md text-center"><Users className="w-12 h-12 text-yellow-600 mx-auto mb-4" /><h3 className="font-bold text-gray-800 mb-2">Placement Support</h3><p className="text-sm text-gray-600">Career guidance and job assistance</p></div>
          </div>
        </div>
      </section>
      <SiteFooter />
    </div>
  );
}
