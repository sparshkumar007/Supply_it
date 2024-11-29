import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import '../styles/ProductsPage.css';
import { Link } from 'react-router-dom';

function ProductsPage() {
  const { user } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [orderStatus, setOrderStatus] = useState({ loading: false, error: null });

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:3000/product/getProducts', {
        credentials: 'include'
      });
      const data = await response.json();
      if (data.success) {
        setProducts(data.data);
      } else {
        setError(data.message);
      }
    } catch (error) {
      setError('Error fetching products');
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleBuyProduct = async (productId) => {
    try {
      setOrderStatus({ loading: true, error: null });
      const response = await fetch('http://localhost:3000/order/addOrder', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          productId,
          quantity: 1
        })
      });

      const data = await response.json();
      if (data.success) {
        alert('Order placed successfully!');
        fetchProducts();
      } else {
        setOrderStatus({ loading: false, error: data.message });
      }
    } catch (error) {
      setOrderStatus({ loading: false, error: 'Failed to place order' });
      console.error('Order error:', error);
    }
  };

  if (loading) return <div className="loading">Loading products...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!products.length) return <div className="no-products">No products found</div>;

  return (
    <div className="products-container">
      <h2>{user.category === 'Seller' ? 'My Products' : 'Available Products'}</h2>
      {user.category === 'Seller' && (
        <Link to="/add-product" className="add-product-btn">Add New Product</Link>
      )}
      {orderStatus.error && (
        <div className="error-message">{orderStatus.error}</div>
      )}
      <div className="products-grid">
        {products.map(product => (
          <div key={product._id} className="product-card">
            <img src={product.image} alt={product.name} className="product-image" />
            <div className="product-info">
              <h3>{product.name}</h3>
              <p>{product.description}</p>
              <p className="price">₹{product.price}</p>
              {user.category === 'Buyer' && (
                <button 
                  className="buy-button"
                  onClick={() => handleBuyProduct(product._id)}
                  disabled={orderStatus.loading}
                >
                  {orderStatus.loading ? 'Processing...' : 'Buy Now'}
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ProductsPage; 