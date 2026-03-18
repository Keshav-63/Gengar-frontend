import { useCallback, useEffect, useMemo, useState } from 'react';
import { Copy, ExternalLink, Link2 } from 'lucide-react';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import { getShares, revokeShare } from '../api/sharing';
import { formatDate } from '../utils/formatters';
import { useUIStore } from '../store/uiStore';
import { ShareResponse } from '../types';
import './Shared.css';

const normalizeShares = (payload: any): ShareResponse[] => {
  if (Array.isArray(payload)) {
    return payload;
  }

  if (Array.isArray(payload?.shares)) {
    return payload.shares;
  }

  return [];
};

export const Shared = () => {
  const [shares, setShares] = useState<ShareResponse[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { addToast } = useUIStore();

  const fetchShares = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await getShares();
      setShares(normalizeShares(response));
    } catch {
      addToast('Failed to load shared links', 'error');
    } finally {
      setIsLoading(false);
    }
  }, [addToast]);

  useEffect(() => {
    fetchShares();
  }, [fetchShares]);

  const activeShares = useMemo(() => shares.filter((share) => share.is_active), [shares]);

  const copyShare = useCallback(
    async (shareUrl: string) => {
      try {
        await navigator.clipboard.writeText(shareUrl);
        addToast('Share link copied', 'success');
      } catch {
        addToast('Failed to copy share link', 'error');
      }
    },
    [addToast]
  );

  const revoke = useCallback(
    async (shareId: string) => {
      try {
        await revokeShare(shareId);
        setShares((prev) => prev.map((share) => (share.id === shareId ? { ...share, is_active: false } : share)));
        addToast('Share revoked', 'success');
      } catch {
        addToast('Failed to revoke share', 'error');
      }
    },
    [addToast]
  );

  return (
    <DashboardLayout>
      <div className="shared-page">
        <div className="shared-header">
          <h1 className="shared-title">Shared Links</h1>
          <p className="shared-subtitle">Manage your active file and folder shares</p>
        </div>

        {isLoading ? (
          <p className="shared-empty">Loading shares...</p>
        ) : activeShares.length === 0 ? (
          <div className="shared-empty-card">
            <Link2 size={30} />
            <p className="shared-empty">No active shares yet.</p>
          </div>
        ) : (
          <div className="shared-list">
            {activeShares.map((share) => (
              <article key={share.id} className="shared-item">
                <div className="shared-item-main">
                  <h3 className="shared-item-title">{share.resource_type.toUpperCase()} • {share.permission}</h3>
                  <p className="shared-item-url">{share.share_url}</p>
                  <p className="shared-item-meta">
                    Created {formatDate(share.created_at)} • Accesses {share.access_count}
                  </p>
                </div>

                <div className="shared-item-actions">
                  <button onClick={() => copyShare(share.share_url)} className="shared-action-btn" title="Copy link">
                    <Copy size={16} />
                  </button>
                  <button
                    onClick={() => window.open(share.share_url, '_blank', 'noopener,noreferrer')}
                    className="shared-action-btn"
                    title="Open link"
                  >
                    <ExternalLink size={16} />
                  </button>
                  <button onClick={() => revoke(share.id)} className="shared-action-btn danger" title="Revoke">
                    Revoke
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};
