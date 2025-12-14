import React, { useState } from 'react';
import { UserRole, WorkerProfile } from '../types';
import { User, MapPin, ArrowLeft, FileText, DollarSign, Briefcase, Smartphone, Car, Globe, Mail } from 'lucide-react';

interface WorkerRegistrationProps {
  onRegister: (worker: WorkerProfile) => void;
  onBack: () => void;
}

export const WorkerRegistration: React.FC<WorkerRegistrationProps> = ({ onRegister, onBack }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    gender: '',
    ethnicity: '',
    mobileNumber: '',
    address: '',
    city: '',
    postCode: '',
    bio: '',
    hourlyRate: 15,
    skills: '',
    hasDbs: false,
    hasId: false,
    hasCerts: false,
    hasDrivingLicence: false,
    drivingLicenceNumber: '',
    visaStatus: 'No Visa Needed' // Default option
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.address || !formData.city || !formData.postCode || !formData.gender || !formData.ethnicity) return;

    // Simulate creating a new worker
    const newWorker: WorkerProfile = {
      id: `w_${Date.now()}`,
      name: formData.name,
      email: formData.email,
      role: UserRole.WORKER,
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(formData.name)}&background=3B82F6&color=fff`,
      location: `${formData.city}, ${formData.postCode}`,
      address: formData.address,
      city: formData.city,
      postCode: formData.postCode,
      mobileNumber: formData.mobileNumber,
      gender: formData.gender,
      ethnicity: formData.ethnicity,
      rating: 5.0,
      totalRatings: 0,
      approved: false, // Requires admin approval
      bio: formData.bio,
      hourlyRate: Number(formData.hourlyRate),
      skills: formData.skills.split(',').map(s => s.trim()).filter(Boolean),
      drivingLicenceNumber: formData.hasDrivingLicence ? formData.drivingLicenceNumber : undefined,
      visaStatus: formData.visaStatus,
      documents: [
        { name: 'DBS Certificate', verified: false, type: 'DBS' as const },
        { name: 'ID / Passport', verified: false, type: 'ID' as const },
        { name: 'Care Certificate', verified: false, type: 'CERTIFICATE' as const }
      ].filter((_, index) => {
         if (index === 0) return formData.hasDbs;
         if (index === 1) return formData.hasId;
         if (index === 2) return formData.hasCerts;
         return false;
      })
    };

    onRegister(newWorker);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="mx-auto h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center">
             <User className="text-blue-600" size={24} />
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Worker Registration
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Sign up to find flexible care shifts in your area.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Full Name */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Full Name
              </label>
              <div className="mt-1">
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="e.g. John Doe"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email Address
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" aria-hidden="true" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md py-2"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
            </div>

             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
               {/* Gender */}
               <div>
                <label htmlFor="gender" className="block text-sm font-medium text-gray-700">
                  Gender
                </label>
                <div className="mt-1">
                  <select
                    id="gender"
                    name="gender"
                    required
                    className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                    value={formData.gender}
                    onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                  >
                    <option value="" disabled>Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                    <option value="Prefer not to say">Prefer not to say</option>
                  </select>
                </div>
              </div>

               {/* Ethnicity */}
               <div>
                <label htmlFor="ethnicity" className="block text-sm font-medium text-gray-700">
                  Ethnicity
                </label>
                <div className="mt-1">
                  <select
                    id="ethnicity"
                    name="ethnicity"
                    required
                    className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                    value={formData.ethnicity}
                    onChange={(e) => setFormData({ ...formData, ethnicity: e.target.value })}
                  >
                    <option value="" disabled>Select Ethnicity</option>
                    <option value="White">White</option>
                    <option value="Mixed / Multiple ethnic groups">Mixed / Multiple ethnic groups</option>
                    <option value="Asian / Asian British">Asian / Asian British</option>
                    <option value="Black / African / Caribbean / Black British">Black / African / Caribbean / Black British</option>
                    <option value="Other ethnic group">Other ethnic group</option>
                    <option value="Prefer not to say">Prefer not to say</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Contact & Location */}
            <div>
              <label htmlFor="mobileNumber" className="block text-sm font-medium text-gray-700">
                Mobile Number
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Smartphone className="h-5 w-5 text-gray-400" aria-hidden="true" />
                </div>
                <input
                  id="mobileNumber"
                  name="mobileNumber"
                  type="tel"
                  required
                  className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md py-2"
                  placeholder="07700 900000"
                  value={formData.mobileNumber}
                  onChange={(e) => setFormData({ ...formData, mobileNumber: e.target.value })}
                />
              </div>
            </div>

            {/* Address */}
            <div>
              <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                Street Address
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MapPin className="h-5 w-5 text-gray-400" aria-hidden="true" />
                </div>
                <input
                  id="address"
                  name="address"
                  type="text"
                  required
                  className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md py-2"
                  placeholder="e.g. 123 Worker Lane"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="city" className="block text-sm font-medium text-gray-700">
                  City
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <MapPin className="h-4 w-4 text-gray-400" aria-hidden="true" />
                  </div>
                  <input
                    id="city"
                    name="city"
                    type="text"
                    required
                    className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-9 sm:text-sm border-gray-300 rounded-md py-2"
                    placeholder="e.g. London"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  />
                </div>
              </div>
              <div>
                <label htmlFor="postCode" className="block text-sm font-medium text-gray-700">
                  Post Code
                </label>
                <input
                  id="postCode"
                  name="postCode"
                  type="text"
                  required
                  className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md py-2 px-3"
                  placeholder="e.g. SW1A 1AA"
                  value={formData.postCode}
                  onChange={(e) => setFormData({ ...formData, postCode: e.target.value })}
                />
              </div>
            </div>

            {/* Driving Licence */}
            <div className="bg-gray-50 p-3 rounded-md border border-gray-200">
                <div className="flex items-center mb-2">
                  <Car className="h-5 w-5 text-gray-500 mr-2" />
                  <span className="block text-sm font-medium text-gray-700">Full UK Driving Licence?</span>
                </div>
                <div className="flex items-center space-x-4 ml-1">
                   <label className="inline-flex items-center">
                     <input 
                       type="radio" 
                       className="form-radio text-blue-600" 
                       name="hasDrivingLicence" 
                       checked={formData.hasDrivingLicence === true}
                       onChange={() => setFormData({...formData, hasDrivingLicence: true})}
                     />
                     <span className="ml-2 text-sm text-gray-700">Yes</span>
                   </label>
                   <label className="inline-flex items-center">
                     <input 
                       type="radio" 
                       className="form-radio text-blue-600" 
                       name="hasDrivingLicence" 
                       checked={formData.hasDrivingLicence === false}
                       onChange={() => setFormData({...formData, hasDrivingLicence: false, drivingLicenceNumber: ''})}
                     />
                     <span className="ml-2 text-sm text-gray-700">No</span>
                   </label>
                </div>
                {formData.hasDrivingLicence && (
                   <div className="mt-3 animate-in fade-in slide-in-from-top-2 duration-200">
                      <label htmlFor="licenceNumber" className="block text-xs font-medium text-gray-500 uppercase">Licence Number</label>
                      <input
                        id="licenceNumber"
                        type="text"
                        className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md py-2 px-3"
                        placeholder="Enter Licence Number"
                        value={formData.drivingLicenceNumber}
                        onChange={(e) => setFormData({...formData, drivingLicenceNumber: e.target.value})}
                      />
                   </div>
                )}
            </div>

            {/* Visa Status */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Visa Status
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                 <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Globe className="h-5 w-5 text-gray-400" aria-hidden="true" />
                 </div>
                 <select
                    id="visaStatus"
                    className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md py-2"
                    value={formData.visaStatus}
                    onChange={(e) => setFormData({...formData, visaStatus: e.target.value})}
                 >
                    <option value="No Visa Needed">No Visa Needed (UK Citizen / ILR)</option>
                    <option value="Student Visa">Student Visa (Max 20 Hours/Week)</option>
                 </select>
              </div>
            </div>

            {/* Hourly Rate */}
            <div>
               <label htmlFor="hourlyRate" className="block text-sm font-medium text-gray-700">
                 Desired Hourly Rate (£)
               </label>
               <div className="mt-1 relative rounded-md shadow-sm">
                 <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                   <DollarSign className="h-5 w-5 text-gray-400" aria-hidden="true" />
                 </div>
                 <input
                   id="hourlyRate"
                   name="hourlyRate"
                   type="number"
                   min="10"
                   required
                   className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md py-2"
                   value={formData.hourlyRate}
                   onChange={(e) => setFormData({ ...formData, hourlyRate: Number(e.target.value) })}
                 />
               </div>
            </div>

            {/* Skills */}
            <div>
              <label htmlFor="skills" className="block text-sm font-medium text-gray-700">
                Skills (comma separated)
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Briefcase className="h-5 w-5 text-gray-400" aria-hidden="true" />
                </div>
                <input
                  id="skills"
                  name="skills"
                  type="text"
                  className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md py-2"
                  placeholder="e.g. Dementia, First Aid, Manual Handling"
                  value={formData.skills}
                  onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
                />
              </div>
            </div>

            {/* Bio */}
            <div>
              <label htmlFor="bio" className="block text-sm font-medium text-gray-700">
                Bio
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute top-3 left-3 flex items-start pointer-events-none">
                  <FileText className="h-5 w-5 text-gray-400" aria-hidden="true" />
                </div>
                <textarea
                  id="bio"
                  name="bio"
                  rows={3}
                  className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md py-2"
                  placeholder="Tell care homes about your experience..."
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                />
              </div>
            </div>

            {/* Documents */}
            <div className="space-y-2">
                <span className="block text-sm font-medium text-gray-700">Documents Available</span>
                <div className="flex items-center">
                  <input
                    id="hasDbs"
                    type="checkbox"
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    checked={formData.hasDbs}
                    onChange={(e) => setFormData({ ...formData, hasDbs: e.target.checked })}
                  />
                  <label htmlFor="hasDbs" className="ml-2 block text-sm text-gray-900">Valid DBS Certificate</label>
                </div>
                <div className="flex items-center">
                  <input
                    id="hasId"
                    type="checkbox"
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    checked={formData.hasId}
                    onChange={(e) => setFormData({ ...formData, hasId: e.target.checked })}
                  />
                  <label htmlFor="hasId" className="ml-2 block text-sm text-gray-900">Photo ID / Passport</label>
                </div>
                <div className="flex items-center">
                  <input
                    id="hasCerts"
                    type="checkbox"
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    checked={formData.hasCerts}
                    onChange={(e) => setFormData({ ...formData, hasCerts: e.target.checked })}
                  />
                  <label htmlFor="hasCerts" className="ml-2 block text-sm text-gray-900">Care Qualifications</label>
                </div>
            </div>

            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Submit for Approval
              </button>
            </div>
          </form>

          <div className="mt-6">
            <button
                onClick={onBack}
                className="w-full flex justify-center items-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
              >
                <ArrowLeft size={16} className="mr-2" /> Back to Login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};