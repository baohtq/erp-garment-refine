import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { WebsiteBanner } from '../types';
import { cn } from '@/lib/utils';

interface BannerProps {
  banners: WebsiteBanner[];
  autoSlide?: boolean;
  autoSlideInterval?: number;
  className?: string;
}

export const Banner = ({
  banners,
  autoSlide = true,
  autoSlideInterval = 5000,
  className
}: BannerProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const prevSlide = () => {
    setCurrentIndex((currentIndex) => 
      currentIndex === 0 ? banners.length - 1 : currentIndex - 1
    );
  };

  const nextSlide = () => {
    setCurrentIndex((currentIndex) => 
      currentIndex === banners.length - 1 ? 0 : currentIndex + 1
    );
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  useEffect(() => {
    if (!autoSlide || banners.length <= 1) return;

    const slideInterval = setInterval(nextSlide, autoSlideInterval);
    return () => clearInterval(slideInterval);
  }, [autoSlide, autoSlideInterval, banners.length]);

  if (!banners || banners.length === 0) {
    return null;
  }

  return (
    <div className={cn('relative w-full h-80 md:h-96 lg:h-[500px] overflow-hidden group', className)}>
      <div
        className="h-full flex transition-transform ease-out duration-500"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {banners.map((banner) => (
          <div key={banner.id} className="w-full h-full flex-shrink-0 relative">
            {banner.link ? (
              <Link href={banner.link}>
                <Image
                  src={banner.image_url}
                  alt={banner.title}
                  fill
                  className="object-cover"
                />
                {banner.description && (
                  <div className="absolute inset-0 flex items-end bg-gradient-to-t from-black/60 to-transparent">
                    <div className="p-4 md:p-6 text-white">
                      <h2 className="text-xl md:text-2xl font-bold">{banner.title}</h2>
                      <p className="mt-2 text-sm md:text-base">{banner.description}</p>
                    </div>
                  </div>
                )}
              </Link>
            ) : (
              <>
                <Image
                  src={banner.image_url}
                  alt={banner.title}
                  fill
                  className="object-cover"
                />
                {banner.description && (
                  <div className="absolute inset-0 flex items-end bg-gradient-to-t from-black/60 to-transparent">
                    <div className="p-4 md:p-6 text-white">
                      <h2 className="text-xl md:text-2xl font-bold">{banner.title}</h2>
                      <p className="mt-2 text-sm md:text-base">{banner.description}</p>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      {banners.length > 1 && (
        <>
          <button
            onClick={prevSlide}
            className="absolute top-1/2 left-2 -translate-y-1/2 w-10 h-10 bg-white/30 hover:bg-white/50 rounded-full flex items-center justify-center transition duration-300 opacity-0 group-hover:opacity-100"
            aria-label="Previous slide"
          >
            <ChevronLeft className="w-6 h-6 text-white" />
          </button>
          <button
            onClick={nextSlide}
            className="absolute top-1/2 right-2 -translate-y-1/2 w-10 h-10 bg-white/30 hover:bg-white/50 rounded-full flex items-center justify-center transition duration-300 opacity-0 group-hover:opacity-100"
            aria-label="Next slide"
          >
            <ChevronRight className="w-6 h-6 text-white" />
          </button>
        </>
      )}

      {/* Indicators */}
      {banners.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
          {banners.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={cn(
                'w-2.5 h-2.5 rounded-full transition-colors duration-300',
                currentIndex === index ? 'bg-white' : 'bg-white/50'
              )}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Banner; 