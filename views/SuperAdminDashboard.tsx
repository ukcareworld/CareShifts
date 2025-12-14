import React, { useState } from 'react';
import { User, WorkerProfile, UserRole } from '../types';
import { CheckCircle, XCircle, ShieldCheck, Building2, User as UserIcon, MapPin, FileText, X, Phone, Smartphone, Car, Activity, Eye, Trash2, AlertCircle, Mail, Globe, Award } from 'lucide-react';

interface SuperAdminDashboardProps {
  careHomes: User[];
  workers: WorkerProfile[];
  onApprove: (id: string, type: UserRole) => void;
  onReject: (id: string, type: UserRole) => void;
  onLogout: () => void;
}

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

export const SuperAdminDashboard: React.FC<SuperAdminDashboardProps> = ({
  careHomes,
  workers,
  onApprove,
  onReject,
  onLogout
}) => {
  const [activeTab, setActiveTab] = useState<'homes' | 'workers'>('homes');
  const [filterStatus, setFilterStatus] = useState<'pending' | 'approved'>('pending');
  const [selectedCareHome, setSelectedCareHome] = useState<User | null>(null);
  const [selectedWorker, setSelectedWorker] = useState<WorkerProfile | null>(null);

  // Derived Statistics
  const pendingHomes = careHomes.filter(h => !h.approved);
  const approvedHomes = careHomes.filter(h => h.approved);
  const pendingWorkers = workers.filter(w => !w.approved);
  const approvedWorkers = workers.filter(w => w.approved);

  // Filtered Lists
  const displayedHomes = filterStatus === 'pending' ? pendingHomes : approvedHomes;
  const displayedWorkers = filterStatus === 'pending' ? pendingWorkers : approvedWorkers;

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
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
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
         </div>

         {/* Section Header */}
         <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
              {activeTab === 'homes' ? <Building2 className="text-slate-400"/> : <UserIcon className="text-slate-400"/>}
              {filterStatus === 'pending' ? 'Pending Applications' : 'Approved Accounts'} 
              <span className="text-sm font-normal text-slate-400 ml-2">
                ({activeTab === 'homes' ? displayedHomes.length : displayedWorkers.length})
              </span>
            </h2>
         </div>

         {/* Content List */}
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
    </div>
  );
};