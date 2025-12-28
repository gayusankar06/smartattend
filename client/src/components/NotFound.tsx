import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Home, ArrowLeft, Search } from 'lucide-react'

const NotFound: React.FC = () => {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex flex-col items-center justify-center p-4">
      <div className="text-center max-w-lg">
        {/* 404 Animation/Illustration */}
        <div className="relative mb-8">
          <div className="text-9xl font-bold text-gray-300 opacity-50">404</div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <Search className="w-24 h-24 text-primary-500 opacity-75" />
          </div>
        </div>
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Page Not Found</h1>
        
        <p className="text-gray-600 mb-8 text-lg">
          The page you're looking for doesn't exist or has been moved.
          Let's get you back on track.
        </p>
        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => navigate(-1)}
            className="btn-secondary flex items-center justify-center space-x-2"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Go Back</span>
          </button>
          
          <button
            onClick={() => navigate('/')}
            className="btn-primary flex items-center justify-center space-x-2"
          >
            <Home className="w-5 h-5" />
            <span>Go to Dashboard</span>
          </button>
        </div>
        {/* Quick Links */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <h3 className="text-sm font-medium text-gray-700 mb-4">Popular Pages</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: 'Dashboard', path: '/' },
              { label: 'Attendance', path: '/scan' },
              { label: 'Analytics', path: '/analytics' },
              { label: 'Settings', path: '/settings' }
            ].map((link, index) => (
              <button
                key={index}
                onClick={() => navigate(link.path)}
                className="bg-white hover:bg-gray-50 border border-gray-200 rounded-lg p-3 text-sm font-medium text-gray-700 transition-colors"
              >
                {link.label}
              </button>
            ))}
          </div>
        </div>
        {/* Support */}
        <div className="mt-8 text-sm text-gray-500">
          <p>Need help? Contact support at
            <a href="mailto:support@smartattend.com" className="text-primary-600 hover:text-primary-700 ml-1">
              support@smartattend.com
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}

export default NotFound