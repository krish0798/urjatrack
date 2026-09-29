import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import * as api from '../api/api';

/**
 * SlabGuard — the core dashboard component.
 *
 * Usage modes:
 *   <SlabGuard />                      — auto-detects auth, live data if logged in, lock modal if not
 *   <SlabGuard mode="live" />          — force live (used on /profile)
 *   <SlabGuard mode="preview" />       — force preview/locked (for testing)
 */

function formatCurrency(n) {
  if (n == null) return '—';
  return '₹' + n.toLocaleString('en-IN', { maximumFractionDigits: 2 });
}

// ── Lock Modal ──
function LockModal({ onClose }) {
  return (
    <div className="lock-overlay" onClick={onClose}>
      <div className="lock-modal" onClick={(e) => e.stopPropagation()}>
        <div className="lock-icon">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--yellow)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
          </svg>
        </div>
        <h3>Sign up to track your slab</h3>
        <p>Create a free account to start logging meter readings, predict your monthly bill, and get slab guard alerts.</p>
        <Link to="/signup" className="button button-primary" style={{ width: '100%', justifyContent: 'center', marginTop: '8px' }}>
          Create free account <span>↗</span>
        </Link>
        <button className="lock-dismiss" onClick={onClose}>Maybe later</button>
      </div>
    </div>
  );
}

// ── Start Cycle Form ──
function StartCycleCard({ onStarted }) {
  const [reading, setReading] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleStart = async (e) => {
    e.preventDefault();
    if (!reading) return;
    setLoading(true);
    setError('');
    try {
      await api.startCycle(parseFloat(reading));
      onStarted?.();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ textAlign: 'center', padding: '40px 0' }}>
      <p className="mockup-kicker" style={{ marginBottom: '16px' }}>NO ACTIVE CYCLE</p>
      <h3 style={{ marginBottom: '8px' }}>Start a billing cycle</h3>
      <p style={{ color: '#8f8a98', fontSize: '14px', marginBottom: '28px' }}>
        Enter your current meter reading to begin tracking this month's consumption.
      </p>
      {error && <div className="auth-error">{error}</div>}
      <form onSubmit={handleStart} style={{ display: 'flex', gap: '10px', maxWidth: '400px', margin: '0 auto' }}>
        <input
          type="number"
          step="0.01"
          value={reading}
          onChange={(e) => setReading(e.target.value)}
          placeholder="Current meter reading (kWh)"
          className="form-input"
          required
          style={{ flex: 1 }}
        />
        <button type="submit" disabled={loading} className="form-submit" style={{ width: 'auto', padding: '14px 24px', marginTop: 0 }}>
          {loading ? '...' : 'Start'}
        </button>
      </form>
    </div>
  );
}

// ── Log Reading Form ──
function LogReadingForm({ onLogged, locked, onLockTrigger }) {
  const [reading, setReading] = useState('');
  const [note, setNote] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleLog = async (e) => {
    e.preventDefault();
    if (locked) { onLockTrigger(); return; }
    if (!reading) return;
    setLoading(true);
    setError('');
    setSuccess(false);
    try {
      await api.logReading(parseFloat(reading), note || null);
      setSuccess(true);
      setReading('');
      setNote('');
      onLogged?.();
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="stat-card" style={{ gridColumn: 'span 3' }}>
      <p>LOG TODAY'S READING</p>
      {error && <div className="auth-error" style={{ marginTop: '8px' }}>{error}</div>}
      {success && <div style={{ marginTop: '8px', padding: '10px', borderRadius: '8px', background: 'rgba(34,197,94,.1)', border: '1px solid rgba(34,197,94,.2)', color: '#22c55e', fontSize: '13px' }}>Reading logged successfully!</div>}
      <form onSubmit={handleLog} style={{ display: 'flex', gap: '10px', marginTop: '12px', alignItems: 'flex-end' }}>
        <div style={{ flex: 1 }}>
          <label className="form-label" style={{ marginBottom: '6px' }}>Meter Reading</label>
          <input
            type="number"
            step="0.01"
            value={reading}
            onChange={(e) => setReading(e.target.value)}
            placeholder="e.g. 3450"
            className="form-input"
            onFocus={locked ? onLockTrigger : undefined}
            readOnly={locked}
          />
        </div>
        <div style={{ flex: 1 }}>
          <label className="form-label" style={{ marginBottom: '6px' }}>Note (optional)</label>
          <input
            type="text"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="e.g. after washing"
            className="form-input"
            onFocus={locked ? onLockTrigger : undefined}
            readOnly={locked}
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="form-submit"
          style={{ width: 'auto', padding: '14px 24px', marginTop: 0, whiteSpace: 'nowrap' }}
        >
          {loading ? '...' : 'Log Reading'}
        </button>
      </form>
    </div>
  );
}

// ── SlabGuard Main Component ──
export default function SlabGuard({ mode }) {
  const { isAuthenticated } = useAuth();
  const isLive = mode === 'live' || (!mode && isAuthenticated);
  const isLocked = !isLive;

  const [projection, setProjection] = useState(null);
  const [noActiveCycle, setNoActiveCycle] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showLockModal, setShowLockModal] = useState(false);

  const fetchData = async () => {
    // Double-check: never fetch if not authenticated — prevents stale-token leaks
    if (!isAuthenticated) return;
    setLoading(true);
    setError('');
    try {
      const data = await api.getActiveCycle();
      setProjection(data);
      setNoActiveCycle(false);
    } catch (err) {
      if (err.message?.includes('No active') || err.message?.includes('404') || err.message?.includes('not found')) {
        setNoActiveCycle(true);
      } else {
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  // When auth state changes: fetch if live, CLEAR all cached data if not
  useEffect(() => {
    if (isLive) {
      fetchData();
    } else {
      // Immediately purge any real user data from React state on logout
      setProjection(null);
      setNoActiveCycle(false);
      setLoading(false);
      setError('');
    }
  }, [isLive, isAuthenticated]);

  const triggerLock = () => setShowLockModal(true);

  // Data for preview mode (fake data when logged out)
  const previewData = {
    unitsConsumedSoFar: 218,
    projectedTotalUnits: 654,
    estimatedBill: 2486,
    daysRemaining: 12,
    currentSlab: { fromUnit: 100, toUnit: 300, ratePerUnit: 10.29 },
    projectedSlab: { fromUnit: 300, toUnit: 500, ratePerUnit: 14.55 },
    recommendation: 'You are on track to enter a costlier slab. Limit usage to 7.2 units/day for the next 12 days to stay in your current slab.',
  };

  const data = isLive ? projection : previewData;
  const showNoActiveCycle = isLive && noActiveCycle;

  return (
    <>
      {showLockModal && <LockModal onClose={() => setShowLockModal(false)} />}

      <div className="mockup-shell" style={{ animation: 'rise .6s ease both', cursor: isLocked ? 'default' : undefined }}>
        <div className="mockup-topbar">
          <div className="mockup-brand">
            <span className="brand-mark" aria-hidden="true"><span /><span /><span /></span>
            {' '}urjatrack
          </div>
          <div className="mockup-top-actions">
            <span>Overview</span>
            <span className="avatar">U</span>
          </div>
        </div>

        <div className="mockup-content">
          {loading && (
            <p style={{ color: 'var(--muted)', textAlign: 'center', padding: '40px 0' }}>Loading your data...</p>
          )}

          {error && <div className="auth-error" style={{ marginBottom: '16px' }}>{error}</div>}

          {showNoActiveCycle && (
            <StartCycleCard onStarted={fetchData} />
          )}

          {!loading && !showNoActiveCycle && data && (
            <>
              <div className="mockup-heading-row">
                <div>
                  <p className="mockup-kicker">YOUR ENERGY OVERVIEW</p>
                  <h3>{isLive ? 'Active billing cycle' : 'Your energy overview'}</h3>
                </div>
                <span className="mockup-date">{data.daysRemaining} days left</span>
              </div>

              {/* Stats */}
              <div className="stat-grid" onClick={isLocked ? triggerLock : undefined}>
                <div className="stat-card featured">
                  <p>UNITS CONSUMED</p>
                  <strong>{data.unitsConsumedSoFar?.toFixed?.(1) ?? data.unitsConsumedSoFar} <small>kWh</small></strong>
                  <span className="positive">Current slab: {data.currentSlab ? `${data.currentSlab.fromUnit}–${data.currentSlab.toUnit ?? '∞'} @ ₹${data.currentSlab.ratePerUnit}` : '—'}</span>
                </div>
                <div className="stat-card">
                  <p>PROJECTED BILL</p>
                  <strong>{formatCurrency(data.estimatedBill)}</strong>
                  <span className="muted">Projected: {data.projectedTotalUnits?.toFixed?.(0) ?? data.projectedTotalUnits} kWh</span>
                </div>
                <div className="stat-card">
                  <p>PROJECTED SLAB</p>
                  <strong>{data.projectedSlab ? `${data.projectedSlab.fromUnit}–${data.projectedSlab.toUnit ?? '∞'}` : '—'}</strong>
                  <span className="muted">@ ₹{data.projectedSlab?.ratePerUnit ?? '—'}/unit</span>
                </div>
              </div>

              {/* Recommendation */}
              {data.recommendation && (
                <div className="chart-card" style={{ marginTop: '14px' }} onClick={isLocked ? triggerLock : undefined}>
                  <div className="chart-label">
                    <div>
                      <p>SLAB GUARD RECOMMENDATION</p>
                      <strong style={{ fontSize: '14px', lineHeight: '1.5', fontWeight: 400, color: '#d9d5df' }}>{data.recommendation}</strong>
                    </div>
                  </div>
                </div>
              )}

              {/* Log Reading */}
              <div className="stat-grid" style={{ marginTop: '14px' }}>
                <LogReadingForm onLogged={fetchData} locked={isLocked} onLockTrigger={triggerLock} />
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}
