import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { getBanners } from '../../api/endpoints';
import { BannerSkeleton } from '../ui/Skeleton';
import { clsx } from 'clsx';

export function BannerCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const { data: banners, isLoading } = useQuery({
    queryKey: ['banners'],
    queryFn: getBanners,
  });

  const nextSlide = useCallback(() => {
    if (!banners?.length) return;
    setCurrentIndex((prev) => (prev + 1) % banners.length);
  }, [banners?.length]);

  const prevSlide = () => {
    if (!banners?.length) return;
    setCurrentIndex((prev) => (prev - 1 + banners.length) % banners.length);
  };

  useEffect(() => {
    const timer = setInterval(nextSlide, 5000);
    return () => clearInterval(timer);
  }, [nextSlide]);

  if (isLoading) return <BannerSkeleton />;
  if (!banners?.length) return null;

  return (
    <div className="relative">
      <div className="relative overflow-hidden rounded-xl">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
          >
            <Link to={banners[currentIndex].link}>
              <div
                className="relative h-32 md:h-40 rounded-xl overflow-hidden"
                style={{ backgroundColor: banners[currentIndex].bgColor }}
              >
                <img
                  src={banners[currentIndex].image}
                  alt={banners[currentIndex].title}
                  className="absolute right-0 top-0 h-full w-2/3 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-transparent" />
                <div className="absolute inset-0 flex flex-col justify-center p-6">
                  <h3 className="text-xl md:text-2xl font-bold text-white mb-1">
                    {banners[currentIndex].title}
                  </h3>
                  <p className="text-sm md:text-base text-white/90">
                    {banners[currentIndex].subtitle}
                  </p>
                </div>
              </div>
            </Link>
          </motion.div>
        </AnimatePresence>

        <button
          onClick={prevSlide}
          className="absolute left-2 top-1/2 -translate-y-1/2 p-1.5 bg-white/80 hover:bg-white rounded-full shadow-lg transition-colors hidden md:block"
        >
          <ChevronLeft className="w-5 h-5 text-gray-700" />
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 bg-white/80 hover:bg-white rounded-full shadow-lg transition-colors hidden md:block"
        >
          <ChevronRight className="w-5 h-5 text-gray-700" />
        </button>
      </div>

      <div className="flex justify-center gap-2 mt-3">
        {banners.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={clsx(
              'w-2 h-2 rounded-full transition-all',
              index === currentIndex
                ? 'w-6 bg-violet-600'
                : 'bg-gray-300 hover:bg-gray-400'
            )}
          />
        ))}
      </div>
    </div>
  );
}
