import { useState, useEffect } from 'react'
import { 
  LayoutDashboard, Users, Calendar, Clock, LogOut, User, Settings, 
  DollarSign, TrendingUp, PieChart, FileText, AlertCircle, Download,
  CheckCircle, XCircle, Home, Plus, Receipt, Activity, BarChart,
  ChevronRight, Bell, UserCheck, UserX, BookOpen, CreditCard
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'

function ManagerDashboard() {
  const navigate = useNavigate()
  const [currentTime, setCurrentTime] = useState(new Date())
  const [activeTab, setActiveTab] = useState('dashboard')
  const [showUserMenu, setShowUserMenu] = useState(false)

const [userData, setUserData] = useState({})

useEffect(() => {
  const user = JSON.parse(localStorage.getItem('user') || '{}')
  setUserData(user)
}, [])

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  const dashboardData = {
    revenue: {
      today: 18500,
      yesterday: 14200,
      week: 94000,
      month: 312000
    },
    occupancy: {
      rate: 58,
      occupied: 7,
      total: 12
    },
    reservations: {
      total: 42,
      walkIn: 18,
      online: 24,
      cancellations: 3
    },
    pendingApprovals: [
      { type: "SC discount", name: "Lim, Carlos", amount: 3200, discount: "20% senior citizen" },
      { type: "Custom discount", name: "Event group", amount: 15000, discount: "10% group rate" }
    ],
    revenueByRoom: [
      { type: "Standard cottage", amount: 82000 },
      { type: "Family cottage", amount: 140000 },
      { type: "Dormitory", amount: 54000 },
      { type: "Function hall", amount: 36000 }
    ],
    complianceAlerts: [
      { issue: "Cottage B — noise complaint", loggedBy: "J. Ramos", time: "9:42 PM" },
      { issue: "Day tour group — outside food", loggedBy: "M. Santos", time: "1:15 PM" }
    ]
  }

  const handleLogout = () => {
    localStorage.removeItem('user')
    localStorage.removeItem('userRole')
    navigate('/login')
  }

  const Sidebar = () => (
    <div className="fixed left-0 top-0 h-full w-64 bg-gradient-to-b from-gray-900 to-gray-800 text-white shadow-xl z-30">
      <div className="p-6 border-b border-gray-700">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-500 rounded-xl flex items-center justify-center">
            <span className="text-white text-xl font-bold">🌊</span>
          </div>
          <div>
            <h1 className="text-xl font-bold">CoastaDesk</h1>
            <p className="text-xs text-gray-400">Management System</p>
          </div>
        </div>
        <p className="text-xs text-amber-400">Manager</p>
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
          <Home size={18} />
          Room status
        </button>

        <div className="text-xs text-gray-500 uppercase tracking-wider px-3 py-2 mt-4">Finance</div>
        <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-gray-300 hover:bg-gray-700">
          <CreditCard size={18} />
          Billing & payments
        </button>
        <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-gray-300 hover:bg-gray-700">
          <CheckCircle size={18} />
          Discount approvals
          <span className="ml-auto bg-red-500 text-xs px-2 py-0.5 rounded-full">2</span>
        </button>

        <div className="text-xs text-gray-500 uppercase tracking-wider px-3 py-2 mt-4">Reports</div>
        <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-gray-300 hover:bg-gray-700">
          <FileText size={18} />
          Revenue report
        </button>
        <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-gray-300 hover:bg-gray-700">
          <FileText size={18} />
          Guest report
        </button>
        <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-gray-300 hover:bg-gray-700">
          <FileText size={18} />
          Occupancy report
        </button>

        <div className="text-xs text-gray-500 uppercase tracking-wider px-3 py-2 mt-4">Compliance</div>
        <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-gray-300 hover:bg-gray-700">
          <AlertCircle size={18} />
          Compliance log
        </button>
        <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-gray-300 hover:bg-gray-700">
          <XCircle size={18} />
          Violations
          <span className="ml-auto bg-red-500 text-xs px-2 py-0.5 rounded-full">1</span>
        </button>
      </nav>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-100">
      <Sidebar />
      
      <div className="ml-64">
        <header className="bg-white shadow-sm sticky top-0 z-20">
          <div className="px-8 py-4 flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Manager Dashboard</h1>
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
                  <p className="font-medium text-gray-800">John Reyes</p>
                  <p className="text-xs text-gray-500">Resort Manager</p>
                </div>
              </button>
        
{showUserMenu && (
  <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl border z-50">
    <div className="p-3 border-b">
      <p className="font-medium text-gray-800">{userData?.firstName} {userData?.lastName}</p>
      <p className="text-xs text-gray-500">{userData?.email}</p>
    </div>
    <div className="p-2">
      <button 
        onClick={() => navigate('/my-account')}
        className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 transition-all text-left"
      >
        <User size={16} />
        My Account
      </button>
      <button 
        onClick={() => navigate('/settings')}
        className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 transition-all text-left"
      >
        <Settings size={16} />
        Settings
      </button>
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
          {/* Revenue Summary */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-green-500">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-gray-500 text-sm">Revenue today</p>
                  <p className="text-3xl font-bold text-gray-800">₱{dashboardData.revenue.today.toLocaleString()}</p>
                  <p className="text-sm text-green-600 mt-1">vs ₱{dashboardData.revenue.yesterday.toLocaleString()} yesterday</p>
                </div>
                <DollarSign size={32} className="text-green-500" />
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-blue-500">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-gray-500 text-sm">Revenue this week</p>
                  <p className="text-3xl font-bold text-gray-800">₱{dashboardData.revenue.week.toLocaleString()}</p>
                  <p className="text-sm text-gray-500 mt-1">7-day rolling total</p>
                </div>
                <TrendingUp size={32} className="text-blue-500" />
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-purple-500">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-gray-500 text-sm">Revenue this month</p>
                  <p className="text-3xl font-bold text-gray-800">₱{dashboardData.revenue.month.toLocaleString()}</p>
                  <p className="text-sm text-gray-500 mt-1">May 2026</p>
                </div>
                <PieChart size={32} className="text-purple-500" />
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-amber-500">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-gray-500 text-sm">Occupancy rate</p>
                  <p className="text-3xl font-bold text-gray-800">{dashboardData.occupancy.rate}%</p>
                  <p className="text-sm text-gray-500 mt-1">{dashboardData.occupancy.occupied} of {dashboardData.occupancy.total} rooms</p>
                </div>
                <Activity size={32} className="text-amber-500" />
              </div>
            </div>
          </div>

          {/* Reservation Overview */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="font-semibold text-gray-800 mb-4">Reservation overview</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <p className="text-2xl font-bold text-blue-600">{dashboardData.reservations.total}</p>
                  <p className="text-sm text-gray-600">Total reservations</p>
                  <p className="text-xs text-gray-500">This month</p>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <p className="text-2xl font-bold text-green-600">{dashboardData.reservations.walkIn}</p>
                  <p className="text-sm text-gray-600">Walk-in</p>
                  <p className="text-xs text-gray-500">{Math.round(dashboardData.reservations.walkIn / dashboardData.reservations.total * 100)}% of total</p>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <p className="text-2xl font-bold text-purple-600">{dashboardData.reservations.online}</p>
                  <p className="text-sm text-gray-600">Online bookings</p>
                  <p className="text-xs text-gray-500">{Math.round(dashboardData.reservations.online / dashboardData.reservations.total * 100)}% of total</p>
                </div>
                <div className="text-center p-4 bg-red-50 rounded-lg">
                  <p className="text-2xl font-bold text-red-600">{dashboardData.reservations.cancellations}</p>
                  <p className="text-sm text-gray-600">Cancellations</p>
                  <p className="text-xs text-gray-500">This month</p>
                </div>
              </div>
            </div>

            {/* Pending Approvals */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <CheckCircle size={20} className="text-amber-500" />
                Pending approvals
              </h3>
              <div className="space-y-3">
                {dashboardData.pendingApprovals.map((approval, idx) => (
                  <div key={idx} className="p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                    <div className="flex justify-between items-start mb-2">
                      <p className="font-medium text-gray-800">{approval.type}</p>
                      <span className="text-sm text-yellow-600 px-2 py-0.5 rounded-full bg-yellow-100">Needs approval</span>
                    </div>
                    <p className="text-sm text-gray-600">{approval.name}</p>
                    <p className="text-sm font-semibold text-gray-800">₱{approval.amount.toLocaleString()} · {approval.discount}</p>
                    <div className="flex gap-2 mt-2">
                      <button className="flex-1 py-1 bg-green-500 text-white rounded text-sm hover:bg-green-600">Approve</button>
                      <button className="flex-1 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600">Decline</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Revenue by Room Type */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="font-semibold text-gray-800 mb-4">Revenue by Room Type</h3>
              <div className="space-y-3">
                {dashboardData.revenueByRoom.map((room, idx) => (
                  <div key={idx} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="text-gray-700">{room.type}</span>
                    <span className="font-semibold text-gray-800">₱{room.amount.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Reports */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="font-semibold text-gray-800 mb-4">Reports</h3>
              <div className="space-y-3">
                <button className="w-full flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-all">
                  <div className="flex items-center gap-3">
                    <FileText size={20} className="text-blue-500" />
                    <span>Guest report</span>
                  </div>
                  <Download size={18} className="text-gray-400" />
                </button>
                <button className="w-full flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-all">
                  <div className="flex items-center gap-3">
                    <FileText size={20} className="text-green-500" />
                    <span>Revenue report</span>
                  </div>
                  <Download size={18} className="text-gray-400" />
                </button>
                <button className="w-full flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-all">
                  <div className="flex items-center gap-3">
                    <FileText size={20} className="text-purple-500" />
                    <span>Occupancy report</span>
                  </div>
                  <Download size={18} className="text-gray-400" />
                </button>
              </div>
            </div>
          </div>

          {/* Compliance Alerts */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <AlertCircle size={20} className="text-red-500" />
              Compliance alerts
            </h3>
            <div className="space-y-3">
              {dashboardData.complianceAlerts.map((alert, idx) => (
                <div key={idx} className="flex justify-between items-center p-3 bg-red-50 rounded-lg border border-red-200">
                  <div>
                    <p className="font-medium text-gray-800">{alert.issue}</p>
                    <p className="text-sm text-gray-600">Logged by: {alert.loggedBy} · {alert.time}</p>
                  </div>
                  <button className="px-3 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600">View</button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ManagerDashboard