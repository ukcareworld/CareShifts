import React, { useState, useEffect } from 'react';
import { CareHomeDashboard } from './views/CareHomeDashboard';
import { WorkerDashboard } from './views/WorkerDashboard';
import { CareHomeRegistration } from './views/CareHomeRegistration';
import { WorkerRegistration } from './views/WorkerRegistration';
import { SuperAdminDashboard } from './views/SuperAdminDashboard';
import { UserRole, AppState, ShiftStatus, Shift, User, WorkerProfile } from './types';
import { Users, Building2, UserPlus, ShieldCheck } from 'lucide-react';

// --- MOCK DATA ---
const MOCK_CARE_HOME: User = {
  id: 'ch_1',
  name: 'Sunrise Senior Living',
  role: UserRole.CARE_HOME,
  avatar: 'https://picsum.photos/200/200?random=1',
  location: 'Manchester, UK',
  rating: 4.8,
  totalRatings: 124,
  careType: 'Residential & Nursing',
  hasParking: true,
  description: 'A warm and welcoming community providing high-quality residential and nursing care for older people. We pride ourselves on our person-centered approach.',
  approved: true,
  contactPerson: 'Alice Thompson',
  phoneNumber: '0161 123 4567',
  mobileNumber: '07700 987654',
  city: 'Manchester',
  postCode: 'M1 4BT'
};

const MOCK_WORKERS: WorkerProfile[] = [
  {
    id: 'w_1',
    name: 'Sarah Jenkins',
    role: UserRole.WORKER,
    avatar: 'https://picsum.photos/200/200?random=2',
    location: 'Manchester, UK',
    city: 'Manchester',
    address: '42 Oxford Road',
    postCode: 'M14 5AB',
    rating: 4.9,
    totalRatings: 45,
    hourlyRate: 22,
    approved: true,
    bio: 'Certified nursing assistant with 5 years experience in dementia care. Friendly, patient, and reliable.',
    documents: [
      { name: 'DBS Certificate', verified: true, type: 'DBS' },
      { name: 'Nursing Degree', verified: true, type: 'CERTIFICATE' },
      { name: 'Passport', verified: true, type: 'ID' }
    ],
    skills: ['Dementia Care', 'Medication Admin', 'Night Shift'],
    shiftsCompleted: 142
  },
  {
    id: 'w_2',
    name: 'David Okafor',
    role: UserRole.WORKER,
    avatar: 'https://picsum.photos/200/200?random=3',
    location: 'Manchester, UK',
    city: 'Manchester',
    address: '15 Wilmslow Park',
    postCode: 'M20 2CD',
    rating: 4.5,
    totalRatings: 12,
    hourlyRate: 19,
    approved: true,
    bio: 'Hardworking care assistant. Available for night shifts and weekends. Recent graduate.',
    documents: [
      { name: 'DBS Certificate', verified: true, type: 'DBS' },
      { name: 'Driving License', verified: false, type: 'ID' }
    ],
    skills: ['Mobility Support', 'Personal Care'],
    shiftsCompleted: 34
  },
  {
    id: 'w_3',
    name: 'Maria Gonzalez',
    role: UserRole.WORKER,
    avatar: 'https://picsum.photos/200/200?random=4',
    location: 'Bolton, UK',
    city: 'Bolton',
    address: '78 Chorley New Road',
    postCode: 'BL1 4TH',
    rating: 4.7,
    totalRatings: 89,
    hourlyRate: 25,
    approved: true,
    bio: 'Senior carer with extensive experience in palliative care. Compassionate and detail-oriented.',
    documents: [
      { name: 'DBS Enhanced', verified: true, type: 'DBS' },
      { name: 'NVQ Level 3', verified: true, type: 'CERTIFICATE' }
    ],
    skills: ['Palliative Care', 'Team Leadership', 'First Aid'],
    shiftsCompleted: 215
  }
];

const INITIAL_SHIFTS: Shift[] = [
  {
    id: 's_1',
    careHomeId: 'ch_1',
    careHomeName: 'Sunrise Senior Living',
    title: 'Weekend Night Shift',
    description: 'Looking for a reliable carer to cover a night shift this Saturday. Must have experience with mobility aids.',
    date: '2023-11-25',
    startTime: '20:00',
    durationHours: 12,
    hourlyRate: 24,
    status: ShiftStatus.OPEN,
    location: 'Manchester, UK'
  }
];

// --- MAIN APP COMPONENT ---
export default function App() {
  const [view, setView] = useState<'LANDING' | 'HOME_DASH' | 'WORKER_DASH' | 'REGISTER_HOME' | 'REGISTER_WORKER' | 'ADMIN_DASH'>('LANDING');
  
  // App State
  const [shifts, setShifts] = useState<Shift[]>(INITIAL_SHIFTS);
  const [activeWorkerId, setActiveWorkerId] = useState<string>('w_1'); // Default to Sarah for demo
  const [workers, setWorkers] = useState<WorkerProfile[]>(MOCK_WORKERS);
  
  // Maintain a list of all care homes
  const [careHomes, setCareHomes] = useState<User[]>([MOCK_CARE_HOME]);
  // The currently logged in care home (for the dashboard view)
  const [currentCareHome, setCurrentCareHome] = useState<User>(MOCK_CARE_HOME);
  
  // ACTIONS
  const createShift = (shiftData: Omit<Shift, 'id' | 'status' | 'careHomeId' | 'careHomeName'>) => {
    const newShift: Shift = {
      ...shiftData,
      id: `s_${Date.now()}`,
      careHomeId: currentCareHome.id,
      careHomeName: currentCareHome.name,
      status: ShiftStatus.OPEN
    };
    setShifts(prev => [newShift, ...prev]);
  };

  const bookWorker = (shiftId: string, workerId: string) => {
    setShifts(prev => prev.map(s => 
      s.id === shiftId 
        ? { ...s, workerId, status: ShiftStatus.PENDING_ACCEPTANCE } 
        : s
    ));
    // Simulate notification
    alert(`Request sent to worker!`);
  };

  const updateShiftStatus = (shiftId: string, status: ShiftStatus) => {
    setShifts(prev => prev.map(s => 
      s.id === shiftId ? { ...s, status } : s
    ));
  };

  const approveShift = (shiftId: string, rating: number, comment?: string) => {
    setShifts(prev => prev.map(s => 
      s.id === shiftId 
        ? { 
            ...s, 
            status: ShiftStatus.CLOSED, 
            feedback: { 
              ...s.feedback, 
              homeToWorker: rating,
              homeToWorkerComment: comment
            } 
          } 
        : s
    ));
    
    // Update worker rating and increment shifts completed
    const shift = shifts.find(s => s.id === shiftId);
    if(shift?.workerId) {
        setWorkers(prev => prev.map(w => {
            if (w.id === shift.workerId) {
                const newTotal = w.totalRatings + 1;
                const newRating = ((w.rating * w.totalRatings) + rating) / newTotal;
                const newShiftsCompleted = (w.shiftsCompleted || 0) + 1;
                
                return { 
                  ...w, 
                  rating: newRating, 
                  totalRatings: newTotal,
                  shiftsCompleted: newShiftsCompleted
                };
            }
            return w;
        }));
    }
    alert('Shift approved and payment released!');
  };

  const rateShift = (shiftId: string, rating: number) => {
    setShifts(prev => prev.map(s => 
      s.id === shiftId 
        ? { 
            ...s, 
            feedback: { ...s.feedback, workerToHome: rating } 
          } 
        : s
    ));
  };

  const updateWorkerProfile = (updates: Partial<WorkerProfile>) => {
    setWorkers(prev => prev.map(w => 
      w.id === activeWorkerId ? { ...w, ...updates } : w
    ));
  };

  const updateCareHomeProfile = (updates: Partial<User>) => {
    setCurrentCareHome(prev => ({ ...prev, ...updates }));
    setCareHomes(prev => prev.map(ch => ch.id === currentCareHome.id ? { ...ch, ...updates } : ch));
  };

  const handleRegisterCareHome = (newUser: User) => {
    // New users are not approved by default
    const userWithAuth = { ...newUser, approved: false };
    setCareHomes(prev => [...prev, userWithAuth]);
    alert("Registration successful! Your account is pending Super Admin approval.");
    setView('LANDING');
  };

  const handleRegisterWorker = (newWorker: WorkerProfile) => {
    // New workers are not approved by default
    const workerWithAuth = { ...newWorker, approved: false };
    setWorkers(prev => [...prev, workerWithAuth]);
    alert("Registration successful! Your account is pending Super Admin approval.");
    setView('LANDING');
  };

  // ADMIN ACTIONS
  const handleAdminApprove = (id: string, type: UserRole) => {
    if (type === UserRole.CARE_HOME) {
      setCareHomes(prev => prev.map(ch => ch.id === id ? { ...ch, approved: true } : ch));
    } else if (type === UserRole.WORKER) {
      setWorkers(prev => prev.map(w => w.id === id ? { ...w, approved: true } : w));
    }
  };

  const handleAdminReject = (id: string, type: UserRole) => {
    if (confirm("Are you sure you want to reject and delete this application?")) {
      if (type === UserRole.CARE_HOME) {
        setCareHomes(prev => prev.filter(ch => ch.id !== id));
      } else if (type === UserRole.WORKER) {
        setWorkers(prev => prev.filter(w => w.id !== id));
      }
    }
  };

  // --- RENDER ---

  if (view === 'LANDING') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-teal-500 to-blue-600 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-lg w-full text-center relative">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">CareShifts</h1>
          <p className="text-gray-500 mb-10">The marketplace for quality care shifts.</p>
          
          <div className="grid grid-cols-1 gap-4">
            <button 
              onClick={() => {
                setCurrentCareHome(MOCK_CARE_HOME); // Reset to mock user on login
                setView('HOME_DASH');
              }}
              className="group p-6 border-2 border-gray-100 rounded-xl hover:border-teal-500 hover:bg-teal-50 transition flex items-center text-left"
            >
              <div className="bg-teal-100 p-3 rounded-full mr-4 group-hover:bg-teal-200">
                <Building2 className="text-teal-700" size={24} />
              </div>
              <div>
                <h3 className="font-bold text-lg text-gray-800">I am a Care Home</h3>
                <p className="text-sm text-gray-500">Post shifts, find workers, manage roster.</p>
              </div>
            </button>

            <button 
              onClick={() => setView('WORKER_DASH')}
              className="group p-6 border-2 border-gray-100 rounded-xl hover:border-blue-500 hover:bg-blue-50 transition flex items-center text-left"
            >
              <div className="bg-blue-100 p-3 rounded-full mr-4 group-hover:bg-blue-200">
                <Users className="text-blue-700" size={24} />
              </div>
              <div>
                <h3 className="font-bold text-lg text-gray-800">I am a Care Worker</h3>
                <p className="text-sm text-gray-500">Find shifts, get paid, manage profile.</p>
              </div>
            </button>
            
            <div className="mt-6 flex flex-col gap-2">
              <button 
                onClick={() => setView('REGISTER_HOME')}
                className="text-teal-600 font-medium text-sm hover:underline flex items-center justify-center gap-2"
              >
                <UserPlus size={16} /> New Care Home? Register here
              </button>
              <button 
                onClick={() => setView('REGISTER_WORKER')}
                className="text-blue-600 font-medium text-sm hover:underline flex items-center justify-center gap-2"
              >
                <UserPlus size={16} /> New Worker? Register here
              </button>
            </div>
          </div>
          
          <div className="mt-12 pt-4 border-t border-gray-100">
             <button 
               onClick={() => setView('ADMIN_DASH')}
               className="text-xs text-gray-400 hover:text-gray-600 flex items-center justify-center w-full gap-1"
             >
               <ShieldCheck size={12} /> Admin Login
             </button>
             <p className="mt-2 text-xs text-gray-400">Demo Application v1.1.0</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar simulation to switch roles for demo purposes (hidden in Admin view for immersion) */}
      {view !== 'ADMIN_DASH' && (
        <div className="bg-gray-900 text-white p-2 text-xs flex justify-between px-4">
          <span>CareShifts Demo Environment</span>
          <button onClick={() => setView('LANDING')} className="hover:text-teal-400">Switch User Role</button>
        </div>
      )}

      {view === 'HOME_DASH' && (
        <CareHomeDashboard 
          user={currentCareHome}
          shifts={shifts}
          availableWorkers={workers.filter(w => w.approved)} // Only show approved workers
          onCreateShift={createShift}
          onBookWorker={bookWorker}
          onApproveShift={approveShift}
          onUpdateProfile={updateCareHomeProfile}
        />
      )}

      {view === 'WORKER_DASH' && (
        <WorkerDashboard 
          worker={workers.find(w => w.id === activeWorkerId)!}
          shifts={shifts}
          careHomes={careHomes}
          onUpdateShiftStatus={updateShiftStatus}
          onRateShift={rateShift}
          onUpdateProfile={updateWorkerProfile}
        />
      )}

      {view === 'REGISTER_HOME' && (
        <CareHomeRegistration 
          onRegister={handleRegisterCareHome}
          onBack={() => setView('LANDING')}
        />
      )}

      {view === 'REGISTER_WORKER' && (
        <WorkerRegistration 
          onRegister={handleRegisterWorker}
          onBack={() => setView('LANDING')}
        />
      )}

      {view === 'ADMIN_DASH' && (
        <SuperAdminDashboard 
          careHomes={careHomes}
          workers={workers}
          onApprove={handleAdminApprove}
          onReject={handleAdminReject}
          onLogout={() => setView('LANDING')}
        />
      )}
    </div>
  );
}