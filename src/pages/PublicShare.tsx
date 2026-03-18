import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getPublicShare } from '../api/sharing';
import { Button } from '../components/common/Button';
import './PublicShare.css';

interface PublicShareData {
  resource_type: string;
  resource_name: string;
  permission: string;
  download_url?: string;
  owner_name: string;
  created_at: string;
  expires_at?: string;
}

export const PublicShare = () => {
  const { accessToken } = useParams<{ accessToken: string }>();
  const [data, setData] = useState<PublicShareData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const run = async () => {
      if (!accessToken) {
        setError('Invalid access token');
        return;
      }

      try {
        const result = await getPublicShare(accessToken);
        setData(result);
      } catch {
        setError('Share link is invalid or expired');
      }
    };

    run();
  }, [accessToken]);

  if (error) {
    return <div className="public-share-page"><p>{error}</p></div>;
  }

  if (!data) {
    return <div className="public-share-page"><p>Loading share...</p></div>;
  }

  return (
    <div className="public-share-page">
      <article className="public-share-card">
        <h1>{data.resource_name}</h1>
        <p>Type: {data.resource_type}</p>
        <p>Permission: {data.permission}</p>
        <p>Owner: {data.owner_name}</p>
        {data.expires_at && <p>Expires: {new Date(data.expires_at).toLocaleString()}</p>}

        {data.download_url && (
          <Button onClick={() => window.open(data.download_url, '_blank', 'noopener,noreferrer')}>Download</Button>
        )}
      </article>
    </div>
  );
};
