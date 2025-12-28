import React from 'react';
import { toast } from 'react-hot-toast';
import { QrCode, CheckCircle, XCircle } from 'lucide-react';

const QRScanner: React.FC = () => {
  const handleDemoScan = () => {
    toast.success('Attendance marked successfully!');
    setTimeout(() => {
      window.location.href = '/student';
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4">
      <div className="max-w-md mx-auto">
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => window.history.back()}
            className="text-gray-300 hover:text-white"
          >
            <XCircle className="w-6 h-6" />
          </button>
          
          <h1 className="text-xl font-bold flex items-center">
            <QrCode className="w-5 h-5 mr-2" />
            Scan QR Code
          </h1>
          
          <div className="w-6"></div>
        </div>
        <div className="text-center mb-8">
          <p className="text-gray-300 mb-2">Position QR code within frame</p>
          <p className="text-sm text-gray-400">Ensure good lighting for scanning</p>
        </div>
        <div className="relative mb-8">
          <div className="aspect-square bg-gray-800 rounded-xl border-2 border-dashed border-gray-700 flex items-center justify-center">
            <div className="text-center">
              <div className="text-6xl mb-4">📱</div>
              <p className="text-gray-400">Camera preview would appear here</p>
            </div>
          </div>
          
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-1/4 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 border-2 border-green-500 rounded-xl"></div>
          </div>
        </div>
        <div className="bg-gray-800 rounded-xl p-6 mb-6">
          <h3 className="font-semibold mb-4">Student Information</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-400">Name</p>
              <p className="font-medium">Alice Johnson</p>
            </div>
            <div>
              <p className="text-sm text-gray-400">Roll No</p>
              <p className="font-medium">CS001</p>
            </div>
            <div>
              <p className="text-sm text-gray-400">Department</p>
              <p className="font-medium">CSE</p>
            </div>
            <div>
              <p className="text-sm text-gray-400">Time</p>
              <p className="font-medium">{new Date().toLocaleTimeString()}</p>
            </div>
          </div>
        </div>
        <button
          onClick={handleDemoScan}
          className="w-full bg-green-500 hover:bg-green-600 text-white py-4 rounded-xl font-bold text-lg flex items-center justify-center space-x-3"
        >
          <CheckCircle className="w-6 h-6" />
          <span>Mark Attendance (Demo)</span>
        </button>
        <div className="mt-8 text-sm text-gray-400">
          <h4 className="font-semibold mb-2 text-white">Demo Note:</h4>
          <p>In real implementation, this would open camera and scan actual QR codes.</p>
        </div>
      </div>
    </div>
  );
};

export default QRScanner;