"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Check, GraduationCap, Trophy, Users, Building2, FileText, HeadphonesIcon, Award, CreditCard, ArrowRight, Calendar, BookOpen, Bell, TrendingUp } from "lucide-react";
import SiteNav from "@/components/site/SiteNav";
import SiteFooter from "@/components/site/SiteFooter";

const FALLBACK_COURSES = [
  {
    id: 1,
    title: "RSCIT / Basic Computer Course",
    desc: "Learn fundamental computer skills and operations",
    img: "https://lakshaygroupedu.co.in/img/a215/COURSES/1736NuswVu6kHYQs0Y9.png",
  },
  {
    id: 2,
    title: "Tally Prime Course",
    desc: "Master accounting software for business",
    img: "https://lakshaygroupedu.co.in/img/a215/COURSES/6YMQOiXLQMbDCxJ1504.jpg",
  },
  {
    id: 3,
    title: "Digital Marketing Course",
    desc: "Learn online marketing strategies",
    img: "https://lakshaygroupedu.co.in/img/a215/COURSES/3dWyZiQ3iUvKf8M1503.jpg",
  },
  {
    id: 4,
    title: "RSCFA Financial Accounting",
    desc: "Advanced financial accounting skills",
    img: "https://lakshaygroupedu.co.in/img/a215/COURSES/3kBn78NNbVcyS1r1477.jfif",
  },
  {
    id: 5,
    title: "ADCA / DCA Diploma",
    desc: "Comprehensive computer applications diploma",
    img: "https://lakshaygroupedu.co.in/img/a215/COURSES/6plD3i2vEuM1SwP1405.jpg",
  },
];

const ACHIEVER_IMG = "https://lakshaygroupedu.co.in/img/a215/CMS/215WnKD0lF2fXa7p2QSideImg.jpeg";

const GALLERY_IMAGES = [
  { src: "https://lakshaygroupedu.co.in/img/a215/CMS/215utACaRweHzNenbjPhoto.png", alt: "Gallery Photo 1" },
  { src: "https://lakshaygroupedu.co.in/img/a215/CMS/215xJEZu6s4HthncXjPhoto.jpeg", alt: "Gallery Photo 2" },
  { src: "https://lakshaygroupedu.co.in/img/a215/CMS/215QL4KNwPjkuI37PBPhoto.jpeg", alt: "Gallery Photo 3" },
  { src: "https://lakshaygroupedu.co.in/img/a215/CMS/215CDr4B1dSkA8DW6UPhoto.jpeg", alt: "Gallery Photo 4" },
];

export default function HomePage() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [courses, setCourses] = useState(FALLBACK_COURSES);
  useEffect(() => {
    fetch("/api/courses?limit=12", { cache: "no-store" })
      .then((r) => r.json())
      .then((j) => {
        if (j.success && j.data.length > 0) {
          setCourses(j.data.map((c:any, i:number)=>({ id: c.id || i, title: c.name, desc: c.description, img: FALLBACK_COURSES[i % FALLBACK_COURSES.length].img, fees: c.fees, duration: c.duration })));
        }
      }).catch(()=>{});
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % 1);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <SiteNav />

      {/* Hero Banner */}
      <section className="relative w-full overflow-hidden">
        <img
          src="https://lakshaygroupedu.co.in/img/a215/CMS/215Z8YisHX6YPf1lWsSlider.jpeg"
          alt="Rama Coaching Center Hero Banner"
          className="w-full h-[280px] sm:h-[380px] md:h-[480px] lg:h-[560px] object-cover"
        />
        
      </section>

      {/* Be Part of Us */}
      <section className="py-12 sm:py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="w-full md:w-1/2">
              <img
                src="https://lakshaygroupedu.co.in/img/a215/CMS/2156zgXAoXRGxKypyfSideImg.png"
                alt="Be Part of Us"
                className="w-full h-48 md:h-64 lg:h-80 rounded-lg shadow-lg object-cover"
              />
            </div>
            <div className="w-full md:w-1/2">
              <h2 className="text-2xl sm:text-4xl font-semibold sm:font-bold mb-4">
                <span className="text-red-700">Be Part</span> <span className="text-gray-800">of Us</span>
              </h2>
              <p className="text-gray-600 text-sm sm:text-lg mb-6">
                Join our mission to provide quality computer education to students across Uttar Pradesh.
                We are committed to shaping the future of our students with practical skills and industry-relevant knowledge.
              </p>
              <Link href="/contact" className="inline-flex items-center bg-red-700 hover:bg-red-800 text-white px-6 sm:px-8 py-2.5 sm:py-3 rounded-lg font-semibold sm:font-bold transition-colors">
                Join Our Community <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 ml-2" />
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

      {/* Why Choose Us */}
      <section className="py-12 sm:py-16 bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl sm:text-3xl font-semibold sm:font-bold text-center text-gray-800 mb-6 sm:mb-8">Why Choose Rama Coaching Center?</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-8 items-stretch">
            {/* Left Side: 2x2 Feature Cards Grid */}
            <div className="grid grid-cols-2 gap-4 sm:gap-6 h-full">
              <div className="bg-white p-4 sm:p-6 rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1 border-2 border-gray-100">
                <div className="bg-gradient-to-r from-red-500 to-red-600 w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                  <img src="https://lakshaygroupedu.co.in/assets/images/feature/07.png" alt="Futuristic Curriculum" className="w-6 h-6 sm:w-8 sm:h-8 object-contain" />
                </div>
                <h3 className="font-semibold sm:font-bold text-gray-800 text-center text-sm sm:text-base">Futuristic Curriculum</h3>
                <p className="text-xs sm:text-sm text-gray-600 text-center mt-1 sm:mt-2">Industry-aligned courses</p>
                <div className="mt-4 pt-4 border-t border-gray-200 hidden md:block">
                  <ul className="text-left text-xs text-gray-600 space-y-2">
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-red-600 flex-shrink-0" />
                      <span>Updated syllabus as per industry standards</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-red-600 flex-shrink-0" />
                      <span>Practical training with live projects</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-red-600 flex-shrink-0" />
                      <span>Learn from industry experts</span>
                    </li>
                  </ul>
                </div>
              </div>
              <div className="bg-white p-4 sm:p-6 rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1 border-2 border-gray-100">
                <div className="bg-gradient-to-r from-blue-500 to-blue-600 w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                  <img src="https://lakshaygroupedu.co.in/assets/images/feature/08.png" alt="Cutting Edge Course" className="w-6 h-6 sm:w-8 sm:h-8 object-contain" />
                </div>
                <h3 className="font-semibold sm:font-bold text-gray-800 text-center text-sm sm:text-base">Cutting Edge Course</h3>
                <p className="text-xs sm:text-sm text-gray-600 text-center mt-1 sm:mt-2">Latest technologies</p>
                <div className="mt-4 pt-4 border-t border-gray-200 hidden md:block">
                  <ul className="text-left text-xs text-gray-600 space-y-2">
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-blue-600 flex-shrink-0" />
                      <span>Modern tools and software</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-blue-600 flex-shrink-0" />
                      <span>Hands-on practical sessions</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-blue-600 flex-shrink-0" />
                      <span>Real-world project experience</span>
                    </li>
                  </ul>
                </div>
              </div>
              <div className="bg-white p-4 sm:p-6 rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1 border-2 border-gray-100">
                <div className="bg-gradient-to-r from-green-500 to-green-600 w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                  <Trophy className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                </div>
                <h3 className="font-semibold sm:font-bold text-gray-800 text-center text-sm sm:text-base">Tech Revolution</h3>
                <p className="text-xs sm:text-sm text-gray-600 text-center mt-1 sm:mt-2">Digital transformation</p>
                <div className="mt-4 pt-4 border-t border-gray-200 hidden md:block">
                  <ul className="text-left text-xs text-gray-600 space-y-2">
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-green-600 flex-shrink-0" />
                      <span>Digital skills for modern era</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-green-600 flex-shrink-0" />
                      <span>Cloud computing basics</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-green-600 flex-shrink-0" />
                      <span>Smart technology solutions</span>
                    </li>
                  </ul>
                </div>
              </div>
              <div className="bg-white p-4 sm:p-6 rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1 border-2 border-gray-100">
                <div className="bg-gradient-to-r from-purple-500 to-purple-600 w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                  <Users className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                </div>
                <h3 className="font-semibold sm:font-bold text-gray-800 text-center text-sm sm:text-base">Empowering Minds</h3>
                <p className="text-xs sm:text-sm text-gray-600 text-center mt-1 sm:mt-2">Skill development</p>
                <div className="mt-4 pt-4 border-t border-gray-200 hidden md:block">
                  <ul className="text-left text-xs text-gray-600 space-y-2">
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-purple-600 flex-shrink-0" />
                      <span>Career guidance & counseling</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-purple-600 flex-shrink-0" />
                      <span>Soft skills development</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-purple-600 flex-shrink-0" />
                      <span>Personality development</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Right Side: Public Announcements */}
            <div className="w-full h-full flex flex-col">
              <div className="bg-gradient-to-br from-red-600 to-red-700 p-4 sm:p-8 h-full min-h-[300px] sm:min-h-[350px] text-white rounded-xl shadow-xl">
                <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 bg-white/20 rounded-xl flex items-center justify-center border-2 border-white/30">
                    <FileText className="w-6 h-6 sm:w-8 sm:h-8" />
                  </div>
                  <div>
                    <h3 className="text-lg sm:text-2xl font-semibold sm:font-bold">Public Announcements</h3>
                    <p className="text-xs sm:text-sm text-red-100">Latest Updates & News</p>
                  </div>
                </div>
                
                <div className="space-y-3 sm:space-y-4">
                  <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 sm:p-4 border border-white/30">
                    <div className="flex items-start gap-2 sm:gap-3">
                      <Bell className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400 mt-1 flex-shrink-0" />
                      <div>
                        <h4 className="font-semibold sm:font-bold text-sm sm:text-base mb-1">New Batches Starting Soon</h4>
                        <p className="text-xs sm:text-sm text-red-100 hidden md:block">Admissions open for RSCIT, Tally Prime, and Digital Marketing courses. Contact center for details.</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 sm:p-4 border border-white/30">
                    <div className="flex items-start gap-2 sm:gap-3">
                      <Award className="w-4 h-4 sm:w-5 sm:h-5 text-green-400 mt-1 flex-shrink-0" />
                      <div>
                        <h4 className="font-semibold sm:font-bold text-sm sm:text-base mb-1">Scholarship Available</h4>
                        <p className="text-xs sm:text-sm text-red-100 hidden md:block">Merit-based scholarships available for deserving students. Up to 50% fee waiver.</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 sm:p-4 border border-white/30">
                    <div className="flex items-start gap-2 sm:gap-3">
                      <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400 mt-1 flex-shrink-0" />
                      <div>
                        <h4 className="font-semibold sm:font-bold text-sm sm:text-base mb-1">Weekend Classes</h4>
                        <p className="text-xs sm:text-sm text-red-100 hidden md:block">Special weekend batches for working professionals. Saturday & Sunday classes available.</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 sm:p-4 border border-white/30">
                    <div className="flex items-start gap-2 sm:gap-3">
                      <BookOpen className="w-4 h-4 sm:w-5 sm:h-5 text-purple-400 mt-1 flex-shrink-0" />
                      <div>
                        <h4 className="font-semibold sm:font-bold text-sm sm:text-base mb-1">Free Demo Classes</h4>
                        <p className="text-xs sm:text-sm text-red-100 hidden md:block">Attend free demo classes before enrollment. Call us to schedule your session.</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="mt-4 sm:mt-6 pt-3 sm:pt-4 border-t border-white/30">
                  <Link href="/contact" className="inline-flex items-center px-4 sm:px-6 py-2 sm:py-3 bg-white text-red-600 rounded-lg font-semibold sm:font-bold text-xs sm:text-sm hover:bg-gray-100 transition-colors">
                    Contact for Details <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 ml-2" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Course Catalogue */}
      <section className="py-12 sm:py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl sm:text-3xl font-semibold sm:font-bold mb-6 sm:mb-8 text-center">Pick a Course to Get Started</h2>
          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
            {courses.map((course) => (
              <div key={course.id} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow flex flex-col h-full">
                <div className="w-full h-24 sm:h-48 bg-gray-100 overflow-hidden flex-shrink-0">
                  <img src={course.img} alt={course.title} className="w-full h-full object-cover" />
                </div>
                <div className="p-2 sm:p-6 flex flex-col flex-grow">
                  <h3 className="text-xs sm:text-xl font-semibold sm:font-bold mt-1 sm:mt-3 mb-1 sm:mb-2">{course.title}</h3>
                  <p className="text-gray-600 text-xs sm:text-sm mb-1 sm:mb-4 hidden sm:block flex-grow">{course.desc}</p>
                  <div className="mt-auto">
                    <Link href="/courses" className="block bg-red-600 hover:bg-red-700 text-white text-center py-1.5 px-1 sm:py-2.5 sm:px-4 font-medium text-xs sm:text-sm border-2 border-red-700 hover:border-red-800 transition-colors">
                      Enroll Now
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Franchise Red Banner */}
      <section className="bg-red-700 py-10 sm:py-12">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-xl sm:text-3xl font-semibold sm:font-bold text-white mb-4">
            Our Center focus on Institute Management / Student Verification / No.1 Computer Education
          </h2>
          <Link href="/franchise" className="inline-flex items-center bg-yellow-500 hover:bg-yellow-600 text-gray-900 px-6 sm:px-8 py-2.5 sm:py-3 rounded-lg font-semibold sm:font-bold text-base sm:text-lg transition-colors mt-4">
            APPLY NOW <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 ml-2" />
          </Link>
        </div>
      </section>

      {/* Our Achievers */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8 text-center">Our Achievers</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <div key={item} className="text-center">
                <div className="w-24 h-24 rounded-full mx-auto mb-3 border-4 border-red-700 overflow-hidden">
                  <img src={ACHIEVER_IMG} alt={`Achiever ${item}`} className="w-full h-full object-cover" />
                </div>
                <p className="font-bold text-gray-800">Student {item}</p>
                <p className="text-sm text-gray-600">Course Graduate</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Counselling & Admission */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="w-full md:w-1/2">
              <img src="https://lakshaygroupedu.co.in/assets/images/about/01.png" alt="Free Admission Counselling" className="w-full h-64 md:h-80 rounded-lg shadow-lg object-contain" />
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

      {/* What People Say About Us */}
      <section className="py-16 relative bg-cover bg-center" style={{ backgroundImage: "url('https://lakshaygroupedu.co.in/img/a215/CMS/215McUfxyzTIvRisyzSlider.jpg')" }}>
        <div className="absolute inset-0 bg-white/80" />
        <div className="relative container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8 text-center">What People Say About Us</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((item) => (
              <div key={item} className="bg-white p-6 rounded-lg shadow-lg border-l-4 border-green-600">
                <div className="flex items-center mb-4">
                  <div className="w-16 h-16 rounded-full overflow-hidden mr-4 flex-shrink-0">
                    <img src={ACHIEVER_IMG} alt={`Student ${item}`} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-800">Student {item}</h4>
                    <p className="text-sm text-gray-600">Course Graduate</p>
                  </div>
                </div>
                <p className="text-gray-700 italic">
                  &ldquo;Excellent teaching methodology and practical approach. The faculty is very supportive and the curriculum is industry-relevant.&rdquo;
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Photo Gallery */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8 text-center">Our Professional Photo Gallery</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {GALLERY_IMAGES.map((img, i) => (
              <div key={i} className="rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
                <img src={img.src} alt={img.alt} className="w-full h-48 md:h-64 object-cover" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
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

      {/* Franchise + Verification Cards */}
      <section className="py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto px-4 py-10">
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow">
            <div className="w-full bg-slate-50 flex items-center justify-center p-4">
              <img src="https://lakshaygroupedu.co.in/assets/images/achive/01.png" alt="Join Our Franchise" className="w-full h-48 object-contain" />
            </div>
            <div className="p-6 text-center">
              <h3 className="text-xl font-bold text-gray-900 mb-2">Join Our Franchise Network</h3>
              <p className="text-sm text-gray-600 mb-4">Become part of our growing network of computer education.</p>
              <Link href="/franchise" className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white font-medium text-sm border-2 border-red-700 hover:border-red-800 transition-colors">Apply Now</Link>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow">
            <div className="w-full bg-slate-50 flex items-center justify-center p-4">
              <img src="https://lakshaygroupedu.co.in/assets/images/achive/02.png" alt="Student Verification System" className="w-full h-48 object-contain" />
            </div>
            <div className="p-6 text-center">
              <h3 className="text-xl font-bold text-gray-900 mb-2">Student Verification System</h3>
              <p className="text-sm text-gray-600 mb-4">Easy and secure certificate verification for employers.</p>
              <Link href="/verification" className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white font-medium text-sm border-2 border-red-700 hover:border-red-800 transition-colors">Verify Now</Link>
            </div>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}