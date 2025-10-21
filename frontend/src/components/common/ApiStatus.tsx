import React, { useState, useEffect } from 'react';
import { api } from '../../utils/api';

interface ApiStatusProps {
  className?: string;
}

export const ApiStatus: React.FC<ApiStatusProps> = ({ className }) => {
  const [status, setStatus] = useState<'checking' | 'connected' | 'error'>('checking');
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const checkApiStatus = async () => {
      try {
        await api.health();
        setStatus('connected');
        setError('');
      } catch (err: any) {
        setStatus('error');
        setError(err.message || 'API connection failed');
      }
    };

    checkApiStatus();
    
    // Only check API status every 30 seconds to reduce requests
    const interval = setInterval(checkApiStatus, 30000);
    
    return () => clearInterval(interval);
  }, []);

  if (status === 'checking') {
    return (
      <div className={`flex items-center space-x-2 text-sm ${className}`}>
        <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse" />
        <span>Checking API...</span>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className={`flex items-center space-x-2 text-sm ${className}`}>
        <div className="w-2 h-2 bg-red-500 rounded-full" />
        <span className="text-red-600">API Error: {error}</span>
      </div>
    );
  }

  return (
    <div className={`flex items-center space-x-2 text-sm ${className}`}>
      <div className="w-2 h-2 bg-green-500 rounded-full" />
      <span className="text-green-600">API Connected</span>
    </div>
  );
};
