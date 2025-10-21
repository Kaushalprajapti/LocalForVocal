import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { Admin, AuthState } from '../types';
import { api } from '../utils/api';
import { useLocalStorage } from '../hooks/useLocalStorage';
import toast from 'react-hot-toast';

type AuthAction =
  | { type: 'LOGIN_START' }
  | { type: 'LOGIN_SUCCESS'; payload: { admin: Admin; token: string } }
  | { type: 'LOGIN_FAILURE'; payload: string }
  | { type: 'LOGOUT' }
  | { type: 'VERIFY_TOKEN_START' }
  | { type: 'VERIFY_TOKEN_SUCCESS'; payload: { admin: Admin; token: string } }
  | { type: 'VERIFY_TOKEN_FAILURE' }
  | { type: 'UPDATE_PROFILE'; payload: Admin };

interface AuthContextType {
  state: AuthState;
  login: (email: string, password: string, rememberMe?: boolean) => Promise<void>;
  logout: () => void;
  verifyToken: () => Promise<void>;
  updateProfile: (admin: Admin) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'LOGIN_START':
      return { ...state, loading: true };
    
    case 'LOGIN_SUCCESS':
      return {
        ...state,
        admin: action.payload.admin,
        token: action.payload.token,
        isAuthenticated: true,
        loading: false,
      };
    
    case 'LOGIN_FAILURE':
      return {
        ...state,
        admin: null,
        token: null,
        isAuthenticated: false,
        loading: false,
      };
    
    case 'LOGOUT':
      return {
        ...state,
        admin: null,
        token: null,
        isAuthenticated: false,
        loading: false,
      };
    
    case 'VERIFY_TOKEN_START':
      return { ...state, loading: true };
    
    case 'VERIFY_TOKEN_SUCCESS':
      return {
        ...state,
        admin: action.payload.admin,
        token: action.payload.token,
        isAuthenticated: true,
        loading: false,
      };
    
    case 'VERIFY_TOKEN_FAILURE':
      return {
        ...state,
        admin: null,
        token: null,
        isAuthenticated: false,
        loading: false,
      };
    
    case 'UPDATE_PROFILE':
      return {
        ...state,
        admin: action.payload,
      };
    
    default:
      return state;
  }
};

const initialState: AuthState = {
  admin: null,
  token: null,
  isAuthenticated: false,
  loading: true,
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [storedToken, setStoredToken] = useLocalStorage<string | null>('adminToken', null);
  const [storedAdmin, setStoredAdmin] = useLocalStorage<Admin | null>('admin', null);
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Verify token on mount
  useEffect(() => {
    const checkAuth = async () => {
      // Check localStorage first
      if (storedToken && storedAdmin) {
        dispatch({ type: 'VERIFY_TOKEN_START' });
        try {
          await verifyToken();
        } catch (error) {
          // If verification fails, check sessionStorage
          const sessionToken = sessionStorage.getItem('adminToken');
          const sessionAdmin = sessionStorage.getItem('admin');
          
          if (sessionToken && sessionAdmin) {
            try {
              const adminData = JSON.parse(sessionAdmin);
              dispatch({ 
                type: 'VERIFY_TOKEN_SUCCESS', 
                payload: { admin: adminData, token: sessionToken } 
              });
            } catch (error) {
              dispatch({ type: 'VERIFY_TOKEN_FAILURE' });
            }
          } else {
            dispatch({ type: 'VERIFY_TOKEN_FAILURE' });
          }
        }
      } else {
        // Check sessionStorage if localStorage is empty
        const sessionToken = sessionStorage.getItem('adminToken');
        const sessionAdmin = sessionStorage.getItem('admin');
        
        if (sessionToken && sessionAdmin) {
          try {
            const adminData = JSON.parse(sessionAdmin);
            dispatch({ 
              type: 'VERIFY_TOKEN_SUCCESS', 
              payload: { admin: adminData, token: sessionToken } 
            });
          } catch (error) {
            dispatch({ type: 'VERIFY_TOKEN_FAILURE' });
          }
        } else {
          dispatch({ type: 'VERIFY_TOKEN_FAILURE' });
        }
      }
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string, rememberMe: boolean = false) => {
    try {
      dispatch({ type: 'LOGIN_START' });
      
      const response = await api.admin.login({ email, password });
      const { admin: adminData, token } = response;
      
      // Transform admin data to match frontend format
      const admin = {
        _id: adminData.id,
        name: adminData.name,
        email: adminData.email,
        role: adminData.role,
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      // Store token and admin data
      if (rememberMe) {
        setStoredToken(token);
        setStoredAdmin(admin);
        // Also store in sessionStorage as backup
        sessionStorage.setItem('adminToken', token);
        sessionStorage.setItem('admin', JSON.stringify(admin));
      } else {
        // Store in sessionStorage for session-only persistence
        sessionStorage.setItem('adminToken', token);
        sessionStorage.setItem('admin', JSON.stringify(admin));
      }
      
      dispatch({ type: 'LOGIN_SUCCESS', payload: { admin, token } });
      toast.success('Login successful!');
    } catch (error: any) {
      const message = error.response?.data?.message || 'Login failed';
      dispatch({ type: 'LOGIN_FAILURE', payload: message });
      toast.error(message);
      throw error;
    }
  };

  const logout = () => {
    // Clear all stored data
    setStoredToken(null);
    setStoredAdmin(null);
    sessionStorage.removeItem('adminToken');
    sessionStorage.removeItem('admin');
    localStorage.removeItem('adminToken');
    localStorage.removeItem('admin');
    
    dispatch({ type: 'LOGOUT' });
    toast.success('Logged out successfully');
  };

  const verifyToken = async () => {
    try {
      const response = await api.admin.verifyToken();
      const { admin: adminData } = response;
      
      // Transform admin data to match frontend format
      const admin = {
        _id: adminData.id,
        name: adminData.name,
        email: adminData.email,
        role: adminData.role,
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      // Get token from storage
      const token = storedToken || sessionStorage.getItem('adminToken');
      
      if (!token) {
        throw new Error('No token found');
      }
      
      dispatch({ type: 'VERIFY_TOKEN_SUCCESS', payload: { admin, token } });
    } catch (error) {
      // Clear stored data on verification failure
      setStoredToken(null);
      setStoredAdmin(null);
      sessionStorage.removeItem('adminToken');
      sessionStorage.removeItem('admin');
      localStorage.removeItem('adminToken');
      localStorage.removeItem('admin');
      
      dispatch({ type: 'VERIFY_TOKEN_FAILURE' });
    }
  };

  const updateProfile = (admin: Admin) => {
    dispatch({ type: 'UPDATE_PROFILE', payload: admin });
    setStoredAdmin(admin);
  };

  const value: AuthContextType = {
    state,
    login,
    logout,
    verifyToken,
    updateProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
