import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import Layout from './components/Layout';
import Login from './pages/Login';
import Notifications from './pages/Notifications';
import Dashboard from './pages/Dashboard';
import Inventory from './pages/Inventory';
import AddItem from './pages/AddItem';
import Orders from './pages/Orders';
import Reports from './pages/Reports';
import UserManagement from './pages/UserManagement';
import Settings from './pages/Settings';
import Categories from './pages/settings/Categories';
import Brands from './pages/settings/Brands';
import Locations from './pages/settings/Locations';
import UserRoles from './pages/settings/UserRoles';
import StockCount from './pages/StockCount';
import DiscardStock from './pages/DiscardStock';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <Router>
      <AuthProvider>
        <ThemeProvider>
          <Routes>
            <Route path="/login" element={<Login />} />
            
            <Route element={<ProtectedRoute><Layout /></ProtectedRoute>}>
              <Route path="/" element={<Dashboard />} />
              <Route path="/notifications" element={<Notifications />} />
              <Route path="/inventory" element={<Inventory />} />
              <Route path="/inventory/add" element={<AddItem />} />
              <Route path="/inventory/stock-count" element={<StockCount />} />
              <Route path="/inventory/discard" element={<DiscardStock />} />
              <Route path="/orders" element={<Orders />} />
              <Route path="/reports" element={<Reports />} />
              <Route path="/users" element={<UserManagement />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/settings/categories" element={<Categories />} />
              <Route path="/settings/brands" element={<Brands />} />
              <Route path="/settings/locations" element={<Locations />} />
              <Route path="/settings/roles" element={<UserRoles />} />
            </Route>
          </Routes>
        </ThemeProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;