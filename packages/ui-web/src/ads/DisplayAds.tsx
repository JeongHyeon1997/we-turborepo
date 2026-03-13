import { useEffect } from 'react';

declare global {
  interface Window {
    adsbygoogle: { push: (params: object) => void }[];
  }
}

interface DisplayAdsProps {
  slot: string;
  client?: string;
  format?: string;
  fullWidthResponsive?: boolean;
}

export function DisplayAds({
  slot,
  client = 'ca-pub-5362531643629275',
  format = 'auto',
  fullWidthResponsive = true,
}: DisplayAdsProps) {
  useEffect(() => {
    const interval = setInterval(() => {
      if (window.adsbygoogle) {
        try {
          window.adsbygoogle.push({});
        } catch (e) {
          console.error(e);
        }
        clearInterval(interval);
      }
    }, 300);

    return () => clearInterval(interval);
  }, []);

  return (
    <ins
      className="adsbygoogle"
      style={{ display: 'block' }}
      data-ad-client={client}
      data-ad-slot={slot}
      data-ad-format={format}
      data-full-width-responsive={String(fullWidthResponsive)}
    />
  );
}
