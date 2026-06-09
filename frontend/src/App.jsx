import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Link, useLocation, Navigate, useNavigate } from 'react-router-dom'
import { Home, Bed, Compass, Info, HelpCircle, Phone, Mail, Phone as PhoneIcon, MapPin, Waves, User, LogOut } from 'lucide-react'
import HomePage from './pages/HomePage'
import RoomsPage from './pages/RoomsPage'
import ActivitiesPage from './pages/ActivitiesPage'
import AboutPage from './pages/AboutPage'
import FAQPage from './pages/FAQPage'
import ContactPage from './pages/ContactPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import StaffDashboard from './pages/dashboard/StaffDashboard'
import ManagerDashboard from './pages/dashboard/ManagerDashboard'
import AdminDashboard from './pages/dashboard/AdminDashboard'
import MyAccountPage from './pages/MyAccountPage'
import SettingsPage from './pages/SettingsPage'
import CustomerDashboard from './pages/dashboard/CustomerDashboard'

// Protected Route Component
function ProtectedRoute({ children, allowedRoles }) {
  const isAuthenticated = localStorage.getItem('user')
  const userRole = localStorage.getItem('userRole')
  
  if (!isAuthenticated) {
    return <Navigate to="/login" />
  }
  
  if (allowedRoles && !allowedRoles.includes(userRole)) {
    return <Navigate to="/" />
  }
  return children
}

function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [userName, setUserName] = useState('')
  const [userRole, setUserRole] = useState('')
  const location = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    
    // Check login status
    const user = localStorage.getItem('user')
    const role = localStorage.getItem('userRole')
    if (user) {
      setIsLoggedIn(true)
      setUserRole(role || '')
      try {
        const userData = JSON.parse(user)
        setUserName(userData.firstName || userData.username)
      } catch (e) {
        console.error('Error parsing user data', e)
      }
    }
    
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('user')
    localStorage.removeItem('userRole')
    setIsLoggedIn(false)
    window.location.href = '/'
  }

  const handleLogoClick = (e) => {
    e.preventDefault()
    if (location.pathname === '/') {
      // If already on home page, scroll to top
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } else {
      // If on another page, navigate to home
      navigate('/')
      // Small delay to allow navigation before scrolling
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' })
      }, 100)
    }
  }

  // Don't show navbar on dashboard pages for staff/manager/admin
  const isDashboardPage = location.pathname.includes('/staff') || 
                          location.pathname.includes('/manager') || 
                          location.pathname.includes('/admin') ||
                          location.pathname.includes('/login') ||
                          location.pathname.includes('/register')
  
  if (isDashboardPage) {
    return null
  }

  const navItems = [
    { path: '/', label: 'Home' },
    { path: '/rooms', label: 'Rooms' },
    { path: '/activities', label: 'Activities' },
    { path: '/about', label: 'About Us' },
    { path: '/faq', label: 'FAQ' },
    { path: '/contact', label: 'Contact' }
  ]

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${
      scrolled ? 'bg-white shadow-lg py-3' : 'bg-white py-4'
    }`}>
      <div className="container mx-auto px-6">
        <div className="flex justify-between items-center">
          
          {/* Logo Section - Clickable to go to home/top */}
          <button 
            onClick={handleLogoClick}
            className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity"
          >
            <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-white text-xl font-bold">🌊</span>
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
                Costa Marina
              </h1>
              <p className="text-xs text-gray-500">Beach Resort</p>
            </div>
          </button>

          {/* Desktop Navigation - Centered */}
          <div className="flex items-center justify-center gap-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`relative px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                  location.pathname === item.path 
                    ? 'text-amber-600 bg-amber-50' 
                    : 'text-gray-600 hover:text-amber-600 hover:bg-amber-50'
                }`}
              >
                {item.label}
                {location.pathname === item.path && (
                  <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-6 h-0.5 bg-amber-500 rounded-full"></span>
                )}
              </Link>
            ))}
          </div>

          {/* Login/User Button */}
          <div className="flex items-center gap-3">
            {isLoggedIn ? (
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-gradient-to-br from-amber-500 to-orange-500 rounded-full flex items-center justify-center">
                    <User size={16} className="text-white" />
                  </div>
                  <span className="text-sm font-medium text-gray-700">Hi, {userName}</span>
                </div>
                <button 
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-3 py-1.5 bg-red-500 text-white rounded-lg font-medium hover:bg-red-600 transition-all duration-300 text-sm"
                >
                  <LogOut size={16} />
                  Logout
                </button>
              </div>
            ) : (
              <Link to="/login">
                <button className="flex items-center gap-2 px-4 py-1.5 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-lg font-medium hover:shadow-lg hover:scale-105 transition-all duration-300 text-sm">
                  <span>🔑</span>
                  Login
                </button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}

function Footer() {
  const location = useLocation()
  
  // Don't show footer on dashboard pages
  const isDashboardPage = location.pathname.includes('/staff') || 
                          location.pathname.includes('/manager') || 
                          location.pathname.includes('/admin') ||
                          location.pathname.includes('/login') ||
                          location.pathname.includes('/register')
  
  if (isDashboardPage) {
    return null
  }

  const quickLinks = [
    { label: 'Beach', icon: Waves, path: '/' },
    { label: 'Accommodations', icon: Bed, path: '/rooms' },
    { label: 'Activities', icon: Compass, path: '/activities' }
  ]

  return (
    <footer className="bg-gray-900 text-white py-12 px-6">
      <div className="container mx-auto max-w-6xl">
        <div className="grid grid-cols-4 gap-8">
          
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-500 rounded-xl flex items-center justify-center">
                <span className="text-white text-xl font-bold">🌊</span>
              </div>
              <h3 className="text-xl font-bold">CoastaDesk</h3>
            </div>
            <p className="text-gray-400 text-sm mb-4">
              Your premier front-desk management solution for an unforgettable beach resort experience.
            </p>
            <div className="flex gap-3">
              <a href="#" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-amber-500 transition-all duration-300">
                <span>📘</span>
              </a>
              <a href="#" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-amber-500 transition-all duration-300">
                <span>📷</span>
              </a>
              <a href="#" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-amber-500 transition-all duration-300">
                <span>🐦</span>
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-lg mb-4">Quick Links</h4>
            <ul className="space-y-2">
              {quickLinks.map((link, idx) => (
                <li key={idx}>
                  <Link to={link.path} className="text-gray-400 hover:text-amber-400 transition-colors flex items-center gap-2">
                    <link.icon size={14} />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-lg mb-4">Contact Info</h4>
            <ul className="space-y-3 text-gray-400 text-sm">
              <li className="flex items-start gap-2">
                <Mail size={16} className="mt-0.5 flex-shrink-0" />
                <span>costamarinabeachresort@yahoo.com</span>
              </li>
              <li className="flex items-start gap-2">
                <PhoneIcon size={16} className="mt-0.5 flex-shrink-0" />
                <span>Globe: +639-177-958-372<br />Globe: +639-171-455-125<br />Smart: +639-190-080-827</span>
              </li>
              <li className="flex items-start gap-2">
                <MapPin size={16} className="mt-0.5 flex-shrink-0" />
                <span>Km. 9, Sasa, Davao City</span>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-lg mb-4">Location</h4>
            <div className="bg-gray-800 rounded-lg h-40 flex items-center justify-center text-gray-500 text-sm">
              [Google Maps Embed Placeholder]
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-500 text-sm">
          <p>&copy; 2026 CoastaDesk - Costa Marina Beach Resort. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-b from-amber-50 via-orange-50 to-red-50">
        <Routes>
          {/* Auth Routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/my-account" element={<MyAccountPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          
          {/* Staff Dashboard Routes */}
          <Route path="/staff/*" element={
            <ProtectedRoute allowedRoles={['staff']}>
              <StaffDashboard />
            </ProtectedRoute>
          } />
          
          {/* Manager Dashboard Routes */}
          <Route path="/manager/*" element={
            <ProtectedRoute allowedRoles={['manager']}>
              <ManagerDashboard />
            </ProtectedRoute>
          } />
          
          {/* Admin Dashboard Routes */}
          <Route path="/admin/*" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminDashboard />
            </ProtectedRoute>
          } />
          
          <Route path="/customer/*" element={
  <ProtectedRoute allowedRoles={['customer']}>
    <CustomerDashboard />
  </ProtectedRoute>
} />
          {/* Public Routes with Navbar and Footer */}
          <Route path="/*" element={
            <>
              <Navbar />
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/rooms" element={<RoomsPage />} />
                <Route path="/activities" element={<ActivitiesPage />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/faq" element={<FAQPage />} />
                <Route path="/contact" element={<ContactPage />} />
              </Routes>
              <Footer />
            </>
          } />
        </Routes>
      </div>
    </Router>
  )
}

export default App