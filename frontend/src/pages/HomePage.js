import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/HomePage.css';
import backgroundImage from '../assets/images/6.jpg';

function HomePage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  return (
    <div className="home-container" style={{ 
      backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url(${backgroundImage})`
    }}>
      <header className="home-header">
        <h1>Welcome to Our Platform</h1>
        <p>Connect with buyers, sellers, and service providers</p>
      </header>

      <section className="features-section">
        <div className="feature-card">
          <h3>For Buyers</h3>
          <p>Find and purchase products from verified sellers</p>
          {user?.category === 'Buyer' && (
            <Link to="/products" className="feature-link">Browse Products</Link>
          )}
        </div>
        <div className="feature-card">
          <h3>For Sellers</h3>
          <p>List and sell your products to a wide audience</p>
          {user?.category === 'Seller' && (
            <div className="seller-links">
              <Link to="/add-product" className="feature-link">Add Product</Link>
              <Link to="/products" className="feature-link">My Products</Link>
            </div>
          )}
        </div>
        <div className="feature-card">
          <h3>For Middlemen</h3>
          <p>Facilitate transactions between buyers and sellers</p>
          {user?.category === 'Middleman' && (
            <Link to="/transactions" className="feature-link">View Transactions</Link>
          )}
        </div>
        <div className="feature-card">
          <h3>For Delivery Admins</h3>
          <p>Manage and track deliveries efficiently</p>
          {user?.category === 'DeliveryAdmin' && (
            <Link to="/deliveries" className="feature-link">Manage Deliveries</Link>
          )}
        </div>
      </section>

      <section className="cta-section">
        {!user ? (
          <>
            <Link to="/signup" className="cta-button">Get Started</Link>
            <Link to="/login" className="cta-button secondary">Login</Link>
          </>
        ) : (
          <div className="quick-actions">
            <Link to="/profile" className="cta-button">My Profile</Link>
            {user.category === 'Buyer' && <Link to="/products" className="cta-button">Shop Now</Link>}
            {user.category === 'Seller' && <Link to="/add-product" className="cta-button">Add Product</Link>}
            {user && ['Buyer', 'Seller', 'Middleman'].includes(user.category) && (
              <button 
                className="orders-btn"
                onClick={() => navigate('/orders')}
              >
                View My Orders
              </button>
            )}
          </div>
        )}
      </section>
    </div>
  );
}

export default HomePage;
