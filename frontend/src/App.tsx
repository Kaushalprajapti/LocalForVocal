import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';
import { FavoriteProvider } from './context/FavoriteContext';

// Customer Routes
import { CustomerLayout } from './routes/CustomerRoutes';

// Admin Routes
import { AdminRoutes } from './routes/AdminRoutes';

function App() {
  return (
    <NotificationProvider>
      <CartProvider>
        <FavoriteProvider>
          <AuthProvider>
            <div className="App">
              <Routes>
                {/* Customer Routes */}
                <Route path="/*" element={<CustomerLayout />} />
                
                {/* Admin Routes */}
                <Route path="/admin/*" element={<AdminRoutes />} />
              </Routes>
            </div>
          </AuthProvider>
        </FavoriteProvider>
      </CartProvider>
    </NotificationProvider>
  );
}

export default App;