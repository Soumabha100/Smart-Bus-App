import { type FC } from 'react';
import resultsBannerImg from '../../assets/Results-Page-Banner.webp';

interface RouteIllustrationProps {
  variant?: 'desktop' | 'mobile';
}

/**
 * Permanent full-bleed panoramic illustration (4000x1332, 3:1) used across all routes
 * on the Results Page header card. Right-anchored on desktop to fill the entire right side
 * while leaving clean #FEFDF7 cream-white breathing space on the left for route text.
 */
export const RouteIllustration: FC<RouteIllustrationProps> = ({ variant = 'desktop' }) => {
  if (variant === 'mobile') {
    return (
      <div
        className="sm:hidden relative w-full aspect-[3/1] min-h-[118px] bg-[#FEFDF7] overflow-hidden select-none pointer-events-none"
        aria-hidden="true"
      >
        <img
          src={resultsBannerImg}
          alt=""
          width={4000}
          height={1332}
          loading="eager"
          decoding="async"
          fetchPriority="high"
          className="w-full h-full object-cover object-[center_65%] transform-gpu"
        />
        <div
          className="absolute inset-x-0 bottom-0 h-8 pointer-events-none"
          style={{
            background:
              'linear-gradient(to top, #FEFDF7 0%, rgba(254, 253, 247, 0.7) 55%, rgba(254, 253, 247, 0) 100%)',
          }}
        />
      </div>
    );
  }

  return (
    <div
      className="hidden sm:block absolute inset-y-0 right-0 w-[62%] md:w-[64%] lg:w-[66%] xl:w-[64%] overflow-hidden select-none pointer-events-none"
      aria-hidden="true"
    >
      <img
        src={resultsBannerImg}
        alt=""
        width={4000}
        height={1332}
        loading="eager"
        decoding="async"
        fetchPriority="high"
        className="w-full h-full object-cover object-[right_68%] transform-gpu"
      />
      {/* Seamless left feather into #FEFDF7 header canvas so route text stays 100% clear */}
      <div
        className="absolute inset-y-0 left-0 w-[34%] pointer-events-none"
        style={{
          background:
            'linear-gradient(to right, #FEFDF7 0%, rgba(254, 253, 247, 0.92) 42%, rgba(254, 253, 247, 0) 100%)',
        }}
      />
      {/* Subtle right scrim behind frosted Edit search button for high legibility */}
      <div
        className="absolute inset-y-0 right-0 w-[18%] pointer-events-none"
        style={{
          background:
            'linear-gradient(to left, rgba(254, 253, 247, 0.45) 0%, rgba(254, 253, 247, 0) 100%)',
        }}
      />
    </div>
  );
};
