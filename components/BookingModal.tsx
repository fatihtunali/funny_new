'use client';

import { useState, useEffect } from 'react';
import { FaTimes, FaCalendarAlt, FaWhatsapp, FaArrowLeft, FaArrowRight, FaCheck } from 'react-icons/fa';
import { useRouter } from 'next/navigation';
import { trackPackageBooking } from '@/lib/gtag';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  packageData: {
    id: string;
    title: string;
    duration: string;
    selectedHotel: string;
    rooms: number[];
    totalPrice: number;
  };
}

interface PassengerInfo {
  firstName: string;
  middleName: string;
  lastName: string;
  dateOfBirth: string;
  gender: string;
  nationality: string;
  passportNumber: string;
  passportExpiry: string;
  passportIssuingCountry: string;
  passengerType: 'ADULT' | 'CHILD_3_5' | 'CHILD_6_10';
}

export default function BookingModal({ isOpen, onClose, packageData }: BookingModalProps) {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [currentStep, setCurrentStep] = useState(1);

  // Step 1: Contact & Travel Details
  const [travelDate, setTravelDate] = useState('');
  const [guestName, setGuestName] = useState('');
  const [guestEmail, setGuestEmail] = useState('');
  const [guestPhone, setGuestPhone] = useState('');

  // Step 2: Flight & Preferences
  const [arrivalFlightNumber, setArrivalFlightNumber] = useState('');
  const [arrivalFlightTime, setArrivalFlightTime] = useState('');
  const [departureFlightNumber, setDepartureFlightNumber] = useState('');
  const [departureFlightTime, setDepartureFlightTime] = useState('');
  const [dietaryRequirements, setDietaryRequirements] = useState<string[]>([]);
  const [otherDietary, setOtherDietary] = useState('');
  const [roomPreferences, setRoomPreferences] = useState<string[]>([]);
  const [emergencyContactName, setEmergencyContactName] = useState('');
  const [emergencyContactPhone, setEmergencyContactPhone] = useState('');
  const [travelInsurance, setTravelInsurance] = useState(false);
  const [celebrationOccasion, setCelebrationOccasion] = useState('');
  const [specialRequests, setSpecialRequests] = useState('');

  // Step 3: Passenger Details
  const [passengers, setPassengers] = useState<PassengerInfo[]>([]);

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      checkAuth();
      // Initialize passengers array based on total pax
      const totalPax = packageData.rooms.reduce((sum, pax) => sum + pax, 0);
      const initialPassengers: PassengerInfo[] = Array(totalPax).fill(null).map(() => ({
        firstName: '',
        middleName: '',
        lastName: '',
        dateOfBirth: '',
        gender: 'M',
        nationality: '',
        passportNumber: '',
        passportExpiry: '',
        passportIssuingCountry: '',
        passengerType: 'ADULT'
      }));
      setPassengers(initialPassengers);
    }
  }, [isOpen, packageData.rooms]);

  const checkAuth = async () => {
    try {
      const res = await fetch('/api/auth/me');
      if (res.ok) {
        const data = await res.json();
        setIsLoggedIn(true);
        setGuestName(data.user.name || '');
        setGuestEmail(data.user.email || '');
        setGuestPhone(data.user.phone || '');
      } else {
        setIsLoggedIn(false);
      }
    } finally {
      setCheckingAuth(false);
    }
  };

  const updatePassenger = (index: number, field: keyof PassengerInfo, value: string) => {
    const updated = [...passengers];
    updated[index] = { ...updated[index], [field]: value };
    setPassengers(updated);
  };

  const validateStep1 = () => {
    if (!travelDate) {
      setError('Please select a travel date');
      return false;
    }
    if (!isLoggedIn && (!guestName || !guestEmail || !guestPhone)) {
      setError('Please fill in all contact information');
      return false;
    }
    return true;
  };

  const validateStep2 = () => {
    if (!emergencyContactName || !emergencyContactPhone) {
      setError('Emergency contact information is required');
      return false;
    }
    return true;
  };

  const validateStep3 = () => {
    for (let i = 0; i < passengers.length; i++) {
      const p = passengers[i];
      if (!p.firstName || !p.lastName || !p.dateOfBirth || !p.gender || !p.nationality ||
          !p.passportNumber || !p.passportExpiry || !p.passportIssuingCountry) {
        setError(`Please complete all required fields for Passenger ${i + 1}`);
        return false;
      }
    }
    return true;
  };

  const nextStep = () => {
    setError('');
    if (currentStep === 1 && !validateStep1()) return;
    if (currentStep === 2 && !validateStep2()) return;
    if (currentStep < 3) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    setError('');
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep3()) return;

    setSubmitting(true);
    setError('');

    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          packageName: packageData.title,
          packageId: packageData.id,
          travelDate,
          duration: packageData.duration,
          hotelCategory: packageData.selectedHotel,
          adults: passengers.filter((p) => p.passengerType === 'ADULT').length,
          children3to5: 0,
          children6to10: 0,
          totalPrice: packageData.totalPrice,
          currency: 'EUR',
          // Guest info
          guestName: isLoggedIn ? null : guestName,
          guestEmail: isLoggedIn ? null : guestEmail,
          guestPhone: isLoggedIn ? null : guestPhone,
          // Flight & preferences
          arrivalFlightNumber,
          arrivalFlightTime,
          departureFlightNumber,
          departureFlightTime,
          dietaryRequirements: JSON.stringify([...dietaryRequirements, otherDietary].filter(Boolean)),
          roomPreferences: JSON.stringify(roomPreferences),
          emergencyContactName,
          emergencyContactPhone,
          travelInsurance,
          celebrationOccasion,
          specialRequests,
          // Passengers
          passengers: passengers
        }),
      });

      if (res.ok) {
        const data = await res.json();
        // Track Google Ads conversion
        trackPackageBooking(packageData.totalPrice, data.booking.referenceNumber);
        router.push(`/booking-success?ref=${data.booking.referenceNumber}&guest=${!isLoggedIn}`);
      } else {
        const data = await res.json();
        setError(data.error || 'Failed to create booking');
      }
    } catch {
      setError('An error occurred. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleWhatsAppBooking = () => {
    const totalPax = packageData.rooms.reduce((sum, pax) => sum + pax, 0);
    const roomDetails = packageData.rooms.map((pax, idx) => {
      const type = pax === 1 ? 'Single' : pax === 2 ? 'Double' : 'Triple';
      return `Room ${idx + 1}: ${type} (${pax} ${pax === 1 ? 'person' : 'people'})`;
    }).join('\n');

    const message = encodeURIComponent(
      `Hello! I'm interested in booking:\n\n` +
      `📦 Package: ${packageData.title}\n` +
      `🏨 Hotel Category: ${packageData.selectedHotel.replace('star', '-Star')}\n` +
      `👥 Total Guests: ${totalPax}\n` +
      `🛏️ Rooms:\n${roomDetails}\n` +
      `💰 Total Price: €${packageData.totalPrice}\n` +
      `📅 Duration: ${packageData.duration}\n\n` +
      `Please help me complete this booking.`
    );

    window.open(`https://wa.me/905373743134?text=${message}`, '_blank');
  };

  if (!isOpen) return null;

  const dietaryOptions = ['Vegetarian', 'Vegan', 'Halal', 'Kosher', 'Gluten-free', 'Dairy-free', 'None'];
  const roomPrefOptions = ['Twin Beds', 'King Bed', 'High Floor', 'Low Floor', 'Non-Smoking', 'Connecting Rooms'];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" onClick={onClose} />

      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative bg-white rounded-lg shadow-xl max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
          <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
            <FaTimes className="w-6 h-6" />
          </button>

          <h2 className="text-2xl font-bold text-gray-900 mb-4">Complete Your Booking</h2>

          {/* Progress Steps */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              {[
                { step: 1, label: 'Contact Info' },
                { step: 2, label: 'Travel Details' },
                { step: 3, label: 'Passengers' }
              ].map(({ step, label }) => (
                <div key={step} className="flex items-center flex-1">
                  <div className="flex flex-col items-center">
                    <div className={`flex items-center justify-center w-10 h-10 rounded-full font-semibold transition-all ${currentStep >= step ? 'bg-blue-600 text-white scale-110' : 'bg-gray-200 text-gray-600'}`}>
                      {currentStep > step ? <FaCheck /> : step}
                    </div>
                    <span className={`text-xs mt-1 font-medium ${currentStep >= step ? 'text-blue-600' : 'text-gray-500'}`}>
                      {label}
                    </span>
                  </div>
                  {step < 3 && <div className={`flex-1 h-1 mx-2 mt-[-20px] transition-all ${currentStep > step ? 'bg-blue-600' : 'bg-gray-200'}`} />}
                </div>
              ))}
            </div>
            <div className="text-center mt-2">
              <p className="text-sm text-gray-600">Step <span className="font-bold text-blue-600">{currentStep}</span> of 3</p>
            </div>
          </div>

          {checkingAuth ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-2 text-gray-600">Loading...</p>
            </div>
          ) : (
            <form onSubmit={handleBookingSubmit} className="space-y-4">
              {/* Package Summary */}
              <div className="bg-gray-50 rounded-lg p-4 mb-4">
                <h3 className="font-bold text-gray-900 mb-2">{packageData.title}</h3>
                <div className="text-sm text-gray-600 space-y-1">
                  <p>Hotel: {packageData.selectedHotel.replace('star', '-Star')}</p>
                  <p>Guests: {packageData.rooms.reduce((sum, pax) => sum + pax, 0)}</p>
                  <p>Rooms: {packageData.rooms.length}</p>
                  <p className="font-bold text-blue-600 text-lg mt-2">Total: €{packageData.totalPrice}</p>
                </div>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded text-sm">
                  {error}
                </div>
              )}

              {/* Step 1: Contact & Travel Info */}
              {currentStep === 1 && (
                <div className="space-y-4">
                  <h3 className="text-lg font-bold text-gray-900">Contact & Travel Information</h3>

                  {!isLoggedIn && (
                    <>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name *</label>
                        <input type="text" value={guestName} onChange={(e) => setGuestName(e.target.value)}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600"
                          required placeholder="John Doe" />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Email *</label>
                        <input type="email" value={guestEmail} onChange={(e) => setGuestEmail(e.target.value)}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600"
                          required placeholder="john@example.com" />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Phone *</label>
                        <input type="tel" value={guestPhone} onChange={(e) => setGuestPhone(e.target.value)}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600"
                          required placeholder="+1 234 567 8900" />
                      </div>
                    </>
                  )}

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Travel Date *</label>
                    <input type="date" value={travelDate} onChange={(e) => setTravelDate(e.target.value)}
                      min={new Date().toISOString().split('T')[0]}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600"
                      required />
                  </div>
                </div>
              )}

              {/* Step 2: Flight & Preferences */}
              {currentStep === 2 && (
                <div className="space-y-4">
                  <h3 className="text-lg font-bold text-gray-900">Flight Details & Preferences</h3>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Arrival Flight Number</label>
                      <input type="text" value={arrivalFlightNumber} onChange={(e) => setArrivalFlightNumber(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600"
                        placeholder="TK123" />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Arrival Time</label>
                      <input type="time" value={arrivalFlightTime} onChange={(e) => setArrivalFlightTime(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600" />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Departure Flight Number</label>
                      <input type="text" value={departureFlightNumber} onChange={(e) => setDepartureFlightNumber(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600"
                        placeholder="TK456" />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Departure Time</label>
                      <input type="time" value={departureFlightTime} onChange={(e) => setDepartureFlightTime(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Dietary Requirements</label>
                    <div className="grid grid-cols-2 gap-2">
                      {dietaryOptions.map(option => (
                        <label key={option} className="flex items-center space-x-2">
                          <input type="checkbox" checked={dietaryRequirements.includes(option)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setDietaryRequirements([...dietaryRequirements, option]);
                              } else {
                                setDietaryRequirements(dietaryRequirements.filter(d => d !== option));
                              }
                            }}
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-600" />
                          <span className="text-sm text-gray-700">{option}</span>
                        </label>
                      ))}
                    </div>
                    <input type="text" value={otherDietary} onChange={(e) => setOtherDietary(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 mt-2"
                      placeholder="Other dietary requirements..." />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Room Preferences</label>
                    <div className="grid grid-cols-2 gap-2">
                      {roomPrefOptions.map(option => (
                        <label key={option} className="flex items-center space-x-2">
                          <input type="checkbox" checked={roomPreferences.includes(option)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setRoomPreferences([...roomPreferences, option]);
                              } else {
                                setRoomPreferences(roomPreferences.filter(r => r !== option));
                              }
                            }}
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-600" />
                          <span className="text-sm text-gray-700">{option}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Emergency Contact Name *</label>
                      <input type="text" value={emergencyContactName} onChange={(e) => setEmergencyContactName(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600"
                        required placeholder="Jane Doe" />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Emergency Contact Phone *</label>
                      <input type="tel" value={emergencyContactPhone} onChange={(e) => setEmergencyContactPhone(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600"
                        required placeholder="+1 234 567 8900" />
                    </div>
                  </div>

                  <div>
                    <label className="flex items-center space-x-2">
                      <input type="checkbox" checked={travelInsurance} onChange={(e) => setTravelInsurance(e.target.checked)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-600" />
                      <span className="text-sm text-gray-700">I have travel insurance</span>
                    </label>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Celebrating Something Special?</label>
                    <select value={celebrationOccasion} onChange={(e) => setCelebrationOccasion(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600">
                      <option value="">None</option>
                      <option value="Honeymoon">Honeymoon</option>
                      <option value="Anniversary">Anniversary</option>
                      <option value="Birthday">Birthday</option>
                      <option value="Other">Other Celebration</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Special Requests</label>
                    <textarea value={specialRequests} onChange={(e) => setSpecialRequests(e.target.value)} rows={3}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600"
                      placeholder="Any special requirements..." />
                  </div>
                </div>
              )}

              {/* Step 3: Passenger Details */}
              {currentStep === 3 && (
                <div className="space-y-4">
                  <h3 className="text-lg font-bold text-gray-900">Passenger Information</h3>
                  <p className="text-sm text-gray-600">Please provide details as they appear on passports</p>

                  {passengers.map((passenger, index) => (
                    <div key={index} className="border border-gray-300 rounded-lg p-4 space-y-3">
                      <h4 className="font-semibold text-gray-900">Passenger {index + 1}</h4>

                      <div className="grid grid-cols-3 gap-3">
                        <div>
                          <label className="block text-xs font-semibold text-gray-700 mb-1">First Name *</label>
                          <input type="text" value={passenger.firstName}
                            onChange={(e) => updatePassenger(index, 'firstName', e.target.value)}
                            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600"
                            required placeholder="John" />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-gray-700 mb-1">Middle Name</label>
                          <input type="text" value={passenger.middleName}
                            onChange={(e) => updatePassenger(index, 'middleName', e.target.value)}
                            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600"
                            placeholder="Optional" />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-gray-700 mb-1">Last Name *</label>
                          <input type="text" value={passenger.lastName}
                            onChange={(e) => updatePassenger(index, 'lastName', e.target.value)}
                            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600"
                            required placeholder="Doe" />
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-3">
                        <div>
                          <label className="block text-xs font-semibold text-gray-700 mb-1">Date of Birth *</label>
                          <input type="date" value={passenger.dateOfBirth}
                            onChange={(e) => updatePassenger(index, 'dateOfBirth', e.target.value)}
                            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600"
                            required />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-gray-700 mb-1">Gender *</label>
                          <select value={passenger.gender}
                            onChange={(e) => updatePassenger(index, 'gender', e.target.value)}
                            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600"
                            required>
                            <option value="M">Male</option>
                            <option value="F">Female</option>
                            <option value="Other">Other</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-gray-700 mb-1">Nationality *</label>
                          <input type="text" value={passenger.nationality}
                            onChange={(e) => updatePassenger(index, 'nationality', e.target.value)}
                            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600"
                            required placeholder="USA" />
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-3">
                        <div>
                          <label className="block text-xs font-semibold text-gray-700 mb-1">Passport Number *</label>
                          <input type="text" value={passenger.passportNumber}
                            onChange={(e) => updatePassenger(index, 'passportNumber', e.target.value)}
                            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600"
                            required placeholder="AB1234567" />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-gray-700 mb-1">Passport Expiry *</label>
                          <input type="date" value={passenger.passportExpiry}
                            onChange={(e) => updatePassenger(index, 'passportExpiry', e.target.value)}
                            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600"
                            required />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-gray-700 mb-1">Issuing Country *</label>
                          <input type="text" value={passenger.passportIssuingCountry}
                            onChange={(e) => updatePassenger(index, 'passportIssuingCountry', e.target.value)}
                            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600"
                            required placeholder="USA" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex justify-between pt-4">
                {currentStep > 1 && (
                  <button type="button" onClick={prevStep}
                    className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 flex items-center">
                    <FaArrowLeft className="mr-2" /> Previous
                  </button>
                )}

                {currentStep < 3 ? (
                  <button type="button" onClick={nextStep}
                    className="ml-auto px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center">
                    Next <FaArrowRight className="ml-2" />
                  </button>
                ) : (
                  <button type="submit" disabled={submitting}
                    className="ml-auto px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center disabled:bg-gray-400">
                    <FaCalendarAlt className="mr-2" />
                    {submitting ? 'Creating Booking...' : 'Confirm Booking'}
                  </button>
                )}
              </div>

              {/* WhatsApp Alternative */}
              {currentStep === 1 && (
                <>
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-300"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-2 bg-white text-gray-500">or</span>
                    </div>
                  </div>

                  <button type="button" onClick={handleWhatsAppBooking}
                    className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg flex items-center justify-center transition-colors">
                    <FaWhatsapp className="mr-2 text-xl" />
                    Book via WhatsApp
                  </button>
                </>
              )}
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
