import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import * as api from '../api/api';

function formatCurrency(n) {
  if (n == null) return '—';
  return '₹' + n.toLocaleString('en-IN', { maximumFractionDigits: 2 });
}

function formatDate(dateStr) {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

export default function History() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [cycles, setCycles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isAuthenticated) {
      // Clear any cached user data immediately on logout
      setCycles([]);
      setError('');
      setLoading(false);
      navigate('/');
      return;
    }
    const fetchHistory = async () => {
      setLoading(true);
      try {
        const data = await api.getCycleHistory();
        setCycles(Array.isArray(data) ? data : []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, [isAuthenticated]);

  return (
    <div className="dash-shell" style={{ background: 'radial-gradient(ellipse at 50% 0%, #17111d 0%, #08080d 48%, #08080d 100%)' }}>
      <div className="dash-content">
        <div style={{ marginBottom: '40px' }}>
          <p className="section-eyebrow" style={{ marginBottom: '12px' }}>Your past cycles</p>
          <h2 style={{ fontSize: 'clamp(32px, 4vw, 48px)', letterSpacing: '-2px' }}>
            Billing <span>history.</span>
          </h2>
        </div>

        {loading && <p style={{ color: 'var(--muted)', textAlign: 'center' }}>Loading history...</p>}
        {error && <div className="auth-error" style={{ maxWidth: '600px' }}>{error}</div>}

        {!loading && cycles.length === 0 && !error && (
          <div className="stat-card" style={{ textAlign: 'center', padding: '48px 24px' }}>
            <p style={{ color: 'var(--muted)', fontSize: '15px', marginBottom: '16px' }}>No billing cycles found yet.</p>
            <a href="/profile" className="button button-primary" style={{ display: 'inline-flex' }}>
              Start your first cycle <span>↗</span>
            </a>
          </div>
        )}

        {!loading && cycles.length > 0 && (
          <div style={{ display: 'grid', gap: '14px' }}>
            {cycles.map((cycle) => {
              const units = cycle.cycleStartReading != null ? '—' : '—';
              return (
                <div className="step-card" key={cycle.id} style={{ minHeight: 'auto', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr auto', gap: '20px', alignItems: 'center' }}>
                  <div>
                    <span className="step-number">{cycle.status}</span>
                    <h3 style={{ margin: '8px 0 4px', fontSize: '17px' }}>
                      {formatDate(cycle.startDate)} → {formatDate(cycle.endDate)}
                    </h3>
                  </div>
                  <div>
                    <p className="mockup-kicker" style={{ marginBottom: '4px' }}>START READING</p>
                    <strong style={{ color: '#f1eef2', fontSize: '20px', letterSpacing: '-1px' }}>
                      {cycle.cycleStartReading?.toFixed(1) ?? '—'} <small style={{ color: '#a9a4b0', fontSize: '11px', fontWeight: 400 }}>kWh</small>
                    </strong>
                  </div>
                  <div>
                    <p className="mockup-kicker" style={{ marginBottom: '4px' }}>STATUS</p>
                    <span style={{
                      display: 'inline-block',
                      padding: '4px 12px',
                      borderRadius: '999px',
                      fontSize: '11px',
                      fontWeight: 600,
                      letterSpacing: '.5px',
                      background: cycle.status === 'ACTIVE'
                        ? 'rgba(255,214,10,.12)'
                        : 'rgba(255,255,255,.05)',
                      color: cycle.status === 'ACTIVE'
                        ? 'var(--yellow)'
                        : 'var(--muted)',
                      border: `1px solid ${cycle.status === 'ACTIVE' ? 'rgba(255,214,10,.25)' : 'rgba(255,255,255,.08)'}`,
                    }}>
                      {cycle.status}
                    </span>
                  </div>
                  <span className="step-arrow" style={{ position: 'static' }}>↗</span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
