import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Bed, Users, DollarSign, Calendar, X, AlertCircle, Phone, BookOpen, User } from 'lucide-react'

const RoomCard = ({ room, type, searchParams, hasActiveSearch, onModifySearch }) => {
  const navigate = useNavigate()
  const [showModal, setShowModal] = useState(false)
  const [checkIn, setCheckIn] = useState('')
  const [checkOut, setCheckOut] = useState('')
  const [additionalHeads, setAdditionalHeads] = useState(0)
  const [showRules, setShowRules] = useState(false)
  const [adults, setAdults] = useState(2)
  const [children, setChildren] = useState([])
  const [hasValidDates, setHasValidDates] = useState(false)
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [bookingData, setBookingData] = useState(null)

  // Load search params from props
  useEffect(() => {
    // First try to use searchParams from props
    let params = searchParams
    
    // If no params in props, check localStorage
    if (!params || !params.checkIn) {
      const storedParams = localStorage.getItem('roomSearchParams')
      const hasActive = localStorage.getItem('hasActiveSearch')
      if (storedParams && hasActive === 'true') {
        try {
          params = JSON.parse(storedParams)
        } catch (e) {
          console.error('Error parsing stored params', e)
        }
      }
    }
    
    if (params && params.checkIn && params.checkOut) {
      const checkInDate = new Date(params.checkIn)
      const checkOutDate = new Date(params.checkOut)
      
      if (!isNaN(checkInDate.getTime()) && !isNaN(checkOutDate.getTime())) {
        const formattedCheckIn = checkInDate.toISOString().split('T')[0]
        const formattedCheckOut = checkOutDate.toISOString().split('T')[0]
        
        setCheckIn(formattedCheckIn)
        setCheckOut(formattedCheckOut)
        setAdults(params.adults || 2)
        setChildren(params.children || [])
        setHasValidDates(true)
        
        const totalGuests = (params.adults || 2) + (params.children?.length || 0)
        if (totalGuests > room.capacity) {
          setAdditionalHeads(totalGuests - room.capacity)
        } else {
          setAdditionalHeads(0)
        }
      }
    } else {
      setHasValidDates(false)
    }
  }, [searchParams, room.capacity])

  const calculateTotal = () => {
    let total = room.price
    if (additionalHeads > 0) {
      total += additionalHeads * 1500
    }
    return total
  }

  const calculateNights = () => {
    if (checkIn && checkOut) {
      const start = new Date(checkIn)
      const end = new Date(checkOut)
      const nights = Math.ceil((end - start) / (1000 * 60 * 60 * 24))
      return nights > 0 ? nights : 1
    }
    return 1
  }

  const totalAmount = calculateTotal() * calculateNights()

  const handleBookNow = () => {
    // Check if user is logged in
    const user = localStorage.getItem('user')
    const userRole = localStorage.getItem('userRole')
    
    // Prepare booking data
    const bookingInfo = {
      room: room,
      type: type,
      checkIn: checkIn,
      checkOut: checkOut,
      adults: adults,
      children: children,
      nights: calculateNights(),
      totalAmount: totalAmount,
      additionalHeads: additionalHeads
    }
    
    if (user && userRole === 'customer') {
      // User is logged in as customer, proceed with booking
      proceedWithBooking(bookingInfo)
    } else if (user && userRole !== 'customer') {
      // User is logged in as staff/manager/admin - redirect to customer registration
      alert('Please use a customer account to make bookings. Redirecting to registration...')
      localStorage.removeItem('user')
      localStorage.removeItem('userRole')
      navigate('/register')
    } else {
      // No user logged in - show auth modal
      setBookingData(bookingInfo)
      setShowAuthModal(true)
    }
  }

  const proceedWithBooking = (bookingInfo) => {
    // Save booking data to localStorage for the booking confirmation page
    localStorage.setItem('pendingBooking', JSON.stringify(bookingInfo))
    // Navigate to booking confirmation/payment page
    alert(`Proceeding to payment for ${room.name}\nTotal: ₱${totalAmount.toLocaleString()}\nCheck-in: ${formatDate(checkIn)}\nCheck-out: ${formatDate(checkOut)}\nGuests: ${adults} adults, ${children.length} children`)
    // In production, navigate to booking confirmation page:
    // navigate('/booking/confirmation')
  }

  const formatDate = (dateString) => {
    if (!dateString) return ''
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
  }

  const GuestSummary = () => {
    const totalChildren = children.length
    const childAges = children.map(c => c.age).join(', ')
    
    return (
      <div className="mt-2 p-2 bg-blue-50 rounded-lg text-sm">
        <p className="font-medium text-gray-700 flex items-center gap-2">
          <Users size={14} className="text-blue-500" />
          Guest Details from Search:
        </p>
        <div className="mt-1 text-gray-600">
          <p>👤 Adults: {adults}</p>
          {children.length > 0 && (
            <p>👶 Children: {children.length} ({childAges} yrs)</p>
          )}
          <p>📅 {calculateNights()} night(s)</p>
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 overflow-hidden group">
        <div className="h-56 bg-gradient-to-br from-amber-400 to-orange-500 relative overflow-hidden">
          <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-all duration-300"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <Bed size={60} className="text-white/40 group-hover:scale-125 transition-transform duration-500" />
          </div>
          <div className="absolute top-4 right-4 bg-amber-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
            {type}
          </div>
        </div>
        
        <div className="p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-1">{room.name}</h3>
          <p className="text-gray-500 text-sm mb-3">Costa Marina Beach Resort</p>
          
          <div className="flex items-center gap-4 mb-4">
            <div className="flex items-center gap-1 text-amber-600">
              <DollarSign size={18} />
              <span className="font-bold text-lg">₱{room.price.toLocaleString()}</span>
              <span className="text-xs text-gray-500">/night</span>
            </div>
            <div className="flex items-center gap-1 text-gray-600">
              <Users size={18} />
              <span className="text-sm">Good for {room.capacity} Pax</span>
            </div>
          </div>
          
          {hasValidDates && (
            <div className="mb-3 p-2 bg-blue-50 rounded-lg text-xs">
              <p className="text-blue-700">📅 {formatDate(checkIn)} - {formatDate(checkOut)}</p>
              <p className="text-blue-700">👥 {adults} adults, {children.length} children · {calculateNights()} nights</p>
            </div>
          )}
          
          <button 
            onClick={() => setShowModal(true)}
            disabled={!hasValidDates}
            className={`w-full py-2 rounded-lg font-semibold transition-all duration-300 ${
              hasValidDates 
                ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:shadow-lg cursor-pointer' 
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            View Details
          </button>
          
          {!hasValidDates && (
            <p className="text-xs text-gray-400 text-center mt-2">
              Please search for availability first
            </p>
          )}
        </div>
      </div>

      {/* Room Details Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b p-4 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-800">{room.name}</h2>
              <button onClick={() => setShowModal(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                <X size={24} />
              </button>
            </div>
            
            <div className="p-6">
              {/* Gallery Placeholder */}
              <div className="mb-6">
                <div className="h-64 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl flex items-center justify-center">
                  <span className="text-white text-lg">[Room Gallery Images Placeholder]</span>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {/* Left Column - Details */}
                <div>
                  <div className="mb-4">
                    <h3 className="font-semibold text-lg mb-2">Features and Inclusions</h3>
                    <ul className="space-y-2 text-gray-600">
                      <li className="flex items-center gap-2">✓ 1 Bedroom</li>
                      <li className="flex items-center gap-2">✓ 2 Single Beds</li>
                      <li className="flex items-center gap-2">✓ 1 Toilet & Bath</li>
                      <li className="flex items-center gap-2">✓ Hot & Cold Shower</li>
                      <li className="flex items-center gap-2">✓ Free Breakfast</li>
                    </ul>
                  </div>
                  
                  <div className="mb-4">
                    <h3 className="font-semibold text-lg mb-2">Room Location</h3>
                    <p className="text-gray-600">Hillside overlooking the resort</p>
                  </div>
                  
                  <div className="mb-4">
                    <h3 className="font-semibold text-lg mb-2">Capacity Details</h3>
                    <p className="text-gray-600 mb-2">Good for {room.capacity} Pax</p>
                    <p className="text-sm text-gray-500">
                      Minimum {room.minHeads || 2} pax are inclusive. Additional heads will be charged ₱1,500/person/night.
                    </p>
                    {room.capacity > (room.minHeads || 2) && (
                      <div className="mt-2">
                        <label className="text-sm font-medium text-gray-700">Additional Guests:</label>
                        <select 
                          value={additionalHeads}
                          onChange={(e) => setAdditionalHeads(parseInt(e.target.value))}
                          className="ml-2 px-2 py-1 border rounded-lg"
                        >
                          {[...Array(room.capacity - (room.minHeads || 2) + 1)].map((_, i) => (
                            <option key={i} value={i}>{i} person(s)</option>
                          ))}
                        </select>
                      </div>
                    )}
                  </div>

                  {(adults > 0 || children.length > 0) && hasValidDates && <GuestSummary />}
                </div>
                
                {/* Right Column - Booking */}
                <div>
                  <div className="bg-amber-50 rounded-xl p-4 mb-4">
                    <h3 className="font-semibold text-lg mb-3">Book this room</h3>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm font-medium mb-1">Check-in:</label>
                        <input 
                          type="text" 
                          value={formatDate(checkIn)}
                          readOnly
                          className="w-full px-3 py-2 border rounded-lg bg-gray-100 cursor-not-allowed"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Check-out:</label>
                        <input 
                          type="text" 
                          value={formatDate(checkOut)}
                          readOnly
                          className="w-full px-3 py-2 border rounded-lg bg-gray-100 cursor-not-allowed"
                        />
                      </div>
                      
                      <div className="p-3 bg-white rounded-lg">
                        <p className="font-medium text-gray-700 mb-2">Booking Details:</p>
                        <div className="space-y-1 text-sm">
                          <p>👤 Adults: {adults}</p>
                          {children.length > 0 && (
                            <p>👶 Children: {children.length} ({children.map(c => c.age).join(', ')} yrs)</p>
                          )}
                          <p>📅 {calculateNights()} night(s)</p>
                          <p>🏠 Room: {room.name}</p>
                        </div>
                      </div>
                      
                      <div className="border-t pt-3">
                        <div className="flex justify-between mb-2">
                          <span>Rate per night:</span>
                          <span className="font-semibold">₱{room.price.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between mb-2 text-sm text-gray-600">
                          <span>Number of nights:</span>
                          <span>{calculateNights()} nights</span>
                        </div>
                        <div className="flex justify-between mb-2 text-sm text-gray-600">
                          <span>Subtotal:</span>
                          <span>₱{(room.price * calculateNights()).toLocaleString()}</span>
                        </div>
                        {additionalHeads > 0 && (
                          <div className="flex justify-between mb-2 text-sm text-gray-600">
                            <span>Additional guests ({additionalHeads} × ₱1,500 × {calculateNights()} nights):</span>
                            <span>₱{(additionalHeads * 1500 * calculateNights()).toLocaleString()}</span>
                          </div>
                        )}
                        <div className="flex justify-between font-bold text-lg border-t pt-2 mt-2">
                          <span>Total:</span>
                          <span className="text-amber-600">₱{totalAmount.toLocaleString()}</span>
                        </div>
                      </div>
                      
                      <button 
                        onClick={handleBookNow}
                        disabled={!hasValidDates}
                        className={`w-full py-3 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center gap-2 ${
                          hasValidDates 
                            ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:shadow-lg cursor-pointer' 
                            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        }`}
                      >
                        <Calendar size={18} />
                        Book Now
                      </button>
                      
                      {!hasValidDates && (
                        <p className="text-xs text-gray-400 text-center mt-2">
                          Please go back and search for availability
                        </p>
                      )}
                    </div>
                  </div>
                  
                  {onModifySearch && (
                    <button 
                      onClick={onModifySearch}
                      className="w-full py-2 mb-4 border border-amber-500 text-amber-600 rounded-lg font-semibold hover:bg-amber-50 transition-all duration-300"
                    >
                      Modify Search
                    </button>
                  )}
                  
                  <div className="text-sm text-gray-600 space-y-2">
                    <p className="flex items-start gap-2">
                      <AlertCircle size={16} className="text-amber-500 mt-0.5" />
                      <span>No bringing of food, drinks, and liquors.</span>
                    </p>
                    <p className="flex items-start gap-2">
                      <AlertCircle size={16} className="text-amber-500 mt-0.5" />
                      <span>No grilling allowed.</span>
                    </p>
                    <p className="flex items-start gap-2">
                      <AlertCircle size={16} className="text-amber-500 mt-0.5" />
                      <span>Strictly no pets allowed.</span>
                    </p>
                    <p className="flex items-start gap-2">
                      <AlertCircle size={16} className="text-amber-500 mt-0.5" />
                      <span>No cancellation of booking and no refund.</span>
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 pt-6 border-t">
                <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                  <div className="flex items-center gap-2">
                    <Phone size={18} className="text-amber-500" />
                    <span className="text-sm">+63 917-7958-372</span>
                    <button className="text-amber-600 text-sm font-medium hover:underline ml-4">
                      Need help? GET STARTED
                    </button>
                  </div>
                  <button 
                    onClick={() => setShowRules(!showRules)}
                    className="text-amber-600 text-sm font-medium hover:underline flex items-center gap-1"
                  >
                    <BookOpen size={16} />
                    Read Rules & Regulations
                  </button>
                </div>
                
                {showRules && (
                  <div className="mt-6 p-4 bg-gray-50 rounded-lg max-h-96 overflow-y-auto">
                    <h3 className="font-bold text-lg mb-3">House Rules & Safety Measures</h3>
                    <p className="text-sm text-gray-600 mb-3">
                      For us to serve you better, we wish to inform you of our house rules and safety measures. 
                      We request your cooperation and compliance to make your stay safe and memorable.
                    </p>
                    <ul className="space-y-2 text-sm text-gray-600">
                      <li>✓ <strong>NO CONFIRMED BOOKING – NO ENTRY</strong> - Day tour and overnight guests must book and pay in advance with a strict "NO CANCELLATION POLICY." Rebooking is allowed only once and must be coordinated and confirmed with the office.</li>
                      <li>✓ Each guest is required to present 1 valid ID. For toddlers and kids, a birth certificate is required.</li>
                      <li>✓ The management is not liable for any loss or damage to your valuables and personal effects.</li>
                      <li>✓ Children and toddlers must be accompanied by adults at all times.</li>
                      <li>✓ Rice cookers, electric stoves, butane stoves, or any flammable appliances are not allowed within the premises.</li>
                      <li>✓ To avoid any accidents, horseplay and diving off from the wharf are strictly prohibited.</li>
                      <li>✓ Hammocks and tents are not allowed without prior arrangements and approval.</li>
                      <li>✓ Bringing of PETS IS STRICTLY NOT ALLOWED.</li>
                      <li>✓ Firearms, illegal drugs and gambling are strictly prohibited</li>
                      <li>✓ Fishing is not allowed within the boundaries of the resort.</li>
                      <li>✓ Appropriate energy charges will apply to any electrical appliance brought to the resort.</li>
                      <li>✓ Damage(s) or loss of resort property by the customer shall be charged accordingly.</li>
                      <li>✓ Smoking is only allowed at the designated smoking areas.</li>
                      <li>✓ The bringing of food, beverages, and liquor is not allowed.</li>
                      <li>✓ The use of jet skis and windsurfing within the swimming areas is strictly prohibited.</li>
                      <li>✓ Please conserve water and electricity.</li>
                      <li>✓ Wearing of face masks is still required.</li>
                      <li>✓ Social distancing from other guests must be maintained at all times.</li>
                      <li>✓ Please wear aqua shoes or rubber slippers at the swimming area.</li>
                      <li>✓ Washing of hands and sanitizing should always be done.</li>
                      <li>✓ The resort has the right to refuse entry and turn away guests for unbecoming behavior.</li>
                      <li>✓ And lastly, you are required to ENJOY and HAVE FUN!</li>
                    </ul>
                    <p className="mt-3 text-center font-semibold">We wish you a pleasant stay!</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Authentication Required Modal */}
      {showAuthModal && bookingData && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full">
            <div className="border-b p-4 flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-800">Login Required</h2>
              <button onClick={() => setShowAuthModal(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                <X size={20} />
              </button>
            </div>
            <div className="p-6">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <User size={32} className="text-amber-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-800">Please sign in to continue</h3>
                <p className="text-gray-500 text-sm mt-1">You need to be logged in to complete your booking</p>
              </div>
              
              <div className="space-y-3">
                <button 
                  onClick={() => {
                    // Save booking data to localStorage before redirecting
                    localStorage.setItem('pendingBooking', JSON.stringify(bookingData))
                    localStorage.setItem('redirectAfterLogin', '/rooms')
                    navigate('/login')
                  }}
                  className="w-full py-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-lg font-semibold hover:shadow-lg transition-all"
                >
                  Login to Your Account
                </button>
                
                <button 
                  onClick={() => {
                    localStorage.setItem('pendingBooking', JSON.stringify(bookingData))
                    localStorage.setItem('redirectAfterLogin', '/rooms')
                    navigate('/register')
                  }}
                  className="w-full py-2 border-2 border-amber-500 text-amber-600 rounded-lg font-semibold hover:bg-amber-50 transition-all"
                >
                  Create New Account
                </button>
              </div>
              
              <p className="text-center text-xs text-gray-400 mt-4">
                By continuing, you agree to our Terms of Service and Privacy Policy
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default RoomCard