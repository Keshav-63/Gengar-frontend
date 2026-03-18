import { useCallback, useEffect, useMemo, useState } from 'react';
import { Copy, ExternalLink, Link2 } from 'lucide-react';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import { getShares, revokeShare } from '../api/sharing';
import { createShortURL, deleteShortURL, getShortURLStats } from '../api/shortUrls';
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
  const [shortLinks, setShortLinks] = useState<Record<string, string>>({});
  const [shortStats, setShortStats] = useState<Record<string, number>>({});
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

  const createShortLink = useCallback(
    async (shareId: string) => {
      try {
        const shortUrl = await createShortURL({ share_id: shareId });
        setShortLinks((prev) => ({ ...prev, [shareId]: shortUrl.short_url }));
        addToast('Short URL created', 'success');
      } catch {
        addToast('Failed to create short URL', 'error');
      }
    },
    [addToast]
  );

  const loadShortStats = useCallback(
    async (shortUrl: string) => {
      try {
        const shortCode = shortUrl.split('/').pop();
        if (!shortCode) {
          return;
        }
        const stats = await getShortURLStats(shortCode);
        setShortStats((prev) => ({ ...prev, [shortCode]: stats.click_count }));
      } catch {
        addToast('Failed to load short URL stats', 'error');
      }
    },
    [addToast]
  );

  const removeShortLink = useCallback(
    async (shareId: string, shortUrl: string) => {
      try {
        const shortCode = shortUrl.split('/').pop();
        if (!shortCode) {
          return;
        }
        await deleteShortURL(shortCode);
        setShortLinks((prev) => {
          const next = { ...prev };
          delete next[shareId];
          return next;
        });
        addToast('Short URL deleted', 'success');
      } catch {
        addToast('Failed to delete short URL', 'error');
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
                  <button onClick={() => createShortLink(share.id)} className="shared-action-btn" title="Create short URL">
                    Short URL
                  </button>
                </div>

                {shortLinks[share.id] && (
                  <div className="shared-short-row">
                    <span className="shared-item-url">{shortLinks[share.id]}</span>
                    <button
                      onClick={() => loadShortStats(shortLinks[share.id])}
                      className="shared-action-btn"
                      title="Load short URL stats"
                    >
                      Stats
                    </button>
                    <button
                      onClick={() => removeShortLink(share.id, shortLinks[share.id])}
                      className="shared-action-btn danger"
                      title="Delete short URL"
                    >
                      Delete
                    </button>
                    <span className="shared-item-meta">
                      Clicks: {shortStats[shortLinks[share.id].split('/').pop() || ''] ?? 0}
                    </span>
                  </div>
                )}
              </article>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};
