import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { User, Mail, Lock, MapPin, Home, Building, Globe, Phone, CheckCircle, Eye, EyeOff, UserPlus, ArrowLeft } from 'lucide-react'
import { authAPI } from '../services/api'

function RegisterPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [agreeTerms, setAgreeTerms] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState({})
  const [serverError, setServerError] = useState('')
  const [formData, setFormData] = useState({
    first_name: '',
    middle_name: '',
    last_name: '',
    address: '',
    unitBlkFlr: '',
    street: '',
    city: '',
    province: '',
    zip_code: '',
    country: 'Philippines',
    username: '',
    email: '',
    password: '',
    password_confirmation: ''
  })

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
    if (serverError) setServerError('')
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.first_name.trim()) newErrors.first_name = 'First name is required'
    if (!formData.last_name.trim()) newErrors.last_name = 'Last name is required'
    if (!formData.address.trim()) newErrors.address = 'Address is required'
    if (!formData.city.trim()) newErrors.city = 'City is required'
    if (!formData.province.trim()) newErrors.province = 'Province is required'
    if (!formData.zip_code.trim()) newErrors.zip_code = 'ZIP code is required'
    
    if (!formData.username.trim()) {
      newErrors.username = 'Username is required'
    } else if (formData.username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters'
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid'
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required'
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters'
    }
    
    if (formData.password !== formData.password_confirmation) {
      newErrors.password_confirmation = 'Passwords do not match'
    }
    
    if (!agreeTerms) {
      newErrors.terms = 'You must agree to the Terms & Policy'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) return
    
    setIsLoading(true)
    setServerError('')
    
    try {
      // Prepare data for API (combine address fields)
      const fullAddress = [
        formData.address,
        formData.unitBlkFlr,
        formData.street
      ].filter(Boolean).join(', ')
      
      const requestData = {
        first_name: formData.first_name,
        last_name: formData.last_name,
        middle_name: formData.middle_name || null,
        email: formData.email,
        username: formData.username,
        password: formData.password,
        password_confirmation: formData.password_confirmation,
        phone: '', // Optional - can be added later
        address: fullAddress || formData.address,
        city: formData.city,
        province: formData.province,
        zip_code: formData.zip_code,
        country: formData.country,
      }
      
      const response = await authAPI.register(requestData)
      
      if (response.data.token) {
        // Store token and user data
        localStorage.setItem('token', response.data.token)
        localStorage.setItem('user', JSON.stringify(response.data.user))
        localStorage.setItem('userRole', response.data.user.role)
        
        // Check if there's a pending booking
        const pendingBooking = localStorage.getItem('pendingBooking')
        const redirectAfterLogin = localStorage.getItem('redirectAfterLogin')
        
        if (pendingBooking && redirectAfterLogin) {
          localStorage.removeItem('redirectAfterLogin')
          navigate('/rooms')
        } else {
          navigate('/customer')
        }
      } else {
        // If no token in response, just navigate to login
        alert('Registration successful! Please login.')
        navigate('/login')
      }
    } catch (error) {
      console.error('Registration error:', error)
      
      if (error.response?.data?.errors) {
        // Laravel validation errors
        const apiErrors = error.response.data.errors
        const formattedErrors = {}
        Object.keys(apiErrors).forEach(key => {
          formattedErrors[key] = apiErrors[key][0]
        })
        setErrors(formattedErrors)
      } else if (error.response?.data?.message) {
        setServerError(error.response.data.message)
      } else {
        setServerError('Registration failed. Please try again.')
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoBack = () => {
    navigate('/')
  }

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-amber-900/80 to-orange-900/80 z-10"></div>
        <div className="absolute inset-0 bg-cover bg-center" 
             style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1568084680786-a84f91d1153c?w=1200)' }}>
        </div>
        
        <div className="relative z-20 flex flex-col justify-center items-center text-white p-12 text-center w-full">
          <button onClick={handleGoBack} className="absolute top-8 left-8 flex items-center gap-2 text-white/80 hover:text-white transition-colors">
            <ArrowLeft size={20} />
            Back to Home
          </button>
          
          <div className="mb-8">
            <div className="w-32 h-32 mx-auto mb-4 bg-white/20 rounded-3xl backdrop-blur-md flex items-center justify-center shadow-2xl">
              <span className="text-6xl">🌊</span>
            </div>
            <h1 className="text-4xl font-bold mb-2">Costa Marina</h1>
            <p className="text-xl">Beach Resort</p>
          </div>
          
          <div className="space-y-4 max-w-md">
            <div className="w-24 h-1 bg-amber-400 mx-auto rounded-full"></div>
            <p className="text-white/90 text-lg">
              "Create your account and start planning your perfect beach getaway"
            </p>
            <div className="flex flex-wrap justify-center gap-3 text-sm text-white/70">
              <span>✓ Best Price Guarantee</span>
              <span>✓ Easy Booking</span>
              <span>✓ 24/7 Support</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Registration Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 bg-gradient-to-b from-amber-50 to-white overflow-y-auto">
        <div className="max-w-lg w-full py-8">
          {/* Back button for mobile */}
          <button onClick={handleGoBack} className="lg:hidden flex items-center gap-2 text-gray-500 mb-4 hover:text-amber-600 transition-colors">
            <ArrowLeft size={18} />
            Back
          </button>

          {/* Mobile Logo */}
          <div className="lg:hidden text-center mb-6">
            <div className="w-16 h-16 mx-auto mb-3 bg-gradient-to-br from-amber-500 to-orange-500 rounded-2xl flex items-center justify-center shadow-lg">
              <span className="text-3xl">🌊</span>
            </div>
            <h2 className="text-2xl font-bold text-gray-800">Create Account</h2>
            <p className="text-gray-500 text-sm">Join us for an unforgettable experience</p>
          </div>

          {/* Desktop Title */}
          <div className="hidden lg:block mb-6">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
              Create Account
            </h2>
            <p className="text-gray-500 mt-2">Fill in your details to get started</p>
          </div>

          {/* Server Error */}
          {serverError && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
              {serverError}
            </div>
          )}

          {/* Registration Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Personal Information Section */}
            <div className="bg-amber-50/50 rounded-lg p-4">
              <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                <User size={18} className="text-amber-600" />
                Personal Information
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 font-medium text-sm mb-1">
                    First Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="first_name"
                    value={formData.first_name}
                    onChange={handleInputChange}
                    disabled={isLoading}
                    className={`w-full px-3 py-2 border rounded-lg focus:border-amber-500 focus:ring-2 focus:ring-amber-200 transition-all outline-none disabled:bg-gray-100 ${errors.first_name ? 'border-red-500' : 'border-gray-300'}`}
                    placeholder="First name"
                  />
                  {errors.first_name && <p className="text-red-500 text-xs mt-1">{errors.first_name}</p>}
                </div>

                <div>
                  <label className="block text-gray-700 font-medium text-sm mb-1">Middle Name</label>
                  <input
                    type="text"
                    name="middle_name"
                    value={formData.middle_name}
                    onChange={handleInputChange}
                    disabled={isLoading}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-amber-500 focus:ring-2 focus:ring-amber-200 transition-all outline-none disabled:bg-gray-100"
                    placeholder="Middle name (optional)"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-medium text-sm mb-1">
                    Last Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="last_name"
                    value={formData.last_name}
                    onChange={handleInputChange}
                    disabled={isLoading}
                    className={`w-full px-3 py-2 border rounded-lg focus:border-amber-500 focus:ring-2 focus:ring-amber-200 transition-all outline-none disabled:bg-gray-100 ${errors.last_name ? 'border-red-500' : 'border-gray-300'}`}
                    placeholder="Last name"
                  />
                  {errors.last_name && <p className="text-red-500 text-xs mt-1">{errors.last_name}</p>}
                </div>
              </div>
            </div>

            {/* Address Section */}
            <div className="bg-amber-50/50 rounded-lg p-4">
              <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                <MapPin size={18} className="text-amber-600" />
                Address Information
              </h3>
              <div className="space-y-3">
                <div>
                  <label className="block text-gray-700 font-medium text-sm mb-1">
                    Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    disabled={isLoading}
                    className={`w-full px-3 py-2 border rounded-lg focus:border-amber-500 focus:ring-2 focus:ring-amber-200 transition-all outline-none disabled:bg-gray-100 ${errors.address ? 'border-red-500' : 'border-gray-300'}`}
                    placeholder="House/Unit number and Street name"
                  />
                  {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address}</p>}
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-700 font-medium text-sm mb-1">Unit/Blk/Flr</label>
                    <input
                      type="text"
                      name="unitBlkFlr"
                      value={formData.unitBlkFlr}
                      onChange={handleInputChange}
                      disabled={isLoading}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-amber-500 focus:ring-2 focus:ring-amber-200 transition-all outline-none disabled:bg-gray-100"
                      placeholder="Unit/Block/Floor"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 font-medium text-sm mb-1">Street/House Number</label>
                    <input
                      type="text"
                      name="street"
                      value={formData.street}
                      onChange={handleInputChange}
                      disabled={isLoading}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-amber-500 focus:ring-2 focus:ring-amber-200 transition-all outline-none disabled:bg-gray-100"
                      placeholder="Street name"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-700 font-medium text-sm mb-1">
                      City <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      disabled={isLoading}
                      className={`w-full px-3 py-2 border rounded-lg focus:border-amber-500 focus:ring-2 focus:ring-amber-200 transition-all outline-none disabled:bg-gray-100 ${errors.city ? 'border-red-500' : 'border-gray-300'}`}
                      placeholder="City"
                    />
                    {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city}</p>}
                  </div>

                  <div>
                    <label className="block text-gray-700 font-medium text-sm mb-1">
                      Province <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="province"
                      value={formData.province}
                      onChange={handleInputChange}
                      disabled={isLoading}
                      className={`w-full px-3 py-2 border rounded-lg focus:border-amber-500 focus:ring-2 focus:ring-amber-200 transition-all outline-none disabled:bg-gray-100 ${errors.province ? 'border-red-500' : 'border-gray-300'}`}
                      placeholder="Province"
                    />
                    {errors.province && <p className="text-red-500 text-xs mt-1">{errors.province}</p>}
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-700 font-medium text-sm mb-1">
                      ZIP/Postal Code <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="zip_code"
                      value={formData.zip_code}
                      onChange={handleInputChange}
                      disabled={isLoading}
                      className={`w-full px-3 py-2 border rounded-lg focus:border-amber-500 focus:ring-2 focus:ring-amber-200 transition-all outline-none disabled:bg-gray-100 ${errors.zip_code ? 'border-red-500' : 'border-gray-300'}`}
                      placeholder="ZIP code"
                    />
                    {errors.zip_code && <p className="text-red-500 text-xs mt-1">{errors.zip_code}</p>}
                  </div>

                  <div>
                    <label className="block text-gray-700 font-medium text-sm mb-1">Country</label>
                    <input
                      type="text"
                      name="country"
                      value={formData.country}
                      onChange={handleInputChange}
                      disabled={isLoading}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-amber-500 focus:ring-2 focus:ring-amber-200 transition-all outline-none disabled:bg-gray-100"
                      placeholder="Country"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Account Information Section */}
            <div className="bg-amber-50/50 rounded-lg p-4">
              <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                <Lock size={18} className="text-amber-600" />
                Account Information
              </h3>
              <div className="space-y-3">
                <div>
                  <label className="block text-gray-700 font-medium text-sm mb-1">
                    Username <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleInputChange}
                    disabled={isLoading}
                    className={`w-full px-3 py-2 border rounded-lg focus:border-amber-500 focus:ring-2 focus:ring-amber-200 transition-all outline-none disabled:bg-gray-100 ${errors.username ? 'border-red-500' : 'border-gray-300'}`}
                    placeholder="Choose a username"
                  />
                  {errors.username && <p className="text-red-500 text-xs mt-1">{errors.username}</p>}
                </div>

                <div>
                  <label className="block text-gray-700 font-medium text-sm mb-1">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    disabled={isLoading}
                    className={`w-full px-3 py-2 border rounded-lg focus:border-amber-500 focus:ring-2 focus:ring-amber-200 transition-all outline-none disabled:bg-gray-100 ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
                    placeholder="your@email.com"
                  />
                  {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                </div>

                <div>
                  <label className="block text-gray-700 font-medium text-sm mb-1">
                    Password <span className="text-red-500">*</span>
                    <span className="text-xs text-gray-500 ml-2">(Must be at least 8 characters)</span>
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      disabled={isLoading}
                      className={`w-full px-3 py-2 pr-10 border rounded-lg focus:border-amber-500 focus:ring-2 focus:ring-amber-200 transition-all outline-none disabled:bg-gray-100 ${errors.password ? 'border-red-500' : 'border-gray-300'}`}
                      placeholder="Create a password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      disabled={isLoading}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 disabled:opacity-50"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                  {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
                </div>

                <div>
                  <label className="block text-gray-700 font-medium text-sm mb-1">
                    Confirm Password <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      name="password_confirmation"
                      value={formData.password_confirmation}
                      onChange={handleInputChange}
                      disabled={isLoading}
                      className={`w-full px-3 py-2 pr-10 border rounded-lg focus:border-amber-500 focus:ring-2 focus:ring-amber-200 transition-all outline-none disabled:bg-gray-100 ${errors.password_confirmation ? 'border-red-500' : 'border-gray-300'}`}
                      placeholder="Confirm your password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      disabled={isLoading}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 disabled:opacity-50"
                    >
                      {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                  {errors.password_confirmation && <p className="text-red-500 text-xs mt-1">{errors.password_confirmation}</p>}
                </div>
              </div>
            </div>

            {/* Terms and Conditions */}
            <div className="flex items-start gap-3">
              <input
                type="checkbox"
                id="terms"
                checked={agreeTerms}
                onChange={(e) => setAgreeTerms(e.target.checked)}
                disabled={isLoading}
                className="mt-1 w-4 h-4 text-amber-500 rounded focus:ring-amber-500 disabled:opacity-50"
              />
              <label htmlFor="terms" className="text-sm text-gray-600">
                I agree to the <a href="#" className="text-amber-600 hover:underline">Terms & Policy</a> and 
                confirm that I have read the <a href="#" className="text-amber-600 hover:underline">Privacy Policy</a>.
              </label>
            </div>
            {errors.terms && <p className="text-red-500 text-xs -mt-2">{errors.terms}</p>}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-lg font-semibold hover:shadow-lg hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Creating Account...
                </>
              ) : (
                <>
                  <UserPlus size={20} />
                  Create Account
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600 text-sm">
              Already have an account?{' '}
              <Link to="/login" className="text-amber-600 font-semibold hover:text-amber-700 hover:underline">
                Sign in here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default RegisterPage