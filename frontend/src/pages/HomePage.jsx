import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Calendar, Search, Shield, Heart, Sun, Award, Users, CheckCircle, Waves, Utensils, Bed, Compass, Camera, X, ChevronLeft, ChevronRight, Minus, Plus, User, Baby } from 'lucide-react'
import DatePicker from 'react-datepicker'
import "react-datepicker/dist/react-datepicker.css"

function HomePage() {
  const navigate = useNavigate()
  const [showAvailabilityModal, setShowAvailabilityModal] = useState(false)
  const [showCalendarModal, setShowCalendarModal] = useState(false)
  const [checkIn, setCheckIn] = useState(null)
  const [checkOut, setCheckOut] = useState(null)
  const [numberOfRooms, setNumberOfRooms] = useState(1)
  const [adults, setAdults] = useState(2)
  const [children, setChildren] = useState([])
  const [searchError, setSearchError] = useState('')
  
  const [currentMonth, setCurrentMonth] = useState(new Date())
  
  // Sample booked dates (in real app, these would come from database)
  const bookedDates = [
    '2024-12-15', '2024-12-16', '2024-12-17', '2024-12-18', '2024-12-19',
    '2024-12-20', '2024-12-21', '2024-12-22', '2024-12-23', '2024-12-24',
    '2025-01-01', '2025-01-02', '2025-01-03',
    '2025-01-10', '2025-01-11', '2025-01-12',
    '2025-01-20', '2025-01-21', '2025-01-22'
  ]

  const partiallyBookedDates = [
    '2025-01-05', '2025-01-06', '2025-01-07'
  ]

  const features = [
    { icon: Waves, title: 'Beach', description: 'Pristine white sand beach with crystal clear waters', color: 'from-blue-500 to-cyan-400' },
    { icon: Utensils, title: 'Food', description: 'Exquisite local and international cuisine', color: 'from-orange-500 to-red-500' },
    { icon: Bed, title: 'Rooms', description: 'Luxurious accommodations with beach views', color: 'from-amber-500 to-yellow-500' },
    { icon: Compass, title: 'Activities', description: 'Water sports and recreational activities', color: 'from-green-500 to-emerald-500' },
    { icon: Camera, title: 'Sceneries', description: 'Breathtaking sunsets and tropical landscapes', color: 'from-purple-500 to-pink-500' }
  ]

  const handleAddChild = () => {
    setChildren([...children, { id: Date.now(), age: 0 }])
  }

  const handleRemoveChild = (childId) => {
    setChildren(children.filter(child => child.id !== childId))
  }

  const handleChildAgeChange = (childId, age) => {
    setChildren(children.map(child => 
      child.id === childId ? { ...child, age: parseInt(age) } : child
    ))
  }

  const handleSearchAvailability = () => {
    if (!checkIn || !checkOut) {
      setSearchError('Please select check-in and check-out dates')
      return
    }
    if (numberOfRooms < 1) {
      setSearchError('Please select at least 1 room')
      return
    }
    if (adults < 1) {
      setSearchError('Please select at least 1 adult')
      return
    }
    
    setSearchError('')
    
    // Store search params in localStorage to use on rooms page
    const searchParams = {
      checkIn: checkIn.toISOString(),
      checkOut: checkOut.toISOString(),
      numberOfRooms,
      adults,
      children: children.map(c => ({ age: c.age }))
    }
    localStorage.setItem('roomSearchParams', JSON.stringify(searchParams))
    
    // Navigate to rooms page
    navigate('/rooms')
    setShowAvailabilityModal(false)
  }

  const handleSeeCalendar = () => {
    setShowCalendarModal(true)
    setShowAvailabilityModal(false)
  }

  const getDateStatus = (date) => {
    const dateStr = date.toISOString().split('T')[0]
    if (bookedDates.includes(dateStr)) return 'booked'
    if (partiallyBookedDates.includes(dateStr)) return 'partial'
    return 'available'
  }

  const CustomDateInput = ({ value, onClick, placeholder }) => (
    <button
      onClick={onClick}
      className="w-full px-4 py-3 text-left border border-gray-300 rounded-lg focus:border-amber-500 focus:ring-2 focus:ring-amber-200 transition-all bg-white"
    >
      {value || placeholder}
    </button>
  )

  const CounterInput = ({ label, value, onIncrease, onDecrease, min = 0, max = 10 }) => (
    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
      <span className="text-gray-700 font-medium">{label}</span>
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onDecrease}
          disabled={value <= min}
          className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          <Minus size={16} />
        </button>
        <span className="w-8 text-center font-semibold text-lg">{value}</span>
        <button
          type="button"
          onClick={onIncrease}
          disabled={value >= max}
          className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          <Plus size={16} />
        </button>
      </div>
    </div>
  )

  return (
    <div>
      {/* Hero Section */}
      <section id="home" className="pt-20 md:pt-24">
        <div className="relative h-[90vh] md:h-[85vh] overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-amber-900/70 to-orange-900/70 z-10"></div>
          <div className="absolute inset-0 bg-gray-800">
            <div className="w-full h-full flex items-center justify-center text-white bg-cover bg-center" 
                 style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1600)' }}>
            </div>
          </div>
          
          <div className="relative z-20 h-full flex items-center justify-center text-center px-4">
            <div className="max-w-4xl">
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-4 drop-shadow-lg">
                Welcome to Costa Marina Beach Resort
              </h1>
              <p className="text-xl md:text-2xl text-white mb-8 drop-shadow-md">
                A luxurious and relaxing place to unwind.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button 
                  onClick={() => setShowAvailabilityModal(true)}
                  className="group px-8 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-full font-semibold hover:shadow-2xl hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2"
                >
                  <Search size={20} />
                  Search Availability
                </button>
              </div>
            </div>
          </div>
          
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20">
            <div className="w-6 h-10 border-2 border-white rounded-full flex justify-center">
              <div className="w-1 h-2 bg-white rounded-full mt-2 animate-bounce"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Search Availability Modal */}
      {showAvailabilityModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b p-4 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-800">Search Availability</h2>
              <button onClick={() => setShowAvailabilityModal(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                <X size={24} />
              </button>
            </div>
            
            <div className="p-6">
              {searchError && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
                  {searchError}
                </div>
              )}
              
              <div className="space-y-5">
                {/* Date Selection */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">Check-in Date *</label>
                    <DatePicker
                      selected={checkIn}
                      onChange={(date) => setCheckIn(date)}
                      selectsStart
                      startDate={checkIn}
                      endDate={checkOut}
                      minDate={new Date()}
                      placeholderText="Select check-in date"
                      customInput={<CustomDateInput placeholder="Select check-in date" />}
                      className="w-full"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">Check-out Date *</label>
                    <DatePicker
                      selected={checkOut}
                      onChange={(date) => setCheckOut(date)}
                      selectsEnd
                      startDate={checkIn}
                      endDate={checkOut}
                      minDate={checkIn || new Date()}
                      placeholderText="Select check-out date"
                      customInput={<CustomDateInput placeholder="Select check-out date" />}
                      className="w-full"
                    />
                  </div>
                </div>

                {/* Number of Rooms */}
                <CounterInput
                  label="Number of Rooms"
                  value={numberOfRooms}
                  onIncrease={() => setNumberOfRooms(numberOfRooms + 1)}
                  onDecrease={() => setNumberOfRooms(numberOfRooms - 1)}
                  min={1}
                  max={5}
                />

                {/* Adults Count */}
                <CounterInput
                  label="Adults (18+ years old)"
                  value={adults}
                  onIncrease={() => setAdults(adults + 1)}
                  onDecrease={() => setAdults(adults - 1)}
                  min={1}
                  max={20}
                />

                {/* Children Section */}
                <div className="border rounded-lg p-4">
                  <div className="flex justify-between items-center mb-3">
                    <div className="flex items-center gap-2">
                      <Baby size={20} className="text-amber-500" />
                      <span className="font-medium text-gray-700">Children (0-17 years)</span>
                    </div>
                    <button
                      type="button"
                      onClick={handleAddChild}
                      className="text-amber-500 hover:text-amber-600 text-sm font-medium flex items-center gap-1"
                    >
                      <Plus size={16} /> Add Child
                    </button>
                  </div>
                  
                  {children.length === 0 && (
                    <p className="text-gray-400 text-sm text-center py-4">No children added. Click "Add Child" to include children in your booking.</p>
                  )}
                  
                  {children.map((child, index) => (
                    <div key={child.id} className="flex items-center gap-3 mt-3 p-3 bg-gray-50 rounded-lg">
                      <div className="flex-1">
                        <label className="block text-xs text-gray-500 mb-1">Child {index + 1} Age</label>
                        <select
                          value={child.age}
                          onChange={(e) => handleChildAgeChange(child.id, e.target.value)}
                          className="w-full px-3 py-2 border rounded-lg focus:border-amber-500 focus:ring-2 focus:ring-amber-200"
                        >
                          <option value={0}>0 years old</option>
                          {[...Array(18)].map((_, i) => (
                            <option key={i} value={i}>{i} years old</option>
                          ))}
                        </select>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveChild(child.id)}
                        className="mt-5 p-2 text-red-500 hover:text-red-600"
                      >
                        <X size={18} />
                      </button>
                    </div>
                  ))}
                </div>

                <div className="flex gap-4 pt-4">
                  <button 
                    onClick={handleSearchAvailability}
                    className="flex-1 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-lg font-semibold hover:shadow-lg transition-all duration-300"
                  >
                    Search Available Rooms
                  </button>
                  <button 
                    onClick={handleSeeCalendar}
                    className="flex-1 py-3 border-2 border-amber-500 text-amber-600 rounded-lg font-semibold hover:bg-amber-50 transition-all duration-300"
                  >
                    See Calendar
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Calendar Modal */}
      {showCalendarModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b p-4 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-800">Availability Calendar</h2>
              <button onClick={() => setShowCalendarModal(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                <X size={24} />
              </button>
            </div>
            
            <div className="p-6">
              {/* Legend */}
              <div className="flex justify-center gap-6 mb-6 pb-4 border-b">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                  <span className="text-sm">Available</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-yellow-500 rounded-full"></div>
                  <span className="text-sm">Limited Availability</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-red-500 rounded-full"></div>
                  <span className="text-sm">Fully Booked</span>
                </div>
              </div>

              {/* Calendar */}
              <DatePicker
                selected={null}
                onChange={() => {}}
                inline
                monthsShown={2}
                renderCustomHeader={({ monthDate, decreaseMonth, increaseMonth }) => (
                  <div className="flex justify-between items-center px-4 py-2">
                    <button onClick={decreaseMonth} className="p-2 hover:bg-gray-100 rounded-full">
                      <ChevronLeft size={20} />
                    </button>
                    <span className="font-bold text-gray-800">
                      {monthDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
                    </span>
                    <button onClick={increaseMonth} className="p-2 hover:bg-gray-100 rounded-full">
                      <ChevronRight size={20} />
                    </button>
                  </div>
                )}
                renderDayContents={(day, date) => {
                  if (!date) return <span>{day}</span>
                  const status = getDateStatus(date)
                  let bgColor = ''
                  let textColor = 'text-gray-700'
                  if (status === 'booked') {
                    bgColor = 'bg-red-500'
                    textColor = 'text-white'
                  } else if (status === 'partial') {
                    bgColor = 'bg-yellow-500'
                    textColor = 'text-white'
                  }
                  
                  return (
                    <div className="relative">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${bgColor} mx-auto`}>
                        <span className={textColor}>{day}</span>
                      </div>
                    </div>
                  )
                }}
              />

              {/* Booking Tips */}
              <div className="mt-6 p-4 bg-amber-50 rounded-lg">
                <h3 className="font-bold text-gray-800 mb-2">📅 Booking Tips</h3>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Check-in time: 3:00 PM | Check-out time: 12:00 NN</li>
                  <li>• Minimum stay: 1 night for overnight stays</li>
                  <li>• Peak season rates apply during holidays and weekends</li>
                  <li>• Advance booking is highly recommended</li>
                  <li>• For group bookings, please contact us directly</li>
                </ul>
              </div>

              <button 
                onClick={() => {
                  setShowCalendarModal(false)
                  setShowAvailabilityModal(true)
                }}
                className="mt-6 w-full py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-lg font-semibold hover:shadow-lg transition-all duration-300"
              >
                Check Availability for Specific Dates
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Rest of the HomePage content remains the same */}
      {/* Resort Overview Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent mb-4">
              Excellence Recognized
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-amber-500 to-orange-500 mx-auto rounded-full"></div>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 overflow-hidden group">
              <div className="h-2 bg-gradient-to-r from-amber-500 to-orange-500"></div>
              <div className="p-8 text-center">
                <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-amber-100 to-orange-100 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <Award size={40} className="text-amber-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-2">DOT Accredited</h3>
                <p className="text-gray-600">
                  Officially recognized by the Philippine Department of Tourism for meeting excellence standards
                </p>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 overflow-hidden group">
              <div className="h-2 bg-gradient-to-r from-amber-500 to-orange-500"></div>
              <div className="p-8 text-center">
                <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-amber-100 to-orange-100 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <Heart size={40} className="text-amber-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-2">Our Vision</h3>
                <p className="text-gray-600">
                  To be the premier beach resort destination in Samal Island, recognized for providing pristine, relaxing, and memorable tropical experiences.
                </p>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 overflow-hidden group">
              <div className="h-2 bg-gradient-to-r from-amber-500 to-orange-500"></div>
              <div className="p-8 text-center">
                <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-amber-100 to-orange-100 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <Shield size={40} className="text-amber-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-2">Our Mission</h3>
                <p className="text-gray-600">
                  To deliver exceptional hospitality, maintain clean natural environment, and offer affordable, high-quality accommodations.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-12 grid md:grid-cols-3 gap-6">
            {[
              { icon: Users, text: "Family-Friendly Environment" },
              { icon: CheckCircle, text: "Quality Service Guarantee" },
              { icon: Sun, text: "Sustainable Tourism" }
            ].map((value, idx) => (
              <div key={idx} className="flex items-center justify-center gap-3 bg-white/60 backdrop-blur-sm rounded-lg p-3">
                <value.icon size={24} className="text-amber-600" />
                <span className="text-gray-700 font-medium">{value.text}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Resort Features Section */}
      <section className="py-20 px-4 bg-gradient-to-b from-white to-amber-50">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent mb-4">
              Resort Features & Amenities
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-amber-500 to-orange-500 mx-auto rounded-full mb-6"></div>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Experience the best of Costa Marina with our world-class facilities and services
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, idx) => (
              <div key={idx} className="group relative overflow-hidden rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-3">
                <div className={`h-64 bg-gradient-to-br ${feature.color} relative overflow-hidden`}>
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-all duration-300"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <feature.icon size={80} className="text-white/40 group-hover:scale-125 transition-transform duration-500" />
                  </div>
                </div>
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6">
                  <h3 className="text-2xl font-bold text-white mb-2">{feature.title}</h3>
                  <p className="text-white/90 text-sm">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Services and Products Offered */}
          <div className="mt-16 bg-white rounded-2xl shadow-xl p-8">
            <h3 className="text-2xl font-bold text-center text-gray-800 mb-8">Services & Products Offered</h3>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { name: "Day Tours", price: "₱350/adult" },
                { name: "Overnight Cottages", price: "₱3,000 - ₱15,000" },
                { name: "Function Hall", price: "Up to 80 pax" },
                { name: "Water Sports", price: "Jet Ski, Banana Boat" },
                { name: "Boat Transport", price: "₱25/person" },
                { name: "Restaurant", price: "Dine-in & Catering" },
                { name: "Karaoke", price: "Available" },
                { name: "Beach Volleyball", price: "Free" }
              ].map((service, idx) => (
                <div key={idx} className="text-center p-4 rounded-lg hover:bg-amber-50 transition-all duration-300 cursor-pointer">
                  <p className="font-semibold text-gray-800">{service.name}</p>
                  <p className="text-sm text-amber-600">{service.price}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default HomePage