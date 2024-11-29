import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from './context/AuthContext';
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import ProfilePage from "./pages/ProfilePage";
import ProductsPage from "./pages/ProductsPage";
import AddProductPage from "./pages/AddProductPage";
import Navbar from "./components/Navbar";
import DeliveryDashboard from "./pages/DeliveryDashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import OrdersPage from "./pages/OrdersPage";
import TransactionsPage from "./pages/TransactionsPage";

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route 
          path="/profile" 
          element={
            <ProtectedRoute allowedRoles={['Buyer', 'Seller', 'Middleman', 'DeliveryAdmin']}>
              <ProfilePage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/orders" 
          element={
            <ProtectedRoute allowedRoles={['Buyer', 'Seller', 'Middleman']}>
              <OrdersPage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/deliveries" 
          element={
            <ProtectedRoute allowedRoles={['DeliveryAdmin']}>
              <DeliveryDashboard />
            </ProtectedRoute>
          } 
        />
        <Route path="/products" element={<ProductsPage />} />
        <Route 
          path="/add-product" 
          element={
            <ProtectedRoute allowedRoles={['Seller']}>
              <AddProductPage />
            </ProtectedRoute>
          } 
        />
        <Route path="/transactions" element={<TransactionsPage />} />
      </Routes>
    </>
  );
}

export default App;

