import { useAuth } from '../context/AuthContext';
import "../styles/ProfilePage.css";

function ProfilePage() {
  const { user } = useAuth();

  if (!user) return <div className="loading">Loading...</div>;

  return (
    <div className="profile-container">
      <div className="profile-card">
        <div className="profile-header">
          <img src="https://via.placeholder.com/150" alt="Profile" className="profile-avatar" />
          <h2>{user.name}</h2>
          <span className={`role-badge ${user.category.toLowerCase()}`}>
            {user.category}
          </span>
        </div>
        
        <div className="profile-details">
          <div className="detail-item">
            <span className="detail-label">Username</span>
            <span className="detail-value">{user.username}</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">Email</span>
            <span className="detail-value">{user.email}</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">City</span>
            <span className="detail-value">{user.city}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;
