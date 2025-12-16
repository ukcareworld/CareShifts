import React, { useState } from 'react';
import { User, WorkerProfile, UserRole, Shift, ShiftStatus } from '../types';
import { CheckCircle, XCircle, ShieldCheck, Building2, User as UserIcon, MapPin, FileText, X, Phone, Smartphone, Car, Activity, Eye, Trash2, AlertCircle, Mail, Globe, Award, Calendar, DollarSign, Clock, Search, Filter } from 'lucide-react';
import { StarRating } from '../components/StarRating';

interface SuperAdminDashboardProps {
  careHomes: User[];
  workers: WorkerProfile[];
  shifts: Shift[];
  onApprove: (id: string, type: UserRole) => void;
  onReject: (id: string, type: UserRole) => void;
  onLogout: () => void;
}

const MONTHS = [
  { value: '01', label: 'Jan' }, { value: '02', label: 'Feb' }, { value: '03', label: 'Mar' },
  { value: '04', label: 'Apr' }, { value: '05', label: 'May' }, { value: '06', label: 'Jun' },
  { value: '07', label: 'Jul' }, { value: '08', label: 'Aug' }, { value: '09', label: 'Sep' },
  { value: '10', label: 'Oct' }, { value: '11', label: 'Nov' }, { value: '12', label: 'Dec' }
];

const CareHomeDetailsModal: React.FC<{ 
  careHome: User; 
  onClose: () => void; 
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
}> = ({ careHome, onClose, onApprove, onReject }) => {
  const isApproved = careHome.approved;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden relative animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="bg-slate-900 text-white p-6 flex justify-between items-start">
           <div className="flex gap-4 items-center">
              <img src={careHome.avatar} alt={careHome.name} className="w-16 h-16 rounded-lg border-2 border-slate-700 bg-white object-cover"/>
              <div>
                <h2 className="text-2xl font-bold">{careHome.name}</h2>
                {isApproved ? (
                   <span className="inline-block bg-green-500/20 text-green-200 text-xs px-2 py-0.5 rounded border border-green-500/30 mt-1">
                     Verified Account
                   </span>
                ) : (
                   <span className="inline-block bg-orange-500/20 text-orange-200 text-xs px-2 py-0.5 rounded border border-orange-500/30 mt-1">
                     Pending Approval
                   </span>
                )}
              </div>
           </div>
           <button onClick={onClose} className="text-slate-400 hover:text-white transition">
             <X size={24} />
           </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-6 overflow-y-auto flex-1 space-y-8">
           
           {/* Contact Information */}
           <section>
              <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4 border-b border-slate-100 pb-2">Contact Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div className="flex items-start gap-3">
                    <div className="bg-indigo-50 p-2 rounded text-indigo-600"><UserIcon size={20} /></div>
                    <div>
                       <p className="text-xs text-gray-500">Manager / Contact</p>
                       <p className="font-medium text-gray-900">{careHome.contactPerson || 'N/A'}</p>
                    </div>
                 </div>
                 <div className="flex items-start gap-3">
                    <div className="bg-indigo-50 p-2 rounded text-indigo-600"><Phone size={20} /></div>
                    <div>
                       <p className="text-xs text-gray-500">Phone Number</p>
                       <p className="font-medium text-gray-900">{careHome.phoneNumber || 'N/A'}</p>
                    </div>
                 </div>
                 <div className="flex items-start gap-3">
                    <div className="bg-indigo-50 p-2 rounded text-indigo-600"><Smartphone size={20} /></div>
                    <div>
                       <p className="text-xs text-gray-500">Mobile Number</p>
                       <p className="font-medium text-gray-900">{careHome.mobileNumber || 'N/A'}</p>
                    </div>
                 </div>
              </div>
           </section>

           {/* Location */}
           <section>
              <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4 border-b border-slate-100 pb-2">Location</h3>
              <div className="flex items-start gap-3">
                 <div className="bg-teal-50 p-2 rounded text-teal-600"><MapPin size={20} /></div>
                 <div>
                    <p className="text-xs text-gray-500">Address Details</p>
                    {careHome.address && <p className="font-medium text-gray-900">{careHome.address}</p>}
                    <p className="font-medium text-gray-900">{careHome.city || 'Unknown City'}</p>
                    <p className="text-gray-600">{careHome.postCode || 'Unknown Postcode'}</p>
                 </div>
              </div>
           </section>

           {/* Facility Details */}
           <section>
              <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4 border-b border-slate-100 pb-2">Facility Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                 <div className="flex items-start gap-3">
                    <div className="bg-orange-50 p-2 rounded text-orange-600"><Activity size={20} /></div>
                    <div>
                       <p className="text-xs text-gray-500">Care Type</p>
                       <p className="font-medium text-gray-900">{careHome.careType || 'General Care'}</p>
                    </div>
                 </div>
                 <div className="flex items-start gap-3">
                    <div className="bg-orange-50 p-2 rounded text-orange-600"><Car size={20} /></div>
                    <div>
                       <p className="text-xs text-gray-500">Parking</p>
                       <p className="font-medium text-gray-900">{careHome.hasParking ? 'Available On-site' : 'No Parking Available'}</p>
                    </div>
                 </div>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                <p className="text-xs text-gray-500 mb-1 font-bold">ABOUT US</p>
                <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-wrap">{careHome.description || 'No description provided.'}</p>
              </div>
           </section>

        </div>

        {/* Footer Actions */}
        <div className="p-6 border-t border-gray-100 bg-gray-50 flex justify-end gap-3">
           <button 
             onClick={() => onReject(careHome.id)}
             className="px-6 py-2 border border-red-200 text-red-700 rounded-lg hover:bg-red-50 transition font-medium flex items-center gap-2"
           >
              {isApproved ? <Trash2 size={18} /> : <XCircle size={18} />} 
              {isApproved ? 'Remove Account' : 'Reject Application'}
           </button>
           {!isApproved && (
             <button 
               onClick={() => onApprove(careHome.id)}
               className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition shadow-sm shadow-indigo-200 font-medium flex items-center gap-2"
             >
                <CheckCircle size={18} /> Approve Application
             </button>
           )}
        </div>
      </div>
    </div>
  );
};

const WorkerDetailsModal: React.FC<{ 
  worker: WorkerProfile; 
  onClose: () => void; 
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
}> = ({ worker, onClose, onApprove, onReject }) => {
  const isApproved = worker.approved;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden relative animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="bg-slate-900 text-white p-6 flex justify-between items-start">
           <div className="flex gap-4 items-center">
              <img src={worker.avatar} alt={worker.name} className="w-16 h-16 rounded-full border-2 border-slate-700 bg-white object-cover"/>
              <div>
                <h2 className="text-2xl font-bold">{worker.name}</h2>
                <div className="flex gap-2 mt-1">
                   {isApproved ? (
                      <span className="inline-block bg-green-500/20 text-green-200 text-xs px-2 py-0.5 rounded border border-green-500/30">
                        Verified Worker
                      </span>
                   ) : (
                      <span className="inline-block bg-orange-500/20 text-orange-200 text-xs px-2 py-0.5 rounded border border-orange-500/30">
                        Pending Verification
                      </span>
                   )}
                   <span className="inline-block bg-blue-500/20 text-blue-200 text-xs px-2 py-0.5 rounded border border-blue-500/30">
                      £{worker.hourlyRate}/hr
                   </span>
                </div>
              </div>
           </div>
           <button onClick={onClose} className="text-slate-400 hover:text-white transition">
             <X size={24} />
           </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-6 overflow-y-auto flex-1 space-y-8">
           
           {/* Contact Information */}
           <section>
              <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4 border-b border-slate-100 pb-2">Contact Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div className="flex items-start gap-3">
                    <div className="bg-indigo-50 p-2 rounded text-indigo-600"><Mail size={20} /></div>
                    <div>
                       <p className="text-xs text-gray-500">Email Address</p>
                       <p className="font-medium text-gray-900">{worker.email || 'N/A'}</p>
                    </div>
                 </div>
                 <div className="flex items-start gap-3">
                    <div className="bg-indigo-50 p-2 rounded text-indigo-600"><UserIcon size={20} /></div>
                    <div>
                       <p className="text-xs text-gray-500">Gender</p>
                       <p className="font-medium text-gray-900">{worker.gender || 'Not Specified'}</p>
                    </div>
                 </div>
                 <div className="flex items-start gap-3">
                    <div className="bg-indigo-50 p-2 rounded text-indigo-600"><Smartphone size={20} /></div>
                    <div>
                       <p className="text-xs text-gray-500">Mobile Number</p>
                       <p className="font-medium text-gray-900">{worker.mobileNumber || 'N/A'}</p>
                    </div>
                 </div>
                 <div className="flex items-start gap-3">
                    <div className="bg-teal-50 p-2 rounded text-teal-600"><MapPin size={20} /></div>
                    <div>
                       <p className="text-xs text-gray-500">Location</p>
                       <p className="font-medium text-gray-900">
                          {worker.address && <span className="block">{worker.address}</span>}
                          {worker.city || 'Unknown'}, {worker.postCode || ''}
                       </p>
                    </div>
                 </div>
              </div>
           </section>

           {/* Professional Details */}
           <section>
              <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4 border-b border-slate-100 pb-2">Professional Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                 <div className="flex items-start gap-3">
                    <div className="bg-blue-50 p-2 rounded text-blue-600"><Globe size={20} /></div>
                    <div>
                       <p className="text-xs text-gray-500">Visa Status</p>
                       <p className="font-medium text-gray-900">{worker.visaStatus || 'Not Specified'}</p>
                    </div>
                 </div>
                 <div className="flex items-start gap-3">
                    <div className="bg-blue-50 p-2 rounded text-blue-600"><Globe size={20} /></div>
                    <div>
                       <p className="text-xs text-gray-500">Ethnicity</p>
                       <p className="font-medium text-gray-900">{worker.ethnicity || 'Not Specified'}</p>
                    </div>
                 </div>
                 <div className="flex items-start gap-3">
                    <div className="bg-blue-50 p-2 rounded text-blue-600"><Car size={20} /></div>
                    <div>
                       <p className="text-xs text-gray-500">Driving Licence</p>
                       <p className="font-medium text-gray-900">
                          {worker.drivingLicenceNumber ? `Yes - ${worker.drivingLicenceNumber}` : 'No Driving Licence'}
                       </p>
                    </div>
                 </div>
              </div>
              
              <div className="mb-4">
                 <p className="text-xs text-gray-500 mb-2 font-bold uppercase">Skills</p>
                 <div className="flex flex-wrap gap-2">
                    {worker.skills.map((skill, idx) => (
                       <span key={idx} className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm font-medium">
                          {skill}
                       </span>
                    ))}
                    {worker.skills.length === 0 && <span className="text-gray-400 text-sm italic">No skills listed</span>}
                 </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                <p className="text-xs text-gray-500 mb-1 font-bold uppercase">Professional Bio</p>
                <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-wrap">{worker.bio || 'No bio provided.'}</p>
              </div>
           </section>

           {/* Documents */}
           <section>
              <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4 border-b border-slate-100 pb-2">Documents</h3>
              <div className="space-y-3">
                 {worker.documents.map((doc, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg">
                       <div className="flex items-center gap-3">
                          <div className={`p-2 rounded ${doc.verified ? 'bg-green-50 text-green-600' : 'bg-yellow-50 text-yellow-600'}`}>
                             <FileText size={18} />
                          </div>
                          <div>
                             <p className="font-medium text-sm text-gray-900">{doc.name}</p>
                             <p className="text-xs text-gray-500 uppercase">{doc.type}</p>
                          </div>
                       </div>
                       <div>
                          {doc.verified ? (
                             <span className="flex items-center text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded">
                                <CheckCircle size={12} className="mr-1"/> Verified
                             </span>
                          ) : (
                             <span className="flex items-center text-xs font-bold text-yellow-600 bg-yellow-50 px-2 py-1 rounded">
                                <AlertCircle size={12} className="mr-1"/> Pending
                             </span>
                          )}
                       </div>
                    </div>
                 ))}
                 {worker.documents.length === 0 && <p className="text-sm text-gray-500 italic">No documents uploaded.</p>}
              </div>
           </section>

        </div>

        {/* Footer Actions */}
        <div className="p-6 border-t border-gray-100 bg-gray-50 flex justify-end gap-3">
           <button 
             onClick={() => onReject(worker.id)}
             className="px-6 py-2 border border-red-200 text-red-700 rounded-lg hover:bg-red-50 transition font-medium flex items-center gap-2"
           >
              {isApproved ? <Trash2 size={18} /> : <XCircle size={18} />} 
              {isApproved ? 'Remove Account' : 'Reject Application'}
           </button>
           {!isApproved && (
             <button 
               onClick={() => onApprove(worker.id)}
               className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition shadow-sm shadow-indigo-200 font-medium flex items-center gap-2"
             >
                <CheckCircle size={18} /> Approve Application
             </button>
           )}
        </div>
      </div>
    </div>
  );
};

const AdminShiftDetailsModal: React.FC<{ 
  shift: Shift; 
  worker?: WorkerProfile;
  onClose: () => void;
}> = ({ shift, worker, onClose }) => {
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
                 <span className="text-xs text-slate-500">ID: {shift.id}</span>
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
                    <Calendar size={18} className="mr-2 text-indigo-600"/>
                    {shift.date}
                 </div>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                 <p className="text-xs text-gray-500 uppercase font-bold mb-1">Time</p>
                 <div className="flex items-center text-gray-900 font-medium">
                    <Clock size={18} className="mr-2 text-indigo-600"/>
                    {shift.startTime} <span className="text-gray-400 ml-1 text-xs">({shift.durationHours} hrs)</span>
                 </div>
              </div>
           </div>
           
           {/* Location & Care Home */}
           <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
              <p className="text-xs text-gray-500 uppercase font-bold mb-2">Care Home Details</p>
              <div className="flex items-center gap-3 mb-2">
                 <Building2 size={18} className="text-indigo-600"/>
                 <div>
                    <p className="text-sm font-bold text-gray-900">{shift.careHomeName}</p>
                    <p className="text-xs text-gray-500">Care Home ID: {shift.careHomeId}</p>
                 </div>
              </div>
              <div className="flex items-start gap-3">
                 <MapPin size={18} className="text-indigo-600 mt-0.5"/>
                 <p className="text-sm text-gray-700">{shift.location}</p>
              </div>
           </div>

           {/* Cost */}
           <div className="flex items-center justify-between p-4 border border-indigo-100 bg-indigo-50 rounded-lg">
              <div>
                 <p className="text-xs text-indigo-600 font-bold uppercase">Total Cost</p>
                 <p className="text-xl font-bold text-indigo-900">£{(shift.hourlyRate * shift.durationHours).toFixed(2)}</p>
              </div>
              <div className="text-right">
                 <p className="text-xs text-indigo-600 font-bold uppercase">Rate</p>
                 <p className="text-sm font-medium text-indigo-900">£{shift.hourlyRate}/hr</p>
              </div>
           </div>

           {/* Assigned Worker */}
           {worker ? (
             <div>
                <p className="text-xs text-gray-500 uppercase font-bold mb-2">Assigned Care Worker</p>
                <div className="flex items-center gap-4 bg-white border border-gray-200 p-4 rounded-xl shadow-sm">
                   <img src={worker.avatar} alt={worker.name} className="w-12 h-12 rounded-full object-cover border border-gray-200"/>
                   <div className="flex-1">
                      <p className="font-bold text-gray-900 text-sm">{worker.name}</p>
                      <p className="text-xs text-gray-500">Worker ID: {worker.id}</p>
                      <div className="flex items-center text-xs text-gray-500 mt-1">
                         <Phone size={12} className="mr-1"/> {worker.mobileNumber || 'No phone'}
                      </div>
                   </div>
                </div>
             </div>
           ) : (
               shift.workerId ? (
                   <div className="p-4 bg-gray-50 rounded-lg border border-dashed border-gray-300 text-center">
                      <p className="text-sm text-gray-500">Worker ID: {shift.workerId} (Profile not found in active list)</p>
                   </div>
               ) : (
                   <div className="p-4 bg-gray-50 rounded-lg border border-dashed border-gray-300 text-center">
                      <p className="text-sm text-gray-500">No worker assigned</p>
                   </div>
               )
           )}

           {/* Feedback */}
           {shift.status === ShiftStatus.CLOSED && shift.feedback && (
               <div className="border-t border-gray-100 pt-4">
                  <p className="text-xs text-gray-500 uppercase font-bold mb-3">Feedback & Ratings</p>
                  
                  {shift.feedback.homeToWorker !== undefined && (
                      <div className="mb-3">
                         <p className="text-xs text-gray-600 mb-1">Care Home &rarr; Worker</p>
                         <div className="flex items-center gap-2">
                             <StarRating rating={shift.feedback.homeToWorker} size={14} />
                             <span className="text-sm font-bold">{shift.feedback.homeToWorker}/5</span>
                         </div>
                         {shift.feedback.homeToWorkerComment && <p className="text-sm text-gray-600 italic mt-1">"{shift.feedback.homeToWorkerComment}"</p>}
                      </div>
                  )}

                  {shift.feedback.workerToHome !== undefined && (
                      <div>
                         <p className="text-xs text-gray-600 mb-1">Worker &rarr; Care Home</p>
                         <div className="flex items-center gap-2">
                             <StarRating rating={shift.feedback.workerToHome} size={14} />
                             <span className="text-sm font-bold">{shift.feedback.workerToHome}/5</span>
                         </div>
                      </div>
                  )}
               </div>
           )}
        </div>
      </div>
    </div>
  );
};

export const SuperAdminDashboard: React.FC<SuperAdminDashboardProps> = ({
  careHomes,
  workers,
  shifts,
  onApprove,
  onReject,
  onLogout
}) => {
  const [activeTab, setActiveTab] = useState<'homes' | 'workers' | 'shifts'>('homes');
  const [filterStatus, setFilterStatus] = useState<'pending' | 'approved'>('pending');
  const [selectedCareHome, setSelectedCareHome] = useState<User | null>(null);
  const [selectedWorker, setSelectedWorker] = useState<WorkerProfile | null>(null);
  const [selectedShift, setSelectedShift] = useState<Shift | null>(null);
  const [shiftSearch, setShiftSearch] = useState('');
  const [shiftFilter, setShiftFilter] = useState<'ALL' | 'OPEN' | 'ACTIVE' | 'CLOSED'>('ALL');
  const [shiftFilterYear, setShiftFilterYear] = useState<string>('ALL');
  const [shiftFilterMonth, setShiftFilterMonth] = useState<string>('ALL');

  // Derived Statistics
  const pendingHomes = careHomes.filter(h => !h.approved);
  const approvedHomes = careHomes.filter(h => h.approved);
  const pendingWorkers = workers.filter(w => !w.approved);
  const approvedWorkers = workers.filter(w => w.approved);
  
  // Shift Stats
  const openShifts = shifts.filter(s => s.status === ShiftStatus.OPEN);
  const activeShifts = shifts.filter(s => [ShiftStatus.BOOKED, ShiftStatus.IN_PROGRESS].includes(s.status));
  const completedShifts = shifts.filter(s => s.status === ShiftStatus.CLOSED || s.status === ShiftStatus.COMPLETED_PENDING_APPROVAL);

  // Filtered Lists for Admin Views
  const displayedHomes = filterStatus === 'pending' ? pendingHomes : approvedHomes;
  const displayedWorkers = filterStatus === 'pending' ? pendingWorkers : approvedWorkers;

  // Compute available years for registry
  const availableYears = Array.from(new Set(shifts.map(s => s.date.split('-')[0]))).sort().reverse();

  // Filter shifts for registry view
  const filteredShifts = shifts.filter(s => {
      const matchesSearch = s.title.toLowerCase().includes(shiftSearch.toLowerCase()) || 
                            s.careHomeName.toLowerCase().includes(shiftSearch.toLowerCase()) ||
                            s.location.toLowerCase().includes(shiftSearch.toLowerCase());
      
      let matchesFilter = true;
      if (shiftFilter === 'OPEN') matchesFilter = s.status === ShiftStatus.OPEN;
      if (shiftFilter === 'ACTIVE') matchesFilter = [ShiftStatus.BOOKED, ShiftStatus.IN_PROGRESS, ShiftStatus.PENDING_ACCEPTANCE].includes(s.status);
      if (shiftFilter === 'CLOSED') matchesFilter = [ShiftStatus.CLOSED, ShiftStatus.COMPLETED_PENDING_APPROVAL].includes(s.status);

      // Date Filtering
      let matchesDate = true;
      if (shiftFilterYear !== 'ALL' && !s.date.startsWith(shiftFilterYear)) matchesDate = false;
      if (shiftFilterMonth !== 'ALL' && s.date.split('-')[1] !== shiftFilterMonth) matchesDate = false;

      return matchesSearch && matchesFilter && matchesDate;
  });

  const handleApproveCareHomeFromModal = (id: string) => {
    onApprove(id, UserRole.CARE_HOME);
    setSelectedCareHome(null);
  };

  const handleRejectCareHomeFromModal = (id: string) => {
    onReject(id, UserRole.CARE_HOME);
    setSelectedCareHome(null);
  };

  const handleApproveWorkerFromModal = (id: string) => {
    onApprove(id, UserRole.WORKER);
    setSelectedWorker(null);
  };

  const handleRejectWorkerFromModal = (id: string) => {
    onReject(id, UserRole.WORKER);
    setSelectedWorker(null);
  };

  const setView = (tab: 'homes' | 'workers', status: 'pending' | 'approved') => {
    setActiveTab(tab);
    setFilterStatus(status);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-slate-900 text-white p-4 shadow-lg sticky top-0 z-30">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
             <div className="bg-indigo-500 p-2 rounded-lg">
                <ShieldCheck size={24} className="text-white" />
             </div>
             <div>
                <h1 className="text-xl font-bold">Admin Portal</h1>
                <p className="text-xs text-slate-400">CareShifts Verification System</p>
             </div>
          </div>
          <button 
             onClick={onLogout}
             className="text-sm bg-slate-800 hover:bg-slate-700 px-4 py-2 rounded-lg transition"
          >
             Log Out
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-6">
         
         {/* Statistics Overview */}
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
            <button 
              onClick={() => setView('homes', 'pending')}
              className={`p-6 rounded-xl border transition text-left flex items-center justify-between group ${activeTab === 'homes' && filterStatus === 'pending' ? 'bg-white border-orange-500 ring-1 ring-orange-500 shadow-md' : 'bg-white border-slate-200 hover:border-slate-300'}`}
            >
              <div>
                 <p className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Pending Homes</p>
                 <h3 className="text-3xl font-bold text-slate-800">{pendingHomes.length}</h3>
              </div>
              <div className={`p-3 rounded-lg ${activeTab === 'homes' && filterStatus === 'pending' ? 'bg-orange-50 text-orange-600' : 'bg-slate-100 text-slate-400 group-hover:bg-slate-200'}`}>
                 <Building2 size={24} />
              </div>
            </button>

            <button 
              onClick={() => setView('homes', 'approved')}
              className={`p-6 rounded-xl border transition text-left flex items-center justify-between group ${activeTab === 'homes' && filterStatus === 'approved' ? 'bg-white border-teal-500 ring-1 ring-teal-500 shadow-md' : 'bg-white border-slate-200 hover:border-slate-300'}`}
            >
              <div>
                 <p className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Approved Homes</p>
                 <h3 className="text-3xl font-bold text-slate-800">{approvedHomes.length}</h3>
              </div>
              <div className={`p-3 rounded-lg ${activeTab === 'homes' && filterStatus === 'approved' ? 'bg-teal-50 text-teal-600' : 'bg-slate-100 text-slate-400 group-hover:bg-slate-200'}`}>
                 <CheckCircle size={24} />
              </div>
            </button>

            <button 
              onClick={() => setView('workers', 'pending')}
              className={`p-6 rounded-xl border transition text-left flex items-center justify-between group ${activeTab === 'workers' && filterStatus === 'pending' ? 'bg-white border-orange-500 ring-1 ring-orange-500 shadow-md' : 'bg-white border-slate-200 hover:border-slate-300'}`}
            >
              <div>
                 <p className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Pending Workers</p>
                 <h3 className="text-3xl font-bold text-slate-800">{pendingWorkers.length}</h3>
              </div>
              <div className={`p-3 rounded-lg ${activeTab === 'workers' && filterStatus === 'pending' ? 'bg-orange-50 text-orange-600' : 'bg-slate-100 text-slate-400 group-hover:bg-slate-200'}`}>
                 <UserIcon size={24} />
              </div>
            </button>

            <button 
              onClick={() => setView('workers', 'approved')}
              className={`p-6 rounded-xl border transition text-left flex items-center justify-between group ${activeTab === 'workers' && filterStatus === 'approved' ? 'bg-white border-blue-500 ring-1 ring-blue-500 shadow-md' : 'bg-white border-slate-200 hover:border-slate-300'}`}
            >
              <div>
                 <p className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Approved Workers</p>
                 <h3 className="text-3xl font-bold text-slate-800">{approvedWorkers.length}</h3>
              </div>
              <div className={`p-3 rounded-lg ${activeTab === 'workers' && filterStatus === 'approved' ? 'bg-blue-50 text-blue-600' : 'bg-slate-100 text-slate-400 group-hover:bg-slate-200'}`}>
                 <CheckCircle size={24} />
              </div>
            </button>

            <button 
              onClick={() => setActiveTab('shifts')}
              className={`p-6 rounded-xl border transition text-left flex items-center justify-between group ${activeTab === 'shifts' ? 'bg-white border-indigo-500 ring-1 ring-indigo-500 shadow-md' : 'bg-white border-slate-200 hover:border-slate-300'}`}
            >
              <div>
                 <p className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Shift Activity</p>
                 <h3 className="text-3xl font-bold text-slate-800">{shifts.length}</h3>
              </div>
              <div className={`p-3 rounded-lg ${activeTab === 'shifts' ? 'bg-indigo-50 text-indigo-600' : 'bg-slate-100 text-slate-400 group-hover:bg-slate-200'}`}>
                 <Activity size={24} />
              </div>
            </button>
         </div>

         {/* Section Header */}
         <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
              {activeTab === 'homes' && <Building2 className="text-slate-400"/>}
              {activeTab === 'workers' && <UserIcon className="text-slate-400"/>}
              {activeTab === 'shifts' && <Activity className="text-slate-400"/>}
              
              {activeTab === 'homes' && (filterStatus === 'pending' ? 'Pending Applications' : 'Approved Accounts')}
              {activeTab === 'workers' && (filterStatus === 'pending' ? 'Pending Applications' : 'Approved Accounts')}
              {activeTab === 'shifts' && 'Platform Activity Summary'}
              
              <span className="text-sm font-normal text-slate-400 ml-2">
                ({activeTab === 'homes' ? displayedHomes.length : activeTab === 'workers' ? displayedWorkers.length : shifts.length})
              </span>
            </h2>
         </div>

         {/* SHIFT ACTIVITY TAB */}
         {activeTab === 'shifts' && (
           <div className="space-y-8">
             {/* KPI Cards for Shifts */}
             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-center gap-4">
                  <div className="bg-blue-50 p-3 rounded-full text-blue-600"><FileText size={24}/></div>
                  <div>
                    <p className="text-sm text-gray-500 font-medium">Open Shifts</p>
                    <p className="text-2xl font-bold text-gray-900">{openShifts.length}</p>
                    <p className="text-xs text-blue-500">Needing coverage</p>
                  </div>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-center gap-4">
                  <div className="bg-green-50 p-3 rounded-full text-green-600"><CheckCircle size={24}/></div>
                  <div>
                    <p className="text-sm text-gray-500 font-medium">Completed Shifts</p>
                    <p className="text-2xl font-bold text-gray-900">{completedShifts.length}</p>
                    <p className="text-xs text-green-500">Successfully delivered</p>
                  </div>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-center gap-4">
                  <div className="bg-purple-50 p-3 rounded-full text-purple-600"><Activity size={24}/></div>
                  <div>
                    <p className="text-sm text-gray-500 font-medium">Active / Booked</p>
                    <p className="text-2xl font-bold text-gray-900">{activeShifts.length}</p>
                    <p className="text-xs text-purple-500">Currently scheduled</p>
                  </div>
                </div>
             </div>

             {/* SHIFT REGISTRY TABLE */}
             <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="p-4 border-b border-slate-100 bg-slate-50 flex flex-col xl:flex-row justify-between items-start xl:items-center gap-4">
                   <h3 className="font-bold text-slate-800 flex items-center gap-2 mb-2 xl:mb-0">
                     <FileText size={16} className="text-slate-500"/> All Shifts Registry
                   </h3>
                   
                   <div className="flex flex-col sm:flex-row gap-2 w-full xl:w-auto">
                      <div className="relative flex-1 sm:w-64">
                         <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14}/>
                         <input 
                            type="text" 
                            placeholder="Search shifts..." 
                            className="w-full pl-9 pr-3 py-1.5 text-sm border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500 bg-white text-slate-900"
                            value={shiftSearch}
                            onChange={(e) => setShiftSearch(e.target.value)}
                         />
                      </div>
                      
                      <div className="flex gap-2">
                          <div className="flex items-center gap-1 bg-white border border-slate-200 rounded-lg px-2">
                            <Filter size={14} className="text-slate-400" />
                            <select 
                                className="py-1.5 text-sm bg-transparent outline-none text-slate-900"
                                value={shiftFilterMonth}
                                onChange={(e) => setShiftFilterMonth(e.target.value)}
                            >
                                <option value="ALL">All Months</option>
                                {MONTHS.map(m => <option key={m.value} value={m.value}>{m.label}</option>)}
                            </select>
                            <div className="w-px h-4 bg-slate-200"></div>
                            <select 
                                className="py-1.5 text-sm bg-transparent outline-none text-slate-900"
                                value={shiftFilterYear}
                                onChange={(e) => setShiftFilterYear(e.target.value)}
                            >
                                <option value="ALL">All Years</option>
                                {availableYears.map(y => <option key={y} value={y}>{y}</option>)}
                            </select>
                          </div>

                          <select 
                             className="px-3 py-1.5 text-sm border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500 bg-white text-slate-900"
                             value={shiftFilter}
                             onChange={(e) => setShiftFilter(e.target.value as any)}
                          >
                             <option value="ALL">All Statuses</option>
                             <option value="OPEN">Open</option>
                             <option value="ACTIVE">Active</option>
                             <option value="CLOSED">Completed</option>
                          </select>
                      </div>
                   </div>
                </div>
                
                <div className="overflow-x-auto">
                   <table className="w-full text-left text-sm text-slate-600">
                      <thead className="bg-slate-50 text-slate-500 uppercase font-medium text-xs border-b border-slate-100">
                         <tr>
                            <th className="px-6 py-3">Shift Title</th>
                            <th className="px-6 py-3">Care Home</th>
                            <th className="px-6 py-3">Date/Time</th>
                            <th className="px-6 py-3">Status</th>
                            <th className="px-6 py-3 text-right">Action</th>
                         </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-50">
                         {filteredShifts.length === 0 ? (
                            <tr><td colSpan={5} className="px-6 py-8 text-center text-slate-400 italic">No shifts found matching your criteria.</td></tr>
                         ) : (
                            filteredShifts.map(shift => (
                               <tr key={shift.id} className="hover:bg-slate-50 transition cursor-pointer" onClick={() => setSelectedShift(shift)}>
                                  <td className="px-6 py-4 font-medium text-slate-900">{shift.title}</td>
                                  <td className="px-6 py-4">{shift.careHomeName}</td>
                                  <td className="px-6 py-4">
                                     <div className="flex flex-col text-xs">
                                        <span>{shift.date}</span>
                                        <span className="text-slate-400">{shift.startTime} ({shift.durationHours}h)</span>
                                     </div>
                                  </td>
                                  <td className="px-6 py-4">
                                     <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${
                                        shift.status === ShiftStatus.OPEN ? 'bg-orange-100 text-orange-700' :
                                        shift.status === ShiftStatus.CLOSED ? 'bg-green-100 text-green-700' :
                                        'bg-blue-100 text-blue-700'
                                     }`}>
                                        {shift.status.replace(/_/g, ' ')}
                                     </span>
                                  </td>
                                  <td className="px-6 py-4 text-right">
                                     <button className="text-indigo-600 hover:text-indigo-800 font-medium text-xs">View Details</button>
                                  </td>
                               </tr>
                            ))
                         )}
                      </tbody>
                   </table>
                </div>
             </div>
           </div>
         )}

         {/* Content List for Homes/Workers */}
         {activeTab === 'homes' && (
            <div className="space-y-4">
               {displayedHomes.length === 0 ? (
                 <div className="text-center py-20 text-slate-400 bg-white rounded-xl shadow-sm border border-slate-200">
                    <Building2 size={48} className="mx-auto mb-4 opacity-20" />
                    <p>No {filterStatus} care homes found.</p>
                 </div>
               ) : (
                 displayedHomes.map(home => (
                    <div key={home.id} className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 hover:shadow-md transition">
                       <div className="flex items-start gap-4 flex-1">
                          <div className="relative">
                            <img src={home.avatar} alt={home.name} className="w-16 h-16 rounded-lg object-cover bg-slate-100" />
                            {home.approved && <div className="absolute -bottom-1 -right-1 bg-teal-500 text-white p-0.5 rounded-full border-2 border-white"><CheckCircle size={12}/></div>}
                          </div>
                          <div>
                             <h3 className="text-lg font-bold text-slate-900">{home.name}</h3>
                             <div className="flex items-center text-slate-500 text-sm mb-2">
                                <MapPin size={14} className="mr-1" /> {home.city || home.location}
                             </div>
                             <div className="flex gap-2">
                                <span className="text-xs bg-slate-100 px-2 py-1 rounded text-slate-600">{home.careType}</span>
                                {home.hasParking && <span className="text-xs bg-slate-100 px-2 py-1 rounded text-slate-600">Parking</span>}
                             </div>
                             <button 
                                onClick={() => setSelectedCareHome(home)}
                                className="text-sm text-indigo-600 font-medium mt-3 hover:text-indigo-800 flex items-center gap-1"
                             >
                               <Eye size={14} /> View Full Details
                             </button>
                          </div>
                       </div>
                       <div className="flex gap-3 w-full md:w-auto">
                          <button 
                            onClick={() => onReject(home.id, UserRole.CARE_HOME)}
                            className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 border border-red-200 text-red-700 rounded-lg hover:bg-red-50 transition text-sm"
                          >
                             {home.approved ? <Trash2 size={16} /> : <XCircle size={16} />} 
                             {home.approved ? 'Remove' : 'Reject'}
                          </button>
                          {!home.approved && (
                            <button 
                                onClick={() => onApprove(home.id, UserRole.CARE_HOME)}
                                className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition shadow-sm shadow-indigo-200 text-sm"
                            >
                                <CheckCircle size={16} /> Approve
                            </button>
                          )}
                       </div>
                    </div>
                 ))
               )}
            </div>
         )}

         {activeTab === 'workers' && (
            <div className="space-y-4">
               {displayedWorkers.length === 0 ? (
                 <div className="text-center py-20 text-slate-400 bg-white rounded-xl shadow-sm border border-slate-200">
                    <UserIcon size={48} className="mx-auto mb-4 opacity-20" />
                    <p>No {filterStatus} workers found.</p>
                 </div>
               ) : (
                 displayedWorkers.map(worker => (
                    <div key={worker.id} className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 hover:shadow-md transition">
                       <div className="flex items-start gap-4">
                          <div className="relative">
                             <img src={worker.avatar} alt={worker.name} className="w-16 h-16 rounded-full object-cover bg-slate-100" />
                             {worker.approved && <div className="absolute -bottom-1 -right-1 bg-blue-500 text-white p-0.5 rounded-full border-2 border-white"><CheckCircle size={12}/></div>}
                          </div>
                          <div>
                             <h3 className="text-lg font-bold text-slate-900">{worker.name}</h3>
                             <div className="flex items-center text-slate-500 text-sm mb-2">
                                <MapPin size={14} className="mr-1" /> {worker.location}
                                <span className="mx-2">•</span>
                                <span className="font-semibold text-slate-700">£{worker.hourlyRate}/hr</span>
                             </div>
                             <p className="text-sm text-slate-600 mb-2 max-w-xl line-clamp-2">{worker.bio}</p>
                             <div className="flex flex-wrap gap-2 mb-2">
                                {worker.skills.slice(0, 3).map((s, i) => (
                                    <span key={i} className="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded border border-blue-100">{s}</span>
                                ))}
                                {worker.skills.length > 3 && <span className="text-xs text-gray-400 pt-0.5">+{worker.skills.length - 3} more</span>}
                             </div>
                             
                             <button 
                                onClick={() => setSelectedWorker(worker)}
                                className="text-sm text-indigo-600 font-medium mt-2 hover:text-indigo-800 flex items-center gap-1"
                             >
                               <Eye size={14} /> View Full Details
                             </button>
                          </div>
                       </div>
                       <div className="flex gap-3 w-full md:w-auto">
                          <button 
                            onClick={() => onReject(worker.id, UserRole.WORKER)}
                            className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 border border-red-200 text-red-700 rounded-lg hover:bg-red-50 transition text-sm"
                          >
                             {worker.approved ? <Trash2 size={16} /> : <XCircle size={16} />} 
                             {worker.approved ? 'Remove' : 'Reject'}
                          </button>
                          {!worker.approved && (
                            <button 
                                onClick={() => onApprove(worker.id, UserRole.WORKER)}
                                className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition shadow-sm shadow-indigo-200 text-sm"
                            >
                                <CheckCircle size={16} /> Approve
                            </button>
                          )}
                       </div>
                    </div>
                 ))
               )}
            </div>
         )}
      </div>

      {selectedCareHome && (
        <CareHomeDetailsModal 
          careHome={selectedCareHome}
          onClose={() => setSelectedCareHome(null)}
          onApprove={handleApproveCareHomeFromModal}
          onReject={handleRejectCareHomeFromModal}
        />
      )}

      {selectedWorker && (
        <WorkerDetailsModal 
          worker={selectedWorker}
          onClose={() => setSelectedWorker(null)}
          onApprove={handleApproveWorkerFromModal}
          onReject={handleRejectWorkerFromModal}
        />
      )}

      {selectedShift && (
         <AdminShiftDetailsModal 
            shift={selectedShift}
            worker={workers.find(w => w.id === selectedShift.workerId)}
            onClose={() => setSelectedShift(null)}
         />
      )}
    </div>
  );
};