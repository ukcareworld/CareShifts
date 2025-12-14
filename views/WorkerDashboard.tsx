import React, { useState, useEffect } from 'react';
import { WorkerProfile, Shift, ShiftStatus, User } from '../types';
import { StarRating } from '../components/StarRating';
import { MapPin, Calendar, Clock, DollarSign, FileText, CheckCircle, XCircle, Play, Square, Lock, Archive, Info, Car, Activity, X, Save, User as UserIcon, Mail, Smartphone, Globe, Briefcase } from 'lucide-react';

interface WorkerDashboardProps {
  worker: WorkerProfile;
  shifts: Shift[];
  careHomes: User[];
  onUpdateShiftStatus: (shiftId: string, status: ShiftStatus) => void;
  onRateShift: (shiftId: string, rating: number) => void;
  onUpdateProfile: (updatedProfile: Partial<WorkerProfile>) => void;
}

interface ShiftCardProps {
  shift: Shift;
  careHome?: User;
  onUpdateShiftStatus: (shiftId: string, status: ShiftStatus) => void;
  onRateShift: (shiftId: string, rating: number) => void;
}

const CareHomeProfileModal: React.FC<{ careHome: User; onClose: () => void }> = ({ careHome, onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden relative animate-in zoom-in-95 duration-200">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-1 bg-gray-100 hover:bg-gray-200 rounded-full transition"
        >
          <X size={20} className="text-gray-500" />
        </button>

        <div className="h-24 bg-teal-600"></div>
        <div className="px-6 pb-6 -mt-12 relative">
           <img 
             src={careHome.avatar} 
             alt={careHome.name} 
             className="w-24 h-24 rounded-xl border-4 border-white shadow-md object-cover bg-white"
           />
           
           <div className="mt-4">
             <h2 className="text-2xl font-bold text-gray-900">{careHome.name}</h2>
             <div className="flex items-center text-gray-600 mt-1 mb-4">
                <MapPin size={16} className="mr-1" />
                <span className="text-sm">{careHome.location}</span>
             </div>
             
             <div className="flex items-center gap-2 mb-6">
                <div className="flex items-center bg-yellow-50 px-3 py-1 rounded-full border border-yellow-100">
                  <StarRating rating={careHome.rating} size={14} />
                  <span className="ml-2 text-xs font-bold text-yellow-700">{careHome.rating.toFixed(1)} ({careHome.totalRatings})</span>
                </div>
             </div>

             <div className="space-y-4">
               {careHome.careType && (
                 <div className="flex items-start">
                    <Activity className="text-teal-600 mt-0.5 mr-3" size={18} />
                    <div>
                      <h4 className="text-sm font-semibold text-gray-900">Care Type</h4>
                      <p className="text-sm text-gray-600">{careHome.careType}</p>
                    </div>
                 </div>
               )}

               {careHome.hasParking !== undefined && (
                 <div className="flex items-start">
                    <Car className="text-teal-600 mt-0.5 mr-3" size={18} />
                    <div>
                      <h4 className="text-sm font-semibold text-gray-900">Parking</h4>
                      <p className="text-sm text-gray-600">
                        {careHome.hasParking ? 'Available on-site' : 'Street parking only / Not available'}
                      </p>
                    </div>
                 </div>
               )}

               {careHome.description && (
                 <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 mt-2">
                   <h4 className="text-xs font-bold text-gray-500 uppercase mb-2">About Us</h4>
                   <p className="text-sm text-gray-700 leading-relaxed">{careHome.description}</p>
                 </div>
               )}
             </div>
           </div>
        </div>
        
        <div className="p-4 border-t border-gray-100 bg-gray-50 flex justify-end">
           <button onClick={onClose} className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 transition">
             Close Profile
           </button>
        </div>
      </div>
    </div>
  );
};

const ShiftCard: React.FC<ShiftCardProps> = ({ shift, careHome, onUpdateShiftStatus, onRateShift }) => {
  const isPending = shift.status === ShiftStatus.PENDING_ACCEPTANCE;
  const isBooked = shift.status === ShiftStatus.BOOKED;
  const isInProgress = shift.status === ShiftStatus.IN_PROGRESS;
  const isCompleted = shift.status === ShiftStatus.CLOSED;
  const isWaitingApproval = shift.status === ShiftStatus.COMPLETED_PENDING_APPROVAL;

  const [canStart, setCanStart] = useState(false);
  const [timeMessage, setTimeMessage] = useState('');
  const [showProfile, setShowProfile] = useState(false);

  useEffect(() => {
    if (isBooked) {
      const checkTime = () => {
        const now = new Date();
        const shiftStart = new Date(`${shift.date}T${shift.startTime}`);
        
        // Calculate difference in minutes
        const diffMs = shiftStart.getTime() - now.getTime();
        const diffMins = Math.ceil(diffMs / (1000 * 60));

        if (diffMins <= 15) {
          setCanStart(true);
          setTimeMessage('');
        } else {
          setCanStart(false);
          if (diffMins > 60) {
             const hours = Math.ceil(diffMins / 60);
             setTimeMessage(`Starts in ~${hours}h`);
          } else {
             setTimeMessage(`Starts in ${diffMins}m`);
          }
        }
      };

      checkTime();
      const interval = setInterval(checkTime, 60000); // Check every minute
      return () => clearInterval(interval);
    }
  }, [shift.date, shift.startTime, isBooked]);

  return (
    <>
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-4 hover:shadow-md transition-shadow relative">
        <div className="flex justify-between items-start mb-4">
          <div>
            <span className={`inline-block px-2 py-1 text-xs font-semibold rounded-full mb-2 ${
              isPending ? 'bg-yellow-100 text-yellow-800' :
              isBooked ? 'bg-blue-100 text-blue-800' :
              isInProgress ? 'bg-green-100 text-green-800' :
              'bg-gray-100 text-gray-800'
            }`}>
              {shift.status.replace(/_/g, ' ')}
            </span>
            <h3 className="text-lg font-bold text-gray-900">{shift.title}</h3>
            
            <div className="flex items-center mt-1">
              <p className="text-gray-500 text-sm flex items-center mr-2">
                <MapPin size={14} className="mr-1" /> {shift.careHomeName}
              </p>
              {careHome && (
                <button 
                  onClick={() => setShowProfile(true)}
                  className="text-teal-600 hover:text-teal-800 text-xs font-medium flex items-center bg-teal-50 px-2 py-0.5 rounded transition"
                  title="View Care Home Profile"
                >
                  <Info size={12} className="mr-1" /> View Profile
                </button>
              )}
            </div>
          </div>
          <div className="text-right">
            <p className="text-lg font-bold text-teal-600">${shift.hourlyRate}/hr</p>
            <p className="text-xs text-gray-400">Total: ${(shift.hourlyRate * shift.durationHours).toFixed(0)}</p>
          </div>
        </div>

        <p className="text-gray-600 text-sm mb-4 line-clamp-2">{shift.description}</p>

        <div className="flex items-center space-x-4 text-sm text-gray-500 mb-6">
          <div className="flex items-center"><Calendar size={14} className="mr-1"/> {shift.date}</div>
          <div className="flex items-center"><Clock size={14} className="mr-1"/> {shift.startTime} ({shift.durationHours}h)</div>
        </div>

        <div className="flex space-x-3">
          {isPending && (
            <>
              <button 
                onClick={() => onUpdateShiftStatus(shift.id, ShiftStatus.BOOKED)}
                className="flex-1 bg-teal-600 text-white py-2 rounded-lg font-medium hover:bg-teal-700 transition flex items-center justify-center gap-2"
              >
                <CheckCircle size={16} /> Accept
              </button>
              <button 
                onClick={() => onUpdateShiftStatus(shift.id, ShiftStatus.OPEN)}
                className="flex-1 bg-red-50 text-red-600 py-2 rounded-lg font-medium hover:bg-red-100 transition flex items-center justify-center gap-2"
              >
                <XCircle size={16} /> Reject
              </button>
            </>
          )}

          {isBooked && (
            <div className="w-full">
               <button 
                 onClick={() => onUpdateShiftStatus(shift.id, ShiftStatus.IN_PROGRESS)}
                 disabled={!canStart}
                 className={`w-full py-2 rounded-lg font-medium transition flex items-center justify-center gap-2 ${
                   canStart 
                    ? 'bg-blue-600 text-white hover:bg-blue-700' 
                    : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                 }`}
               >
                 {canStart ? <Play size={16} /> : <Lock size={16} />} 
                 Mark Present (Start Shift)
               </button>
               {!canStart && (
                 <p className="text-xs text-center text-orange-500 mt-2">
                   You can start this shift 15 mins before scheduled time. ({timeMessage})
                 </p>
               )}
            </div>
          )}

          {isInProgress && (
             <button 
               onClick={() => onUpdateShiftStatus(shift.id, ShiftStatus.COMPLETED_PENDING_APPROVAL)}
               className="w-full bg-orange-500 text-white py-2 rounded-lg font-medium hover:bg-orange-600 transition flex items-center justify-center gap-2"
             >
               <Square size={16} /> Mark Completed
             </button>
          )}

          {isWaitingApproval && (
            <div className="w-full bg-gray-100 text-gray-500 py-2 rounded-lg text-center text-sm">
              Waiting for Care Home Approval
            </div>
          )}

          {isCompleted && !shift.feedback?.workerToHome && (
             <div className="w-full">
               <p className="text-sm text-gray-600 mb-2 text-center">Rate this Care Home</p>
               <div className="flex justify-center">
                 <StarRating rating={0} interactive onRate={(r) => onRateShift(shift.id, r)} size={24} />
               </div>
             </div>
          )}
           {isCompleted && shift.feedback?.workerToHome && (
             <div className="w-full text-center text-sm text-green-600 font-medium">
               Thanks for your feedback!
             </div>
          )}
        </div>
      </div>
      
      {showProfile && careHome && (
        <CareHomeProfileModal careHome={careHome} onClose={() => setShowProfile(false)} />
      )}
    </>
  );
};

export const WorkerDashboard: React.FC<WorkerDashboardProps> = ({ 
  worker, 
  shifts, 
  careHomes,
  onUpdateShiftStatus, 
  onRateShift, 
  onUpdateProfile
}) => {
  const [activeTab, setActiveTab] = useState<'shifts' | 'profile' | 'history'>('shifts');

  // Filter shifts relevant to this worker
  const myShifts = shifts.filter(s => s.workerId === worker.id);
  const pendingShifts = myShifts.filter(s => s.status === ShiftStatus.PENDING_ACCEPTANCE);
  const upcomingShifts = myShifts.filter(s => s.status === ShiftStatus.BOOKED);
  const activeShifts = myShifts.filter(s => s.status === ShiftStatus.IN_PROGRESS);
  const completedShifts = myShifts.filter(s => [ShiftStatus.COMPLETED_PENDING_APPROVAL, ShiftStatus.CLOSED].includes(s.status));

  const ProfileEditor = () => {
    const [formData, setFormData] = useState({
        name: worker.name,
        email: worker.email || '',
        mobileNumber: worker.mobileNumber || '',
        address: worker.address || '',
        city: worker.city || '',
        postCode: worker.postCode || '',
        bio: worker.bio || '',
        hourlyRate: worker.hourlyRate,
        gender: worker.gender || '',
        ethnicity: worker.ethnicity || '',
        visaStatus: worker.visaStatus || 'No Visa Needed',
        drivingLicenceNumber: worker.drivingLicenceNumber || ''
    });

    const [skillsString, setSkillsString] = useState(worker.skills.join(', '));
    const [hasDrivingLicence, setHasDrivingLicence] = useState(!!worker.drivingLicenceNumber);
    const [showSuccess, setShowSuccess] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        setShowSuccess(false);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const updatedData = {
            ...formData,
            skills: skillsString.split(',').map(s => s.trim()).filter(Boolean),
            drivingLicenceNumber: hasDrivingLicence ? formData.drivingLicenceNumber : undefined,
            // Construct location string for display
            location: `${formData.city}, ${formData.postCode}`
        };
        onUpdateProfile(updatedData);
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 3000);
    };

    return (
      <div className="space-y-6">
        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
             {/* Header */}
             <div className="p-6 border-b border-gray-100 bg-gray-50 flex items-center gap-4">
                <img src={worker.avatar} alt="Profile" className="w-16 h-16 rounded-full object-cover border-2 border-white shadow-sm" />
                <div>
                    <h2 className="text-xl font-bold text-gray-900">Edit Profile</h2>
                    <div className="flex items-center text-yellow-500 text-sm">
                        <span className="font-bold mr-1">{worker.rating.toFixed(1)}</span>
                        <StarRating rating={worker.rating} size={12} />
                        <span className="text-gray-400 ml-1">({worker.totalRatings} reviews)</span>
                    </div>
                </div>
             </div>

             <div className="p-8 space-y-6">
                 {/* Personal Info */}
                 <section>
                    <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4 flex items-center"><UserIcon size={14} className="mr-2"/> Personal Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                           <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                           <input name="name" type="text" value={formData.name} onChange={handleChange} className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-teal-500 outline-none" required />
                        </div>
                        <div>
                           <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                           <input name="email" type="email" value={formData.email} onChange={handleChange} className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-teal-500 outline-none" required />
                        </div>
                        <div>
                           <label className="block text-sm font-medium text-gray-700 mb-1">Mobile Number</label>
                           <input name="mobileNumber" type="tel" value={formData.mobileNumber} onChange={handleChange} className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-teal-500 outline-none" />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                                <select name="gender" value={formData.gender} onChange={handleChange} className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-teal-500 outline-none">
                                    <option value="">Select</option>
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Ethnicity</label>
                                <select name="ethnicity" value={formData.ethnicity} onChange={handleChange} className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-teal-500 outline-none">
                                    <option value="">Select</option>
                                    <option value="White">White</option>
                                    <option value="Mixed">Mixed</option>
                                    <option value="Asian">Asian</option>
                                    <option value="Black">Black</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>
                        </div>
                    </div>
                 </section>

                 <hr className="border-gray-100" />

                 {/* Location */}
                 <section>
                    <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4 flex items-center"><MapPin size={14} className="mr-2"/> Location</h3>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Street Address</label>
                        <input name="address" type="text" value={formData.address} onChange={handleChange} className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-teal-500 outline-none" placeholder="Street Address" />
                     </div>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                         <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                            <input name="city" type="text" value={formData.city} onChange={handleChange} className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-teal-500 outline-none" />
                         </div>
                         <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Post Code</label>
                            <input name="postCode" type="text" value={formData.postCode} onChange={handleChange} className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-teal-500 outline-none" />
                         </div>
                     </div>
                 </section>

                 <hr className="border-gray-100" />

                 {/* Professional */}
                 <section>
                    <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4 flex items-center"><Briefcase size={14} className="mr-2"/> Professional Details</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                        <div>
                           <label className="block text-sm font-medium text-gray-700 mb-1">Hourly Rate (£)</label>
                           <input name="hourlyRate" type="number" value={formData.hourlyRate} onChange={handleChange} className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-teal-500 outline-none" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Visa Status</label>
                            <select name="visaStatus" value={formData.visaStatus} onChange={handleChange} className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-teal-500 outline-none">
                                <option value="No Visa Needed">No Visa Needed</option>
                                <option value="Student Visa">Student Visa</option>
                                <option value="Skilled Worker Visa">Skilled Worker Visa</option>
                            </select>
                        </div>
                    </div>

                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Skills (comma separated)</label>
                        <input type="text" value={skillsString} onChange={(e) => setSkillsString(e.target.value)} className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-teal-500 outline-none" />
                    </div>

                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
                        <textarea name="bio" rows={4} value={formData.bio} onChange={handleChange} className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-teal-500 outline-none" />
                    </div>

                    <div className="flex items-center gap-2 mb-2">
                        <input type="checkbox" id="dl" checked={hasDrivingLicence} onChange={(e) => setHasDrivingLicence(e.target.checked)} className="h-4 w-4 text-teal-600 rounded" />
                        <label htmlFor="dl" className="text-sm text-gray-700">I have a valid driving licence</label>
                    </div>
                    {hasDrivingLicence && (
                        <div className="animate-in fade-in slide-in-from-top-2">
                            <input name="drivingLicenceNumber" type="text" placeholder="Licence Number" value={formData.drivingLicenceNumber} onChange={handleChange} className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-teal-500 outline-none" />
                        </div>
                    )}
                 </section>
             </div>
             
             {/* Footer */}
             <div className="p-6 border-t border-gray-100 bg-gray-50 flex items-center justify-between">
                <div>
                    {showSuccess && (
                        <span className="flex items-center text-green-600 text-sm font-medium animate-in fade-in slide-in-from-left-2">
                            <CheckCircle size={16} className="mr-1" /> Profile updated successfully!
                        </span>
                    )}
                </div>
                <button type="submit" className="bg-teal-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-teal-700 transition flex items-center shadow-sm shadow-teal-200">
                    <Save size={18} className="mr-2" /> Save Changes
                </button>
             </div>
        </form>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h4 className="font-semibold mb-4 flex items-center"><FileText size={18} className="mr-2"/> Documents</h4>
          <div className="space-y-3">
            {worker.documents.map((doc, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-100">
                <div className="flex items-center">
                   <div className={`w-2 h-2 rounded-full mr-3 ${doc.verified ? 'bg-green-500' : 'bg-yellow-500'}`} />
                   <span className="font-medium text-sm">{doc.name}</span>
                   <span className="text-xs text-gray-400 ml-2 uppercase border border-gray-200 px-1 rounded">{doc.type}</span>
                </div>
                {doc.verified ? (
                  <span className="text-xs text-green-600 font-medium flex items-center"><CheckCircle size={12} className="mr-1"/> Verified</span>
                ) : (
                  <span className="text-xs text-yellow-600">Pending</span>
                )}
              </div>
            ))}
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:bg-gray-50 transition cursor-pointer relative">
               <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" />
               <p className="text-sm text-gray-500">+ Upload New Document</p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-4xl mx-auto p-4 pb-20">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Hello, {worker.name}</h1>
          <p className="text-gray-500">Ready to work?</p>
        </div>
        <div className="bg-teal-50 text-teal-700 px-4 py-2 rounded-full font-bold">
           ${worker.hourlyRate}/hr
        </div>
      </div>

      <div className="flex space-x-6 mb-6 border-b border-gray-200">
        <button 
          onClick={() => setActiveTab('shifts')}
          className={`pb-2 px-1 font-medium text-sm transition ${activeTab === 'shifts' ? 'border-b-2 border-teal-600 text-teal-600' : 'text-gray-500'}`}
        >
          My Shifts
        </button>
        <button 
          onClick={() => setActiveTab('history')}
          className={`pb-2 px-1 font-medium text-sm transition ${activeTab === 'history' ? 'border-b-2 border-teal-600 text-teal-600' : 'text-gray-500'}`}
        >
          History
        </button>
        <button 
          onClick={() => setActiveTab('profile')}
          className={`pb-2 px-1 font-medium text-sm transition ${activeTab === 'profile' ? 'border-b-2 border-teal-600 text-teal-600' : 'text-gray-500'}`}
        >
          Profile & Docs
        </button>
      </div>

      {activeTab === 'shifts' && (
        <div className="space-y-8">
          {pendingShifts.length > 0 && (
            <section>
              <h2 className="text-lg font-semibold mb-3 text-yellow-700 flex items-center"><DollarSign size={18} className="mr-1"/> New Requests</h2>
              {pendingShifts.map(s => <ShiftCard key={s.id} shift={s} careHome={careHomes.find(ch => ch.id === s.careHomeId)} onUpdateShiftStatus={onUpdateShiftStatus} onRateShift={onRateShift} />)}
            </section>
          )}

          {activeShifts.length > 0 && (
            <section>
              <h2 className="text-lg font-semibold mb-3 text-green-700 animate-pulse">Live Now</h2>
              {activeShifts.map(s => <ShiftCard key={s.id} shift={s} careHome={careHomes.find(ch => ch.id === s.careHomeId)} onUpdateShiftStatus={onUpdateShiftStatus} onRateShift={onRateShift} />)}
            </section>
          )}

          {upcomingShifts.length > 0 && (
            <section>
              <h2 className="text-lg font-semibold mb-3 text-gray-700">Upcoming</h2>
              {upcomingShifts.map(s => <ShiftCard key={s.id} shift={s} careHome={careHomes.find(ch => ch.id === s.careHomeId)} onUpdateShiftStatus={onUpdateShiftStatus} onRateShift={onRateShift} />)}
            </section>
          )}
          
          {myShifts.length === 0 && (
            <div className="text-center py-12 text-gray-400">
              <Calendar size={48} className="mx-auto mb-4 opacity-50" />
              <p>No shifts assigned yet. Keep your profile updated!</p>
            </div>
          )}
        </div>
      )}

      {activeTab === 'history' && (
        <div className="space-y-8">
           {completedShifts.length > 0 ? (
            <section>
              <h2 className="text-lg font-semibold mb-3 text-gray-700 flex items-center"><Archive size={18} className="mr-2"/> Work History</h2>
              {completedShifts.map(s => <ShiftCard key={s.id} shift={s} careHome={careHomes.find(ch => ch.id === s.careHomeId)} onUpdateShiftStatus={onUpdateShiftStatus} onRateShift={onRateShift} />)}
            </section>
          ) : (
             <div className="text-center py-12 text-gray-400">
              <Archive size={48} className="mx-auto mb-4 opacity-50" />
              <p>No completed shifts found.</p>
            </div>
          )}
        </div>
      )}

      {activeTab === 'profile' && (
        <ProfileEditor />
      )}
    </div>
  );
};