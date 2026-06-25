// Mock data for AyurSutra Panchakarma

export const users = [
  { id: 1, email: 'patient@ayur.com', password: 'patient123', role: 'patient', name: 'Rajesh Kumar' },
  { id: 2, email: 'therapist@ayur.com', password: 'therapist123', role: 'therapist', name: 'Dr. Priya Sharma' },
  { id: 3, email: 'practitioner@ayur.com', password: 'practitioner123', role: 'practitioner', name: 'Dr. Anil Verma' }
];

export const therapists = [
  { id: 2, name: 'Dr. Priya Sharma', specialization: 'Vamana & Virechana', experience: '8 years', available: true, image: '👩‍⚕️' },
  { id: 4, name: 'Dr. Suresh Patel', specialization: 'Basti & Nasya', experience: '12 years', available: true, image: '👨‍⚕️' },
  { id: 5, name: 'Dr. Meera Iyer', specialization: 'Raktamokshana', experience: '6 years', available: false, image: '👩‍⚕️' }
];

export const timeSlots = [
  '09:00 AM', '10:00 AM', '11:00 AM', '02:00 PM', '03:00 PM', '04:00 PM'
];

export const therapyTypes = [
  { id: 1, name: 'Vamana', description: 'Therapeutic emesis for Kapha disorders', duration: '7 days' },
  { id: 2, name: 'Virechana', description: 'Therapeutic purgation for Pitta disorders', duration: '5 days' },
  { id: 3, name: 'Basti', description: 'Medicated enema for Vata disorders', duration: '8 days' },
  { id: 4, name: 'Nasya', description: 'Nasal administration of medicines', duration: '7 days' },
  { id: 5, name: 'Raktamokshana', description: 'Bloodletting therapy', duration: '3 days' },
  {
    id: 6,
    name: 'Shirodhara',
    duration: '7 days'
  }
];

export const dietPlans = [
  {
    id: 1,
    name: 'Pre-Panchakarma Diet',
    description: 'Light, easily digestible foods',
    meals: [
      { time: 'Breakfast', items: ['Warm water with honey', 'Rice porridge', 'Herbal tea'] },
      { time: 'Lunch', items: ['Khichdi', 'Steamed vegetables', 'Buttermilk'] },
      { time: 'Dinner', items: ['Vegetable soup', 'Light rice', 'Warm milk'] }
    ]
  },
  {
    id: 2,
    name: 'During Therapy Diet',
    description: 'Strict dietary regimen',
    meals: [
      { time: 'Breakfast', items: ['Herbal tea', 'Light porridge'] },
      { time: 'Lunch', items: ['Moong dal khichdi', 'Ghee'] },
      { time: 'Dinner', items: ['Vegetable broth', 'Herbal infusion'] }
    ]
  },
  {
    id: 3,
    name: 'Post-Panchakarma Diet',
    description: 'Gradual return to normal diet',
    meals: [
      { time: 'Breakfast', items: ['Oatmeal', 'Fresh fruits', 'Herbal tea'] },
      { time: 'Lunch', items: ['Rice', 'Dal', 'Cooked vegetables', 'Curd'] },
      { time: 'Dinner', items: ['Chapati', 'Vegetable curry', 'Warm milk'] }
    ]
  }
];

export const panchakarmaGuide = {
  introduction: {
    title: 'What is Panchakarma?',
    content: 'Panchakarma is a comprehensive Ayurvedic detoxification and rejuvenation therapy. It consists of five therapeutic procedures designed to cleanse the body of toxins and restore balance to the doshas (Vata, Pitta, Kapha).'
  },
  stages: [
    {
      name: 'Purvakarma (Preparation)',
      description: 'Preparatory procedures including Snehana (oleation) and Swedana (sudation)',
      duration: '3-7 days'
    },
    {
      name: 'Pradhanakarma (Main Therapy)',
      description: 'Five main cleansing procedures: Vamana, Virechana, Basti, Nasya, Raktamokshana',
      duration: '5-15 days'
    },
    {
      name: 'Paschatkarma (Post-therapy)',
      description: 'Rejuvenation and dietary regimen to restore strength',
      duration: '7-14 days'
    }
  ],
  benefits: [
    'Eliminates toxins from the body',
    'Strengthens immune system',
    'Balances doshas',
    'Improves digestion and metabolism',
    'Enhances mental clarity',
    'Promotes longevity and vitality',
    'Reduces stress and anxiety',
    'Improves skin health'
  ],
  preTherapyCare: [
    'Avoid heavy, oily, and spicy foods',
    'Maintain regular sleep schedule',
    'Stay hydrated',
    'Avoid strenuous exercise',
    'Practice meditation and yoga',
    'Inform about any medications'
  ],
  postTherapyCare: [
    'Follow prescribed diet strictly',
    'Avoid cold water and foods',
    'Rest adequately',
    'Avoid sexual activity for specified period',
    'Protect from cold wind and rain',
    'Continue herbal supplements as prescribed',
    'Gradual return to normal activities'
  ]
};

export const initialAppointments = [
  {
    id: 1,
    patientId: 1,
    patientName: 'Rajesh Kumar',
    therapistId: 1,
    therapistName: 'Dr. Priya Sharma',
    therapyType: 'Vamana',
    date: '2024-02-15',
    time: '10:00 AM',
    status: 'confirmed',
    notes: ''
  }
];

export const progressData = {
  labels: ['Day 1', 'Day 3', 'Day 5', 'Day 7', 'Day 10', 'Day 14'],
  datasets: [
    {
      label: 'Therapy Progress',
      data: [20, 35, 50, 65, 80, 95],
      borderColor: '#4A7C59',
      backgroundColor: 'rgba(74, 124, 89, 0.1)',
      tension: 0.4
    }
  ]
};
