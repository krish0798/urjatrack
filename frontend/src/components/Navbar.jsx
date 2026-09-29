import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function BrandMark() {
  return (
    <span className="brand-mark" aria-hidden="true">
      <span /><span /><span />
    </span>
  );
}

export default function Navbar() {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50,
      background: 'rgba(8,8,13,.58)', backdropFilter: 'blur(18px)',
      borderBottom: '1px solid rgba(255,255,255,.06)',
    }}>
      <div style={{
        width: 'min(100% - 48px, 1120px)', height: '78px', margin: '0 auto',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <Link className="wordmark" to="/" aria-label="UrjaTrack home">
          <BrandMark /><span>urjatrack</span>
        </Link>

        <div className="nav-actions">
          {isAuthenticated ? (
            <>
              <Link to="/profile" className="login-link">Dashboard</Link>
              <Link to="/history" className="login-link">History</Link>
              <button onClick={handleLogout} className="signup-link" style={{ background: 'none', border: '1px solid rgba(255,255,255,.16)', fontSize: '14px' }}>
                Log out
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="login-link">Log in</Link>
              <Link to="/signup" className="signup-link">Start tracking <span>↗</span></Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
