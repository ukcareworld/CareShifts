import React, { useState } from 'react';
import { UserRole, User } from '../types';
import { Building2, MapPin, ArrowLeft, FileText, Activity, Car, User as UserIcon, Phone, Smartphone } from 'lucide-react';

interface CareHomeRegistrationProps {
  onRegister: (user: User) => void;
  onBack: () => void;
}

export const CareHomeRegistration: React.FC<CareHomeRegistrationProps> = ({ onRegister, onBack }) => {
  const [formData, setFormData] = useState({
    name: '',
    contactPerson: '',
    phoneNumber: '',
    mobileNumber: '',
    address: '',
    city: '',
    postCode: '',
    description: '',
    careType: 'Residential Care',
    hasParking: false
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.city || !formData.postCode) return;

    // Simulate creating a new user
    const newUser: User = {
      id: `ch_${Date.now()}`,
      name: formData.name,
      role: UserRole.CARE_HOME,
      // Generate a placeholder avatar based on name
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(formData.name)}&background=0D9488&color=fff`, 
      location: `${formData.city}, ${formData.postCode}`, // Constructed location for display
      rating: 5.0, // New accounts start with a clean slate (optimistic UI)
      totalRatings: 0,
      description: formData.description,
      careType: formData.careType,
      hasParking: formData.hasParking,
      contactPerson: formData.contactPerson,
      phoneNumber: formData.phoneNumber,
      mobileNumber: formData.mobileNumber,
      address: formData.address,
      city: formData.city,
      postCode: formData.postCode
    };

    onRegister(newUser);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="mx-auto h-12 w-12 bg-teal-100 rounded-full flex items-center justify-center">
             <Building2 className="text-teal-600" size={24} />
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Register your Care Home
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Join the network to find qualified professionals quickly and easily.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Care Home Name */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Care Home Name
              </label>
              <div className="mt-1">
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm bg-white text-gray-900"
                  placeholder="e.g. Sunny Meadows Care"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
            </div>

            {/* Manager / Contact Person */}
            <div>
              <label htmlFor="contactPerson" className="block text-sm font-medium text-gray-700">
                Manager / Contact Person Name
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <UserIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                </div>
                <input
                  id="contactPerson"
                  name="contactPerson"
                  type="text"
                  required
                  className="focus:ring-teal-500 focus:border-teal-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md py-2 bg-white text-gray-900"
                  placeholder="e.g. Jane Smith"
                  value={formData.contactPerson}
                  onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                />
              </div>
            </div>

            {/* Phone Numbers */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
               <div>
                  <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700">
                    Phone Number
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Phone className="h-4 w-4 text-gray-400" aria-hidden="true" />
                    </div>
                    <input
                      id="phoneNumber"
                      name="phoneNumber"
                      type="tel"
                      required
                      className="focus:ring-teal-500 focus:border-teal-500 block w-full pl-9 sm:text-sm border-gray-300 rounded-md py-2 bg-white text-gray-900"
                      placeholder="0123 456 7890"
                      value={formData.phoneNumber}
                      onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                    />
                  </div>
               </div>
               <div>
                  <label htmlFor="mobileNumber" className="block text-sm font-medium text-gray-700">
                    Mobile Number
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Smartphone className="h-4 w-4 text-gray-400" aria-hidden="true" />
                    </div>
                    <input
                      id="mobileNumber"
                      name="mobileNumber"
                      type="tel"
                      className="focus:ring-teal-500 focus:border-teal-500 block w-full pl-9 sm:text-sm border-gray-300 rounded-md py-2 bg-white text-gray-900"
                      placeholder="07700 900000"
                      value={formData.mobileNumber}
                      onChange={(e) => setFormData({ ...formData, mobileNumber: e.target.value })}
                    />
                  </div>
               </div>
            </div>

            {/* Address Section */}
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
                  className="focus:ring-teal-500 focus:border-teal-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md py-2 bg-white text-gray-900"
                  placeholder="e.g. 123 Care Lane"
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
                  <input
                    id="city"
                    name="city"
                    type="text"
                    required
                    className="mt-1 focus:ring-teal-500 focus:border-teal-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md py-2 px-3 bg-white text-gray-900"
                    placeholder="e.g. Manchester"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  />
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
                    className="mt-1 focus:ring-teal-500 focus:border-teal-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md py-2 px-3 bg-white text-gray-900"
                    placeholder="e.g. M1 1AA"
                    value={formData.postCode}
                    onChange={(e) => setFormData({ ...formData, postCode: e.target.value })}
                  />
               </div>
            </div>

            {/* Care Type */}
            <div>
              <label htmlFor="careType" className="block text-sm font-medium text-gray-700">
                Type of Care Home
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Activity className="h-5 w-5 text-gray-400" aria-hidden="true" />
                </div>
                <select
                  id="careType"
                  name="careType"
                  className="focus:ring-teal-500 focus:border-teal-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md py-2 bg-white text-gray-900"
                  value={formData.careType}
                  onChange={(e) => setFormData({ ...formData, careType: e.target.value })}
                >
                  <option>Residential Care</option>
                  <option>Nursing Care</option>
                  <option>Dementia Care</option>
                  <option>Respite Care</option>
                  <option>Palliative Care</option>
                  <option>Other</option>
                </select>
              </div>
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                Description
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute top-3 left-3 flex items-start pointer-events-none">
                  <FileText className="h-5 w-5 text-gray-400" aria-hidden="true" />
                </div>
                <textarea
                  id="description"
                  name="description"
                  rows={3}
                  className="focus:ring-teal-500 focus:border-teal-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md py-2 bg-white text-gray-900"
                  placeholder="Tell workers about your facility..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>
            </div>

            {/* Parking */}
            <div className="flex items-center">
              <input
                id="hasParking"
                name="hasParking"
                type="checkbox"
                className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300 rounded"
                checked={formData.hasParking}
                onChange={(e) => setFormData({ ...formData, hasParking: e.target.checked })}
              />
              <label htmlFor="hasParking" className="ml-2 block text-sm text-gray-900 flex items-center">
                <Car className="h-4 w-4 mr-1 text-gray-500" />
                Parking available for workers
              </label>
            </div>

            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
              >
                Create Account
              </button>
            </div>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">
                  Already have an account?
                </span>
              </div>
            </div>

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
    </div>
  );
};