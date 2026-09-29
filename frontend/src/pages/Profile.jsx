import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import SlabGuard from '../components/SlabGuard';

export default function Profile() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated]);

  return (
    <div className="dash-shell" style={{ background: 'radial-gradient(ellipse at 50% 0%, #17111d 0%, #08080d 48%, #08080d 100%)' }}>
      <div className="dash-content">
        <SlabGuard mode="live" />
      </div>
    </div>
  );
}
