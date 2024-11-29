import { Link, useNavigate } from "react-router-dom";
import "../styles/Navbar.css";
import { useAuth } from '../context/AuthContext';

function Navbar() {
  const { user, checkAuth } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const response = await fetch('http://localhost:3000/auth/logout', {
        credentials: 'include'
      });
      await checkAuth();
      navigate('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <nav className="navbar">
      <Link to="/" className="nav-logo">
        Supply Chain
      </Link>
      <div className="nav-links">
        <Link to="/" className="nav-link">Home</Link>
        {user && ['Buyer', 'Seller', 'Middleman'].includes(user.category) && (
          <Link to="/orders" className="nav-link">My Orders</Link>
        )}
        {user && user.category === 'DeliveryAdmin' && (
          <Link to="/deliveries" className="nav-link">Delivery Dashboard</Link>
        )}
        {user && user.category === 'Seller' && (
          <Link to="/add-product" className="nav-link">Add Product</Link>
        )}
        {user ? (
          <>
            <Link to="/profile" className="nav-link">Profile</Link>
            {user.category === 'Buyer' && (
              <Link to="/products" className="nav-link">Browse Products</Link>
            )}
            {user.category === 'Seller' && (
              <>
                <Link to="/products" className="nav-link">My Products</Link>
                <Link to="/add-product" className="nav-link">Add Product</Link>
              </>
            )}
            <button onClick={handleLogout} className="nav-btn">Logout</button>
          </>
        ) : (
          <>
            <Link to="/login" className="nav-link">Login</Link>
            <Link to="/signup" className="nav-link">Signup</Link>
          </>
        )}
        <Link to="/transactions">Transactions</Link>
      </div>
    </nav>
  );
}

export default Navbar; 