// import { useState } from 'react';
// import Card from '../shared/Card';
// import Modal from '../shared/Modal';
// import { useToast } from '../shared/ToastProvider';
// import { therapists } from '../../data/mockData';
// import { Users, Award, Clock, Edit } from 'lucide-react';

// const PractitionerTherapists = () => {
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [selectedTherapist, setSelectedTherapist] = useState(null);
//   const { showToast } = useToast();

//   const openModal = (therapist) => {
//     setSelectedTherapist(therapist);
//     setIsModalOpen(true);
//   };

//   const handleUpdateAvailability = () => {
//     showToast('Therapist availability updated', 'success');
//     setIsModalOpen(false);
//   };

//   return (
//     <div className="space-y-6">
//       <div>
//         <h1 className="text-3xl font-bold text-ayur-dark dark:text-white mb-2">Manage Therapists</h1>
//         <p className="text-gray-600 dark:text-gray-400">View and manage therapist information</p>
//       </div>

//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//         {therapists.map(therapist => (
//           <Card key={therapist.id}>
//             <div className="text-center mb-4">
//               <div className="text-5xl mb-3">{therapist.image}</div>
//               <h3 className="text-xl font-semibold text-ayur-dark dark:text-white">{therapist.name}</h3>
//               <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium mt-2 ${
//                 therapist.available ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
//               }`}>
//                 {therapist.available ? 'Available' : 'Unavailable'}
//               </span>
//             </div>

//             <div className="space-y-3 mb-4">
//               <div className="flex items-center gap-2 text-sm">
//                 <Award className="w-4 h-4 text-ayur-primary" />
//                 <span className="text-gray-700 dark:text-gray-300">{therapist.specialization}</span>
//               </div>
//               <div className="flex items-center gap-2 text-sm">
//                 <Clock className="w-4 h-4 text-ayur-primary" />
//                 <span className="text-gray-700 dark:text-gray-300">{therapist.experience}</span>
//               </div>
//             </div>

//             <button
//               onClick={() => openModal(therapist)}
//               className="btn-primary w-full flex items-center justify-center gap-2"
//             >
//               <Edit className="w-4 h-4" />
//               Manage Schedule
//             </button>
//           </Card>
//         ))}
//       </div>

//       <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Manage Therapist Schedule">
//         {selectedTherapist && (
//           <div className="space-y-4">
//             <div className="text-center mb-4">
//               <div className="text-4xl mb-2">{selectedTherapist.image}</div>
//               <h3 className="text-xl font-semibold text-ayur-dark dark:text-white">{selectedTherapist.name}</h3>
//             </div>

//             <div>
//               <label className="block text-sm font-medium mb-2">Availability Status</label>
//               <select className="input-field">
//                 <option value="available">Available</option>
//                 <option value="unavailable">Unavailable</option>
//               </select>
//             </div>

//             <div>
//               <label className="block text-sm font-medium mb-2">Working Hours</label>
//               <div className="grid grid-cols-2 gap-4">
//                 <input type="time" className="input-field" defaultValue="09:00" />
//                 <input type="time" className="input-field" defaultValue="17:00" />
//               </div>
//             </div>

//             <div>
//               <label className="block text-sm font-medium mb-2">Notes</label>
//               <textarea className="input-field min-h-[100px]" placeholder="Add notes about therapist schedule..."></textarea>
//             </div>

//             <button onClick={handleUpdateAvailability} className="btn-primary w-full">
//               Update Schedule
//             </button>
//           </div>
//         )}
//       </Modal>
//     </div>
//   );
// };

// export default PractitionerTherapists;


import { useState, useEffect } from 'react';
import Card from '../shared/Card';
import Modal from '../shared/Modal';
import { useToast } from '../shared/ToastProvider';
import { Users, Award, Clock, Edit } from 'lucide-react';

const PractitionerTherapists = () => {
  const [therapists, setTherapists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTherapist, setSelectedTherapist] = useState(null);
  const { showToast } = useToast();

  // ✅ FETCH FROM BACKEND
  useEffect(() => {
    loadTherapists();
  }, []);

  const loadTherapists = async () => {
    try {
      setLoading(true);

      const res = await fetch("https://ayursutra-panchakarma-f8cg.onrender.com/api/therapists");
      const data = await res.json();

      console.log("THERAPISTS:", data);

      setTherapists(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error loading therapists:", err);
    } finally {
      setLoading(false);
    }
  };

  const openModal = (therapist) => {
    setSelectedTherapist(therapist);
    setIsModalOpen(true);
  };

  const handleUpdateAvailability = () => {
    showToast('Therapist availability updated', 'success');
    setIsModalOpen(false);
  };

  // ✅ LOADING STATE
  if (loading) {
    return <div className="p-6">Loading therapists...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-ayur-dark dark:text-white mb-2">
          Manage Therapists
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          View and manage therapist information
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {therapists.map((therapist) => (
          <Card key={therapist.id}>
            <div className="text-center mb-4">
              {/* ✅ SAFE IMAGE */}
              <div className="text-5xl mb-3">
                {therapist.image || "👨‍⚕️"}
              </div>

              <h3 className="text-xl font-semibold text-ayur-dark dark:text-white">
                {therapist.name || therapist.fullName}
              </h3>

              {/* ✅ SAFE STATUS */}
              <span className="inline-block px-3 py-1 rounded-full text-xs font-medium mt-2 bg-green-100 text-green-800">
                Available
              </span>
            </div>

            <div className="space-y-3 mb-4">
              <div className="flex items-center gap-2 text-sm">
                <Award className="w-4 h-4 text-ayur-primary" />
                <span className="text-gray-700 dark:text-gray-300">
                  {therapist.specialization || therapist.therapyType || "Therapy"}
                </span>
              </div>

              <div className="flex items-center gap-2 text-sm">
                <Clock className="w-4 h-4 text-ayur-primary" />
                <span className="text-gray-700 dark:text-gray-300">
                  {therapist.experience || "Experience not set"}
                </span>
              </div>
            </div>

            <button
              onClick={() => openModal(therapist)}
              className="btn-primary w-full flex items-center justify-center gap-2"
            >
              <Edit className="w-4 h-4" />
              Manage Schedule
            </button>
          </Card>
        ))}
      </div>

      {/* ✅ MODAL */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Manage Therapist Schedule"
      >
        {selectedTherapist && (
          <div className="space-y-4">
            <div className="text-center mb-4">
              <div className="text-4xl mb-2">
                {selectedTherapist.image || "👨‍⚕️"}
              </div>
              <h3 className="text-xl font-semibold text-ayur-dark dark:text-white">
                {selectedTherapist.name || selectedTherapist.fullName}
              </h3>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Availability Status
              </label>
              <select className="input-field">
                <option value="available">Available</option>
                <option value="unavailable">Unavailable</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Working Hours
              </label>
              <div className="grid grid-cols-2 gap-4">
                <input type="time" className="input-field" defaultValue="09:00" />
                <input type="time" className="input-field" defaultValue="17:00" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Notes</label>
              <textarea
                className="input-field min-h-[100px]"
                placeholder="Add notes about therapist schedule..."
              ></textarea>
            </div>

            <button
              onClick={handleUpdateAvailability}
              className="btn-primary w-full"
            >
              Update Schedule
            </button>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default PractitionerTherapists;