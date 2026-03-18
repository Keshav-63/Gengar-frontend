import { useCallback, useState } from 'react';
import * as sharingAPI from '../api/sharing';
import { ShareListResponse, ShareResponse } from '../types';

export const useSharing = () => {
  const [shares, setShares] = useState<ShareResponse[]>([]);
  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchShares = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response: ShareListResponse = await sharingAPI.getShares();
      const normalizedShares = Array.isArray(response?.shares) ? response.shares : [];
      setShares(normalizedShares);
      return normalizedShares;
    } catch (err: any) {
      const message = err.response?.data?.detail || err.message || 'Failed to fetch shares';
      setError(message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const createShare = useCallback(
    async (resourceType: 'file' | 'folder', resourceId: string, permission: 'view' | 'download' | 'edit' = 'view') => {
      try {
        const share = await sharingAPI.createShare({
          resource_type: resourceType,
          resource_id: resourceId,
          permission,
          is_public: true,
        });
        setShares((prev) => [share, ...prev]);
        return share;
      } catch (err: any) {
        const message = err.response?.data?.detail || err.message || 'Failed to create share';
        setError(message);
        return null;
      }
    },
    []
  );

  const updateShare = useCallback(async (shareId: string, payload: { permission?: 'view' | 'download' | 'edit'; expires_in_days?: number; is_active?: boolean; }) => {
    try {
      const updated = await sharingAPI.updateShare(shareId, payload);
      setShares((prev) => prev.map((share) => (share.id === shareId ? { ...share, ...updated } : share)));
      return updated;
    } catch (err: any) {
      const message = err.response?.data?.detail || err.message || 'Failed to update share';
      setError(message);
      return null;
    }
  }, []);

  const revokeShare = useCallback(async (shareId: string) => {
    try {
      await sharingAPI.revokeShare(shareId);
      setShares((prev) => prev.map((share) => (share.id === shareId ? { ...share, is_active: false } : share)));
      return true;
    } catch (err: any) {
      const message = err.response?.data?.detail || err.message || 'Failed to revoke share';
      setError(message);
      return false;
    }
  }, []);

  return {
    shares,
    isLoading,
    error,
    fetchShares,
    createShare,
    updateShare,
    revokeShare,
  };
};
