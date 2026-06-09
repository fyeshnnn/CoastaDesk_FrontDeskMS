import { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { CheckCircle } from 'lucide-react'
import RoomCard from '../components/RoomCard'

// Move FilterSummary outside of the component to avoid recreation during render
const FilterSummary = ({ searchParams, onModifySearch }) => (
  <div className="bg-amber-50 rounded-xl p-4 mb-6 border border-amber-200">
    <div className="flex justify-between items-start">
      <div>
        <h3 className="font-semibold text-gray-800 mb-2">Your Search Details</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
          <div>
            <span className="text-gray-500">Check-in:</span>
            <p className="font-medium">{searchParams?.checkIn ? new Date(searchParams.checkIn).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : '-'}</p>
          </div>
          <div>
            <span className="text-gray-500">Check-out:</span>
            <p className="font-medium">{searchParams?.checkOut ? new Date(searchParams.checkOut).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : '-'}</p>
          </div>
          <div>
            <span className="text-gray-500">Rooms:</span>
            <p className="font-medium">{searchParams?.numberOfRooms || 1}</p>
          </div>
          <div>
            <span className="text-gray-500">Total Guests:</span>
            <p className="font-medium">{(searchParams?.adults || 0) + (searchParams?.children?.length || 0)} persons</p>
          </div>
        </div>
        
        {/* Guest details - Fixed formatting */}
        <div className="mt-2 text-sm">
          <span className="text-gray-500">Adults:</span> 
          <span className="font-medium ml-1">{searchParams?.adults || 0}</span>
          
          {searchParams?.children?.length > 0 && (
            <span className="ml-3">
              <span className="text-gray-500">Children:</span> 
              <span className="font-medium ml-1">{searchParams.children.length}</span>
              <span className="text-gray-500 ml-1">({searchParams.children.map(c => `${c.age} yrs`).join(', ')})</span>
            </span>
          )}
        </div>
      </div>
      <button 
        onClick={onModifySearch}
        className="text-amber-600 text-sm hover:underline"
      >
        Modify Search
      </button>
    </div>
    <p className="text-sm text-green-700 mt-3 flex items-center gap-1">
      <CheckCircle size={14} />
      Showing available rooms for your selected dates
    </p>
  </div>
)

function RoomsPage() {
  const location = useLocation()
  const [searchParams, setSearchParams] = useState(null)
  const [isSearchResult, setIsSearchResult] = useState(false)

  // Room data (same as before)
  const singleRooms = [
    { name: "Casa Maria", price: 4800, capacity: 4, minHeads: 2 },
    { name: "Casa Lucia", price: 4800, capacity: 2, minHeads: 2 },
    { name: "Casa Paeng", price: 4800, capacity: 4, minHeads: 2 },
    { name: "Casa Pia", price: 5500, capacity: 5, minHeads: 2 },
    { name: "Casa Pian", price: 4800, capacity: 4, minHeads: 2 },
    { name: "Casa Pimi", price: 4800, capacity: 4, minHeads: 2 },
    { name: "Casa Pilar", price: 4800, capacity: 4, minHeads: 2 }
  ]

  const hotelRooms = [
    { name: "Casa Nemesio (Room N101)", price: 4800, capacity: 5, minHeads: 2 },
    { name: "Casa Nemesio (Room N106)", price: 4800, capacity: 5, minHeads: 2 },
    { name: "Casa Nemesio (Room N102)", price: 4500, capacity: 3, minHeads: 2 },
    { name: "Casa Nemesio (Room N105)", price: 4500, capacity: 3, minHeads: 2 },
    { name: "Casa Nemesio (Room N103)", price: 4800, capacity: 4, minHeads: 2 },
    { name: "Casa Nemesio (Room N104)", price: 4800, capacity: 4, minHeads: 2 },
    { name: "Casa Nemesio (Room N201)", price: 4800, capacity: 5, minHeads: 2 },
    { name: "Casa Nemesio (Room N206)", price: 4800, capacity: 5, minHeads: 2 },
    { name: "Casa Nemesio (Room N202)", price: 4500, capacity: 2, minHeads: 2 },
    { name: "Casa Nemesio (Room N205)", price: 4500, capacity: 3, minHeads: 2 },
    { name: "Casa Nemesio (Room N203)", price: 4800, capacity: 4, minHeads: 2 },
    { name: "Casa Nemesio (Room N204)", price: 4800, capacity: 4, minHeads: 2 }
  ]

  const dormitoryRooms = [
    { name: "Casa Theresa", price: 13000, capacity: 10, minHeads: 5 }
  ]

  const duplexRooms = [
    { name: "Casa Mayee (Room Casa Mayee 1)", price: 4800, capacity: 2, minHeads: 2 },
    { name: "Casa Mayee (Room Casa Mayee 1&2)", price: 9000, capacity: 6, minHeads: 4 },
    { name: "Casa Mayee (Room Casa Mayee 2)", price: 4800, capacity: 2, minHeads: 2 }
  ]

  const villaRooms = [
    { name: "Villa Rosario", price: 20000, capacity: 10, minHeads: 5 }
  ]

  const handleModifySearch = () => {
    // Clear localStorage and reset search params
    localStorage.removeItem('roomSearchParams')
    setSearchParams(null)
    setIsSearchResult(false)
  }
  useEffect(() => {
    // Check for search params from localStorage
    const storedParams = localStorage.getItem('roomSearchParams')
    if (storedParams) {
      const params = JSON.parse(storedParams)
      // Use a timeout to avoid the cascading render warning
      const timer = setTimeout(() => {
        setSearchParams(params)
        setIsSearchResult(true)
      }, 0)
      return () => clearTimeout(timer)
    }
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white pt-24">
      <div className="container mx-auto max-w-6xl px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent mb-4">
            Available Rooms
          </h1>
          <div className="w-24 h-1 bg-gradient-to-r from-amber-500 to-orange-500 mx-auto rounded-full"></div>
          <p className="text-gray-600 mt-4 text-lg">Select your preferred accommodation</p>
        </div>

        {isSearchResult && searchParams && (
          <FilterSummary 
            searchParams={searchParams} 
            onModifySearch={handleModifySearch}
          />
        )}

        {/* Single Type */}
        <div className="mb-16">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            <span className="w-1 h-8 bg-amber-500 rounded-full"></span>
            Single Type
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {singleRooms.map((room, idx) => (
              <RoomCard key={idx} room={room} type="Single" searchParams={searchParams} />
            ))}
          </div>
        </div>

        {/* Hotel Type */}
        <div className="mb-16">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            <span className="w-1 h-8 bg-amber-500 rounded-full"></span>
            Hotel Type
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {hotelRooms.map((room, idx) => (
              <RoomCard key={idx} room={room} type="Hotel" searchParams={searchParams} />
            ))}
          </div>
        </div>

        {/* Dormitory Type */}
        <div className="mb-16">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            <span className="w-1 h-8 bg-amber-500 rounded-full"></span>
            Dormitory Type
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {dormitoryRooms.map((room, idx) => (
              <RoomCard key={idx} room={room} type="Dormitory" searchParams={searchParams} />
            ))}
          </div>
        </div>

        {/* Duplex Type */}
        <div className="mb-16">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            <span className="w-1 h-8 bg-amber-500 rounded-full"></span>
            Duplex Type
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {duplexRooms.map((room, idx) => (
              <RoomCard key={idx} room={room} type="Duplex" searchParams={searchParams} />
            ))}
          </div>
        </div>

        {/* Villa Type */}
        <div className="mb-16">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            <span className="w-1 h-8 bg-amber-500 rounded-full"></span>
            Villa Type
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {villaRooms.map((room, idx) => (
              <RoomCard key={idx} room={room} type="Villa" searchParams={searchParams} />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default RoomsPage