import { useState, useEffect, useCallback } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { 
  LayoutDashboard, Users, Calendar, LogOut, User, Settings, 
  Home, Plus, FileText, AlertCircle, Shield, Database,
  Tag, Server, Activity, UserPlus, Edit, Archive,
  XCircle, CheckCircle, Clock, Search, X, ChevronRight,
  DollarSign, Download, Printer, Target, Award, RefreshCw,
  ChevronDown, TrendingUp, Eye, Trash2, Key, BookOpen,
  CreditCard, List, Grid, Filter, Phone, Mail, MapPin,
  Star, Heart, Sun, Umbrella, Coffee, UtensilsCrossed
} from 'lucide-react'

function AdminDashboard() {
  const navigate = useNavigate()
  const location = useLocation()
  const [currentTime, setCurrentTime] = useState(new Date())
  const [activeTab, setActiveTab] = useState(() => {
    // Get saved tab from URL hash or default to dashboard
    const hash = window.location.hash.replace('#', '')
    return hash || 'dashboard'
  })
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [loading, setLoading] = useState(false)
  
  // Filter states
  const [searchTerm, setSearchTerm] = useState('')
  const [filterRole, setFilterRole] = useState('all')
  const [filterStatus, setFilterStatus] = useState('all')
  const [filterEntityType, setFilterEntityType] = useState('all')
  const [filterModule, setFilterModule] = useState('all')
  const [filterReservationStatus, setFilterReservationStatus] = useState('all')
  const [filterPaymentStatus, setFilterPaymentStatus] = useState('all')
  const [entriesPerPage, setEntriesPerPage] = useState(10)
  const [currentPage, setCurrentPage] = useState(1)
  const [dateRange, setDateRange] = useState({ start: '', end: '' })
  const [reportFormat, setReportFormat] = useState('pdf')
  
  // Modal states
  const [showUserModal, setShowUserModal] = useState(false)
  const [showRoomModal, setShowRoomModal] = useState(false)
  const [showAddOnModal, setShowAddOnModal] = useState(false)
  const [showCategoryModal, setShowCategoryModal] = useState(false)
  const [showRoleModal, setShowRoleModal] = useState(false)
  const [showRestoreModal, setShowRestoreModal] = useState(false)
  const [showReservationModal, setShowReservationModal] = useState(false)
  const [showGuestModal, setShowGuestModal] = useState(false)
  const [showBillModal, setShowBillModal] = useState(false)
  const [editingItem, setEditingItem] = useState(null)
  const [selectedArchive, setSelectedArchive] = useState(null)
  const [selectedReservation, setSelectedReservation] = useState(null)
  const [selectedGuest, setSelectedGuest] = useState(null)
  const [selectedBill, setSelectedBill] = useState(null)
  const [modalData, setModalData] = useState({})

  // Add this at the top of your component (after the useState declarations)
const handleTabChange = (tab) => {
  setActiveTab(tab)
  // Reset pagination when changing tabs
  setCurrentPage(1)
  setSearchTerm('')
  // Clear any filters
  if (tab === 'reservations') {
    setFilterReservationStatus('all')
  } else if (tab === 'billing') {
    setFilterPaymentStatus('all')
  } else if (tab === 'users') {
    setFilterRole('all')
    setFilterStatus('all')
  } else if (tab === 'roomsConfig' || tab === 'addons') {
    setFilterStatus('all')
  } else if (tab === 'archived') {
    setFilterEntityType('all')
  } else if (tab === 'activity') {
    setFilterModule('all')
    setDateRange({ start: '', end: '' })
  }
}

  // Data states
  const [dashboardStats, setDashboardStats] = useState({
    staff: { total: 6, frontDesk: 3, manager: 2, admin: 1 },
    rooms: { total: 12, active: 8, inactive: 2, maintenance: 2 },
    guests: { total: 214 },
    addOns: { total: 18, active: 15, inactive: 3, categories: 5 },
    todayCheckins: 8,
    yesterdayCheckins: 6,
    pendingCheckouts: 5,
    overdueCheckouts: 2,
    activeBookings: 24,
    lastWeekBookings: 21
  })
  
  const [revenueStats, setRevenueStats] = useState({ 
    currentMonth: 312000, 
    lastMonth: 289000, 
    percentageChange: 8.0 
  })
  
  const [recentActivity, setRecentActivity] = useState([
    { id: 1, action: 'Maria Santos checked in guest', user: 'Maria Santos', role: 'Staff', module: 'Reservations', date: '2026-05-18', time: '09:30 AM' },
    { id: 2, action: 'John Reyes approved discount request', user: 'John Reyes', role: 'Manager', module: 'Finance', date: '2026-05-18', time: '10:15 AM' },
    { id: 3, action: 'Admin created new staff account', user: 'Admin', role: 'Admin', module: 'Users', date: '2026-05-17', time: '02:30 PM' },
    { id: 4, action: 'Room rate updated for Cottage B', user: 'Admin', role: 'Admin', module: 'Rooms', date: '2026-05-17', time: '11:00 AM' },
  ])
  
  // Reservations Data
  const [reservations, setReservations] = useState([
    { id: 1, bookingRef: 'BK-001', guestName: 'Maria Santos', room: 'Cottage B', checkIn: '2026-05-18', checkOut: '2026-05-20', guests: 2, status: 'confirmed', amount: 9600, source: 'online', phone: '09123456789', email: 'maria@email.com' },
    { id: 2, bookingRef: 'BK-002', guestName: 'John Reyes', room: 'Dormitory 1', checkIn: '2026-05-18', checkOut: '2026-05-19', guests: 6, status: 'checked_in', amount: 13000, source: 'walk-in', phone: '09123456780', email: 'john@email.com' },
    { id: 3, bookingRef: 'BK-003', guestName: 'Ana Dela Cruz', room: 'Cottage A', checkIn: '2026-05-17', checkOut: '2026-05-19', guests: 4, status: 'checked_in', amount: 9600, source: 'online', phone: '09123456781', email: 'ana@email.com' },
    { id: 4, bookingRef: 'BK-004', guestName: 'Carlos Lim', room: 'Cottage C', checkIn: '2026-05-16', checkOut: '2026-05-18', guests: 4, status: 'checked_out', amount: 9600, source: 'phone', phone: '09123456782', email: 'carlos@email.com' },
    { id: 5, bookingRef: 'BK-005', guestName: 'Rosa Garcia', room: 'Cottage D', checkIn: '2026-05-19', checkOut: '2026-05-21', guests: 5, status: 'confirmed', amount: 11000, source: 'online', phone: '09123456783', email: 'rosa@email.com' },
  ])

  // Guests Data
  const [guests, setGuests] = useState([
    { id: 1, firstName: 'Maria', lastName: 'Santos', email: 'maria@email.com', phone: '09123456789', address: '123 Main St', city: 'Davao City', checkIn: '2026-05-18', checkOut: '2026-05-20', room: 'Cottage B', status: 'active' },
    { id: 2, firstName: 'John', lastName: 'Reyes', email: 'john@email.com', phone: '09123456780', address: '456 Oak Ave', city: 'Davao City', checkIn: '2026-05-18', checkOut: '2026-05-19', room: 'Dormitory 1', status: 'active' },
    { id: 3, firstName: 'Ana', lastName: 'Dela Cruz', email: 'ana@email.com', phone: '09123456781', address: '789 Pine St', city: 'Davao City', checkIn: '2026-05-17', checkOut: '2026-05-19', room: 'Cottage A', status: 'active' },
    { id: 4, firstName: 'Carlos', lastName: 'Lim', email: 'carlos@email.com', phone: '09123456782', address: '321 Elm Rd', city: 'Davao City', checkIn: '2026-05-16', checkOut: '2026-05-18', room: 'Cottage C', status: 'checked_out' },
  ])

  // Bills Data
  const [bills, setBills] = useState([
    { id: 1, billNumber: 'INV-001', guestName: 'Maria Santos', room: 'Cottage B', amount: 9600, paid: 9600, balance: 0, status: 'paid', date: '2026-05-18', dueDate: '2026-05-20', items: ['Room Charge: ₱9600'] },
    { id: 2, billNumber: 'INV-002', guestName: 'John Reyes', room: 'Dormitory 1', amount: 13000, paid: 6500, balance: 6500, status: 'partial', date: '2026-05-18', dueDate: '2026-05-19', items: ['Room Charge: ₱13000'] },
    { id: 3, billNumber: 'INV-003', guestName: 'Ana Dela Cruz', room: 'Cottage A', amount: 9600, paid: 0, balance: 9600, status: 'pending', date: '2026-05-17', dueDate: '2026-05-19', items: ['Room Charge: ₱9600'] },
  ])

  const [userAccounts, setUserAccounts] = useState([
    { id: 1, first_name: 'Maria', last_name: 'Santos', email: 'maria.santos@costamarina.com', role: 'staff', status: 'active', department: 'Front Desk', last_login: '2026-05-18 08:30 AM' },
    { id: 2, first_name: 'John', last_name: 'Reyes', email: 'john.reyes@costamarina.com', role: 'manager', status: 'active', department: 'Management', last_login: '2026-05-18 09:00 AM' },
    { id: 3, first_name: 'Admin', last_name: 'User', email: 'admin@costamarina.com', role: 'admin', status: 'active', department: 'Administration', last_login: '2026-05-18 10:15 AM' },
    { id: 4, first_name: 'Mike', last_name: 'Fernandez', email: 'mike.fernandez@costamarina.com', role: 'staff', status: 'inactive', department: 'Front Desk', last_login: '2026-04-15 02:30 PM' },
  ])
  
  const [rooms, setRooms] = useState([
    { id: 1, name: 'Cottage A', type: 'cottage', status: 'occupied', price: 4800, capacity: 4, amenities: ['AC', 'TV', 'Hot Water'] },
    { id: 2, name: 'Cottage B', type: 'cottage', status: 'available', price: 4800, capacity: 4, amenities: ['AC', 'TV', 'Hot Water'] },
    { id: 3, name: 'Cottage C', type: 'cottage', status: 'available', price: 4800, capacity: 4, amenities: ['AC', 'TV', 'Hot Water'] },
    { id: 4, name: 'Cottage D', type: 'cottage', status: 'maintenance', price: 5500, capacity: 5, amenities: ['AC', 'TV', 'Hot Water', 'Balcony'] },
    { id: 5, name: 'Dormitory 1', type: 'dormitory', status: 'occupied', price: 13000, capacity: 10, amenities: ['Bunk Beds', 'Common CR', 'Fan'] },
    { id: 6, name: 'Dormitory 2', type: 'dormitory', status: 'available', price: 13000, capacity: 10, amenities: ['Bunk Beds', 'Common CR', 'Fan'] },
    { id: 7, name: 'Villa Rosario', type: 'villa', status: 'available', price: 20000, capacity: 10, amenities: ['Private Pool', 'Kitchen', 'AC', 'TV'] },
  ])
  
  const [roomCategories, setRoomCategories] = useState([
    { id: 1, name: 'Cottage', basePrice: 4800, capacity: 4, amenities: ['AC', 'TV', 'Hot Water'] },
    { id: 2, name: 'Dormitory', basePrice: 13000, capacity: 10, amenities: ['Bunk Beds', 'Common CR', 'Fan'] },
    { id: 3, name: 'Villa', basePrice: 20000, capacity: 10, amenities: ['Private Pool', 'Kitchen', 'AC', 'TV'] },
  ])
  
  const [addOns, setAddOns] = useState([
    { id: 1, name: 'Jet Ski Rental', category: 'Water Sports', price: 1500, status: 'active', duration: '30 min' },
    { id: 2, name: 'Banana Boat Ride', category: 'Water Sports', price: 500, status: 'active', duration: '15 min' },
    { id: 3, name: 'Extra Breakfast', category: 'Food', price: 250, status: 'active' },
    { id: 4, name: 'Extra Towel', category: 'Amenities', price: 50, status: 'active' },
    { id: 5, name: 'Karaoke Rental', category: 'Entertainment', price: 300, status: 'inactive' },
  ])
  
  const [archivedRecords, setArchivedRecords] = useState([
    { id: 1, name: 'John Doe', entityType: 'guest', archivedDate: '2026-04-01', archivedBy: 'Admin User', reason: 'Inactive account' },
    { id: 2, name: 'Cottage F', entityType: 'room', archivedDate: '2026-03-15', archivedBy: 'Admin User', reason: 'Under renovation' },
    { id: 3, name: 'BK-2026-015', entityType: 'reservation', archivedDate: '2026-03-20', archivedBy: 'System', reason: 'Cancelled booking' },
  ])
  
  const [activityLog, setActivityLog] = useState([
    { id: 1, username: 'Maria Santos', action: 'Checked in guest', module: 'Reservations', timestamp: '2026-05-18 09:30 AM', details: 'Guest: John Doe' },
    { id: 2, username: 'John Reyes', action: 'Approved discount', module: 'Finance', timestamp: '2026-05-18 10:15 AM', details: 'Senior Citizen - 20%' },
    { id: 3, username: 'Admin', action: 'Created user account', module: 'Users', timestamp: '2026-05-17 02:30 PM', details: 'New staff: M. Arcilla' },
    { id: 4, username: 'Admin', action: 'Updated room price', module: 'Rooms', timestamp: '2026-05-17 11:00 AM', details: 'Cottage B: ₱4800' },
  ])
  
  const [rolePermissions, setRolePermissions] = useState([
    { id: 1, role: 'staff', permissions: { reservations: 'edit', guests: 'edit', billing: 'view', reports: 'none', users: 'none' } },
    { id: 2, role: 'manager', permissions: { reservations: 'full', guests: 'full', billing: 'edit', reports: 'view', users: 'none' } },
    { id: 3, role: 'admin', permissions: { reservations: 'full', guests: 'full', billing: 'full', reports: 'full', users: 'full' } },
  ])

  const [userData, setUserData] = useState({})

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

  // Prevent default scroll behavior for all navigation
  const handleLogoClick = (e) => {
    e.preventDefault()
    handleTabChange('dashboard')
  }

  // Reservation CRUD
  const handleCreateReservation = () => {
    const newReservation = {
      id: reservations.length + 1,
      bookingRef: `BK-${String(reservations.length + 1).padStart(3, '0')}`,
      ...modalData,
      status: 'confirmed'
    }
    setReservations([...reservations, newReservation])
    addActivityLog('Created reservation', 'Reservations', `Booking: ${newReservation.bookingRef}`)
    setShowReservationModal(false)
    setModalData({})
    alert('Reservation created successfully!')
  }

  const handleUpdateReservation = () => {
    setReservations(reservations.map(r => r.id === editingItem.id ? { ...r, ...modalData } : r))
    addActivityLog('Updated reservation', 'Reservations', `Booking: ${editingItem.bookingRef}`)
    setShowReservationModal(false)
    setEditingItem(null)
    setModalData({})
    alert('Reservation updated successfully!')
  }

  const handleCancelReservation = (reservationId) => {
    if (window.confirm('Cancel this reservation?')) {
      setReservations(reservations.map(r => r.id === reservationId ? { ...r, status: 'cancelled' } : r))
      addActivityLog('Cancelled reservation', 'Reservations', `Reservation ID: ${reservationId}`)
      alert('Reservation cancelled!')
    }
  }

  // Guest CRUD
  const handleCreateGuest = () => {
    const newGuest = {
      id: guests.length + 1,
      ...modalData,
      status: 'active'
    }
    setGuests([...guests, newGuest])
    addActivityLog('Created guest', 'Guests', `Guest: ${modalData.firstName} ${modalData.lastName}`)
    setShowGuestModal(false)
    setModalData({})
    alert('Guest created successfully!')
  }

  const handleUpdateGuest = () => {
    setGuests(guests.map(g => g.id === editingItem.id ? { ...g, ...modalData } : g))
    addActivityLog('Updated guest', 'Guests', `Guest: ${modalData.firstName} ${modalData.lastName}`)
    setShowGuestModal(false)
    setEditingItem(null)
    setModalData({})
    alert('Guest updated successfully!')
  }

  // Bill CRUD
  const handleCreateBill = () => {
    const newBill = {
      id: bills.length + 1,
      billNumber: `INV-${String(bills.length + 1).padStart(3, '0')}`,
      ...modalData,
      status: 'pending',
      paid: 0,
      balance: modalData.amount
    }
    setBills([...bills, newBill])
    addActivityLog('Created bill', 'Billing', `Bill: ${newBill.billNumber}`)
    setShowBillModal(false)
    setModalData({})
    alert('Bill created successfully!')
  }

  const handleUpdateBill = () => {
    setBills(bills.map(b => b.id === editingItem.id ? { ...b, ...modalData } : b))
    addActivityLog('Updated bill', 'Billing', `Bill: ${editingItem.billNumber}`)
    setShowBillModal(false)
    setEditingItem(null)
    setModalData({})
    alert('Bill updated successfully!')
  }

  const handleRecordPayment = (billId, amount) => {
    const bill = bills.find(b => b.id === billId)
    const newPaid = bill.paid + amount
    const newStatus = newPaid >= bill.amount ? 'paid' : 'partial'
    setBills(bills.map(b => b.id === billId ? { ...b, paid: newPaid, balance: bill.amount - newPaid, status: newStatus } : b))
    addActivityLog('Recorded payment', 'Billing', `Bill: ${bill.billNumber}, Amount: ₱${amount}`)
    alert(`Payment of ₱${amount} recorded!`)
  }

  const handlePrintBill = (bill) => {
    alert(`Printing bill ${bill.billNumber}...`)
  }

  // User CRUD
  const handleCreateUser = () => {
    const newUser = { 
      id: userAccounts.length + 1, 
      ...modalData, 
      status: 'active',
      last_login: 'Never'
    }
    setUserAccounts([...userAccounts, newUser])
    addActivityLog('Created user account', 'Users', `User: ${modalData.first_name} ${modalData.last_name}`)
    setShowUserModal(false)
    setModalData({})
    alert('User created successfully!')
  }

  const handleUpdateUser = () => {
    setUserAccounts(userAccounts.map(u => u.id === editingItem.id ? { ...u, ...modalData } : u))
    addActivityLog('Updated user account', 'Users', `User: ${modalData.first_name} ${modalData.last_name}`)
    setShowUserModal(false)
    setEditingItem(null)
    setModalData({})
    alert('User updated successfully!')
  }

  const handleDeactivateUser = (userId, currentStatus) => {
    const newStatus = currentStatus === 'active' ? 'inactive' : 'active'
    setUserAccounts(userAccounts.map(u => u.id === userId ? { ...u, status: newStatus } : u))
    addActivityLog(`${newStatus === 'active' ? 'Activated' : 'Deactivated'} user account`, 'Users', `User ID: ${userId}`)
  }

  // Room CRUD
  const handleCreateRoom = () => {
    const newRoom = { id: rooms.length + 1, ...modalData, status: 'available' }
    setRooms([...rooms, newRoom])
    addActivityLog('Created room', 'Rooms', `Room: ${modalData.name}`)
    setShowRoomModal(false)
    setModalData({})
    alert('Room created successfully!')
  }

  const handleUpdateRoom = () => {
    setRooms(rooms.map(r => r.id === editingItem.id ? { ...r, ...modalData } : r))
    addActivityLog('Updated room', 'Rooms', `Room: ${modalData.name}`)
    setShowRoomModal(false)
    setEditingItem(null)
    setModalData({})
    alert('Room updated successfully!')
  }

  const handleArchiveRoom = (roomId) => {
    if (window.confirm('Archive this room?')) {
      const room = rooms.find(r => r.id === roomId)
      setArchivedRecords([...archivedRecords, {
        id: archivedRecords.length + 1,
        name: room.name,
        entityType: 'room',
        archivedDate: new Date().toISOString().split('T')[0],
        archivedBy: `${userData.first_name || 'Admin'} ${userData.last_name || ''}`,
        reason: 'Archived by admin'
      }])
      setRooms(rooms.filter(r => r.id !== roomId))
      addActivityLog('Archived room', 'Rooms', `Room: ${room.name}`)
      alert('Room archived!')
    }
  }

  // Add-on CRUD
  const handleCreateAddOn = () => {
    const newAddOn = { id: addOns.length + 1, ...modalData, status: 'active' }
    setAddOns([...addOns, newAddOn])
    addActivityLog('Created add-on', 'AddOns', `Item: ${modalData.name}`)
    setShowAddOnModal(false)
    setModalData({})
    alert('Add-on created successfully!')
  }

  const handleUpdateAddOn = () => {
    setAddOns(addOns.map(a => a.id === editingItem.id ? { ...a, ...modalData } : a))
    addActivityLog('Updated add-on', 'AddOns', `Item: ${modalData.name}`)
    setShowAddOnModal(false)
    setEditingItem(null)
    setModalData({})
    alert('Add-on updated successfully!')
  }

  const handleToggleAddOnStatus = (addonId) => {
    setAddOns(addOns.map(a => a.id === addonId ? { ...a, status: a.status === 'active' ? 'inactive' : 'active' } : a))
    addActivityLog('Toggled add-on status', 'AddOns', `Item ID: ${addonId}`)
  }

  const handleRestoreRecord = () => {
    if (selectedArchive) {
      setArchivedRecords(archivedRecords.filter(r => r.id !== selectedArchive.id))
      addActivityLog('Restored record', 'Archives', `Record: ${selectedArchive.name}`)
      setShowRestoreModal(false)
      setSelectedArchive(null)
      alert('Record restored successfully!')
    }
  }

  // Role Permission CRUD
  const handleCreateRole = () => {
    const newRole = { id: rolePermissions.length + 1, ...modalData, permissions: modalData.permissions || {} }
    setRolePermissions([...rolePermissions, newRole])
    addActivityLog('Created new role', 'Roles', `Role: ${modalData.role}`)
    setShowRoleModal(false)
    setModalData({})
    alert('Role created successfully!')
  }

  const handleUpdatePermission = (roleId, module, permission) => {
    setRolePermissions(rolePermissions.map(r => 
      r.id === roleId ? { ...r, permissions: { ...r.permissions, [module]: permission } } : r
    ))
    addActivityLog('Updated role permissions', 'Roles', `Role ID: ${roleId}`)
  }

  // Report generation
  const handleGenerateReport = (reportType) => {
    if (!dateRange.start || !dateRange.end) {
      alert('Please select date range first')
      return
    }
    addActivityLog(`Generated ${reportType} report`, 'Reports', `Date range: ${dateRange.start} to ${dateRange.end}`)
    alert(`Generating ${reportType} report in ${reportFormat.toUpperCase()} format for ${dateRange.start} to ${dateRange.end}`)
  }

  // Activity logging helper
  const addActivityLog = (action, module, details) => {
    const newLog = {
      id: activityLog.length + 1,
      username: `${userData.first_name || 'Admin'} ${userData.last_name || ''}`,
      action,
      module,
      timestamp: new Date().toLocaleString(),
      details
    }
    setActivityLog([newLog, ...activityLog])
    setRecentActivity([{
      id: Date.now(),
      action,
      user: newLog.username,
      role: userData.role || 'Admin',
      module,
      date: new Date().toISOString().split('T')[0],
      time: new Date().toLocaleTimeString()
    }, ...recentActivity.slice(0, 9)])
  }

  // Filter functions for Operations tabs
  const getFilteredReservations = () => {
    let filtered = reservations
    if (searchTerm) {
      filtered = filtered.filter(r => 
        r.guestName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.bookingRef.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }
    if (filterReservationStatus !== 'all') {
      filtered = filtered.filter(r => r.status === filterReservationStatus)
    }
    const startIndex = (currentPage - 1) * entriesPerPage
    return filtered.slice(startIndex, startIndex + entriesPerPage)
  }

  const getFilteredGuests = () => {
    let filtered = guests
    if (searchTerm) {
      filtered = filtered.filter(g => 
        `${g.firstName} ${g.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
        g.email.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }
    const startIndex = (currentPage - 1) * entriesPerPage
    return filtered.slice(startIndex, startIndex + entriesPerPage)
  }

  const getFilteredBills = () => {
    let filtered = bills
    if (searchTerm) {
      filtered = filtered.filter(b => 
        b.guestName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        b.billNumber.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }
    if (filterPaymentStatus !== 'all') {
      filtered = filtered.filter(b => b.status === filterPaymentStatus)
    }
    const startIndex = (currentPage - 1) * entriesPerPage
    return filtered.slice(startIndex, startIndex + entriesPerPage)
  }

  const getFilteredUsers = () => {
    let filtered = userAccounts
    if (searchTerm) {
      filtered = filtered.filter(u => 
        `${u.first_name} ${u.last_name}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.email.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }
    if (filterRole !== 'all') filtered = filtered.filter(u => u.role === filterRole)
    if (filterStatus !== 'all') filtered = filtered.filter(u => u.status === filterStatus)
    const startIndex = (currentPage - 1) * entriesPerPage
    return filtered.slice(startIndex, startIndex + entriesPerPage)
  }

  const getFilteredRooms = () => {
    let filtered = rooms
    if (searchTerm) filtered = filtered.filter(r => r.name.toLowerCase().includes(searchTerm.toLowerCase()))
    if (filterStatus !== 'all') filtered = filtered.filter(r => r.status === filterStatus)
    return filtered
  }

  const getFilteredAddOns = () => {
    let filtered = addOns
    if (searchTerm) filtered = filtered.filter(a => 
      a.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.category.toLowerCase().includes(searchTerm.toLowerCase())
    )
    if (filterStatus !== 'all') filtered = filtered.filter(a => a.status === filterStatus)
    return filtered
  }

  const getFilteredArchived = () => {
    let filtered = archivedRecords
    if (searchTerm) filtered = filtered.filter(a => a.name.toLowerCase().includes(searchTerm.toLowerCase()))
    if (filterEntityType !== 'all') filtered = filtered.filter(a => a.entityType === filterEntityType)
    return filtered
  }

  const getFilteredActivityLog = () => {
    let filtered = activityLog
    if (searchTerm) filtered = filtered.filter(a => 
      a.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.action.toLowerCase().includes(searchTerm.toLowerCase())
    )
    if (filterModule !== 'all') filtered = filtered.filter(a => a.module === filterModule)
    if (dateRange.start) filtered = filtered.filter(a => a.timestamp >= dateRange.start)
    if (dateRange.end) filtered = filtered.filter(a => a.timestamp <= dateRange.end)
    const startIndex = (currentPage - 1) * entriesPerPage
    return filtered.slice(startIndex, startIndex + entriesPerPage)
  }

  const totalPages = (dataLength) => Math.ceil(dataLength / entriesPerPage)

  // Sidebar Component
  const Sidebar = () => (
    <div className="fixed left-0 top-0 h-full w-64 bg-gradient-to-b from-gray-900 to-gray-800 text-white shadow-xl z-30 overflow-y-auto">
      <div className="p-6 border-b border-gray-700">
        <button onClick={handleLogoClick} className="flex items-center gap-2 mb-2 w-full hover:opacity-80 transition-opacity text-left">
          <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-500 rounded-xl flex items-center justify-center">
            <span className="text-white text-xl font-bold">🌊</span>
          </div>
          <div>
            <h1 className="text-xl font-bold">CoastaDesk</h1>
            <p className="text-xs text-gray-400">Admin Portal</p>
          </div>
        </button>
        <p className="text-xs text-amber-400">Administrator</p>
      </div>

      <nav className="p-4 space-y-1">
        <div className="text-xs text-gray-500 uppercase tracking-wider px-3 py-2">Main</div>
        <button onClick={() => handleTabChange('dashboard')} className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-all ${activeTab === 'dashboard' ? 'bg-amber-600 text-white' : 'text-gray-300 hover:bg-gray-700'}`}>
          <LayoutDashboard size={18} /> Dashboard
        </button>

        <div className="text-xs text-gray-500 uppercase tracking-wider px-3 py-2 mt-4">Operations</div>
<button 
  onClick={() => handleTabChange('reservations')} 
  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-all ${activeTab === 'reservations' ? 'bg-amber-600 text-white' : 'text-gray-300 hover:bg-gray-700'}`}
>
  <Calendar size={18} /> Reservations
</button>
<button 
  onClick={() => handleTabChange('guests')} 
  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-all ${activeTab === 'guests' ? 'bg-amber-600 text-white' : 'text-gray-300 hover:bg-gray-700'}`}
>
  <Users size={18} /> Guests
</button>
<button 
  onClick={() => handleTabChange('billing')} 
  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-all ${activeTab === 'billing' ? 'bg-amber-600 text-white' : 'text-gray-300 hover:bg-gray-700'}`}
>
  <CreditCard size={18} /> Billing & Payments
</button>

        <div className="text-xs text-gray-500 uppercase tracking-wider px-3 py-2 mt-4">System Config</div>
        <button onClick={() => { handleTabChange('users'); setSearchTerm(''); setFilterRole('all'); setFilterStatus('all'); setCurrentPage(1); }} className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-all ${activeTab === 'users' ? 'bg-amber-600 text-white' : 'text-gray-300 hover:bg-gray-700'}`}>
          <Users size={18} /> User accounts
        </button>
        <button onClick={() => { handleTabChange('roomsConfig'); setSearchTerm(''); setFilterStatus('all'); }} className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-all ${activeTab === 'roomsConfig' ? 'bg-amber-600 text-white' : 'text-gray-300 hover:bg-gray-700'}`}>
          <Home size={18} /> Room management
        </button>
        <button onClick={() => { handleTabChange('addons'); setSearchTerm(''); setFilterStatus('all'); }} className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-all ${activeTab === 'addons' ? 'bg-amber-600 text-white' : 'text-gray-300 hover:bg-gray-700'}`}>
          <Tag size={18} /> Add-ons catalog
        </button>

        <div className="text-xs text-gray-500 uppercase tracking-wider px-3 py-2 mt-4">Data</div>
        <button onClick={() => { handleTabChange('archived'); setSearchTerm(''); setFilterEntityType('all'); }} className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-all ${activeTab === 'archived' ? 'bg-amber-600 text-white' : 'text-gray-300 hover:bg-gray-700'}`}>
          <Archive size={18} /> Archived records
        </button>
        <button onClick={() => { handleTabChange('reports'); }} className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-all ${activeTab === 'reports' ? 'bg-amber-600 text-white' : 'text-gray-300 hover:bg-gray-700'}`}>
          <FileText size={18} /> All reports
        </button>
        <button onClick={() => { handleTabChange('activity'); setSearchTerm(''); setFilterModule('all'); setDateRange({ start: '', end: '' }); setCurrentPage(1); }} className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-all ${activeTab === 'activity' ? 'bg-amber-600 text-white' : 'text-gray-300 hover:bg-gray-700'}`}>
          <Activity size={18} /> Activity log
        </button>
      </nav>
    </div>
  )

  // Dashboard Content (same as before - keep existing)
  const renderDashboard = () => (
    <>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-blue-500 cursor-pointer hover:shadow-md transition-all" onClick={() => handleTabChange('users')}>
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-500 text-sm">Active staff accounts</p>
              <p className="text-3xl font-bold text-gray-800">{dashboardStats.staff.total}</p>
              <p className="text-sm text-gray-500 mt-1">{dashboardStats.staff.frontDesk} front desk, {dashboardStats.staff.manager} manager</p>
            </div>
            <Users size={32} className="text-blue-500" />
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-green-500 cursor-pointer hover:shadow-md transition-all" onClick={() => handleTabChange('roomsConfig')}>
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-500 text-sm">Total rooms/cottages</p>
              <p className="text-3xl font-bold text-gray-800">{dashboardStats.rooms.total}</p>
              <p className="text-sm text-gray-500 mt-1">{dashboardStats.rooms.active} active, {dashboardStats.rooms.maintenance} maintenance</p>
            </div>
            <Home size={32} className="text-green-500" />
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-purple-500">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-500 text-sm">Registered guests</p>
              <p className="text-3xl font-bold text-gray-800">{dashboardStats.guests.total}</p>
              <p className="text-sm text-gray-500 mt-1">All time</p>
            </div>
            <Database size={32} className="text-purple-500" />
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-amber-500 cursor-pointer hover:shadow-md transition-all" onClick={() => handleTabChange('addons')}>
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-500 text-sm">Add-on items</p>
              <p className="text-3xl font-bold text-gray-800">{dashboardStats.addOns.total}</p>
              <p className="text-sm text-gray-500 mt-1">{dashboardStats.addOns.active} active, {dashboardStats.addOns.inactive} inactive</p>
            </div>
            <Tag size={32} className="text-amber-500" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <Shield size={20} className="text-amber-500" />
            Admin access areas
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div onClick={() => handleTabChange('users')} className="p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-all">
              <UserPlus size={20} className="text-blue-500 inline mr-2" />
              <span className="font-medium">User management</span>
              <p className="text-xs text-gray-500 mt-1">Create, edit, deactivate staff accounts</p>
            </div>
            <div onClick={() => handleTabChange('roomsConfig')} className="p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-all">
              <Home size={20} className="text-green-500 inline mr-2" />
              <span className="font-medium">Room management</span>
              <p className="text-xs text-gray-500 mt-1">Add/edit/archive rooms, set pricing</p>
            </div>
            <div onClick={() => handleTabChange('addons')} className="p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-all">
              <Tag size={20} className="text-purple-500 inline mr-2" />
              <span className="font-medium">Add-ons catalog</span>
              <p className="text-xs text-gray-500 mt-1">Manage billable add-ons</p>
            </div>
            <div onClick={() => handleTabChange('archived')} className="p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-all">
              <Archive size={20} className="text-yellow-500 inline mr-2" />
              <span className="font-medium">Archived records</span>
              <p className="text-xs text-gray-500 mt-1">View and restore deleted records</p>
            </div>
            <div onClick={() => handleTabChange('roles')} className="p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-all">
              <Key size={20} className="text-red-500 inline mr-2" />
              <span className="font-medium">Role permissions</span>
              <p className="text-xs text-gray-500 mt-1">Define per-module access</p>
            </div>
            <div onClick={() => handleTabChange('reports')} className="p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-all">
              <FileText size={20} className="text-indigo-500 inline mr-2" />
              <span className="font-medium">Full reports access</span>
              <p className="text-xs text-gray-500 mt-1">All reports + audit logs</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold text-gray-800 flex items-center gap-2">
              <Activity size={20} className="text-amber-500" />
              Recent system activity
            </h3>
            <button onClick={() => handleTabChange('activity')} className="text-sm text-amber-600 hover:underline">View all</button>
          </div>
          <div className="space-y-3 max-h-80 overflow-y-auto">
            {recentActivity.map((activity, idx) => (
              <div key={idx} className="p-3 bg-gray-50 rounded-lg border-l-4 border-amber-500 cursor-pointer hover:bg-gray-100" onClick={() => handleTabChange('activity')}>
                <p className="font-medium text-gray-800 text-sm">{activity.action}</p>
                <div className="flex justify-between items-center mt-2">
                  <span className="text-xs text-gray-500">{activity.user} · {activity.role}</span>
                  <span className="text-xs text-gray-400">{activity.date} {activity.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-6 text-white">
          <div className="flex justify-between">
            <div>
              <p className="text-white/80 text-sm">Today's Check-ins</p>
              <p className="text-3xl font-bold">{dashboardStats.todayCheckins}</p>
              <p className="text-xs text-white/70 mt-1">vs {dashboardStats.yesterdayCheckins} yesterday</p>
            </div>
            <CheckCircle size={32} />
          </div>
        </div>
        <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-xl p-6 text-white">
          <div className="flex justify-between">
            <div>
              <p className="text-white/80 text-sm">Pending Check-outs</p>
              <p className="text-3xl font-bold">{dashboardStats.pendingCheckouts}</p>
              <p className="text-xs text-red-300 mt-1">{dashboardStats.overdueCheckouts} overdue</p>
            </div>
            <Clock size={32} />
          </div>
        </div>
        <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl p-6 text-white">
          <div className="flex justify-between">
            <div>
              <p className="text-white/80 text-sm">Active Bookings</p>
              <p className="text-3xl font-bold">{dashboardStats.activeBookings}</p>
              <p className="text-xs text-white/70 mt-1">This week (+{dashboardStats.activeBookings - dashboardStats.lastWeekBookings})</p>
            </div>
            <Calendar size={32} />
          </div>
        </div>
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-6 text-white">
          <div className="flex justify-between">
            <div>
              <p className="text-white/80 text-sm">Monthly Revenue</p>
              <p className="text-2xl font-bold">₱{(revenueStats.currentMonth / 1000).toFixed(0)}K</p>
              <p className="text-xs text-white/70 mt-1">{revenueStats.percentageChange >= 0 ? '+' : ''}{revenueStats.percentageChange}% vs last month</p>
            </div>
            <TrendingUp size={32} />
          </div>
        </div>
      </div>
    </>
  )

  // Reservations Tab - Fully Functional
  const renderReservationsTab = () => {
    const filteredReservations = getFilteredReservations()
    const pages = totalPages(reservations.length)

    return (
      <div>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Reservations</h2>
          <button onClick={() => { setEditingItem(null); setModalData({}); setShowReservationModal(true); }} className="flex items-center gap-2 px-4 py-2 bg-amber-500 text-white rounded-lg">
            <Plus size={18} /> Add Reservation
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="p-4 border-b flex flex-wrap gap-3">
            <div className="flex-1 relative">
              <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input type="text" placeholder="Search by guest name or booking #..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-2 border rounded-lg" />
            </div>
            <select value={filterReservationStatus} onChange={(e) => setFilterReservationStatus(e.target.value)} className="px-4 py-2 border rounded-lg">
              <option value="all">All Status</option>
              <option value="confirmed">Confirmed</option>
              <option value="checked_in">Checked In</option>
              <option value="checked_out">Checked Out</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Booking #</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Guest Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Room</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Check In</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Check Out</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredReservations.map(res => (
                  <tr key={res.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-mono text-gray-600">{res.bookingRef}</td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{res.guestName}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">{res.room}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">{res.checkIn}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">{res.checkOut}</td>
                    <td className="px-6 py-4 text-sm font-semibold text-gray-800">₱{res.amount.toLocaleString()}</td>
                    <td className="px-6 py-4">
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        res.status === 'confirmed' ? 'bg-blue-100 text-blue-700' :
                        res.status === 'checked_in' ? 'bg-green-100 text-green-700' :
                        res.status === 'checked_out' ? 'bg-gray-100 text-gray-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {res.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <button onClick={() => { setEditingItem(res); setModalData(res); setShowReservationModal(true); }} className="text-blue-600 hover:text-blue-800">
                          <Edit size={16} />
                        </button>
                        {res.status !== 'cancelled' && (
                          <button onClick={() => handleCancelReservation(res.id)} className="text-red-600 hover:text-red-800">
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
          
          <div className="px-6 py-4 border-t flex justify-between items-center">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Show</span>
              <select value={entriesPerPage} onChange={(e) => setEntriesPerPage(Number(e.target.value))} className="px-2 py-1 border rounded">
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={25}>25</option>
              </select>
              <span className="text-sm text-gray-600">entries</span>
            </div>
            <div className="flex gap-2">
              <button onClick={() => setCurrentPage(p => Math.max(1, p-1))} disabled={currentPage === 1} className="px-3 py-1 border rounded disabled:opacity-50">Previous</button>
              <span className="px-3 py-1">Page {currentPage} of {pages}</span>
              <button onClick={() => setCurrentPage(p => Math.min(pages, p+1))} disabled={currentPage === pages} className="px-3 py-1 border rounded disabled:opacity-50">Next</button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Guests Tab - Fully Functional
  const renderGuestsTab = () => {
    const filteredGuests = getFilteredGuests()
    const pages = totalPages(guests.length)

    return (
      <div>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Guests</h2>
          <button onClick={() => { setEditingItem(null); setModalData({}); setShowGuestModal(true); }} className="flex items-center gap-2 px-4 py-2 bg-amber-500 text-white rounded-lg">
            <Plus size={18} /> Add Guest
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="p-4 border-b">
            <div className="flex-1 relative">
              <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input type="text" placeholder="Search by name or email..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-2 border rounded-lg" />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Phone</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Room</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Check In</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Check Out</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredGuests.map(guest => (
                  <tr key={guest.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{guest.firstName} {guest.lastName}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">{guest.email}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">{guest.phone}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">{guest.room}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">{guest.checkIn}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">{guest.checkOut}</td>
                    <td className="px-6 py-4">
                      <span className={`text-xs px-2 py-1 rounded-full ${guest.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                        {guest.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <button onClick={() => { setEditingItem(guest); setModalData(guest); setShowGuestModal(true); }} className="text-blue-600 hover:text-blue-800">
                        <Edit size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <div className="px-6 py-4 border-t flex justify-between items-center">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Show</span>
              <select value={entriesPerPage} onChange={(e) => setEntriesPerPage(Number(e.target.value))} className="px-2 py-1 border rounded">
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={25}>25</option>
              </select>
              <span className="text-sm text-gray-600">entries</span>
            </div>
            <div className="flex gap-2">
              <button onClick={() => setCurrentPage(p => Math.max(1, p-1))} disabled={currentPage === 1} className="px-3 py-1 border rounded disabled:opacity-50">Previous</button>
              <span className="px-3 py-1">Page {currentPage} of {pages}</span>
              <button onClick={() => setCurrentPage(p => Math.min(pages, p+1))} disabled={currentPage === pages} className="px-3 py-1 border rounded disabled:opacity-50">Next</button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Billing & Payments Tab - Fully Functional
  const renderBillingTab = () => {
    const filteredBills = getFilteredBills()
    const pages = totalPages(bills.length)

    return (
      <div>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Billing & Payments</h2>
          <button onClick={() => { setEditingItem(null); setModalData({}); setShowBillModal(true); }} className="flex items-center gap-2 px-4 py-2 bg-amber-500 text-white rounded-lg">
            <Plus size={18} /> Create Bill
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="p-4 border-b flex flex-wrap gap-3">
            <div className="flex-1 relative">
              <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input type="text" placeholder="Search by guest name or bill #..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-2 border rounded-lg" />
            </div>
            <select value={filterPaymentStatus} onChange={(e) => setFilterPaymentStatus(e.target.value)} className="px-4 py-2 border rounded-lg">
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="partial">Partial</option>
              <option value="paid">Paid</option>
            </select>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Bill #</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Guest Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Room</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total Amount</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Paid</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Balance</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredBills.map(bill => (
                  <tr key={bill.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-mono text-gray-600">{bill.billNumber}</td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{bill.guestName}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">{bill.room}</td>
                    <td className="px-6 py-4 text-sm font-semibold text-gray-800">₱{bill.amount.toLocaleString()}</td>
                    <td className="px-6 py-4 text-sm text-green-600">₱{bill.paid.toLocaleString()}</td>
                    <td className="px-6 py-4 text-sm text-red-600">₱{bill.balance.toLocaleString()}</td>
                    <td className="px-6 py-4">
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        bill.status === 'paid' ? 'bg-green-100 text-green-700' :
                        bill.status === 'partial' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {bill.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <button onClick={() => { setEditingItem(bill); setModalData(bill); setShowBillModal(true); }} className="text-blue-600 hover:text-blue-800">
                          <Edit size={16} />
                        </button>
                        <button onClick={() => handlePrintBill(bill)} className="text-gray-600 hover:text-gray-800">
                          <Printer size={16} />
                        </button>
                        {bill.status !== 'paid' && (
                          <button onClick={() => {
                            const amount = prompt('Enter payment amount:', bill.balance)
                            if (amount && !isNaN(amount)) {
                              handleRecordPayment(bill.id, parseFloat(amount))
                            }
                          }} className="text-green-600 hover:text-green-800">
                            <DollarSign size={16} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <div className="px-6 py-4 border-t flex justify-between items-center">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Show</span>
              <select value={entriesPerPage} onChange={(e) => setEntriesPerPage(Number(e.target.value))} className="px-2 py-1 border rounded">
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={25}>25</option>
              </select>
              <span className="text-sm text-gray-600">entries</span>
            </div>
            <div className="flex gap-2">
              <button onClick={() => setCurrentPage(p => Math.max(1, p-1))} disabled={currentPage === 1} className="px-3 py-1 border rounded disabled:opacity-50">Previous</button>
              <span className="px-3 py-1">Page {currentPage} of {pages}</span>
              <button onClick={() => setCurrentPage(p => Math.min(pages, p+1))} disabled={currentPage === pages} className="px-3 py-1 border rounded disabled:opacity-50">Next</button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Keep the rest of the render functions (users, rooms, addons, archived, roles, reports, activity) from previous version...
  // I'll include them below to save space but they remain the same

  const renderUsersTab = () => {
    const users = getFilteredUsers()
    const pages = totalPages(userAccounts.length)

    return (
      <div>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">User Accounts</h2>
          <button onClick={() => { setEditingItem(null); setModalData({}); setShowUserModal(true); }} className="flex items-center gap-2 px-4 py-2 bg-amber-500 text-white rounded-lg">
            <UserPlus size={18} /> Add User
          </button>
        </div>
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="p-4 border-b flex flex-wrap gap-3">
            <div className="flex-1 relative"><Search size={18} className="absolute left-3" /><input type="text" placeholder="Search..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-2 border rounded-lg" /></div>
            <select value={filterRole} onChange={(e) => setFilterRole(e.target.value)} className="px-4 py-2 border rounded-lg"><option value="all">All Roles</option><option value="staff">Staff</option><option value="manager">Manager</option><option value="admin">Admin</option></select>
            <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="px-4 py-2 border rounded-lg"><option value="all">All Status</option><option value="active">Active</option><option value="inactive">Inactive</option></select>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full"><thead className="bg-gray-50"><tr><th className="px-6 py-3">Name</th><th>Email</th><th>Role</th><th>Department</th><th>Last Login</th><th>Status</th><th>Actions</th></tr></thead>
              <tbody>{users.map(user => (<tr key={user.id}><td className="px-6 py-4">{user.first_name} {user.last_name}</td><td>{user.email}</td><td>{user.role}</td><td>{user.department}</td><td>{user.last_login}</td><td><span className={`px-2 py-1 rounded-full text-xs ${user.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{user.status}</span></td><td><button onClick={() => handleDeactivateUser(user.id, user.status)}>{user.status === 'active' ? <XCircle size={16} className="text-red-600" /> : <CheckCircle size={16} className="text-green-600" />}</button></td></tr>))}</tbody></table>
          </div>
          <div className="px-6 py-4 border-t flex justify-between"><div><span>Show</span><select value={entriesPerPage} onChange={(e) => setEntriesPerPage(Number(e.target.value))} className="mx-2 px-2 py-1 border rounded"><option value={5}>5</option><option value={10}>10</option><option value={25}>25</option></select><span>entries</span></div><div className="flex gap-2"><button disabled={currentPage===1} onClick={() => setCurrentPage(p=>p-1)} className="px-3 py-1 border rounded">Previous</button><span>Page {currentPage} of {pages}</span><button disabled={currentPage===pages} onClick={() => setCurrentPage(p=>p+1)} className="px-3 py-1 border rounded">Next</button></div></div>
        </div>
      </div>
    )
  }

  const renderRoomsManagement = () => {
    const filteredRooms = getFilteredRooms()
    return (
      <div>
        <div className="flex justify-between items-center mb-6"><h2 className="text-2xl font-bold">Room Management</h2><button onClick={() => setShowRoomModal(true)} className="bg-amber-500 text-white px-4 py-2 rounded-lg flex items-center gap-2"><Plus size={18} /> Add Room</button></div>
        <div className="bg-white rounded-xl shadow-sm"><div className="p-4 border-b flex gap-3"><div className="flex-1 relative"><Search size={18} className="absolute left-3" /><input type="text" placeholder="Search rooms..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-2 border rounded-lg" /></div><select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="px-4 py-2 border rounded-lg"><option value="all">All Status</option><option value="available">Available</option><option value="occupied">Occupied</option><option value="maintenance">Maintenance</option></select></div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-6">{filteredRooms.map(room => (<div key={room.id} className="border rounded-lg p-4"><div className="flex justify-between"><h3 className="font-bold">{room.name}</h3><span className={`px-2 py-1 rounded-full text-xs ${room.status === 'available' ? 'bg-green-100' : room.status === 'occupied' ? 'bg-blue-100' : 'bg-red-100'}`}>{room.status}</span></div><p className="text-sm text-gray-500">Type: {room.type} | Capacity: {room.capacity}</p><p className="text-lg font-bold text-amber-600">₱{room.price.toLocaleString()}/night</p><button onClick={() => handleArchiveRoom(room.id)} className="text-red-600 text-sm mt-2">Archive</button></div>))}</div></div>
      </div>
    )
  }

  const renderAddOnsCatalog = () => {
    const filteredAddOns = getFilteredAddOns()
    return (
      <div>
        <div className="flex justify-between items-center mb-6"><h2 className="text-2xl font-bold">Add-ons Catalog</h2><button onClick={() => setShowAddOnModal(true)} className="bg-amber-500 text-white px-4 py-2 rounded-lg"><Plus size={18} /> Add Add-on</button></div>
        <div className="bg-white rounded-xl shadow-sm"><div className="p-4 border-b flex gap-3"><div className="flex-1 relative"><Search size={18} className="absolute left-3" /><input type="text" placeholder="Search..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-2 border rounded-lg" /></div><select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="px-4 py-2 border rounded-lg"><option value="all">All Status</option><option value="active">Active</option><option value="inactive">Inactive</option></select></div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-6">{filteredAddOns.map(addon => (<div key={addon.id} className="border rounded-lg p-4"><div className="flex justify-between"><h3 className="font-bold">{addon.name}</h3><span className={`px-2 py-1 rounded-full text-xs ${addon.status === 'active' ? 'bg-green-100' : 'bg-red-100'}`}>{addon.status}</span></div><p className="text-sm text-gray-500">Category: {addon.category}</p><p className="text-lg font-bold text-amber-600">₱{addon.price.toLocaleString()}</p><div className="flex gap-2 mt-2"><button onClick={() => handleToggleAddOnStatus(addon.id)} className="text-blue-600 text-sm">Toggle</button></div></div>))}</div></div>
      </div>
    )
  }

  const renderArchivedRecords = () => {
  const archived = getFilteredArchived()
  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Archived Records</h2>
      <div className="bg-white rounded-xl shadow-sm">
        <div className="p-4 border-b flex gap-3">
          <div className="flex-1 relative">
            <Search size={18} className="absolute left-3" />
            <input type="text" placeholder="Search..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-2 border rounded-lg" />
          </div>
          <select value={filterEntityType} onChange={(e) => setFilterEntityType(e.target.value)} className="px-4 py-2 border rounded-lg">
            <option value="all">All Types</option>
            <option value="guest">Guest</option>
            <option value="room">Room</option>
            <option value="reservation">Reservation</option>
          </select>
        </div>
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3">Record Name</th>
              <th>Entity Type</th>
              <th>Archived Date</th>
              <th>Archived By</th>
              <th>Reason</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {archived.map(record => (
              <tr key={record.id}>
                <td className="px-6 py-4">{record.name}</td>
                <td><span className="px-2 py-1 rounded-full text-xs bg-gray-100">{record.entityType}</span></td>
                <td>{record.archivedDate}</td>
                <td>{record.archivedBy}</td>
                <td>{record.reason}</td>
                <td>
                  <button onClick={() => { setSelectedArchive(record); setShowRestoreModal(true); }} className="text-green-600">
                    <RefreshCw size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

  const renderRolePermissions = () => (
    <div><h2 className="text-2xl font-bold mb-6">Role Permissions</h2><div className="bg-white rounded-xl shadow-sm overflow-x-auto"><table className="w-full"><thead className="bg-gray-50"><tr><th className="px-6 py-3">Role</th><th>Reservations</th><th>Guests</th><th>Billing</th><th>Reports</th><th>Users</th></tr></thead><tbody>{rolePermissions.map(role => (<tr key={role.id}><td className="px-6 py-4 font-medium capitalize">{role.role}</td><td className="px-6 py-4"><select value={role.permissions.reservations} onChange={(e) => handleUpdatePermission(role.id, 'reservations', e.target.value)} className="px-2 py-1 border rounded text-sm"><option value="none">None</option><option value="view">View</option><option value="edit">Edit</option><option value="full">Full</option></select></td><td><select value={role.permissions.guests} onChange={(e) => handleUpdatePermission(role.id, 'guests', e.target.value)} className="px-2 py-1 border rounded text-sm"><option value="none">None</option><option value="view">View</option><option value="edit">Edit</option><option value="full">Full</option></select></td><td><select value={role.permissions.billing} onChange={(e) => handleUpdatePermission(role.id, 'billing', e.target.value)} className="px-2 py-1 border rounded text-sm"><option value="none">None</option><option value="view">View</option><option value="edit">Edit</option><option value="full">Full</option></select></td><td><select value={role.permissions.reports} onChange={(e) => handleUpdatePermission(role.id, 'reports', e.target.value)} className="px-2 py-1 border rounded text-sm"><option value="none">None</option><option value="view">View</option><option value="full">Full</option></select></td><td><select value={role.permissions.users} onChange={(e) => handleUpdatePermission(role.id, 'users', e.target.value)} className="px-2 py-1 border rounded text-sm"><option value="none">None</option><option value="view">View</option><option value="full">Full</option></select></td></tr>))}</tbody></table></div></div>
  )

  const renderReports = () => (
    <div><h2 className="text-2xl font-bold mb-6">Reports & Analytics</h2><div className="grid md:grid-cols-2 gap-6"><div className="bg-white rounded-xl p-6"><h3 className="font-semibold mb-4">Available Reports</h3>{['Guest Report', 'Revenue Report', 'Occupancy Report', 'Audit Log Report', 'Compliance Report'].map(r => (<button key={r} onClick={() => handleGenerateReport(r.toLowerCase().replace(' ', '-'))} className="w-full flex justify-between p-3 bg-gray-50 rounded-lg mb-2">{r}<Download size={16} /></button>))}</div><div className="bg-white rounded-xl p-6"><h3 className="font-semibold mb-4">Export Options</h3><input type="date" className="w-full p-2 border rounded-lg mb-2" value={dateRange.start} onChange={(e) => setDateRange({...dateRange, start: e.target.value})} /><input type="date" className="w-full p-2 border rounded-lg mb-2" value={dateRange.end} onChange={(e) => setDateRange({...dateRange, end: e.target.value})} /><select className="w-full p-2 border rounded-lg mb-4" value={reportFormat} onChange={(e) => setReportFormat(e.target.value)}><option value="pdf">PDF</option><option value="excel">Excel</option><option value="csv">CSV</option></select><button onClick={() => handleGenerateReport('all')} className="w-full py-2 bg-amber-500 text-white rounded-lg">Generate Report</button></div></div></div>
  )

  const renderActivityLog = () => {
  const activities = getFilteredActivityLog()
  const pages = totalPages(activityLog.length)
  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Activity Log</h2>
      <div className="bg-white rounded-xl shadow-sm">
        <div className="p-4 border-b flex flex-wrap gap-3">
          <div className="flex-1 relative">
            <Search size={18} className="absolute left-3" />
            <input type="text" placeholder="Search..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-2 border rounded-lg" />
          </div>
          <select value={filterModule} onChange={(e) => setFilterModule(e.target.value)} className="px-4 py-2 border rounded-lg">
            <option value="all">All Modules</option>
            <option value="Reservations">Reservations</option>
            <option value="Rooms">Rooms</option>
            <option value="Users">Users</option>
          </select>
          <input type="date" className="px-3 py-2 border rounded-lg" value={dateRange.start} onChange={(e) => setDateRange({...dateRange, start: e.target.value})} />
          <input type="date" className="px-3 py-2 border rounded-lg" value={dateRange.end} onChange={(e) => setDateRange({...dateRange, end: e.target.value})} />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Timestamp</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Username</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Action</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Module</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {activities.map(log => (
                <tr key={log.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm text-gray-500">{log.timestamp}</td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{log.username}</td>
                  <td className="px-6 py-4 text-sm text-gray-700">{log.action}</td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-600">{log.module}</span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">{log.details}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="px-6 py-4 border-t flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Show</span>
            <select value={entriesPerPage} onChange={(e) => setEntriesPerPage(Number(e.target.value))} className="px-2 py-1 border rounded">
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={25}>25</option>
            </select>
            <span className="text-sm text-gray-600">entries</span>
          </div>
          <div className="flex gap-2">
            <button disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)} className="px-3 py-1 border rounded disabled:opacity-50">Previous</button>
            <span className="px-3 py-1">Page {currentPage} of {pages}</span>
            <button disabled={currentPage === pages} onClick={() => setCurrentPage(p => p + 1)} className="px-3 py-1 border rounded disabled:opacity-50">Next</button>
          </div>
        </div>
      </div>
    </div>
  )
}
 const renderContent = () => {
  switch(activeTab) {
    case 'dashboard': return renderDashboard()
    case 'reservations': return renderReservationsTab()
    case 'guests': return renderGuestsTab()
    case 'billing': return renderBillingTab()
    case 'users': return renderUsersTab()
    case 'roomsConfig': return renderRoomsManagement()
    case 'addons': return renderAddOnsCatalog()
    case 'archived': return renderArchivedRecords()
    case 'roles': return renderRolePermissions()
    case 'reports': return renderReports()
    case 'activity': return renderActivityLog()
    default: return renderDashboard()
    }
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Sidebar />
      <div className="ml-64">
        <header className="bg-white shadow-sm sticky top-0 z-20 px-8 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              {activeTab === 'dashboard' ? 'Dashboard' : 
               activeTab === 'reservations' ? 'Reservations' :
               activeTab === 'guests' ? 'Guests' :
               activeTab === 'billing' ? 'Billing & Payments' :
               activeTab === 'users' ? 'User Accounts' :
               activeTab === 'roomsConfig' ? 'Room Management' :
               activeTab === 'addons' ? 'Add-ons Catalog' :
               activeTab === 'archived' ? 'Archived Records' :
               activeTab === 'roles' ? 'Role Permissions' :
               activeTab === 'reports' ? 'Reports & Analytics' :
               activeTab === 'activity' ? 'Activity Log' : 'Admin Dashboard'}
            </h1>
            <p className="text-sm text-gray-500">{currentTime.toLocaleString()}</p>
          </div>
          <div className="relative">
            <button onClick={() => setShowUserMenu(!showUserMenu)} className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-500 rounded-full flex items-center justify-center"><User size={20} className="text-white" /></div>
              <span>{userData.first_name || 'Admin'}</span>
              <ChevronDown size={16} />
            </button>
            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl z-50">
                <Link to="/my-account" className="block px-4 py-2 hover:bg-gray-100">My Account</Link>
                <Link to="/settings" className="block px-4 py-2 hover:bg-gray-100">Settings</Link>
                <hr />
                <button onClick={handleLogout} className="w-full text-left px-4 py-2 hover:bg-red-50 text-red-600">Logout</button>
              </div>
            )}
          </div>
        </header>
        <div className="p-8">{renderContent()}</div>
      </div>

      {/* Modals - Simplified for brevity, keep existing modal code */}
      {showReservationModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
          <div className="bg-white rounded-2xl p-6 w-96">
            <h3 className="text-xl font-bold mb-4">{editingItem ? 'Edit Reservation' : 'New Reservation'}</h3>
            <div className="space-y-3">
              <input type="text" placeholder="Guest Name" className="w-full p-2 border rounded-lg" value={modalData.guestName || ''} onChange={(e) => setModalData({...modalData, guestName: e.target.value})} />
              <select className="w-full p-2 border rounded-lg" value={modalData.room || ''} onChange={(e) => setModalData({...modalData, room: e.target.value})}>
                <option value="">Select Room</option>
                {rooms.map(r => <option key={r.id} value={r.name}>{r.name} - ₱{r.price}/night</option>)}
              </select>
              <input type="date" placeholder="Check In" className="w-full p-2 border rounded-lg" value={modalData.checkIn || ''} onChange={(e) => setModalData({...modalData, checkIn: e.target.value})} />
              <input type="date" placeholder="Check Out" className="w-full p-2 border rounded-lg" value={modalData.checkOut || ''} onChange={(e) => setModalData({...modalData, checkOut: e.target.value})} />
              <input type="number" placeholder="Number of Guests" className="w-full p-2 border rounded-lg" value={modalData.guests || 1} onChange={(e) => setModalData({...modalData, guests: e.target.value})} />
            </div>
            <div className="flex gap-2 mt-6">
              <button onClick={editingItem ? handleUpdateReservation : handleCreateReservation} className="flex-1 py-2 bg-amber-500 text-white rounded-lg">Save</button>
              <button onClick={() => { setShowReservationModal(false); setEditingItem(null); }} className="flex-1 py-2 border rounded-lg">Cancel</button>
            </div>
          </div>
        </div>
      )}

      {showGuestModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
          <div className="bg-white rounded-2xl p-6 w-96">
            <h3 className="text-xl font-bold mb-4">{editingItem ? 'Edit Guest' : 'New Guest'}</h3>
            <div className="space-y-3">
              <input type="text" placeholder="First Name" className="w-full p-2 border rounded-lg" value={modalData.firstName || ''} onChange={(e) => setModalData({...modalData, firstName: e.target.value})} />
              <input type="text" placeholder="Last Name" className="w-full p-2 border rounded-lg" value={modalData.lastName || ''} onChange={(e) => setModalData({...modalData, lastName: e.target.value})} />
              <input type="email" placeholder="Email" className="w-full p-2 border rounded-lg" value={modalData.email || ''} onChange={(e) => setModalData({...modalData, email: e.target.value})} />
              <input type="tel" placeholder="Phone" className="w-full p-2 border rounded-lg" value={modalData.phone || ''} onChange={(e) => setModalData({...modalData, phone: e.target.value})} />
              <input type="text" placeholder="Room" className="w-full p-2 border rounded-lg" value={modalData.room || ''} onChange={(e) => setModalData({...modalData, room: e.target.value})} />
            </div>
            <div className="flex gap-2 mt-6">
              <button onClick={editingItem ? handleUpdateGuest : handleCreateGuest} className="flex-1 py-2 bg-amber-500 text-white rounded-lg">Save</button>
              <button onClick={() => { setShowGuestModal(false); setEditingItem(null); }} className="flex-1 py-2 border rounded-lg">Cancel</button>
            </div>
          </div>
        </div>
      )}

      {showBillModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
          <div className="bg-white rounded-2xl p-6 w-96">
            <h3 className="text-xl font-bold mb-4">{editingItem ? 'Edit Bill' : 'Create Bill'}</h3>
            <div className="space-y-3">
              <input type="text" placeholder="Guest Name" className="w-full p-2 border rounded-lg" value={modalData.guestName || ''} onChange={(e) => setModalData({...modalData, guestName: e.target.value})} />
              <input type="text" placeholder="Room" className="w-full p-2 border rounded-lg" value={modalData.room || ''} onChange={(e) => setModalData({...modalData, room: e.target.value})} />
              <input type="number" placeholder="Total Amount" className="w-full p-2 border rounded-lg" value={modalData.amount || ''} onChange={(e) => setModalData({...modalData, amount: parseFloat(e.target.value)})} />
              <input type="date" placeholder="Due Date" className="w-full p-2 border rounded-lg" value={modalData.dueDate || ''} onChange={(e) => setModalData({...modalData, dueDate: e.target.value})} />
            </div>
            <div className="flex gap-2 mt-6">
              <button onClick={editingItem ? handleUpdateBill : handleCreateBill} className="flex-1 py-2 bg-amber-500 text-white rounded-lg">Save</button>
              <button onClick={() => { setShowBillModal(false); setEditingItem(null); }} className="flex-1 py-2 border rounded-lg">Cancel</button>
            </div>
          </div>
        </div>
      )}

      {showUserModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
          <div className="bg-white rounded-2xl p-6 w-96">
            <h3 className="text-xl font-bold mb-4">{editingItem ? 'Edit User' : 'Add User'}</h3>
            <div className="space-y-3">
              <input type="text" placeholder="First Name" className="w-full p-2 border rounded-lg" value={modalData.first_name || ''} onChange={(e) => setModalData({...modalData, first_name: e.target.value})} />
              <input type="text" placeholder="Last Name" className="w-full p-2 border rounded-lg" value={modalData.last_name || ''} onChange={(e) => setModalData({...modalData, last_name: e.target.value})} />
              <input type="email" placeholder="Email" className="w-full p-2 border rounded-lg" value={modalData.email || ''} onChange={(e) => setModalData({...modalData, email: e.target.value})} />
              <input type="password" placeholder="Password" className="w-full p-2 border rounded-lg" onChange={(e) => setModalData({...modalData, password: e.target.value})} />
              <select className="w-full p-2 border rounded-lg" value={modalData.role || 'staff'} onChange={(e) => setModalData({...modalData, role: e.target.value})}>
                <option value="staff">Staff</option><option value="manager">Manager</option><option value="admin">Admin</option>
              </select>
              <input type="text" placeholder="Department" className="w-full p-2 border rounded-lg" value={modalData.department || ''} onChange={(e) => setModalData({...modalData, department: e.target.value})} />
            </div>
            <div className="flex gap-2 mt-6">
              <button onClick={editingItem ? handleUpdateUser : handleCreateUser} className="flex-1 py-2 bg-amber-500 text-white rounded-lg">Save</button>
              <button onClick={() => { setShowUserModal(false); setEditingItem(null); }} className="flex-1 py-2 border rounded-lg">Cancel</button>
            </div>
          </div>
        </div>
      )}

      {showRoomModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
          <div className="bg-white rounded-2xl p-6 w-96">
            <h3 className="text-xl font-bold mb-4">{editingItem ? 'Edit Room' : 'Add Room'}</h3>
            <div className="space-y-3">
              <input type="text" placeholder="Room Name" className="w-full p-2 border rounded-lg" value={modalData.name || ''} onChange={(e) => setModalData({...modalData, name: e.target.value})} />
              <select className="w-full p-2 border rounded-lg" value={modalData.type || 'cottage'} onChange={(e) => setModalData({...modalData, type: e.target.value})}>
                <option value="cottage">Cottage</option><option value="dormitory">Dormitory</option><option value="villa">Villa</option>
              </select>
              <input type="number" placeholder="Price" className="w-full p-2 border rounded-lg" value={modalData.price || ''} onChange={(e) => setModalData({...modalData, price: parseFloat(e.target.value)})} />
              <input type="number" placeholder="Capacity" className="w-full p-2 border rounded-lg" value={modalData.capacity || ''} onChange={(e) => setModalData({...modalData, capacity: parseInt(e.target.value)})} />
            </div>
            <div className="flex gap-2 mt-6">
              <button onClick={editingItem ? handleUpdateRoom : handleCreateRoom} className="flex-1 py-2 bg-amber-500 text-white rounded-lg">Save</button>
              <button onClick={() => { setShowRoomModal(false); setEditingItem(null); }} className="flex-1 py-2 border rounded-lg">Cancel</button>
            </div>
          </div>
        </div>
      )}

      {showAddOnModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
          <div className="bg-white rounded-2xl p-6 w-96">
            <h3 className="text-xl font-bold mb-4">{editingItem ? 'Edit Add-on' : 'Add Add-on'}</h3>
            <div className="space-y-3">
              <input type="text" placeholder="Name" className="w-full p-2 border rounded-lg" value={modalData.name || ''} onChange={(e) => setModalData({...modalData, name: e.target.value})} />
              <select className="w-full p-2 border rounded-lg" value={modalData.category || 'Water Sports'} onChange={(e) => setModalData({...modalData, category: e.target.value})}>
                <option value="Water Sports">Water Sports</option><option value="Food">Food</option><option value="Amenities">Amenities</option>
              </select>
              <input type="number" placeholder="Price" className="w-full p-2 border rounded-lg" value={modalData.price || ''} onChange={(e) => setModalData({...modalData, price: parseFloat(e.target.value)})} />
            </div>
            <div className="flex gap-2 mt-6">
              <button onClick={editingItem ? handleUpdateAddOn : handleCreateAddOn} className="flex-1 py-2 bg-amber-500 text-white rounded-lg">Save</button>
              <button onClick={() => { setShowAddOnModal(false); setEditingItem(null); }} className="flex-1 py-2 border rounded-lg">Cancel</button>
            </div>
          </div>
        </div>
      )}

      {showRestoreModal && selectedArchive && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
          <div className="bg-white rounded-2xl p-6 w-96">
            <h3 className="text-xl font-bold mb-4">Restore Record</h3>
            <p className="mb-4">Restore "{selectedArchive.name}"?</p>
            <div className="flex gap-2">
              <button onClick={handleRestoreRecord} className="flex-1 py-2 bg-green-500 text-white rounded-lg">Restore</button>
              <button onClick={() => { setShowRestoreModal(false); setSelectedArchive(null); }} className="flex-1 py-2 border rounded-lg">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminDashboard