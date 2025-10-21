import React from 'react';
import { useAuth } from '../../context/AuthContext';

export const AuthDebug: React.FC = () => {
  const { state } = useAuth();

  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 bg-black bg-opacity-75 text-white p-4 rounded-lg text-xs max-w-sm z-50">
      <h4 className="font-bold mb-2">Auth Debug</h4>
      <div className="space-y-1">
        <div>Loading: {state.loading ? 'true' : 'false'}</div>
        <div>Authenticated: {state.isAuthenticated ? 'true' : 'false'}</div>
        <div>Admin: {state.admin ? state.admin.name : 'null'}</div>
        <div>Token: {state.token ? 'present' : 'null'}</div>
        <div>LocalStorage Token: {localStorage.getItem('adminToken') ? 'present' : 'null'}</div>
        <div>SessionStorage Token: {sessionStorage.getItem('adminToken') ? 'present' : 'null'}</div>
      </div>
    </div>
  );
};
