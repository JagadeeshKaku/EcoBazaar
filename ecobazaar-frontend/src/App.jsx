import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import React from "react";

// --- Page Imports ---
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Products from "./pages/Products";
import ProductDetails from "./pages/ProductDetails";
import Cart from "./pages/Cart";
import Orders from "./pages/Orders";

// --- Dashboard Imports ---
import SellerDashboard from "./pages/SellerDashboard"; 
import AdminDashboard from "./pages/AdminDashboard"; 
import AdminAnalytics from "./pages/AdminAnalytics";
import Dashboard from "./pages/Dashboard"; 
import SellerAnalytics from "./pages/SellerAnalytics";

// --- Component & Security Imports ---
import Navbar from "./components/Navbar"; // Added the missing import
import ProtectedRoute from "./components/ProtectedRoute";
import AddProduct from "./pages/AddProduct";
import UpdateProduct from "./pages/UpdateProduct";

import Compare from "./pages/Compare";

import ApproveProducts from "./pages/ApproveProducts";
import CarbonReports from "./pages/CarbonReports";
import EcoLeaderboard from "./pages/EcoLeaderboard";
import ForgotPassword from "./pages/ForgotPassword";

// This helper component ensures Navbar is hidden on Login/Signup
const LayoutHandler = ({ children }) => {
  const location = useLocation();
  const hideNavbarPaths = ["/", "/signup"];
  const shouldShowNavbar = !hideNavbarPaths.includes(location.pathname);

  return (
    <>
      {shouldShowNavbar && <Navbar />}
      {children}
    </>
  );
};

function App() {
  return (
    <BrowserRouter>
      <LayoutHandler>
        <Routes>
          {/* --- Public Routes --- */}
          <Route path="/" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* --- General Protected Routes --- */}
          <Route 
            path="/products" 
            element={<ProtectedRoute><Products /></ProtectedRoute>} 
          />
          <Route 
            path="/product/:id" 
            element={<ProtectedRoute><ProductDetails /></ProtectedRoute>} 
          />
          <Route 
            path="/cart" 
            element={<ProtectedRoute><Cart /></ProtectedRoute>} 
          />
          <Route 
            path="/orders" 
            element={<ProtectedRoute><Orders /></ProtectedRoute>} 
          />

          {/* --- 👮 ADMIN ONLY --- */}
          <Route 
            path="/admin" 
            element={
              <ProtectedRoute allowedRoles={["ADMIN"]}>
                <AdminDashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin-analytics" 
            element={
              <ProtectedRoute allowedRoles={["ADMIN"]}>
                <AdminAnalytics />
              </ProtectedRoute>
            } 
          />

          {/* --- 🏢 SELLER ONLY --- */}
          <Route 
            path="/seller" 
            element={
              <ProtectedRoute allowedRoles={["SELLER"]}>
                <SellerDashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/add-product" 
            element={
              <ProtectedRoute allowedRoles={["SELLER"]}>
                <AddProduct />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/update-product/:id" 
            element={
              <ProtectedRoute allowedRoles={["SELLER"]}>
                <UpdateProduct />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/seller-analytics" 
            element={
              <ProtectedRoute allowedRoles={["SELLER"]}>
                <SellerAnalytics />
              </ProtectedRoute>
            } 
          />

          {/* --- 👤 USER ONLY --- */}
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute allowedRoles={["USER"]}>
                <Dashboard />
              </ProtectedRoute>
            } 
          />

          <Route path="/compare/:id1/:id2" element={<Compare />} />

          <Route path="/admin/approve-products" element={<ApproveProducts />} />
<Route path="/admin/carbon-reports" element={<CarbonReports />} />
<Route path="/admin/eco-leaderboard" element={<EcoLeaderboard />} />

<Route path="/forgot-password" element={<ForgotPassword />} />

        </Routes>
      </LayoutHandler>
    </BrowserRouter>
  );
}

export default App;
