import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Leaf, Users, Award, CheckCircle, Menu, X, ArrowRight, MapPin, Phone, Mail, Facebook, Instagram, Twitter, Youtube } from 'lucide-react';

const LandingPage = () => {
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
    
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', href: '#home' },
    { name: 'Therapy Guide', href: '#therapy' },
    { name: 'Diet Plans', href: '#diet' },
    { name: 'Contact', href: '#contact' },
  ];

  return (
    <div className="min-h-screen bg-ayur-beige font-sans">
      {/* Navigation */}
      <nav 
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled ? 'bg-white/80 backdrop-blur-md shadow-sm' : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo - Left */}
            <div className="flex items-center space-x-3">
              <div className={`p-2 rounded-full ${isScrolled ? 'bg-ayur-primary' : 'bg-white/20'}`}>
                <Leaf className={`w-6 h-6 ${isScrolled ? 'text-white' : 'text-ayur-primary'}`} />
              </div>
              <span className={`text-xl font-serif font-semibold ${isScrolled ? 'text-ayur-dark' : 'text-white'}`}>
                AyurSutra Panchakarma
              </span>
            </div>

            {/* Nav Links - Center (Desktop) */}
            <div className="hidden md:flex items-center space-x-8">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className={`text-sm font-medium transition-colors duration-200 hover:text-ayur-primary ${
                    isScrolled ? 'text-gray-700' : 'text-white/90'
                  }`}
                >
                  {link.name}
                </a>
              ))}
            </div>

            {/* Buttons - Right (Desktop) */}
            <div className="hidden md:flex items-center space-x-4">
              <button 
                onClick={() => navigate('/login')}
                className={`px-6 py-2.5 rounded-full text-sm font-medium transition-all duration-200 border-2 ${
                isScrolled 
                  ? 'border-ayur-primary text-ayur-primary hover:bg-ayur-primary hover:text-white' 
                  : 'border-white text-white hover:bg-white hover:text-ayur-dark'
              }`}>
                Login
              </button>
              <button 
                onClick={() => navigate('/book-appointment')}
                className="px-6 py-2.5 rounded-full text-sm font-medium bg-ayur-primary text-white hover:bg-ayur-dark transition-all duration-200 hover:scale-105 shadow-lg"
              >
                Book Appointment
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button 
              className="md:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? (
                <X className={isScrolled ? 'text-gray-700' : 'text-white'} />
              ) : (
                <Menu className={isScrolled ? 'text-gray-700' : 'text-white'} />
              )}
            </button>
          </div>

          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <div className="md:hidden mt-4 pb-4 animate-fade-in">
              <div className="flex flex-col space-y-3">
                {navLinks.map((link) => (
                  <a
                    key={link.name}
                    href={link.href}
                    className="text-gray-700 font-medium py-2"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {link.name}
                  </a>
                ))}
                <div className="flex flex-col space-y-2 pt-3">
                  <button 
                    onClick={() => navigate('/login')}
                    className="px-6 py-2.5 rounded-full text-sm font-medium border-2 border-ayur-primary text-ayur-primary"
                  >
                    Login
                  </button>
                  <button className="px-6 py-2.5 rounded-full text-sm font-medium bg-ayur-primary text-white">
                    Book Appointment
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section 
        id="home"
        className="relative h-screen flex items-center"
        style={{
          backgroundImage: 'url(https://images.unsplash.com/photo-1544161515-4ab6ce6db874?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        {/* Dark Overlay Gradient */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-transparent" />

        <div className="relative z-10 max-w-7xl mx-auto px-6 w-full">
          <div className="flex flex-col lg:flex-row items-center justify-between">
            {/* Hero Text - Left Side */}
            <div className={`lg:w-1/2 text-white ${isLoaded ? 'animate-fade-in-up' : 'opacity-0'}`} style={{ animationDelay: '0.2s' }}>
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-display font-bold leading-tight mb-6">
                <span className="block">Authentic Panchakarma</span>
                <span className="block font-script italic font-normal mt-2 text-ayur-sage">
                  Healing Journey
                </span>
              </h1>
              <p className="text-lg md:text-xl text-white/90 mb-8 max-w-lg leading-relaxed">
                Experience traditional Ayurvedic detoxification and rejuvenation therapies guided by certified practitioners.
              </p>
              
              {/* Hero Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <button 
                  onClick={() => navigate('/book-appointment')}
                  className="px-8 py-4 rounded-full text-base font-medium bg-ayur-primary text-white hover:bg-ayur-dark transition-all duration-300 hover:scale-105 shadow-xl hover:shadow-2xl"
                >
                  Start Your Journey
                </button>
                <button className="px-8 py-4 rounded-full text-base font-medium border-2 border-white text-white hover:bg-white hover:text-ayur-dark transition-all duration-300 hover:scale-105">
                  Learn About Panchakarma
                </button>
              </div>
            </div>

            {/* Floating Stats Card - Right Side */}
            <div className={`lg:w-5/12 mt-12 lg:mt-0 ${isLoaded ? 'animate-fade-in-up' : 'opacity-0'}`} style={{ animationDelay: '0.5s' }}>
              <div className="animate-float bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-2xl border border-white/20">
                <div className="space-y-8">
                  {/* Stat 1 */}
                  <div className="flex items-center space-x-4">
                    <div className="p-3 rounded-full bg-ayur-sage">
                      <Users className="w-6 h-6 text-ayur-primary" />
                    </div>
                    <div>
                      <p className="text-3xl font-display font-bold text-ayur-dark">500+</p>
                      <p className="text-gray-600 font-medium">Patients Healed</p>
                    </div>
                  </div>

                  {/* Stat 2 */}
                  <div className="flex items-center space-x-4">
                    <div className="p-3 rounded-full bg-ayur-beige">
                      <Award className="w-6 h-6 text-ayur-brown" />
                    </div>
                    <div>
                      <p className="text-3xl font-display font-bold text-ayur-dark">15+</p>
                      <p className="text-gray-600 font-medium">Years Experience</p>
                    </div>
                  </div>

                  {/* Stat 3 */}
                  <div className="flex items-center space-x-4">
                    <div className="p-3 rounded-full bg-green-100">
                      <CheckCircle className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                      <p className="text-3xl font-display font-bold text-ayur-dark">100%</p>
                      <p className="text-gray-600 font-medium">Certified Practitioners</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center pt-2">
            <div className="w-1.5 h-3 bg-white/70 rounded-full" />
          </div>
        </div>
      </section>

      {/* What is Panchakarma Section */}
      <section id="therapy" className="py-24 bg-[#F5F1EA]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Left Side (Text Content) - 45% width */}
            <div className={`lg:col-span-5 ${isLoaded ? 'animate-fade-in-up' : 'opacity-0'}`}>
              {/* Small Pill Badge */}
              <span className="inline-block px-4 py-1.5 bg-[#E8F0EA] text-[#2F4F3E] text-xs font-semibold uppercase tracking-wider rounded-full mb-6">
                What is Panchakarma
              </span>
              
              {/* Main Heading */}
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-[#2F4F3E] leading-tight mb-6">
                <span className="block">Ancient Detoxification</span>
                <span className="block font-script italic font-normal text-[#4F7C5A] mt-1">
                  Science of Ayurveda
                </span>
              </h2>
              
              {/* Paragraph Text - Max width ~600px */}
              <div className="space-y-5 max-w-[540px]">
                <p className="text-gray-600 leading-relaxed text-base">
                  Panchakarma is a comprehensive Ayurvedic detoxification and rejuvenation program that cleanses the body of accumulated toxins. This five-fold purification process restores balance to the doshas (Vata, Pitta, Kapha) and promotes optimal health.
                </p>
                <p className="text-gray-600 leading-relaxed text-base">
                  Through personalized treatments including therapeutic massage, herbal steam baths, and specialized cleansing procedures, Panchakarma addresses the root cause of imbalances and supports the body's natural healing abilities.
                </p>
              </div>
            </div>
            
            {/* Right Side (Images Grid) - 55% width */}
            <div className={`lg:col-span-7 ${isLoaded ? 'animate-fade-in-up' : 'opacity-0'}`} style={{ animationDelay: '0.2s' }}>
              <div className="grid grid-cols-2 gap-6">
                {/* Top Left Image */}
                <div className="col-span-1">
                  <img 
                    src="https://images.unsplash.com/photo-1615485500704-8e990f9900f7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                    alt="Herbal powders in bowls" 
                    className="w-full h-48 object-cover rounded-[20px] shadow-lg"
                  />
                </div>
                
                {/* Right Side - Tall Vertical Card */}
                <div className="col-span-1 row-span-2">
                  <div className="w-full h-full min-h-[320px] bg-[#2F4F3E] rounded-[20px] shadow-lg flex items-center justify-center overflow-hidden">
                    <img 
                      src="https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                      alt="Ayurvedic spa treatment" 
                      className="w-full h-full object-cover opacity-80"
                    />
                  </div>
                </div>
                
                {/* Bottom Left Image */}
                <div className="col-span-1">
                  <img 
                    src="https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                    alt="Ayurvedic oils" 
                    className="w-full h-48 object-cover rounded-[20px] shadow-lg"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Comprehensive Therapy Programs Section */}
      <section className="py-24 bg-[#F5F1EA]">
        <div className="max-w-7xl mx-auto px-6">
          {/* Header - 2 Column Layout */}
          <div className="grid lg:grid-cols-2 gap-8 items-start mb-16">
            {/* Left Side - Main Heading */}
            <div className={`${isLoaded ? 'animate-fade-in-up' : 'opacity-0'}`}>
              <h2 className="text-5xl md:text-6xl lg:text-7xl font-display text-[#2F4F3E] leading-[0.95]">
                <span className="block">Comprehensive</span>
                <span className="block font-script italic font-normal text-[#4F7C5A] -mt-2">
                  Therapy Programs
                </span>
              </h2>
            </div>
            
            {/* Right Side - Description Paragraph */}
            <div className={`${isLoaded ? 'animate-fade-in-up' : 'opacity-0'}`} style={{ animationDelay: '0.1s' }}>
              <p className="text-gray-600 leading-relaxed max-w-[500px]">
                Our personalized Panchakarma programs are tailored to your unique constitution and health goals, ensuring optimal results and lasting wellness.
              </p>
            </div>
          </div>

          {/* Therapy Cards Grid - 3 Columns */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Card 1: Vamana Therapy */}
            <div className={`bg-white rounded-[20px] shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 ${isLoaded ? 'animate-fade-in-up' : 'opacity-0'}`} style={{ animationDelay: '0.2s' }}>
              {/* Card Image */}
              <div className="h-48 overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                  alt="Vamana Therapy" 
                  className="w-full h-full object-cover"
                />
              </div>
              {/* Card Content */}
              <div className="p-6">
                {/* Small Tag Badge */}
                <span className="inline-block px-3 py-1 bg-[#E8F0EA] text-[#2F4F3E] text-xs font-medium rounded-full mb-3">
                  Emesis Treatment
                </span>
                {/* Card Title */}
                <h3 className="text-xl font-display font-semibold text-[#2F4F3E] mb-2">
                  Vamana Therapy
                </h3>
                {/* Description Text */}
                <p className="text-gray-500 text-sm leading-relaxed mb-4">
                  Therapeutic vomiting to eliminate excess Kapha dosha, clearing respiratory and digestive systems.
                </p>
                {/* Learn More Link */}
                <a href="#" className="inline-flex items-center text-[#4A7C59] text-sm font-medium hover:underline transition-colors">
                  Learn More
                  <ArrowRight className="w-4 h-4 ml-1" />
                </a>
              </div>
            </div>

            {/* Card 2: Virechana Therapy */}
            <div className={`bg-white rounded-[20px] shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 ${isLoaded ? 'animate-fade-in-up' : 'opacity-0'}`} style={{ animationDelay: '0.3s' }}>
              {/* Card Image */}
              <div className="h-48 overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1615485500704-8e990f9900f7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                  alt="Virechana Therapy" 
                  className="w-full h-full object-cover"
                />
              </div>
              {/* Card Content */}
              <div className="p-6">
                {/* Small Tag Badge */}
                <span className="inline-block px-3 py-1 bg-[#FEF3E2] text-[#B8860B] text-xs font-medium rounded-full mb-3">
                  Purgation Treatment
                </span>
                {/* Card Title */}
                <h3 className="text-xl font-display font-semibold text-[#2F4F3E] mb-2">
                  Virechana Therapy
                </h3>
                {/* Description Text */}
                <p className="text-gray-500 text-sm leading-relaxed mb-4">
                  Controlled purgation to cleanse Pitta dosha and purify the liver, gallbladder, and intestines.
                </p>
                {/* Learn More Link */}
                <a href="#" className="inline-flex items-center text-[#4A7C59] text-sm font-medium hover:underline transition-colors">
                  Learn More
                  <ArrowRight className="w-4 h-4 ml-1" />
                </a>
              </div>
            </div>

            {/* Card 3: Basti Therapy */}
            <div className={`bg-white rounded-[20px] shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 ${isLoaded ? 'animate-fade-in-up' : 'opacity-0'}`} style={{ animationDelay: '0.4s' }}>
              {/* Card Image */}
              <div className="h-48 overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                  alt="Basti Therapy" 
                  className="w-full h-full object-cover"
                />
              </div>
              {/* Card Content */}
              <div className="p-6">
                {/* Small Tag Badge */}
                <span className="inline-block px-3 py-1 bg-[#E0F2F1] text-[#00695C] text-xs font-medium rounded-full mb-3">
                  Enema Treatment
                </span>
                {/* Card Title */}
                <h3 className="text-xl font-display font-semibold text-[#2F4F3E] mb-2">
                  Basti Therapy
                </h3>
                {/* Description Text */}
                <p className="text-gray-500 text-sm leading-relaxed mb-4">
                  Medicated enema to balance Vata dosha, nourishing tissues and strengthening the colon.
                </p>
                {/* Learn More Link */}
                <a href="#" className="inline-flex items-center text-[#4A7C59] text-sm font-medium hover:underline transition-colors">
                  Learn More
                  <ArrowRight className="w-4 h-4 ml-1" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Patient Stories Section */}
      <section className="py-24 bg-[#F5F1EA]">
        <div className="max-w-7xl mx-auto px-6">
          {/* Header */}
          <div className="text-center mb-16">
            {/* Small Badge with Circular Dot */}
            <div className="inline-flex items-center gap-2 mb-6">
              <span className="w-2 h-2 rounded-full bg-[#4F7C5A]"></span>
              <span className="text-sm font-medium text-[#4F7C5A] uppercase tracking-widest">
                Patient Stories
              </span>
            </div>
            
            {/* Main Heading */}
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-[#2F4F3E] mb-4" style={{ letterSpacing: '0.02em' }}>
              Healing Experiences
            </h2>
            
            {/* Subtext */}
            <p className="text-gray-500 text-lg md:text-xl max-w-2xl mx-auto">
              Real stories from our patients
            </p>
          </div>

          {/* Testimonial Cards Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Testimonial Card 1 */}
            <div className="bg-white rounded-[20px] shadow-md p-8 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
              {/* Star Rating */}
              <div className="flex gap-1 mb-5">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-5 h-5 text-[#D4AF37]" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              
              {/* Testimonial Text */}
              <p className="text-gray-600 leading-relaxed mb-6 italic">
                "The Panchakarma treatment at AyurSutra completely transformed my health. My respiratory issues have significantly improved, and I feel more energetic than ever."
              </p>
              
              {/* User Info */}
              <div className="flex items-center gap-4">
                {/* Profile Image */}
                <div className="w-12 h-12 rounded-full bg-gray-200 overflow-hidden flex-shrink-0">
                  <img 
                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80" 
                    alt="Rajesh Kumar"
                    className="w-full h-full object-cover"
                  />
                </div>
                {/* Name and Treatment */}
                <div>
                  <p className="font-semibold text-[#2F4F3E]">Rajesh Kumar</p>
                  <p className="text-sm text-[#4F7C5A]">Vamana Therapy</p>
                </div>
              </div>
            </div>

            {/* Testimonial Card 2 */}
            <div className="bg-white rounded-[20px] shadow-md p-8 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
              {/* Star Rating */}
              <div className="flex gap-1 mb-5">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-5 h-5 text-[#D4AF37]" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              
              {/* Testimonial Text */}
              <p className="text-gray-600 leading-relaxed mb-6 italic">
                "After years of digestive problems, the personalized treatment plan at AyurSutra gave me relief I never thought possible. The practitioners are truly knowledgeable and caring."
              </p>
              
              {/* User Info */}
              <div className="flex items-center gap-4">
                {/* Profile Image */}
                <div className="w-12 h-12 rounded-full bg-gray-200 overflow-hidden flex-shrink-0">
                  <img 
                    src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80" 
                    alt="Priya Sharma"
                    className="w-full h-full object-cover"
                  />
                </div>
                {/* Name and Treatment */}
                <div>
                  <p className="font-semibold text-[#2F4F3E]">Priya Sharma</p>
                  <p className="text-sm text-[#4F7C5A]">Virechana Therapy</p>
                </div>
              </div>
            </div>

            {/* Testimonial Card 3 */}
            <div className="bg-white rounded-[20px] shadow-md p-8 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
              {/* Star Rating */}
              <div className="flex gap-1 mb-5">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-5 h-5 text-[#D4AF37]" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              
              {/* Testimonial Text */}
              <p className="text-gray-600 leading-relaxed mb-6 italic">
                "The Basti therapy sessions have been life-changing for my chronic back pain. The staff's attention to detail and genuine care made all the difference in my recovery."
              </p>
              
              {/* User Info */}
              <div className="flex items-center gap-4">
                {/* Profile Image */}
                <div className="w-12 h-12 rounded-full bg-gray-200 overflow-hidden flex-shrink-0">
                  <img 
                    src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80" 
                    alt="Amit Patel"
                    className="w-full h-full object-cover"
                  />
                </div>
                {/* Name and Treatment */}
                <div>
                  <p className="font-semibold text-[#2F4F3E]">Amit Patel</p>
                  <p className="text-sm text-[#4F7C5A]">Basti Therapy</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main CTA Section - Begin Your Journey */}
      <section className="py-30 bg-[#F5F1EA] flex items-center justify-center">
        {/* CTA Container - 82% width, rounded-3xl, overflow hidden, shadow */}
        <div className="w-[82%] rounded-[30px] overflow-hidden shadow-2xl relative">
          {/* Background Image */}
          <div 
            className="absolute inset-0 w-full h-full"
            style={{
              backgroundImage: 'url(https://images.unsplash.com/photo-1540555700478-4be289fbecef?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80)',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          />
          
          {/* Dark Gradient Overlay - left to right fade */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-black/20" />
          
          {/* Center Content */}
          <div className="relative z-10 py-24 px-8 flex flex-col items-center justify-center text-center">
            {/* Main Text Content */}
            <div className="max-w-3xl">
              {/* Line 1: "Begin your" - clean serif font */}
              <p className="font-display text-4xl md:text-5xl lg:text-6xl text-white font-semibold leading-tight mb-2">
                Begin your
              </p>
              
              {/* Line 2: "transformative healing" - elegant italic/script font */}
              <p className="font-script text-4xl md:text-5xl lg:text-6xl text-white italic font-normal leading-tight mb-2">
                transformative healing
              </p>
              
              {/* Line 3: "journey today" - bold serif font */}
              <p className="font-display text-4xl md:text-5xl lg:text-6xl text-white font-bold leading-tight mb-10">
                journey today
              </p>
            </div>
            
            {/* CTA Button - Green pill, centered */}
            <button 
              onClick={() => navigate('/book-appointment')}
              className="px-12 py-4 bg-[#4F7C5A] text-white text-lg font-medium rounded-full shadow-lg hover:bg-[#3D6B4A] hover:scale-105 transition-all duration-300"
            >
              Book Consultation
            </button>
          </div>
        </div>
      </section>

      {/* Quick Info Section (Diet Plans link target) */}
      <section id="diet" className="py-20 bg-ayur-cream">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div className="p-8 rounded-2xl bg-white shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-ayur-sage flex items-center justify-center">
                <Leaf className="w-8 h-8 text-ayur-primary" />
              </div>
              <h3 className="text-xl font-display font-semibold text-ayur-dark mb-2">Natural Therapies</h3>
              <p className="text-gray-600">Ancient Ayurvedic treatments using pure, natural ingredients</p>
            </div>
            <div className="p-8 rounded-2xl bg-white shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-ayur-beige flex items-center justify-center">
                <Users className="w-8 h-8 text-ayur-brown" />
              </div>
              <h3 className="text-xl font-display font-semibold text-ayur-dark mb-2">Expert Practitioners</h3>
              <p className="text-gray-600">Certified Ayurvedic doctors with years of experience</p>
            </div>
            <div className="p-8 rounded-2xl bg-white shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-100 flex items-center justify-center">
                <Award className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-display font-semibold text-ayur-dark mb-2">Personalized Care</h3>
              <p className="text-gray-600">Tailored treatment plans based on your body constitution</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer Section (Contact link target) */}
      <footer id="contact" className="bg-[#4F7C5A] py-20">
        <div className="max-w-7xl mx-auto px-6">
          {/* Main Footer Content - 3 Columns */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-12 lg:gap-8 mb-12">
            {/* Left Column - Brand, Description, Newsletter, Contact */}
            <div className="lg:col-span-1">
              {/* Logo & Brand */}
              <div className="flex items-center space-x-3 mb-4">
                <div className="p-2 rounded-full bg-white/20">
                  <Leaf className="w-6 h-6 text-white" />
                </div>
                <span className="text-xl font-serif font-semibold text-white">
                  AyurSutra Panchakarma
                </span>
              </div>
              
              {/* Short Description */}
              <p className="text-white/80 leading-relaxed mb-6 max-w-[400px]">
                Experience authentic Ayurvedic Panchakarma therapy with certified practitioners. We offer traditional healing and rejuvenation treatments tailored to your unique constitution.
              </p>
              
              {/* Newsletter Section */}
              <div className="mb-6">
                <h4 className="text-white font-medium mb-3">Stay Updated</h4>
                <div className="flex flex-col sm:flex-row gap-3">
                  <input 
                    type="email" 
                    placeholder="Your email"
                    className="flex-1 px-5 py-3 rounded-full bg-white/10 border border-white/20 text-white placeholder-white/50 outline-none focus:border-white/40 transition-colors"
                  />
                  <button className="px-6 py-3 rounded-full border-2 border-white text-white hover:bg-white hover:text-[#4F7C5A] transition-all duration-300 font-medium">
                    Subscribe
                  </button>
                </div>
              </div>
              
              {/* Contact Us */}
              <div className="mb-6">
                <h4 className="text-white font-medium mb-3">Contact Us</h4>
                <div className="space-y-2 text-white/80">
                  <p className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 mt-1 flex-shrink-0" />
                    <span>SRCOE, Lonikand , Pune , India</span>
                  </p>
                  <p className="flex items-center gap-2">
                    <Phone className="w-4 h-4 flex-shrink-0" />
                    <span>+91 98765 43210</span>
                  </p>
                  <p className="flex items-center gap-2">
                    <Mail className="w-4 h-4 flex-shrink-0" />
                    <span>info@ayursutra.com</span>
                  </p>
                </div>
              </div>
              
              {/* Social Media Icons */}
              <div className="flex items-center gap-3">
                <a href="#" className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-white hover:bg-white/30 transition-colors">
                  <Facebook className="w-5 h-5" />
                </a>
                <a href="#" className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-white hover:bg-white/30 transition-colors">
                  <Instagram className="w-5 h-5" />
                </a>
                <a href="#" className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-white hover:bg-white/30 transition-colors">
                  <Twitter className="w-5 h-5" />
                </a>
                <a href="#" className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-white hover:bg-white/30 transition-colors">
                  <Youtube className="w-5 h-5" />
                </a>
              </div>
            </div>
            
            {/* Middle Column - Quick Links */}
            <div className="lg:col-span-1">
              <h4 className="text-white font-medium mb-4">Quick Links</h4>
              <ul className="space-y-3">
                <li>
                  <a href="#home" className="text-white/80 hover:text-white transition-colors text-sm hover:underline decoration-1 underline-offset-4">
                    Home
                  </a>
                </li>
                <li>
                  <a href="#therapy" className="text-white/80 hover:text-white transition-colors text-sm hover:underline decoration-1 underline-offset-4">
                    Therapy Guide
                  </a>
                </li>
                <li>
                  <a href="#diet" className="text-white/80 hover:text-white transition-colors text-sm hover:underline decoration-1 underline-offset-4">
                    Diet Plans
                  </a>
                </li>
                <li>
                  <a href="#contact" className="text-white/80 hover:text-white transition-colors text-sm hover:underline decoration-1 underline-offset-4">
                    Contact
                  </a>
                </li>
              </ul>
            </div>
            
            {/* Right Column - Resources */}
            <div className="lg:col-span-1">
              <h4 className="text-white font-medium mb-4">Resources</h4>
              <ul className="space-y-3">
                <li>
                  <a href="#" className="text-white/80 hover:text-white transition-colors text-sm hover:underline decoration-1 underline-offset-4">
                    About Panchakarma
                  </a>
                </li>
                <li>
                  <a href="#" className="text-white/80 hover:text-white transition-colors text-sm hover:underline decoration-1 underline-offset-4">
                    Book Appointment
                  </a>
                </li>
                <li>
                  <a href="#" className="text-white/80 hover:text-white transition-colors text-sm hover:underline decoration-1 underline-offset-4">
                    Patient Login
                  </a>
                </li>
                <li>
                  <a href="#" className="text-white/80 hover:text-white transition-colors text-sm hover:underline decoration-1 underline-offset-4">
                    Therapist Login
                  </a>
                </li>
              </ul>
            </div>
          </div>
          
          {/* Bottom Footer Bar */}
          <div className="pt-8 border-t border-white/20">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-white/60 text-sm">
                © 2026 AyurSutra Panchakarma. All rights reserved.
              </p>
              <p className="text-white/60 text-sm">
                Developed by SVS Softwares
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
