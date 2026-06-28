import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { addAppointment, getUser } from '../utils/storage';

const AppointmentBooking = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedTherapy, setSelectedTherapy] = useState(null);
  const [selectedTherapist, setSelectedTherapist] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('cash'); // 'cash' or 'online'
  const [isProcessing, setIsProcessing] = useState(false);
  const [therapists, setTherapists] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("https://ayursutra-panchakarma-f8cg.onrender.com/api/therapists")
      .then(res => res.json())
      .then(data => setTherapists(Array.isArray(data) ? data : []))
      .catch(err => console.error("Error fetching therapists:", err));
  }, []);

  // Auto-select therapy recommended by AI Health Assistant via localStorage
  useEffect(() => {
    try {
      const recommended = localStorage.getItem('ayursutra_recommended_therapy');
      if (recommended && recommended.trim()) {
        const normalized = recommended.trim().toLowerCase();
        // Match against all known therapy ids
        const validIds = [
          'vamana', 'virechana', 'basti', 'nasya', 'raktamokshana',
          'shirodhara', 'abhyanga', 'swedana', 'pizhichil', 'takradhara'
        ];
        const matched = validIds.find(id => normalized.includes(id));
        if (matched) {
          setSelectedTherapy(matched);
        }
      }
    } catch (err) {
      console.error('Error reading recommended therapy from localStorage:', err);
    } finally {
      try {
        localStorage.removeItem('ayursutra_recommended_therapy');
      } catch (_) { /* ignore */ }
    }
  }, []); // runs once on mount

  const loadRazorpay = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleBooking = async () => {
    setIsProcessing(true);
    const amountToPay = 500; // Flat fee
    const currentUser = getUser();

    if (paymentMethod === 'online') {
      const res = await loadRazorpay();
      if (!res) {
        alert("Razorpay SDK failed to load. Are you online?");
        setIsProcessing(false);
        return;
      }

      try {
        const orderResponse = await fetch('https://ayursutra-panchakarma-f8cg.onrender.com/api/payment/create-order', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ amount: amountToPay }),
        });
        const orderData = await orderResponse.json();

        if (orderData.mock) {
          alert("Notice: Using simulated payment because actual razorpay keys were not supplied. Simulating success...");
          await new Promise(resolve => setTimeout(resolve, 1500));
          finalizeBooking(currentUser, amountToPay, 'mock_txn_123');
        } else {
          const options = {
            key: orderData.key,
            amount: orderData.amount,
            currency: orderData.currency,
            name: "AyurSutra Panchakarma",
            description: "Appointment Booking",
            order_id: orderData.order_id,
            handler: function (response) {
              // Success callback
              finalizeBooking(currentUser, amountToPay, response.razorpay_payment_id);
            },
            prefill: {
              name: currentUser ? currentUser.name : 'Guest Patient',
              email: currentUser ? currentUser.email : 'guest@ayur.com',
            },
            theme: { color: "#4F7C5A" }
          };

          const rzp = new window.Razorpay(options);
          rzp.on('payment.failed', function (response){
            alert("Payment Failed: " + response.error.description);
            setIsProcessing(false);
          });
          rzp.open();
          // DO NOT finalize booking yet, wait for handler
        }
      } catch (err) {
        alert("Payment Error: " + err.message);
        setIsProcessing(false);
      }
    } else {
      // Cash payment
      finalizeBooking(currentUser, amountToPay, null);
    }
  };

  const finalizeBooking = (currentUser, amount, paymentId) => {
    const selectedTherapyData = therapies.find(t => t.id === selectedTherapy);
    const selectedTherapistData = therapists.find(t => t.id === selectedTherapist);
    const selectedDateData = availableDates.find(d => d.id === selectedDate);
    const selectedTimeData = availableTimes.find(t => t.id === selectedTime);

    const newApt = {
  patientName: currentUser ? currentUser.name : 'Guest Patient',
  patientId: Number(currentUser ? currentUser.id : 1),
  therapistId: Number(selectedTherapist),
  therapyType: selectedTherapyData.name,
  date: selectedDateData.date,
  time: selectedTimeData.time,
  status: 'confirmed',

  // Payment fields
  paymentStatus: paymentMethod === 'online' ? 'paid' : 'pending',
  paymentMethod: paymentMethod,
  amount: amount,
  razorpay_payment_id: paymentId
};

    addAppointment(newApt);
    setIsProcessing(false);
    
    if (paymentMethod === 'online') {
      alert('Payment Successful! Booking Confirmed and Bill generated. It has been sent to your email.');
    } else {
      alert('Booking Confirmed! Please pay cash at the clinic. Bill has been sent to your email.');
    }
    navigate('/');
  };

  const therapies = [
    {
      id: 'vamana',
      name: 'Vamana',
      subtitle: 'Emesis Therapy',
      description: 'Therapeutic vomiting to eliminate excess Kapha dosha from the respiratory and gastrointestinal tract.'
    },
    {
      id: 'virechana',
      name: 'Virechana',
      subtitle: 'Purgation Therapy',
      description: 'Controlled purgation to cleanse Pitta dosha and purify the liver, gallbladder, and intestines.'
    },
    {
      id: 'basti',
      name: 'Basti',
      subtitle: 'Enema Therapy',
      description: 'Medicated enema to balance Vata dosha, nourishing tissues and strengthening the colon.'
    },
    {
      id: 'nasya',
      name: 'Nasya',
      subtitle: 'Nasal Therapy',
      description: 'Herbal nasal administration to clear head and neck regions, improving sensory functions.'
    },
    {
      id: 'raktamokshana',
      name: 'Raktamokshana',
      subtitle: 'Blood Purification',
      description: 'Therapeutic bloodletting to purify blood, treat skin diseases, and restore circulatory balance.'
    },
    {
      id: 'shirodhara',
      name: 'Shirodhara',
      subtitle: 'Oil Pouring Therapy',
      description: 'Continuous pouring of warm herbal oil on the forehead to calm the nervous system, relieve stress, and promote mental clarity.'
    },
    {
      id: 'abhyanga',
      name: 'Abhyanga',
      subtitle: 'Full Body Oil Massage',
      description: 'A full-body warm herbal oil massage that nourishes tissues, improves circulation, and induces deep relaxation.'
    },
    {
      id: 'swedana',
      name: 'Swedana',
      subtitle: 'Herbal Steam Therapy',
      description: 'Herbal steam bath that opens pores, loosens toxins, relieves muscle stiffness, and enhances the effects of other treatments.'
    },
    {
      id: 'pizhichil',
      name: 'Pizhichil',
      subtitle: 'Oil Bath Therapy',
      description: 'Warm medicated oil poured over the body in a continuous stream to rejuvenate muscles, treat arthritis, and restore vitality.'
    },
    {
      id: 'takradhara',
      name: 'Takradhara',
      subtitle: 'Buttermilk Pouring Therapy',
      description: 'Continuous pouring of medicated buttermilk on the forehead to treat skin conditions, insomnia, and chronic headaches.'
    }
  ];



  const availableDates = [
    { id: 1, date: '2026-02-15', day: 'Sunday' },
    { id: 2, date: '2026-02-16', day: 'Monday' },
    { id: 3, date: '2026-02-17', day: 'Tuesday' },
    { id: 4, date: '2026-02-18', day: 'Wednesday' },
    { id: 5, date: '2026-02-19', day: 'Thursday' },
    { id: 6, date: '2026-02-20', day: 'Friday' },
    { id: 7, date: '2026-02-21', day: 'Saturday' }
  ];

  const availableTimes = [
    { id: 1, time: '09:00 AM' },
    { id: 2, time: '10:00 AM' },
    { id: 3, time: '11:00 AM' },
    { id: 4, time: '02:00 PM' },
    { id: 5, time: '03:00 PM' },
    { id: 6, time: '04:00 PM' }
  ];

  const steps = [
    { number: 1, label: 'Therapy' },
    { number: 2, label: 'Therapist' },
    { number: 3, label: 'Date & Time' },
    { number: 4, label: 'Payment & Confirm' }
  ];

  const handleNext = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const renderStepIndicator = () => (
    <div className="flex items-center justify-center mb-16">
      {steps.map((step, index) => (
        <div key={step.number} className="flex items-center">
          {/* Step Circle */}
          <div className="flex flex-col items-center">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-300 ${
                currentStep === step.number
                  ? 'bg-[#2F4F3E] text-white'
                  : currentStep > step.number
                  ? 'bg-[#4F7C5A] text-white'
                  : 'bg-gray-200 text-gray-500'
              }`}
            >
              {currentStep > step.number ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                step.number
              )}
            </div>
            <span className={`mt-2 text-xs font-medium ${
              currentStep >= step.number ? 'text-[#2F4F3E]' : 'text-gray-400'
            }`}>
              {step.label}
            </span>
          </div>
          
          {/* Connector Line */}
          {index < steps.length - 1 && (
            <div
              className={`w-20 h-0.5 mx-2 mb-6 transition-all duration-300 ${
                currentStep > step.number ? 'bg-[#4F7C5A]' : 'bg-gray-200'
              }`}
            />
          )}
        </div>
      ))}
    </div>
  );

  const renderTherapyStep = () => (
    <div>
      <h3 className="text-2xl font-display font-semibold text-[#2F4F3E] mb-8">
        Select Your Therapy
      </h3>
      
      <div className="grid grid-cols-2 gap-5">
        {therapies.map((therapy) => (
          <div
            key={therapy.id}
            onClick={() => setSelectedTherapy(therapy.id)}
            className={`p-5 rounded-2xl border-2 cursor-pointer transition-all duration-300 ${
              selectedTherapy === therapy.id
                ? 'border-[#4F7C5A] bg-[#F0F7F2]'
                : 'border-gray-100 bg-[#FAFAFA] hover:border-gray-200 hover:shadow-md'
            }`}
          >
            {/* Radio Button Indicator */}
            <div className="flex items-start mb-3">
              <div
                className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
                  selectedTherapy === therapy.id
                    ? 'border-[#4F7C5A] bg-[#4F7C5A]'
                    : 'border-gray-300'
                }`}
              >
                {selectedTherapy === therapy.id && (
                  <div className="w-2 h-2 rounded-full bg-white" />
                )}
              </div>
            </div>
            
            {/* Therapy Name */}
            <h4 className="text-lg font-semibold text-[#2F4F3E] mb-1">
              {therapy.name}
            </h4>
            
            {/* Subtitle */}
            <p className="text-sm text-[#4F7C5A] mb-2 font-medium">
              {therapy.subtitle}
            </p>
            
            {/* Description */}
            <p className="text-sm text-gray-500 leading-relaxed">
              {therapy.description}
            </p>
          </div>
        ))}
      </div>
      
      {/* Divider */}
      <div className="border-t border-gray-200 my-8" />
    </div>
  );

  const renderTherapistStep = () => (
    <div>
      <h3 className="text-2xl font-display font-semibold text-[#2F4F3E] mb-8">
        Select Your Therapist
      </h3>
      
      <div className="grid grid-cols-2 gap-5">
        {therapists.map((therapist) => (
          <div
            key={therapist.id}
            onClick={() => setSelectedTherapist(therapist.id)}
            className={`p-5 rounded-2xl border-2 cursor-pointer transition-all duration-300 ${
              selectedTherapist === therapist.id
                ? 'border-[#4F7C5A] bg-[#F0F7F2]'
                : 'border-gray-100 bg-[#FAFAFA] hover:border-gray-200 hover:shadow-md'
            }`}
          >
            {/* Radio Button Indicator */}
            <div className="flex items-start mb-3">
              <div
                className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
                  selectedTherapist === therapist.id
                    ? 'border-[#4F7C5A] bg-[#4F7C5A]'
                    : 'border-gray-300'
                }`}
              >
                {selectedTherapist === therapist.id && (
                  <div className="w-2 h-2 rounded-full bg-white" />
                )}
              </div>
            </div>
            
            {/* Therapist Name */}
            <h4 className="text-lg font-semibold text-[#2F4F3E] mb-1">
              {therapist.name}
            </h4>
            
            {/* Specialization */}
            <p className="text-sm text-[#4F7C5A] mb-2 font-medium">
              {therapist.specialization || 'Ayurvedic Specialist'}
            </p>
            
            {/* Experience */}
            <p className="text-sm text-gray-500">
              {therapist.experience || '10+ years'} experience
            </p>
          </div>
        ))}
      </div>
      
      {/* Divider */}
      <div className="border-t border-gray-200 my-8" />
    </div>
  );

  const renderDateTimeStep = () => (
    <div>
      <h3 className="text-2xl font-display font-semibold text-[#2F4F3E] mb-8">
        Select Date & Time
      </h3>
      
      {/* Date Selection */}
      <div className="mb-8">
        <h4 className="text-lg font-medium text-[#2F4F3E] mb-4">Choose Date</h4>
        <div className="grid grid-cols-4 gap-3">
          {availableDates.map((date) => (
            <div
              key={date.id}
              onClick={() => setSelectedDate(date.id)}
              className={`p-4 rounded-xl border-2 cursor-pointer text-center transition-all duration-300 ${
                selectedDate === date.id
                  ? 'border-[#4F7C5A] bg-[#F0F7F2]'
                  : 'border-gray-100 bg-[#FAFAFA] hover:border-gray-200'
              }`}
            >
              <p className={`text-sm font-medium mb-1 ${
                selectedDate === date.id ? 'text-[#4F7C5A]' : 'text-gray-500'
              }`}>
                {date.day}
              </p>
              <p className={`text-lg font-semibold ${
                selectedDate === date.id ? 'text-[#2F4F3E]' : 'text-[#2F4F3E]'
              }`}>
                {date.date.split('-')[1]}
              </p>
            </div>
          ))}
        </div>
      </div>
      
      {/* Time Selection */}
      <div className="mb-8">
        <h4 className="text-lg font-medium text-[#2F4F3E] mb-4">Choose Time</h4>
        <div className="grid grid-cols-3 gap-3">
          {availableTimes.map((time) => (
            <div
              key={time.id}
              onClick={() => setSelectedTime(time.id)}
              className={`p-4 rounded-xl border-2 cursor-pointer text-center transition-all duration-300 ${
                selectedTime === time.id
                  ? 'border-[#4F7C5A] bg-[#F0F7F2]'
                  : 'border-gray-100 bg-[#FAFAFA] hover:border-gray-200'
              }`}
            >
              <p className={`text-sm font-medium ${
                selectedTime === time.id ? 'text-[#4F7C5A]' : 'text-gray-600'
              }`}>
                {time.time}
              </p>
            </div>
          ))}
        </div>
      </div>
      
      {/* Divider */}
      <div className="border-t border-gray-200 my-8" />
    </div>
  );

  const renderConfirmStep = () => {
    const selectedTherapyData = therapies.find(t => t.id === selectedTherapy);
    const selectedTherapistData = therapists.find(t => t.id === selectedTherapist);
    const selectedDateData = availableDates.find(d => d.id === selectedDate);
    const selectedTimeData = availableTimes.find(t => t.id === selectedTime);

    return (
      <div>
        <h3 className="text-2xl font-display font-semibold text-[#2F4F3E] mb-8">
          Confirm & Pay
        </h3>
        
        <div className="bg-[#FAFAFA] rounded-2xl p-6 space-y-6 mb-8">
          <h4 className="font-semibold text-lg text-[#2F4F3E] mb-2">Booking Summary</h4>
          {/* Therapy Summary */}
          <div className="flex justify-between items-center pb-4 border-b border-gray-200">
            <span className="text-gray-500">Therapy</span>
            <span className="font-semibold text-[#2F4F3E]">{selectedTherapyData?.name}</span>
          </div>
          
          {/* Therapist Summary */}
          <div className="flex justify-between items-center pb-4 border-b border-gray-200">
            <span className="text-gray-500">Therapist</span>
            <span className="font-semibold text-[#2F4F3E]">{selectedTherapistData?.name}</span>
          </div>
          
          {/* Date Summary */}
          <div className="flex justify-between items-center pb-4 border-b border-gray-200">
            <span className="text-gray-500">Date</span>
            <span className="font-semibold text-[#2F4F3E]">{selectedDateData?.day}, {selectedDateData?.date}</span>
          </div>
          
          {/* Time Summary */}
          <div className="flex justify-between items-center pb-4 border-b border-gray-200">
            <span className="text-gray-500">Time</span>
            <span className="font-semibold text-[#2F4F3E]">{selectedTimeData?.time}</span>
          </div>

          {/* Amount Summary */}
          <div className="flex justify-between items-center text-xl">
            <span className="font-semibold text-[#2F4F3E]">Total Amount</span>
            <span className="font-bold text-[#4F7C5A]">₹500</span>
          </div>
        </div>

        {/* Payment Selection */}
        <div>
          <h4 className="text-lg font-medium text-[#2F4F3E] mb-4">Select Payment Method</h4>
          <div className="grid grid-cols-2 gap-4">
            <div
              onClick={() => setPaymentMethod('cash')}
              className={`p-5 rounded-2xl border-2 cursor-pointer transition-all duration-300 flex items-center justify-between ${
                paymentMethod === 'cash'
                  ? 'border-[#4F7C5A] bg-[#F0F7F2]'
                  : 'border-gray-100 bg-[#FAFAFA] hover:border-gray-200'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${paymentMethod === 'cash' ? 'border-[#4F7C5A] bg-[#4F7C5A]' : 'border-gray-300'}`}>
                  {paymentMethod === 'cash' && <div className="w-2 h-2 rounded-full bg-white" />}
                </div>
                <span className="font-semibold text-[#2F4F3E] text-lg">Cash on Visit</span>
              </div>
            </div>

            <div
              onClick={() => setPaymentMethod('online')}
              className={`p-5 rounded-2xl border-2 cursor-pointer transition-all duration-300 flex items-center justify-between ${
                paymentMethod === 'online'
                  ? 'border-[#4F7C5A] bg-[#F0F7F2]'
                  : 'border-gray-100 bg-[#FAFAFA] hover:border-gray-200'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${paymentMethod === 'online' ? 'border-[#4F7C5A] bg-[#4F7C5A]' : 'border-gray-300'}`}>
                  {paymentMethod === 'online' && <div className="w-2 h-2 rounded-full bg-white" />}
                </div>
                <span className="font-semibold text-[#2F4F3E] text-lg">Pay Online Now</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Divider */}
        <div className="border-t border-gray-200 my-8" />
      </div>
    );
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return renderTherapyStep();
      case 2:
        return renderTherapistStep();
      case 3:
        return renderDateTimeStep();
      case 4:
        return renderConfirmStep();
      default:
        return renderTherapyStep();
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return selectedTherapy !== null;
      case 2:
        return selectedTherapist !== null;
      case 3:
        return selectedDate !== null && selectedTime !== null;
      case 4:
        return true;
      default:
        return false;
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F1EA] py-16 px-4">
      {/* Page Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-display font-bold text-[#2F4F3E] mb-4">
          Book Your Appointment
        </h1>
        <p className="text-gray-500 text-lg">
          Schedule your Panchakarma therapy session in just a few steps
        </p>
      </div>

      {/* Step Progress Indicator */}
      {renderStepIndicator()}

      {/* Main Booking Card */}
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-[20px] shadow-lg p-10">
          {/* Current Step Content */}
          {renderCurrentStep()}

          {/* Navigation Buttons */}
          <div className="flex justify-between items-center mt-4">
            {/* Back Button */}
            {currentStep > 1 ? (
              <button
                onClick={handleBack}
                className="px-6 py-3 rounded-full text-[#2F4F3E] font-medium border-2 border-[#2F4F3E] hover:bg-[#2F4F3E] hover:text-white transition-all duration-300"
              >
                ← Back
              </button>
            ) : (
              <div />
            )}

            {/* Next Button */}
            {currentStep < 4 ? (
              <button
                onClick={handleNext}
                disabled={!canProceed()}
                className={`px-8 py-3 rounded-full font-medium flex items-center gap-2 transition-all duration-300 ${
                  canProceed()
                    ? 'bg-[#4F7C5A] text-white hover:bg-[#3D6B4A] hover:shadow-lg hover:-translate-y-0.5'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                Next
                <ChevronRight className="w-5 h-5" />
              </button>
            ) : (
              <button
                onClick={handleBooking}
                disabled={isProcessing}
                className={`px-8 py-3 rounded-full font-medium transition-all duration-300 ${
                  isProcessing 
                    ? 'bg-gray-400 text-white cursor-wait' 
                    : 'bg-[#4F7C5A] text-white hover:bg-[#3D6B4A] hover:shadow-lg hover:-translate-y-0.5'
                }`}
              >
                {isProcessing ? 'Processing Payment...' : (paymentMethod === 'online' ? 'Pay & Confirm' : 'Confirm Booking')}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Responsive */}
      <style>{`
        @media (max-width: 768px) {
          .grid-cols-2 {
            grid-template-columns: 1fr !important;
          }
          .grid-cols-4 {
            grid-template-columns: repeat(2, 1fr) !important;
          }
          .grid-cols-3 {
            grid-template-columns: repeat(2, 1fr) !important;
          }
          .max-w-4xl {
            width: 95% !important;
          }
          .p-10 {
            padding: 24px !important;
          }
        }
      `}</style>
    </div>
  );
};

export default AppointmentBooking;
