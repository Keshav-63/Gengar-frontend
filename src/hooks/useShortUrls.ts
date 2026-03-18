import { useCallback, useState } from 'react';
import * as shortUrlsAPI from '../api/shortUrls';
import { ShortURLResponse } from '../types';

interface ShortUrlStats {
  short_code: string;
  click_count: number;
  created_at: string;
  last_accessed?: string;
  is_active: boolean;
}

export const useShortUrls = () => {
  const [shortUrls, setShortUrls] = useState<ShortURLResponse[]>([]);
  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchShortUrls = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await shortUrlsAPI.getShortURLs();
      const list = Array.isArray(response?.short_urls) ? response.short_urls : [];
      setShortUrls(list);
      return list;
    } catch (err: any) {
      const message = err.response?.data?.detail || err.message || 'Failed to fetch short URLs';
      setError(message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const createShortUrl = useCallback(async (shareId: string, expiresInDays?: number) => {
    try {
      const shortUrl = await shortUrlsAPI.createShortURL({
        share_id: shareId,
        expires_in_days: expiresInDays,
      });
      setShortUrls((prev) => [shortUrl, ...prev]);
      return shortUrl;
    } catch (err: any) {
      const message = err.response?.data?.detail || err.message || 'Failed to create short URL';
      setError(message);
      return null;
    }
  }, []);

  const fetchShortUrlStats = useCallback(async (shortCode: string): Promise<ShortUrlStats | null> => {
    try {
      const response = await shortUrlsAPI.getShortURLStats(shortCode);
      return response;
    } catch (err: any) {
      const message = err.response?.data?.detail || err.message || 'Failed to fetch short URL stats';
      setError(message);
      return null;
    }
  }, []);

  const deleteShortUrl = useCallback(async (shortCode: string) => {
    try {
      await shortUrlsAPI.deleteShortURL(shortCode);
      setShortUrls((prev) => prev.filter((url) => url.short_code !== shortCode));
      return true;
    } catch (err: any) {
      const message = err.response?.data?.detail || err.message || 'Failed to delete short URL';
      setError(message);
      return false;
    }
  }, []);

  return {
    shortUrls,
    isLoading,
    error,
    fetchShortUrls,
    createShortUrl,
    fetchShortUrlStats,
    deleteShortUrl,
  };
};
