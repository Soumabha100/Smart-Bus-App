import kolkataBannerImg from '../assets/kolkata-profile-banner.webp';

let decodedPromise: Promise<void> | null = null;

/**
 * Pre-fetches and decodes the 8000x2664 Kolkata heritage banner WebP once
 * so ProfilePage and SignOutModal paint instantaneously without decode jank.
 */
export function preloadKolkataBanner(): Promise<void> {
  if (typeof window === 'undefined') return Promise.resolve();
  if (!decodedPromise) {
    decodedPromise = new Promise((resolve) => {
      const img = new Image();
      img.decoding = 'async';
      img.src = kolkataBannerImg;
      if (typeof img.decode === 'function') {
        img.decode().then(resolve).catch(resolve);
      } else {
        img.onload = () => resolve();
        img.onerror = () => resolve();
      }
    });
  }
  return decodedPromise;
}

export { kolkataBannerImg };
