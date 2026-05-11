import { useState, useEffect } from 'react'
import { 
  LayoutDashboard, Users, Calendar, LogOut, User, Settings, 
  Home, Plus, FileText, AlertCircle, Shield, Database,
  HardDrive, Tag, Server, Activity, Bell, UserPlus,
  Edit, Archive, Trash2, Key, CheckCircle, XCircle, Clock
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'

function AdminDashboard() {
  const navigate = useNavigate()
  const [currentTime, setCurrentTime] = useState(new Date())
  const [activeTab, setActiveTab] = useState('dashboard')
  const [showUserMenu, setShowUserMenu] = useState(false)

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  const systemData = {
    staff: { total: 6, frontDesk: 2, manager: 1, other: 3 },
    rooms: { total: 12, inactive: 1, maintenance: 1, active: 10 },
    guests: { total: 214, allTime: true },
    addOns: { total: 18, categories: 4 },
    recentActivity: [
      { action: "J. Ramos logged a compliance violation", role: "Front Desk", date: "May 11, 2026", time: "9:42 PM" },
      { action: "Cottage D status set to Available", role: "Admin", date: "May 11, 2026", time: "3:10 PM" },
      { action: "New staff account created: M. Arcilla", role: "Admin", date: "May 10, 2026", time: "10:00 AM" },
      { action: "Add-on price updated: Jet ski rental", role: "Admin", date: "May 9, 2026", time: "2:30 PM" }
    ]
  }

  const handleLogout = () => {
    localStorage.removeItem('user')
    localStorage.removeItem('userRole')
    navigate('/login')
  }

  const Sidebar = () => (
    <div className="fixed left-0 top-0 h-full w-64 bg-gradient-to-b from-gray-900 to-gray-800 text-white shadow-xl z-30 overflow-y-auto">
      <div className="p-6 border-b border-gray-700">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-500 rounded-xl flex items-center justify-center">
            <span className="text-white text-xl font-bold">🌊</span>
          </div>
          <div>
            <h1 className="text-xl font-bold">CoastaDesk</h1>
            <p className="text-xs text-gray-400">Admin Portal</p>
          </div>
        </div>
        <p className="text-xs text-amber-400">Administrator</p>
      </div>

      <nav className="p-4 space-y-1">
        <div className="text-xs text-gray-500 uppercase tracking-wider px-3 py-2">Main</div>
        <button 
          onClick={() => setActiveTab('dashboard')}
          className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-all ${activeTab === 'dashboard' ? 'bg-amber-600 text-white' : 'text-gray-300 hover:bg-gray-700'}`}
        >
          <LayoutDashboard size={18} />
          Dashboard
        </button>

        <div className="text-xs text-gray-500 uppercase tracking-wider px-3 py-2 mt-4">Operations</div>
        <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-gray-300 hover:bg-gray-700">
          <Calendar size={18} />
          Reservations
        </button>
        <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-gray-300 hover:bg-gray-700">
          <Users size={18} />
          Guests
        </button>
        <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-gray-300 hover:bg-gray-700">
          <CreditCardIcon size={18} />
          Billing & payments
        </button>

        <div className="text-xs text-gray-500 uppercase tracking-wider px-3 py-2 mt-4">System Config</div>
        <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-gray-300 hover:bg-gray-700">
          <Users size={18} />
          User accounts
        </button>
        <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-gray-300 hover:bg-gray-700">
          <Home size={18} />
          Room management
        </button>
        <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-gray-300 hover:bg-gray-700">
          <Tag size={18} />
          Add-ons catalog
        </button>
        <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-gray-300 hover:bg-gray-700">
          <Shield size={18} />
          Role permissions
        </button>

        <div className="text-xs text-gray-500 uppercase tracking-wider px-3 py-2 mt-4">Data</div>
        <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-gray-300 hover:bg-gray-700">
          <Archive size={18} />
          Archived records
        </button>
        <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-gray-300 hover:bg-gray-700">
          <FileText size={18} />
          All reports
        </button>
        <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-gray-300 hover:bg-gray-700">
          <Activity size={18} />
          Activity log
        </button>
      </nav>
    </div>
  )

  // CreditCard icon component
  const CreditCardIcon = ({ size, className }) => (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect>
      <line x1="1" y1="10" x2="23" y2="10"></line>
    </svg>
  )

  return (
    <div className="min-h-screen bg-gray-100">
      <Sidebar />
      
      <div className="ml-64">
        <header className="bg-white shadow-sm sticky top-0 z-20">
          <div className="px-8 py-4 flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Admin Dashboard</h1>
              <p className="text-sm text-gray-500">{currentTime.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })} | {currentTime.toLocaleTimeString()}</p>
            </div>
            
            <div className="relative">
              <button 
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 transition-all"
              >
                <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-500 rounded-full flex items-center justify-center">
                  <User size={20} className="text-white" />
                </div>
                <div className="text-left">
                  <p className="font-medium text-gray-800">Admin User</p>
                  <p className="text-xs text-gray-500">System Administrator</p>
                </div>
              </button>
              
              {showUserMenu && (
  <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl border z-50">
    <div className="p-3 border-b">
      <p className="font-medium text-gray-800">{userData?.firstName} {userData?.lastName}</p>
      <p className="text-xs text-gray-500">{userData?.email}</p>
    </div>
    <div className="p-2">
      <Link 
        to="/my-account"
        className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 transition-all text-left"
      >
        <User size={16} />
        My Account
      </Link>
      <Link 
        to="/settings"
        className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 transition-all text-left"
      >
        <Settings size={16} />
        Settings
      </Link>
      <hr className="my-2" />
      <button 
        onClick={handleLogout}
        className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-red-50 text-red-600 transition-all text-left"
      >
        <LogOut size={16} />
        Logout
      </button>
    </div>
  </div>
)}
            </div>
          </div>
        </header>

        <div className="p-8">
          {/* System Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-blue-500">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-gray-500 text-sm">Active staff accounts</p>
                  <p className="text-3xl font-bold text-gray-800">{systemData.staff.total}</p>
                  <p className="text-sm text-gray-500 mt-1">{systemData.staff.frontDesk} front desk, {systemData.staff.manager} manager</p>
                </div>
                <Users size={32} className="text-blue-500" />
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-green-500">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-gray-500 text-sm">Total rooms/cottages</p>
                  <p className="text-3xl font-bold text-gray-800">{systemData.rooms.total}</p>
                  <p className="text-sm text-gray-500 mt-1">{systemData.rooms.inactive} inactive, {systemData.rooms.maintenance} maintenance</p>
                </div>
                <Home size={32} className="text-green-500" />
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-purple-500">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-gray-500 text-sm">Registered guests</p>
                  <p className="text-3xl font-bold text-gray-800">{systemData.guests.total}</p>
                  <p className="text-sm text-gray-500 mt-1">All time</p>
                </div>
                <Database size={32} className="text-purple-500" />
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-amber-500">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-gray-500 text-sm">Add-on items</p>
                  <p className="text-3xl font-bold text-gray-800">{systemData.addOns.total}</p>
                  <p className="text-sm text-gray-500 mt-1">Across {systemData.addOns.categories} categories</p>
                </div>
                <Tag size={32} className="text-amber-500" />
              </div>
            </div>
          </div>

          {/* Admin Access Areas */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="font-semibold text-gray-800 mb-4">Admin access areas</h3>
              <div className="space-y-3">
                <div className="p-3 bg-gray-50 rounded-lg flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <UserPlus size={20} className="text-blue-500" />
                    <div>
                      <p className="font-medium text-gray-800">User management</p>
                      <p className="text-xs text-gray-500">Create, edit, deactivate staff accounts and assign roles</p>
                    </div>
                  </div>
                  <button className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600">Manage</button>
                </div>
                
                <div className="p-3 bg-gray-50 rounded-lg flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <Home size={20} className="text-green-500" />
                    <div>
                      <p className="font-medium text-gray-800">Room management</p>
                      <p className="text-xs text-gray-500">Add/edit/archive rooms, set categories and pricing</p>
                    </div>
                  </div>
                  <button className="px-3 py-1 bg-green-500 text-white rounded text-sm hover:bg-green-600">Manage</button>
                </div>
                
                <div className="p-3 bg-gray-50 rounded-lg flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <Tag size={20} className="text-purple-500" />
                    <div>
                      <p className="font-medium text-gray-800">Add-ons catalog</p>
                      <p className="text-xs text-gray-500">Manage billable add-ons: water sports, food, equipment</p>
                    </div>
                  </div>
                  <button className="px-3 py-1 bg-purple-500 text-white rounded text-sm hover:bg-purple-600">Manage</button>
                </div>
                
                <div className="p-3 bg-gray-50 rounded-lg flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <Archive size={20} className="text-yellow-500" />
                    <div>
                      <p className="font-medium text-gray-800">Archived records</p>
                      <p className="text-xs text-gray-500">View and restore deleted guests, reservations, rooms</p>
                    </div>
                  </div>
                  <button className="px-3 py-1 bg-yellow-500 text-white rounded text-sm hover:bg-yellow-600">View</button>
                </div>
                
                <div className="p-3 bg-gray-50 rounded-lg flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <Shield size={20} className="text-red-500" />
                    <div>
                      <p className="font-medium text-gray-800">Role permissions</p>
                      <p className="text-xs text-gray-500">Define what each role can view or modify per module</p>
                    </div>
                  </div>
                  <button className="px-3 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600">Configure</button>
                </div>
                
                <div className="p-3 bg-gray-50 rounded-lg flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <FileText size={20} className="text-indigo-500" />
                    <div>
                      <p className="font-medium text-gray-800">Full reports access</p>
                      <p className="text-xs text-gray-500">All reports including audit logs and user activity</p>
                    </div>
                  </div>
                  <button className="px-3 py-1 bg-indigo-500 text-white rounded text-sm hover:bg-indigo-600">View</button>
                </div>
              </div>
            </div>

            {/* Recent System Activity */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <Activity size={20} className="text-amber-500" />
                Recent system activity
              </h3>
              <div className="space-y-3">
                {systemData.recentActivity.map((activity, idx) => (
                  <div key={idx} className="p-3 bg-gray-50 rounded-lg border-l-4 border-amber-500">
                    <p className="font-medium text-gray-800 text-sm">{activity.action}</p>
                    <div className="flex justify-between items-center mt-2">
                      <span className="text-xs text-gray-500">{activity.role}</span>
                      <span className="text-xs text-gray-400">{activity.date} · {activity.time}</span>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Server size={16} className="text-blue-600" />
                  <p className="font-medium text-blue-800 text-sm">System Health</p>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <span className="text-gray-600">Database: Connected</span>
                  <span className="text-green-600">✓ Optimal</span>
                  <span className="text-gray-600">API Status: Online</span>
                  <span className="text-green-600">✓ Running</span>
                  <span className="text-gray-600">Storage: 45% used</span>
                  <span className="text-blue-600">ℹ Normal</span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl shadow-sm p-6 text-white">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-white/80 text-sm">Today's Check-ins</p>
                  <p className="text-3xl font-bold">8</p>
                </div>
                <CheckCircle size={32} />
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-xl shadow-sm p-6 text-white">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-white/80 text-sm">Pending Check-outs</p>
                  <p className="text-3xl font-bold">5</p>
                </div>
                <Clock size={32} />
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl shadow-sm p-6 text-white">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-white/80 text-sm">Active Bookings</p>
                  <p className="text-3xl font-bold">24</p>
                </div>
                <Calendar size={32} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard