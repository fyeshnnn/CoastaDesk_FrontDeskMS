import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { 
  LayoutDashboard, Calendar, LogOut, User, Settings, 
  Home, CreditCard, Clock, CheckCircle, XCircle,
  Search, Eye, Download, Printer, ChevronDown,
  Bell, Star, Heart, Sun, Umbrella, Coffee,
  Phone, Mail, MapPin, Award, Shield, Users,
  TrendingUp, DollarSign, Package, AlertCircle, Tag
} from 'lucide-react'

function CustomerDashboard() {
  const navigate = useNavigate()
  const [currentTime, setCurrentTime] = useState(new Date())
  const [activeTab, setActiveTab] = useState('dashboard')
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  
  const [userData, setUserData] = useState({})

  // Customer Data
  const [myBookings, setMyBookings] = useState([
    { id: 1, bookingRef: 'BK-001', room: 'Cottage B', checkIn: '2026-05-20', checkOut: '2026-05-22', guests: 2, status: 'confirmed', amount: 9600, paid: 4800, balance: 4800, nights: 2 },
    { id: 2, bookingRef: 'BK-005', room: 'Cottage D', checkIn: '2026-06-10', checkOut: '2026-06-12', guests: 4, status: 'pending', amount: 11000, paid: 0, balance: 11000, nights: 2 },
    { id: 3, bookingRef: 'BK-008', room: 'Dormitory 1', checkIn: '2026-05-15', checkOut: '2026-05-16', guests: 6, status: 'completed', amount: 13000, paid: 13000, balance: 0, nights: 1 },
  ])

  const [myBills, setMyBills] = useState([
    { id: 1, billNumber: 'INV-001', bookingRef: 'BK-001', amount: 9600, paid: 4800, balance: 4800, status: 'partial', dueDate: '2026-05-22' },
    { id: 2, billNumber: 'INV-003', bookingRef: 'BK-008', amount: 13000, paid: 13000, balance: 0, status: 'paid', dueDate: '2026-05-16' },
  ])

  const [notifications, setNotifications] = useState([
    { id: 1, message: 'Your booking BK-001 is confirmed!', type: 'success', date: '2026-05-18', read: false },
    { id: 2, message: 'Payment reminder: Balance of ₱4,800 due on May 22', type: 'warning', date: '2026-05-18', read: false },
    { id: 3, message: 'Welcome to Costa Marina Beach Resort!', type: 'info', date: '2026-05-17', read: true },
  ])

  const [promotions, setPromotions] = useState([
    { id: 1, title: 'Early Bird Discount', description: 'Book 30 days in advance and get 15% off', code: 'EARLY15', validUntil: '2026-12-31' },
    { id: 2, title: 'Weekend Special', description: 'Stay Friday-Sunday and get free breakfast', code: 'WEEKEND', validUntil: '2026-08-31' },
    { id: 3, title: 'Group Booking', description: 'Book 3+ rooms and get 10% off', code: 'GROUP10', validUntil: '2026-12-31' },
  ])

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user') || '{}')
    setUserData(user)
    const timer = setInterval(() => setCurrentTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('user')
    localStorage.removeItem('userRole')
    navigate('/login')
  }

  const handleViewBooking = (booking) => {
    alert(`Viewing booking ${booking.bookingRef}`)
  }

  const handleCancelBooking = (bookingId) => {
    if (window.confirm('Cancel this booking? Cancellation policy applies.')) {
      setMyBookings(myBookings.map(b => b.id === bookingId ? { ...b, status: 'cancelled' } : b))
      alert('Booking cancelled successfully!')
    }
  }

  const handlePayNow = (bill) => {
    alert(`Proceeding to payment for bill ${bill.billNumber} - Amount: ₱${bill.balance.toLocaleString()}`)
  }

  const handleDownloadInvoice = (bill) => {
    alert(`Downloading invoice ${bill.billNumber}`)
  }

  const markNotificationAsRead = (id) => {
    setNotifications(notifications.map(n => n.id === id ? { ...n, read: true } : n))
  }

  const getFilteredBookings = () => {
    let filtered = myBookings
    if (searchTerm) {
      filtered = filtered.filter(b => 
        b.bookingRef.toLowerCase().includes(searchTerm.toLowerCase()) ||
        b.room.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }
    return filtered
  }

  const getStatusBadge = (status) => {
    const badges = {
      confirmed: 'bg-green-100 text-green-700',
      pending: 'bg-yellow-100 text-yellow-700',
      completed: 'bg-blue-100 text-blue-700',
      cancelled: 'bg-red-100 text-red-700',
      partial: 'bg-orange-100 text-orange-700',
      paid: 'bg-green-100 text-green-700'
    }
    return badges[status] || 'bg-gray-100 text-gray-700'
  }

  // Sidebar Component
  const Sidebar = () => (
    <div className="fixed left-0 top-0 h-full w-64 bg-gradient-to-b from-amber-900 to-orange-900 text-white shadow-xl z-30 overflow-y-auto">
      <div className="p-6 border-b border-white/20">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
            <span className="text-white text-xl font-bold">🌊</span>
          </div>
          <div>
            <h1 className="text-xl font-bold">CoastaDesk</h1>
            <p className="text-xs text-white/70">Customer Portal</p>
          </div>
        </div>
        <p className="text-xs text-amber-200">Welcome, {userData.first_name || 'Guest'}!</p>
      </div>

      <nav className="p-4 space-y-1">
        <button onClick={() => setActiveTab('dashboard')} className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-all ${activeTab === 'dashboard' ? 'bg-white/20 text-white' : 'text-white/70 hover:bg-white/10'}`}>
          <LayoutDashboard size={18} /> Dashboard
        </button>
        <button onClick={() => setActiveTab('bookings')} className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-all ${activeTab === 'bookings' ? 'bg-white/20 text-white' : 'text-white/70 hover:bg-white/10'}`}>
          <Calendar size={18} /> My Bookings
        </button>
        <button onClick={() => setActiveTab('bills')} className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-all ${activeTab === 'bills' ? 'bg-white/20 text-white' : 'text-white/70 hover:bg-white/10'}`}>
          <CreditCard size={18} /> Bills & Payments
        </button>
        <button onClick={() => setActiveTab('promotions')} className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-all ${activeTab === 'promotions' ? 'bg-white/20 text-white' : 'text-white/70 hover:bg-white/10'}`}>
          <Tag size={18} /> Promotions
        </button>
        <button onClick={() => setActiveTab('support')} className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-all ${activeTab === 'support' ? 'bg-white/20 text-white' : 'text-white/70 hover:bg-white/10'}`}>
          <Phone size={18} /> Support
        </button>
      </nav>
    </div>
  )

  // Dashboard Home
  const renderDashboard = () => (
    <div>
      <div className="bg-gradient-to-r from-amber-500 to-orange-500 rounded-2xl p-8 mb-8 text-white">
        <h2 className="text-3xl font-bold mb-2">Welcome back, {userData.first_name || 'Guest'}!</h2>
        <p className="text-white/90">Your next tropical getaway awaits. Check your upcoming stays and exclusive offers.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-blue-500">
          <div className="flex justify-between items-start">
            <div><p className="text-gray-500 text-sm">Upcoming Bookings</p><p className="text-3xl font-bold text-gray-800">{myBookings.filter(b => b.status === 'confirmed').length}</p></div>
            <Calendar size={32} className="text-blue-500" />
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-green-500">
          <div className="flex justify-between items-start">
            <div><p className="text-gray-500 text-sm">Completed Stays</p><p className="text-3xl font-bold text-gray-800">{myBookings.filter(b => b.status === 'completed').length}</p></div>
            <CheckCircle size={32} className="text-green-500" />
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-red-500">
          <div className="flex justify-between items-start">
            <div><p className="text-gray-500 text-sm">Pending Balance</p><p className="text-3xl font-bold text-gray-800">₱{myBills.reduce((sum, b) => sum + b.balance, 0).toLocaleString()}</p></div>
            <DollarSign size={32} className="text-red-500" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2"><Calendar size={20} className="text-amber-500" /> Upcoming Stays</h3>
          <div className="space-y-3">
            {myBookings.filter(b => b.status === 'confirmed' || b.status === 'pending').slice(0, 3).map(booking => (
              <div key={booking.id} className="p-3 bg-gray-50 rounded-lg border-l-4 border-amber-500">
                <div className="flex justify-between items-start">
                  <div><p className="font-medium">{booking.room}</p><p className="text-sm text-gray-500">{booking.checkIn} to {booking.checkOut} · {booking.nights} nights</p></div>
                  <span className={`text-xs px-2 py-1 rounded-full ${getStatusBadge(booking.status)}`}>{booking.status}</span>
                </div>
                <div className="flex justify-between mt-2">
                  <span className="text-sm">₱{booking.amount.toLocaleString()}</span>
                  <div className="flex gap-2">
                    <button onClick={() => handleViewBooking(booking)} className="text-blue-600 text-sm">View</button>
                    <button onClick={() => handleCancelBooking(booking.id)} className="text-red-600 text-sm">Cancel</button>
                  </div>
                </div>
              </div>
            ))}
            {myBookings.filter(b => b.status === 'confirmed' || b.status === 'pending').length === 0 && <p className="text-gray-500 text-center py-4">No upcoming bookings</p>}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2"><Bell size={20} className="text-amber-500" /> Notifications</h3>
          <div className="space-y-3">
            {notifications.slice(0, 3).map(notif => (
              <div key={notif.id} className={`p-3 rounded-lg cursor-pointer transition-all ${notif.read ? 'bg-gray-50' : 'bg-amber-50 border-l-4 border-amber-500'}`} onClick={() => markNotificationAsRead(notif.id)}>
                <p className="text-sm text-gray-700">{notif.message}</p>
                <p className="text-xs text-gray-400 mt-1">{notif.date}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-8 bg-white rounded-xl shadow-sm p-6">
        <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2"><Star size={20} className="text-amber-500" /> Resort Highlights</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-3"><div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2"><Sun size={24} className="text-blue-600" /></div><p className="font-medium">Pristine Beach</p></div>
          <div className="text-center p-3"><div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2"><Umbrella size={24} className="text-green-600" /></div><p className="font-medium">Water Sports</p></div>
          <div className="text-center p-3"><div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-2"><Coffee size={24} className="text-amber-600" /></div><p className="font-medium">Restaurant</p></div>
          <div className="text-center p-3"><div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2"><Heart size={24} className="text-purple-600" /></div><p className="font-medium">Spa Services</p></div>
        </div>
      </div>
    </div>
  )

  // My Bookings Tab
  const renderBookings = () => {
    const filteredBookings = getFilteredBookings()
    
    return (
      <div>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">My Bookings</h2>
          <Link to="/rooms"><button className="bg-amber-500 text-white px-4 py-2 rounded-lg hover:bg-amber-600 transition-all">+ New Booking</button></Link>
        </div>
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="p-4 border-b">
            <div className="relative">
              <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input 
                type="text" 
                placeholder="Search bookings..." 
                value={searchTerm} 
                onChange={(e) => setSearchTerm(e.target.value)} 
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:border-amber-500 focus:ring-2 focus:ring-amber-200"
              />
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Booking #</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Room</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Check In</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Check Out</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Guests</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredBookings.map(booking => (
                  <tr key={booking.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-mono text-gray-600">{booking.bookingRef}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{booking.room}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">{booking.checkIn}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">{booking.checkOut}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">{booking.guests}</td>
                    <td className="px-6 py-4 text-sm font-semibold text-gray-800">₱{booking.amount.toLocaleString()}</td>
                    <td className="px-6 py-4">
                      <span className={`text-xs px-2 py-1 rounded-full ${getStatusBadge(booking.status)}`}>{booking.status}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <button onClick={() => handleViewBooking(booking)} className="text-blue-600 hover:text-blue-800">
                          <Eye size={16} />
                        </button>
                        {booking.status !== 'cancelled' && (
                          <button onClick={() => handleCancelBooking(booking.id)} className="text-red-600 hover:text-red-800">
                            <XCircle size={16} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    )
  }

  // Bills & Payments Tab
  const renderBills = () => (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Bills & Payments</h2>
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Bill #</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Booking #</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Paid</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Balance</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Due Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {myBills.map(bill => (
                <tr key={bill.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-mono text-gray-600">{bill.billNumber}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{bill.bookingRef}</td>
                  <td className="px-6 py-4 text-sm font-semibold text-gray-800">₱{bill.amount.toLocaleString()}</td>
                  <td className="px-6 py-4 text-sm text-green-600">₱{bill.paid.toLocaleString()}</td>
                  <td className="px-6 py-4 text-sm text-red-600">₱{bill.balance.toLocaleString()}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{bill.dueDate}</td>
                  <td className="px-6 py-4">
                    <span className={`text-xs px-2 py-1 rounded-full ${getStatusBadge(bill.status)}`}>{bill.status}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      {bill.balance > 0 && (
                        <button onClick={() => handlePayNow(bill)} className="bg-green-500 text-white px-3 py-1 rounded text-sm hover:bg-green-600 transition-all">
                          Pay Now
                        </button>
                      )}
                      <button onClick={() => handleDownloadInvoice(bill)} className="text-gray-600 hover:text-gray-800">
                        <Download size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
        <p className="text-sm text-blue-800">💡 Tip: Pay your balance before check-out to enjoy a seamless departure experience.</p>
      </div>
    </div>
  )

  // Promotions Tab
  const renderPromotions = () => (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Exclusive Promotions</h2>
      <div className="grid md:grid-cols-2 gap-6">
        {promotions.map(promo => (
          <div key={promo.id} className="bg-gradient-to-r from-amber-500 to-orange-500 rounded-xl p-6 text-white">
            <div className="flex justify-between items-start mb-3">
              <h3 className="text-xl font-bold">{promo.title}</h3>
              <span className="bg-white/20 px-3 py-1 rounded-full text-sm">Valid until {promo.validUntil}</span>
            </div>
            <p className="text-white/90 mb-4">{promo.description}</p>
            <div className="flex items-center gap-2">
              <span className="text-sm">Use code:</span>
              <code className="bg-white/20 px-3 py-1 rounded font-mono">{promo.code}</code>
            </div>
          </div>
        ))}
      </div>
    </div>
  )

  // Support Tab
  const renderSupport = () => (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Customer Support</h2>
      <div className="grid md:grid-cols-2 gap-8">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2"><Phone size={20} className="text-amber-500" /> Contact Us</h3>
          <div className="space-y-3">
            <div className="flex items-center gap-3"><Phone size={16} className="text-gray-400" /><span>+63 917-7958-372</span></div>
            <div className="flex items-center gap-3"><Mail size={16} className="text-gray-400" /><span>costamarinabeachresort@yahoo.com</span></div>
            <div className="flex items-center gap-3"><MapPin size={16} className="text-gray-400" /><span>Km. 9, Sasa, Davao City</span></div>
          </div>
          <div className="mt-4 pt-4 border-t">
            <p className="text-sm text-gray-600">Office Hours: Monday to Sunday, 8:00 AM - 5:00 PM</p>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2"><AlertCircle size={20} className="text-amber-500" /> FAQ Quick Links</h3>
          <div className="space-y-2">
            <Link to="/faq" className="block p-2 bg-gray-50 rounded-lg hover:bg-gray-100 transition-all">What are the check-in/check-out times?</Link>
            <Link to="/faq" className="block p-2 bg-gray-50 rounded-lg hover:bg-gray-100 transition-all">What is your cancellation policy?</Link>
            <Link to="/faq" className="block p-2 bg-gray-50 rounded-lg hover:bg-gray-100 transition-all">Are pets allowed?</Link>
            <Link to="/faq" className="block p-2 bg-gray-50 rounded-lg hover:bg-gray-100 transition-all">What payment methods do you accept?</Link>
          </div>
        </div>
      </div>
      <div className="mt-8 bg-white rounded-xl shadow-sm p-6">
        <h3 className="font-semibold text-gray-800 mb-4">Send us a message</h3>
        <textarea rows="4" className="w-full p-3 border rounded-lg mb-3 focus:border-amber-500 focus:ring-2 focus:ring-amber-200" placeholder="Type your message here..."></textarea>
        <button className="bg-amber-500 text-white px-6 py-2 rounded-lg hover:bg-amber-600 transition-all">Send Message</button>
      </div>
    </div>
  )

  const renderContent = () => {
    switch(activeTab) {
      case 'dashboard': return renderDashboard()
      case 'bookings': return renderBookings()
      case 'bills': return renderBills()
      case 'promotions': return renderPromotions()
      case 'support': return renderSupport()
      default: return renderDashboard()
    }
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Sidebar />
      <div className="ml-64">
        <header className="bg-white shadow-sm sticky top-0 z-20 px-8 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Customer Dashboard</h1>
            <p className="text-sm text-gray-500">{currentTime.toLocaleString()}</p>
          </div>
          <div className="relative">
            <button onClick={() => setShowUserMenu(!showUserMenu)} className="flex items-center gap-3 hover:bg-gray-100 px-3 py-2 rounded-lg transition-all">
              <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-500 rounded-full flex items-center justify-center">
                <User size={20} className="text-white" />
              </div>
              <span>{userData.first_name || 'Guest'}</span>
              <ChevronDown size={16} className="text-gray-400" />
            </button>
            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border z-50">
                <Link to="/my-account" className="block px-4 py-2 hover:bg-gray-100">My Account</Link>
                <Link to="/settings" className="block px-4 py-2 hover:bg-gray-100">Settings</Link>
                <hr className="my-1" />
                <button onClick={handleLogout} className="w-full text-left px-4 py-2 hover:bg-red-50 text-red-600">Logout</button>
              </div>
            )}
          </div>
        </header>
        <div className="p-8">{renderContent()}</div>
      </div>
    </div>
  )
}

export default CustomerDashboard