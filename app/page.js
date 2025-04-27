'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X, Ticket, Bell, Search, User } from 'lucide-react';
import { Calendar, MapPin, Users, ChevronRight, Award, Clock, Star } from 'lucide-react';

export default function LandingPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  
  // Handle scroll effect for header
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  return (
    <div className="font-sans bg-gradient-to-b from-primary-50 to-white">
      {/* Header with glassmorphism effect */}
      <header 
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        isScrolled 
          ? 'backdrop-blur-md bg-white/80 dark:bg-neutral-900/80 shadow-soft-md' 
          : 'bg-white dark:bg-neutral-900'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo and Brand */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2 group">
              <div className="bg-primary-gradient p-2 rounded-lg shadow-soft-sm group-hover:shadow-soft-md transition-all duration-300">
                <Ticket className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
              </div>
              <h1 className="text-xl sm:text-2xl font-display font-bold text-neutral-900 dark:text-white">EventHub</h1>
            </Link>
          </div>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
            {[
              { name: 'Events', href: '/events' },
              { name: 'Discover', href: '/' },
              { name: 'Venues', href: '/events' },
              { name: 'Vendors', href: '/vendors/services' }
            ].map((item) => (
              <Link 
                key={item.name} 
                href={item.href}
                className="px-3 py-2 text-neutral-700 dark:text-neutral-200 font-medium hover:text-primary-600 dark:hover:text-primary-400 transition-colors relative group"
              >
                <span>{item.name}</span>
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary-gradient group-hover:w-full transition-all duration-300 ease-out"></span>
              </Link>
            ))}
          </nav>
          
          {/* Action Buttons */}
          <div className="hidden md:flex items-center space-x-2 lg:space-x-4">
            {/* Search button */}
            <button className="p-2 text-neutral-500 hover:text-primary-600 dark:text-neutral-400 dark:hover:text-primary-400 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors">
              <Search className="h-5 w-5" />
            </button>
            
            {/* Notifications */}
            <button className="p-2 text-neutral-500 hover:text-primary-600 dark:text-neutral-400 dark:hover:text-primary-400 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors relative">
              <Bell className="h-5 w-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-accent-500 rounded-full animate-badge-pulse"></span>
            </button>
            
            {/* Auth Buttons */}
            <div className="flex items-center space-x-2">
              <Link href="/login" className="px-4 py-2 text-sm text-primary-600 dark:text-primary-400 border border-primary-200 dark:border-primary-800 hover:border-primary-400 dark:hover:border-primary-600 rounded-full font-medium hover:bg-primary-50 dark:hover:bg-primary-900/30 transition-colors">
                Sign In
              </Link>
              <Link href="/register" className="px-4 py-2 text-sm text-white rounded-full font-medium bg-primary-gradient hover:shadow-soft-md hover:scale-105 transition-all">
                Get Started
              </Link>
            </div>
          </div>
          
          {/* Mobile menu button */}
          <div className="flex items-center space-x-3 md:hidden">
            <button className="p-2 text-neutral-500 hover:text-primary-600 dark:text-neutral-400 dark:hover:text-primary-400 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors">
              <Search className="h-5 w-5" />
            </button>
            <button className="p-2 text-neutral-500 hover:text-primary-600 dark:text-neutral-400 dark:hover:text-primary-400 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors">
              <User className="h-5 w-5" />
            </button>
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 text-neutral-700 dark:text-neutral-200 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-colors"
              aria-expanded={isMenuOpen}
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile Navigation Slide-down Panel */}
      <div 
        className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
          isMenuOpen ? 'max-h-96 border-b border-neutral-200 dark:border-neutral-700' : 'max-h-0'
        }`}
      >
        <nav className="px-4 pt-2 pb-6 space-y-1 bg-white dark:bg-neutral-900">
          {[
            { name: 'Events', href: '/events' },
            { name: 'Discover', href: '/' },
            { name: 'Venues', href: '/events' },
            { name: 'Vendors', href: '/vendors/services' }
          ].map((item) => (
            <Link 
              key={item.name} 
              href={item.href}
              className="block px-3 py-2 text-base font-medium text-neutral-700 dark:text-neutral-200 hover:bg-neutral-50 dark:hover:bg-neutral-800 hover:text-primary-600 dark:hover:text-primary-400 rounded-lg transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              {item.name}
            </Link>
          ))}
          
          <div className="pt-4 space-y-2">
            <Link 
              href="/login" 
              className="block w-full px-4 py-2 text-center text-primary-600 dark:text-primary-400 border border-primary-200 dark:border-primary-800 rounded-full font-medium hover:bg-primary-50 dark:hover:bg-primary-900/30 transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Sign In
            </Link>
            <Link 
              href="/register" 
              className="block w-full px-4 py-2 text-center text-white bg-primary-gradient rounded-full font-medium hover:shadow-soft-md transition-all"
              onClick={() => setIsMenuOpen(false)}
            >
              Get Started
            </Link>
          </div>
        </nav>
      </div>
    </header>

    <section className="relative overflow-hidden py-12 lg:py-20">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-neutral-50 dark:bg-neutral-900"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary-gradient rounded-full filter blur-3xl opacity-10 animate-float"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-secondary-gradient rounded-full filter blur-3xl opacity-10 animate-float" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/4 w-64 h-64 bg-accent-gradient rounded-full filter blur-3xl opacity-5 animate-float" style={{ animationDelay: '4s' }}></div>
        
        {/* Subtle pattern overlay */}
        <div className="absolute inset-0 bg-ticket-pattern opacity-5"></div>
      </div>
      
      {/* Content Container */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center">
          {/* Left Content Area */}
          <div className="w-full lg:w-1/2 mb-12 lg:mb-0 pr-0 lg:pr-8">
            {/* Badge */}
            <div className="flex items-center mb-6 space-x-2">
              <span className="px-3 py-1 bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 rounded-full text-sm font-medium inline-flex items-center">
                <Star className="w-3.5 h-3.5 mr-1" />
                New Feature
              </span>
              <span className="px-3 py-1 bg-secondary-50 dark:bg-secondary-900/30 text-secondary-600 dark:text-secondary-400 rounded-full text-sm font-medium">
                Simplified Ticketing
              </span>
            </div>
            
            {/* Headline */}
          <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight tracking-tight text-neutral-900 dark:text-white">
            Seamless
            <span className="relative mx-2">
              <span className="text-[#97350f] boxshadow-soft-xl dark:text-secondary-700">Events</span>
              <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 100 10" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
                <path d="M0,0 C50,20 50,20 100,0 L100,10 L0,10 Z" fill="url(#accent-gradient)" opacity="0.2" />
              </svg>
            </span>
            & Ticketing Platform
          </h1>
            
            {/* Description with better readability */}
            <p className="text-neutral-700 dark:text-neutral-300 text-lg mb-8 max-w-lg leading-relaxed">
              Effortlessly discover, book, and manage events with our intuitive platform. 
              Connect with trusted vendors and create unforgettable experiences, all in one place.
            </p>
            
            {/* Feature Pills */}
            <div className="flex flex-wrap gap-3 mb-8">
              <div className="inline-flex items-center px-3 py-1 bg-white dark:bg-neutral-800 rounded-full shadow-soft-sm text-sm text-neutral-700 dark:text-neutral-300">
                <Clock className="w-4 h-4 mr-1.5 text-primary-500" />
                Quick Booking
              </div>
              <div className="inline-flex items-center px-3 py-1 bg-white dark:bg-neutral-800 rounded-full shadow-soft-sm text-sm text-neutral-700 dark:text-neutral-300">
                <Users className="w-4 h-4 mr-1.5 text-secondary-500" />
                500+ Vendors
              </div>
              <div className="inline-flex items-center px-3 py-1 bg-white dark:bg-neutral-800 rounded-full shadow-soft-sm text-sm text-neutral-700 dark:text-neutral-300">
                <Award className="w-4 h-4 mr-1.5 text-accent-500" />
                Premium Support
              </div>
            </div>
            
            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-4">
              <Link 
                href="/events" 
                className="px-6 py-3 bg-primary-gradient text-white rounded-full font-medium shadow-soft-lg hover:shadow-soft-xl hover:scale-105 transition-all duration-300 flex items-center"
              >
                <Calendar className="h-5 w-5 mr-2" />
                Explore Events
                <ChevronRight className="ml-1 h-4 w-4" />
              </Link>
              <Link 
                href="/vendors/services" 
                className="px-6 py-3 border-2 border-primary-200 dark:border-primary-800 text-primary-600 dark:text-primary-400 bg-white/80 dark:bg-transparent backdrop-blur-sm rounded-full font-medium hover:border-primary-400 dark:hover:border-primary-600 hover:shadow-soft-md transition-all duration-300 flex items-center"
              >
                Book Vendor
              </Link>
            </div>
            
            {/* Trust Indicators */}
            <div className="mt-8 pt-4 border-t border-neutral-200 dark:border-neutral-800">
            </div>
          </div>
          
          {/* Right Content Area - Featured Event Card */}
          <div className="w-full lg:w-1/2 pl-0 lg:pl-10">
            <div className="relative max-w-md mx-auto">
              {/* Main Card with Glass Effect */}
              <div className="relative z-20 bg-white dark:bg-neutral-800 backdrop-blur-md bg-opacity-90 dark:bg-opacity-80 rounded-3xl overflow-hidden shadow-soft-xl border border-neutral-100 dark:border-neutral-700 transform transition-transform duration-500 hover:-translate-y-2">
                {/* Event Image */}
                <div className="relative h-72 overflow-hidden">
                  <div className="absolute inset-0 bg-primary-900/20 z-10"></div>
                  <img 
                    src="https://i.pinimg.com/736x/55/ce/05/55ce05402e1a34e31c6620c0e4ba43a3.jpg" 
                    alt="Featured Event" 
                    className="w-full h-full object-cover object-center"
                  />
                  
                  {/* Event Date Badge */}
                  <div className="absolute top-4 right-4 z-20 flex flex-col items-center justify-center w-16 h-16 rounded-2xl bg-white dark:bg-neutral-800 shadow-soft-lg text-center">
                    <span className="text-primary-600 dark:text-primary-400 text-lg font-bold">24</span>
                    <span className="text-neutral-500 dark:text-neutral-400 text-xs font-medium">MAY</span>
                  </div>
                  
                  {/* Event Type Badge */}
                  <div className="absolute top-4 left-4 z-20 px-3 py-1 bg-primary-gradient rounded-full text-xs text-white font-medium">
                    Featured Event
                  </div>
                </div>
                
                {/* Event Details */}
                <div className="p-6">
                  <h3 className="text-2xl font-bold text-neutral-900 dark:text-white mb-2">Summer Music Festival 2025</h3>
                  
                  <div className="flex items-center text-neutral-500 dark:text-neutral-400 mb-4">
                    <MapPin className="w-4 h-4 mr-1" />
                    <span className="text-sm">San Francisco Amphitheater, CA</span>
                  </div>
                  
                  <p className="text-neutral-600 dark:text-neutral-300 mb-6">
                    Experience three days of amazing performances from top artists across multiple stages in the heart of San Francisco.
                  </p>
                  
                  {/* Price and Available Tickets */}
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <span className="text-sm text-neutral-500 dark:text-neutral-400">Starting from</span>
                      <div className="text-2xl font-bold text-neutral-900 dark:text-white">$79.99</div>
                    </div>
                    <div className="text-right">
                      <span className="text-sm text-neutral-500 dark:text-neutral-400">Available tickets</span>
                      <div className="text-lg font-bold text-neutral-900 dark:text-white">
                        <span className="text-primary-600 dark:text-primary-400">142</span> / 500
                      </div>
                    </div>
                  </div>
                  
                  {/* Action Button */}
                  <Link 
                    href="/events" 
                    className="block w-full py-3 bg-primary-gradient text-white text-center rounded-xl font-medium shadow-soft-md hover:shadow-soft-lg hover:scale-[1.02] transition-all duration-300"
                  >
                    Book Tickets Now
                  </Link>
                </div>
              </div>
              
              {/* Floating Elements - Better positioned */}
              <div className="absolute top-8 -left-8 sm:-left-10 z-10 bg-white dark:bg-neutral-800 rounded-2xl shadow-soft-lg p-3 transform rotate-6 hover:rotate-0 transition-transform">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-primary-gradient rounded-xl flex items-center justify-center text-white shadow-soft-md">
                    <Clock className="h-6 w-6" />
                  </div>
                  <div className="ml-3">
                    <div className="text-xs text-neutral-500 dark:text-neutral-400">Quick Booking</div>
                    <div className="text-sm font-medium text-neutral-900 dark:text-white">3-min process</div>
                  </div>
                </div>
              </div>
              
              {/* Adjusted right floating element for better alignment */}
              <div className="absolute -bottom-6 -right-6 sm:-right-8 z-10 bg-white dark:bg-neutral-800 rounded-2xl shadow-soft-lg p-3 transform -rotate-6 hover:rotate-0 transition-transform">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-secondary-gradient rounded-xl flex items-center justify-center text-white shadow-soft-md">
                    <Award className="h-6 w-6 p-6" />
                  </div>
                  <div className="ml-3">
                    <div className="text-xs text-neutral-500 dark:text-neutral-400">Verified Events</div>
                    <div className="text-sm font-medium text-neutral-900 dark:text-white">100% guaranteed</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

      {/* Stats Section */}
      <section className="py-10">
        <div className="max-w-7xl mx-auto px-4">
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-y md:divide-y-0 divide-gray-100">
              {[
                { number: "50k+", label: "Monthly Users" },
                { number: "2k+", label: "Events Hosted" },
                { number: "500+", label: "Verified Vendors" },
                { number: "100%", label: "Secure Payments" }
              ].map((stat, index) => (
                <div key={index} className="p-6 text-center hover:bg-primary-50 transition-colors">
                  <div className="text-3xl font-bold text-primary-600">{stat.number}</div>
                  <div className="text-gray-600 mt-1">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Audience Cards - with Modern Card Design */}
<section className="py-24 relative overflow-hidden">
  {/* Dynamic background with subtle animation */}
  <div className="absolute inset-0 bg-neutral-50 dark:bg-neutral-900 z-0">
    <div className="absolute inset-0 bg-ticket-pattern opacity-5 animate-float"></div>
    <div className="absolute top-0 left-0 w-full h-64 bg-primary-gradient opacity-5 blur-3xl transform -translate-y-1/2"></div>
    <div className="absolute bottom-0 right-0 w-full h-64 bg-accent-gradient opacity-5 blur-3xl transform translate-y-1/2"></div>
  </div>
  
  <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
    <div className="text-center mb-16">
      <div className="inline-flex items-center justify-center mb-4 relative">
        <span className="absolute inset-0 rounded-full bg-secondary-gradient opacity-20 blur-sm animate-pulse"></span>
        <span className="relative px-5 py-2 rounded-full bg-white dark:bg-neutral-800 shadow-soft-md flex items-center">
          <span className="animate-badge-pulse h-2.5 w-2.5 rounded-full bg-secondary-500 mr-2"></span>
          <span className="text-sm font-medium tracking-wide text-secondary-700 dark:text-secondary-300">Discover Your Role</span>
        </span>
      </div>
      
      <h3 className="text-4xl md:text-5xl font-heading font-bold text-neutral-900 dark:text-white mb-4">
        Who's <span className="bg-clip-text text-[#183c72] ">Part of the Event</span>
      </h3>
      <p className="max-w-2xl mx-auto text-neutral-600 dark:text-neutral-300">
        Find where you fit in our vibrant community of event-goers, Vendors, and facilitators
      </p>
    </div>
    
    <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
      {[
        {
          icon: "🎭",
          title: "Guest Experience",
          color: "primary",
          features: [
            "Buy tickets for occasions, parties, and ceremonies",
            "Get instant e-ticket confirmation",
            "Book campus-based vendors with ease"
          ]
        },
        {
          icon: "🛍️",
          title: "Vendor Solutions",
          color: "secondary",
          features: [
            "Create & manage a vendor profile",
            "Showcase services, pricing & availability",
            "Receive bookings from verified guests"
          ]
        },
        {
          icon: "🎪",
          title: "Organizer Tools",
          color: "accent",
          features: [
            "Post and manage events",
            "Track ticket sales and attendance",
            "Manage vendor approvals for events"
          ]
        }
      ].map((card, index) => (
        <div key={index} className="group perspective-1000">
          <div className="transform-gpu transition-all duration-500 group-hover:rotate-y-6 group-hover:scale-105">
            <div className={`relative bg-glass-light dark:bg-glass-dark backdrop-blur-sm rounded-2xl overflow-hidden border border-neutral-200/50 dark:border-neutral-700/50 h-full shadow-ticket`}>
              {/* Animated gradient background */}
              <div className={`absolute inset-0 bg-${card.color}-gradient opacity-0 group-hover:opacity-10 transition-opacity`}></div>
              
              {/* Inner highlight */}
              <div className="absolute inset-x-0 top-0 h-px bg-white/20 shadow-inner-highlight"></div>
              
              {/* Animated shine effect */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-all duration-1500 ease-in-out"></div>
              
              {/* Content container */}
              <div className="relative p-8 z-10">
                {/* Icon with floating effect */}
                <div className={`bg-${card.color}-gradient text-white rounded-xl w-16 h-16 flex items-center justify-center text-3xl shadow-soft-lg mb-6 group-hover:animate-float`}>
                  {card.icon}
                </div>
                
                <h4 className="text-2xl font-heading font-bold mb-5 text-neutral-900 dark:text-white group-hover:text-${card.color}-600 dark:group-hover:text-${card.color}-400 transition-colors">
                  {card.title}
                </h4>
                
                <ul className="space-y-4">
                  {card.features.map((feature, i) => (
                    <li key={i} className="flex items-start text-neutral-700 dark:text-neutral-300">
                      <div className={`p-1 rounded-full bg-${card.color}-100 dark:bg-${card.color}-900/30 mr-3 flex-shrink-0 mt-1 transform transition-transform group-hover:scale-110 group-hover:rotate-3`}>
                        <svg className={`h-4 w-4 text-${card.color}-600 dark:text-${card.color}-400`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <span className="group-hover:translate-x-1 transition-transform duration-300 delay-75">{feature}</span>
                    </li>
                  ))}
                </ul>
                
                {/* Action button that appears on hover */}
                <div className="mt-8 overflow-hidden h-0 group-hover:h-10 transition-all duration-300">
                  {/* <button className={`w-full py-2.5 px-4 rounded-lg bg-${card.color}-gradient text-white font-medium shadow-soft-md hover:shadow-soft-lg transition-shadow`}>
                    Get Started
                  </button> */}
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
</section>

      {/* Features Section */}
      <section className="py-24 relative overflow-hidden">
  {/* Dynamic background with waves */}
  <div className="absolute inset-0 bg-neutral-50 dark:bg-neutral-900 z-0">
    <div className="absolute inset-0 bg-ticket-pattern opacity-5"></div>
    
    {/* Animated wave backgrounds */}
    <div className="absolute bottom-0 left-0 right-0 h-64 opacity-20">
      <svg className="absolute bottom-0 w-full h-full" viewBox="0 0 1200 120" preserveAspectRatio="none">
        <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V95.8C59.71,118.11,140.83,94.17,208.86,82.7A602.86,602.86,0,0,0,321.39,56.44Z" 
              fill="url(#primary-gradient)" className="animate-float" style={{animationDuration: '15s'}}></path>
      </svg>
      <svg className="absolute bottom-0 w-full h-full" viewBox="0 0 1200 120" preserveAspectRatio="none">
        <path d="M985.66,92.83C906.67,72,823.78,31,743.84,14.19c-82.26-17.34-168.06-16.33-250.45.39-57.84,11.73-114,31.07-172,41.86A600.21,600.21,0,0,1,0,27.35V120H1200V95.8C1132.19,118.92,1055.71,111.31,985.66,92.83Z" 
              fill="url(#secondary-gradient)" className="animate-float" style={{animationDuration: '18s', animationDelay: '1s'}}></path>
      </svg>
    </div>
  </div>
  
  <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
    <div className="text-center mb-16">
      <div className="relative inline-block mb-5">
        <div className="absolute inset-0 bg-primary-gradient opacity-20 blur-lg rounded-full transform animate-pulse"></div>
        <span className="relative inline-flex items-center px-4 py-2 bg-white dark:bg-neutral-800 rounded-full shadow-soft-lg">
          <span className="flex h-3 w-3 mr-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-primary-500"></span>
          </span>
          <span className="text-sm font-bold tracking-wide text-primary-600 dark:text-primary-400">What We Offer</span>
        </span>
      </div>
      
      <h3 className="text-4xl md:text-5xl font-heading font-bold mb-6">
        <span className="bg-clip-text text-[#183c72] ">Powerful</span> Platform Features
      </h3>
      <p className="max-w-2xl mx-auto text-neutral-600 dark:text-neutral-300 mb-12">
        A comprehensive suite of tools designed to make event planning, ticketing, and attendance seamless
      </p>
    </div>
    
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 perspective-1000">
      {[
        {
          icon: "🔐",
          title: "Secure Login",
          description: "Role-based access control for guests, vendors, and organizers.",
          color: "primary",
          delay: 0
        },
        {
          icon: "💳",
          title: "Online Payments",
          description: "Integrated with Paystack / Flutterwave for safe transactions.",
          color: "secondary",
          delay: 0.1
        },
        {
          icon: "📧",
          title: "Email Notifications",
          description: "Get automatic confirmations for bookings and purchases.",
          color: "accent",
          delay: 0.2
        },
        {
          icon: "📱",
          title: "Mobile Ready",
          description: "Fully responsive design optimized for all devices.",
          color: "primary",
          delay: 0.3
        },
        {
          icon: "📆",
          title: "Event Calendar",
          description: "Browse upcoming events and never miss out.",
          color: "secondary",
          delay: 0.4
        },
        {
          icon: "⭐",
          title: "Vendor Reviews",
          description: "See ratings and feedback before booking a service.",
          color: "accent",
          delay: 0.5
        }
      ].map((feature, index) => (
        <div key={index} className="group animate-float" style={{animationDelay: `${feature.delay}s`, animationDuration: '6s'}}>
          <div className="relative h-full transform-gpu transition-all duration-500 group-hover:rotate-y-6 group-hover:scale-105">
            {/* Card with glassmorphism effect */}
            <div className="relative bg-glass-light dark:bg-glass-dark backdrop-blur-sm rounded-2xl overflow-hidden h-full shadow-ticket border border-neutral-200/30 dark:border-neutral-700/30">
              {/* Background decoration */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-neutral-300/5 dark:from-neutral-700/5 dark:to-black/5"></div>
              
              {/* Animated glow effect on hover */}
              <div className={`absolute -inset-px opacity-0 group-hover:opacity-30 bg-${feature.color}-gradient blur-sm transition-opacity duration-300`}></div>
              
              {/* Animated top bar */}
              <div className={`absolute top-0 left-0 right-0 h-1 bg-${feature.color}-gradient transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500`}></div>
                            
              {/* Content */}
              <div className="relative p-8 z-10">
                <div className="flex items-center mb-5">
                  {/* Animated icon container */}
                  <div className={`relative bg-${feature.color}-50 dark:bg-${feature.color}-900/20 w-16 h-16 rounded-xl flex items-center justify-center text-3xl shadow-soft-md overflow-hidden group-hover:shadow-soft-lg transition-all duration-300 transform group-hover:scale-110 group-hover:rotate-3`}>
                    {/* Shine effect */}
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-all duration-1000 ease-in-out"></div>
                    {feature.icon}
                  </div>
                  
                  <h4 className={`ml-5 text-xl font-heading font-bold text-neutral-900 dark:text-white group-hover:text-${feature.color}-600 dark:group-hover:text-${feature.color}-400 transition-colors duration-300`}>
                    {feature.title}
                  </h4>
                </div>
                
                <p className="text-neutral-700 dark:text-neutral-300 group-hover:translate-x-1 transition-transform duration-300 delay-75">
                  {feature.description}
                </p>
                
                {/* Interactive badge that appears on hover */}
                <div className="mt-6 overflow-hidden h-0 group-hover:h-8 transition-all duration-300 ease-out">
                  <div className={`inline-flex items-center px-3 py-1 rounded-full bg-${feature.color}-50 dark:bg-${feature.color}-900/30 text-${feature.color}-600 dark:text-${feature.color}-400 text-sm font-medium`}>
                    <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                    </svg>
                    Explore Feature
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
</section>

      {/* Call to Action */}
      <section className="py-16 relative overflow-hidden">
  {/* Enhanced background with vibrant gradients */}
  <div className="absolute inset-0 z-0">
    <div className="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b from-blue-50 to-white"></div>
    <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-purple-50 to-white"></div>
    <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-blue-400 rounded-full filter blur-3xl opacity-20"></div>
    <div className="absolute -top-20 -left-20 w-64 h-64 bg-purple-400 rounded-full filter blur-3xl opacity-20"></div>
  </div>
  
  <div className="relative z-10 max-w-5xl mx-auto px-4">
    <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
      <div className="p-8 md:p-10">
        <div className="flex flex-col md:flex-row items-center">
          <div className="mb-8 md:mb-0 md:w-1/2 md:pr-8">
            <span className="inline-block px-4 py-1 bg-blue-50 text-blue-600 rounded-full text-sm font-medium mb-4">
              Ready to Get Started?
            </span>
            <h3 className="text-3xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Plan Your Next Campus Experience
            </h3>
            <p className="text-gray-600 mb-6">
              Join EventHub today and simplify your event or vendor experience. Our platform handles all the details so you can focus on what matters most.
            </p>
            <Link 
              href="/register" 
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-full font-medium shadow-md hover:bg-blue-700 hover:shadow-lg transition-all duration-300"
            >
              Get Started
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </Link>
          </div>
          
          <div className="md:w-1/2">
            <div className="relative">
              {/* Visual decorative elements */}
              <div className="absolute -top-6 -right-6 w-20 h-20 bg-blue-50 rounded-full"></div>
              <div className="absolute -bottom-6 -left-6 w-20 h-20 bg-purple-100 rounded-full"></div>
              
              <div className="relative bg-white rounded-2xl shadow-lg p-3 transform hover:translate-y-1 transition-transform duration-300">
                <img 
                  src="https://i.pinimg.com/736x/c1/d2/95/c1d295d55724984e10db0db9d75c435c.jpg" 
                  alt="Mobile app showcase" 
                  className="w-full h-auto rounded-lg"
                />
                <div className="absolute top-0 left-0 ml-3 mt-3 bg-blue-600 text-white text-xs px-2 py-1 rounded-full">
                  Mobile Ready
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 py-12">
            <div>
              <div className="flex items-center space-x-2">
                <div className="bg-primary-gradient p-2 rounded-lg">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <h2 className="text-xl font-heading font-bold">EventHub</h2>
              </div>
              <p className="mt-4 text-gray-400">
                Your all-in-one platform for event management, ticket booking, and vendor connections.
              </p>
              <div className="flex space-x-4 mt-6">
                {['facebook', 'twitter', 'instagram', 'linkedin'].map((social) => (
                  <a key={social} href={`#${social}`} className="text-gray-400 hover:text-white transition-colors">
                    <span className="sr-only">{social}</span>
                    <div className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center hover:bg-primary-600 transition-colors">
                      {social[0].toUpperCase()}
                    </div>
                  </a>
                ))}
              </div>
            </div>
            
            <div>
              <h3 className="font-heading font-bold text-lg mb-4">Quick Links</h3>
              <ul className="space-y-2">
                {['Home', 'Events', 'Vendors', 'About', 'Contact'].map((item) => (
                  <li key={item}>
                    <Link href={`/${item.toLowerCase()}`} className="text-gray-400 hover:text-white transition-colors">
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            
            <div>
              <h3 className="font-heading font-bold text-lg mb-4">Resources</h3>
              <ul className="space-y-2">
                {['Help Center', 'Pricing', 'Blog', 'Support', 'Terms'].map((item) => (
                  <li key={item}>
                    <Link href={`/${item.toLowerCase().replace(' ', '-')}`} className="text-gray-400 hover:text-white transition-colors">
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            
            <div>
              <h3 className="font-heading font-bold text-lg mb-4">Subscribe</h3>
              <p className="text-gray-400 mb-4">Get the latest updates on new features and upcoming events.</p>
              <div className="flex">
                <input 
                  type="email" 
                  placeholder="Enter your email" 
                  className="flex-grow px-4 py-2 bg-gray-800 text-white rounded-l-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
                <button className="px-4 py-2 bg-primary-gradient rounded-r-lg">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-800 py-6">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p className="text-gray-400 text-sm">
                &copy; {new Date().getFullYear()} EventHub. All rights reserved.
              </p>
              <div className="flex space-x-6 mt-4 md:mt-0">
                <Link href="/privacy-policy" className="text-gray-400 hover:text-white text-sm transition-colors">
                  Privacy Policy
                </Link>
                <Link href="/terms-of-service" className="text-gray-400 hover:text-white text-sm transition-colors">
                  Terms of Service
                </Link>
                <Link href="/cookie-policy" className="text-gray-400 hover:text-white text-sm transition-colors">
                  Cookie Policy
                </Link>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}