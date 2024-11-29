import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import '../styles/TransactionsPage.css';

function TransactionsPage() {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [otpInputs, setOtpInputs] = useState({});
  const [confirmedOtps, setConfirmedOtps] = useState({});

  const handleOtpChange = (orderId, value) => {
    setOtpInputs(prev => ({
      ...prev,
      [orderId]: value
    }));
  };

  const handleVerifyOtp = async (orderId) => {
    try {
      const response = await fetch('http://localhost:3000/order/verifyTransferOTP', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ 
          orderId, 
          otp: otpInputs[orderId] 
        })
      });

      const data = await response.json();
      if (data.success) {
        setConfirmedOtps(prev => ({
          ...prev,
          [orderId]: true
        }));
        fetchTransactions();
        setOtpInputs(prev => {
          const newInputs = { ...prev };
          delete newInputs[orderId];
          return newInputs;
        });
      } else {
        alert(data.message || 'Failed to verify OTP');
      }
    } catch (error) {
      alert('Failed to verify OTP');
    }
  };

  const handleConfirmTransaction = async (orderId) => {
    try {
      const response = await fetch('http://localhost:3000/order/verifyTransaction', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          orderId,
          transactionType: 'take'
        })
      });

      const data = await response.json();
      if (data.success) {
        setConfirmedOtps(prev => {
          const newConfirmed = { ...prev };
          delete newConfirmed[orderId];
          return newConfirmed;
        });
        fetchTransactions();
      } else {
        alert(data.message || 'Failed to complete transaction');
      }
    } catch (error) {
      alert('Failed to complete transaction');
    }
  };

  const fetchTransactions = async () => {
    try {
      const response = await fetch('http://localhost:3000/order/orders_to_deliver', {
        credentials: 'include'
      });
      const data = await response.json();
      console.log('data in fetchTransactions: ',data);
      
      if (data.success) {
        // Fetch transaction details for each order
        const transactionPromises = data.data.map(order => 
          fetch(`http://localhost:3000/order/transactions/${order.order}`, {
            credentials: 'include'
          }).then(res => res.json())
        );
        
        const transactionResults = await Promise.all(transactionPromises);
        const validTransactions = transactionResults
          .filter(t => t.success)
          .map(t => t.data);
        
        setTransactions(validTransactions);
      }
    } catch (error) {
      setError('Error fetching transactions');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
    // Refresh every minute to update remaining time
    const interval = setInterval(fetchTransactions, 60000);
    return () => clearInterval(interval);
  }, []);

  const calculateTimeRemaining = (generatedAt) => {
    const timeElapsed = (new Date() - new Date(generatedAt)) / 1000 / 60;
    const timeRemaining = Math.max(0, 15 - timeElapsed);
    return Math.round(timeRemaining);
  };

  if (loading) return <div className="loading">Loading transactions...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="transactions-page">
      <h2>Order Transactions</h2>
      <div className="transactions-grid">
        {transactions.map(transaction => {
          const userTrack = transaction.track.find(t => t.owner.toString() === user._id);
          const canGive = userTrack?.recieve_status && !userTrack?.give_status;
          const isNextReceiver = transaction.currentOtp?.forTrackIndex === 
            transaction.track.findIndex(t => t.owner.toString() === user._id);

          return (
            <div key={transaction.orderId} className="transaction-card">
              <h3>Order #{transaction.orderId.slice(-6)}</h3>
              <p>Product: {transaction.productName}</p>
              
              {/* Show OTP if not verified */}
              {transaction.currentOtp && 
                !transaction.currentOtp.isVerified &&
                isNextReceiver && 
                !confirmedOtps[transaction.orderId] && 
                calculateTimeRemaining(transaction.currentOtp.generatedAt) > 0 && (
                  <div className="otp-details">
                    <p>Current OTP: {transaction.currentOtp.code}</p>
                    <p className="time-remaining">
                      Time Remaining: {calculateTimeRemaining(transaction.currentOtp.generatedAt)} minutes
                    </p>
                  </div>
              )}

              {/* Show confirm button if OTP is verified */}
              {transaction.currentOtp?.isVerified && isNextReceiver && (
                <div className="confirm-section">
                  <p className="otp-verified">✅ OTP Verified</p>
                  <button 
                    onClick={() => handleConfirmTransaction(transaction.orderId)}
                    className="confirm-button"
                  >
                    Confirm Take
                  </button>
                </div>
              )}

              {/* Show OTP input if user can give */}
              {canGive && (
                <div className="otp-input-section">
                  <input
                    type="text"
                    placeholder="Enter OTP from receiver"
                    value={otpInputs[transaction.orderId] || ''}
                    onChange={(e) => handleOtpChange(transaction.orderId, e.target.value)}
                    className="otp-input"
                  />
                  <button 
                    onClick={() => handleVerifyOtp(transaction.orderId)}
                    className="verify-button"
                  >
                    Verify OTP
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default TransactionsPage; 