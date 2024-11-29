import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import '../styles/DeliveryDashboard.css';

function DeliveryDashboard() {
  const { user } = useAuth();
  const [queuedOrders, setQueuedOrders] = useState([]);
  const [orderDetails, setOrderDetails] = useState({});
  const [middlemen, setMiddlemen] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [selectedMiddlemen, setSelectedMiddlemen] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchQueuedOrders();
    fetchMiddlemen();
  }, []);

  const fetchOrderDetails = async (orderId) => {
    try {
      const response = await fetch(`http://localhost:3000/order/${orderId}`, {
        credentials: 'include'
      });
      const data = await response.json();
      if (data.success) {
        setOrderDetails(prev => ({
          ...prev,
          [orderId]: data.data
        }));
      }
    } catch (error) {
      console.error('Error fetching order details:', error);
    }
  };

  const fetchQueuedOrders = async () => {
    try {
      const response = await fetch('http://localhost:3000/order/orders_in_queue', {
        credentials: 'include'
      });
      const data = await response.json();
      if (data.success) {
        setQueuedOrders(data.data);
        console.log(data.data);
        console.log(queuedOrders);
        // Fetch details for each order
        // data.data.forEach(orderId => fetchOrderDetails(orderId));
      } else {
        setError(data.message);
      }
    } catch (error) {
      setError('Error fetching orders');
    }
  };

  const fetchMiddlemen = async () => {
    try {
      const response = await fetch('http://localhost:3000/order/getMiddlemen', {
        credentials: 'include'
      });
      const data = await response.json();
      console.log(data.data);
      if (data.success) {
        setMiddlemen(data.data);
      }
    } catch (error) {
      setError('Error fetching middlemen');
    } finally {
      setLoading(false);
    }
  };

  const handleMiddlemanSelect = (middlemanId) => {
    setSelectedMiddlemen(prev => {
      if (prev.includes(middlemanId)) {
        return prev.filter(id => id !== middlemanId);
      }
      return [...prev, middlemanId];
    });
  };

  const handleCreateTrack = async () => {
    if (!selectedOrder || selectedMiddlemen.length === 0) {
      alert('Please select an order and at least one middleman');
      return;
    }

    try {
      const response = await fetch('http://localhost:3000/order/addTrack', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          orderId: selectedOrder,
          middlemen: selectedMiddlemen
        })
      });

      const data = await response.json();
      if (data.success) {
        alert('Track created successfully!');
        setSelectedOrder(null);
        setSelectedMiddlemen([]);
        fetchQueuedOrders();
      } else {
        setError(data.message);
      }
    } catch (error) {
      setError('Failed to create track');
    }
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="delivery-dashboard">
      <h2>Delivery Admin Dashboard</h2>
      
      <div className="orders-section">
        <h3>Orders in Queue</h3>
        <div className="orders-grid">
          {queuedOrders.map(orderId => {
            // const order = orderDetails[orderId];
            // if (!order) return null;
            
            return (
              <div 
                key={orderId} 
                className={`order-card ${selectedOrder === orderId ? 'selected' : ''}`}
                onClick={() => setSelectedOrder(orderId)}
              >
                <h4>Order #{orderId}</h4>
                {/* <p>Product: {order.product?.name || 'Loading...'}</p>
                <p>Quantity: {order.quantity || 'Loading...'}</p>
                <p>Buyer: {order.buyer?.name || 'Loading...'}</p>
                <p>Seller: {order.seller?.name || 'Loading...'}</p> */}
              </div>
            );
          })}
        </div>
      </div>

      {selectedOrder && (
        <div className="middlemen-section">
          <h3>Select Middlemen</h3>
          <div className="middlemen-grid">
            {middlemen.map(middleman => (
              <div 
                key={middleman._id}
                className={`middleman-card ${selectedMiddlemen.includes(middleman._id) ? 'selected' : ''}`}
                onClick={() => handleMiddlemanSelect(middleman._id)}
              >
                <h4>{middleman.name}</h4>
                <p>{middleman.email}</p>
              </div>
            ))}
          </div>
          <button 
            className="create-track-btn"
            onClick={handleCreateTrack}
            disabled={selectedMiddlemen.length === 0}
          >
            Create Track
          </button>
        </div>
      )}
    </div>
  );
}

export default DeliveryDashboard; 