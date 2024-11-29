import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import '../styles/OrdersPage.css';

function OrdersPage() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [tracks, setTracks] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [otpInput, setOtpInput] = useState('');
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [showConfirmTake, setShowConfirmTake] = useState(false);
  const [currentOrderDetails, setCurrentOrderDetails] = useState(null);
  const [activeGiveOrderId, setActiveGiveOrderId] = useState(null);
  const [giverOtpInput, setGiverOtpInput] = useState('');
  const [activeGiveOrder, setActiveGiveOrder] = useState(null);
  const [generatedOtp, setGeneratedOtp] = useState(null);

  const fetchOrders = async () => {
    try {
        console.log('going to fetch orders');
      const response = await fetch('http://localhost:3000/order/orders_to_deliver', {
        credentials: 'include'
      });
      const data = await response.json();
      console.log('data: ',data);
      if (data.success) {
        setOrders(data.data);
        // Fetch track details for each order
        data.data.forEach(order => fetchTrackDetails(order.order));
      } else {
        setError(data.message);
      }
    } catch (error) {
      setError('Error fetching orders');
    } finally {
      setLoading(false);
    }
  };

  const fetchTrackDetails = async (orderId) => {
    try {
      const response = await fetch('http://localhost:3000/order/getTrack', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ orderId })
      });
      const data = await response.json();
      if (data.success) {
        setTracks(prev => ({
          ...prev,
          [orderId]: data.data
        }));
      }
    } catch (error) {
      console.error('Error fetching track details:', error);
    }
  };

  const handleTake = async (orderId) => {
    try {
      const response = await fetch('http://localhost:3000/order/verifyTransaction', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          orderId,
          transactionType: 'take'
        })
      });

      const data = await response.json();
      if (data.success) {
        alert('Order taken successfully!');
        fetchOrders(); // Refresh orders
      } else {
        alert(data.message || 'Failed to take order');
      }
    } catch (error) {
      console.error('Error taking order:', error);
      alert('Failed to take order');
    }
  };

  const handleGive = async (orderId) => {
    try {
      const response = await fetch('http://localhost:3000/order/generateTransferOTP', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ orderId })
      });

      const data = await response.json();
      console.log('otp generation response: ',data);
      if (data.success) {
        setShowOtpInput(true);
        fetchOrders(); // Refresh to show OTP to next person
      }
    } catch (error) {
      alert('Failed to initiate transfer');
    }
  };

  const handleOtpSubmit = async (orderId) => {
    try {
      const response = await fetch('http://localhost:3000/order/verifyTransferOTP', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ orderId, otp: otpInput })
      });

      const data = await response.json();
      if (data.success) {
        setShowOtpInput(false);
        setShowConfirmTake(true);
        setCurrentOrderDetails(data.data.order);
      }
    } catch (error) {
      alert('Failed to verify OTP');
    }
  };

  const handleConfirmTake = async (orderId) => {
    await handleTake(orderId);
    setShowConfirmTake(false);
    setCurrentOrderDetails(null);
  };

  const canTake = (order) => {
    const track = tracks[order.order];
    if (!track) return false;

    switch(user.category) {
      case 'Seller':
        return !order.recieve_status && track[0].owner === user._id;
      case 'Middleman':
        const userTrackIndex = track.findIndex(t => t.owner === user._id);
        const previousTrack = track[userTrackIndex - 1];
        return previousTrack?.give_status && !order.recieve_status;
      case 'Buyer':
        return !order.recieve_status && track[track.length - 1].owner === user._id;
      default:
        return false;
    }
  };

  const canGive = (order, role) => {
    switch (role) {
      case 'Seller':
        return !order.give_status;
      case 'Middleman':
        return order.recieve_status && !order.give_status;
      case 'Buyer':
        return false;
      default:
        return false;
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  if (loading) return <div className="loading">Loading orders...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="orders-page">
      <h2>My Orders</h2>
      <div className="orders-grid">
        {orders.map(order => {
          const track = tracks[order.order];
          const currentTrack = track?.find(t => t.owner === user._id);
          
          return (
            <div key={order.order} className="order-card">
              <h3>Order #{order.order.slice(-6)}</h3>
              
              <div className="status-section">
                <p>Receive Status: {order.recieve_status ? '✅' : '❌'}</p>
                <p>Give Status: {order.give_status ? '✅' : '❌'}</p>
              </div>

              {track && (
                <div className="track-details">
                  <h4>Track Details:</h4>
                  {track.map((t, index) => (
                    <div key={index} className={`track-step ${t.owner === user._id ? 'current' : ''}`}>
                      <p>Owner: {t.owner === user._id ? 'You' : `User ${t.owner.slice(-6)}`}</p>
                      <p>Receive: {t.recieve_status ? '✅' : '❌'}</p>
                      <p>Give: {t.give_status ? '✅' : '❌'}</p>
                    </div>
                  ))}
                  {/* Show OTP if it exists and not expired */}
                  {order.transfer_otp && currentTrack && !currentTrack.recieve_status && console.log('satisfied')&& (
                    <div className="otp-info">
                      <p>Transfer OTP: {order.transfer_otp.code}</p>
                      <p className="otp-expiry">
                        Valid until: {new Date(order.transfer_otp.generatedAt).toLocaleTimeString()}
                        (15 min)
                      </p>
                    </div>
                  )}
                </div>
              )}

              <div className="action-buttons">
                {canTake(order) && (
                  <button 
                    className="take-button"
                    onClick={() => handleTake(order.order)}
                  >
                    Take
                  </button>
                )}
                {canGive(order, user.category) && (
                  <button 
                    className="give-button"
                    onClick={() => handleGive(order.order)}
                  >
                    Give
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default OrdersPage; 