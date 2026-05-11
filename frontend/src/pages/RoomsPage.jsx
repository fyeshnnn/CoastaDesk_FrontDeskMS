import { useEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'
import RoomCard from '../components/RoomCard'

function RoomsPage() {
  const location = useLocation()
  const singleRef = useRef(null)
  const hotelRef = useRef(null)
  const dormitoryRef = useRef(null)
  const duplexRef = useRef(null)
  const villaRef = useRef(null)

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

  // Scroll to specific room type when coming from search availability
  useEffect(() => {
    if (location.state?.scrollToType) {
      const scrollMap = {
        'single': singleRef,
        'hotel': hotelRef,
        'dormitory': dormitoryRef,
        'duplex': duplexRef,
        'villa': villaRef
      }
      const targetRef = scrollMap[location.state.scrollToType]
      if (targetRef?.current) {
        setTimeout(() => {
          targetRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }, 100)
      }
    }
  }, [location.state])

  // Also scroll if coming from "Book a Room" button
  useEffect(() => {
    // Check if there's a hash in the URL
    if (window.location.hash) {
      const element = document.querySelector(window.location.hash)
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }, 100)
      }
    }
  }, [])

  const scrollToSection = (ref) => {
    ref.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white pt-24">
      <div className="container mx-auto max-w-6xl px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent mb-4">
            Our Accommodations
          </h1>
          <div className="w-24 h-1 bg-gradient-to-r from-amber-500 to-orange-500 mx-auto rounded-full"></div>
          <p className="text-gray-600 mt-4 text-lg">Choose from our wide selection of comfortable and affordable rooms</p>
        </div>

        {/* Quick Navigation Links */}
        <div className="flex flex-wrap justify-center gap-3 mb-10">
          <button onClick={() => scrollToSection(singleRef)} className="px-4 py-2 bg-amber-100 text-amber-700 rounded-full hover:bg-amber-200 transition text-sm font-medium">Single Type</button>
          <button onClick={() => scrollToSection(hotelRef)} className="px-4 py-2 bg-amber-100 text-amber-700 rounded-full hover:bg-amber-200 transition text-sm font-medium">Hotel Type</button>
          <button onClick={() => scrollToSection(dormitoryRef)} className="px-4 py-2 bg-amber-100 text-amber-700 rounded-full hover:bg-amber-200 transition text-sm font-medium">Dormitory Type</button>
          <button onClick={() => scrollToSection(duplexRef)} className="px-4 py-2 bg-amber-100 text-amber-700 rounded-full hover:bg-amber-200 transition text-sm font-medium">Duplex Type</button>
          <button onClick={() => scrollToSection(villaRef)} className="px-4 py-2 bg-amber-100 text-amber-700 rounded-full hover:bg-amber-200 transition text-sm font-medium">Villa Type</button>
        </div>

        {/* Single Type */}
        <div ref={singleRef} className="mb-16 scroll-mt-24">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            <span className="w-1 h-8 bg-amber-500 rounded-full"></span>
            Single Type
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {singleRooms.map((room, idx) => (
              <RoomCard key={idx} room={room} type="Single" />
            ))}
          </div>
        </div>

        {/* Hotel Type */}
        <div ref={hotelRef} className="mb-16 scroll-mt-24">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            <span className="w-1 h-8 bg-amber-500 rounded-full"></span>
            Hotel Type
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {hotelRooms.map((room, idx) => (
              <RoomCard key={idx} room={room} type="Hotel" />
            ))}
          </div>
        </div>

        {/* Dormitory Type */}
        <div ref={dormitoryRef} className="mb-16 scroll-mt-24">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            <span className="w-1 h-8 bg-amber-500 rounded-full"></span>
            Dormitory Type
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {dormitoryRooms.map((room, idx) => (
              <RoomCard key={idx} room={room} type="Dormitory" />
            ))}
          </div>
        </div>

        {/* Duplex Type */}
        <div ref={duplexRef} className="mb-16 scroll-mt-24">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            <span className="w-1 h-8 bg-amber-500 rounded-full"></span>
            Duplex Type
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {duplexRooms.map((room, idx) => (
              <RoomCard key={idx} room={room} type="Duplex" />
            ))}
          </div>
        </div>

        {/* Villa Type */}
        <div ref={villaRef} className="mb-16 scroll-mt-24">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            <span className="w-1 h-8 bg-amber-500 rounded-full"></span>
            Villa Type
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {villaRooms.map((room, idx) => (
              <RoomCard key={idx} room={room} type="Villa" />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default RoomsPage