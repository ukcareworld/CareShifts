import React, { useState } from 'react';
import { Shift, ShiftStatus, User, WorkerProfile } from '../types';
import { StarRating } from '../components/StarRating';
import { generateShiftDescription } from '../services/geminiService';
import { Plus, Users, Calendar, Clock, MapPin, Search, Sparkles, CheckCircle, Award, Archive, X, FileText, User as UserIcon, Mail, Phone, ShieldCheck, Settings, Save, Briefcase, CalendarX, Filter } from 'lucide-react';

interface CareHomeDashboardProps {
  user: User;
  shifts: Shift[];
  availableWorkers: WorkerProfile[];
  onCreateShift: (shift: Omit<Shift, 'id' | 'status' | 'careHomeId' | 'careHomeName'>) => void;
  onBookWorker: (shiftId: string, workerId: string) => void;
  onApproveShift: (shiftId: string, rating: number, comment?: string) => void;
  onUpdateProfile: (updatedProfile: Partial<User>) => void;
}

const MONTHS = [
  { value: '01', label: 'January' }, { value: '02', label: 'February' }, { value: '03', label: 'March' },
  { value: '04', label: 'April' }, { value: '05', label: 'May' }, { value: '06', label: 'June' },
  { value: '07', label: 'July' }, { value: '08', label: 'August' }, { value: '09', label: 'September' },
  { value: '10', label: 'October' }, { value: '11', label: 'November' }, { value: '12', label: 'December' }
];

const WorkerProfileModal: React.FC<{ 
  worker: WorkerProfile; 
  onClose: () => void;
  onBook: (() => void) | null; // Pass null if booking isn't available contextually
}> = ({ worker, onClose, onBook }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden relative animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="bg-teal-700 text-white p-6 flex justify-between items-start">
           <div className="flex gap-4 items-center">
              <img src={worker.avatar} alt={worker.name} className="w-20 h-20 rounded-full border-4 border-teal-800 bg-white object-cover"/>
              <div>
                <h2 className="text-2xl font-bold">{worker.name}</h2>
                <div className="flex items-center gap-2 mt-1 text-teal-100">
                   <MapPin size={14} />
                   <span className="text-sm">{worker.location}</span>
                </div>
                <div className="flex gap-2 mt-2">
                   {worker.approved && (
                      <span className="inline-flex items-center bg-teal-800 text-teal-100 text-xs px-2 py-0.5 rounded border border-teal-600">
                        <ShieldCheck size={12} className="mr-1"/> Verified Worker
                      </span>
                   )}
                   <span className="inline-block bg-white/20 text-white text-xs px-2 py-0.5 rounded">
                      £{worker.hourlyRate}/hr
                   </span>
                </div>
              </div>
           </div>
           <button onClick={onClose} className="text-teal-200 hover:text-white transition">
             <X size={28} />
           </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
           
           {/* Summary Stats */}
           <div className="flex items-center gap-6 p-4 bg-gray-50 rounded-xl border border-gray-100">
              <div className="flex flex-col items-center flex-1 border-r border-gray-200">
                 <span className="text-2xl font-bold text-gray-900">{worker.rating.toFixed(1)}</span>
                 <div className="flex"><StarRating rating={worker.rating} size={14} /></div>
                 <span className="text-xs text-gray-500 mt-1">{worker.totalRatings} Reviews</span>
              </div>
              <div className="flex flex-col items-center flex-1 border-r border-gray-200">
                 <span className="text-2xl font-bold text-gray-900">{worker.shiftsCompleted || 0}</span>
                 <span className="text-xs text-gray-500 uppercase font-medium mt-1">Shifts Done</span>
              </div>
              <div className="flex flex-col items-center flex-1">
                 <span className="text-2xl font-bold text-gray-900">{worker.documents.filter(d => d.verified).length}</span>
                 <span className="text-xs text-gray-500 uppercase font-medium mt-1">Verified Docs</span>
              </div>
           </div>

           {/* Detailed Info Grid */}
           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               <div className="p-4 border border-gray-100 rounded-lg">
                   <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                       <UserIcon size={14}/> Personal & Contact
                   </h4>
                   <div className="space-y-2 text-sm">
                       <div className="flex justify-between border-b border-gray-50 pb-1">
                           <span className="text-gray-500">Mobile</span>
                           <span className="font-medium text-gray-900">{worker.mobileNumber || 'N/A'}</span>
                       </div>
                       <div className="flex justify-between border-b border-gray-50 pb-1">
                           <span className="text-gray-500">Email</span>
                           <span className="font-medium text-gray-900 truncate max-w-[150px]" title={worker.email}>{worker.email || 'N/A'}</span>
                       </div>
                       <div className="flex justify-between border-b border-gray-50 pb-1">
                           <span className="text-gray-500">Address</span>
                           <span className="font-medium text-gray-900 text-right truncate max-w-[150px]" title={worker.address}>{worker.address || 'Not Disclosed'}</span>
                       </div>
                        <div className="flex justify-between border-b border-gray-50 pb-1">
                           <span className="text-gray-500">City</span>
                           <span className="font-medium text-gray-900">{worker.city || 'N/A'}</span>
                       </div>
                       <div className="flex justify-between border-b border-gray-50 pb-1">
                           <span className="text-gray-500">Post Code</span>
                           <span className="font-medium text-gray-900">{worker.postCode || 'N/A'}</span>
                       </div>
                       <div className="flex justify-between border-b border-gray-50 pb-1">
                           <span className="text-gray-500">Gender</span>
                           <span className="font-medium text-gray-900">{worker.gender || 'Not Specified'}</span>
                       </div>
                       <div className="flex justify-between pb-1">
                           <span className="text-gray-500">Ethnicity</span>
                           <span className="font-medium text-gray-900">{worker.ethnicity || 'Not Specified'}</span>
                       </div>
                   </div>
               </div>

               <div className="p-4 border border-gray-100 rounded-lg">
                   <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                       <Briefcase size={14}/> Professional Info
                   </h4>
                   <div className="space-y-2 text-sm">
                        <div className="flex justify-between border-b border-gray-50 pb-1">
                           <span className="text-gray-500">Visa Status</span>
                           <span className="font-medium text-gray-900">{worker.visaStatus || 'Not Specified'}</span>
                       </div>
                       <div className="flex justify-between border-b border-gray-50 pb-1">
                           <span className="text-gray-500">Driving Licence</span>
                           <span className="font-medium text-gray-900">{worker.drivingLicenceNumber ? 'Yes (Full UK)' : 'No'}</span>
                       </div>
                       <div className="flex justify-between pb-1">
                           <span className="text-gray-500">DBS Status</span>
                           <span className="font-medium text-gray-900">{worker.documents.find(d => d.type === 'DBS' && d.verified) ? 'Verified' : 'Pending/None'}</span>
                       </div>
                   </div>
               </div>
           </div>

           {/* About */}
           <section>
              <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-2">About</h3>
              <p className="text-gray-700 leading-relaxed whitespace-pre-wrap text-sm bg-gray-50 p-4 rounded-lg border border-gray-100">{worker.bio || "No bio provided."}</p>
           </section>

           {/* Skills */}
           <section>
              <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-3">Skills & Qualifications</h3>
              <div className="flex flex-wrap gap-2">
                 {worker.skills.map((skill, idx) => (
                    <span key={idx} className="bg-teal-50 text-teal-700 px-3 py-1 rounded-full text-xs font-bold border border-teal-100">
                       {skill}
                    </span>
                 ))}
                 {worker.skills.length === 0 && <span className="text-gray-400 text-sm italic">No skills listed.</span>}
              </div>
           </section>

           {/* Documents */}
           <section>
              <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-3">Verified Documents</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                 {worker.documents.map((doc, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg shadow-sm">
                       <div className="flex items-center gap-3">
                          <div className={`p-2 rounded ${doc.verified ? 'bg-green-50 text-green-600' : 'bg-gray-50 text-gray-400'}`}>
                             <FileText size={18} />
                          </div>
                          <div>
                             <p className="font-medium text-sm text-gray-900">{doc.name}</p>
                             <p className="text-xs text-gray-500 uppercase">{doc.type}</p>
                          </div>
                       </div>
                       {doc.verified && <CheckCircle size={16} className="text-green-500" />}
                    </div>
                 ))}
                 {worker.documents.length === 0 && <span className="text-gray-400 text-sm italic">No documents uploaded.</span>}
              </div>
           </section>
        </div>

        {/* Footer Actions */}
        <div className="p-6 border-t border-gray-100 bg-gray-50 flex justify-end gap-3">
           <button 
             onClick={onClose}
             className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition font-medium"
           >
              Close
           </button>
           {onBook && (
             <button 
               onClick={onBook}
               className="px-6 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition shadow-sm shadow-teal-200 font-medium flex items-center gap-2"
             >
                <Calendar size={18} /> Book Worker
             </button>
           )}
        </div>
      </div>
    </div>
  );
};

const ShiftDetailsModal: React.FC<{ 
  shift: Shift; 
  worker?: WorkerProfile; 
  onClose: () => void;
  onViewWorkerProfile?: (worker: WorkerProfile) => void;
  onApprove?: (shiftId: string, rating: number, comment: string) => void;
}> = ({ shift, worker, onClose, onViewWorkerProfile, onApprove }) => {
  const [approvalRating, setApprovalRating] = useState(5);
  const [approvalComment, setApprovalComment] = useState('');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden relative animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
        <div className="bg-slate-900 text-white p-6 flex justify-between items-start">
           <div>
              <h2 className="text-xl font-bold">{shift.title}</h2>
              <div className="flex items-center gap-2 mt-1 text-slate-400">
                 <span className="text-xs bg-slate-800 px-2 py-0.5 rounded border border-slate-700 uppercase tracking-wide">
                   {shift.status.replace(/_/g, ' ')}
                 </span>
              </div>
           </div>
           <button onClick={onClose} className="text-slate-400 hover:text-white transition">
             <X size={24} />
           </button>
        </div>

        <div className="p-6 space-y-6 overflow-y-auto">
           {/* Date & Time */}
           <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                 <p className="text-xs text-gray-500 uppercase font-bold mb-1">Date</p>
                 <div className="flex items-center text-gray-900 font-medium">
                    <Calendar size={18} className="mr-2 text-teal-600"/>
                    {shift.date}
                 </div>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                 <p className="text-xs text-gray-500 uppercase font-bold mb-1">Time</p>
                 <div className="flex items-center text-gray-900 font-medium">
                    <Clock size={18} className="mr-2 text-teal-600"/>
                    {shift.startTime} <span className="text-gray-400 ml-1 text-xs">({shift.durationHours} hrs)</span>
                 </div>
              </div>
           </div>

           {/* Cost */}
           <div className="flex items-center justify-between p-4 border border-teal-100 bg-teal-50 rounded-lg">
              <div>
                 <p className="text-xs text-teal-600 font-bold uppercase">Estimated Cost</p>
                 <p className="text-xl font-bold text-teal-900">£{(shift.hourlyRate * shift.durationHours).toFixed(2)}</p>
              </div>
              <div className="text-right">
                 <p className="text-xs text-teal-600 font-bold uppercase">Rate</p>
                 <p className="text-sm font-medium text-teal-900">£{shift.hourlyRate}/hr</p>
              </div>
           </div>

           {/* Description */}
           <div>
              <p className="text-xs text-gray-500 uppercase font-bold mb-2">Description</p>
              <p className="text-sm text-gray-700 leading-relaxed bg-gray-50 p-4 rounded-lg border border-gray-100">
                {shift.description}
              </p>
           </div>

           {/* Assigned Worker */}
           {worker && (
             <div>
                <p className="text-xs text-gray-500 uppercase font-bold mb-2">Assigned Care Worker</p>
                <div className="flex items-center gap-4 bg-white border border-gray-200 p-4 rounded-xl shadow-sm hover:border-teal-200 transition">
                   <img src={worker.avatar} alt={worker.name} className="w-12 h-12 rounded-full object-cover border border-gray-200"/>
                   <div className="flex-1">
                      <p className="font-bold text-gray-900 text-sm">{worker.name}</p>
                      <div className="flex items-center text-xs text-gray-500 mt-0.5">
                         <Phone size={12} className="mr-1"/> {worker.mobileNumber || 'No phone'}
                      </div>
                      <div className="flex items-center text-xs text-gray-500 mt-0.5">
                         <Mail size={12} className="mr-1"/> {worker.email || 'No email'}
                      </div>
                   </div>
                   {onViewWorkerProfile && (
                     <button 
                       onClick={() => onViewWorkerProfile(worker)}
                       className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2 rounded-lg transition font-medium"
                     >
                       View Profile
                     </button>
                   )}
                </div>
             </div>
           )}
           
           {!worker && shift.workerId && (
               <div className="p-4 bg-gray-50 rounded-lg border border-dashed border-gray-300 text-center">
                  <p className="text-sm text-gray-500">Worker information unavailable (ID: {shift.workerId})</p>
               </div>
           )}

           {/* Approval Section */}
           {shift.status === ShiftStatus.COMPLETED_PENDING_APPROVAL && onApprove && (
              <div className="bg-orange-50 border border-orange-200 rounded-xl p-5 mt-6 animate-in fade-in slide-in-from-bottom-4">
                <h3 className="font-bold text-orange-900 mb-2 flex items-center">
                  <CheckCircle size={18} className="mr-2"/>
                  Approve Shift Completion
                </h3>
                <p className="text-sm text-gray-600 mb-4">Please rate the worker and provide feedback to release payment.</p>
                
                <div className="mb-4">
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Worker Rating</label>
                  <div className="bg-white p-2 rounded border border-orange-100 inline-block">
                    <StarRating rating={approvalRating} interactive onRate={setApprovalRating} size={24} />
                  </div>
                </div>

                <div className="mb-4">
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Feedback Comment</label>
                  <textarea 
                    className="w-full border border-orange-200 rounded-lg p-3 text-sm focus:ring-2 focus:ring-orange-500 outline-none"
                    rows={3}
                    placeholder="How was the worker's performance? Any issues?"
                    value={approvalComment}
                    onChange={(e) => setApprovalComment(e.target.value)}
                  />
                </div>

                <button 
                  onClick={() => onApprove(shift.id, approvalRating, approvalComment)}
                  className="w-full bg-orange-600 text-white font-bold py-3 rounded-lg hover:bg-orange-700 transition shadow-sm flex items-center justify-center gap-2"
                >
                  <CheckCircle size={18} /> Approve & Release Payment
                </button>
              </div>
           )}
        </div>
      </div>
    </div>
  );
};

export const CareHomeDashboard: React.FC<CareHomeDashboardProps> = ({
  user,
  shifts,
  availableWorkers,
  onCreateShift,
  onBookWorker,
  onApproveShift,
  onUpdateProfile
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'post' | 'workers' | 'history' | 'profile'>('overview');
  const [newShift, setNewShift] = useState({
    title: '',
    description: '',
    date: '',
    startTime: '',
    durationHours: 8,
    hourlyRate: 20,
    location: user.location
  });
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);
  const [selectedShiftForBooking, setSelectedShiftForBooking] = useState<string | null>(null);
  const [selectedWorkerForProfile, setSelectedWorkerForProfile] = useState<WorkerProfile | null>(null);
  const [selectedShiftForDetails, setSelectedShiftForDetails] = useState<Shift | null>(null);
  const [historyYear, setHistoryYear] = useState<string>('ALL');
  const [historyMonth, setHistoryMonth] = useState<string>('ALL');

  // Filter workers based on the Care Home's city
  const localWorkers = availableWorkers.filter(worker => 
    worker.city && user.city && 
    worker.city.trim().toLowerCase() === user.city.trim().toLowerCase()
  );

  const handleAIImprove = async () => {
    if (!newShift.title) return;
    setIsGeneratingAI(true);
    const desc = await generateShiftDescription(newShift.title, newShift.description || "Reliable, kind, certified.");
    setNewShift(prev => ({ ...prev, description: desc }));
    setIsGeneratingAI(false);
  };

  const handlePost = (e: React.FormEvent) => {
    e.preventDefault();
    onCreateShift(newShift);
    setActiveTab('overview');
    setNewShift({
      title: '',
      description: '',
      date: '',
      startTime: '',
      durationHours: 8,
      hourlyRate: 20,
      location: user.location
    });
  };

  const handleApproveFromModal = (shiftId: string, rating: number, comment: string) => {
    onApproveShift(shiftId, rating, comment);
    setSelectedShiftForDetails(null);
  };

  const myShifts = shifts.filter(s => s.careHomeId === user.id);
  const openShifts = myShifts.filter(s => s.status === ShiftStatus.OPEN);
  const activeShifts = myShifts.filter(s => [ShiftStatus.BOOKED, ShiftStatus.IN_PROGRESS, ShiftStatus.PENDING_ACCEPTANCE].includes(s.status));
  const approvalNeeded = myShifts.filter(s => s.status === ShiftStatus.COMPLETED_PENDING_APPROVAL);
  const historyShifts = myShifts.filter(s => s.status === ShiftStatus.CLOSED);

  // Compute available years from history shifts
  const availableYears = Array.from(new Set(historyShifts.map(s => s.date.split('-')[0]))).sort().reverse();

  // Filter Logic for History
  const filteredHistory = historyShifts.filter(s => {
      if (historyYear !== 'ALL' && !s.date.startsWith(historyYear)) return false;
      if (historyMonth !== 'ALL' && s.date.split('-')[1] !== historyMonth) return false;
      return true;
  });

  const ProfileEditor = () => {
    const [formData, setFormData] = useState<Partial<User>>({
        name: user.name,
        contactPerson: user.contactPerson || '',
        phoneNumber: user.phoneNumber || '',
        mobileNumber: user.mobileNumber || '',
        address: user.address || '',
        city: user.city || '',
        postCode: user.postCode || '',
        description: user.description || '',
        careType: user.careType || 'Residential Care',
        hasParking: user.hasParking || false,
    });
    const [showSuccess, setShowSuccess] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        setShowSuccess(false);
    };

    const handleCheckbox = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData(prev => ({ ...prev, hasParking: e.target.checked }));
        setShowSuccess(false);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onUpdateProfile(formData);
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 3000);
    };

    return (
        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
             {/* Header */}
             <div className="p-6 border-b border-gray-100 bg-gray-50 flex items-center gap-4">
                <div className="bg-teal-100 p-3 rounded-full">
                    <Settings className="text-teal-600" size={24} />
                </div>
                <div>
                    <h2 className="text-xl font-bold text-gray-900">Edit Profile</h2>
                    <p className="text-sm text-gray-500">Update your care home details seen by workers.</p>
                </div>
             </div>

             <div className="p-8 space-y-6">
                 {/* Basic Info */}
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                     <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Care Home Name</label>
                        <input name="name" type="text" value={formData.name} onChange={handleChange} className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-teal-500 outline-none" required />
                     </div>
                     <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Contact Person</label>
                        <input name="contactPerson" type="text" value={formData.contactPerson} onChange={handleChange} className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-teal-500 outline-none" />
                     </div>
                 </div>

                 {/* Contact */}
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                     <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                        <input name="phoneNumber" type="tel" value={formData.phoneNumber} onChange={handleChange} className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-teal-500 outline-none" />
                     </div>
                     <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Mobile Number</label>
                        <input name="mobileNumber" type="tel" value={formData.mobileNumber} onChange={handleChange} className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-teal-500 outline-none" />
                     </div>
                 </div>

                 {/* Location */}
                 <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                    <input name="address" type="text" value={formData.address} onChange={handleChange} className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-teal-500 outline-none" placeholder="Street Address" />
                 </div>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                     <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                        <input name="city" type="text" value={formData.city} onChange={handleChange} className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-teal-500 outline-none" />
                     </div>
                     <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Post Code</label>
                        <input name="postCode" type="text" value={formData.postCode} onChange={handleChange} className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-teal-500 outline-none" />
                     </div>
                 </div>

                 {/* Facility Details */}
                 <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Care Type</label>
                    <select name="careType" value={formData.careType} onChange={handleChange} className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-teal-500 outline-none">
                        <option>Residential Care</option>
                        <option>Nursing Care</option>
                        <option>Dementia Care</option>
                        <option>Respite Care</option>
                        <option>Palliative Care</option>
                        <option>Other</option>
                    </select>
                 </div>

                 <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <textarea name="description" rows={4} value={formData.description} onChange={handleChange} className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-teal-500 outline-none" />
                 </div>
                 
                 <div className="flex items-center">
                    <input id="parking" type="checkbox" checked={formData.hasParking} onChange={handleCheckbox} className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300 rounded" />
                    <label htmlFor="parking" className="ml-2 block text-sm text-gray-900">Parking available on-site</label>
                 </div>
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
    );
  };

  return (
    <div className="max-w-6xl mx-auto p-4">
      <header className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{user.name} Dashboard</h1>
          <p className="text-gray-500">Manage your staffing needs.</p>
        </div>
        <button 
          onClick={() => setActiveTab('post')}
          className="bg-teal-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-teal-700 transition flex items-center shadow-md shadow-teal-200"
        >
          <Plus size={18} className="mr-2" /> Post New Shift
        </button>
      </header>

      {/* Navigation */}
      <div className="flex space-x-6 mb-6 border-b border-gray-200 overflow-x-auto">
        <button 
          onClick={() => setActiveTab('overview')}
          className={`pb-2 px-1 font-medium text-sm transition whitespace-nowrap ${activeTab === 'overview' ? 'border-b-2 border-teal-600 text-teal-600' : 'text-gray-500'}`}
        >
          Overview
        </button>
        <button 
          onClick={() => setActiveTab('workers')}
          className={`pb-2 px-1 font-medium text-sm transition whitespace-nowrap ${activeTab === 'workers' ? 'border-b-2 border-teal-600 text-teal-600' : 'text-gray-500'}`}
        >
          Find Workers
        </button>
        <button 
          onClick={() => setActiveTab('post')}
          className={`pb-2 px-1 font-medium text-sm transition whitespace-nowrap ${activeTab === 'post' ? 'border-b-2 border-teal-600 text-teal-600' : 'text-gray-500'}`}
        >
          Post Shift
        </button>
        <button 
          onClick={() => setActiveTab('history')}
          className={`pb-2 px-1 font-medium text-sm transition whitespace-nowrap ${activeTab === 'history' ? 'border-b-2 border-teal-600 text-teal-600' : 'text-gray-500'}`}
        >
          Shift History
        </button>
        <button 
          onClick={() => setActiveTab('profile')}
          className={`pb-2 px-1 font-medium text-sm transition whitespace-nowrap ${activeTab === 'profile' ? 'border-b-2 border-teal-600 text-teal-600' : 'text-gray-500'}`}
        >
          Profile
        </button>
      </div>

      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Column 1: Approval Needed */}
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-700 flex items-center"><CheckCircle size={18} className="mr-2 text-orange-500"/> Needs Approval</h3>
            {approvalNeeded.length === 0 && <p className="text-sm text-gray-400 italic">No completed shifts to approve.</p>}
            {approvalNeeded.map(shift => {
               const assignedWorker = availableWorkers.find(w => w.id === shift.workerId);
               return (
                <div 
                  key={shift.id} 
                  onClick={() => setSelectedShiftForDetails(shift)}
                  className="bg-white p-4 rounded-xl shadow-sm border border-orange-200 cursor-pointer hover:shadow-md hover:border-orange-400 transition group relative overflow-hidden"
                >
                   <div className="absolute top-0 right-0 p-2">
                      <span className="flex h-3 w-3 relative">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-orange-500"></span>
                      </span>
                   </div>
                   <h4 className="font-bold text-gray-900 pr-4">{shift.title}</h4>
                   <p className="text-sm text-gray-500 mb-2">Completed by worker</p>
                   {assignedWorker && (
                      <div className="flex items-center gap-2 mt-2 pt-2 border-t border-gray-100">
                         <img src={assignedWorker.avatar} alt={assignedWorker.name} className="w-6 h-6 rounded-full object-cover"/>
                         <span className="text-xs font-medium text-gray-700">{assignedWorker.name}</span>
                      </div>
                   )}
                   <p className="text-xs text-orange-600 font-bold mt-3 text-right">Click to Review & Pay &rarr;</p>
                </div>
               );
            })}
          </div>

          {/* Column 2: Active & Booked */}
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-700 flex items-center"><Users size={18} className="mr-2 text-blue-500"/> Scheduled / Active</h3>
            {activeShifts.length === 0 && <p className="text-sm text-gray-400 italic">No active shifts.</p>}
            {activeShifts.map(shift => {
               const assignedWorker = availableWorkers.find(w => w.id === shift.workerId);
               return (
                <div 
                  key={shift.id} 
                  onClick={() => setSelectedShiftForDetails(shift)}
                  className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 cursor-pointer hover:shadow-md hover:border-blue-200 transition group"
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors">{shift.title}</h4>
                      <p className="text-xs text-gray-500">{shift.date} @ {shift.startTime}</p>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full ${shift.status === 'IN_PROGRESS' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}`}>
                      {shift.status === 'PENDING_ACCEPTANCE' ? 'Waiting' : shift.status.replace('_', ' ')}
                    </span>
                  </div>
                  
                  {assignedWorker && (
                    <div className="mt-3 pt-3 border-t border-gray-50 flex items-center gap-2">
                       <img src={assignedWorker.avatar} alt={assignedWorker.name} className="w-6 h-6 rounded-full object-cover"/>
                       <span className="text-xs text-gray-600 font-medium">{assignedWorker.name}</span>
                    </div>
                  )}
                </div>
               );
            })}
          </div>

          {/* Column 3: Open Shifts */}
          <div className="space-y-4">
             <h3 className="font-semibold text-gray-700 flex items-center"><Search size={18} className="mr-2 text-gray-500"/> Open for Booking</h3>
             {openShifts.length === 0 && <p className="text-sm text-gray-400 italic">No open shifts.</p>}
             {openShifts.map(shift => (
               <div key={shift.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 group hover:border-teal-200 transition">
                 <h4 className="font-bold">{shift.title}</h4>
                 <p className="text-sm text-gray-500 mb-3 line-clamp-2">{shift.description}</p>
                 <button 
                   onClick={() => { setSelectedShiftForBooking(shift.id); setActiveTab('workers'); }}
                   className="text-sm text-teal-600 font-medium hover:underline"
                 >
                   Find Worker for this shift &rarr;
                 </button>
               </div>
             ))}
          </div>
        </div>
      )}

      {activeTab === 'history' && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          {/* Header & Filter */}
          <div className="p-6 border-b border-gray-100 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <h3 className="text-lg font-bold text-gray-900 flex items-center">
              <Archive className="mr-2 text-gray-400" size={20}/> Past Shift History
            </h3>
            
            <div className="flex items-center gap-2">
                <div className="flex items-center gap-2 bg-gray-50 p-1 rounded-lg border border-gray-200">
                    <Filter size={14} className="text-gray-400 ml-2" />
                    <select 
                       className="bg-transparent text-sm font-medium text-gray-700 outline-none p-1"
                       value={historyMonth}
                       onChange={(e) => setHistoryMonth(e.target.value)}
                    >
                       <option value="ALL">All Months</option>
                       {MONTHS.map(m => (
                          <option key={m.value} value={m.value}>{m.label}</option>
                       ))}
                    </select>
                    <div className="w-px h-4 bg-gray-300 mx-1"></div>
                    <select 
                       className="bg-transparent text-sm font-medium text-gray-700 outline-none p-1"
                       value={historyYear}
                       onChange={(e) => setHistoryYear(e.target.value)}
                    >
                       <option value="ALL">All Years</option>
                       {availableYears.map(year => (
                          <option key={year} value={year}>{year}</option>
                       ))}
                    </select>
                </div>
                <span className="text-sm text-gray-500 ml-2">{filteredHistory.length} records</span>
            </div>
          </div>
          
          {filteredHistory.length === 0 ? (
             <div className="p-12 text-center text-gray-400">
               <Archive size={48} className="mx-auto mb-4 opacity-30" />
               <p>No completed shifts found for the selected period.</p>
             </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {filteredHistory.map(shift => {
                 const worker = availableWorkers.find(w => w.id === shift.workerId);
                 return (
                  <div 
                    key={shift.id} 
                    onClick={() => setSelectedShiftForDetails(shift)}
                    className="p-6 flex flex-col md:flex-row md:items-center justify-between hover:bg-gray-50 transition cursor-pointer"
                  >
                    <div className="mb-4 md:mb-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="bg-gray-200 text-gray-600 text-xs px-2 py-0.5 rounded-full font-medium">CLOSED</span>
                        <h4 className="font-bold text-gray-900 hover:text-teal-600 transition-colors">{shift.title}</h4>
                      </div>
                      <p className="text-sm text-gray-500 flex items-center gap-4">
                        <span className="flex items-center"><Calendar size={14} className="mr-1"/> {shift.date}</span>
                        <span className="flex items-center"><Clock size={14} className="mr-1"/> {shift.startTime} ({shift.durationHours}h)</span>
                        <span className="flex items-center"><Users size={14} className="mr-1"/> {worker ? worker.name : (shift.workerId || 'N/A')}</span>
                      </p>
                      {shift.feedback?.homeToWorkerComment && (
                          <div className="mt-2 bg-gray-50 p-2 rounded text-xs text-gray-600 italic">
                            "{shift.feedback.homeToWorkerComment}"
                          </div>
                      )}
                    </div>
                    <div className="flex items-center gap-6">
                      <div className="text-right">
                        <p className="text-xs text-gray-400 uppercase">Total Cost</p>
                        <p className="font-bold text-gray-900">£{(shift.hourlyRate * shift.durationHours).toFixed(2)}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-gray-400 uppercase">Rating Given</p>
                        <div className="flex justify-end">
                          <StarRating rating={shift.feedback?.homeToWorker || 0} size={14} />
                        </div>
                      </div>
                    </div>
                  </div>
                 );
              })}
            </div>
          )}
        </div>
      )}

      {activeTab === 'post' && (
        <div className="max-w-2xl mx-auto bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
          <h2 className="text-xl font-bold mb-6">Create New Shift</h2>
          <form onSubmit={handlePost} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Shift Title</label>
              <input 
                type="text" 
                required
                className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-teal-500 outline-none"
                placeholder="e.g. Senior Night Care Assistant"
                value={newShift.title}
                onChange={e => setNewShift({...newShift, title: e.target.value})}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 flex justify-between">
                <span>Description & Requirements</span>
                <button 
                  type="button" 
                  onClick={handleAIImprove}
                  disabled={isGeneratingAI || !newShift.title}
                  className="text-xs text-purple-600 flex items-center hover:text-purple-800 disabled:opacity-50"
                >
                  <Sparkles size={12} className="mr-1" /> {isGeneratingAI ? 'Generating...' : 'AI Assist'}
                </button>
              </label>
              <textarea 
                required
                className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-teal-500 outline-none"
                rows={4}
                placeholder="Describe the role or let AI help you..."
                value={newShift.description}
                onChange={e => setNewShift({...newShift, description: e.target.value})}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
               <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                <input 
                  type="date" 
                  required
                  className="w-full border border-gray-300 rounded-lg p-2"
                  value={newShift.date}
                  onChange={e => setNewShift({...newShift, date: e.target.value})}
                />
               </div>
               <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Start Time</label>
                <input 
                  type="time" 
                  required
                  className="w-full border border-gray-300 rounded-lg p-2"
                  value={newShift.startTime}
                  onChange={e => setNewShift({...newShift, startTime: e.target.value})}
                />
               </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
               <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Duration (Hours)</label>
                <input 
                  type="number" 
                  min="1"
                  className="w-full border border-gray-300 rounded-lg p-2"
                  value={newShift.durationHours}
                  onChange={e => setNewShift({...newShift, durationHours: parseInt(e.target.value)})}
                />
               </div>
               <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Hourly Rate (£)</label>
                <input 
                  type="number" 
                  min="10"
                  className="w-full border border-gray-300 rounded-lg p-2"
                  value={newShift.hourlyRate}
                  onChange={e => setNewShift({...newShift, hourlyRate: parseInt(e.target.value)})}
                />
               </div>
            </div>

            <button type="submit" className="w-full bg-teal-600 text-white py-3 rounded-lg font-bold hover:bg-teal-700 transition mt-4">
              Post Shift
            </button>
          </form>
        </div>
      )}

      {activeTab === 'workers' && (
        <div>
          {selectedShiftForBooking && (
            <div className="bg-blue-50 p-4 mb-6 rounded-lg flex justify-between items-center">
              <span className="text-blue-800 text-sm font-medium">
                Selecting worker for: <strong>{shifts.find(s => s.id === selectedShiftForBooking)?.title}</strong>
              </span>
              <button onClick={() => setSelectedShiftForBooking(null)} className="text-blue-600 text-xs hover:underline">Clear Selection</button>
            </div>
          )}
          
          <div className="mb-4 p-3 bg-blue-50 text-blue-700 rounded-lg text-sm flex items-center">
             <MapPin size={16} className="mr-2" />
             Showing workers in <strong>{user.city || 'Your Area'}</strong>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {localWorkers.length > 0 ? (
                localWorkers.map(worker => {
                  // CHECK IF WORKER IS ALREADY BOOKED FOR THE SELECTED SHIFT DATE
                  const targetShift = shifts.find(s => s.id === selectedShiftForBooking);
                  const isWorkerBookedOnDate = targetShift ? shifts.some(s => 
                     s.workerId === worker.id && 
                     s.date === targetShift.date && 
                     (s.status === ShiftStatus.BOOKED || s.status === ShiftStatus.IN_PROGRESS || s.status === ShiftStatus.COMPLETED_PENDING_APPROVAL || s.status === ShiftStatus.CLOSED)
                  ) : false;

                  return (
                  <div key={worker.id} className={`bg-white p-6 rounded-xl shadow-sm border flex flex-col md:flex-row gap-6 transition ${isWorkerBookedOnDate ? 'border-gray-100 opacity-60' : 'border-gray-100 hover:shadow-md'}`}>
                    <div className="relative">
                       <img src={worker.avatar} alt={worker.name} className={`w-20 h-20 rounded-full object-cover border-2 ${isWorkerBookedOnDate ? 'border-gray-200 grayscale' : 'border-gray-100'}`} />
                       {isWorkerBookedOnDate && (
                         <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-gray-600 text-white text-[10px] px-2 py-0.5 rounded-full whitespace-nowrap z-10">
                            Booked
                         </div>
                       )}
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <h3 className="text-lg font-bold">{worker.name}</h3>
                        <div className="text-right">
                          <span className="block font-bold text-teal-600">£{worker.hourlyRate}/hr</span>
                        </div>
                      </div>
                      <div className="flex items-center text-yellow-500 text-sm mb-2">
                        <StarRating rating={worker.rating} size={14} />
                        <span className="ml-1 text-gray-400">({worker.totalRatings})</span>
                      </div>
                      <p className="text-sm text-gray-600 mb-3 line-clamp-2">{worker.bio}</p>
                      
                      <div className="flex flex-wrap gap-2 mb-4">
                        {worker.skills.slice(0, 3).map(skill => (
                          <span key={skill} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded border border-gray-200">{skill}</span>
                        ))}
                      </div>

                      <div className="flex gap-2">
                        <button
                            onClick={() => setSelectedWorkerForProfile(worker)}
                            className="flex-1 border border-teal-600 text-teal-600 py-2 rounded-lg text-sm font-medium hover:bg-teal-50 transition"
                        >
                            View Profile
                        </button>
                        {selectedShiftForBooking ? (
                            isWorkerBookedOnDate ? (
                                <button 
                                disabled
                                className="flex-1 bg-gray-200 text-gray-500 py-2 rounded-lg text-sm font-medium cursor-not-allowed flex items-center justify-center gap-1"
                                title="Worker already has a confirmed shift on this date"
                                >
                                <CalendarX size={14}/> Unavailable
                                </button>
                            ) : (
                                <button 
                                onClick={() => {
                                  onBookWorker(selectedShiftForBooking, worker.id);
                                  setSelectedShiftForBooking(null);
                                  setActiveTab('overview');
                                }}
                                className="flex-1 bg-teal-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-teal-700 transition"
                                >
                                Book Now
                                </button>
                            )
                        ) : (
                            <button 
                            disabled
                            className="flex-1 bg-gray-100 text-gray-400 py-2 rounded-lg text-sm font-medium cursor-not-allowed"
                            >
                            Select Shift First
                            </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
                })
            ) : (
                <div className="col-span-full text-center py-12 text-gray-500 bg-white rounded-xl border border-dashed border-gray-300">
                    <MapPin size={48} className="mx-auto mb-4 opacity-30" />
                    <p className="text-lg font-medium">No workers found in {user.city}</p>
                    <p className="text-sm">We filter workers by location to ensure they can reach your care home.</p>
                </div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'profile' && (
        <ProfileEditor />
      )}

      {selectedWorkerForProfile && (
         <WorkerProfileModal 
            worker={selectedWorkerForProfile} 
            onClose={() => setSelectedWorkerForProfile(null)}
            onBook={selectedShiftForBooking ? () => {
                // Perform quick availability check again before booking from modal
                const targetShift = shifts.find(s => s.id === selectedShiftForBooking);
                const isBooked = targetShift ? shifts.some(s => s.workerId === selectedWorkerForProfile.id && s.date === targetShift.date && (s.status === ShiftStatus.BOOKED || s.status === ShiftStatus.IN_PROGRESS)) : false;
                
                if (isBooked) {
                    alert("This worker is unavailable for the selected date.");
                    return;
                }

                onBookWorker(selectedShiftForBooking, selectedWorkerForProfile.id);
                setSelectedShiftForBooking(null);
                setSelectedWorkerForProfile(null);
                setActiveTab('overview');
            } : null}
         />
      )}

      {selectedShiftForDetails && (
        <ShiftDetailsModal 
          shift={selectedShiftForDetails} 
          worker={availableWorkers.find(w => w.id === selectedShiftForDetails.workerId)}
          onClose={() => setSelectedShiftForDetails(null)}
          onViewWorkerProfile={(worker) => {
             setSelectedShiftForDetails(null);
             setSelectedWorkerForProfile(worker);
          }}
          onApprove={handleApproveFromModal}
        />
      )}
    </div>
  );
};